import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat"
import { MyToken } from "../typechain-types";

describe("Basic test for undertstanding ERC20", async ()=>{

    let myTokenContract:MyToken;
    let signers: SignerWithAddress[];
    beforeEach(async () => {
        signers = await ethers.getSigners();
        const myTokenContractFactory = await ethers.getContractFactory("MyToken");
        myTokenContract = await myTokenContractFactory.deploy();
        await myTokenContract.deployTransaction.wait();
    });

    it("it should have zero total supply at deployment", async () => {
        const totalSupply = await myTokenContract.totalSupply();
        expect(totalSupply).to.eq(0);
    })

    it ("Triggers transfer event with the address of the sender when sending transations", async () => {
        await expect(myTokenContract.transfer(signers[1].address, 10)).to.emit(myTokenContract, "Transfer").withArgs();
    })
});

function main(){

}