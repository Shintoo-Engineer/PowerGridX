import {
  User,
  EnergyAsset,
  MeterReading,
  EnergyOffer,
  EnergyRequest,
  Transaction,
  DigitalContract,
  GridRegion,
  GridSubstation,
  GridStatus,
  SupportTicket,
  AppNotification,
  AuditLog,
  ForecastItem,
  SmartMatchResult
} from '../types/index.ts';

// Pre-seeded realistic users
export const initialUsers: User[] = [
  {
    id: 'usr-prosumer-1',
    email: 'prosumer@powergridx.com',
    name: 'Demo Rooftop Home',
    role: 'PROSUMER',
    phone: '+91 98765 43210',
    location: 'Greenwood Colony, Sector 4',
    region: 'Region A — North Grid',
    verificationStatus: 'VERIFIED',
    walletBalance: 4850.50,
    pendingSettlement: 720.00,
    createdAt: '2026-01-15T08:00:00Z',
    hasSolarAsset: true,
  },
  {
    id: 'usr-producer-1',
    email: 'producer@powergridx.com',
    name: 'Demo Solar Farm (Helios Energy)',
    role: 'PRODUCER',
    phone: '+91 98234 56789',
    location: 'Sun Valley Renewable Corridor',
    region: 'Region B — West Industrial',
    verificationStatus: 'VERIFIED',
    walletBalance: 128450.00,
    pendingSettlement: 18200.00,
    createdAt: '2025-11-20T10:00:00Z',
    hasSolarAsset: true,
  },
  {
    id: 'usr-consumer-1',
    email: 'consumer@powergridx.com',
    name: 'Demo Commercial Building (Apex Hub)',
    role: 'CONSUMER',
    phone: '+91 98111 22334',
    location: 'Metro Tech Park, Tower B',
    region: 'Region A — North Grid',
    verificationStatus: 'VERIFIED',
    walletBalance: 15400.00,
    pendingSettlement: 0,
    createdAt: '2026-02-01T09:30:00Z',
    hasSolarAsset: false,
  },
  {
    id: 'usr-gridop-1',
    email: 'gridops@powergridx.com',
    name: 'State Grid Demo Operator',
    role: 'GRID_OPERATOR',
    phone: '+91 99000 11223',
    location: 'Central Regional Load Dispatch Center (RLDC)',
    region: 'All Grid Zones',
    verificationStatus: 'VERIFIED',
    walletBalance: 0,
    pendingSettlement: 0,
    createdAt: '2025-10-01T00:00:00Z',
    hasSolarAsset: false,
  },
  {
    id: 'usr-admin-1',
    email: 'admin@powergridx.com',
    name: 'PowerGridX Platform Administrator',
    role: 'ADMIN',
    phone: '+91 98888 77665',
    location: 'PowerGridX HQ Operations',
    region: 'System Core',
    verificationStatus: 'VERIFIED',
    walletBalance: 0,
    pendingSettlement: 0,
    createdAt: '2025-09-01T00:00:00Z',
    hasSolarAsset: false,
  }
];

