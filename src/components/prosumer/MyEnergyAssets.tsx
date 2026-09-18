import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { EnergyAsset, MeterReading } from '../../types/index.ts';
import {
  Sun,
  Plus,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw,
  X
} from 'lucide-react';

export const MyEnergyAssets: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<EnergyAsset[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New asset form
  const [name, setName] = useState('Second Solar String (Rear Roof)');
  const [sourceType, setSourceType] = useState('SOLAR');
  const [capacityKw, setCapacityKw] = useState('3.0');
  const [location, setLocation] = useState(user?.location || 'Greenwood Colony, Sector 4');
  const [region, setRegion] = useState(user?.region || 'Region A — North Grid');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assetsRes, readingsRes] = await Promise.all([
        fetch('/api/assets', { headers: user ? { 'Authorization': `Bearer ${user.id}` } : {} }),
        fetch('/api/meters/readings'),
      ]);
      if (assetsRes.ok) setAssets(await assetsRes.json());
      if (readingsRes.ok) setReadings(await readingsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({
          name,
          sourceType,
          capacityKw: Number(capacityKw),
          location,
          region,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Asset & Telemetry Hub
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">My Energy Assets & Smart Meters</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered rooftop solar systems and grid-connected smart meter intervals.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Energy Asset
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      {assets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <Sun className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">No Generation Assets Registered</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {user?.role === 'CONSUMER'
              ? 'You are registered as an Electricity Consumer. If you install rooftop solar, add it below to upgrade to a Prosumer and sell surplus solar energy to the grid!'
              : 'Add your solar panels or generation assets to begin monitoring live smart meter telemetry and selling surplus.'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            + Register Solar Asset
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {assets.map(asset => {
            const surplus = Math.max(0, Number((asset.todayGenerationKwh - asset.homeConsumptionKwh).toFixed(1)));
            const isSurplusNegative = asset.todayGenerationKwh < asset.homeConsumptionKwh;

            return (
              <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{asset.name}</h3>
                      <span className="text-xs text-slate-500">
                        {asset.sourceType} • {asset.capacityKw} kW Installed
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {asset.status}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-700">
                      {asset.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Surplus Calculation Block (Section 9) */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Solar Generation:</span>
                    <span className="font-bold text-emerald-700">{asset.todayGenerationKwh} kWh</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Home Consumption:</span>
                    <span className="font-bold text-amber-700">- {asset.homeConsumptionKwh} kWh</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                    <span className="font-sans">Calculated Surplus:</span>
                    {isSurplusNegative ? (
                      <span className="text-amber-600 font-sans text-[11px]">No surplus currently available</span>
                    ) : (
                      <span className="text-emerald-600">{surplus} kWh</span>
                    )}
                  </div>
                </div>

                {/* Meter Info & Status */}
                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    Meter: <strong className="text-slate-700 font-mono">{asset.meterId}</strong>
                  </span>
                  <span>Location: {asset.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulated Smart Meter Telemetry Section (Section 22) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Smart Meter Telemetry Log</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                SIMULATED METER DATA
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reconciles actual physical generation and consumption at 60-minute intervals.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Status: Meter Online & Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Interval Time</th>
                <th className="py-2.5 px-3">Meter ID</th>
                <th className="py-2.5 px-3">Solar Generation</th>
                <th className="py-2.5 px-3">Household Load</th>
                <th className="py-2.5 px-3">Net Energy (Surplus)</th>
                <th className="py-2.5 px-3">Voltage / Freq</th>
                <th className="py-2.5 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readings.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 font-semibold text-slate-800">{r.timestamp}</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{r.meterId}</td>
                  <td className="py-2 px-3 font-bold text-emerald-700">{r.generationKwh} kWh</td>
                  <td className="py-2 px-3 text-amber-700">{r.consumptionKwh} kWh</td>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {r.netSurplusKwh > 0 ? `+${r.netSurplusKwh} kWh` : `${r.netSurplusKwh} kWh`}
                  </td>
                  <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                    {r.voltageV}V / {r.frequencyHz}Hz
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Register New Energy Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Energy Source</label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="SOLAR">Solar (PV)</option>
                    <option value="WIND">Small Wind Turbine</option>
                    <option value="BIOMASS">Biogas / Biomass</option>
                    <option value="HYDRO">Micro Hydro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={capacityKw}
                    onChange={e => setCapacityKw(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grid Region</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="Region A — North Grid">Region A — North Grid</option>
                  <option value="Region B — West Industrial">Region B — West Industrial</option>
                  <option value="Region C — Coastal Corridor">Region C — Coastal Corridor</option>
                  <option value="Region D — Metro Core">Region D — Metro Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Automated Interconnection Check</span>
                PowerGridX assigns a simulated bidirectional smart meter ID with encrypted interval telemetry.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
