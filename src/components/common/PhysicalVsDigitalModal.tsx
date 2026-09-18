import React from 'react';
import { X, ArrowDown, ShieldCheck, Zap, Activity, Info, Building2, Home, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PhysicalVsDigitalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">How PowerGridX Operates</h3>
              <p className="text-xs text-slate-500">Commercial Digital Layer vs. Regulated Physical Grid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Concept Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900">No Private Cable:</strong> PowerGridX does <em>not</em> run private copper wires between individual homes. Physical electricity flows through the existing utility distribution grid. PowerGridX manages the <strong>digital, financial, metering, and contractual marketplace</strong>.
        </div>

        {/* Dual Flow Diagram */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Flow 1: Physical */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-3">
              <Activity className="w-3.5 h-3.5 text-amber-600" /> Physical Electricity Flow
            </span>

            <div className="w-full space-y-2">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Home className="w-4 h-4 text-amber-600" /> Producer / Prosumer
              </div>
              <ArrowDown className="w-4 h-4 mx-auto text-amber-500" />
              <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-lg text-xs font-bold text-slate-900 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" /> Existing Regulated Grid
              </div>
              <ArrowDown className="w-4 h-4 mx-auto text-amber-500" />
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" /> Consumer
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Physical electrons mix in the existing network governed by state distribution utilities.
            </p>
          </div>

          {/* Flow 2: Digital */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digital Marketplace Flow
            </span>

            <div className="w-full space-y-2">
              <div className="p-3 bg-emerald-100/50 border border-emerald-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Home className="w-4 h-4 text-emerald-700" /> Prosumer Surplus Listing
              </div>
              <ArrowDown className="w-4 h-4 mx-auto text-emerald-600" />
              <div className="p-3 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm flex flex-col items-center justify-center">
                <span>PowerGridX Platform</span>
                <span className="text-[10px] font-normal opacity-90">Smart Match • Verified Meters • Settlement</span>
              </div>
              <ArrowDown className="w-4 h-4 mx-auto text-emerald-600" />
              <div className="p-3 bg-emerald-100/50 border border-emerald-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" /> Consumer Contract & Payment
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-3">
              Automated reconciliation of meter data, bilateral settlements, and clean energy proof.
            </p>
          </div>
        </div>

        {/* Regulatory Safeguard Notice */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2.5 bg-slate-100/80 rounded-xl p-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">Regulatory & Compliance Mandate</strong>
              Participation and trade of surplus electricity are subject to applicable open-access, net-metering, distribution licensing, and grid code compliance. In this platform prototype, grid telemetry and settlements are simulated.
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
