
import React, { useState, useMemo } from 'react';
import { Invoice } from '../types';

interface AccountingSectionProps {
  invoices: Invoice[];
  onRestore: (id: string) => void;
  currency: string;
}

const AccountingSection: React.FC<AccountingSectionProps> = ({ invoices, onRestore, currency }) => {
  const [view, setView] = useState<'yearly' | 'monthly' | 'daily' | 'invoices'>('yearly');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const stats = useMemo(() => {
    const validInvoices = invoices.filter(inv => !inv.isRestored);
    const totalRevenue = validInvoices.reduce((acc, curr) => acc + curr.totalCost, 0);
    const totalProfit = validInvoices.reduce((acc, curr) => acc + curr.totalProfit, 0);
    return { totalRevenue, totalProfit };
  }, [invoices]);

  const treeData = useMemo(() => {
    const tree: Record<number, Record<number, Record<number, Invoice[]>>> = {};
    invoices.forEach(inv => {
      const date = new Date(inv.timestamp);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      if (!tree[y]) tree[y] = {};
      if (!tree[y][m]) tree[y][m] = {};
      if (!tree[y][m][d]) tree[y][m][d] = [];
      tree[y][m][d].push(inv);
    });
    return tree;
  }, [invoices]);

  const renderContent = () => {
    if (view === 'yearly') {
      const years = Object.keys(treeData).sort((a, b) => Number(b) - Number(a));
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {years.map(y => {
            const yearNum = Number(y);
            const yearInvoices = Object.values(treeData[yearNum]).flatMap(m => Object.values(m).flat());
            const rev = yearInvoices.filter(i => !i.isRestored).reduce((a, c) => a + c.totalCost, 0);
            const prof = yearInvoices.filter(i => !i.isRestored).reduce((a, c) => a + c.totalProfit, 0);
            return (
              <button 
                key={y} onClick={() => { setSelectedYear(yearNum); setView('monthly'); }}
                className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-folder-open text-xl"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">{y}</h3>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Yearly Revenue</p>
                  <p className="text-xl font-bold text-slate-700">{currency}{rev.toFixed(2)}</p>
                  <p className="text-sm font-bold text-emerald-600">Profit: {currency}{prof.toFixed(2)}</p>
                </div>
              </button>
            );
          })}
          {years.length === 0 && <p className="col-span-full text-center py-12 text-slate-400">No invoices recorded yet.</p>}
        </div>
      );
    }

    if (view === 'monthly' && selectedYear) {
      const months = Object.keys(treeData[selectedYear]).sort((a, b) => Number(b) - Number(a));
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <button onClick={() => setView('yearly')} className="col-span-full text-sm font-bold text-emerald-600 hover:underline mb-2 flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Back to Years
           </button>
           {months.map(m => {
              const monthNum = Number(m);
              const monthName = new Date(2000, monthNum - 1).toLocaleString('default', { month: 'long' });
              // Fix: Explicitly cast monthInvoices to Invoice[] to resolve TS 'unknown' type inference errors on lines 83, 84, 94, and 98
              const monthInvoices = Object.values(treeData[selectedYear][monthNum]).flat() as Invoice[];
              const rev = monthInvoices.filter(i => !i.isRestored).reduce((a, c) => a + c.totalCost, 0);
              const prof = monthInvoices.filter(i => !i.isRestored).reduce((a, c) => a + c.totalProfit, 0);
              return (
                <button 
                  key={m} onClick={() => { setSelectedMonth(monthNum); setView('daily'); }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-500 transition-all text-left"
                >
                  <h3 className="text-xl font-black text-slate-800 mb-3">{monthName}</h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="font-bold text-slate-700">{currency}{rev.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Net Profit</p>
                      <p className="font-bold text-emerald-600">{currency}{prof.toFixed(2)}</p>
                    </div>
                  </div>
                </button>
              );
           })}
        </div>
      );
    }

    if (view === 'daily' && selectedYear && selectedMonth) {
      const days = Object.keys(treeData[selectedYear][selectedMonth]).sort((a, b) => Number(b) - Number(a));
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
           <button onClick={() => setView('monthly')} className="col-span-full text-sm font-bold text-emerald-600 hover:underline mb-2 flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Back to Months
           </button>
           {days.map(d => {
              const dayNum = Number(d);
              const dayInvoices = treeData[selectedYear][selectedMonth][dayNum];
              const rev = dayInvoices.filter(i => !i.isRestored).reduce((a, c) => a + c.totalCost, 0);
              return (
                <button 
                  key={d} onClick={() => { setSelectedDay(dayNum); setView('invoices'); }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all text-left"
                >
                  <p className="text-sm text-slate-400 mb-1">Day</p>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{d}</h3>
                  <p className="text-xs font-bold text-slate-700">{currency}{rev.toFixed(2)}</p>
                </button>
              );
           })}
        </div>
      );
    }

    if (view === 'invoices' && selectedYear && selectedMonth && selectedDay) {
      const dayInvoices = treeData[selectedYear][selectedMonth][selectedDay];
      return (
        <div className="space-y-4">
           <button onClick={() => setView('daily')} className="text-sm font-bold text-emerald-600 hover:underline mb-2 flex items-center gap-2">
            <i className="fa-solid fa-arrow-left"></i> Back to Days
           </button>
           <div className="space-y-4">
             {dayInvoices.map(inv => (
                <div key={inv.id} className={`bg-white rounded-2xl p-6 border-l-4 shadow-sm flex items-center justify-between ${inv.isRestored ? 'border-red-500 bg-red-50/30' : 'border-emerald-500'}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-slate-400">#{inv.serialNumber.toString().padStart(6, '0')}</span>
                      <span className="text-xs font-medium text-slate-500">{new Date(inv.timestamp).toLocaleTimeString()}</span>
                      {inv.isRestored && <span className="text-[10px] font-black uppercase text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Returned / Cancelled</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {inv.items.map(item => (
                        <span key={item.id} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {item.commercialName} (x{item.selectedQuantity})
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <p className="text-sm font-bold text-slate-800">Total: {currency}{inv.totalCost.toFixed(2)}</p>
                      <p className="text-sm font-bold text-emerald-600">Profit: {currency}{inv.totalProfit.toFixed(2)}</p>
                    </div>
                  </div>
                  {!inv.isRestored && (
                    <button 
                      onClick={() => onRestore(inv.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <i className="fa-solid fa-rotate-left"></i>
                      Restore Invoice
                    </button>
                  )}
                </div>
             ))}
           </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Accounting & Reports</h2>
          <p className="text-slate-500">Track your financial performance across time</p>
        </div>
        <div className="flex gap-6">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lifetime Revenue</p>
            <p className="text-2xl font-black text-slate-800">{currency}{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-500 px-6 py-4 rounded-3xl shadow-lg shadow-emerald-500/20">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Total Net Profit</p>
            <p className="text-2xl font-black text-white">{currency}{stats.totalProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AccountingSection;
