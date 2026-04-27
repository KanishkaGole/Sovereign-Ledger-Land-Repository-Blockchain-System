@echo off
echo ========================================
echo Land Registry Quick Start Script
echo ========================================
echo.

REM Check if truffle is installed
where truffle >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Truffle is not installed
    echo Please install: npm install -g truffle
    pause
    exit /b 1
)

echo Compiling smart contracts...
call truffle compile
if %ERRORLEVEL% NEQ 0 (
    echo Error: Compilation failed
    pause
    exit /b 1
)
echo Done: Contracts compiled
echo.

echo Deploying contracts to Ganache...
call truffle migrate --reset
if %ERRORLEVEL% NEQ 0 (
    echo Error: Deployment failed
    echo Make sure Ganache is running on port 7545
    pause
    exit /b 1
)
echo Done: Contracts deployed
echo.

echo ========================================
echo IMPORTANT: Copy the Land contract address from above
echo and update it in: land-registry-frontend\src\App.js
echo Line 9: const CONTRACT_ADDRESS = '0xYourAddress';
echo ========================================
echo.

REM Check if frontend dependencies are installed
if not exist "land-registry-frontend\node_modules" (
    echo Installing frontend dependencies...
    cd land-registry-frontend
    call npm install
    cd ..
    echo Done: Dependencies installed
    echo.
)

echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update CONTRACT_ADDRESS in land-registry-frontend\src\App.js
echo 2. Configure MetaMask (Network: localhost:7545, Chain ID: 1337)
echo 3. Import a Ganache account to MetaMask
echo 4. Run: cd land-registry-frontend ^&^& npm start
echo.
pause
