import { Router, Request, Response } from 'express';
import { db } from './db.ts';
import { User, EnergyAsset, EnergyOffer, Transaction, SupportTicket, DigitalContract } from '../types/index.ts';

export const apiRouter = Router();

// Helper to extract auth user from header
function getAuthUser(req: Request): User | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default fallback to first prosumer demo user for ease if header omitted in dev
    return db.users[0];
  }
  const token = authHeader.replace('Bearer ', '').trim();
  // We can pass user ID in token for lightweight simulation
  const user = db.findUserById(token) || db.findUserByEmail(token);
  return user || db.users[0];
}

// ==================== AUTH ROUTES ====================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, role, password } = req.body;
  
  if (role) {
    // Quick demo login by role
    const demoUser = db.users.find(u => u.role === role);
    if (demoUser) {
      return res.json({ token: demoUser.id, user: demoUser });
    }
  }

  if (!email && !role) {
    return res.status(400).json({ error: 'Email or role is required' });
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  let user = cleanEmail ? db.findUserByEmail(cleanEmail) : undefined;
  
  if (!user && cleanEmail) {
    // Also check phone or partial match
    user = db.users.find(u => u.phone === cleanEmail || u.email.toLowerCase() === cleanEmail);
  }

  if (!user && cleanEmail) {
    // Auto-create user account seamlessly for any entered email or social login
    const displayName = cleanEmail.includes('@')
      ? cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      : 'PowerGridX Participant';
    
    user = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: displayName,
      role: (role as any) || 'PROSUMER',
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      location: 'Local Feeder Grid',
      region: 'Region A — North Grid',
      verificationStatus: 'VERIFIED',
      walletBalance: 2500.00,
      pendingSettlement: 0,
      createdAt: new Date().toISOString(),
      hasSolarAsset: true,
    };
    db.users.push(user);

    // Also auto-provision a rooftop solar asset for them so prosumer dashboards are active immediately
    db.assets.push({
      id: `ast-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      name: `${user.name}'s Rooftop Solar`,
      sourceType: 'SOLAR',
      capacityKw: 5.0,
      location: user.location,
      region: user.region,
      meterId: `MTR-SM-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationStatus: 'VERIFIED',
      status: 'CONNECTED',
      currentGenerationKw: 3.8,
      todayGenerationKwh: 12.4,
      homeConsumptionKwh: 7.1,
      surplusKwh: 5.3,
      isRenewable: true,
      createdAt: new Date().toISOString(),
    });
  }

  if (!user) {
    // Fallback to first prosumer demo user
    user = db.users[0];
  }

  res.json({ token: user.id, user });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, role, phone, location, region, assetName, capacityKw, sourceType } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'A user with this email already exists' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    name,
    role: role as User['role'],
    phone: phone || '+91 90000 00000',
    location: location || 'Sector 15, Green City',
    region: region || 'Region A — North Grid',
    verificationStatus: 'VERIFIED', // auto verify for seamless demo experience
    walletBalance: role === 'CONSUMER' ? 10000 : 2500,
    pendingSettlement: 0,
    createdAt: new Date().toISOString(),
    hasSolarAsset: role === 'PROSUMER' || role === 'PRODUCER',
  };

  db.addUser(newUser);

  // If prosumer or producer added an initial asset
  if ((role === 'PROSUMER' || role === 'PRODUCER') && capacityKw) {
    const newAsset: EnergyAsset = {
      id: `ast-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      name: assetName || (role === 'PROSUMER' ? 'My Rooftop Solar' : 'Commercial Solar Plant'),
      sourceType: sourceType || 'SOLAR',
      capacityKw: Number(capacityKw),
      location: newUser.location,
      region: newUser.region,
      meterId: `MTR-SM-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationStatus: 'VERIFIED',
      status: 'CONNECTED',
      currentGenerationKw: Number((Number(capacityKw) * 0.75).toFixed(1)),
      todayGenerationKwh: Number((Number(capacityKw) * 2.5).toFixed(1)),
      homeConsumptionKwh: role === 'PROSUMER' ? 6.5 : 120,
      surplusKwh: Number(Math.max(0, (Number(capacityKw) * 2.5) - (role === 'PROSUMER' ? 6.5 : 120)).toFixed(1)),
      isRenewable: true,
      createdAt: new Date().toISOString(),
    };
    db.addAsset(newAsset);
  }

  res.status(201).json({ token: newUser.id, user: newUser });
});

apiRouter.get('/users/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(user);
});

// Role upgrade: Consumer adds solar asset -> becomes Prosumer on the SAME account
apiRouter.post('/users/upgrade-to-prosumer', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { assetName, capacityKw, sourceType } = req.body;
  user.role = 'PROSUMER';
  user.hasSolarAsset = true;

  const newAsset: EnergyAsset = {
    id: `ast-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    name: assetName || 'Rooftop Solar Array',
    sourceType: sourceType || 'SOLAR',
    capacityKw: Number(capacityKw || 5),
    location: user.location,
    region: user.region,
    meterId: `MTR-SM-${Math.floor(1000 + Math.random() * 9000)}`,
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 3.5,
    todayGenerationKwh: 10.5,
    homeConsumptionKwh: 6.2,
    surplusKwh: 4.3,
    isRenewable: true,
    createdAt: new Date().toISOString(),
  };

  db.addAsset(newAsset);
  db.addAuditLog(user.id, user.name, 'ACCOUNT_UPGRADE', 'Upgraded account from Consumer to Prosumer with rooftop solar asset.');

  res.json({ success: true, user, asset: newAsset });
});

