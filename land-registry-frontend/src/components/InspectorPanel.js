import React, { useState, useEffect } from 'react';

function InspectorPanel({ contract, userRole }) {
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (contract && userRole === 'inspector') loadUsers();
  }, [contract, userRole]);

  const loadUsers = async () => {
    try {
      const sellersArray = await contract.getSeller();
      const buyersArray = await contract.getBuyer();
      const sellersWithStatus = await Promise.all(
        sellersArray.map(async (addr) => ({ address: addr, verified: await contract.isVerified(addr) }))
      );
      const buyersWithStatus = await Promise.all(
        buyersArray.map(async (addr) => ({ address: addr, verified: await contract.isVerified(addr) }))
      );
      setSellers(sellersWithStatus);
      setBuyers(buyersWithStatus);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const verifyUser = async (address, type) => {
    setLoading(true); setMessage('');
    try {
      const tx = type === 'seller' ? await contract.verifySeller(address) : await contract.verifyBuyer(address);
      await tx.wait();
      setMessage(`${type === 'seller' ? 'Seller' : 'Buyer'} ${address.slice(0, 8)}... verified successfully!`);
      await loadUsers();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'inspector') {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <span className="material-symbols-outlined text-6xl text-outline mb-6 block">lock</span>
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">Verification Console</h2>
        <p className="text-on-surface-variant">Only the Land Inspector can access this panel.</p>
      </div>
    );
  }

  const allUsers = [
    ...sellers.map(s => ({ ...s, type: 'seller' })),
    ...buyers.map(b => ({ ...b, type: 'buyer' })),
  ];
  const pending = allUsers.filter(u => !u.verified).length;

  return (
    <div className="max-w-7xl w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface">
            Verification <span className="text-primary">Console</span>
          </h1>
          <p className="text-on-surface-variant font-body mt-2 max-w-xl">
            Review and authorize pending land registrations and identity claims. Cross-reference submitted cryptographic proofs against registry archives.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container p-4 flex flex-col items-end border-r-2 border-primary-container">
            <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant">Active Queue</span>
            <span className="text-2xl font-headline font-bold text-primary">{allUsers.length} Claims</span>
          </div>
          <div className="bg-surface-container p-4 flex flex-col items-end border-r-2 border-error">
            <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant">Pending</span>
            <span className="text-2xl font-headline font-bold text-error">{pending} Unverified</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 border-l-2 flex gap-4 ${message.includes('Error') ? 'border-error bg-error/10 text-error' : 'border-primary bg-primary/10 text-primary'}`}>
          <span className="material-symbols-outlined">{message.includes('Error') ? 'error' : 'check_circle'}</span>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Priority Queue */}
        <section className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest">Priority Queue</h3>
            <button onClick={loadUsers} className="text-primary text-[10px] font-label uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>

          {allUsers.length === 0 && (
            <div className="bg-surface-container p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-2 block">inbox</span>
              <p className="text-on-surface-variant text-sm">No users registered yet</p>
            </div>
          )}

          {allUsers.map((user, i) => (
            <div
              key={user.address}
              onClick={() => setSelected(user)}
              className={`p-5 border-l-4 hover:bg-surface-variant transition-all cursor-pointer group
                ${user.verified ? 'bg-surface-container border-primary/40' : 'bg-surface-container-high border-error'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className={`text-[10px] px-2 py-0.5 font-bold font-label uppercase
                    ${user.verified ? 'bg-primary/20 text-primary' : 'bg-error-container text-on-error-container'}`}>
                    {user.verified ? 'Verified' : 'Pending'}
                  </span>
                  <h4 className="text-on-surface font-bold text-base leading-tight capitalize">{user.type}</h4>
                  <p className="text-xs font-label text-primary tracking-tighter">
                    {user.address.slice(0, 10)}...{user.address.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] font-label ${user.verified ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {user.verified ? '✓ Verified' : '⏳ Awaiting review'}
                </span>
                {!user.verified && (
                  <button className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Inspect <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Detail Panel */}
        <section className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-high overflow-hidden shadow-2xl">
            <div className="bg-surface-variant px-6 py-3 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">compare</span>
                <span className="font-headline font-bold uppercase tracking-widest text-xs">Verification Engine v4.2</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] text-primary-container font-label uppercase animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Live Analysis
                </span>
              </div>
            </div>

            {selected ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-[10px] text-primary uppercase font-bold tracking-widest">User Submitted Claim</h5>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant">Wallet Address</label>
                        <div className="bg-surface-container-lowest p-2 border-b border-primary/40">
                          <span className="text-xs font-label text-cyan-400 break-all">{selected.address}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant">Role Type</label>
                        <div className="bg-surface-container-lowest p-2 border-b border-primary/40">
                          <span className="text-xs font-label text-cyan-400 uppercase">{selected.type}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-on-surface-variant">Verification Status</label>
                        <div className={`p-2 border-b ${selected.verified ? 'bg-primary/10 border-primary/40' : 'bg-error/10 border-error/40'}`}>
                          <span className={`text-xs font-label font-bold ${selected.verified ? 'text-primary' : 'text-error'}`}>
                            {selected.verified ? 'VERIFIED' : 'UNVERIFIED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[10px] text-tertiary-fixed-dim uppercase font-bold tracking-widest">Registry Archives</h5>
                    <div className="p-4 bg-surface-container-lowest border border-white/5 space-y-2">
                      <p className="text-[10px] text-on-surface-variant leading-relaxed italic">
                        "Identity claim submitted for verification. Awaiting inspector cryptographic signature for ledger anchoring."
                      </p>
                    </div>
                    {!selected.verified && (
                      <div className="p-4 bg-error-container/10 border border-error/20 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-error text-lg">warning</span>
                        <div>
                          <p className="text-[10px] text-error-dim font-bold uppercase tracking-tight">Pending Verification</p>
                          <p className="text-[10px] text-on-surface-variant leading-tight mt-1">This user has not been verified yet. Review and approve or reject.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-surface-container-highest p-6 flex justify-end border-t border-white/10">
                  {!selected.verified && (
                    <button
                      onClick={() => verifyUser(selected.address, selected.type)}
                      disabled={loading}
                      className="rounded-full px-8 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-[0_0_30px_rgba(153,247,255,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Approve Registration'}
                    </button>
                  )}
                  {selected.verified && (
                    <span className="text-primary text-xs font-label flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Already Verified
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-outline mb-4 block">touch_app</span>
                <p className="text-on-surface-variant text-sm">Select a user from the queue to inspect their claim</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InspectorPanel;
