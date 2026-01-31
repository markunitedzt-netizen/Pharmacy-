
import React, { useState } from 'react';
import { Item } from '../types';

interface ItemsSectionProps {
  items: Item[];
  onAddItem: (item: Item) => void;
  onUpdateItem: (item: Item) => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({ items, onAddItem, onUpdateItem }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Item>>({
    commercialName: '',
    scientificName: '',
    manufacturer: '',
    country: '',
    imageUrl: 'https://picsum.photos/seed/med/200/200',
    manufacturingDate: '',
    expiryDate: '',
    costPrice: 0,
    sellingPrice: 0,
    profitMargin: 0,
    quantity: 0,
    barcode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Item = {
      ...formData as Item,
      id: Math.random().toString(36).substr(2, 9),
      profitMargin: (formData.sellingPrice || 0) - (formData.costPrice || 0)
    };
    onAddItem(newItem);
    setShowForm(false);
    setFormData({
      commercialName: '',
      scientificName: '',
      manufacturer: '',
      country: '',
      imageUrl: 'https://picsum.photos/seed/med/200/200',
      manufacturingDate: '',
      expiryDate: '',
      costPrice: 0,
      sellingPrice: 0,
      profitMargin: 0,
      quantity: 0,
      barcode: ''
    });
  };

  const handleExcelImport = () => {
    alert("Simulating Excel Import Logic...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Medicines Inventory</h2>
          <p className="text-slate-500">Add, edit, and manage your pharmaceutical catalog</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExcelImport}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <i className="fa-solid fa-file-excel text-emerald-600"></i>
            Import Excel
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <i className="fa-solid fa-plus"></i>
            Add New Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Scientific Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Selling</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="font-bold text-slate-800">{item.commercialName}</p>
                        <p className="text-xs text-slate-400">{item.manufacturer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 italic">{item.scientificName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.expiryDate}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">${item.costPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${item.sellingPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Register New Medicine</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Commercial Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.commercialName} onChange={e => setFormData({...formData, commercialName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Scientific Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.scientificName} onChange={e => setFormData({...formData, scientificName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Barcode</label>
                <div className="relative">
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} />
                  <i className="fa-solid fa-camera absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-emerald-500"></i>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Manufacturer</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Country</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Stock Quantity</label>
                <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Manufacturing Date</label>
                <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.manufacturingDate} onChange={e => setFormData({...formData, manufacturingDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Expiry Date</label>
                <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Item Image</label>
                <input type="file" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 text-xs text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Cost Price</label>
                <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Selling Price</label>
                <input type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})} />
              </div>
              <div className="flex items-end pb-1">
                <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsSection;
