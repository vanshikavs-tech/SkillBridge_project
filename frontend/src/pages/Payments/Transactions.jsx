import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, IndianRupee, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../store/authStore';
import { Loader } from '../../components/Loader';

export const Transactions = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await paymentService.getTransactions();
        setPayments(res.payments || []);
      } catch (err) {
        console.error('Failed to load transaction history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <Loader fullScreen message="Loading transaction records..." />;

  const totalAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Transaction & Billing History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Audited log of escrow payments, milestone releases, and platform settlements.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Settled Volume</span>
          <span className="block text-2xl font-black text-slate-900 mt-2">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">{payments.length} transactions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Security Standard</span>
          <span className="block text-2xl font-black text-emerald-600 mt-2">
            256-Bit SSL
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Stripe Escrow Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Default Currency</span>
          <span className="block text-2xl font-black text-brand-600 mt-2">
            INR (₹)
          </span>
          <span className="text-2xs text-slate-400 mt-1 block">Indian Rupee</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">All Transactions</h3>
          <span className="text-xs text-slate-400">Chronological audit ledger</span>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No transactions found on this account yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Transaction ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3">From / To</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const isIncoming = p.payeeId?._id === user?._id;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4 font-mono font-medium text-slate-600">
                        {p.stripePaymentIntentId || `#${p._id.slice(-8)}`}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {p.description}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {p.payerId?.name} &rarr; {p.payeeId?.name}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-3xs">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">
                        ₹{p.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-3xs">
                          <CheckCircle2 className="w-3 h-3" />
                          {p.status}
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
    </div>
  );
};
