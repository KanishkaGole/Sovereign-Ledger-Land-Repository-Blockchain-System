#!/bin/bash

echo "🚀 Land Registry Quick Start Script"
echo "===================================="
echo ""

# Check if Ganache is running
echo "📡 Checking Ganache connection..."
if ! nc -z 127.0.0.1 7545 2>/dev/null; then
    echo "❌ Ganache is not running on port 7545"
    echo "Please start Ganache and try again"
    exit 1
fi
echo "✓ Ganache is running"
echo ""

# Compile contracts
echo "🔨 Compiling smart contracts..."
truffle compile
if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi
echo "✓ Contracts compiled"
echo ""

# Deploy contracts
echo "🚀 Deploying contracts to Ganache..."
truffle migrate --reset
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi
echo "✓ Contracts deployed"
echo ""

# Get contract address
echo "📝 Contract deployed successfully!"
echo ""
echo "⚠️  IMPORTANT: Copy the Land contract address from above"
echo "    and update it in: land-registry-frontend/src/App.js"
echo "    Line 9: const CONTRACT_ADDRESS = '0xYourAddress';"
echo ""

# Install frontend dependencies if needed
if [ ! -d "land-registry-frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd land-registry-frontend
    npm install
    cd ..
    echo "✓ Dependencies installed"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update CONTRACT_ADDRESS in land-registry-frontend/src/App.js"
echo "2. Configure MetaMask (Network: localhost:7545, Chain ID: 1337)"
echo "3. Import a Ganache account to MetaMask"
echo "4. Run: cd land-registry-frontend && npm start"
echo ""