// Pre-seeded assets
export const initialAssets: EnergyAsset[] = [
  {
    id: 'ast-solar-home-1',
    userId: 'usr-prosumer-1',
    userName: 'Demo Rooftop Home',
    name: 'My Rooftop Solar',
    sourceType: 'SOLAR',
    capacityKw: 5.0,
    location: 'Greenwood Colony, Sector 4',
    region: 'Region A — North Grid',
    meterId: 'MTR-SM-9021',
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 3.8,
    todayGenerationKwh: 12.4,
    homeConsumptionKwh: 7.1,
    surplusKwh: 5.3, // 12.4 - 7.1 = 5.3 kWh
    isRenewable: true,
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'ast-helios-solar-farm',
    userId: 'usr-producer-1',
    userName: 'Demo Solar Farm (Helios Energy)',
    name: 'Helios Solar Park Alpha',
    sourceType: 'SOLAR',
    capacityKw: 25000, // 25 MW
    location: 'Sun Valley Renewable Corridor',
    region: 'Region B — West Industrial',
    meterId: 'MTR-IND-5501',
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 18500,
    todayGenerationKwh: 78500,
    homeConsumptionKwh: 420,
    surplusKwh: 78080,
    isRenewable: true,
    createdAt: '2025-11-21T09:00:00Z',
  },
  {
    id: 'ast-wind-producer-2',
    userId: 'usr-producer-2',
    userName: 'AeroBreeze Wind Corp',
    name: 'Coastal Ridge Wind Farm 1',
    sourceType: 'WIND',
    capacityKw: 15000, // 15 MW
    location: 'Western Ghats Ridge',
    region: 'Region C — Coastal Corridor',
    meterId: 'MTR-WND-8822',
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 11200,
    todayGenerationKwh: 54000,
    homeConsumptionKwh: 150,
    surplusKwh: 53850,
    isRenewable: true,
    createdAt: '2025-12-05T11:00:00Z',
  },
  {
    id: 'ast-prosumer-rooftop-2',
    userId: 'usr-prosumer-2',
    userName: 'Anita Sharma (Villa Solar)',
    name: 'Rooftop Bifacial Array',
    sourceType: 'SOLAR',
    capacityKw: 8.0,
    location: 'Palm Meadows, Sector 12',
    region: 'Region A — North Grid',
    meterId: 'MTR-SM-9044',
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 5.6,
    todayGenerationKwh: 19.2,
    homeConsumptionKwh: 11.0,
    surplusKwh: 8.2,
    isRenewable: true,
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'ast-hydro-producer-3',
    userId: 'usr-producer-3',
    userName: 'Cauvery Small Hydro Ltd',
    name: 'River Run Mini Hydro',
    sourceType: 'HYDRO',
    capacityKw: 5000,
    location: 'Upstream Weir Section 3',
    region: 'Region C — Coastal Corridor',
    meterId: 'MTR-HYD-3312',
    verificationStatus: 'VERIFIED',
    status: 'CONNECTED',
    currentGenerationKw: 4200,
    todayGenerationKwh: 36000,
    homeConsumptionKwh: 80,
    surplusKwh: 35920,
    isRenewable: true,
    createdAt: '2025-10-15T08:00:00Z',
  }
];

