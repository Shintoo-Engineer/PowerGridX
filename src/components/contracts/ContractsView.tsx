import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { DigitalContract } from '../../types/index.ts';
import {
  FileText,
  Plus,
  CheckCircle2,
  Calendar,
  Zap,
  Building2,
  ShieldCheck,
  Clock,
  X,
  Printer,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Props {
  onNavigateTab?: (tab: string) => void;
}

export const ContractsView: React.FC<Props> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<DigitalContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<DigitalContract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New contract form
  const [producerName, setProducerName] = useState('Solar Farm Alpha (Helios Energy)');
  const [consumerName, setConsumerName] = useState(user?.name || 'Apex Commercial Complex');
  const [energyMwhPerDay, setEnergyMwhPerDay] = useState('5.0');
  const [durationDays, setDurationDays] = useState('30');
  const [pricePerKwh, setPricePerKwh] = useState('3.80');
  const [terms, setTerms] = useState('Bilateral Power Purchase Agreement coordinated over PowerGridX under State ERC open-access regulations.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contracts', {
        headers: user ? { 'Authorization': `Bearer ${user.id}` } : {},
      });
      if (res.ok) {
        const data: DigitalContract[] = await res.json();
        // Filter contracts for user if applicable or show all relevant
        const relevant = data.filter(c => 
          !user || user.role === 'ADMIN' || user.role === 'GRID_OPERATOR' || 
          c.consumerId === user.id || c.producerId === user.id || 
          c.consumerName.toLowerCase().includes(user.name.toLowerCase()) ||
          user.role === 'CONSUMER' // Allow consumers to see all bilateral options if list is small
        );
        setContracts(relevant.length > 0 ? relevant : data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({
          producerName,
          consumerName,
          energyMwhPerDay: Number(energyMwhPerDay),
          durationDays: Number(durationDays),
          pricePerKwh: Number(pricePerKwh),
          terms,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        fetchContracts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeContractsCount = contracts.filter(c => c.status === 'ACTIVE').length;
  const totalMwhDaily = contracts.reduce((sum, c) => sum + (c.energyMwhPerDay || 0), 0);
  const avgRate = contracts.length > 0
    ? (contracts.reduce((sum, c) => sum + c.pricePerKwh, 0) / contracts.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Bilateral Energy Contracts (PPAs)
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Open Access Verified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Long-Term Energy Contracts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured Power Purchase Agreements (PPAs) locking stable tariffs directly with renewable generation plants.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Draft PPA Agreement
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Contracts</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-slate-900">{activeContractsCount}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {activeContractsCount > 0 ? 'Firm supply active' : '0 agreements currently'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Contracted Energy</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-black text-blue-700">{totalMwhDaily.toFixed(1)}</span>
            <span className="text-xs text-slate-500">MWh/day</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Baseload allocation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average Tariff</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xs font-bold text-slate-400">₹</span>
            <span className="text-2xl font-black text-slate-900">{avgRate}</span>
            <span className="text-xs text-slate-500">/kWh</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Below DISCOM retail tariff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Regulatory Compliance</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-bold text-slate-900">100%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">State ERC Certified</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Virtual Power Purchase Agreements</h2>
            <p className="text-xs text-slate-500">Bilateral digital contracts registered with state load dispatch center.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {contracts.length} {contracts.length === 1 ? 'Contract' : 'Contracts'}
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-semibold text-slate-700">No bilateral energy contracts currently active</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You can draft a customized Power Purchase Agreement or source immediate energy bundles via the marketplace.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Draft First Contract
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Contract ID</th>
                  <th className="py-2.5 px-3">Producer (Seller)</th>
                  <th className="py-2.5 px-3">Offtaker (Buyer)</th>
                  <th className="py-2.5 px-3">Daily Energy</th>
                  <th className="py-2.5 px-3">Tariff</th>
                  <th className="py-2.5 px-3">Tenure / Validity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{contract.contractNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{contract.producerName}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{contract.consumerName}</td>
                    <td className="py-3 px-3 font-bold text-blue-700">{contract.energyMwhPerDay} MWh/day</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">₹{contract.pricePerKwh.toFixed(2)}/kWh</td>
                    <td className="py-3 px-3 text-slate-500">
                      <span>{contract.startDate} to {contract.endDate}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">({contract.durationDays} Days)</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {contract.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View PPA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Contract Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Power Purchase Agreement Certificate</h3>
              </div>
              <button onClick={() => setSelectedContract(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="font-sans font-bold text-slate-900 block text-sm">PowerGridX Energy Exchange</span>
                  <span className="text-[10px] text-slate-500">Virtual Bilateral PPA Agreement</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-700 block">{selectedContract.contractNumber}</span>
                  <span className="text-[10px] text-slate-400">Status: {selectedContract.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Producer (Seller)</span>
                  <strong className="text-slate-900">{selectedContract.producerName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Consumer (Offtaker)</span>
                  <strong className="text-slate-900">{selectedContract.consumerName}</strong>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Daily Sourced Volume:</span>
                  <span className="font-bold text-slate-900">{selectedContract.energyMwhPerDay} MWh / Day</span>
                </div>
                <div className="flex justify-between">
                  <span>Agreed Tariff Rate:</span>
                  <span className="font-bold text-emerald-700">₹{selectedContract.pricePerKwh.toFixed(2)} / kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity Duration:</span>
                  <span>{selectedContract.durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenure Period:</span>
                  <span>{selectedContract.startDate} → {selectedContract.endDate}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 text-[11px] font-sans text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Statutory Open-Access Terms:</span>
                {selectedContract.terms}
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] font-sans">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Sealed & Dispatch Logged
                </span>
                <span className="text-slate-400 font-mono text-[10px]">SLDC-REG-4402</span>
              </div>
            </div>

            <div className="mt-4 pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Draft Power Purchase Agreement</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Producer / Plant</label>
                <input
                  type="text"
                  required
                  value={producerName}
                  onChange={e => setProducerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Consumer / Offtaker</label>
                <input
                  type="text"
                  required
                  value={consumerName}
                  onChange={e => setConsumerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Energy (MWh / Day)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={energyMwhPerDay}
                    onChange={e => setEnergyMwhPerDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tariff (₹ / kWh)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={pricePerKwh}
                    onChange={e => setPricePerKwh(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={durationDays}
                  onChange={e => setDurationDays(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Open-Access Terms</label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={e => setTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                >
                  {isSubmitting ? 'Registering...' : 'Register Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
