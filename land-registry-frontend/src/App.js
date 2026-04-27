import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';
import LandABI from './artifacts/Land.json';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import RegisterUser from './components/RegisterUser';
import AddLand from './components/AddLand';
import ViewLands from './components/ViewLands';
import TransferLand from './components/TransferLand';
import InspectorPanel from './components/InspectorPanel';

const CONTRACT_ADDRESS = LandABI.networks[1337]?.address || LandABI.networks[1377]?.address;

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [userRole, setUserRole] = useState('guest');
  const [activeTab, setActiveTab] = useState('home');

  const checkUserRole = useCallback(async (contract, address) => {
    try {
      console.log('Checking role for address:', address);
      console.log('Contract address:', await contract.getAddress());
      
      const isInspector = await contract.isLandInspector(address);
      console.log('Is Inspector:', isInspector);
      
      if (isInspector) { 
        setUserRole('inspector'); 
        console.log('Role set to: inspector');
        return; 
      }
      
      const isSeller = await contract.isSeller(address);
      console.log('Is Seller:', isSeller);
      
      if (isSeller) { 
        setUserRole('seller'); 
        console.log('Role set to: seller');
        return; 
      }
      
      const isBuyer = await contract.isBuyer(address);
      console.log('Is Buyer:', isBuyer);
      
      if (isBuyer) { 
        setUserRole('buyer'); 
        console.log('Role set to: buyer');
        return; 
      }
      
      setUserRole('guest');
      console.log('Role set to: guest');
    } catch (error) {
      console.error('Error checking user role:', error);
      setUserRole('guest');
    }
  }, []);

  const loadBlockchainData = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        const signer = await provider.getSigner();
        const c = new ethers.Contract(CONTRACT_ADDRESS, LandABI.abi, signer);
        setContract(c);
        await checkUserRole(c, accounts[0]);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      }
    }
  }, [checkUserRole]);

  useEffect(() => {
    loadBlockchainData();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => loadBlockchainData());
    }
  }, [loadBlockchainData]);

  const isHomePage = activeTab === 'home';

  return (
    <div className="dark bg-background text-on-surface font-body min-h-screen relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 grid-pattern pointer-events-none"></div>
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <TopNav
        account={account}
        userRole={userRole}
        onConnect={loadBlockchainData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {!isHomePage && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      )}

      <main className={`relative z-10 pt-20 ${!isHomePage ? 'md:pl-64' : ''}`}>
        {isHomePage ? (
          <Home onConnect={loadBlockchainData} setActiveTab={setActiveTab} account={account} />
        ) : (
          <div className="px-6 lg:px-10 py-8 flex justify-start">
            {activeTab === 'dashboard' && (
              <Dashboard contract={contract} account={account} userRole={userRole} setActiveTab={setActiveTab} />
            )}
            {activeTab === 'register' && (
              <RegisterUser contract={contract} account={account} />
            )}
            {activeTab === 'inspector' && (
              <InspectorPanel contract={contract} userRole={userRole} />
            )}
            {activeTab === 'addLand' && (
              <AddLand contract={contract} userRole={userRole} />
            )}
            {activeTab === 'viewLands' && (
              <ViewLands contract={contract} />
            )}
            {activeTab === 'transfer' && (
              <TransferLand contract={contract} userRole={userRole} />
            )}
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'dashboard', icon: 'grid_view', label: 'Stats' },
          { id: 'viewLands', icon: 'map', label: 'Lands' },
          { id: 'transfer', icon: 'account_tree', label: 'TX' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            <span className="material-symbols-outlined" style={activeTab === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px] font-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
