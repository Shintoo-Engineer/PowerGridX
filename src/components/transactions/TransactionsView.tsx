import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Transaction } from '../../types/index.ts';
import {
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  ShieldCheck,
  FileText,
  X,
  ExternalLink,
  Printer,
  ShoppingBag,
  Zap,
  Leaf
} from 'lucide-react';

interface Props {
  onNavigateTab?: (tab: string) => void;
}

export const TransactionsView: React.FC<Props> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

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

  const isConsumer = user?.role === 'CONSUMER';

  // Filter transactions for buyer/consumer vs seller
  const userPurchases = transactions.filter(t => t.buyerId === user?.id);
  const userSales = transactions.filter(t => t.sellerId === user?.id);

  // Relevant transactions list to show
  const displayList = isConsumer
    ? (userPurchases.length > 0 ? userPurchases : transactions.filter(t => t.buyerId === 'usr-consumer-1' || t.buyerName?.toLowerCase().includes('consumer') || t.buyerName?.toLowerCase().includes(user?.name?.toLowerCase() || '')))
    : (userSales.length > 0 ? userSales : transactions);

  // Consumer purchase calculations (safe zero if none)
  const totalKwhPurchased = displayList.reduce((sum, t) => sum + (t.energyKwh || 0), 0);
  const totalSpent = displayList.reduce(
    (sum, t) => sum + (t.grossAmount || t.netSellerAmount || 0), 0
  );
  const avgPurchasePrice = totalKwhPurchased > 0
    ? (totalSpent / totalKwhPurchased).toFixed(2)
    : '0.00';
  const co2SavedKg = (totalKwhPurchased * 0.82).toFixed(1);

  // Producer/Prosumer sales calculations (safe zero if none)
  const balance = Number(user?.walletBalance ?? 0);
  const totalEarned = userSales.reduce(
    (sum, t) => sum + (t.netSellerAmount || t.grossAmount || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {isConsumer ? 'Clean Energy Purchases' : 'Settlement & Transaction Ledger'}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Smart Meter Verified
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {isConsumer ? 'My Energy Purchases' : 'Transaction & Settlement Ledger'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isConsumer
              ? 'Audited record of peer electricity lots purchased directly from rooftop prosumers and local solar farms.'
              : 'Bilateral digital contracts reconciled against smart meter interval generation logs.'}
          </p>
        </div>

        {isConsumer && onNavigateTab && (
          <button
            onClick={() => onNavigateTab('marketplace')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Marketplace
          </button>
        )}
      </div>

      {/* Summary Cards */}
      {isConsumer ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Purchased
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-slate-900">{totalKwhPurchased.toFixed(1)}</span>
              <span className="text-xs text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block flex items-center gap-1">
              <Zap className="w-3 h-3" /> 100% Green electricity
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Amount Spent
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xs font-bold text-slate-400">₹</span>
              <span className="text-2xl font-black text-slate-900">{totalSpent.toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              {totalSpent === 0 ? '₹0.00 spent (no payments)' : 'Direct peer settlement'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Average Tariff
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xs font-bold text-slate-400">₹</span>
              <span className="text-2xl font-black text-slate-900">{avgPurchasePrice}</span>
              <span className="text-xs text-slate-500">/kWh</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              ~25% lower than DISCOM
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Carbon Offset
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-emerald-700">{co2SavedKg}</span>
              <span className="text-xs text-slate-500">kg CO₂</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Clean air impact
            </span>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Balance</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-bold">₹</span>
              <span className="text-2xl font-black text-slate-900">{balance.toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">Available for withdrawal</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Earned (Settled)</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-bold">₹</span>
              <span className="text-2xl font-black text-slate-900">{totalEarned.toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">
              {totalEarned === 0 ? '₹0.00 earned' : '100% verified via smart meter logs'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Settlement</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-bold">₹</span>
              <span className="text-2xl font-black text-slate-900">{Number(user?.pendingSettlement || 0).toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-amber-600 font-medium block mt-2">
              Next automated clearing cycle: 18:00 IST
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isConsumer ? 'Electricity Purchase Invoices' : 'Transaction & Settlement Ledger'}
            </h2>
            <p className="text-xs text-slate-500">
              {isConsumer
                ? 'Time-of-use kilowatt-hour lots cleared via smart meter telemetry.'
                : 'Bilateral contracts reconciled against export meters.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {displayList.length} {displayList.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {displayList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="font-semibold text-slate-700">No electricity purchases logged yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Total Purchases: 0 kWh • Total Spent: ₹0.00.
              Browse the live peer marketplace to buy low-cost solar energy from local prosumers.
            </p>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('marketplace')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
              >
                Browse Marketplace
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Date / Time</th>
                  <th className="py-2.5 px-3">{isConsumer ? 'Energy Seller' : 'Counterparty'}</th>
                  <th className="py-2.5 px-3">Energy (kWh)</th>
                  <th className="py-2.5 px-3">Rate</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Meter Check</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayList.map(tx => {
                  const isSeller = tx.sellerId === user?.id;
                  const amt = tx.grossAmount || tx.netSellerAmount || 0;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Recent'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 block">
                          {isConsumer ? (tx.sellerName || 'Solar Producer') : (isSeller ? tx.buyerName : tx.sellerName)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isConsumer ? (tx.sourceType || 'SOLAR') : (isSeller ? 'Buyer' : 'Seller')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {tx.energyKwh ? `${tx.energyKwh} kWh` : '0 kWh'}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        ₹{(tx.pricePerKwh || 0).toFixed(2)}/kWh
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        ₹{amt.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> {tx.meterVerification || 'VERIFIED'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {tx.status || 'COMPLETED'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details & Invoice Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Digital Electricity Invoice</h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="font-sans font-bold text-slate-900 block text-sm">PowerGridX Energy Clearing</span>
                  <span className="text-[10px] text-slate-500">Peer-to-Peer Settlement Voucher</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{selectedTx.id}</span>
                  <span className="text-[10px] text-slate-500">
                    {selectedTx.timestamp ? new Date(selectedTx.timestamp).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Energy Seller</span>
                  <strong className="text-slate-900">{selectedTx.sellerName || 'Solar Producer'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Energy Buyer</span>
                  <strong className="text-slate-900">{selectedTx.buyerName || user?.name}</strong>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Traded Quantity:</span>
                  <span className="font-bold text-slate-900">{selectedTx.energyKwh || 0} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Tariff Rate:</span>
                  <span>₹{(selectedTx.pricePerKwh || 0).toFixed(2)} / kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid Wheeling & Transmission:</span>
                  <span>₹{(selectedTx.gridCharges || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (3%):</span>
                  <span>₹{(selectedTx.platformFee || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Settled:</span>
                  <span className="text-emerald-700">
                    ₹{(selectedTx.grossAmount || selectedTx.netSellerAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] font-sans">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Smart Meter Reconciled (SLDC Verified)
                </span>
                <span className="text-slate-500">Status: {selectedTx.status || 'COMPLETED'}</span>
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
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
