import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { EnergyOffer, SmartMatchResult } from '../../types/index.ts';
import {
  ShoppingBag,
  Filter,
  Sun,
  Zap,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowUpDown,
  Search,
  Layers,
  ChevronRight,
  Info,
  X,
  Plus
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const MarketplaceView: React.FC<Props> = ({ onNavigateTab }) => {
  const { user, refreshUserData } = useAuth();
  const [offers, setOffers] = useState<EnergyOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<EnergyOffer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'ALL' | 'PROSUMER' | 'PRODUCER'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'QTY_DESC'>('PRICE_ASC');
  const [searchQuery, setSearchQuery] = useState('');

  // Buy Dialog State
  const [selectedOfferForBuy, setSelectedOfferForBuy] = useState<EnergyOffer | null>(null);
  const [buyQuantityKwh, setBuyQuantityKwh] = useState<string>('3.0');
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccessMessage, setBuySuccessMessage] = useState<string | null>(null);
  const [buyErrorMessage, setBuyErrorMessage] = useState<string | null>(null);

  // Smart Matching Dialog State
  const [showSmartMatchModal, setShowSmartMatchModal] = useState(false);
  const [matchDemandKwh, setMatchDemandKwh] = useState<number>(300);
  const [matchRegion, setMatchRegion] = useState<string>('Region A — North Grid');
  const [matchResult, setMatchResult] = useState<SmartMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/offers');
      if (res.ok) {
        const data: EnergyOffer[] = await res.json();
        setOffers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...offers];

    if (sellerTypeFilter !== 'ALL') {
      result = result.filter(o => o.sellerRole === sellerTypeFilter);
    }
    if (sourceFilter !== 'ALL') {
      result = result.filter(o => o.sourceType === sourceFilter);
    }
    if (regionFilter !== 'ALL') {
      result = result.filter(o => o.region.includes(regionFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.sellerName.toLowerCase().includes(q) ||
        o.region.toLowerCase().includes(q) ||
        o.sourceType.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'PRICE_ASC') {
      result.sort((a, b) => a.pricePerKwh - b.pricePerKwh);
    } else if (sortOrder === 'PRICE_DESC') {
      result.sort((a, b) => b.pricePerKwh - a.pricePerKwh);
    } else if (sortOrder === 'QTY_DESC') {
      result.sort((a, b) => b.quantityKwh - a.quantityKwh);
    }

    setFilteredOffers(result);
  }, [offers, sellerTypeFilter, sourceFilter, regionFilter, sortOrder, searchQuery]);

  const handleOpenBuyDialog = (offer: EnergyOffer) => {
    setSelectedOfferForBuy(offer);
    setBuyQuantityKwh(String(Math.min(offer.quantityKwh, 3.0)));
    setBuySuccessMessage(null);
    setBuyErrorMessage(null);
  };

  const handleExecutePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForBuy || !user) return;

    setIsBuying(true);
    setBuyErrorMessage(null);
    try {
      const res = await fetch('/api/marketplace/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          offerId: selectedOfferForBuy.id,
          quantityKwh: Number(buyQuantityKwh),
        }),
      });

      if (res.ok) {
        const tx = await res.json();
        setBuySuccessMessage(`Contract confirmed! ${tx.energyKwh} kWh scheduled for delivery via meter.`);
        fetchOffers();
        refreshUserData();
      } else {
        const err = await res.json();
        setBuyErrorMessage(err.error || 'Failed to complete transaction.');
      }
    } catch (e) {
      setBuyErrorMessage('Network failure during checkout.');
    } finally {
      setIsBuying(false);
    }
  };

  const handleRunSmartMatch = async () => {
    setMatchLoading(true);
    try {
      const res = await fetch('/api/marketplace/smart-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiredKwh: matchDemandKwh,
          region: matchRegion,
        }),
      });
      if (res.ok) {
        setMatchResult(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatchLoading(false);
    }
  };

  // Cost estimates for buy dialog
  const buyQty = Number(buyQuantityKwh) || 0;
  const energyCost = selectedOfferForBuy ? buyQty * selectedOfferForBuy.pricePerKwh : 0;
  const gridDistributionCharge = Number((buyQty * 0.40).toFixed(2)); // estimated utility wheeling fee
  const totalEstimatedCost = Number((energyCost + gridDistributionCharge).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Banner with Smart Match CTA */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live Energy Exchange
            </span>
            <span className="text-xs text-slate-500 font-medium">
              • {filteredOffers.length} Verified Offers Available
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            PowerGridX Digital Electricity Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Buy clean surplus electricity directly from rooftop solar prosumers and regional renewable producers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setShowSmartMatchModal(true);
              handleRunSmartMatch();
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> RUN SMART MATCH
          </button>
        </div>
      </div>

      {/* Smart Match Teaser Feature Card (Section 18) */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-purple-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-700/50">
              Algorithm: Prosumer + Producer Bundle
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Need Bulk Power? Bundle Rooftop Solar with Regional Farms.
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Example: A commercial buyer needs <strong>300 kWh</strong>. Our Smart Matching Engine automatically bundles <strong>150 kWh from local prosumers</strong> with <strong>150 kWh from a utility solar farm</strong> in a single unified contract.
          </p>
        </div>
        <button
          onClick={() => {
            setShowSmartMatchModal(true);
            handleRunSmartMatch();
          }}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
        >
          Try Smart Matching Engine <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search seller, region, or source..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden transition-all"
            />
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
            >
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="QTY_DESC">Highest Quantity First</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Seller Type Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {(['ALL', 'PROSUMER', 'PRODUCER'] as const).map(role => (
              <button
                key={role}
                onClick={() => setSellerTypeFilter(role)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  sellerTypeFilter === role
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role === 'ALL' ? 'All Sellers' : role === 'PROSUMER' ? '🏠 Prosumers Only' : '⚡ Producers Only'}
              </button>
            ))}
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Sources</option>
            <option value="SOLAR">Solar PV</option>
            <option value="WIND">Wind</option>
            <option value="HYDRO">Hydro</option>
            <option value="BIOMASS">Biomass</option>
          </select>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Grid Regions</option>
            <option value="Region A">Region A (North)</option>
            <option value="Region B">Region B (West)</option>
            <option value="Region C">Region C (Coastal)</option>
            <option value="Region D">Region D (Metro)</option>
          </select>
        </div>
      </div>

      {/* Offer Cards Grid (Section 16) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map(offer => {
          const isProsumer = offer.sellerRole === 'PROSUMER';
          const isMyOwnOffer = user?.id === offer.sellerId;

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between transition-all hover:shadow-md ${
                isProsumer ? 'border-emerald-200/80' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Seller Badge & Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isProsumer
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isProsumer ? <Sun className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      {offer.sellerBadge || (isProsumer ? 'Verified Prosumer' : 'Independent Power Producer')}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">{offer.sellerName}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900 block leading-tight">
                      ₹{offer.pricePerKwh.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500">per kWh</span>
                  </div>
                </div>

                {/* Offer Details List */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Available Energy:</span>
                    <span className="font-bold text-slate-900">{offer.quantityKwh} kWh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Energy Source:</span>
                    <span className="font-semibold text-emerald-700">{offer.sourceType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Delivery Window:</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {offer.startTime} – {offer.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Grid Region:</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {offer.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-2 flex items-center gap-2">
                {isMyOwnOffer ? (
                  <span className="w-full text-center py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                    Your Listed Offer
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleOpenBuyDialog(offer)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      BUY NOW
                    </button>
                    <button
                      onClick={() => {
                        setShowSmartMatchModal(true);
                        setMatchDemandKwh(offer.quantityKwh);
                        handleRunSmartMatch();
                      }}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
                      title="Request bundle match with this offer"
                    >
                      REQUEST MATCH
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BUY NOW DIALOG (Section 17) */}
      {selectedOfferForBuy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Purchase Surplus Electricity</h3>
              </div>
              <button
                onClick={() => setSelectedOfferForBuy(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {buySuccessMessage ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Order Confirmed</h4>
                <p className="text-xs text-slate-600">{buySuccessMessage}</p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedOfferForBuy(null);
                      onNavigateTab('transactions');
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    View in Transactions
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecutePurchase} className="space-y-3.5">
                {/* Offer Summary */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seller:</span>
                    <span className="font-bold text-slate-900">{selectedOfferForBuy.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-semibold text-emerald-700">{selectedOfferForBuy.sourceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Listed Rate:</span>
                    <span className="font-bold text-slate-900">₹{selectedOfferForBuy.pricePerKwh}/kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available:</span>
                    <span className="font-bold text-slate-900">{selectedOfferForBuy.quantityKwh} kWh</span>
                  </div>
                </div>

                {buyErrorMessage && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {buyErrorMessage}
                  </div>
                )}

                {/* Enter Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Energy to Purchase (kWh)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max={selectedOfferForBuy.quantityKwh}
                    value={buyQuantityKwh}
                    onChange={e => setBuyQuantityKwh(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Price Breakdown Calculation */}
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-700 font-sans">
                    <span>Surplus Energy ({buyQty} kWh × ₹{selectedOfferForBuy.pricePerKwh}):</span>
                    <span>₹{energyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-sans">
                    <span>Grid Wheeling / Distribution (Est):</span>
                    <span>₹{gridDistributionCharge.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-emerald-200 pt-1.5 flex justify-between font-bold text-emerald-900 text-sm font-sans">
                    <span>Total Estimated Cost:</span>
                    <span>₹{totalEstimatedCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Mandatory Physical Delivery Note (Section 17) */}
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Confirmation Notice:</strong> Electricity will be delivered through the existing power grid to your registered meter. PowerGridX coordinates the digital contract and payment.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOfferForBuy(null)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBuying || buyQty <= 0}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs disabled:opacity-50"
                  >
                    {isBuying ? 'Confirming...' : 'CONFIRM PURCHASE'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SMART MATCHING ENGINE MODAL (Section 18) */}
      {showSmartMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">PowerGridX Smart Matching Engine</h3>
                  <p className="text-[11px] text-slate-500">Autonomous Prosumer + Producer Bundling</p>
                </div>
              </div>
              <button onClick={() => setShowSmartMatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Energy (kWh)</label>
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={matchDemandKwh}
                  onChange={e => setMatchDemandKwh(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grid Region</label>
                <select
                  value={matchRegion}
                  onChange={e => setMatchRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Region A — North Grid">Region A — North Grid</option>
                  <option value="Region B — West Industrial">Region B — West Industrial</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunSmartMatch}
              disabled={matchLoading}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mb-5"
            >
              {matchLoading ? 'Optimizing Grid Bundles...' : 'Recalculate Optimal Bundle'}
            </button>

            {matchResult && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900">Matched Clean Energy:</span>
                    <span className="text-sm font-extrabold text-purple-900">{matchResult.matchedKwh} / {matchResult.targetKwh} kWh</span>
                  </div>

                  {/* Bundled Sources List */}
                  <div className="space-y-2">
                    {matchResult.bundleItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-lg border border-purple-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                            {item.role === 'PROSUMER' ? <Sun className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.sellerName}</span>
                            <span className="text-[10px] text-slate-500 capitalize">{item.role.toLowerCase()} • {item.sourceType}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-slate-900">{item.allocatedKwh} kWh</span>
                          <span className="text-[10px] text-slate-500 block">@ ₹{item.pricePerKwh}/kWh</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-purple-200 pt-2 flex justify-between font-bold text-xs text-slate-900">
                    <span>Blended Clearing Price:</span>
                    <span className="text-emerald-700 font-extrabold text-sm">₹{matchResult.blendedPricePerKwh} / kWh</span>
                  </div>
                  <div className="flex justify-between text-xs text-emerald-800 font-semibold">
                    <span>Estimated Carbon Offset:</span>
                    <span>{matchResult.co2SavedKg} kg CO₂</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-1">Algorithmic Advantage:</strong>
                  1 single contract. Lower blended cost. Direct community support with utility baseload security.
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowSmartMatchModal(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowSmartMatchModal(false);
                      onNavigateTab('transactions');
                    }}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Execute Smart Contract
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
