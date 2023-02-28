import { ethers } from "hardhat";

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    const MyTokenContractFactory = await ethers.getContractFactory("MyToken");
    const MyTokenContract = await MyTokenContractFactory.deploy();
    const deployTxReceipt = await MyTokenContract.deployTransaction.wait();
    console.log(`Token contract was deployed at address ${MyTokenContract.address} at block ${deployTxReceipt.blockNumber}`)


    const contractName = await MyTokenContract.name();
    const contractSymbol = await MyTokenContract.symbol();
    let totalSupply = await MyTokenContract.totalSupply();
    console.log(`The contract name is ${contractName} \nThe contract symbol is ${contractSymbol} \nand total supply is ${totalSupply} decimal units`);
    const mintTx = await MyTokenContract.mint(signer.address, 10);
    const mintTxReceipt = await mintTx.wait();
    totalSupply = await MyTokenContract.totalSupply();
    console.log(
        `The mint transaction was completed in the Blcok ${mintTxReceipt.blockNumber} \ntotal supply is ${totalSupply} `
    )
}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
})