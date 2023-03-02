import { expect } from "chai";
import { ethers } from "hardhat"
import { MyToken } from "../typechain-types";

describe("Basic test for undertstanding ERC20", async ()=>{

    let myTokenContract:MyToken
    beforeEach(async () => {
        const myTokenContractFactory = await ethers.getContractFactory("MyToken");
        myTokenContract = await myTokenContractFactory.deploy();
        await myTokenContract.deployTransaction.wait();
    });

    it("it should have zero total supply at deployment", async () => {
        const totalSupply = await myTokenContract.totalSupply();
        expect(totalSupply).to.eq(0);
    })
});

function main(){

}