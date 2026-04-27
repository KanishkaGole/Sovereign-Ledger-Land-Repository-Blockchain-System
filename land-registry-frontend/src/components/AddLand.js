import React, { useState } from 'react';

function AddLand({ contract, userRole }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [landData, setLandData] = useState({
    area: '', city: '', state: '', price: '', propertyPID: '',
    surveyNumber: '', document: '',
  });

  const handleChange = (e) => setLandData({ ...landData, [e.target.name]: e.target.value });

  const handleAddLand = async (e) => {
    e.preventDefault();
    if (userRole !== 'seller') { setMessage('Only verified sellers can add land'); return; }
    if (!contract) { setMessage('Contract not loaded'); return; }
    setLoading(true); setMessage('');
    try {
      const tx = await contract.addLand(
        parseInt(landData.area), landData.city, landData.state,
        parseInt(landData.price), parseInt(landData.propertyPID),
        parseInt(landData.surveyNumber), '', landData.document
      );
      await tx.wait();
      setMessage('Land added successfully!');
      setLandData({ area: '', city: '', state: '', price: '', propertyPID: '', surveyNumber: '', document: '' });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full text-on-surface py-3 px-4 focus:ring-0 focus:border-primary transition-all placeholder:text-outline/40 font-body outline-none";
  const labelClass = "block text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 font-label";

  return (
    <div className="max-w-7xl w-full">
      <div className="mb-12">
        <h3 className="font-headline text-5xl font-bold text-on-surface tracking-tight mb-2">
          Add Land
        </h3>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl">
          Register a new land property on the blockchain. Ensure all details are accurate before submitting.
        </p>
      </div>

      {userRole !== 'seller' && (
        <div className="mb-8 p-4 border-l-2 border-error bg-error/10 flex gap-4">
          <span className="material-symbols-outlined text-error">lock</span>
          <p className="text-error text-sm">Only verified sellers can add land. Please register and get verified first.</p>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <form onSubmit={handleAddLand}>
            {/* Core Asset Metadata */}
            <div className="bg-surface-container-high p-8 relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">edit_note</span>
              </div>
              <h4 className="text-primary font-headline text-xs font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
                <span className="w-8 h-px bg-primary/30"></span>01. Core Asset Metadata
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className={labelClass}>Location (City, State)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input className={`${inputClass}`} name="city" value={landData.city} onChange={handleChange} placeholder="City" type="text" required />
                    </div>
                    <div className="relative">
                      <input className={`${inputClass}`} name="state" value={landData.state} onChange={handleChange} placeholder="State" type="text" required />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Parcel ID (Property PID)</label>
                  <input className={inputClass} name="propertyPID" value={landData.propertyPID} onChange={handleChange} placeholder="APN-0922-88" type="number" required />
                </div>
                <div>
                  <label className={labelClass}>Survey Number</label>
                  <input className={inputClass} name="surveyNumber" value={landData.surveyNumber} onChange={handleChange} placeholder="Survey #" type="number" required />
                </div>
                <div>
                  <label className={labelClass}>Area (sq ft)</label>
                  <input className={inputClass} name="area" value={landData.area} onChange={handleChange} placeholder="1200" type="number" required />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Asking Price (Wei)</label>
                  <input className={`${inputClass} text-2xl font-bold`} name="price" value={landData.price} onChange={handleChange} placeholder="0" type="number" required />
                </div>
              </div>
            </div>

            {/* Chain of Sovereignty */}
            <div className="bg-surface-container-high p-8 relative overflow-hidden mb-8">
              <h4 className="text-primary font-headline text-xs font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
                <span className="w-8 h-px bg-primary/30"></span>02. Chain of Sovereignty
              </h4>
              <div className="space-y-6">
                <div className="bg-surface-container p-6 border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary">fingerprint</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Existing Land Deed Hash</p>
                        <p className="text-xs text-on-surface-variant">Enter the SHA-256 hash of the notarized title</p>
                      </div>
                    </div>
                  </div>
                  <input className={inputClass} name="document" value={landData.document} onChange={handleChange} placeholder="0x..." type="text" required />
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-4 border-l-2 flex gap-4 mb-6 ${message.includes('Error') ? 'border-error bg-error/10 text-error' : 'border-primary bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined">{message.includes('Error') ? 'error' : 'check_circle'}</span>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || userRole !== 'seller'}
              className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black text-lg tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(0,241,254,0.3)] hover:brightness-110 hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              {loading ? 'Minting...' : 'Mint Property on Ethereum'}
            </button>
            <p className="text-center mt-4 text-[10px] text-outline font-label uppercase tracking-widest">Gas fees apply — ensure your wallet has sufficient ETH</p>
          </form>
        </div>

        {/* Preview */}
        <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-28">
          <div className="relative group">
            <div className="absolute -top-4 left-6 bg-surface-container-highest px-4 py-1 border border-primary/20 z-10">
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">Marketplace Preview</span>
            </div>
            <div className="bg-surface-container overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-surface-dim relative flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/10 text-[120px]">landscape</span>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <span className="bg-primary/90 text-on-primary px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">Verified Sovereign Asset</span>
                </div>
                <div className="absolute top-4 right-6 backdrop-blur-md bg-surface-dim/40 p-2">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-2xl font-headline font-bold text-on-surface mb-1">
                      {landData.city || 'Canyon Vista'} {landData.state || 'Basin'}
                    </h5>
                    <div className="flex items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-sm">pin_drop</span>
                      <span className="text-xs font-label">{landData.city || '--'}, {landData.state || '--'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-outline uppercase font-label">Asking Price</p>
                    <p className="text-xl font-headline font-black text-primary">{landData.price || '0.00'} Wei</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-outline-variant/20">
                  <div className="text-center">
                    <p className="text-[10px] text-outline uppercase font-label mb-1">Area</p>
                    <p className="text-xs font-bold text-on-surface">{landData.area || '--'} sqft</p>
                  </div>
                  <div className="text-center border-x border-outline-variant/20">
                    <p className="text-[10px] text-outline uppercase font-label mb-1">Status</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <p className="text-xs font-bold text-primary">Minting</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-outline uppercase font-label mb-1">Network</p>
                    <p className="text-xs font-bold text-on-surface">Ethereum</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-outline uppercase tracking-widest font-bold">Immutable Metadata</p>
                  <div className="bg-surface-container-lowest p-4 space-y-2 border border-outline-variant/10">
                    <div className="flex justify-between text-[10px] font-label">
                      <span className="text-outline">Contract:</span>
                      <span className="text-on-surface-variant">0xcF3C...3B85</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-label">
                      <span className="text-outline">PID:</span>
                      <span className="text-on-surface-variant">{landData.propertyPID || '--'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-label">
                      <span className="text-outline">Survey #:</span>
                      <span className="text-on-surface-variant">{landData.surveyNumber || '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-surface-container-low border-l-2 border-primary/30">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <p className="text-xs font-bold text-on-surface uppercase tracking-tight mb-1">Network Synchronization</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  By minting this asset, you are committing a permanent legal record to the decentralized ledger. This action is immutable. Ensure all data reflects the official municipal land registry records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLand;
