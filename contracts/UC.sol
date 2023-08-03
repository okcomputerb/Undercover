// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UC is ERC20 {
    constructor(uint256 initialSupply) ERC20("UC", "UC") {
        _mint(msg.sender, initialSupply);
    }
}
