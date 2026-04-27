import React, { useState, useEffect, useCallback } from 'react';

const LAND_IMAGES = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&q=80&auto=format', // Dirt plot
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop&q=80&auto=format', // Empty field
  'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&h=600&fit=crop&q=80&auto=format', // Barren land
  'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&h=600&fit=crop&q=80&auto=format', // Dry land
  'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=600&fit=crop&q=80&auto=format', // Desert land
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=600&fit=crop&q=80&auto=format', // Rocky terrain
];

function ViewLands({ contract }) {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadLands = useCallback(async () => {
    if (!contract) return;
    setLoading(true); setMessage('');
    try {
      const count = await contract.getLandsCount();
      const landsArray = [];
      for (let i = 1; i <= count; i++) {
        const land = await contract.lands(i);
        const owner = await contract.getLandOwner(i);
        const isVerified = await contract.isLandVerified(i);
        
        // Check if land is requested/sold by checking all requests
        let isSold = false;
        try {
          const requestsCount = await contract.getRequestsCount();
          for (let j = 1; j <= requestsCount; j++) {
            const request = await contract.RequestsMapping(j);
            // If this land has a request and ownership has been transferred
            if (request.landId.toString() === land.id.toString()) {
              const currentOwner = await contract.getLandOwner(land.id);
              // If owner changed from seller to buyer, land is sold
              if (currentOwner.toLowerCase() !== request.sellerId.toLowerCase()) {
                isSold = true;
                break;
              }
            }
          }
        } catch (e) {
          // If no requests exist yet, continue
        }
        
        // Show lands that are not sold and have valid owner and price
        const zeroAddress = '0x0000000000000000000000000000000000000000';
        if (!isSold && owner !== zeroAddress && land.landPrice.toString() !== '0') {
          landsArray.push({
            id: land.id.toString(),
            area: land.area.toString(),
            city: land.city,
            state: land.state,
            price: land.landPrice.toString(),
            propertyPID: land.propertyPID.toString(),
            surveyNumber: land.physicalSurveyNumber.toString(),
            owner,
            verified: isVerified,
          });
        }
      }
      setLands(landsArray);
    } catch (error) {
      setMessage(`Error loading lands: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => { loadLands(); }, [loadLands]);

  return (
    <div className="max-w-7xl w-full pt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="font-headline text-5xl font-bold text-on-surface tracking-tighter mb-2">Registry Explorer</h2>
          <p className="text-on-surface-variant max-w-lg font-body">
            Browse sovereign land assets verified on the decentralized ledger. Each parcel is backed by a cryptographically signed deed.
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Total Value Locked</p>
            <p className="font-headline text-3xl font-light text-primary">
              {lands.reduce((acc, l) => acc + parseFloat(l.price || '0'), 0).toLocaleString()} Wei
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Verified Parcels</p>
            <p className="font-headline text-3xl font-light text-on-surface">{lands.length}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-8 p-4 border-l-2 border-error bg-error/10 text-error flex gap-4">
          <span className="material-symbols-outlined">error</span>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Grid */}
      {lands.length === 0 && !loading ? (
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">landscape</span>
          <p className="text-on-surface-variant text-lg font-headline">No lands registered yet</p>
          <p className="text-outline text-sm mt-2">Be the first to mint a sovereign asset</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lands.map((land, i) => (
            <div key={land.id} className="group relative bg-surface-container overflow-hidden transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={LAND_IMAGES[i % LAND_IMAGES.length]}
                  alt={`Land in ${land.city}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400/121a25/99f7ff?text=Land+%23' + land.id; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-surface">
                      {land.city} {land.state}
                    </h3>
                    <p className="text-xs font-label text-on-surface-variant flex items-center mt-1">
                      <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                      {land.city}, {land.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-label text-on-surface-variant uppercase">List Price</p>
                    <p className="text-primary font-bold text-lg leading-tight">
                      {parseFloat(land.price).toLocaleString()} Wei
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-label text-on-surface-variant uppercase">Parcel ID</span>
                    <span className="text-xs font-label text-on-surface font-mono">ID_{land.propertyPID}-{land.id}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-label text-on-surface-variant uppercase">Area</span>
                    <span className="text-xs font-label text-on-surface">
                      {land.area} sqft
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-label text-on-surface-variant">
                    Owner: {land.owner.slice(0, 8)}...{land.owner.slice(-6)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {lands.length > 0 && (
        <div className="mt-16 flex flex-col items-center gap-6">
          <button
            onClick={loadLands}
            className="px-10 py-4 rounded-full bg-surface-container-highest text-on-surface font-bold tracking-widest uppercase text-xs hover:bg-surface-bright hover:shadow-[0_0_20px_rgba(153,247,255,0.3)] hover:scale-105 transition-all active:scale-95 border-b-2 border-primary"
          >
            Synchronize More Records
          </button>
          <p className="text-[10px] font-label text-on-surface-variant opacity-50">
            Showing {lands.length} verified entries
          </p>
        </div>
      )}
    </div>
  );
}

export default ViewLands;
