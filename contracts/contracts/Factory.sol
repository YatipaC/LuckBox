// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LuckBox.sol";
import "./interfaces/ILuckbox.sol";

/**
 * @title Factory for creating new luckbox contract.
 */

contract Factory is ReentrancyGuard {
    struct Box {
        string name;
        string symbol;
        address owner;
        address contractAddress;
    }

    Box[] public boxes;
    uint256 public totalBoxes;

    event LuckboxCreated(address indexed _address);

    function createLuckbox(
        string calldata name,
        string calldata symbol,
        uint256 ticketPrice
    ) external nonReentrant {
        LuckBox luckbox = new LuckBox(name, symbol, ticketPrice);

        luckbox.transferOwnership(msg.sender);

        ILuckbox newLuckbox = ILuckbox(address(luckbox));

        boxes.push(
            Box({
                name: name,
                symbol: symbol,
                owner: msg.sender,
                contractAddress: address(newLuckbox)
            })
        );

        totalBoxes += 1;

        emit LuckboxCreated(address(newLuckbox));
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