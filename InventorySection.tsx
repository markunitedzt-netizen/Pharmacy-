
import React, { useMemo } from 'react';
import { Item, Settings } from '../types';

interface InventorySectionProps {
  items: Item[];
  settings: Settings;
}

const InventorySection: React.FC<InventorySectionProps> = ({ items, settings }) => {
  const inventoryStats = useMemo(() => {
    const totalItems = items.length;
    const lowStock = items.filter(i => i.quantity < 10).length;
    const expiringSoon = items.filter(item => {
      const diffTime = new Date(item.expiryDate).getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= settings.expiryReminderDays;
    }).length;
    const expired = items.filter(item => new Date(item.expiryDate).getTime() < new Date().getTime()).length;

    return { totalItems, lowStock, expiringSoon, expired };
  }, [items, settings]);

  const getExpiryStatus = (expiryDate: string) => {
    const diffTime = new Date(expiryDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'text-red-600 bg-red-50', days: diffDays };
    if (diffDays <= settings.expiryReminderDays) return { label: `Expiring in ${diffDays}d`, color: 'text-amber-600 bg-amber-50', days: diffDays };
    return { label: `Safe (${diffDays}d)`, color: 'text-emerald-600 bg-emerald-50', days: diffDays };
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Stocked', value: inventoryStats.totalItems, icon: 'fa-boxes-stacked', color: 'bg-blue-500' },
          { label: 'Low Stock Items', value: inventoryStats.lowStock, icon: 'fa-triangle-exclamation', color: 'bg-amber-500' },
          { label: 'Expiring Soon', value: inventoryStats.expiringSoon, icon: 'fa-clock-rotate-left', color: 'bg-orange-500' },
          { label: 'Expired Items', value: inventoryStats.expired, icon: 'fa-circle-xmark', color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Storage Monitoring</h3>
          <div className="flex gap-2">
             <button className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">Export Report</button>
             <button className="px-4 py-2 text-sm font-bold bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">Inventory Audit</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Qty</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiration Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time Remaining</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => {
                const status = getExpiryStatus(item.expiryDate);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{item.commercialName}</p>
                      <p className="text-xs text-slate-400">{item.barcode}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.quantity > 10 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                        <span className="font-bold text-slate-700">{item.quantity} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.expiryDate}</td>
                    <td className="px-6 py-4">
                       <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px] mb-2">
                          <div 
                            className={`h-1.5 rounded-full ${status.days < 30 ? 'bg-red-500' : status.days < 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, Math.max(0, (status.days / 365) * 100))}%` }}
                          ></div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400">{status.days > 0 ? `${status.days} days left` : 'Expired'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
