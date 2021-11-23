//SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {

    uint256 constant private MAX_SUPPLY =  10000000 * (10 ** 18);

    constructor(
        string memory name,
        string memory symbol
    ) public ERC20(name, symbol) {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function faucet() public {
        _mint(msg.sender, 10000 * (10 ** 18));
    }

}
