import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Building2,
  Zap,
  ShoppingBag,
  TrendingDown,
  ShieldCheck,
  Sun,
  Leaf,
  Plus,
  CheckCircle2,
  Receipt,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  onNavigate: (tab: string) => void;
}

export const ConsumerDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user, updateUserRole } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [solarCapacityKw, setSolarCapacityKw] = useState('4.0');
  const [assetName, setAssetName] = useState('My Rooftop Solar Array');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const usageBreakdown = [
    { day: 'Mon', p2pPurchased: 28, gridBackup: 14 },
    { day: 'Tue', p2pPurchased: 32, gridBackup: 12 },
    { day: 'Wed', p2pPurchased: 30, gridBackup: 18 },
    { day: 'Thu', p2pPurchased: 35, gridBackup: 10 },
    { day: 'Fri', p2pPurchased: 31, gridBackup: 16 },
    { day: 'Sat', p2pPurchased: 20, gridBackup: 10 },
    { day: 'Sun', p2pPurchased: 18, gridBackup: 8 },
  ];

  const handleUpgradeToProsumer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpgrading(true);
    try {
      // 1. Register rooftop solar asset
      await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({
          name: assetName,
          sourceType: 'SOLAR',
          capacityKw: Number(solarCapacityKw),
          location: user?.location || 'Local Premises',
          region: user?.region || 'Region A — North Grid',
        }),
      });

      // 2. Update role in Auth Context
      updateUserRole('PROSUMER');
      setShowUpgradeModal(false);
      onNavigate('dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Consumer Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Commercial Consumer
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {user?.name || 'Apex Commercial Complex'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Meter ID: {user?.meterId || 'MTR-CM-5100'} • Clean Energy Sourcing Program
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-300" /> BUY ELECTRICITY
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Marketplace
          </button>
        </div>
      </div>

      {/* CONSUMER TO PROSUMER UPGRADE BANNER (Section 15) */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Added Rooftop Solar?
          </span>
          <h3 className="text-base font-bold text-white">
            Upgrade this account to PROSUMER anytime.
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Installed solar panels on your roof or facility? Register your capacity to sell surplus electricity directly to the community without creating a separate login!
          </p>
        </div>

        <button
          onClick={() => setShowUpgradeModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Sun className="w-4 h-4" /> BECOME A PROSUMER
        </button>
      </div>

      {/* 6 Consumer Performance Cards (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Today's Demand</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">48.0</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Facility smart meter</span>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">PowerGridX Clean</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-700">30.0</span>
            <span className="text-xs text-emerald-600">kWh</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">62.5% clean mix</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Grid Discom Backup</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">18.0</span>
            <span className="text-xs text-slate-500">kWh</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Standard utility feed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Cost Saved</span>
          <div className="flex items-baseline gap-0.5 mt-2">
            <span className="text-xs text-slate-400 font-bold">₹</span>
            <span className="text-2xl font-black text-emerald-700">180.00</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">vs DISCOM retail tariff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Contracts</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">2</span>
          </div>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">Prosumer + Producer</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Carbon Offset</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-700">24.6</span>
            <span className="text-xs text-emerald-600">kg CO₂</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Certified clean credit</span>
        </div>
      </div>

      {/* Energy Consumption & Source Mix Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Energy Sourcing Breakdown</h3>
            <p className="text-xs text-slate-500">PowerGridX peer contracts vs state grid baseline</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> P2P Clean Solar
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Discom Utility
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="p2pPurchased" fill="#10B981" stackId="a" name="P2P Solar (kWh)" />
              <Bar dataKey="gridBackup" fill="#94A3B8" stackId="a" name="Discom Grid (kWh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upgrade Modal (Section 15) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Upgrade Account to Prosumer</h3>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpgradeToProsumer} className="space-y-3.5 text-xs">
              <p className="text-slate-600">
                Enter your rooftop solar specifications. Once submitted, your profile will immediately unlock the <strong>Sell Surplus Wizard</strong> and <strong>Solar Telemetry Dashboard</strong> without losing your transaction history!
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Solar System Label</label>
                <input
                  type="text"
                  required
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Installed Capacity (kW)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={solarCapacityKw}
                  onChange={e => setSolarCapacityKw(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold block mb-0.5">Unified Account Architecture:</span>
                Prosumers can both buy when in deficit and sell when in surplus.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpgrading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  {isUpgrading ? 'Upgrading...' : 'Confirm & Switch to Prosumer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
