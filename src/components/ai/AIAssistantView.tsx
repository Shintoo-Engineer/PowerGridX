import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Bot,
  Send,
  Sun,
  TrendingUp,
  Sparkles,
  CloudSun,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
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
  initialMode?: 'ASSISTANT' | 'FORECAST';
  onNavigateTab?: (tab: string) => void;
  onOpenSellWizard?: () => void;
}

export const AIAssistantView: React.FC<Props> = ({ initialMode = 'ASSISTANT', onNavigateTab, onOpenSellWizard }) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'ASSISTANT' | 'FORECAST'>(initialMode);
  
  // Assistant Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'AI' | 'USER'; text: string; time: string; actionLabel?: string; actionTab?: string }>>([
    {
      sender: 'AI',
      text: `Hello ${user?.name || 'there'}! I am your PowerGridX AI Energy Assistant. I analyze real-time solar irradiation, local feeder tariffs, and your smart meter intervals to optimize your clean energy earnings. How can I help you today?`,
      time: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Suggested Prompts (Section 26)
  const suggestedPrompts = [
    'When is the best time to sell my surplus?',
    'What price should I set for my rooftop solar?',
    'How much did I earn this week?',
    'Why is my surplus lower today?',
    'How does smart match bundling work?',
  ];

  const handleSend = (queryText?: string) => {
    const text = queryText || inputPrompt;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'USER', text, time: userTime }]);
    if (!queryText) setInputPrompt('');
    setIsTyping(true);

    // AI smart response matching
    setTimeout(() => {
      let reply = '';
      let actionLabel: string | undefined = undefined;
      let actionTab: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('best time') || lower.includes('when')) {
        reply = 'Based on regional irradiation models for your 5 kW rooftop array, your optimal export window tomorrow is 1:00 PM – 4:00 PM. Local commercial AC demand peaks during this slot, enabling you to capture peak clearing rates of ₹4.60 – ₹4.80/kWh.';
        actionLabel = 'List Surplus for 1–4 PM';
      } else if (lower.includes('price') || lower.includes('rate')) {
        reply = 'Current market clearing price for rooftop solar prosumers in Region A is ₹4.50/kWh. We recommend setting your price between ₹4.40 and ₹4.65/kWh to achieve a 94% instant match probability with nearby commercial buyers.';
      } else if (lower.includes('earn') || lower.includes('week')) {
        reply = `You have earned ₹346.50 over the past 7 days across 4 completed settlements. Your net wallet balance is ₹${(user?.walletBalance || 4850.50).toFixed(2)}. All transactions have been verified by your digital smart meter.`;
        actionLabel = 'View Wallet & Settlement';
        actionTab = 'earnings';
      } else if (lower.includes('lower') || lower.includes('cloud')) {
        reply = 'Today afternoon saw partial cloud cover in Sector 4 (diffuse radiation down by 22%), combined with an extra 1.4 kWh consumption from your residential cooling system. Tomorrow forecast predicts clear skies with 85% peak irradiation!';
      } else if (lower.includes('smart match')) {
        reply = 'The Smart Matching Engine automatically aggregates small prosumer surpluses (like your 3 kWh) with large utility renewable producers. For example, if an IT park needs 300 kWh, the engine combines 150 kWh of rooftop prosumer solar with 150 kWh from a utility wind/solar farm in a single contract!';
        actionLabel = 'Try Smart Match Engine';
        actionTab = 'marketplace';
      } else {
        reply = `Great question! In PowerGridX, physical electrons flow safely through your existing utility distribution grid, while our digital layer calculates your surplus (Generation - Consumption = ${((user?.walletBalance || 0) > 0 ? '5.3 kWh' : '4.0 kWh')}) and executes automated settlements.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'AI',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionLabel,
          actionTab,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  // Forecast data (Section 25)
  const forecastHourlyCurve = [
    { time: '07:00', predictedGen: 0.8, expectedCons: 1.0, surplus: 0 },
    { time: '09:00', predictedGen: 2.6, expectedCons: 1.2, surplus: 1.4 },
    { time: '11:00', predictedGen: 4.8, expectedCons: 1.4, surplus: 3.4 },
    { time: '13:00', predictedGen: 5.2, expectedCons: 1.5, surplus: 3.7 },
    { time: '15:00', predictedGen: 4.2, expectedCons: 1.3, surplus: 2.9 },
    { time: '17:00', predictedGen: 1.8, expectedCons: 1.6, surplus: 0.2 },
    { time: '19:00', predictedGen: 0.0, expectedCons: 2.1, surplus: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Selector: AI Assistant vs Solar Forecast */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              AI Energy Intelligence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            AI Advisory & Generation Forecasting
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine learning models combining meteorological telemetry, feeder congestion, and dynamic pricing.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('ASSISTANT')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'ASSISTANT'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Energy Assistant</span>
          </button>
          <button
            onClick={() => setActiveSubTab('FORECAST')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'FORECAST'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Solar Forecast</span>
          </button>
        </div>
      </div>

      {/* AI ASSISTANT VIEW (Section 26) */}
      {activeSubTab === 'ASSISTANT' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chat Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-[560px]">
            {/* Chat Messages */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'AI' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'USER'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.actionLabel && (
                      <button
                        onClick={() => {
                          if (m.actionTab && onNavigateTab) {
                            onNavigateTab(m.actionTab);
                          } else if (onOpenSellWizard) {
                            onOpenSellWizard();
                          }
                        }}
                        className="mt-2.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        {m.actionLabel} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <span
                      className={`text-[9px] block mt-1.5 ${
                        m.sender === 'USER' ? 'text-emerald-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-slate-400">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="animate-pulse">Analyzing grid tariffs and weather sensors...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  placeholder="Ask about surplus timing, pricing strategy, or grid rules..."
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!inputPrompt.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Prompts & Knowledge Sidebar (Section 26) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  1-Click Instant Questions
                </h3>
              </div>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-xs text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-2 text-xs">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                Autonomous Dispatch Advisory
              </span>
              <h4 className="font-bold text-sm text-white">Peak Market Opportunity</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Smart meters in Region A show commercial demand surge expected at 14:00. Sellers listing at ₹4.55/kWh are clearing within 4 minutes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI SOLAR FORECAST VIEW (Section 25) */}
      {activeSubTab === 'FORECAST' && (
        <div className="space-y-6">
          {/* Headline Recommendation Card (Section 25) */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                Tomorrow's Predicted Opportunity
              </span>
              <h3 className="text-base font-bold text-white">
                "Offer 4.0 kWh tomorrow between 1:00 PM and 4:00 PM at ₹4.60/kWh."
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clear sunny skies forecast with 85% peak solar irradiation. Local home consumption will taper at 1:00 PM, giving you maximum profitable surplus.
              </p>
            </div>

            <button
              onClick={onOpenSellWizard}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Pre-Schedule Offer for Tomorrow
            </button>
          </div>

          {/* 4 Forecast Factor Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Predicted Generation</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900">14.8</span>
                <span className="text-xs text-slate-500">kWh</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> +19% vs today
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Weather Factor</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900">Sunny</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" /> 85% Solar Irradiation
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expected Consumption</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-slate-900">7.4</span>
                <span className="text-xs text-slate-500">kWh</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Normal household load</span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">Expected Surplus</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-emerald-700">7.4</span>
                <span className="text-xs text-emerald-600">kWh</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Eligible to offer</span>
            </div>
          </div>

          {/* Tomorrow's Predicted Hourly Curve Chart (Section 25) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tomorrow's Hourly Prediction Profile</h3>
                <p className="text-xs text-slate-500">Machine learning forecast integrating satellite weather inputs</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Predicted Gen
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Predicted Surplus
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastHourlyCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predGenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="predSurplusGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '10px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="predictedGen" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#predGenGrad)" name="Predicted Gen (kWh)" />
                  <Area type="monotone" dataKey="surplus" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#predSurplusGrad)" name="Forecast Surplus (kWh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