// Pre-seeded marketplace offers
export const initialOffers: EnergyOffer[] = [
  {
    id: 'off-001',
    sellerId: 'usr-prosumer-1',
    sellerName: 'Demo Rooftop Home',
    sellerRole: 'PROSUMER',
    assetId: 'ast-solar-home-1',
    assetName: 'My Rooftop Solar',
    sourceType: 'SOLAR',
    quantityKwh: 3.5,
    availableKwh: 3.5,
    pricePerKwh: 4.50,
    startTime: '14:00',
    endTime: '17:00',
    pricingType: 'FIXED',
    region: 'Region A — North Grid',
    status: 'ACTIVE',
    isRenewable: true,
    estimatedCo2SavedKg: 2.8,
    createdAt: '2026-09-17T06:30:00Z',
  },
  {
    id: 'off-002',
    sellerId: 'usr-producer-1',
    sellerName: 'Solar Farm Alpha (Helios Energy)',
    sellerRole: 'PRODUCER',
    assetId: 'ast-helios-solar-farm',
    assetName: 'Helios Solar Park Alpha',
    sourceType: 'SOLAR',
    quantityKwh: 500,
    availableKwh: 350,
    pricePerKwh: 3.85,
    startTime: '12:00',
    endTime: '16:00',
    pricingType: 'SMART_MARKET',
    region: 'Region B — West Industrial',
    status: 'ACTIVE',
    isRenewable: true,
    estimatedCo2SavedKg: 410.0,
    createdAt: '2026-09-17T05:00:00Z',
  },
  {
    id: 'off-003',
    sellerId: 'usr-prosumer-2',
    sellerName: 'Anita Sharma (Villa Solar)',
    sellerRole: 'PROSUMER',
    assetId: 'ast-prosumer-rooftop-2',
    assetName: 'Rooftop Bifacial Array',
    sourceType: 'SOLAR',
    quantityKwh: 5.0,
    availableKwh: 5.0,
    pricePerKwh: 4.40,
    startTime: '13:00',
    endTime: '16:30',
    pricingType: 'FIXED',
    region: 'Region A — North Grid',
    status: 'ACTIVE',
    isRenewable: true,
    estimatedCo2SavedKg: 4.0,
    createdAt: '2026-09-17T07:15:00Z',
  },
  {
    id: 'off-004',
    sellerId: 'usr-producer-2',
    sellerName: 'AeroBreeze Wind Corp',
    sellerRole: 'PRODUCER',
    assetId: 'ast-wind-producer-2',
    assetName: 'Coastal Ridge Wind Farm 1',
    sourceType: 'WIND',
    quantityKwh: 1200,
    availableKwh: 1200,
    pricePerKwh: 4.10,
    startTime: '00:00',
    endTime: '23:59',
    pricingType: 'FIXED',
    region: 'Region C — Coastal Corridor',
    status: 'ACTIVE',
    isRenewable: true,
    estimatedCo2SavedKg: 980.0,
    createdAt: '2026-09-17T04:00:00Z',
  },
  {
    id: 'off-005',
    sellerId: 'usr-producer-3',
    sellerName: 'Cauvery Small Hydro Ltd',
    sellerRole: 'PRODUCER',
    assetId: 'ast-hydro-producer-3',
    assetName: 'River Run Mini Hydro',
    sourceType: 'HYDRO',
    quantityKwh: 450,
    availableKwh: 450,
    pricePerKwh: 4.25,
    startTime: '06:00',
    endTime: '22:00',
    pricingType: 'SMART_MARKET',
    region: 'Region C — Coastal Corridor',
    status: 'ACTIVE',
    isRenewable: true,
    estimatedCo2SavedKg: 360.0,
    createdAt: '2026-09-17T05:30:00Z',
  }
];

// Pre-seeded transactions
export const initialTransactions: Transaction[] = [
  {
    id: 'PGX-2026-000101',
    sellerId: 'usr-prosumer-1',
    sellerName: 'Demo Rooftop Home',
    sellerRole: 'PROSUMER',
    buyerId: 'usr-consumer-1',
    buyerName: 'Demo Commercial Building',
    offerId: 'off-prev-1',
    energyKwh: 2.0,
    sourceType: 'SOLAR',
    pricePerKwh: 4.50,
    grossAmount: 9.00,
    platformFee: 0.27,
    gridCharges: 0.18,
    netSellerAmount: 8.55,
    timestamp: '2026-09-16T14:30:00Z',
    status: 'COMPLETED',
    meterVerification: 'VERIFIED',
    settlementStatus: 'COMPLETED',
    region: 'Region A — North Grid',
  },
  {
    id: 'PGX-2026-000102',
    sellerId: 'usr-producer-1',
    sellerName: 'Solar Farm Alpha (Helios Energy)',
    sellerRole: 'PRODUCER',
    buyerId: 'usr-consumer-1',
    buyerName: 'Demo Commercial Building',
    offerId: 'off-002',
    energyKwh: 150.0,
    sourceType: 'SOLAR',
    pricePerKwh: 3.85,
    grossAmount: 577.50,
    platformFee: 17.33,
    gridCharges: 11.55,
    netSellerAmount: 548.62,
    timestamp: '2026-09-17T07:00:00Z',
    status: 'COMPLETED',
    meterVerification: 'VERIFIED',
    settlementStatus: 'COMPLETED',
    region: 'Region B — West Industrial',
  },
  {
    id: 'PGX-2026-000103',
    sellerId: 'usr-prosumer-1',
    sellerName: 'Demo Rooftop Home',
    sellerRole: 'PROSUMER',
    buyerId: 'usr-consumer-2',
    buyerName: 'GreenLeaf Organic Cafe',
    offerId: 'off-prev-2',
    energyKwh: 1.5,
    sourceType: 'SOLAR',
    pricePerKwh: 4.60,
    grossAmount: 6.90,
    platformFee: 0.21,
    gridCharges: 0.14,
    netSellerAmount: 6.55,
    timestamp: '2026-09-16T11:00:00Z',
    status: 'COMPLETED',
    meterVerification: 'VERIFIED',
    settlementStatus: 'COMPLETED',
    region: 'Region A — North Grid',
  }
];

