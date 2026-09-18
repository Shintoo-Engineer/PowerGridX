import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ShieldCheck,
  LifeBuoy,
  Settings,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Lock,
  Mail,
  Smartphone,
  Layers
} from 'lucide-react';

interface Props {
  mode?: 'SETTINGS' | 'SUPPORT';
}

export const SettingsAndSupport: React.FC<Props> = ({ mode = 'SETTINGS' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'SUPPORT'>(mode);
  
  // Settings state
  const [autoSellSurplus, setAutoSellSurplus] = useState(true);
  const [minSellingPrice, setMinSellingPrice] = useState('4.20');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [gridAlerts, setGridAlerts] = useState(true);

  // Dispute state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketDescription('');
      setTicketSent(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Account Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {activeTab === 'SETTINGS' ? 'Preferences & Interconnection Settings' : 'Support & Dispute Resolution'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Smart meter calibration parameters, automated clearing thresholds, and regulatory compliance.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'SETTINGS' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-emerald-600" /> Settings
          </button>
          <button
            onClick={() => setActiveTab('SUPPORT')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'SUPPORT' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-blue-600" /> Support & Disputes
          </button>
        </div>
      </div>

      {activeTab === 'SETTINGS' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Automation Rules */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Surplus Automation Rules</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSellSurplus}
                  onChange={e => setAutoSellSurplus(e.target.checked)}
                  className="mt-0.5 text-emerald-600 rounded-sm"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Auto-List Daily Eligible Surplus</span>
                  <span className="text-slate-500 text-[11px]">
                    Automatically list positive surplus (Gen - Cons) each day at 12:00 PM without manual entry.
                  </span>
                </div>
              </label>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Minimum Floor Price (₹ / kWh)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={minSellingPrice}
                  onChange={e => setMinSellingPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Smart matches below this rate will not be executed.
                </span>
              </div>
            </div>
          </div>

          {/* Profile & Grid Account Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Profile & Grid Linkage</h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Participant Name:</span>
                <strong className="text-slate-900">{user?.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Account Role:</span>
                <strong className="text-emerald-700 font-mono">{user?.role}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Smart Meter ID:</span>
                <strong className="text-slate-900 font-mono">{user?.meterId || 'MTR-SM-9021'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Grid Region:</span>
                <strong className="text-slate-900">{user?.region}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>DISCOM Utility Feeder:</span>
                <strong className="text-slate-900 font-mono">FEEDER-11kV-B4</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SUPPORT' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Dispute Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Submit Dispute / Meter Audit Request</h3>
            <p className="text-xs text-slate-500 mb-4">
              If smart meter interval telemetry discrepancies arise between export logs and settlement invoices.
            </p>

            {ticketSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Dispute Ticket Logged (#DIS-482)</p>
                <p className="text-[11px]">Audit officers will review smart meter cryptographic signatures within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meter interval reconciliation mismatch on TX-2026-0012"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Description / Meter Log</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain the interval reading or payment question..."
                    value={ticketDescription}
                    onChange={e => setTicketDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Audit Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQ & Guidelines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Regulatory Safeguards</h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Discom Grid Independence:</strong>
                <p className="text-slate-600 text-[11px]">
                  PowerGridX acts as a digital market and peer settlement platform. Physical wiring, distribution transformers, and outage repairs remain under the authorized jurisdiction of the state electricity board.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Simulated Telemetry Safeguard:</strong>
                <p className="text-slate-600 text-[11px]">
                  All meter intervals, generation curves, and financial transactions presented in this platform are simulated demonstrations designed for evaluating community electricity trading.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
