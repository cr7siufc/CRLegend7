// deploy.js
require('dotenv').config();
const { ethers } = require("ethers");

async function main() {
    // Connect to Ethereum mainnet via Infura
    const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
    
    // Create a wallet using the private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Assume you've compiled your contract and have the ABI and bytecode
    const Cr7SIU = await ethers.getContractFactory("Cr7SIU", {
        signer: wallet,
        // Here you would include the ABI and bytecode if using ethers directly
        // but since we're using getContractFactory, we assume these are in your project's build artifacts
    });
    
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

main().catch((error) => {
    console.error(error);
    process.exit(1);
});