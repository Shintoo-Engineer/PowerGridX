import React, { useState } from 'react';
import { X, Sun, ShieldCheck, Zap, ArrowRight, CheckCircle, Home, Building2, BatteryCharging, DollarSign, HelpCircle, Layers } from 'lucide-react';
import { Logo } from '../common/Logo.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
}

export const HowItWorksModal: React.FC<Props> = ({ isOpen, onClose, onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROSUMER' | 'GRID' | 'FAQ'>('OVERVIEW');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" showTagline={false} />
            <span className="hidden sm:inline-block h-4 w-px bg-slate-200"></span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Platform Guide
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-100 py-3 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'OVERVIEW' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            How PowerGridX Works
          </button>
          <button
            onClick={() => setActiveTab('PROSUMER')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'PROSUMER' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            The Prosumer Model (Rooftop Solar)
          </button>
          <button
            onClick={() => setActiveTab('GRID')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'GRID' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Physical Grid vs. Digital Market
          </button>
          <button
            onClick={() => setActiveTab('FAQ')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'FAQ' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            FAQ & Regulations
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-sm">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-xs">
                <h4 className="text-base font-bold text-emerald-100 mb-1">Turn Surplus Electricity Into Opportunity.</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Connect eligible electricity generation with local demand through an intelligent digital coordination layer built on top of the existing electricity grid.
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">8-Step Operational Lifecycle</h5>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { step: '1', title: 'Generate', desc: 'Rooftop solar panels or renewable generators harvest clean power.' },
                    { step: '2', title: 'Consume', desc: 'The household or facility uses what it needs locally in real-time.' },
                    { step: '3', title: 'Calculate Surplus', desc: 'Surplus = Generation − Consumption. Negative values are never treated as surplus.' },
                    { step: '4', title: 'Offer Surplus', desc: 'List eligible kWh at fixed or smart market-clearing rates.' },
                    { step: '5', title: 'Smart Match', desc: 'Engine pairs consumer demand with nearby prosumer and producer bundles.' },
                    { step: '6', title: 'Grid Carries Energy', desc: 'Physical power travels safely through the regulated utility network.' },
                    { step: '7', title: 'Verify Meter Data', desc: 'Smart meters reconcile actual export and import intervals.' },
                    { step: '8', title: 'Settle Transaction', desc: 'Simulated digital wallet settlement credits the seller seamlessly.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <h6 className="font-bold text-xs text-slate-900">{item.title}</h6>
                        <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PROSUMER' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Core Innovation
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  "You Don't Need to Own a Power Plant to Sell Electricity."
                </h4>
                <p className="text-xs text-slate-700 mt-1">
                  A normal homeowner with rooftop solar can be both a consumer and a seller on a single unified account.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-slate-900 mb-2">Real Prosumer Math Example:</h5>
                <div className="font-mono text-xs bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Solar Generation:</span> <span className="font-semibold text-emerald-700">12.0 kWh</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Household Consumption:</span> <span className="font-semibold text-amber-700">- 7.0 kWh</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900">
                    <span>Available Surplus:</span> <span className="text-emerald-600">5.0 kWh</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  The homeowner can offer 3.0 kWh to a neighboring commercial building at ₹4.50/kWh, earning ₹13.50 while powering clean local development.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block text-slate-800">Generate</span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <BatteryCharging className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block text-slate-800">Surplus</span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold block text-slate-800">Earn</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'GRID' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-xl">
                <h4 className="text-sm font-bold text-emerald-400 mb-1">Grid Architecture: Digital vs. Physical</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  PowerGridX does not construct duplicate cables. The existing regulated transmission and distribution grid continues to transport physical electrons safely.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-emerald-200 rounded-xl bg-emerald-50/50">
                  <span className="text-xs font-bold text-emerald-900 block mb-0.5">1. Digital / Commercial Layer (PowerGridX)</span>
                  <p className="text-[11px] text-slate-700">
                    Registers generation assets, verifies smart meter feeds, hosts the live marketplace, runs matching algorithms, automates settlement, and provides AI forecasting.
                  </p>
                </div>
                <div className="p-3 border border-amber-200 rounded-xl bg-amber-50/50">
                  <span className="text-xs font-bold text-amber-900 block mb-0.5">2. Regulated Physical Layer (Existing Utility Grid)</span>
                  <p className="text-[11px] text-slate-700">
                    Substations, transformers, transmission lines, voltage/frequency balancing, and safety isolators operated by state distribution utilities (DISCOMs).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FAQ' && (
            <div className="space-y-3">
              {[
                {
                  q: 'Can anyone sell electricity immediately without approvals?',
                  a: 'No. All participation is strictly subject to state electricity regulatory commissions, open-access guidelines, grid connection approvals, and meter certification.',
                },
                {
                  q: 'Does PowerGridX act as a private utility company?',
                  a: 'No. PowerGridX is an intelligent digital marketplace and settlement coordination platform that interfaces between participants and the existing regulated grid.',
                },
                {
                  q: 'How does Smart Matching bundle prosumers and producers?',
                  a: 'If a commercial buyer needs 300 kWh, the engine can combine 150 kWh from local solar prosumers with 150 kWh from a utility wind or solar farm in a single balanced contract.',
                },
                {
                  q: 'Is the telemetry and billing real in this prototype?',
                  a: 'In this demonstration prototype, grid telemetry, smart meter data, and payments are simulated for safe exploration.',
                },
              ].map((faq, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h6 className="font-semibold text-xs text-slate-900 flex items-start gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    {faq.q}
                  </h6>
                  <p className="text-[11px] text-slate-600 pl-5.5 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">PowerGridX Commercial Architecture</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Close
            </button>
            {onOpenRegister && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
              >
                Create Account <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
