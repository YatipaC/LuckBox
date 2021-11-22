//SPDX-License-Identifier: MIT

pragma solidity 0.6.12;


interface ILuckbox {

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function ticketPrice() external pure returns (uint256);

}