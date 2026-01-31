
import React, { useState, useMemo } from 'react';
import { Item, InvoiceItem } from '../types';

interface SalesSectionProps {
  items: Item[];
  onCheckout: (items: InvoiceItem[]) => void;
}

const SalesSection: React.FC<SalesSectionProps> = ({ items, onCheckout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm)
    );
  }, [items, searchTerm]);

  const addToCart = (item: Item) => {
    if (item.quantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.selectedQuantity >= item.quantity) return prev;
        return prev.map(i => i.id === item.id ? { ...i, selectedQuantity: i.selectedQuantity + 1 } : i);
      }
      return [...prev, { ...item, selectedQuantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, Math.min(i.quantity, i.selectedQuantity + delta));
        return { ...i, selectedQuantity: newQty };
      }
      return i;
    }));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.sellingPrice * curr.selectedQuantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onCheckout(cart);
    setCart([]);
    alert('Invoice processed successfully!');
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Search by name, scientific name, or scan barcode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 outline-none text-lg shadow-sm pl-14"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
          </div>
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`p-4 rounded-2xl transition-all shadow-lg ${isScanning ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
          >
            <i className={`fa-solid ${isScanning ? 'fa-xmark' : 'fa-barcode'} text-xl`}></i>
          </button>
        </div>

        {isScanning && (
          <div className="mb-6 bg-slate-900 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-4">
                <i className="fa-solid fa-camera text-6xl opacity-20"></i>
                <p className="text-sm">Mock Barcode Scanner Active</p>
                <div className="w-64 h-1 bg-emerald-500/30 relative">
                  <div className="absolute inset-0 bg-emerald-500 animate-[scan_2s_infinite]"></div>
                </div>
             </div>
             <style>{`
               @keyframes scan {
                 0% { transform: translateY(-50px); opacity: 0; }
                 50% { opacity: 1; }
                 100% { transform: translateY(50px); opacity: 0; }
               }
             `}</style>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                onClick={() => addToCart(item)}
                className={`group bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden ${item.quantity <= 0 ? 'opacity-60 grayscale' : ''}`}
              >
                <div className="aspect-square rounded-xl mb-4 overflow-hidden bg-slate-100">
                  <img src={item.imageUrl} alt={item.commercialName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 truncate">{item.commercialName}</h3>
                  <p className="text-xs text-slate-500 italic truncate mb-2">{item.scientificName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">${item.sellingPrice.toFixed(2)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.quantity > 10 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {item.quantity} In Stock
                    </span>
                  </div>
                </div>
                {item.quantity <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">OUT OF STOCK</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border border-slate-200 rounded-3xl flex flex-col shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <i className="fa-solid fa-receipt text-emerald-500"></i>
            Current Invoice
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
              <i className="fa-solid fa-cart-arrow-down text-5xl mb-4 opacity-20"></i>
              <p>Your cart is empty.</p>
              <p className="text-xs">Select items from the list to start an invoice.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-slate-800 truncate">{item.commercialName}</h4>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors">-</button>
                      <span className="text-sm font-bold w-6 text-center">{item.selectedQuantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors">+</button>
                    </div>
                    <span className="font-bold text-slate-700">${(item.sellingPrice * item.selectedQuantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-slate-800">Total</span>
            <span className="text-3xl font-black text-emerald-600">${total.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            COMPLETE CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesSection;
