import React, { useState } from 'react';

const CONTRACT_ADDRESS = '0xcF3C7D07C08fe74C5157B87bD464f03209523B85';

function TransferLand({ contract, userRole }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [transferData, setTransferData] = useState({ landId: '', sellerAddress: '', requestId: '' });
  const [step, setStep] = useState(1); // 1=request, 2=approve, 3=transfer
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });

  const handleChange = (e) => setTransferData({ ...transferData, [e.target.name]: e.target.value });

  const handleRequestLand = async (e) => {
    e.preventDefault();
    if (userRole !== 'buyer') { setMessage('Only verified buyers can request land'); return; }
    setLoading(true); setMessage('');
    try {
      const tx = await contract.requestLand(transferData.sellerAddress, parseInt(transferData.landId));
      await tx.wait();
      setMessage('Land request sent successfully!');
      setCompletedSteps({ ...completedSteps, 1: true });
      setStep(2);
    } catch (error) { setMessage(`Error: ${error.message}`); }
    finally { setLoading(false); }
  };

  const handleApproveRequest = async (e) => {
    e.preventDefault();
    if (userRole !== 'seller') { setMessage('Only sellers can approve requests'); return; }
    setLoading(true); setMessage('');
    try {
      const tx = await contract.approveRequest(parseInt(transferData.requestId));
      await tx.wait();
      setMessage('Request approved successfully!');
      setCompletedSteps({ ...completedSteps, 2: true });
      setStep(3);
    } catch (error) { setMessage(`Error: ${error.message}`); }
    finally { setLoading(false); }
  };

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
    if (userRole !== 'inspector') { setMessage('Only land inspector can transfer ownership'); return; }
    setLoading(true); setMessage('');
    try {
      // Validate request ID
      const reqId = parseInt(transferData.requestId);
      if (!reqId || reqId <= 0) {
        setMessage('Error: Please enter a valid Request ID');
        setLoading(false);
        return;
      }

      // Check if request exists and get details
      try {
        const requestDetails = await contract.getRequestDetails(reqId);
        const [sellerId, buyerId, landId, isApproved] = requestDetails;
        
        console.log('Request Details:', { sellerId, buyerId, landId: landId.toString(), isApproved });
        
        // Validate request exists
        if (sellerId === '0x0000000000000000000000000000000000000000') {
          setMessage('Error: Request ID does not exist');
          setLoading(false);
          return;
        }
        
        // Check if approved
        if (!isApproved) {
          setMessage('Error: Request has not been approved by seller yet');
          setLoading(false);
          return;
        }
        
        // Check land ownership
        const currentOwner = await contract.getLandOwner(landId);
        console.log('Current Land Owner:', currentOwner);
        console.log('Expected Seller:', sellerId);
        
        if (currentOwner.toLowerCase() !== sellerId.toLowerCase()) {
          setMessage('Error: Seller is not the current owner of this land');
          setLoading(false);
          return;
        }
        
      } catch (validationError) {
        console.error('Validation error:', validationError);
        setMessage(`Error: ${validationError.message}`);
        setLoading(false);
        return;
      }

      // Proceed with transfer
      const tx = await contract.LandOwnershipTransfer(reqId);
      await tx.wait();
      setMessage('Ownership transferred successfully!');
      setCompletedSteps({ ...completedSteps, 3: true });
    } catch (error) {
      console.error('Transfer error:', error);
      let errorMsg = 'Error: ';
      if (error.reason) {
        errorMsg += error.reason;
      } else if (error.message) {
        errorMsg += error.message;
      } else {
        errorMsg += 'Transaction failed. Please check all requirements are met.';
      }
      setMessage(errorMsg);
    }
    finally { setLoading(false); }
  };

  const steps = [
    { num: '01', icon: 'person_add', label: 'Request Initiated', desc: 'Buyer locks ETH in escrow.', status: step > 1 ? 'COMPLETED' : step === 1 ? 'ACTIVE' : 'LOCKED', color: 'primary' },
    { num: '02', icon: 'verified_user', label: 'Approval Granted', desc: 'Pending Inspector verification of physical deeds.', status: step > 2 ? 'COMPLETED' : step === 2 ? 'WAITING' : 'LOCKED', color: 'tertiary' },
    { num: '03', icon: 'token', label: 'Ownership Transferred', desc: 'Blockchain finalization and tokenized deed issuance.', status: step === 3 ? 'ACTIVE' : 'LOCKED', color: 'outline' },
  ];

  const inputClass = "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full text-on-surface py-3 px-4 focus:ring-0 focus:border-primary transition-all placeholder:text-outline/40 font-body outline-none";
  const labelClass = "text-outline text-[10px] font-label uppercase tracking-widest block mb-2";

  return (
    <div className="max-w-6xl w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-label text-xs tracking-[0.2em] uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Land Transfer Protocol
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tighter text-on-surface">
            Transfer Ownership
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-label text-outline uppercase tracking-widest mb-1">Contract Address</p>
          <code className="text-primary font-label bg-primary/5 px-3 py-1 text-sm">{CONTRACT_ADDRESS.slice(0,8)}...{CONTRACT_ADDRESS.slice(-6)}</code>
        </div>
      </div>

      {/* Step Tracker */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 hidden md:block z-0"></div>
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`relative z-10 p-6 transition-all
                ${s.status === 'ACTIVE' || s.status === 'WAITING' ? `bg-surface-container border-l-4 border-${s.color}` : ''}
                ${s.status === 'COMPLETED' ? 'bg-surface-container border-l-4 border-primary' : ''}
                ${s.status === 'LOCKED' ? 'bg-surface-container-low border-l-4 border-outline/20 opacity-60' : ''}
              `}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-headline font-bold
                  ${s.status === 'COMPLETED' ? 'bg-primary text-on-primary' : ''}
                  ${s.status === 'WAITING' || s.status === 'ACTIVE' ? `bg-${s.color} text-on-primary` : ''}
                  ${s.status === 'LOCKED' ? 'bg-outline-variant text-on-surface' : ''}
                `}>{s.num}</div>
                <span className={`material-symbols-outlined text-${s.color}`}>{s.icon}</span>
              </div>
              <h3 className={`font-headline font-bold mb-1 text-${s.color === 'outline' ? 'on-surface-variant' : s.color}`}>{s.label}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-[10px] font-label px-2 py-0.5 border
                  ${s.status === 'COMPLETED' ? 'bg-primary/20 text-primary border-primary/30' : ''}
                  ${s.status === 'WAITING' ? `bg-${s.color}/20 text-${s.color} border-${s.color}/30 animate-pulse` : ''}
                  ${s.status === 'LOCKED' ? 'bg-outline/10 text-outline border-outline/20' : ''}
                  ${s.status === 'ACTIVE' ? 'bg-primary/20 text-primary border-primary/30' : ''}
                `}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Forms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-9xl">apartment</span>
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-primary"></div>
              <span className="text-xs font-label uppercase tracking-widest text-outline">Entity Metadata</span>
            </div>

            {/* Step 1: Request */}
            {step === 1 && (
              <form onSubmit={handleRequestLand} className="space-y-6">
                <div>
                  <h4 className="text-sm font-label text-outline mb-4">Request Land Purchase (Buyer)</h4>
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Land ID</label>
                      <input className={inputClass} name="landId" value={transferData.landId} onChange={handleChange} placeholder="1" type="number" required />
                    </div>
                    <div>
                      <label className={labelClass}>Seller Address</label>
                      <input className={inputClass} name="sellerAddress" value={transferData.sellerAddress} onChange={handleChange} placeholder="0x71C7656EC7ab88b..." required />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading || userRole !== 'buyer'}
                  className="w-full rounded-full flex flex-col items-center justify-center gap-2 p-6 bg-tertiary/10 border border-tertiary/30 hover:bg-tertiary/20 hover:shadow-[0_0_30px_rgba(255,193,7,0.3)] hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">shopping_cart</span>
                  <span className="font-headline font-bold text-on-surface">{loading ? 'Requesting...' : 'Request Land'}</span>
                  <span className="text-[10px] font-label text-tertiary uppercase tracking-tighter">Buyer Role Required</span>
                </button>
              </form>
            )}

            {/* Step 2: Approve */}
            {step === 2 && (
              <form onSubmit={handleApproveRequest} className="space-y-6">
                <div>
                  <h4 className="text-sm font-label text-outline mb-4">Approve Purchase Request (Seller)</h4>
                  <div>
                    <label className={labelClass}>Request ID</label>
                    <input className={inputClass} name="requestId" value={transferData.requestId} onChange={handleChange} placeholder="1" type="number" required />
                  </div>
                </div>
                <button type="submit" disabled={loading || userRole !== 'seller'}
                  className="w-full rounded-full flex flex-col items-center justify-center gap-2 p-6 bg-tertiary/10 border border-tertiary/30 hover:bg-tertiary/20 hover:shadow-[0_0_30px_rgba(255,193,7,0.3)] hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">verified</span>
                  <span className="font-headline font-bold text-on-surface">{loading ? 'Approving...' : 'Approve Request'}</span>
                  <span className="text-[10px] font-label text-tertiary uppercase tracking-tighter">Seller Role Required</span>
                </button>
              </form>
            )}

            {/* Step 3: Transfer */}
            {step === 3 && (
              <form onSubmit={handleTransferOwnership} className="space-y-6">
                <div>
                  <h4 className="text-sm font-label text-outline mb-4">Finalize Ownership Transfer (Inspector)</h4>
                  <div>
                    <label className={labelClass}>Request ID</label>
                    <input className={inputClass} name="requestId" value={transferData.requestId} onChange={handleChange} placeholder="1" type="number" required />
                  </div>
                </div>
                <button type="submit" disabled={loading || userRole !== 'inspector'}
                  className="w-full rounded-full flex flex-col items-center justify-center gap-2 p-6 bg-primary text-on-primary hover:brightness-110 hover:shadow-[0_0_40px_rgba(153,247,255,0.4)] hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">key</span>
                  <span className="font-headline font-bold">{loading ? 'Transferring...' : 'Finalize Transfer'}</span>
                  <span className="text-[10px] font-label uppercase tracking-tighter">Inspector Role Required</span>
                </button>
              </form>
            )}

            {message && (
              <div className={`mt-6 p-4 border-l-2 flex gap-4 ${message.includes('Error') ? 'border-error bg-error/10 text-error' : 'border-primary bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined">{message.includes('Error') ? 'error' : 'check_circle'}</span>
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="rounded-full flex flex-col items-center justify-center gap-2 p-6 bg-surface-container border border-outline-variant/30 hover:border-primary hover:shadow-[0_0_20px_rgba(153,247,255,0.2)] hover:scale-105 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-outline text-3xl">arrow_back</span>
              <span className="font-headline font-bold text-on-surface-variant text-sm">Previous Step</span>
            </button>
            <button
              onClick={() => {
                if (step === 1 && completedSteps[1]) setStep(2);
                else if (step === 2 && completedSteps[2]) setStep(3);
              }}
              disabled={step === 3 || (step === 1 && !completedSteps[1]) || (step === 2 && !completedSteps[2])}
              className="rounded-full flex flex-col items-center justify-center gap-2 p-6 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:shadow-[0_0_30px_rgba(153,247,255,0.3)] hover:scale-105 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-primary text-3xl">arrow_forward</span>
              <span className="font-headline font-bold text-on-surface text-sm">Next Step</span>
            </button>
          </div>
        </div>

        {/* Right: Transaction Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest border-b border-white/5 pb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { step: '01', role: 'Buyer', desc: 'Request land by providing the Land ID and Seller address.' },
                { step: '02', role: 'Seller', desc: 'Approve the buyer\'s request using the Request ID.' },
                { step: '03', role: 'Inspector', desc: 'Finalize the ownership transfer using the Request ID.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <span className="text-primary font-headline font-black opacity-30 text-3xl leading-none">{item.step}</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface uppercase tracking-wider">{item.role}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-6 border-l-2 border-primary/30">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <p className="text-xs font-bold text-on-surface uppercase tracking-tight mb-1">Contract</p>
                <p className="text-[10px] text-primary font-label break-all">{CONTRACT_ADDRESS}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-label tracking-widest uppercase">Protocol V4.2.0</span>
          <span className="text-[10px] font-label tracking-widest uppercase">Encryption: AES-256-GCM</span>
        </div>
        <div className="flex gap-4">
          {['security', 'cloud_done', 'hub'].map(icon => (
            <span key={icon} className="material-symbols-outlined text-sm">{icon}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default TransferLand;
