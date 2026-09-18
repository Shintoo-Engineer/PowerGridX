import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Zap,
  Activity,
  TrendingUp,
  FileText,
  DollarSign,
  Send,
  ShoppingBag,
  ShieldCheck,
  Server,
  Sun,
  Wind
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props {
  onNavigate: (tab: string) => void;
  onOpenSellWizard: () => void;
}

export const ProducerDashboard: React.FC<Props> = ({ onNavigate, onOpenSellWizard }) => {
  const { user } = useAuth();

  const producerGenerationCurve = [
    { time: '06:00', outputMw: 1.2 },
    { time: '08:00', outputMw: 8.5 },
    { time: '10:00', outputMw: 16.8 },
    { time: '12:00', outputMw: 24.2 },
    { time: '14:00', outputMw: 21.0 },
    { time: '16:00', outputMw: 13.5 },
    { time: '18:00', outputMw: 3.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Producer Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Utility Generation Plant
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {user?.name || 'Green Solar Park 1'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            25 MW Photovoltaic Array • Interconnected via 33kV Line to Substation A
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenSellWizard}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> CREATE WHOLESALE OFFER
          </button>
          <button
            onClick={() => onNavigate('contracts')}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> View PPAs
          </button>
        </div>
      </div>

      {/* 4 Core Plant Telemetry Cards (Section 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Installed Capacity</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">25.0</span>
            <span className="text-xs text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">33kV Grid Tie</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Current Output</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-700">18.2</span>
            <span className="text-xs text-emerald-600">MW</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">72.8% Capacity Factor</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Energy Dispatched Today</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">120.4</span>
            <span className="text-xs text-slate-500">MWh</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Direct to grid pool</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Settled Revenue</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xs font-bold text-slate-400">₹</span>
            <span className="text-2xl font-black text-slate-900">4,81,600</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Dispatched contracts</span>
        </div>
      </div>

      {/* Production Curve */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Real-Time Plant Generation Profile</h3>
            <p className="text-xs text-slate-500">SCADA 15-minute dispatch interval (MW)</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Transmission Status: Synchronized
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={producerGenerationCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="producerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '10px', fontSize: '12px' }}
                formatter={(val: any) => [`${val} MW`, 'Plant Output']}
              />
              <Area type="monotone" dataKey="outputMw" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#producerGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bilateral Power Purchase Agreements (PPAs) List */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Wholesale Contracts & Bundles</h3>
          <button onClick={() => onNavigate('contracts')} className="text-xs font-semibold text-emerald-600 hover:underline">
            Manage PPAs →
          </button>
        </div>

        <div className="space-y-2">
          {[
            { id: 'PPA-IND-01', buyer: 'Metro Heavy Engineering Ltd', volume: '10 MW Baseload', tariff: '₹3.90/kWh', tenure: '3 Years', status: 'ACTIVE DISPATCH' },
            { id: 'PPA-BUNDLE-44', buyer: 'Smart Match Bundle #44 (Commercial Pool)', volume: '5 MW Shared with Rooftop Prosumers', tariff: '₹4.10/kWh', tenure: 'Monthly Pool', status: 'ACTIVE DISPATCH' },
          ].map(ppa => (
            <div key={ppa.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{ppa.buyer}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">{ppa.status}</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">{ppa.volume} • {ppa.tenure}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">{ppa.tariff}</span>
                <span className="text-[10px] text-slate-400 font-mono">{ppa.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
