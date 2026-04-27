import React from 'react';

const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
  { id: 'register', label: 'Register', icon: 'how_to_reg' },
  { id: 'viewLands', label: 'View Lands', icon: 'map' },
  { id: 'addLand', label: 'Add Land', icon: 'add_location_alt' },
  { id: 'transfer', label: 'Transactions', icon: 'account_tree' },
];

function Sidebar({ activeTab, setActiveTab, userRole }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/40 backdrop-blur-md flex flex-col py-8 border-r border-white/5 z-40 hidden md:flex">
      <div className="px-6 mb-10">
        <h2 className="text-cyan-400 font-headline font-black text-lg tracking-widest uppercase">Sovereign</h2>
        <p className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase opacity-70">Ledger Identity</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-medium font-body transition-colors duration-150 text-left
              ${activeTab === item.id
                ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        {userRole === 'inspector' && (
          <button
            onClick={() => setActiveTab('inspector')}
            className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-medium font-body transition-colors duration-150 text-left
              ${activeTab === 'inspector'
                ? 'bg-cyan-500/10 text-cyan-400 border-r-4 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
          >
            <span className="material-symbols-outlined text-xl">verified_user</span>
            <span>Inspector Panel</span>
          </button>
        )}
      </nav>

      <div className="px-6 mt-auto space-y-4 border-t border-white/5 pt-4">
        <div className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase opacity-50">
          Sovereign Ledger v2.4.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
