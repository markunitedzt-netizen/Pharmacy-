
import React from 'react';
import { Settings } from '../types';

interface SettingsSectionProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-800 mb-2">Global Settings</h2>
        <p className="text-slate-500">Configure your pharmacy's operational preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <i className="fa-solid fa-bell text-xl"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-800">Alerts & Notifications</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex justify-between">
                <span>Expiry Warning Threshold</span>
                <span className="text-amber-600 font-black">{settings.expiryReminderDays} Days</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="365" 
                value={settings.expiryReminderDays}
                onChange={(e) => onUpdateSettings({ ...settings, expiryReminderDays: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
              <p className="text-[10px] text-slate-400">Items within this many days of expiry will be highlighted in orange in the inventory dashboard.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
               <div>
                  <p className="text-sm font-bold text-slate-800">Push Notifications</p>
                  <p className="text-[10px] text-slate-500">Get alerts even when the app is closed</p>
               </div>
               <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <i className="fa-solid fa-dollar-sign text-xl"></i>
             </div>
             <h3 className="text-xl font-bold text-slate-800">Localization</h3>
          </div>

          <div className="space-y-6">
             <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Currency Symbol</label>
                <div className="flex gap-2">
                   {['$', '£', '€', '¥', 'SAR'].map(curr => (
                      <button 
                        key={curr}
                        onClick={() => onUpdateSettings({ ...settings, currency: curr })}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${settings.currency === curr ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {curr}
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Calendar Format</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                   <option>Gregorian Calendar</option>
                   <option>Hijri Calendar</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black mb-2">Cloud Synchronization</h3>
               <p className="text-slate-400 max-w-md">Ensure your pharmacy data is synced across all devices and employee accounts in real-time.</p>
            </div>
            <button className="px-10 py-5 bg-emerald-500 text-white font-black rounded-3xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/40 flex items-center gap-3">
               <i className="fa-solid fa-cloud-arrow-up"></i>
               Sync Now
            </button>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>
    </div>
  );
};

export default SettingsSection;
