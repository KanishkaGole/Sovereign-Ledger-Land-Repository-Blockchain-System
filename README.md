# Land Registration System with Blockchain  
## This work was presented at IEEE ICAECC'23 - <a href="https://ieeexplore.ieee.org/document/10560138">Checkout</a>
<img src="https://img.shields.io/badge/Ethereum-20232A?style=for-the-badge&logo=ethereum&logoColor=white"> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">

## 🚀 Modern Frontend Rebuild

This repository has been updated with a **modern React frontend** using the latest technologies while keeping the original blockchain smart contracts intact.

## Project Description:

This is an application of Land Registration System. 
Land registry in India as well as in many parts of the world is a very slow and inconvenient process. Current land registration & verification systems include an increasing number of fraud cases and loss of paperwork and court cases due to thousands of land records to maintain.  

The intuition behind building this was to make the process of land registration resilient and decreases the cases of fraud in the process. Using the system, validation of the lands is also possible as immutable transactions are being stored in the public ledger.  

So the Land Registration system using blockchain is a distributed system that will store all the transactions made during the process of land buying. This will also be helpful for buyers, sellers and government registrars to transfer the land ownership from seller to new buyer as well as it will accelerate the process of registration.  

## Tech Stack Used:

**Frontend:**
* React 18 (Create React App)
* ethers.js v6 (Modern Ethereum library)
* Modern JavaScript (ES6+)
* CSS3
* MetaMask Integration

**Backend:**
* Ethereum Blockchain (Truffle Suite)
* Solidity ^0.5.2
* Ganache (Local blockchain)

## Application Features:  

* **User Registration**: Sellers & Buyers can register for accounts
* **Land Inspector Dashboard**: Admin role for verification and approval
* **Add Land**: Verified sellers can register land properties
* **View Lands**: Browse all registered lands with details
* **Land Requests**: Buyers can request to purchase land
* **Approve Requests**: Sellers can approve buyer requests
* **Ownership Transfer**: Land Inspector facilitates ownership transfer
* **MetaMask Integration**: Secure wallet connection
* **Real-time Updates**: Live blockchain interaction

## Quick Start:

### Prerequisites
- Node.js (v14 or higher)
- Truffle: `npm install -g truffle`
- Ganache (GUI or CLI)
- MetaMask browser extension

### Installation & Deployment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd A
   ```

2. **Start Ganache**
   - Open Ganache GUI on port 7545, or
   - Run: `ganache -p 7545`

3. **Compile and Deploy Smart Contracts**
   ```bash
   truffle compile
   truffle migrate --reset
   ```
   
   **Important:** Copy the deployed `Land` contract address from the output!

4. **Setup Frontend**
   ```bash
   cd land-registry-frontend
   npm install
   ```

5. **Configure Contract Address**
   - Open `land-registry-frontend/src/App.js`
   - Update line 9 with your deployed contract address:
   ```javascript
   const CONTRACT_ADDRESS = '0xYourContractAddressHere';
   ```

6. **Configure MetaMask**
   - Add Ganache network (RPC: http://127.0.0.1:7545, Chain ID: 1337)
   - Import a Ganache account using its private key

7. **Start the Application**
   ```bash
   npm start
   ```
   
   The app will open at http://localhost:3000

## Project Structure:

```
A/
├── contracts/              # Solidity smart contracts
│   ├── Land.sol           # Main land registry contract
│   └── Migrations.sol
├── migrations/            # Truffle deployment scripts
├── land-registry-frontend/  # Modern React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── RegisterUser.js
│   │   │   ├── AddLand.js
│   │   │   ├── ViewLands.js
│   │   │   └── TransferLand.js
│   │   ├── artifacts/     # Contract ABIs (auto-generated)
│   │   ├── App.js         # Main application
│   │   └── config.js      # Configuration
│   └── package.json
├── scripts/               # Helper scripts
│   └── verify-users.js    # Auto-verify users script
├── truffle-config.js      # Truffle configuration
├── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
└── README.md              # This file
```

## Usage Guide:

### 1. Register as User
- Navigate to "Register" tab
- Choose user type (Buyer/Seller)
- Fill in required information
- Confirm transaction in MetaMask

### 2. Verify Users (Land Inspector)
The first Ganache account is the Land Inspector. Use Truffle console to verify users:

```bash
truffle console
let land = await Land.deployed()
let accounts = await web3.eth.getAccounts()

