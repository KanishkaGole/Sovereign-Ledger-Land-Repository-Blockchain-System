import React from 'react';

function TopNav({ account, userRole, onConnect, activeTab, setActiveTab }) {
  const truncated = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null;

  const roleColor = {
    inspector: 'text-purple-400',
    seller: 'text-primary',
    buyer: 'text-tertiary',
    guest: 'text-outline',
  }[userRole] || 'text-outline';

  const roleLabel = userRole
    ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
    : 'Guest';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'viewLands', label: 'View Lands' },
    { id: 'transfer', label: 'Transactions' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full px-8 py-5 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(0,242,255,0.06)]">
      <div className="flex items-center justify-between">

        {/* Left: wallet info */}
        <div className="w-56 flex items-center">
          {truncated ? (
            <div className="flex flex-col">
              <span className={`text-[10px] font-label uppercase tracking-widest ${roleColor}`}>{roleLabel}</span>
              <span className="text-xs font-label text-on-surface tracking-widest font-medium">{truncated}</span>
            </div>
          ) : (
            <div className="w-56" />
          )}
        </div>

        {/* Center: logo + nav */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="text-4xl md:text-5xl font-black tracking-tighter text-cyan-400 font-headline leading-none hover:text-cyan-300 transition-colors"
          >
            SOVEREIGN LEDGER
          </button>
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-headline text-sm tracking-wide transition-all pb-0.5
                  ${activeTab === item.id
                    ? 'text-cyan-400 font-bold border-b-2 border-cyan-400'
                    : 'text-slate-400 font-medium hover:text-cyan-300'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: connect button */}
        <div className="w-56 flex justify-end">
          <button
            onClick={onConnect}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold px-5 py-2 rounded-none hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(153,247,255,0.3)] flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
            {truncated ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>

      </div>
    </header>
  );
}

export default TopNav;
