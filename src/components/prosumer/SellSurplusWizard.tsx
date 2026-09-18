import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { EnergyAsset } from '../../types/index.ts';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sun,
  AlertCircle,
  ShieldCheck,
  Clock,
  DollarSign,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOfferCreated?: () => void;
}

export const SellSurplusWizard: React.FC<Props> = ({ isOpen, onClose, onOfferCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [assets, setAssets] = useState<EnergyAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [amountKwh, setAmountKwh] = useState<string>('3.0');
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [pricingType, setPricingType] = useState<'FIXED' | 'SMART_MARKET'>('FIXED');
  const [pricePerKwh, setPricePerKwh] = useState<string>('4.50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      fetchAssets();
      setStep(1);
    }
  }, [isOpen, user]);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets', {
        headers: user ? { 'Authorization': `Bearer ${user.id}` } : {},
      });
      if (res.ok) {
        const data: EnergyAsset[] = await res.json();
        setAssets(data);
        if (data.length > 0) {
          setSelectedAssetId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.id === selectedAssetId) || assets[0] || {
    id: 'ast-solar-home-1',
    name: 'My Rooftop Solar',
    sourceType: 'SOLAR',
    capacityKw: 5.0,
    todayGenerationKwh: 12.4,
    homeConsumptionKwh: 7.1,
    surplusKwh: 5.3,
    region: 'Region A — North Grid',
  };

  const eligibleSurplus = currentAsset.surplusKwh || 5.3;

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 3) {
      const num = Number(amountKwh);
      if (isNaN(num) || num <= 0) {
        setErrorMsg('Please enter a valid energy quantity greater than 0.');
        return;
      }
      if (num > eligibleSurplus) {
        setErrorMsg(`Offer amount (${num} kWh) cannot exceed eligible surplus (${eligibleSurplus} kWh).`);
        return;
      }
    }
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMsg(null);
    }
  };

  const handleListSurplus = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({
          assetId: currentAsset.id,
          quantityKwh: Number(amountKwh),
          pricePerKwh: Number(pricePerKwh),
          startTime,
          endTime,
          pricingType,
        }),
      });

      if (res.ok) {
        setStep(7); // Show success step
        if (onOfferCreated) onOfferCreated();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to list surplus');
      }
    } catch (e) {
      setErrorMsg('Network error while listing surplus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col">
        {/* Wizard Header & Progress */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Sell Surplus Electricity • Step {Math.min(step, 6)} of 6
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {step === 1 && 'Select Energy Asset'}
              {step === 2 && 'Current Energy Situation'}
              {step === 3 && 'Amount to Offer'}
              {step === 4 && 'Availability Schedule'}
              {step === 5 && 'Pricing Selection'}
              {step === 6 && 'Review & Authorize Offer'}
              {step === 7 && 'Surplus Listed Successfully!'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-5 overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }}
          />
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body content based on Step */}
        <div className="flex-1 py-1">
          {/* STEP 1: Select Energy Asset */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Choose the verified generation asset supplying your surplus electricity:
              </p>
              <div className="space-y-2">
                {assets.map(asset => (
                  <label
                    key={asset.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAssetId === asset.id
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="asset"
                        value={asset.id}
                        checked={selectedAssetId === asset.id}
                        onChange={() => setSelectedAssetId(asset.id)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{asset.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {asset.sourceType} • {asset.capacityKw} kW • Meter {asset.meterId}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                      {asset.surplusKwh} kWh Surplus
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Current Energy Situation */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Real-time meter telemetry for <strong>{currentAsset.name}</strong>:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-sans text-slate-600">Today's Generation:</span>
                  <span className="font-bold text-emerald-700">{currentAsset.todayGenerationKwh} kWh</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-sans text-slate-600">Home Consumption:</span>
                  <span className="font-bold text-amber-700">- {currentAsset.homeConsumptionKwh} kWh</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-bold text-slate-900">
                  <span className="font-sans text-slate-800">Potential Surplus:</span>
                  <span className="text-emerald-600 text-sm">{eligibleSurplus} kWh</span>
                </div>
              </div>

              {eligibleSurplus <= 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  No surplus currently available. Your home consumption exceeds or equals your current solar generation.
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You have {eligibleSurplus} kWh eligible for marketplace trading.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Amount to Offer */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Specify how many kWh you want to offer. You cannot exceed your eligible available surplus of{' '}
                <strong>{eligibleSurplus} kWh</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Surplus Quantity to Offer (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max={eligibleSurplus}
                    value={amountKwh}
                    onChange={(e) => setAmountKwh(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAmountKwh(String(eligibleSurplus))}
                    className="absolute right-2 top-2 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md"
                  >
                    Max ({eligibleSurplus} kWh)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Example: If you generate 12 kWh and consume 7 kWh, offering 3 kWh retains 2 kWh safety margin for your evening household loads.
              </p>
            </div>
          )}

          {/* STEP 4: Availability */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Set the delivery time window when your surplus is exported to the grid:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-0.5">Peak Solar Window</span>
                Most local prosumers offer electricity between 12:00 PM and 5:00 PM when solar irradiation is highest.
              </div>
            </div>
          )}

          {/* STEP 5: Pricing */}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">Choose your pricing model:</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setPricingType('FIXED');
                    setPricePerKwh('4.50');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    pricingType === 'FIXED'
                      ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold block">Fixed Price</span>
                  <span className="text-[10px] text-slate-500">You set a flat rate per kWh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPricingType('SMART_MARKET');
                    setPricePerKwh('4.15');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    pricingType === 'SMART_MARKET'
                      ? 'border-emerald-600 bg-emerald-50 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold block">Smart Market Pricing</span>
                  <span className="text-[10px] text-slate-500">Auto-clears at dynamic rate</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selling Price (₹ / kWh)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.05"
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Demo Market Range */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold block">Indicative Market Benchmark (Demo):</span>
                <span>Prosumer rooftop range: ₹4.20 – ₹4.80/kWh. Utility grid retail tariff: ₹7.50/kWh.</span>
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Energy to Offer:</span>
                  <span className="font-bold text-slate-900">{amountKwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source:</span>
                  <span className="font-bold text-emerald-700">{currentAsset.sourceType} (Rooftop Solar)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seller:</span>
                  <span className="font-bold text-slate-900">{user?.name} (Verified Prosumer)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price:</span>
                  <span className="font-bold text-emerald-700">₹{pricePerKwh} / kWh ({pricingType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability:</span>
                  <span className="font-bold text-slate-900">{startTime} – {endTime}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-slate-800">Total Expected Gross:</span>
                  <span className="text-emerald-700">₹{(Number(amountKwh) * Number(pricePerKwh)).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  By listing, you authorize PowerGridX to match your surplus on the digital exchange. Physical delivery occurs over the existing distribution network.
                </span>
              </div>
            </div>
          )}

          {/* STEP 7: Success Screen */}
          {step === 7 && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Offer Status: ACTIVE</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your surplus of <strong>{amountKwh} kWh</strong> is now live in the PowerGridX Marketplace at <strong>₹{pricePerKwh}/kWh</strong>.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 max-w-xs mx-auto text-left space-y-1">
                <p>• Smart matching engine will pair local demand</p>
                <p>• Meter interval verification automatic</p>
                <p>• Earnings credited directly to your wallet</p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
          {step > 1 && step < 7 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 6 && (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 2 && eligibleSurplus <= 0}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 6 && (
            <button
              type="button"
              onClick={handleListSurplus}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Listing...' : 'LIST SURPLUS'} <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}

          {step === 7 && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              Done & View Marketplace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