// Pre-seeded digital energy contracts
export const initialContracts: DigitalContract[] = [
  {
    id: 'cnt-2026-08',
    contractNumber: 'PPA-PGX-HELIOS-APEX-01',
    producerId: 'usr-producer-1',
    producerName: 'Demo Solar Farm (Helios Energy)',
    consumerId: 'usr-consumer-1',
    consumerName: 'Demo Commercial Building (Apex Hub)',
    energyMwhPerDay: 10,
    durationDays: 30,
    pricePerKwh: 3.75,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'ACTIVE',
    terms: 'Bilateral virtual Power Purchase Agreement coordinated over PowerGridX. Subject to State ERC open-access regulations and wheeling loss allowances.',
  },
  {
    id: 'cnt-2026-09',
    contractNumber: 'PPA-PGX-AEROBREEZE-FAB-02',
    producerId: 'usr-producer-2',
    producerName: 'AeroBreeze Wind Corp',
    consumerId: 'usr-consumer-3',
    consumerName: 'Precision Engineering Plant',
    energyMwhPerDay: 15,
    durationDays: 60,
    pricePerKwh: 4.05,
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    status: 'ACTIVE',
    terms: 'Green open-access supply schedule via 66kV transmission feeder. Digital reconciliation daily.',
  }
];

// Grid status & regions
export const initialGridRegions: GridRegion[] = [
  {
    id: 'reg-north',
    name: 'Region A — North Grid (Residential & IT)',
    code: 'R-NORTH',
    status: 'NORMAL',
    currentDemandMw: 420.5,
    generationMw: 445.0,
    renewableGenerationMw: 185.0,
    capacityMw: 600.0,
    congestionPercent: 46.2,
    substationsCount: 14,
    coordinates: { x: 30, y: 35 },
  },
  {
    id: 'reg-west',
    name: 'Region B — West Industrial Zone',
    code: 'R-WEST',
    status: 'HIGH_DEMAND',
    currentDemandMw: 780.2,
    generationMw: 740.0,
    renewableGenerationMw: 320.0,
    capacityMw: 900.0,
    congestionPercent: 78.5,
    substationsCount: 22,
    coordinates: { x: 65, y: 40 },
  },
  {
    id: 'reg-coastal',
    name: 'Region C — Coastal Corridor & Renewable Belt',
    code: 'R-COASTAL',
    status: 'NORMAL',
    currentDemandMw: 310.0,
    generationMw: 460.0,
    renewableGenerationMw: 410.0,
    capacityMw: 550.0,
    congestionPercent: 38.0,
    substationsCount: 11,
    coordinates: { x: 45, y: 75 },
  },
  {
    id: 'reg-metro',
    name: 'Region D — Metro Core Feeder',
    code: 'R-METRO',
    status: 'CONGESTION_RISK',
    currentDemandMw: 890.0,
    generationMw: 820.0,
    renewableGenerationMw: 95.0,
    capacityMw: 950.0,
    congestionPercent: 88.4,
    substationsCount: 28,
    coordinates: { x: 20, y: 70 },
  }
];

