// SPDX-License-Identifier: MIT
pragma solidity >0.7 <0.9;

contract TokenSale {
    uint256 public ratio;
    address public tokenAddress;

    constructor(uint256 _ratio, address _tokenAddress){
        ratio = _ratio;
        tokenAddress = _tokenAddress;
    }
}