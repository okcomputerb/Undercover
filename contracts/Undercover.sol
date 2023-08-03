// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Undercover is Ownable {

    error PermissionDenied();

    bytes32 public merkleRoot;
    IERC20 public token;
    uint public rootVersion = 1;
    mapping(address => uint) public lastClaimedVersion;

    constructor(bytes32 merkleRoot_, IERC20 token_) {
        merkleRoot = merkleRoot_;
        token = token_;
    }

   function merkelRoot() external view returns (bytes32) {
        return merkleRoot;
   }

    receive() external payable {}

    function deposit(uint amount) public payable {
        token.transfer(address(this), amount);
    }

    function updateRoot(bytes32 newRoot) public onlyOwner {
        merkleRoot = newRoot;
        rootVersion++;
    }

    function updateToken(IERC20 newToken) public onlyOwner {
        token = newToken;
    }

    // Does nothing if caller provides valid merkle proof, otherwise reverts.
    function claim(bytes32[] calldata proof, uint amount) external {
        require(lastClaimedVersion[msg.sender] < rootVersion, "Reward claimed");
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");
        token.transfer(msg.sender, amount);
        lastClaimedVersion[msg.sender] = rootVersion;
    }
}
