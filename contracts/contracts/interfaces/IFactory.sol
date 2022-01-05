//SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface IFactory {
  function devAddr() external pure returns (address);

  function feePercent() external pure returns (uint256);

  function MAX_FEE() external pure returns (uint256);

  function randomNonce() external view returns (uint256);

}
