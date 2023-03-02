import { ethers } from "hardhat"

describe("Basic test for undertstanding ERC20", async ()=>{
    beforeEach(async () => {
        const myTokenContractFactory = await ethers.getContractFactory("MyToken");
        const myTokenContract = await myTokenContractFactory.deploy();
        const deployTxReceipt = myTokenContract.deployTransaction.wait();
    })
})

function main(){

}