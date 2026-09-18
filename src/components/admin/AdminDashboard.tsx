import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, EnergyAsset } from '../../types/index.ts';
import {
  Shield,
  Users,
  CheckSquare,
  Sun,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle,
  Activity,
  Server
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [pendingAssets, setPendingAssets] = useState<EnergyAsset[]>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; actor: string; timestamp: string }>>([
    { id: 'LOG-881', action: 'Smart Meter Verification Approved (MTR-SM-9021)', actor: 'SYSTEM_AUDITOR', timestamp: '10 mins ago' },
    { id: 'LOG-880', action: 'Prosumer Surplus Offer Settled (TX-2026-0012)', actor: 'CLEARING_ENGINE', timestamp: '24 mins ago' },
    { id: 'LOG-879', action: 'Grid Congestion Dispatch Directive Executed', actor: 'RLDC_DISPATCHER', timestamp: '1 hour ago' },
    { id: 'LOG-878', action: 'New Rooftop Solar Asset Registered (5 kW)', actor: 'Ramesh Kumar', timestamp: '2 hours ago' },
  ]);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [uRes, aRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/assets'),
      ]);
      if (uRes.ok) setUsersList(await uRes.json());
      if (aRes.ok) {
        const allA: EnergyAsset[] = await aRes.json();
        setPendingAssets(allA);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveAsset = (assetId: string) => {
    setPendingAssets(prev =>
      prev.map(a => (a.id === assetId ? { ...a, verificationStatus: 'VERIFIED' } : a))
    );
    setAuditLogs(prev => [
      { id: `LOG-${Date.now()}`, action: `Approved Solar Asset ${assetId}`, actor: user?.name || 'ADMIN', timestamp: 'Just now' },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Platform Operations & Compliance
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            PowerGridX Governance & Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interconnection verification, marketplace surveillance, and smart meter clearing integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Node Audits Passing
          </span>
        </div>
      </div>

      {/* 5 Core Administration Statistics (Section 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Registered Users</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">450</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">420 Prosumers active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Energy Assets</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">434</span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">2 Pending audit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Offers</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-emerald-700">18</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Live in marketplace</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Volume Today</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">158.4</span>
            <span className="text-xs text-slate-500">MWh</span>
          </div>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">Cleared & verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Disputes / Tickets</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">1</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Meter discrepancy review</span>
        </div>
      </div>

      {/* Verification Desk (Asset Approvals) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Asset Verification Desk</h3>
            <p className="text-xs text-slate-500">Inspect rooftop solar & generator grid-connection certificates.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {pendingAssets.filter(a => a.verificationStatus !== 'VERIFIED').length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {pendingAssets.map(asset => (
            <div
              key={asset.id}
              className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 text-sm">{asset.name}</strong>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {asset.sourceType} • {asset.capacityKw} kW
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      asset.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {asset.verificationStatus}
                  </span>
                </div>
                <div className="flex gap-3 text-slate-500 mt-1">
                  <span>Meter: <strong className="text-slate-700 font-mono">{asset.meterId}</strong></span>
                  <span>Location: {asset.location}</span>
                  <span>Region: {asset.region}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {asset.verificationStatus !== 'VERIFIED' ? (
                  <>
                    <button
                      onClick={() => handleApproveAsset(asset.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Connect
                    </button>
                    <button
                      onClick={() => alert('Audit request note dispatched to owner.')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
                    >
                      Request Docs
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Live on Exchange
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table (Section 24) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Immutable Platform Audit Trail</h3>
        <div className="space-y-2">
          {auditLogs.map(log => (
            <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 text-[10px]">{log.id}</span>
                <span className="font-medium text-slate-800">{log.action}</span>
              </div>
              <div className="text-right text-slate-400 text-[11px]">
                <span>By <strong className="text-slate-600">{log.actor}</strong> • {log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
