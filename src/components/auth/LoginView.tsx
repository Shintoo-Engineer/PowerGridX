import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import { Logo } from '../common/Logo.tsx';
import { Lock, Mail, ArrowRight, ShieldCheck, HelpCircle, Sun, Building2, Zap, Server, Shield, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
  onOpenHowItWorks: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister, onOpenHowItWorks }) => {
  const { login, quickLoginAs, isLoading } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('prosumer@powergridx.com');
  const [password, setPassword] = useState('demo1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!emailOrPhone) {
      setErrorMsg('Please enter your email or registered phone number.');
      return;
    }
    const success = await login(emailOrPhone, undefined, password);
    if (!success) {
      setErrorMsg('Unable to sign in. Please try again or choose a 1-click role below.');
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setErrorMsg(null);
    await quickLoginAs(role);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      await login('shintoo.6385@gmail.com', 'PROSUMER');
    } catch {
      await quickLoginAs('PROSUMER');
    } finally {
      setGoogleLoading(false);
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
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-3.5 py-2 rounded-lg transition-colors border border-slate-700/60"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>How PowerGridX Works</span>
          </button>
          <button
            onClick={onSwitchToRegister}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-2 transition-colors"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Login Screen */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size="lg" light showTagline />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Sign in to manage surplus solar, trade power, or schedule grid dispatch.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 text-center">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email / Phone Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. prosumer@powergridx.com or +91..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo accounts do not require password reset. Simply click any Demo Profile below to enter.')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social or Google login */}
          <div className="mt-4 pt-4 border-t border-slate-700/60">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-2.5 px-3 bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                1-Click Instant Demo Login:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('PROSUMER')}
                className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prosumer</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Rooftop Solar Home</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('PRODUCER')}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Producer</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">25 MW Solar Farm</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('CONSUMER')}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Consumer</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Commercial Building</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('GRID_OPERATOR')}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-700/50 border border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                  <Server className="w-3.5 h-3.5" />
                  <span>Grid Operator</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">State RLDC Dispatch</p>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="mt-2 w-full py-1.5 px-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-lg text-left text-[11px] text-slate-400 hover:text-slate-300 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-400" /> Platform Administrator Console
              </span>
              <span className="text-[10px] text-slate-500">Restricted</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-emerald-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>

      {/* Regulatory Footer Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Regulatory Notice: Participation and electricity trading are subject to applicable grid code and DISCOM open-access rules.</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <span>Simulated prototype telemetry</span>
      </footer>
    </div>
  );
};
