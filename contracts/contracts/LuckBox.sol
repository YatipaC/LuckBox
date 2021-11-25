// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; 
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
// import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
// import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

// import "./interfaces/IUniswapV2Router02.sol";
// import "./interfaces/ILuckbox.sol";
// import "./utility/LibMath.sol";

contract LuckBox is VRFConsumerBase, Ownable, ReentrancyGuard, IERC721Receiver, ERC165, ERC721Holder {
    using SafeMathChainlink for uint256;
    using SafeERC20 for IERC20;
    // using LibMathSigned for int256;
    // using LibMathUnsigned for SafeMathChainlink;

    mapping(bytes32 => address) private requestIdToAddress;

    // for identification purposes
    string public name;
    string public symbol;

    uint256 public ticketPrice;

    // Chainlink
    address public constant VRF_COORDINATOR =
        0x3d2341ADb2D31f1c5530cDC622016af293177AE0;
    address public constant LINK_TOKEN =
        0xb0897686c545045aFc77CF20eC7A532E3120E0F1;
    bytes32 public constant KEY_HASH =
        0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
    uint256 public constant FEE = 100000000000000; // 0.0001 LINK

    // Quickswap

    // IUniswapV2Router02 public constant ROUTER =
    //     IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    // address public constant USDC_TOKEN =
    //     0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    
    struct Slot {
        address assetAddress;
        uint256 tokenId;
        bool is1155;
        bool locked;
        uint256 randomnessChance;
        bool pendingWinnerToClaim; 
        address winner;
    }

    mapping(uint8 => Slot) public list;

    struct Result {
        bytes32 requestId;
        address drawer;
        bool won;
        uint8 slot;
        uint256 output;
        uint256 eligibleRange;
    }

    mapping(uint256 => Result) public result;

    uint256 public resultCount;

    uint8 constant public MAX_SLOT = 9;

    event UpdatedTicketPrice(uint256 ticketPrice);
    event Draw(address indexed drawer, bytes32 requestId);
    event ClaimNft(address indexed receiver, address factory, address tokenId);
    event DepositedNft(uint8 slotId, address assetAddress, uint256 tokenId, bool is1155, uint256 randomness);
    event WithdrawnNft(uint8 slotId);
    event Drawn(address indexed drawer, bool won );
    event Claimed(uint8 slotId, address winner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ticketPrice
    ) public VRFConsumerBase(VRF_COORDINATOR, LINK_TOKEN) {
        require( _ticketPrice != 0 , "Invalid ticket price");

        name = _name;
        symbol = _symbol;
        ticketPrice = _ticketPrice;

        _registerInterface(IERC721Receiver.onERC721Received.selector);

    }

    function draw() public nonReentrant payable returns (bytes32 requestId) {
        require(msg.value == ticketPrice , "Payment is not attached");

        require(
            IERC20(LINK_TOKEN).balanceOf(address(this)) >= FEE,
            "Insufficient LINK to proceed VRF"
        );

        requestId = requestRandomness(KEY_HASH, FEE);
        requestIdToAddress[requestId] = msg.sender;

        emit Draw(msg.sender, requestId);
    }

    // find the current winning rates
    function winningRates() public view returns (uint256) {
        uint256 increment = 0;
        for (uint8 i = 0; i < MAX_SLOT; i++) {

            Slot storage slot = list[i];

            if (slot.locked && slot.pendingWinnerToClaim == false) {
                increment += slot.randomnessChance;
            }
        }
        return increment;
    }

    function parseRandomUInt256(uint256 input) public pure returns (uint256) {
        return _parseRandomUInt256(input);
    }

    function totalEth() public view returns (uint256) {
        return address(this).balance;
    }

    function totalLink() public view returns (uint256) {
        return IERC20(LINK_TOKEN).balanceOf(address(this));
    }

    function claimNft(uint8 _slotId) public {
        require( MAX_SLOT > _slotId, "Invalid slot ID" );
        require( list[_slotId].locked == true , "The slot is empty" );
        require( list[_slotId].pendingWinnerToClaim == true, "Still has no winner");
        require( list[_slotId].winner == msg.sender, "The caller is not the winner");

        if (list[_slotId].is1155) {
            // IERC1155(list[_slotId].assetAddress).safeTransferFrom(  address(this), msg.sender , list[_slotId].tokenId , 1 , "0x00");
        } else {
            IERC721(list[_slotId].assetAddress).safeTransferFrom(  address(this), msg.sender,  list[_slotId].tokenId );
        }

        list[_slotId].locked = false;
        list[_slotId].assetAddress = address(0);
        list[_slotId].tokenId = 0;
        list[_slotId].is1155 = false;
        list[_slotId].randomnessChance = 0;
        list[_slotId].pendingWinnerToClaim = false;

        emit Claimed(_slotId, msg.sender);
    }

    // ONLY OWNER CAN PROCEED

    // for local testing 
    // _randomNumber must be in between 0 - 2^10**256
    function forceDraw( uint256 _randomNumber) public payable onlyOwner nonReentrant {
        require(msg.value == ticketPrice , "Payment is not attached");
        
        _draw(_randomNumber, msg.sender , "0x00");
    } 

    function withdrawAllEth() public onlyOwner nonReentrant {
        uint amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    function withdrawLink(uint _amount) public onlyOwner nonReentrant {
        IERC20(LINK_TOKEN).safeTransfer(msg.sender, _amount);
    }

    function setTicketPrice(uint256 _ticketPrice) public onlyOwner nonReentrant {
        require( _ticketPrice != 0 , "Invalid ticket price");

        ticketPrice = _ticketPrice;
        emit UpdatedTicketPrice(_ticketPrice);
    }


    // not supported ERC-1155 for now
    // randomness value -> 1% = 100, 10% = 1000 and not allows more than 10% per each slot
    function depositNft(uint8 _slotId , uint256 _randomness, address _assetAddress, uint256 _tokenId, bool _is1155) public nonReentrant onlyOwner {
        require( MAX_SLOT > _slotId, "Invalid slot ID" );
        require( 1000 >= _randomness , "Randomness value must be between 0-1000");
        require( _is1155 == false , "Not supported ERC-1155 yet");
        require( list[_slotId].locked == false , "The slot is occupied" );

        // take the NFT
        if (_is1155) {
            // IERC1155(_assetAddress).safeTransferFrom( msg.sender , address(this), _tokenId , 1 , "0x00");
        } else {
            IERC721(_assetAddress).safeTransferFrom( msg.sender, address(this), _tokenId );
        }

        list[_slotId].locked = true;
        list[_slotId].assetAddress = _assetAddress;
        list[_slotId].tokenId = _tokenId;
        list[_slotId].is1155 = _is1155;
        list[_slotId].randomnessChance = _randomness;
        list[_slotId].pendingWinnerToClaim = false;
    
        emit DepositedNft(_slotId, _assetAddress, _tokenId, _is1155, _randomness);
    }

    function withdrawNft(uint8 _slotId)  public nonReentrant onlyOwner {
        require( MAX_SLOT > _slotId, "Invalid slot ID" );
        require( list[_slotId].locked == true , "The slot is empty" );
        require( list[_slotId].pendingWinnerToClaim == false, "The asset locked is being claimed by the winner");

        if (list[_slotId].is1155) {
            // IERC1155(list[_slotId].assetAddress).safeTransferFrom(  address(this), msg.sender , list[_slotId].tokenId , 1 , "0x00");
        } else {
            IERC721(list[_slotId].assetAddress).safeTransferFrom(  address(this), msg.sender,  list[_slotId].tokenId );
        }

        list[_slotId].locked = false;
        list[_slotId].assetAddress = address(0);
        list[_slotId].tokenId = 0;
        list[_slotId].is1155 = false;
        list[_slotId].randomnessChance = 0;
        list[_slotId].pendingWinnerToClaim = false;

        emit WithdrawnNft(_slotId);
    }

    // PRIVATE FUNCTIONS

    // callback from Chainlink VRF
    function fulfillRandomness(bytes32 requestId, uint256 _randomness)
        internal
        override
    {
        address receiver = requestIdToAddress[requestId];
        _draw(_randomness, receiver , requestId);
    }

    function _parseRandomUInt256(uint256 input) internal pure returns (uint256) {
        return input.mod(10000);
    }

    function _draw(uint256 _randomNumber, address _drawer, bytes32 _requestId) internal {
        uint256 parsed = _parseRandomUInt256(_randomNumber); // parse into 0-10000 or 0.00-100.00%
        uint256 increment = 0;
        bool won = false;
        uint8 winningSlot = 0;

        for (uint8 i = 0; i < MAX_SLOT; i++) {
            Slot storage slot = list[i];
            if (slot.locked && slot.pendingWinnerToClaim == false) {
                increment += slot.randomnessChance;
                // keep incrementing until the random number has been hitted
                if (increment > parsed && !won) {
                    slot.pendingWinnerToClaim = true;
                    slot.winner = _drawer;
                    
                    won = true;
                    winningSlot = i;
                }
            }
        }

        // keep track of the result
        result[resultCount].requestId = _requestId;
        result[resultCount].drawer = _drawer;
        result[resultCount].won = won;
        result[resultCount].slot = winningSlot;
        result[resultCount].output = parsed;
        result[resultCount].eligibleRange = increment;

        resultCount += 1;

        emit Drawn(_drawer, won);
    }

}