export const initialSubstations: GridSubstation[] = [
  { id: 'sub-01', name: 'Substation North-01 (Greenwood 66kV)', regionId: 'reg-north', capacityMva: 100, loadPercent: 52, status: 'OPTIMAL', x: 28, y: 32 },
  { id: 'sub-02', name: 'Substation North-02 (TechPark 110kV)', regionId: 'reg-north', capacityMva: 150, loadPercent: 64, status: 'OPTIMAL', x: 35, y: 38 },
  { id: 'sub-03', name: 'Substation West-01 (Heavy Ind 220kV)', regionId: 'reg-west', capacityMva: 250, loadPercent: 82, status: 'LOADED', x: 62, y: 36 },
  { id: 'sub-04', name: 'Substation West-02 (Foundry Loop 110kV)', regionId: 'reg-west', capacityMva: 180, loadPercent: 79, status: 'LOADED', x: 72, y: 44 },
  { id: 'sub-05', name: 'Substation Coast-01 (Wind Junction 220kV)', regionId: 'reg-coastal', capacityMva: 200, loadPercent: 41, status: 'OPTIMAL', x: 42, y: 72 },
  { id: 'sub-06', name: 'Substation Metro-01 (Central Dispatch 220kV)', regionId: 'reg-metro', capacityMva: 300, loadPercent: 91, status: 'CRITICAL', x: 22, y: 68 },
];

export const initialGridStatus: GridStatus = {
  frequencyHz: 50.02,
  voltageV: 231.4,
  totalDemandMw: 2400.7,
  totalGenerationMw: 2465.0,
  renewableSharePercent: 41.2,
  availableCapacityMw: 600.0,
  timestamp: new Date().toISOString(),
  regions: initialGridRegions,
  substations: initialSubstations,
  isSimulatedTelemetry: true,
};

// Simulated smart meter readings history for prosumer
export const initialMeterReadings: MeterReading[] = [
  { id: 'mr-01', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '08:00', generationKwh: 1.2, consumptionKwh: 1.0, netSurplusKwh: 0.2, frequencyHz: 50.01, voltageV: 230.1, status: 'VERIFIED' },
  { id: 'mr-02', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '09:00', generationKwh: 2.1, consumptionKwh: 1.1, netSurplusKwh: 1.0, frequencyHz: 50.03, voltageV: 230.5, status: 'VERIFIED' },
  { id: 'mr-03', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '10:00', generationKwh: 3.2, consumptionKwh: 1.1, netSurplusKwh: 2.1, frequencyHz: 49.98, voltageV: 231.0, status: 'VERIFIED' },
  { id: 'mr-04', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '11:00', generationKwh: 4.0, consumptionKwh: 1.3, netSurplusKwh: 2.7, frequencyHz: 50.02, voltageV: 231.8, status: 'VERIFIED' },
  { id: 'mr-05', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '12:00', generationKwh: 4.6, consumptionKwh: 1.5, netSurplusKwh: 3.1, frequencyHz: 50.04, voltageV: 232.0, status: 'VERIFIED' },
  { id: 'mr-06', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '13:00', generationKwh: 4.4, consumptionKwh: 1.4, netSurplusKwh: 3.0, frequencyHz: 50.01, voltageV: 231.7, status: 'VERIFIED' },
  { id: 'mr-07', meterId: 'MTR-SM-9021', assetId: 'ast-solar-home-1', timestamp: '14:00', generationKwh: 3.8, consumptionKwh: 1.2, netSurplusKwh: 2.6, frequencyHz: 49.99, voltageV: 231.2, status: 'ONLINE' },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'ntf-1',
    userId: 'usr-prosumer-1',
    title: 'Surplus Offer Matched',
    message: 'Your 2.0 kWh rooftop solar surplus offer was matched with Demo Commercial Building.',
    type: 'MATCH',
    read: false,
    timestamp: '10 minutes ago',
  },
  {
    id: 'ntf-2',
    userId: 'usr-prosumer-1',
    title: 'Meter Verification Confirmed',
    message: 'Simulated smart meter MTR-SM-9021 reconciled 5.3 kWh net export for today.',
    type: 'VERIFICATION',
    read: false,
    timestamp: '1 hour ago',
  },
  {
    id: 'ntf-3',
    userId: 'usr-prosumer-1',
    title: 'AI Forecast: High Solar Tomorrow',
    message: 'Clear skies predicted from 10:00 AM to 3:00 PM. Anticipated surplus: ~6.2 kWh.',
    type: 'FORECAST',
    read: true,
    timestamp: '3 hours ago',
  },
  {
    id: 'ntf-4',
    userId: 'usr-consumer-1',
    title: 'Green Energy Transaction Settled',
    message: '150 kWh solar energy purchased from Solar Farm Alpha. Transaction PGX-2026-000102 settled.',
    type: 'SETTLEMENT',
    read: false,
    timestamp: '20 minutes ago',
  },
  {
    id: 'ntf-5',
    userId: 'usr-gridop-1',
    title: 'Grid Congestion Advisory',
    message: 'Region D Metro Core Feeder approaching 88% transmission threshold. Smart dispatch triggered.',
    type: 'ALERT',
    read: false,
    timestamp: '5 minutes ago',
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'TCK-2026-01',
    userId: 'usr-prosumer-1',
    userName: 'Demo Rooftop Home',
    category: 'METER',
    subject: 'Export reading sync latency',
    description: 'Interval reading for 13:00 took 4 minutes to reflect on the digital ledger.',
    status: 'IN_REVIEW',
    priority: 'LOW',
    adminResponse: 'Simulated telemetry polling interval adjusted to 30s. Resolution in progress.',
    createdAt: '2026-09-16T15:30:00Z',
  },
  {
    id: 'TCK-2026-02',
    userId: 'usr-producer-1',
    userName: 'Demo Solar Farm (Helios Energy)',
    category: 'VERIFICATION',
    subject: 'Capacity expansion filing for 5 MW inverter block',
    description: 'Adding 5 MW bifacial expansion to asset registration. Grid interconnection study attached.',
    status: 'OPEN',
    priority: 'MEDIUM',
    adminResponse: 'Under review by platform compliance desk.',
    createdAt: '2026-09-17T02:15:00Z',
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-01',
    userId: 'usr-prosumer-1',
    userName: 'Demo Rooftop Home',
    action: 'OFFER_CREATED',
    details: 'Created surplus offer #off-001 for 3.5 kWh @ ₹4.50/kWh',
    timestamp: '2026-09-17T06:30:00Z',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'log-02',
    userId: 'usr-consumer-1',
    userName: 'Demo Commercial Building',
    action: 'MATCH_CONFIRMED',
    details: 'Confirmed smart match for 150 kWh with Solar Farm Alpha',
    timestamp: '2026-09-17T07:00:00Z',
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-03',
    userId: 'usr-admin-1',
    userName: 'Platform Administrator',
    action: 'ASSET_VERIFIED',
    details: 'Verified meter interconnection for MTR-SM-9044',
    timestamp: '2026-09-16T18:00:00Z',
    ipAddress: '127.0.0.1',
  }
];

