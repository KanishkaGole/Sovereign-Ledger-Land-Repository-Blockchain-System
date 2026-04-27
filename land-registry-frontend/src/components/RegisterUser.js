import React, { useState, useEffect } from 'react';

function RegisterUser({ contract, account }) {
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recentVerified, setRecentVerified] = useState([]);
  const [formData, setFormData] = useState({
    name: '', age: '', city: '', aadharNumber: '', panNumber: '',
    email: '', landsOwned: '', document: '',
  });

  useEffect(() => {
    if (!contract) return;
    const loadVerified = async () => {
      try {
        const sellers = await contract.getSeller();
        const buyers = await contract.getBuyer();
        const all = [...sellers.map(a => ({ address: a, type: 'Seller' })), ...buyers.map(a => ({ address: a, type: 'Buyer' }))];
        const verified = await Promise.all(
          all.map(async (u) => ({ ...u, verified: await contract.isVerified(u.address) }))
        );
        setRecentVerified(verified.filter(u => u.verified).slice(-3).reverse());
      } catch (e) { /* silent */ }
    };
    loadVerified();
  }, [contract]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!contract) { setMessage('Contract not loaded'); return; }
    setLoading(true); setMessage('');
    try {
      let tx;
      if (userType === 'buyer') {
        tx = await contract.registerBuyer(formData.name, parseInt(formData.age), formData.city, formData.aadharNumber, formData.panNumber, formData.document, formData.email);
      } else {
        tx = await contract.registerSeller(formData.name, parseInt(formData.age), formData.aadharNumber, formData.panNumber, formData.landsOwned, formData.document);
      }
      await tx.wait();
      setMessage(`Successfully registered as ${userType}!`);
      setFormData({ name: '', age: '', city: '', aadharNumber: '', panNumber: '', email: '', landsOwned: '', document: '' });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full text-on-surface py-3 px-4 focus:ring-0 focus:border-primary transition-all placeholder:text-outline/40 font-body outline-none";
  const labelClass = "text-outline text-[10px] font-label uppercase tracking-widest block mb-2";

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Header */}
      <header className="lg:col-span-12 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Identity Node Deployment</span>
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface leading-none">Register Identity.</h1>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-outline text-xs font-label">NETWORK STATUS</span>
            <div className="flex items-center gap-2 text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(153,247,255,1)]"></span>
              <span className="font-label text-sm uppercase tracking-widest">Mainnet Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="lg:col-span-7 space-y-8">
        <section className="glass-panel border-0 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent"></div>
          <form onSubmit={handleRegister} className="space-y-8">
            {/* Role Toggle */}
            <div className="space-y-4">
              <label className={labelClass}>Deployment Persona</label>
              <div className="flex gap-2 p-1 bg-surface-container-lowest border border-outline-variant/15 rounded-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={`flex-1 py-3 rounded-full font-headline font-bold text-sm tracking-tight transition-all ${userType === 'buyer' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(153,247,255,0.3)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                >Buyer</button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`flex-1 py-3 rounded-full font-headline font-bold text-sm tracking-tight transition-all ${userType === 'seller' ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(153,247,255,0.3)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}
                >Seller</button>
              </div>
            </div>

            {/* Name + ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass} htmlFor="name">Full Name</label>
                <input className={inputClass} id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Johnathan Doe" type="text" required />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="aadharNumber">National ID (Aadhar)</label>
                <input className={`${inputClass} text-primary font-label text-sm tracking-wider`} id="aadharNumber" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} placeholder="SHA-256 Hash" type="text" required />
              </div>
            </div>

            {/* Age + PAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={labelClass} htmlFor="age">Age</label>
                <input className={inputClass} id="age" name="age" value={formData.age} onChange={handleChange} placeholder="25" type="number" required />
              </div>
              <div className="space-y-2">
                <label className={labelClass} htmlFor="panNumber">PAN Number</label>
                <input className={inputClass} id="panNumber" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" type="text" required />
              </div>
            </div>

            {/* Buyer-specific */}
            {userType === 'buyer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="city">City</label>
                  <input className={inputClass} id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" type="text" required />
                </div>
                <div className="space-y-2">
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input className={inputClass} id="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@domain.com" type="email" required />
                </div>
              </div>
            )}

            {/* Seller-specific */}
            {userType === 'seller' && (
              <div className="space-y-2">
                <label className={labelClass} htmlFor="landsOwned">Lands Owned</label>
                <input className={inputClass} id="landsOwned" name="landsOwned" value={formData.landsOwned} onChange={handleChange} placeholder="Description of existing properties" type="text" required />
              </div>
            )}

            {/* Document */}
            <div className="space-y-4">
              <label className={labelClass} htmlFor="document">Document Hash / URL</label>
              <input className={inputClass} id="document" name="document" value={formData.document} onChange={handleChange} placeholder="0x... or IPFS hash" type="text" required />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-headline font-black py-4 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(153,247,255,0.2)] hover:shadow-[0_0_40px_rgba(153,247,255,0.4)] hover:scale-105 active:translate-y-1 transition-all disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Initialize Identity Protocol'}
              </button>
            </div>
          </form>
        </section>

        {message && (
          <div className={`p-4 border-l-2 flex gap-4 ${message.includes('Error') ? 'border-error bg-error/10 text-error' : 'border-primary bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined">{message.includes('Error') ? 'error' : 'check_circle'}</span>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="bg-surface-container/30 p-4 border-l-2 border-primary/40 flex gap-4">
          <span className="material-symbols-outlined text-primary">security</span>
          <p className="text-on-surface-variant text-xs leading-relaxed">
            <strong className="text-on-surface">Security Note:</strong> Your identity will be verified by a licensed inspector and anchored to the Ethereum ledger. Data is stored on decentralized IPFS nodes with zero-knowledge encryption protocols.
          </p>
        </div>
      </div>

      {/* Side Info */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-surface-container p-6 space-y-6">
          <h3 className="text-primary font-headline font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            Protocol Guidelines
          </h3>
          <div className="space-y-4">
            {[
              { num: '01', title: 'Wallet Linkage', desc: 'Ensure your connected wallet matches your legal identity for automated verification.' },
              { num: '02', title: 'Hash Calculation', desc: 'Your National ID is salted and hashed locally before being sent to the ledger.' },
              { num: '03', title: 'Immutable Stamp', desc: 'Once approved, your soulbound identity NFT will be minted to your address.' },
            ].map((g) => (
              <div key={g.num} className="flex items-start gap-3">
                <span className="text-primary font-headline font-black opacity-20 text-4xl leading-none">{g.num}</span>
                <div>
                  <h4 className="text-on-surface font-headline font-bold text-sm">{g.title}</h4>
                  <p className="text-on-surface-variant text-xs mt-1">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Verifications - real data */}
        <div className="bg-surface-container-lowest p-6 border border-outline-variant/10">
          <h4 className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest mb-4">Recently Verified</h4>
          {recentVerified.length === 0 ? (
            <p className="text-outline text-xs">No verified users yet</p>
          ) : (
            <div className="space-y-3">
              {recentVerified.map((v) => (
                <div key={v.address} className="flex items-center justify-between py-2 border-b border-outline-variant/5">
                  <div>
                    <span className="font-label text-[10px] text-on-surface font-mono">
                      {v.address.slice(0, 8)}...{v.address.slice(-6)}
                    </span>
                    <span className="ml-2 text-[9px] text-outline uppercase">{v.type}</span>
                  </div>
                  <span className="font-label text-[10px] text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
