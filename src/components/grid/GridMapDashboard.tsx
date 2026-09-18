import React, { useState, useEffect } from 'react';
import { GridTelemetry, GridNode } from '../../types/index.ts';
import {
  Activity,
  Server,
  Zap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
  Building2,
  Home,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';

export const GridMapDashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<GridTelemetry | null>(null);
  const [selectedNode, setSelectedNode] = useState<GridNode | null>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/grid/telemetry');
      if (res.ok) {
        const data: GridTelemetry = await res.json();
        setTelemetry(data);
        if (selectedNode) {
          const updated = data.nodes.find(n => n.id === selectedNode.id);
          if (updated) setSelectedNode(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateDispatch = () => {
    setIsDispatching(true);
    setDispatchAlert(null);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchAlert('Dispatch directive issued: Feeder B-04 load curtailed by 3.2 MW. Frequency stabilized.');
      fetchTelemetry();
    }, 1200);
  };

  const t = telemetry || {
    totalGenerationMw: 145.2,
    totalDemandMw: 132.8,
    reserveMarginMw: 12.4,
    frequencyHz: 50.02,
    voltageStabilityPct: 99.4,
    activeProsumers: 420,
    activeProducers: 14,
    congestionAlerts: ['Feeder 11kV-B4 near 88% thermal threshold'],
    nodes: [
      {
        id: 'node-sub-a',
        name: 'Substation Alpha (North)',
        type: 'SUBSTATION',
        currentLoadMw: 45.2,
        capacityMw: 60.0,
        status: 'NORMAL',
        connectedProsumers: 210,
        connectedProducers: 2,
        voltageKv: 66,
        x: 200,
        y: 180,
      },
      {
        id: 'node-solar-farm',
        name: 'Solar Park 1 (Producer)',
        type: 'PRODUCER',
        currentLoadMw: 25.0,
        capacityMw: 25.0,
        status: 'NORMAL',
        connectedProsumers: 0,
        connectedProducers: 1,
        voltageKv: 33,
        x: 80,
        y: 80,
      },
      {
        id: 'node-prosumer-cluster',
        name: 'Greenwood Prosumer Cluster',
        type: 'PROSUMER_CLUSTER',
        currentLoadMw: 8.5,
        capacityMw: 15.0,
        status: 'NORMAL',
        connectedProsumers: 210,
        connectedProducers: 0,
        voltageKv: 11,
        x: 350,
        y: 90,
      },
      {
        id: 'node-sub-b',
        name: 'Substation Beta (Industrial)',
        type: 'SUBSTATION',
        currentLoadMw: 58.6,
        capacityMw: 65.0,
        status: 'CONGESTED',
        connectedProsumers: 85,
        connectedProducers: 3,
        voltageKv: 66,
        x: 480,
        y: 220,
      },
      {
        id: 'node-consumer-hub',
        name: 'Metro Tech Hub (Consumer)',
        type: 'CONSUMER_HUB',
        currentLoadMw: 32.0,
        capacityMw: 40.0,
        status: 'NORMAL',
        connectedProsumers: 0,
        connectedProducers: 0,
        voltageKv: 11,
        x: 320,
        y: 320,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Dispatch Header (Section 23) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              State Load Dispatch Centre (SLDC)
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live SCADA Stream
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Grid Topology & Telemetry Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical distribution network status, active prosumer cluster feeds, and transformer load limits.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchTelemetry}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Refresh SCADA telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSimulateDispatch}
            disabled={isDispatching}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> {isDispatching ? 'Transmitting Directive...' : 'Simulate Grid Dispatch'}
          </button>
        </div>
      </div>

      {dispatchAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispatchAlert}</span>
          </div>
          <button onClick={() => setDispatchAlert(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Telemetry Core Metrics (Section 23) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Generation</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-slate-900">{t.totalGenerationMw}</span>
            <span className="text-xs text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Supply online</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Demand</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-slate-900">{t.totalDemandMw}</span>
            <span className="text-xs text-slate-500">MW</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Active aggregate load</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Reserve Margin</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-emerald-700">+{t.reserveMarginMw}</span>
            <span className="text-xs text-emerald-600">MW</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Adequate cushion</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Grid Frequency</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-slate-900">{t.frequencyHz}</span>
            <span className="text-xs text-slate-500">Hz</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">IEGC Band (Normal)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Voltage Stability</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-slate-900">{t.voltageStabilityPct}%</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Synchronous lock</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Prosumers / Gen</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-slate-900">{t.activeProsumers}</span>
            <span className="text-xs text-slate-500">homes</span>
          </div>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">DER cluster active</span>
        </div>
      </div>

      {/* Congestion Notification */}
      {t.congestionAlerts.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Congestion Warning:</strong> {t.congestionAlerts.join('; ')}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
            Feeder Alert
          </span>
        </div>
      )}

      {/* INTERACTIVE GRID MAP CANVAS (Section 21) */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Interactive Network Topology Map</h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              Click any node to inspect telemetry
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High Load / Congested
            </span>
          </div>
        </div>

        {/* SVG Grid Diagram */}
        <div className="relative w-full h-[400px] bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 400">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>

              {/* Animated energy pulse circle */}
              <circle id="pulse" r="3" fill="#34D399">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </defs>

            {/* Transmission and Distribution Lines with energy arrows */}
            {/* Solar Farm -> Substation A */}
            <line x1="80" y1="80" x2="200" y2="180" stroke="#10B981" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
            {/* Prosumer Cluster -> Substation A */}
            <line x1="350" y1="90" x2="200" y2="180" stroke="#3B82F6" strokeWidth="2" />
            {/* Substation A -> Substation B (66kV Inter-tie) */}
            <line x1="200" y1="180" x2="480" y2="220" stroke="#8B5CF6" strokeWidth="3.5" />
            {/* Substation A -> Metro Consumer Hub */}
            <line x1="200" y1="180" x2="320" y2="320" stroke="#10B981" strokeWidth="2" />
            {/* Substation B -> Metro Consumer Hub */}
            <line x1="480" y1="220" x2="320" y2="320" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="6 3" />

            {/* Moving Pulses on lines */}
            <circle cx="140" cy="130" r="3" fill="#34D399" />
            <circle cx="275" cy="135" r="2.5" fill="#60A5FA" />
            <circle cx="340" cy="200" r="4" fill="#A78BFA" />
            <circle cx="400" cy="270" r="3" fill="#FBBF24" />

            {/* Nodes */}
            {t.nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isCongested = node.status === 'CONGESTED';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse if selected */}
                  {isSelected && (
                    <circle r="26" fill="none" stroke="#A78BFA" strokeWidth="2" className="animate-ping" />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="18"
                    fill={isCongested ? '#F59E0B' : isSelected ? '#8B5CF6' : '#1E293B'}
                    stroke={isCongested ? '#FCD34D' : '#334155'}
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Node Icon */}
                  <text
                    textAnchor="middle"
                    dy="5"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {node.type === 'PRODUCER' ? '⚡' : node.type === 'PROSUMER_CLUSTER' ? '🏠' : node.type === 'CONSUMER_HUB' ? '🏢' : '⚙️'}
                  </text>

                  {/* Node Label */}
                  <text
                    y="32"
                    textAnchor="middle"
                    fill={isSelected ? '#C4B5FD' : '#94A3B8'}
                    fontSize="10"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {node.name}
                  </text>
                  <text
                    y="44"
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="9"
                    className="select-none pointer-events-none font-mono"
                  >
                    {node.currentLoadMw} MW ({Math.round((node.currentLoadMw / node.capacityMw) * 100)}%)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Floating Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-[10px] text-slate-300 space-y-1 backdrop-blur-xs">
            <div className="font-bold text-slate-200">Network Legend</div>
            <div>⚡ Producer Plant (33kV)</div>
            <div>🏠 Rooftop Solar Cluster (11kV)</div>
            <div>⚙️ Utility Substation (66kV)</div>
            <div>🏢 Consumer Commercial Hub</div>
          </div>
        </div>

        {/* Selected Node Details Drawer / Card (Section 21) */}
        {selectedNode ? (
          <div className="mt-4 p-4 bg-slate-800/90 border border-slate-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded-md border border-purple-800">
                  {selectedNode.type}
                </span>
                <h4 className="font-bold text-sm text-white">{selectedNode.name}</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedNode.status === 'CONGESTED'
                      ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                      : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1 font-mono">
                <span>Current Load: <strong className="text-white">{selectedNode.currentLoadMw} MW</strong></span>
                <span>Transformer Capacity: <strong className="text-white">{selectedNode.capacityMw} MW</strong></span>
                <span>Bus Voltage: <strong className="text-white">{selectedNode.voltageKv} kV</strong></span>
                <span>Connected Prosumers: <strong className="text-emerald-400">{selectedNode.connectedProsumers}</strong></span>
                <span>Connected Producers: <strong className="text-amber-400">{selectedNode.connectedProducers}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-slate-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
            Click any network node on the map above to view transformer capacity, feeder congestion, and connected rooftop prosumers.
          </div>
        )}
      </div>

      {/* Grid Regulatory Notice */}
      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Grid Code & Open-Access Protocol:</strong> Transmission and distribution capacity allocations are reconciled in accordance with national grid standards. PowerGridX schedules market contracts while state utilities maintain physical frequency and voltage regulation.
        </div>
      </div>
    </div>
  );
};
