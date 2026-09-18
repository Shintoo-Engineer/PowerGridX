import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Transaction } from '../../types/index.ts';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Receipt,
  FileText,
  AlertCircle,
  X,
  Zap,
  TrendingDown,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface Props {
  onNavigateTab?: (tab: string) => void;
}

export const WalletView: React.FC<Props> = ({ onNavigateTab }) => {
  const { user, refreshUserData } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Recharge Modal state
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('1000');
  const [rechargePaymentMethod, setRechargePaymentMethod] = useState('UPI');
  const [isRecharging, setIsRecharging] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  // Withdraw Modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        headers: user ? { 'Authorization': `Bearer ${user.id}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecharging(true);
    try {
      const res = await fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({ amount: Number(rechargeAmount) }),
      });

      if (res.ok) {
        setRechargeSuccess(true);
        await refreshUserData();
        setTimeout(() => {
          setRechargeSuccess(false);
          setShowRechargeModal(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecharging(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsWithdrawing(true);
    setWithdrawError(null);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.id}` : '',
        },
        body: JSON.stringify({ amount: Number(withdrawAmount) }),
      });

      if (res.ok) {
        setWithdrawSuccess(true);
        await refreshUserData();
        setTimeout(() => {
          setWithdrawSuccess(false);
          setShowWithdrawModal(false);
        }, 1200);
      } else {
        const err = await res.json();
        setWithdrawError(err.error || 'Failed to process withdrawal.');
      }
    } catch (e) {
      console.error(e);
      setWithdrawError('Network error processing withdrawal.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const isConsumer = user?.role === 'CONSUMER';
  const balance = Number(user?.walletBalance ?? 0);

  // For consumer: sum up all purchases they paid for
  const consumerPurchases = transactions.filter(t => t.buyerId === user?.id);
  const totalSpent = consumerPurchases.reduce(
    (sum, t) => sum + (t.grossAmount || t.netSellerAmount || 0), 0
  );

  // For prosumer/producer: sum up all sales they earned
  const sellerSales = transactions.filter(t => t.sellerId === user?.id);
  const totalEarned = sellerSales.reduce(
    (sum, t) => sum + (t.netSellerAmount || t.grossAmount || 0), 0
  );

  const pendingSettlement = Number(user?.pendingSettlement ?? 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {isConsumer ? 'Payment Wallet & Billing' : 'Energy Revenue & Wallet'}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant Clearing Escrow
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {isConsumer ? 'Consumer Energy Wallet' : 'Settlement & Revenue Wallet'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isConsumer
              ? 'Automated escrow balance for peer-to-peer electricity settlements and grid wheeling charges.'
              : 'Direct peer trading proceeds and real-time generation credits cleared against smart meter logs.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowRechargeModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Funds
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Wallet Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-bold">₹</span>
            <span className="text-3xl font-black text-slate-900">{balance.toFixed(2)}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for energy settlement
          </span>
        </div>

        {/* Total Payments (Spent or Earned) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isConsumer ? 'Total Energy Payments' : 'Total Revenue Settled'}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              {isConsumer ? <TrendingDown className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-bold">₹</span>
            <span className="text-3xl font-black text-slate-900">
              {isConsumer ? totalSpent.toFixed(2) : totalEarned.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-2">
            {isConsumer
              ? `${consumerPurchases.length} transactions executed • ₹0 if no payments`
              : `${sellerSales.length} trades settled via smart meter export`}
          </span>
        </div>

        {/* Pending Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Clearing
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-slate-400 font-bold">₹</span>
            <span className="text-3xl font-black text-slate-900">{pendingSettlement.toFixed(2)}</span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium block mt-2">
            Automated clearing interval: 18:00 IST
          </span>
        </div>
      </div>

      {/* Payment & Clearing Statement Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Payment & Transaction Statements</h2>
            <p className="text-xs text-slate-500">
              Auditable digital receipts linked to meter verification cycles.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {transactions.length} Records
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-semibold text-slate-700">No payment records logged yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Total Spent: ₹0.00 • Total Earned: ₹0.00.
              Transactions will automatically reflect here when energy is bought or sold.
            </p>
            {isConsumer && onNavigateTab && (
              <button
                onClick={() => onNavigateTab('marketplace')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                Browse Energy Marketplace
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tx Reference</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Energy (kWh)</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Wheeling / Grid Fee</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(tx => {
                  const isBuyer = tx.buyerId === user?.id;
                  const amt = tx.grossAmount || tx.netSellerAmount || 0;
                  const fee = tx.gridCharges || 0;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'Today'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isBuyer
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isBuyer ? 'ENERGY PURCHASE (DEBIT)' : 'SURPLUS SALE (CREDIT)'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {tx.energyKwh ? `${tx.energyKwh} kWh` : '0 kWh'}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {isBuyer ? `-₹${amt.toFixed(2)}` : `+₹${amt.toFixed(2)}`}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        ₹{fee.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {tx.status || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Add Funds to Wallet</h3>
              </div>
              <button onClick={() => setShowRechargeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {rechargeSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-900 text-sm">Funds Added Successfully!</div>
                <p className="text-xs text-slate-500">
                  ₹{Number(rechargeAmount).toFixed(2)} added to your wallet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecharge} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select / Enter Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={rechargeAmount}
                      onChange={e => setRechargeAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-base text-slate-900"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {['500', '1000', '2500', '5000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRechargeAmount(val)}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-colors ${
                          rechargeAmount === val
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                  <div className="space-y-1.5">
                    {['UPI (Google Pay / PhonePe)', 'Net Banking (All Major Banks)', 'Credit / Debit Card'].map(
                      m => (
                        <label
                          key={m}
                          className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={rechargePaymentMethod.startsWith(m.slice(0, 3))}
                            onChange={() => setRechargePaymentMethod(m)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-medium text-slate-800">{m}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-800">
                  Instant escrow credit. Zero processing fees on peer electricity trading.
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRechargeModal(false)}
                    className="flex-1 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRecharging}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    {isRecharging ? 'Processing...' : `Pay ₹${Number(rechargeAmount || 0).toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900">Withdraw to Bank</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="font-bold text-slate-900 text-sm">Withdrawal Initiated!</div>
                <p className="text-xs text-slate-500">
                  ₹{Number(withdrawAmount).toFixed(2)} routed via IMPS/NEFT to your linked bank account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                {withdrawError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-slate-600 font-semibold mb-1">
                    <span>Withdrawal Amount</span>
                    <span className="text-slate-400">Available: ₹{balance.toFixed(2)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="50"
                      max={balance}
                      step="50"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-base text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">Linked Payout Account:</div>
                  <div className="font-mono text-[11px]">HDFC Bank •••• 4092</div>
                  <div className="text-[10px] text-slate-400">IFSC: HDFC0001244</div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isWithdrawing || balance <= 0}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {isWithdrawing ? 'Transferring...' : `Withdraw ₹${Number(withdrawAmount || 0).toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
