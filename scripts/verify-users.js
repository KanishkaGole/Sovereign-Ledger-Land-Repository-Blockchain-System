// Script to verify sellers and buyers
// Run with: truffle exec scripts/verify-users.js

const Land = artifacts.require("Land");

module.exports = async function(callback) {
  try {
    const land = await Land.deployed();
    const accounts = await web3.eth.getAccounts();
    
    console.log("Land Inspector:", accounts[0]);
    console.log("\nVerifying users...\n");

    // Get all sellers
    const sellers = await land.getSeller();
    console.log(`Found ${sellers.length} sellers`);
    
    for (let seller of sellers) {
      const isVerified = await land.isVerified(seller);
      if (!isVerified) {
        await land.verifySeller(seller, {from: accounts[0]});
        console.log(`✓ Verified seller: ${seller}`);
      } else {
        console.log(`Already verified: ${seller}`);
      }
    }

    // Get all buyers
    const buyers = await land.getBuyer();
    console.log(`\nFound ${buyers.length} buyers`);
    
    for (let buyer of buyers) {
      const isVerified = await land.isVerified(buyer);
      if (!isVerified) {
        await land.verifyBuyer(buyer, {from: accounts[0]});
        console.log(`✓ Verified buyer: ${buyer}`);
      } else {
        console.log(`Already verified: ${buyer}`);
      }
    }

    console.log("\n✓ All users verified!");
    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
