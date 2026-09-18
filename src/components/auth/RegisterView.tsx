import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import { Logo } from '../common/Logo.tsx';
import { Home, Zap, Building2, ArrowRight, ArrowLeft, Check, Sun, ShieldCheck } from 'lucide-react';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
  onOpenHowItWorks: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin, onOpenHowItWorks }) => {
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState<'ROLE' | 'DETAILS'>('ROLE');
  const [selectedRole, setSelectedRole] = useState<'PROSUMER' | 'PRODUCER' | 'CONSUMER'>('PROSUMER');

  // Form details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('Region A — North Grid');
  
  // Asset details (for prosumer or producer)
  const [assetName, setAssetName] = useState('My Rooftop Solar');
  const [capacityKw, setCapacityKw] = useState('5.0');
  const [sourceType, setSourceType] = useState('SOLAR');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSelect = (role: 'PROSUMER' | 'PRODUCER' | 'CONSUMER') => {
    setSelectedRole(role);
    if (role === 'PROSUMER') {
      setAssetName('My Rooftop Solar');
      setCapacityKw('5.0');
      setSourceType('SOLAR');
    } else if (role === 'PRODUCER') {
      setAssetName('Utility Solar / Wind Park');
      setCapacityKw('2500');
      setSourceType('SOLAR');
    }
    setStep('DETAILS');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name || !email) {
      setErrorMsg('Name and email are required.');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      location: location || 'Greenwood Colony, Sector 4',
      region,
      role: selectedRole,
      assetName: selectedRole !== 'CONSUMER' ? assetName : undefined,
      capacityKw: selectedRole !== 'CONSUMER' ? Number(capacityKw) : undefined,
      sourceType: selectedRole !== 'CONSUMER' ? sourceType : undefined,
    };

    const success = await register(payload);
    if (!success) {
      setErrorMsg('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Logo size="md" light showTagline={false} />
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHowItWorks}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={onSwitchToLogin}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {step === 'ROLE' && (
            <div>
              <div className="text-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                  Step 1 of 2 • Account Type
                </span>
                <h2 className="text-xl font-bold text-white mt-3">How do you use electricity?</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Select your primary participation role. Homeowners with rooftop solar should choose Prosumer.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {/* Option 1: Prosumer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('PROSUMER')}
                  className="w-full text-left p-4 rounded-xl border-2 border-emerald-600/70 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all group flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                    <Home className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        🏠 PROSUMER
                        <span className="text-[10px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      I generate and consume electricity. I may have surplus rooftop solar to offer to the community.
                    </p>
                    <span className="text-[11px] text-emerald-400/90 font-medium mt-1 block">
                      Single account: Buy + Sell + Generate + Consume
                    </span>
                  </div>
                </button>

                {/* Option 2: Producer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('PRODUCER')}
                  className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/40 hover:border-slate-500 transition-all group flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">⚡ PRODUCER</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      I operate an electricity-generation plant (solar farm, wind farm, hydro, biomass, or thermal generator).
                    </p>
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      Wholesale offers, bilateral PPAs, generation forecasting
                    </span>
                  </div>
                </button>

                {/* Option 3: Consumer */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('CONSUMER')}
                  className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/40 hover:border-slate-500 transition-all group flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">🏢 CONSUMER</span>
                      <ArrowRight className="w-4 h-4 text-slate-400 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      I need to purchase electricity for my household, retail store, commercial building, or factory.
                    </p>
                    <span className="text-[11px] text-blue-300/90 font-medium mt-1 block">
                      Can later add solar and upgrade to Prosumer anytime!
                    </span>
                  </div>
                </button>
              </div>

              <div className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <button onClick={onSwitchToLogin} className="text-emerald-400 font-semibold hover:underline">
                  Sign In
                </button>
              </div>
            </div>
          )}

          {step === 'DETAILS' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                <button
                  type="button"
                  onClick={() => setStep('ROLE')}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
                </button>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                  Role: {selectedRole}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">Enter Your Profile Details</h3>
              <p className="text-xs text-slate-400 mb-4">
                Provide contact information and grid connection details.
              </p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name / Entity *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar or Apex Industries"
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Grid Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Region A — North Grid">Region A — North Grid</option>
                    <option value="Region B — West Industrial">Region B — West Industrial</option>
                    <option value="Region C — Coastal Corridor">Region C — Coastal Corridor</option>
                    <option value="Region D — Metro Core">Region D — Metro Core</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location / Street Address</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sector 14, Ring Road"
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Energy asset onboarding for Prosumer or Producer */}
              {selectedRole !== 'CONSUMER' && (
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-700/50 rounded-xl mb-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Register Primary Energy Asset</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Asset Name</label>
                      <input
                        type="text"
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Installed Capacity (kW)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={capacityKw}
                        onChange={(e) => setCapacityKw(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Energy Source</label>
                      <select
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      >
                        <option value="SOLAR">Solar</option>
                        <option value="WIND">Wind</option>
                        <option value="HYDRO">Hydro</option>
                        <option value="BIOMASS">Biomass</option>
                        {selectedRole === 'PRODUCER' && <option value="THERMAL">Thermal</option>}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Regulatory agreement note */}
              <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  I acknowledge that surplus energy participation uses the existing public grid and is governed by applicable distribution and metering regulations.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration & Enter Platform'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-center text-[11px] text-slate-500">
        PowerGridX • Trade Surplus • Power Communities • Smarter Grid
      </footer>
    </div>
  );
};