// Verify seller
await land.verifySeller('0xSellerAddress', {from: accounts[0]})

// Verify buyer
await land.verifyBuyer('0xBuyerAddress', {from: accounts[0]})
```

Or use the helper script:
```bash
truffle exec scripts/verify-users.js
```

### 3. Add Land (Verified Sellers)
- Go to "Add Land" tab
- Fill in land details (area, location, price, etc.)
- Submit transaction

### 4. View All Lands
- Go to "View Lands" tab
- Click "Refresh Lands" to load all properties

### 5. Transfer Land
- **Buyer**: Request land from seller
- **Seller**: Approve buyer's request
- **Inspector**: Transfer ownership to buyer

## Cleanup Old Frontend:

To remove the old client folder and clean up the project:

**Windows:**
```bash
cleanup.bat
```

**Linux/Mac:**
```bash
chmod +x cleanup.sh
./cleanup.sh
```

## Smart Contract Functions:

- `registerBuyer()` - Register as buyer
- `registerSeller()` - Register as seller
- `addLand()` - Add new land property
- `requestLand()` - Request to purchase land
- `approveRequest()` - Approve land purchase request
- `LandOwnershipTransfer()` - Transfer land ownership
- `verifySeller()` - Verify seller (inspector only)
- `verifyBuyer()` - Verify buyer (inspector only)
- `getLandsCount()` - Get total lands registered
- `lands()` - Get land details by ID

## Troubleshooting:

### MetaMask Issues
- Ensure MetaMask is connected to localhost:7545
- Reset account if transactions fail (Settings > Advanced > Reset Account)

### Contract Not Found
- Redeploy: `truffle migrate --reset`
- Update contract address in `App.js`

### Transaction Failures
- Check account has sufficient ETH
- Verify user role permissions
- Ensure user is verified by inspector

## Documentation:

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[land-registry-frontend/README.md](land-registry-frontend/README.md)** - Frontend-specific documentation

## What's New:

✅ Modern React 18 frontend  
✅ ethers.js v6 (latest Ethereum library)  
✅ Clean, responsive UI  
✅ Simplified component structure  
✅ Better error handling  
✅ Real-time blockchain updates  
✅ Updated dependencies (no broken packages)  
✅ Comprehensive documentation  

## Screenshots:

| | |
|:---:|:---:|
| <img src="Screenshots/Screenshot 2026-04-13 220125.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 220459.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 220512.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 220537.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 220555.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 220629.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 221132.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 221208.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 221235.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 221335.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 221344.png" width="480"> | <img src="Screenshots/Screenshot 2026-04-13 221407.png" width="480"> |
| <img src="Screenshots/Screenshot 2026-04-13 221427.png" width="480"> | |

## Contributing:

Contributions are welcome! Please feel free to submit a Pull Request.

## License:

This project is open source and available under the MIT License.

---

### Make sure to star the repository if you find it helpful!
![visitors](https://visitor-badge.laobi.icu/badge?page_id=vrii14.Land-Registration-with-Blockchain)
<a href="https://github.com/vrii14/Land-Registration-with-Blockchain/stargazers"><img src="https://img.shields.io/github/stars/vrii14/Land-Registration-with-Blockchain?color=yellow" alt="Stars Badge"/></a>
<a href="https://github.com/vrii14/Land-Registration-with-Blockchain/graphs/contributors"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/vrii14/Land-Registration-with-Blockchain?color=2b9348"></a>