// ==================== ASSETS & METERS ====================
apiRouter.get('/assets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user && (user.role === 'ADMIN' || user.role === 'GRID_OPERATOR')) {
    return res.json(db.assets);
  }
  const userAssets = user ? db.getUserAssets(user.id) : [];
  res.json(userAssets);
});

apiRouter.post('/assets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, sourceType, capacityKw, location, region } = req.body;
  if (!name || !capacityKw) {
    return res.status(400).json({ error: 'Asset name and capacity are required' });
  }

  const cap = Number(capacityKw);
  const todayGen = Number((cap * 2.4).toFixed(1));
  const homeCons = user.role === 'PROSUMER' ? 7.0 : 150;
  const surplus = Math.max(0, Number((todayGen - homeCons).toFixed(1)));

  const asset: EnergyAsset = {
    id: `ast-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    name,
    sourceType: sourceType || 'SOLAR',
    capacityKw: cap,
    location: location || user.location,
    region: region || user.region,
    meterId: `MTR-SM-${Math.floor(2000 + Math.random() * 8000)}`,
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: Number((cap * 0.7).toFixed(1)),
    todayGenerationKwh: todayGen,
    homeConsumptionKwh: homeCons,
    surplusKwh: surplus,
    isRenewable: ['SOLAR', 'WIND', 'HYDRO', 'BIOMASS'].includes(sourceType),
    createdAt: new Date().toISOString(),
  };

  db.addAsset(asset);
  res.status(201).json(asset);
});

apiRouter.get('/meters/readings', (req: Request, res: Response) => {
  res.json(db.meterReadings);
});

// ==================== MARKETPLACE OFFERS ====================
apiRouter.get('/offers', (req: Request, res: Response) => {
  const { source, role, maxPrice, minKwh, region, greenOnly } = req.query;
  let list = db.getActiveOffers();

  if (source && source !== 'ALL') {
    list = list.filter(o => o.sourceType === source);
  }
  if (role && role !== 'ALL') {
    list = list.filter(o => o.sellerRole === role);
  }
  if (maxPrice) {
    list = list.filter(o => o.pricePerKwh <= Number(maxPrice));
  }
  if (minKwh) {
    list = list.filter(o => o.availableKwh >= Number(minKwh));
  }
  if (region && region !== 'ALL') {
    list = list.filter(o => o.region.includes(String(region)));
  }
  if (greenOnly === 'true') {
    list = list.filter(o => o.isRenewable);
  }

  res.json(list);
});

apiRouter.post('/offers', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { assetId, quantityKwh, pricePerKwh, startTime, endTime, pricingType } = req.body;
  const asset = db.assets.find(a => a.id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Energy asset not found' });
  }

  const offerQty = Number(quantityKwh);
  if (offerQty <= 0) {
    return res.status(400).json({ error: 'Offer quantity must be greater than 0' });
  }

  // Strictly enforce surplus rule for prosumers: cannot list more than available surplus
  if (user.role === 'PROSUMER' && offerQty > asset.surplusKwh) {
    return res.status(400).json({
      error: `Cannot list ${offerQty} kWh. Maximum eligible surplus for ${asset.name} is ${asset.surplusKwh} kWh.`
    });
  }

  const newOffer: EnergyOffer = {
    id: `off-${Date.now()}`,
    sellerId: user.id,
    sellerName: user.name,
    sellerRole: user.role === 'PROSUMER' ? 'PROSUMER' : 'PRODUCER',
    assetId: asset.id,
    assetName: asset.name,
    sourceType: asset.sourceType,
    quantityKwh: offerQty,
    availableKwh: offerQty,
    pricePerKwh: Number(pricePerKwh),
    startTime: startTime || '12:00',
    endTime: endTime || '17:00',
    pricingType: pricingType || 'FIXED',
    region: asset.region,
    status: 'ACTIVE',
    isRenewable: asset.isRenewable,
    estimatedCo2SavedKg: Number((offerQty * 0.82).toFixed(1)),
    createdAt: new Date().toISOString(),
  };

  db.addOffer(newOffer);
  res.status(201).json(newOffer);
});

// ==================== SMART MATCHING & BUYING ====================
apiRouter.post('/matching/run', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { requiredKwh, maxPricePerKwh, preferredSource, region } = req.body;

  if (!requiredKwh || requiredKwh <= 0) {
    return res.status(400).json({ error: 'Required energy quantity in kWh is required' });
  }

  const result = db.runSmartMatch(
    user ? user.id : 'anonymous',
    user ? user.name : 'Consumer',
    Number(requiredKwh),
    Number(maxPricePerKwh || 10),
    preferredSource,
    region
  );

  res.json(result);
});

// Execute transaction (from instant buy or smart match confirmation)
apiRouter.post('/transactions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { offerId, energyKwh, matchedAllocations } = req.body;
  const createdTransactions: Transaction[] = [];

  if (matchedAllocations && Array.isArray(matchedAllocations) && matchedAllocations.length > 0) {
    // Multi-party smart match settlement
    for (const alloc of matchedAllocations) {
      const targetOffer = db.offers.find(o => o.id === alloc.offerId);
      const kwh = Number(alloc.allocatedKwh);
      const price = Number(alloc.pricePerKwh);
      const gross = Number((kwh * price).toFixed(2));
      const platformFee = Number((gross * 0.03).toFixed(2)); // 3%
      const gridCharges = Number((gross * 0.02).toFixed(2)); // 2% wheeling
      const netSeller = Number((gross - platformFee - gridCharges).toFixed(2));

      const tx: Transaction = {
        id: `PGX-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        sellerId: alloc.sellerId,
        sellerName: alloc.sellerName,
        sellerRole: alloc.sellerRole,
        buyerId: user.id,
        buyerName: user.name,
        offerId: alloc.offerId,
        energyKwh: kwh,
        sourceType: alloc.sourceType,
        pricePerKwh: price,
        grossAmount: gross,
        platformFee,
        gridCharges,
        netSellerAmount: netSeller,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        meterVerification: 'VERIFIED',
        settlementStatus: 'COMPLETED',
        region: alloc.region,
      };

      if (targetOffer) {
        targetOffer.availableKwh = Math.max(0, targetOffer.availableKwh - kwh);
        if (targetOffer.availableKwh === 0) {
          targetOffer.status = 'MATCHED';
        }
      }

      db.addTransaction(tx);
      createdTransactions.push(tx);

      // Create notification for seller
      db.notifications.unshift({
        id: `ntf-${Date.now()}-${Math.random()}`,
        userId: alloc.sellerId,
        title: 'Electricity Sold & Settled',
        message: `${kwh} kWh of your ${alloc.sourceType} surplus was bought by ${user.name}. Net earnings: ₹${netSeller}`,
        type: 'SETTLEMENT',
        read: false,
        timestamp: 'Just now',
      });
    }
  } else if (offerId) {
    // Single offer direct purchase
    const targetOffer = db.offers.find(o => o.id === offerId);
    if (!targetOffer) return res.status(404).json({ error: 'Offer not found' });

    const buyKwh = Number(energyKwh || targetOffer.availableKwh);
    if (buyKwh <= 0 || buyKwh > targetOffer.availableKwh) {
      return res.status(400).json({ error: `Requested kWh (${buyKwh}) exceeds available amount (${targetOffer.availableKwh} kWh)` });
    }

    const price = targetOffer.pricePerKwh;
    const gross = Number((buyKwh * price).toFixed(2));
    const platformFee = Number((gross * 0.03).toFixed(2));
    const gridCharges = Number((gross * 0.02).toFixed(2));
    const netSeller = Number((gross - platformFee - gridCharges).toFixed(2));

    const tx: Transaction = {
      id: `PGX-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      sellerId: targetOffer.sellerId,
      sellerName: targetOffer.sellerName,
      sellerRole: targetOffer.sellerRole,
      buyerId: user.id,
      buyerName: user.name,
      offerId: targetOffer.id,
      energyKwh: buyKwh,
      sourceType: targetOffer.sourceType,
      pricePerKwh: price,
      grossAmount: gross,
      platformFee,
      gridCharges,
      netSellerAmount: netSeller,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      meterVerification: 'VERIFIED',
      settlementStatus: 'COMPLETED',
      region: targetOffer.region,
    };

    targetOffer.availableKwh = Math.max(0, targetOffer.availableKwh - buyKwh);
    if (targetOffer.availableKwh === 0) {
      targetOffer.status = 'MATCHED';
    }

    db.addTransaction(tx);
    createdTransactions.push(tx);

    // Notify seller
    db.notifications.unshift({
      id: `ntf-${Date.now()}`,
      userId: targetOffer.sellerId,
      title: 'Surplus Purchased via PowerGridX',
      message: `${buyKwh} kWh purchased by ${user.name}. Net credited: ₹${netSeller}`,
      type: 'SETTLEMENT',
      read: false,
      timestamp: 'Just now',
    });
  }

  // Notify buyer
  db.notifications.unshift({
    id: `ntf-b-${Date.now()}`,
    userId: user.id,
    title: 'Electricity Purchase Complete',
    message: `Successfully acquired clean energy through PowerGridX digital marketplace over the grid.`,
    type: 'TRANSACTION',
    read: false,
    timestamp: 'Just now',
  });

  res.status(201).json({ success: true, transactions: createdTransactions });
});

apiRouter.get('/transactions', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.json(db.transactions);

  if (user.role === 'ADMIN' || user.role === 'GRID_OPERATOR') {
    return res.json(db.transactions);
  }

  // Filter for seller or buyer
  const userTx = db.transactions.filter(t => t.sellerId === user.id || t.buyerId === user.id);
  res.json(userTx);
});

// ==================== CONTRACTS ====================
apiRouter.get('/contracts', (req: Request, res: Response) => {
  res.json(db.contracts);
});

apiRouter.post('/contracts', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { producerName, consumerName, energyMwhPerDay, durationDays, pricePerKwh, terms } = req.body;
  const contract: DigitalContract = {
    id: `cnt-${Date.now()}`,
    contractNumber: `PPA-PGX-${Math.floor(1000 + Math.random() * 9000)}`,
    producerId: user.role === 'PRODUCER' ? user.id : 'usr-producer-1',
    producerName: producerName || user.name,
    consumerId: user.role === 'CONSUMER' ? user.id : 'usr-consumer-1',
    consumerName: consumerName || 'Commercial Offtaker',
    energyMwhPerDay: Number(energyMwhPerDay || 5),
    durationDays: Number(durationDays || 30),
    pricePerKwh: Number(pricePerKwh || 3.90),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'ACTIVE',
    terms: terms || 'Standard PowerGridX Bilateral Virtual Power Purchase Agreement.',
  };

  db.contracts.unshift(contract);
  res.status(201).json(contract);
});

// ==================== WALLET & PAYMENTS ====================
apiRouter.post('/wallet/recharge', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid recharge amount' });
  }

  user.walletBalance = Number((user.walletBalance + amount).toFixed(2));
  
  db.notifications.unshift({
    id: `ntf-${Date.now()}`,
    userId: user.id,
    title: 'Wallet Recharged',
    message: `₹${amount.toFixed(2)} added to your PowerGridX energy wallet via simulated instant gateway.`,
    type: 'TRANSACTION',
    read: false,
    timestamp: 'Just now',
  });

  res.json({ success: true, walletBalance: user.walletBalance, user });
});

apiRouter.post('/wallet/withdraw', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const amount = Number(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }

  if (amount > user.walletBalance) {
    return res.status(400).json({ error: `Insufficient wallet balance (₹${user.walletBalance})` });
  }

  user.walletBalance = Number((user.walletBalance - amount).toFixed(2));

  db.notifications.unshift({
    id: `ntf-${Date.now()}`,
    userId: user.id,
    title: 'Withdrawal Processed',
    message: `₹${amount.toFixed(2)} transferred to your registered settlement bank account.`,
    type: 'SETTLEMENT',
    read: false,
    timestamp: 'Just now',
  });

  res.json({ success: true, walletBalance: user.walletBalance, user });
});

// ==================== GRID TELEMETRY & MAP ====================
apiRouter.get('/grid/status', (req: Request, res: Response) => {
  // Add subtle realistic fluctuations for simulated telemetry
  const jitterFreq = Number((50.0 + (Math.sin(Date.now() / 10000) * 0.04)).toFixed(2));
  const jitterVolt = Number((231.0 + (Math.cos(Date.now() / 8000) * 1.5)).toFixed(1));

  res.json({
    ...db.gridStatus,
    frequencyHz: jitterFreq,
    voltageV: jitterVolt,
    timestamp: new Date().toISOString(),
    isSimulatedTelemetry: true,
  });
});

apiRouter.get('/grid/regions', (req: Request, res: Response) => {
  res.json(db.gridStatus.regions);
});

// ==================== AI ENERGY FORECAST ====================
apiRouter.get('/forecast', (req: Request, res: Response) => {
  const hours = [
    { time: '06:00', hour: 6, generationKwh: 0.1, consumptionKwh: 0.9, netSurplusKwh: 0, solarRadiationWm2: 80, gridDemandMw: 1850, indicativePrice: 4.80 },
    { time: '08:00', hour: 8, generationKwh: 1.2, consumptionKwh: 1.1, netSurplusKwh: 0.1, solarRadiationWm2: 320, gridDemandMw: 2200, indicativePrice: 4.50 },
    { time: '10:00', hour: 10, generationKwh: 2.8, consumptionKwh: 1.2, netSurplusKwh: 1.6, solarRadiationWm2: 650, gridDemandMw: 2400, indicativePrice: 4.20 },
    { time: '12:00', hour: 12, generationKwh: 4.1, consumptionKwh: 1.4, netSurplusKwh: 2.7, solarRadiationWm2: 890, gridDemandMw: 2350, indicativePrice: 3.90 },
    { time: '14:00', hour: 14, generationKwh: 3.7, consumptionKwh: 1.3, netSurplusKwh: 2.4, solarRadiationWm2: 780, gridDemandMw: 2450, indicativePrice: 4.10 },
    { time: '16:00', hour: 16, generationKwh: 2.1, consumptionKwh: 1.4, netSurplusKwh: 0.7, solarRadiationWm2: 430, gridDemandMw: 2600, indicativePrice: 4.60 },
    { time: '18:00', hour: 18, generationKwh: 0.4, consumptionKwh: 1.8, netSurplusKwh: 0, solarRadiationWm2: 90, gridDemandMw: 2750, indicativePrice: 5.10 },
    { time: '20:00', hour: 20, generationKwh: 0.0, consumptionKwh: 2.1, netSurplusKwh: 0, solarRadiationWm2: 0, gridDemandMw: 2650, indicativePrice: 5.20 },
  ];

  res.json({
    summary: 'Expected peak solar generation between 11:00 AM – 3:00 PM tomorrow. Forecast indicates high prosumer surplus availability.',
    forecastHours: hours,
    projectedDailySolarKwh: 14.4,
    recommendedSellingWindow: '12:00 PM – 4:00 PM',
    isAiForecastDemo: true,
  });
});

// ==================== AI ASSISTANT ====================
apiRouter.post('/ai-assistant', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const q = query.toLowerCase();
  let answer = '';

  if (user?.role === 'PROSUMER') {
    const assets = db.getUserAssets(user.id);
    const mainAsset = assets[0];
    const surplus = mainAsset ? mainAsset.surplusKwh : 5.3;
    const soldTx = db.transactions.filter(t => t.sellerId === user.id);
    const totalEarnings = soldTx.reduce((acc, t) => acc + t.netSellerAmount, 0);

    if (q.includes('surplus') || q.includes('generate')) {
      answer = `Today your rooftop solar system (${mainAsset?.name || 'Rooftop Solar'}) generated ${mainAsset?.todayGenerationKwh || 12.4} kWh. Your household consumed ${mainAsset?.homeConsumptionKwh || 7.1} kWh, yielding an eligible surplus of ${surplus} kWh available for marketplace listing.`;
    } else if (q.includes('sell') || q.includes('sold')) {
      answer = `You have sold ${soldTx.reduce((acc, t) => acc + t.energyKwh, 0).toFixed(1)} kWh through PowerGridX today across ${soldTx.length} completed transactions. All units were verified via your smart meter MTR-SM-9021.`;
    } else if (q.includes('earning') || q.includes('money') || q.includes('wallet')) {
      answer = `Your total settled earnings stand at ₹${totalEarnings.toFixed(2)}, with a current wallet balance of ₹${user.walletBalance.toFixed(2)} and ₹${user.pendingSettlement} pending final daily batch settlement.`;
    } else {
      answer = `Based on your prosumer telemetry, tomorrow's AI forecast predicts high solar irradiance from 11:00 AM to 3:00 PM with approximately 5.8 to 6.4 kWh of surplus. You can pre-list this surplus now using the Sell Surplus wizard.`;
    }
  } else if (user?.role === 'CONSUMER') {
    const buyTx = db.transactions.filter(t => t.buyerId === user.id);
    const totalBoughtKwh = buyTx.reduce((acc, t) => acc + t.energyKwh, 0);

    if (q.includes('buy') || q.includes('purchase')) {
      answer = `You have purchased a total of ${totalBoughtKwh.toFixed(1)} kWh of clean renewable energy this month, avoiding an estimated ${(totalBoughtKwh * 0.82).toFixed(1)} kg of CO₂ emissions.`;
    } else if (q.includes('offer') || q.includes('renewable') || q.includes('solar')) {
      const activeGreen = db.offers.filter(o => o.status === 'ACTIVE' && o.isRenewable);
      answer = `There are currently ${activeGreen.length} active green energy offers available in the marketplace, ranging from ₹3.85/kWh (utility solar) to ₹4.50/kWh (local rooftop prosumers).`;
    } else {
      answer = `PowerGridX allows you to match your business demand with verified local rooftop solar prosumers and regional green generators. Use the 'Buy Electricity' flow to trigger the Smart Match Engine.`;
    }
  } else if (user?.role === 'PRODUCER') {
    if (q.includes('forecast') || q.includes('tomorrow')) {
      answer = `Tomorrow's generation model projects 82.5 MWh output with an average clearing price of ₹3.92/kWh during high demand blocks. Peak export capacity available at 13:00.`;
    } else {
      answer = `Your active contracts are currently dispatching at 98.4% scheduled compliance. 350 kWh is currently listed in the spot marketplace with active bids.`;
    }
  } else if (user?.role === 'GRID_OPERATOR') {
    answer = `System frequency is holding steady at ${db.gridStatus.frequencyHz} Hz. Region B (West Industrial) is experiencing high demand (78.5% capacity), while Region D (Metro) has a congestion advisory (88.4%). Renewable generation currently supplies 41.2% of active load.`;
  } else {
    answer = `PowerGridX Platform status: All 5 active nodes interconnected. Smart matching latency is <120ms. Total volume traded today: 1,850 kWh.`;
  }

  res.json({
    role: user?.role,
    query,
    answer,
    timestamp: new Date().toISOString(),
  });
});

