// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./LuckBox.sol";
// import "./interfaces/ILuckbox.sol";

/**
 * @title Factory for creating new luckbox contract.
 */

contract Factory is ReentrancyGuard, Ownable {
    struct Box {
        string name;
        string symbol;
        address owner;
        address contractAddress;
    }

    Box[] public boxes;
    uint256 public totalBoxes;

    // Fee section
    address public feeAddr;
    uint256 public feePercent;
    uint256 public constant MAX_FEE = 1000; // 10%

    event LuckboxCreated(address indexed _address);
    event SetFee(uint256 _fee);

    function createLuckbox(
        string calldata name,
        string calldata symbol,
        uint256 ticketPrice
    ) external nonReentrant {
        LuckBox luckbox = new LuckBox(name, symbol, ticketPrice, address(this));

        luckbox.transferOwnership(msg.sender);

        address newLuckbox = (address(luckbox));

        boxes.push(
            Box({
                name: name,
                symbol: symbol,
                owner: msg.sender,
                contractAddress: newLuckbox
            })
        );

        totalBoxes += 1;

        emit LuckboxCreated(newLuckbox);
    }

    function setFee(uint256 _feePercent) public onlyOwner {
        require(_feePercent <= MAX_FEE, "Below MAX_FEE Please");
        feePercent = _feePercent;

        emit SetFee(feePercent);
    }

    function getBoxOwner(uint256 _id) public view returns (address) {
        return boxes[_id].owner;
    } 

    function getBoxContractAddress(uint256 _id) public view returns (address) {
        return boxes[_id].contractAddress;
    }

    function getBoxName(uint256 _id) public view returns (string memory) {
        return boxes[_id].name;
    }

    function getBoxSymbol(uint256 _id) public view returns (string memory) {
        return boxes[_id].symbol;
    }

}
