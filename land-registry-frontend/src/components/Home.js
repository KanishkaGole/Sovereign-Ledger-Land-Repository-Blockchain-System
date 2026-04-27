import React, { useEffect, useState } from 'react';

function Home({ onConnect, setActiveTab, account }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&q=80)',
            transform: `translateY(${scrollY * 0.1}px)`,
            transition: 'transform 0.05s linear',
            opacity: 0.4
          }}
        />
        {/* Cyan tint overlay */}
        <div className="absolute inset-0 bg-primary/10"></div>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/90"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-[870px] flex flex-col justify-center items-center px-6 lg:px-24 relative z-10">
        <div className="max-w-4xl space-y-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold tracking-[0.2em] mt-16">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Protocol Version 2.4.0 Live
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter leading-none text-on-surface">
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-tertiary">
              OWNERSHIP
            </span>{' '}
            IS <br />
            IMMUTABLE.
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-body leading-relaxed">
            Sovereign Ledger redefines land registration through an elite, decentralized architecture.
            Secure your digital deeds on a global network that ensures absolute permanence and cryptographic truth.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 justify-center">
            {!account && (
              <button
                onClick={onConnect}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold px-8 py-4 text-lg rounded-full hover:shadow-[0_0_30px_rgba(153,247,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => setActiveTab('viewLands')}
              className="px-8 py-4 text-lg font-headline font-bold text-primary border border-outline-variant/30 rounded-full hover:bg-white/5 hover:shadow-[0_0_20px_rgba(153,247,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Explore Registry
            </button>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 border-t border-white/5 pt-12 max-w-4xl">
              {[
                { value: 'Ethereum', label: 'Network' },
                { value: 'Ganache', label: 'Local Chain' },
                { value: '3-Step', label: 'Transfer Flow' },
                { value: '100%', label: 'On-chain' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1 text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{stat.value}</div>
                  <div className="text-xs font-label text-outline tracking-wider uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 px-6 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Feature Card */}
          <div className="md:col-span-8 bg-surface-container p-8 flex flex-col justify-between group overflow-hidden relative min-h-[400px] hover:shadow-[0_0_40px_rgba(153,247,255,0.2)] hover:scale-[1.02] transition-all duration-300">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-15 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[180px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <div className="relative z-10 space-y-4">
              <span className="text-primary font-headline font-bold text-sm tracking-widest uppercase">Security Node</span>
              <h3 className="text-4xl font-headline font-bold text-on-surface leading-tight max-w-md">
                Absolute Security Powered by Ethereum.
              </h3>
              <p className="text-on-surface-variant max-w-sm font-body">
                Leverage the most decentralized settlement layer in existence. Your land deeds are protected by billions in cryptographic hash power.
              </p>
            </div>
            <div className="relative z-10 flex items-center gap-4 text-xs font-label text-primary/80">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> SHA-256 Encryption</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> Multi-sig Verification</span>
            </div>
          </div>

          {/* Transparency Card */}
          <div className="md:col-span-4 bg-surface-variant p-8 space-y-6 flex flex-col justify-end border-l-4 border-primary hover:shadow-[0_0_30px_rgba(153,247,255,0.2)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 hover:opacity-15 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <span className="material-symbols-outlined text-4xl text-primary relative z-10">visibility</span>
            <div className="space-y-2 relative z-10">
              <h4 className="text-xl font-headline font-bold text-on-surface">Transparency</h4>
              <p className="text-sm text-on-surface-variant font-body">
                Public ledger records ensuring every title change is audible and verifiable by anyone, anywhere, at any time.
              </p>
            </div>
          </div>

          {/* Speed Card */}
          <div className="md:col-span-4 bg-surface-container-high p-8 space-y-6 flex flex-col justify-end hover:shadow-[0_0_30px_rgba(255,193,7,0.2)] hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10 hover:opacity-15 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <span className="material-symbols-outlined text-4xl text-tertiary relative z-10">bolt</span>
            <div className="space-y-2 relative z-10">
              <h4 className="text-xl font-headline font-bold text-on-surface">Speed</h4>
              <p className="text-sm text-on-surface-variant font-body">
                Instant settlements eliminate months of bureaucratic waiting. Transfer ownership in a single block confirmation.
              </p>
            </div>
          </div>

          {/* Immutable Card */}
          <div className="md:col-span-8 bg-surface-container overflow-hidden relative min-h-[300px] hover:shadow-[0_0_40px_rgba(153,247,255,0.2)] hover:scale-[1.02] transition-all duration-300">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 hover:opacity-25 transition-opacity"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <div className="text-2xl font-headline font-bold text-on-surface">Immutable Records</div>
              <div className="text-primary text-sm font-label">Every transaction permanently anchored on Ethereum</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 px-6 lg:px-24 bg-surface-container-low relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-on-surface">
                STREAMLINED <br />
                <span className="text-primary">PROTOCOL</span>
              </h2>
              <p className="text-on-surface-variant max-w-sm">The lifecycle of a sovereign asset, managed by decentralized logic.</p>
            </div>
            <div className="hidden md:block h-[1px] flex-grow bg-white/5 mx-12 mb-6"></div>
            <div className="text-right">
              <div className="text-6xl font-headline font-black text-white/5">05 STEPS</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '01', icon: 'how_to_reg', title: 'Register', desc: 'Establish your cryptographic identity node through decentralized ID protocols.', offset: '' },
              { num: '02', icon: 'verified_user', title: 'Verify', desc: 'Third-party inspectors validate physical boundaries and legal prerequisites.', offset: 'md:translate-y-4' },
              { num: '03', icon: 'add_location_alt', title: 'Add Land', desc: 'Mint your property as a unique digital asset on the Sovereign Ledger.', offset: 'md:translate-y-8' },
              { num: '04', icon: 'shopping_cart', title: 'Request', desc: 'Buyers submit offers that are held in secure, programmable escrow accounts.', offset: 'md:translate-y-12' },
              { num: '05', icon: 'account_tree', title: 'Transfer', desc: 'Smart contracts execute the atomic swap of ownership and currency instantly.', offset: 'md:translate-y-16' },
            ].map((step) => (
              <div key={step.num} className={`bg-surface-container p-6 space-y-8 hover:bg-surface-variant transition-colors group ${step.offset}`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-label text-outline">{step.num}</span>
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{step.icon}</span>
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-headline font-bold text-on-surface">{step.title}</h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-24"></div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 flex justify-center relative z-10">
        <div className="max-w-4xl w-full text-center space-y-10 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10"></div>
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter">
            READY TO CLAIM YOUR <br />
            <span className="text-primary">SOVEREIGNTY?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {!account && (
              <button
                onClick={onConnect}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold px-10 py-4 text-lg rounded-full hover:shadow-[0_0_30px_rgba(153,247,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => setActiveTab('register')}
              className="px-10 py-4 text-lg font-headline font-bold text-primary border border-outline-variant/30 rounded-full hover:bg-white/5 hover:shadow-[0_0_20px_rgba(153,247,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Register Now
            </button>
          </div>
          <p className="text-outline text-xs font-label uppercase tracking-widest">MetaMask required — connect to Ganache local network</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-xl font-bold tracking-tighter text-cyan-400 font-headline">Sovereign Ledger</div>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              The premier decentralized infrastructure for the tokenization and management of high-value land assets.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-sm font-headline font-bold text-on-surface">Ecosystem</div>
            <div className="flex flex-col gap-2 text-xs font-label text-outline">
              {['Registry Explorer', 'Inspector Panel', 'Add Land', 'Transactions'].map(l => (
                <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm font-headline font-bold text-on-surface">Roles</div>
            <div className="flex flex-col gap-2 text-xs font-label text-outline">
              {['Buyer', 'Seller', 'Inspector', 'Guest'].map(l => (
                <span key={l} className="text-outline">{l}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-sm font-headline font-bold text-on-surface">Contract</div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant/10 font-mono text-[10px] text-primary/60 break-all">
              0xcF3C7D07C08fe74C5157B87bD464f03209523B85
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-label text-outline uppercase tracking-widest">© 2024 Sovereign Ledger Protocol. All Rights Reserved.</div>
          <div className="flex gap-6">
            {['language', 'share', 'terminal'].map(icon => (
              <span key={icon} className="material-symbols-outlined text-outline text-lg hover:text-primary cursor-pointer">{icon}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
