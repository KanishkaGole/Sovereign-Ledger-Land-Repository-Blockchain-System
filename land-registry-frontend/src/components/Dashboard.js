import React, { useState, useEffect, useCallback } from 'react';

function Dashboard({ contract, account, userRole, setActiveTab }) {
  const [landsCount, setLandsCount] = useState('--');
  const [portfolioValue, setPortfolioValue] = useState('--');
  const [myLands, setMyLands] = useState([]);

  const loadStats = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const count = await contract.getLandsCount();
      setLandsCount(count.toString());

      let total = 0;
      const owned = [];

      for (let i = 1; i <= count; i++) {
        const land = await contract.lands(i);
        const owner = await contract.getLandOwner(i);
        total += parseFloat(land.landPrice.toString());
        if (owner.toLowerCase() === account.toLowerCase()) {
          owned.push({
            id: land.id.toString(),
            city: land.city,
            state: land.state,
            price: land.landPrice.toString(),
            propertyPID: land.propertyPID.toString(),
          });
        }
      }

      setPortfolioValue(total.toLocaleString());
      setMyLands(owned);
    } catch (e) { /* silent */ }
  }, [contract, account]);

  useEffect(() => { loadStats(); }, [loadStats]);

  const roleLabel = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'Guest';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-end">
        <div className="lg:col-span-8">
          <h1 className="text-5xl font-headline font-black text-on-surface tracking-tighter mb-2">
            Protocol <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-on-surface-variant font-body text-lg max-w-2xl">
            Mission control for sovereign land registry. Manage your digital real estate portfolio across decentralized networks.
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-col items-end gap-2">
          <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Network Status</span>
          <div className="flex items-center gap-3 bg-surface-container px-6 py-3 rounded-full border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#99f7ff]"></div>
            <span className="text-on-surface font-label text-sm tracking-widest">
              {contract ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: 'Total Parcels',
            icon: 'layers',
            value: landsCount,
            sub: 'Registered on-chain',
            subColor: 'text-on-surface-variant',
          },
          {
            label: 'Total Value Locked',
            icon: 'payments',
            value: portfolioValue,
            suffix: 'Wei',
            sub: 'Sum of all land prices',
            subColor: 'text-primary',
          },
          {
            label: 'Your Holdings',
            icon: 'home_work',
            value: myLands.length.toString(),
            sub: 'Lands you own',
            subColor: 'text-on-surface-variant',
          },
          {
            label: 'Your Role',
            icon: 'verified',
            value: roleLabel,
            sub: account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected',
            subColor: 'text-primary',
            iconFill: true,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container p-6 border-b-2 border-transparent hover:border-primary transition-all backdrop-blur-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest">{stat.label}</span>
              <span
                className="material-symbols-outlined text-primary"
                style={stat.iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}
              >{stat.icon}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-headline font-bold text-on-surface">
                {stat.value}
                {stat.suffix && <span className="text-sm font-light text-primary tracking-normal ml-1">{stat.suffix}</span>}
              </h3>
              <p className={`text-xs font-label ${stat.subColor}`}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* My Holdings */}
      {myLands.length > 0 && (
        <section className="mb-12">
          <div className="bg-surface-container-low p-6 mb-4 flex justify-between items-center">
            <h2 className="font-headline font-bold text-xl tracking-tight">
              My Holdings
              <span className="text-xs font-label text-primary tracking-[0.2em] ml-4 uppercase">Your Lands</span>
            </h2>
            <button
              onClick={() => setActiveTab('viewLands')}
              className="text-primary text-[10px] font-label uppercase tracking-widest border-b border-primary/20 pb-0.5"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myLands.map((land) => (
              <div key={land.id} className="bg-surface-container p-5 border-l-2 border-primary/40 hover:border-primary transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-headline font-bold text-on-surface">{land.city}, {land.state}</h4>
                    <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">
                      PID: {land.propertyPID}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-label text-outline uppercase">Land #{land.id}</span>
                  <span className="text-sm font-headline font-bold text-primary">
                    {parseFloat(land.price).toLocaleString()} Wei
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <div className="bg-surface-container-high p-8 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary opacity-5 blur-3xl rounded-full"></div>
        <h2 className="font-headline font-bold text-xl tracking-tight relative">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <button
            onClick={() => setActiveTab('addLand')}
            className="rounded-full flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm hover:shadow-[0_0_30px_rgba(153,247,255,0.4)] hover:scale-105 transition-all group"
          >
            <span>Add New Land</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">add</span>
          </button>
          <button
            onClick={() => setActiveTab('viewLands')}
            className="rounded-full flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-bold text-sm hover:border-primary hover:shadow-[0_0_20px_rgba(153,247,255,0.2)] hover:scale-105 transition-all group"
          >
            <span>View All Lands</span>
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">map</span>
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className="rounded-full flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-bold text-sm hover:border-primary hover:shadow-[0_0_20px_rgba(153,247,255,0.2)] hover:scale-105 transition-all group"
          >
            <span>Transfer Land</span>
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">swap_horiz</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h4 className="text-primary font-headline font-bold text-lg mb-4">Sovereign Ledger</h4>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
            Blockchain-based land registry on Ethereum. All data is stored on-chain. Ensure your private keys are secured off-chain.
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <p className="text-[10px] font-label text-on-surface-variant tracking-[0.3em] uppercase">Contract Address</p>
          <div className="bg-surface-container px-4 py-2">
            <span className="text-xs font-label text-primary tracking-widest font-mono">
              0xcF3C7D07C08fe74C5157B87bD464f03209523B85
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-4">Chain ID: 1377 // Ganache Local</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
