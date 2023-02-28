import { ethers } from "hardhat";

async function main() {
    const MyTokenContractFactory = await ethers.getContractFactory("MyToken");
    const MyTokenContract = await MyTokenContractFactory.deploy();
    const deployTxReceipt = await MyTokenContract.deployTransaction.wait();
    console.log(`Token contract was deployed at address ${MyTokenContract.address} at block ${deployTxReceipt.blockNumber}`)
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})