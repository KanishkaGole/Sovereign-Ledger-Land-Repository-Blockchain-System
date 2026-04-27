# Update Contract After Migration Reset

After resetting migrations, follow these steps to update the frontend with the new contract address:

## Steps:

1. **Compile the contracts:**
   ```bash
   truffle compile
   ```

2. **Reset and migrate:**
   ```bash
   truffle migrate --reset --network development
   ```

3. **Copy the updated Land.json to frontend:**
   ```bash
   # Windows (PowerShell)
   Copy-Item "build/contracts/Land.json" -Destination "land-registry-frontend/src/artifacts/Land.json" -Force
   
   # Or manually copy:
   # From: build/contracts/Land.json
   # To: land-registry-frontend/src/artifacts/Land.json
   ```

4. **Restart the frontend:**
   ```bash
   cd land-registry-frontend
   npm start
   ```

5. **Clear browser cache and reconnect MetaMask**
   - Refresh the page (Ctrl+F5)
   - Disconnect and reconnect your MetaMask wallet

## Why this is needed:

When you reset migrations, Truffle deploys a new instance of the contract with a new address. The frontend needs the updated `Land.json` file which contains:
- The new contract address
- The contract ABI
- Network information

The first account (index 0) on Ganache is automatically set as the Land Inspector in the contract constructor, but the frontend won't recognize it until you update the Land.json file.