// ==================== NOTIFICATIONS ====================
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.json(db.notifications);
  const userNotifs = db.notifications.filter(n => n.userId === user.id || n.userId === 'all');
  res.json(userNotifs);
});

apiRouter.post('/notifications/mark-read', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user) {
    db.notifications.forEach(n => {
      if (n.userId === user.id) n.read = true;
    });
  }
  res.json({ success: true });
});

// ==================== DISPUTES & SUPPORT ====================
apiRouter.get('/tickets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user?.role === 'ADMIN') return res.json(db.supportTickets);
  const myTickets = user ? db.supportTickets.filter(t => t.userId === user.id) : [];
  res.json(myTickets);
});

apiRouter.post('/tickets', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { category, subject, description, priority } = req.body;
  const ticket: SupportTicket = {
    id: `TCK-2026-${Math.floor(10 + Math.random() * 90)}`,
    userId: user.id,
    userName: user.name,
    category: category || 'OTHER',
    subject: subject || 'General Query',
    description: description || '',
    status: 'OPEN',
    priority: priority || 'MEDIUM',
    createdAt: new Date().toISOString(),
  };

  db.supportTickets.unshift(ticket);
  res.status(201).json(ticket);
});

// ==================== ADMIN API ====================
apiRouter.get('/admin/users', (req: Request, res: Response) => {
  res.json(db.users);
});

apiRouter.post('/admin/verify-asset', (req: Request, res: Response) => {
  const { assetId, status } = req.body;
  const asset = db.assets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  asset.verificationStatus = status === 'APPROVE' ? 'VERIFIED' : 'REJECTED';
  res.json({ success: true, asset });
});

apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  res.json(db.auditLogs);
});
