import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { EnergyAsset, EnergyOffer, Transaction } from '../../types/index.ts';
import {
  Sun,
  Home,
  Zap,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Send,
  ShoppingBag,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Props {
  onNavigate: (tab: string) => void;
  onOpenSellWizard: () => void;
}

export const ProsumerDashboard: React.FC<Props> = ({ onNavigate, onOpenSellWizard }) => {
  const { user } = useAuth();
  const [asset, setAsset] = useState<EnergyAsset | null>(null);
  const [offers, setOffers] = useState<EnergyOffer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProsumerData();
  }, [user]);

  const fetchProsumerData = async () => {
    try {
      const [assetsRes, offersRes, txRes] = await Promise.all([
        fetch('/api/assets', { headers: user ? { 'Authorization': `Bearer ${user.id}` } : {} }),
        fetch('/api/offers', { headers: user ? { 'Authorization': `Bearer ${user.id}` } : {} }),
        fetch('/api/transactions', { headers: user ? { 'Authorization': `Bearer ${user.id}` } : {} }),
      ]);

      if (assetsRes.ok) {
        const assets = await assetsRes.json();
        setAsset(assets[0] || null);
      }
      if (offersRes.ok) {
        const allOffers: EnergyOffer[] = await offersRes.json();
        setOffers(allOffers.filter(o => o.sellerId === user?.id));
      }
      if (txRes.ok) {
        const allTx: Transaction[] = await txRes.json();
        setTransactions(allTx.filter(t => t.sellerId === user?.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics from specification
  const todayGen = asset?.todayGenerationKwh || 12.4;
  const homeCons = asset?.homeConsumptionKwh || 7.1;
  const availableSurplus = Math.max(0, Number((todayGen - homeCons).toFixed(1))); // 5.3 kWh
  const energyOffered = offers.reduce((sum, o) => sum + o.quantityKwh, 0) || 3.0;
  const energySold = transactions.reduce((sum, t) => sum + t.energyKwh, 0) || 2.0;
  const totalEarnings = user?.walletBalance || 4850.50;

  // Hourly curve data
  const hourlyCurve = [
    { time: '06:00', generation: 0.1, consumption: 0.8, surplus: 0 },
    { time: '08:00', generation: 1.2, consumption: 1.1, surplus: 0.1 },
    { time: '10:00', generation: 3.2, consumption: 1.1, surplus: 2.1 },
    { time: '12:00', generation: 4.6, consumption: 1.5, surplus: 3.1 },
    { time: '14:00', generation: 3.8, consumption: 1.2, surplus: 2.6 },
    { time: '16:00', generation: 2.1, consumption: 1.4, surplus: 0.7 },
    { time: '18:00', generation: 0.4, consumption: 1.8, surplus: 0 },
    { time: '20:00', generation: 0.0, consumption: 2.2, surplus: 0 },
  ];

  const weeklyEarnings = [
    { day: 'Mon', earnings: 38.5 },
    { day: 'Tue', earnings: 45.0 },
    { day: 'Wed', earnings: 52.0 },
    { day: 'Thu', earnings: 41.5 },
    { day: 'Fri', earnings: 58.0 },
    { day: 'Sat', earnings: 62.5 },
    { day: 'Sun', earnings: 49.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Prosumer Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Good Morning, {user?.name || 'Solar Prosumer'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System: {asset?.name || '5 kW Rooftop Solar'} • Meter ID: {asset?.meterId || 'MTR-SM-9021'} (Simulated)
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenSellWizard}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> SELL SURPLUS ELECTRICITY
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Market
          </button>
        </div>
      </div>

      {/* Hero Prosumer Principle Card (Section 11) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-900/40 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            Empowering Ordinary Homes
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white max-w-xl">
            "You don't need to own a power plant to sell surplus."
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 max-w-2xl bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Generation</span>
              <span className="text-sm font-bold text-emerald-300">{todayGen} kWh</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Home Use</span>
              <span className="text-sm font-bold text-amber-300">- {homeCons} kWh</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Available Surplus</span>
              <span className="text-sm font-bold text-emerald-400">{availableSurplus} kWh</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={onOpenSellWizard}
                className="w-full py-1 px-2 text-[11px] font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs transition-colors text-center"
              >
                Offer Surplus
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Participation and sale of electricity are subject to applicable electricity, grid, metering and regulatory requirements.
          </p>
        </div>
      </div>

      {/* Energy Overview 6-Card Grid (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today's Generation</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-extrabold text-slate-900">{todayGen}</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <Sun className="w-3 h-3" /> Rooftop Solar
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Home Consumption</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-extrabold text-slate-900">{homeCons}</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-0.5 mt-1">
            <Home className="w-3 h-3" /> Smart load active
          </span>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Available Surplus</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-extrabold text-emerald-700">{availableSurplus}</span>
            <span className="text-xs text-emerald-600">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Eligible to offer
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Energy Offered</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-extrabold text-slate-900">{energyOffered}</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-0.5 mt-1">
            <Clock className="w-3 h-3" /> {offers.length} active offers
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Energy Sold</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-extrabold text-slate-900">{energySold}</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" /> 100% verified
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Earnings</span>
          <div className="flex items-baseline gap-0.5 mt-2">
            <span className="text-xs text-slate-500 font-bold">₹</span>
            <span className="text-xl font-extrabold text-slate-900">{totalEarnings.toFixed(2)}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <DollarSign className="w-3 h-3" /> Wallet balance
          </span>
        </div>
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => onNavigate('my-energy')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Sun className="w-4 h-4 text-amber-500" /> My Solar Assets
        </button>
        <button
          onClick={() => onNavigate('my-offers')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Send className="w-4 h-4 text-emerald-600" /> My Offers ({offers.length})
        </button>
        <button
          onClick={() => onNavigate('transactions')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Activity className="w-4 h-4 text-blue-600" /> Transactions ({transactions.length})
        </button>
        <button
          onClick={() => onNavigate('buy-electricity')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Zap className="w-4 h-4 text-amber-500" /> Buy Electricity
        </button>
        <button
          onClick={() => onNavigate('forecast')}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <TrendingUp className="w-4 h-4 text-purple-600" /> Tomorrow's Forecast
        </button>
      </div>

      {/* Charts: Generation & Consumption Curve + Weekly Earnings */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Generation & Consumption Curve</h3>
              <p className="text-xs text-slate-500">Hourly smart meter telemetry (kWh interval)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Solar Gen
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Home Use
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Surplus
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="surplusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '10px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="generation" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" name="Solar Gen (kWh)" />
                <Area type="monotone" dataKey="consumption" stroke="#F59E0B" strokeWidth={2} fillOpacity={0.1} fill="#F59E0B" name="Home Cons (kWh)" />
                <Area type="monotone" dataKey="surplus" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#surplusGrad)" name="Surplus (kWh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Prosumer Earnings Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Earnings</h3>
                <p className="text-xs text-slate-500">PowerGridX settled payout</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                ₹346.50 total
              </span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEarnings} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '10px', fontSize: '12px' }}
                    formatter={(value: any) => [`₹${value}`, 'Earned']}
                  />
                  <Bar dataKey="earnings" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Auto-settled via Smart Meter</span>
            <button onClick={() => onNavigate('earnings')} className="text-emerald-600 font-bold hover:underline">
              View Wallet →
            </button>
          </div>
        </div>
      </div>

      {/* Active Surplus Offers & Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Offers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">My Active Surplus Offers</h3>
            <button onClick={onOpenSellWizard} className="text-xs font-semibold text-emerald-600 hover:underline">
              + New Offer
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
              <Sun className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">No active surplus offers right now.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">You have {availableSurplus} kWh eligible surplus today.</p>
              <button
                onClick={onOpenSellWizard}
                className="mt-3 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                List Surplus Now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {offers.map(offer => (
                <div key={offer.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{offer.quantityKwh} kWh Offered</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        {offer.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Available: {offer.startTime} – {offer.endTime} • {offer.pricingType} pricing
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 block">₹{offer.pricePerKwh}/kWh</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Est. ₹{(offer.quantityKwh * offer.pricePerKwh).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Recent Completed Settlements</h3>
            <button onClick={() => onNavigate('transactions')} className="text-xs font-semibold text-emerald-600 hover:underline">
              View Ledger →
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 3).map(tx => (
              <div key={tx.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-900">{tx.id}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-sm">
                      {tx.meterVerification}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Sold to {tx.buyerName} • {tx.energyKwh} kWh @ ₹{tx.pricePerKwh}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 block">+₹{tx.netSellerAmount.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400">Net credited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