// In-Memory Database store singleton
class PowerGridXDatabase {
  public users: User[] = [...initialUsers];
  public assets: EnergyAsset[] = [...initialAssets];
  public offers: EnergyOffer[] = [...initialOffers];
  public transactions: Transaction[] = [...initialTransactions];
  public contracts: DigitalContract[] = [...initialContracts];
  public gridStatus: GridStatus = { ...initialGridStatus };
  public meterReadings: MeterReading[] = [...initialMeterReadings];
  public notifications: AppNotification[] = [...initialNotifications];
  public supportTickets: SupportTicket[] = [...initialSupportTickets];
  public auditLogs: AuditLog[] = [...initialAuditLogs];

  // Helper methods
  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  addUser(user: User): User {
    this.users.push(user);
    this.addAuditLog(user.id, user.name, 'USER_REGISTERED', `User registered with role ${user.role}`);
    return user;
  }

  getUserAssets(userId: string): EnergyAsset[] {
    return this.assets.filter(a => a.userId === userId);
  }

  addAsset(asset: EnergyAsset): EnergyAsset {
    this.assets.push(asset);
    this.addAuditLog(asset.userId, asset.userName, 'ASSET_REGISTERED', `Added ${asset.name} (${asset.sourceType} ${asset.capacityKw} kW)`);
    return asset;
  }

  getActiveOffers(): EnergyOffer[] {
    return this.offers.filter(o => o.status === 'ACTIVE');
  }

  addOffer(offer: EnergyOffer): EnergyOffer {
    this.offers.unshift(offer);
    this.addAuditLog(offer.sellerId, offer.sellerName, 'OFFER_CREATED', `Listed ${offer.quantityKwh} kWh at ₹${offer.pricePerKwh}/kWh`);
    return offer;
  }

  addTransaction(tx: Transaction): Transaction {
    this.transactions.unshift(tx);
    // update seller and buyer balances
    const seller = this.findUserById(tx.sellerId);
    if (seller) {
      seller.walletBalance += tx.netSellerAmount;
    }
    const buyer = this.findUserById(tx.buyerId);
    if (buyer) {
      buyer.walletBalance = Math.max(0, buyer.walletBalance - tx.grossAmount);
    }
    this.addAuditLog(tx.buyerId, tx.buyerName, 'TRANSACTION_SETTLED', `Settled ${tx.id} for ${tx.energyKwh} kWh (₹${tx.grossAmount})`);
    return tx;
  }

  addAuditLog(userId: string, userName: string, action: string, details: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });
  }

  // Smart matching engine
  runSmartMatch(
    buyerId: string,
    buyerName: string,
    requiredKwh: number,
    maxPricePerKwh: number,
    preferredSource?: string,
    preferredRegion?: string
  ): SmartMatchResult {
    let candidateOffers = this.offers.filter(o => o.status === 'ACTIVE' && o.availableKwh > 0 && o.sellerId !== buyerId);

    if (maxPricePerKwh > 0) {
      candidateOffers = candidateOffers.filter(o => o.pricePerKwh <= maxPricePerKwh);
    }
    if (preferredSource && preferredSource !== 'ANY') {
      if (preferredSource === 'ANY_RENEWABLE') {
        candidateOffers = candidateOffers.filter(o => o.isRenewable);
      } else {
        candidateOffers = candidateOffers.filter(o => o.sourceType === preferredSource);
      }
    }
    if (preferredRegion && preferredRegion !== 'ALL') {
      candidateOffers = candidateOffers.filter(o => o.region.includes(preferredRegion) || preferredRegion.includes(o.region));
    }

    // Sort: prosumers first for local community micro-trading priority, then lowest price
    candidateOffers.sort((a, b) => {
      if (a.sellerRole === 'PROSUMER' && b.sellerRole !== 'PROSUMER') return -1;
      if (b.sellerRole === 'PROSUMER' && a.sellerRole !== 'PROSUMER') return 1;
      return a.pricePerKwh - b.pricePerKwh;
    });

    let remainingNeeded = requiredKwh;
    let totalCost = 0;
    const allocations: SmartMatchResult['allocations'] = [];

    for (const offer of candidateOffers) {
      if (remainingNeeded <= 0) break;
      const takeKwh = Math.min(offer.availableKwh, remainingNeeded);
      const subtotal = takeKwh * offer.pricePerKwh;
      allocations.push({
        offerId: offer.id,
        sellerId: offer.sellerId,
        sellerName: offer.sellerName,
        sellerRole: offer.sellerRole,
        sourceType: offer.sourceType,
        allocatedKwh: Number(takeKwh.toFixed(2)),
        pricePerKwh: offer.pricePerKwh,
        subtotal: Number(subtotal.toFixed(2)),
        region: offer.region,
      });
      totalCost += subtotal;
      remainingNeeded -= takeKwh;
    }

    const totalMatchedKwh = requiredKwh - remainingNeeded;
    const averagePricePerKwh = totalMatchedKwh > 0 ? totalCost / totalMatchedKwh : 0;
    const co2SavedKg = Number((totalMatchedKwh * 0.82).toFixed(2));

    return {
      id: `sm-${Date.now()}`,
      totalRequestedKwh: requiredKwh,
      totalMatchedKwh: Number(totalMatchedKwh.toFixed(2)),
      averagePricePerKwh: Number(averagePricePerKwh.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      co2SavedKg,
      allocations,
      status: totalMatchedKwh >= requiredKwh ? 'OPTIMAL' : totalMatchedKwh > 0 ? 'PARTIAL' : 'UNAVAILABLE',
    };
  }
}

export const db = new PowerGridXDatabase();
