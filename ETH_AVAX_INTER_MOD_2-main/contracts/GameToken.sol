// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Author: Anushka

contract Insurance {
    address payable public owner;
    mapping(address => uint256) public policies;
    mapping(address => uint256) public claims;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    function buyPolicy(address _address, uint256 _amount) public onlyOwner {
        policies[_address] += _amount;
    }

    function fileClaim(address _address, uint256 _amount) public {
        require(policies[_address] >= _amount, "Insufficient policy amount");
        claims[_address] += _amount;
        policies[_address] -= _amount;
    }

    function getPolicies() public view returns (uint256[] memory) {
        uint256[] memory policyList = new uint256[](policies[msg.sender]);
        return policyList;
    }

    function getClaims() public view returns (uint256[] memory) {
        uint256[] memory claimList = new uint256[](claims[msg.sender]);
        return claimList;
    }
}
