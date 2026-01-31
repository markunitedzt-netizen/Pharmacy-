
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AccountsSectionProps {
  users: User[];
  currentUser: User;
  onApproval: (id: string, approved: boolean) => void;
}

const AccountsSection: React.FC<AccountsSectionProps> = ({ users, currentUser, onApproval }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const isAdmin = currentUser.role === UserRole.PRIMARY_ADMIN;

  const handleInvite = () => {
    const inviteLink = `https://pharmapos.com/invite/${Math.random().toString(36).substr(2, 9)}`;
    alert(`Invitation link created: ${inviteLink}\nShare this with your employee.`);
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Team Management</h2>
          <p className="text-slate-500">Manage permissions and employee accounts</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <i className="fa-solid fa-user-plus"></i>
            Invite Secondary Admin
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-emerald-500 text-2xl font-black">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{user.name}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${user.role === UserRole.PRIMARY_ADMIN ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Account Status</span>
                  <span className={`font-bold ${user.approved ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {user.approved ? 'Approved' : 'Pending Approval'}
                  </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Sales Permission</span>
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Inventory Management</span>
                  <i className={`fa-solid ${user.role === UserRole.PRIMARY_ADMIN ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-slate-300'}`}></i>
               </div>
            </div>

            {isAdmin && user.id !== currentUser.id && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex gap-2">
                {!user.approved ? (
                  <button 
                    onClick={() => onApproval(user.id, true)}
                    className="flex-1 bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all"
                  >
                    Approve Account
                  </button>
                ) : (
                  <button className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-3 rounded-xl hover:bg-red-100 transition-all">
                    Revoke Access
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Create Invite Link</h3>
              <p className="text-slate-500 mb-8 text-sm">This link allows a new employee to sign up as a Secondary Admin. You will need to approve them afterwards.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleInvite} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 shadow-lg transition-all">
                  Generate Link
                </button>
                <button onClick={() => setShowInviteModal(false)} className="w-full text-slate-400 font-bold py-3 hover:text-slate-600 transition-colors">
                  Cancel
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AccountsSection;
