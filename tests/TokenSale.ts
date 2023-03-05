import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import exp from "constants";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { MyToken, MyToken__factory, TokenSale, TokenSale__factory } from "../typechain-types";
import { PromiseOrValue } from "../typechain-types/common";

const TEST_TOKEN_RATIO = 1;
const TEST_TOKEN_PRICE = ethers.utils.parseEther("0.02");
const TEST_TOKEN_MINT = ethers.utils.parseUnits("1");

describe("NFT Shop", async () => {
    let tokenSaleContract: TokenSale;
    let tokenContract: MyToken;
    let deployer: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;

    beforeEach(async () => {
        [deployer, account1, account2] = await ethers.getSigners();
        
        const tokenContractFactory = new MyToken__factory(deployer);
        tokenContract = await tokenContractFactory.deploy();
        await tokenContract.deployTransaction.wait();

        const tokenSaleContractFactory = new TokenSale__factory(deployer);
        tokenSaleContract = await tokenSaleContractFactory.deploy(TEST_TOKEN_RATIO, tokenContract.address);
        await tokenSaleContract.deployTransaction.wait()

        const minterRole = await tokenContract.MINTER_ROLE()
        const giveTokenMintRoleTx = await tokenContract.grantRole(minterRole, tokenSaleContract.address);
        await giveTokenMintRoleTx.wait();
    });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const ratio = await tokenSaleContract.ratio();
      expect(ratio).to.eq(TEST_TOKEN_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const tokenAddress = await tokenSaleContract.tokenAddress();
      const tokenContractFactory = new MyToken__factory(deployer);
      const tokenUsedInContract = tokenContractFactory.attach(tokenAddress)
      await expect(tokenUsedInContract.totalSupply()).to.not.be.reverted;
      await expect(tokenUsedInContract.balanceOf(account1.address)).to.not.be.reverted;
      await expect(tokenUsedInContract.transfer(account1.address, 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
    });
  });

  describe("When a user buys an ERC20 from the Token contract", async () => {
    let tokenBalanceBeforeMint: BigNumber;
    let ethBalanceBeforeMint: BigNumber;
    let mintTxGasCost: BigNumber;
    beforeEach(async () => {
        tokenBalanceBeforeMint = await tokenContract.balanceOf(account1.address)
        ethBalanceBeforeMint = await account1.getBalance();
        const buyTokensTx = await tokenSaleContract.connect(account1).buyTokens({value: TEST_TOKEN_MINT});
        const buyTokensTxReceipt = await buyTokensTx.wait();
        mintTxGasCost = buyTokensTxReceipt.gasUsed.mul(buyTokensTxReceipt.effectiveGasPrice)
    });

    it("charges the correct amount of ETH", async () => {
        const ethBalanceAfterMint = await account1.getBalance();
        expect(ethBalanceBeforeMint.sub(ethBalanceAfterMint)).to.eq(TEST_TOKEN_MINT.add(mintTxGasCost))
    });
    

    it("gives the correct amount of tokens", async () => {
        const tokenBalanceAfterMint = await tokenContract.balanceOf(account1.address);
        expect(tokenBalanceAfterMint.sub(tokenBalanceBeforeMint)).to.eq(
            TEST_TOKEN_MINT.mul(TEST_TOKEN_RATIO)
        );
    });
  

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    let tokenBalanceBeforeBurn: BigNumber;
    let burnAmount: BigNumber;
    let ethBalanceBeforeBurn: BigNumber;
    let allowTxgasCost: BigNumber;
    let burnTxgasCost: BigNumber;

    beforeEach(async () => {
      ethBalanceBeforeBurn = await account1.getBalance();
        tokenBalanceBeforeBurn = await tokenContract.balanceOf(account1.address);
        burnAmount = tokenBalanceBeforeBurn.div(2);
        const allowTx = await tokenContract.connect(account1).approve(tokenSaleContract.address, burnAmount);
        const allowTxReceipt = await allowTx.wait();
        allowTxgasCost = allowTxReceipt.gasUsed.mul(allowTxReceipt.effectiveGasPrice);
        const burnTx = await tokenSaleContract.connect(account1).burnTokens(burnAmount);
        const burnTxReceipt = await burnTx.wait();
        burnTxgasCost = burnTxReceipt.gasUsed.mul(burnTxReceipt.effectiveGasPrice);
    });

    it("gives the correct amount of ETH", async () => {
      const ethBalanceAfterBurn = await account1.getBalance();
      const diff = ethBalanceAfterBurn.sub(ethBalanceBeforeBurn);
      const costs = allowTxgasCost.add(burnTxgasCost);
      expect(diff).to. eq(burnAmount.div(TEST_TOKEN_RATIO).sub(costs));
    });

    it("burns the correct amount of tokens", async () => {
      const tokenBalanceAfterBurn = await tokenContract.balanceOf(account1.address)
      const diff = tokenBalanceBeforeBurn.sub(tokenBalanceAfterBurn);
      expect(diff).to.eq(burnAmount);
      
    });
  });
});
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the public pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});