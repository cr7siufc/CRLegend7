// deploy.js (modified for local testing)
require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    // Connect to Hardhat's local network
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Since we're using Hardhat, we don't need to specify the provider or wallet manually
    const Cr7SIU = await ethers.getContractFactory("Cr7SIU");
    
    console.log("Deploying Cr7SIU...");
    const cr7siu = await Cr7SIU.deploy();
    await cr7siu.deployed();
    console.log("Cr7SIU deployed to:", cr7siu.address);

    // Set initial value if your contract has a function like 'set'
    if (typeof cr7siu.set === 'function') {
        console.log("Setting initial value to 10...");
        const setTx = await cr7siu.set(10);
        await setTx.wait(); // Wait for transaction to be mined
        console.log("Value set to 10");
    } else {
        console.warn("Function 'set' not found in the contract.");
    }

    // Optionally, you can check if the value was set:
    if (typeof cr7siu.get === 'function') {
        const value = await cr7siu.get();
        console.log("Current value:", value.toString());
    } else {
        console.warn("Function 'get' not found in the contract.");
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });