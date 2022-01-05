// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

import "./interfaces/IFactory.sol";

contract LuckBox is
  Ownable,
  ReentrancyGuard,
  IERC721Receiver,
  ERC165,
  ERC721Holder,
  ERC1155Holder
{
  using SafeMathChainlink for uint256;
  using SafeERC20 for IERC20;

  // for identification purposes
  string public name;
  string public symbol;

  uint256 public ticketPrice;

  // Slot info
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

  // History data
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

  // Reserve slots
  struct ReserveNft {
    address assetAddress;
    uint256 randomnessChance;
    uint256 tokenId;
    bool is1155;
  }

  mapping(uint256 => ReserveNft) public reserveQueue;
  uint256 public firstQueue = 1;
  uint256 public lastQueue = 0;

  uint8 public constant MAX_SLOT = 9;

  // factory address
  IFactory public factory;

  event UpdatedTicketPrice(uint256 ticketPrice);
  event Draw(address indexed drawer, bytes32 requestId);
  event ClaimNft(address indexed receiver, address factory, address tokenId);
  event DepositedNft(
    uint8 slotId,
    address assetAddress,
    uint256 tokenId,
    bool is1155,
    uint256 randomness
  );
  event WithdrawnNft(uint8 slotId);
  event Drawn(
    address indexed drawer,
    bool won,
    address assetAddress,
    uint256 tokenId
  );
  event Claimed(uint8 slotId, address winner);
  event StackedNft(
    address assetAddress,
    uint256 tokenId,
    uint256 randomness,
    bool is1155
  );

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _ticketPrice,
    address _factory
  ) public {
    require(_ticketPrice != 0, "Invalid ticket price");

    name = _name;
    symbol = _symbol;
    ticketPrice = _ticketPrice;
    factory = IFactory(_factory);

    _registerInterface(IERC721Receiver.onERC721Received.selector);
  }

  // pays $MATIC to draws a gacha
  function draw() public payable nonReentrant {
    require(msg.value == ticketPrice, "Payment is not attached");

    if (address(factory) != address(0)) {
      uint256 feeAmount = ticketPrice.mul(factory.feePercent()).div(10000);
      _safeTransferETH(factory.devAddr(), feeAmount);
    }

    // require(
    //   IERC20(LINK_TOKEN).balanceOf(address(this)) >= FEE,
    //   "Insufficient LINK to proceed VRF"
    // );

    uint256 hashRandomNumber = uint256(
      keccak256(
        abi.encodePacked(now, msg.sender, factory.randomNonce(), address(this))
      )
    );

    _draw(hashRandomNumber, msg.sender, "0x00");

    emit Draw(msg.sender, "0x00");
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

  // check total ETH locked in the contract
  function totalEth() public view returns (uint256) {
    return address(this).balance;
  }

  // make a claim for an eligible winner
  function _claimNft(uint8 _slotId) internal {
    require(MAX_SLOT > _slotId, "Invalid slot ID");
    require(list[_slotId].locked == true, "The slot is empty");
    require(list[_slotId].pendingWinnerToClaim == true, "Still has no winner");
    require(list[_slotId].winner == msg.sender, "The caller is not the winner");

    if (list[_slotId].is1155) {
      IERC1155(list[_slotId].assetAddress).safeTransferFrom(
        address(this),
        msg.sender,
        list[_slotId].tokenId,
        1,
        "0x00"
      );
    } else {
      IERC721(list[_slotId].assetAddress).safeTransferFrom(
        address(this),
        msg.sender,
        list[_slotId].tokenId
      );
    }

    list[_slotId].locked = false;
    list[_slotId].assetAddress = address(0);
    list[_slotId].tokenId = 0;
    list[_slotId].is1155 = false;
    list[_slotId].randomnessChance = 0;
    list[_slotId].pendingWinnerToClaim = false;
    list[_slotId].winner = address(0);

    if (lastQueue > firstQueue) {
      ReserveNft memory reserve = _dequeue();

      list[_slotId].locked = true;
      list[_slotId].assetAddress = reserve.assetAddress;
      list[_slotId].tokenId = reserve.tokenId;
      list[_slotId].is1155 = reserve.is1155;
      list[_slotId].randomnessChance = reserve.randomnessChance;
      list[_slotId].pendingWinnerToClaim = false;
      list[_slotId].winner = address(0);
    }
    emit Claimed(_slotId, msg.sender);
  }

  // ONLY OWNER CAN PROCEED

  // for local testing
  // _randomNumber must be in between 0 - 2^10**256
  function forceDraw(uint256 _randomNumber)
    public
    payable
    onlyOwner
    nonReentrant
  {
    require(msg.value == ticketPrice, "Payment is not attached");

    if (address(factory) != address(0)) {
      uint256 feeAmount = ticketPrice.mul(factory.feePercent()).div(10000);
      _safeTransferETH(factory.devAddr(), feeAmount);
    }

    _draw(_randomNumber, msg.sender, "0x00");
  }

  function withdrawAllEth() public onlyOwner nonReentrant {
    uint256 amount = address(this).balance;
    _safeTransferETH(msg.sender, amount);
  }

  // function withdrawLink(uint256 _amount) public onlyOwner nonReentrant {
  //   IERC20(LINK_TOKEN).safeTransfer(msg.sender, _amount);
  // }

  function setTicketPrice(uint256 _ticketPrice) public onlyOwner nonReentrant {
    require(_ticketPrice != 0, "Invalid ticket price");

    ticketPrice = _ticketPrice;
    emit UpdatedTicketPrice(_ticketPrice);
  }

  // randomness value -> 1% = 100, 10% = 1000 and not allows more than 10% per each slot
  function depositNft(
    uint8 _slotId,
    uint256 _randomness,
    address _assetAddress,
    uint256 _tokenId,
    bool _is1155
  ) public nonReentrant onlyOwner {
    require(MAX_SLOT > _slotId, "Invalid slot ID");
    require(
      2000 >= _randomness && _randomness >= 1,
      "Randomness value must be between 0-2000"
    );
    // require(_is1155 == false, "Not supported ERC-1155 yet");
    require(list[_slotId].locked == false, "The slot is occupied");

    // take the NFT
    if (_is1155) {
      IERC1155(_assetAddress).safeTransferFrom(
        msg.sender,
        address(this),
        _tokenId,
        1,
        "0x00"
      );
    } else {
      IERC721(_assetAddress).safeTransferFrom(
        msg.sender,
        address(this),
        _tokenId
      );
    }

    list[_slotId].locked = true;
    list[_slotId].assetAddress = _assetAddress;
    list[_slotId].tokenId = _tokenId;
    list[_slotId].is1155 = _is1155;
    list[_slotId].randomnessChance = _randomness;
    list[_slotId].pendingWinnerToClaim = false;

    emit DepositedNft(_slotId, _assetAddress, _tokenId, _is1155, _randomness);
  }

  function withdrawNft(uint8 _slotId) public nonReentrant onlyOwner {
    require(MAX_SLOT > _slotId, "Invalid slot ID");
    require(list[_slotId].locked == true, "The slot is empty");
    require(
      list[_slotId].pendingWinnerToClaim == false,
      "The asset locked is being claimed by the winner"
    );

    if (list[_slotId].is1155) {
      IERC1155(list[_slotId].assetAddress).safeTransferFrom(
        address(this),
        msg.sender,
        list[_slotId].tokenId,
        1,
        "0x00"
      );
    } else {
      IERC721(list[_slotId].assetAddress).safeTransferFrom(
        address(this),
        msg.sender,
        list[_slotId].tokenId
      );
    }

    list[_slotId].locked = false;
    list[_slotId].assetAddress = address(0);
    list[_slotId].tokenId = 0;
    list[_slotId].is1155 = false;
    list[_slotId].randomnessChance = 0;
    list[_slotId].pendingWinnerToClaim = false;

    emit WithdrawnNft(_slotId);
  }

  function stackNft(
    address _assetAddress,
    uint256 _randomness,
    uint256 _tokenId,
    bool _is1155
  ) public {
    // take the NFT
    if (_is1155) {
      IERC1155(_assetAddress).safeTransferFrom(
        msg.sender,
        address(this),
        _tokenId,
        1,
        "0x00"
      );
    } else {
      IERC721(_assetAddress).safeTransferFrom(
        msg.sender,
        address(this),
        _tokenId
      );
    }

    ReserveNft memory reserve = ReserveNft({
      assetAddress: _assetAddress,
      randomnessChance: _randomness,
      tokenId: _tokenId,
      is1155: _is1155
    });

    _enqueue(reserve);

    emit StackedNft(_assetAddress, _tokenId, _randomness, _is1155);
  }

  function withdrawERC20(address _tokenAddress, uint256 _amount)
    public
    onlyOwner
  {
    IERC20(_tokenAddress).safeTransfer(msg.sender, _amount);
  }

  function withdrawERC721(address _tokenAddress, uint256 _tokenId)
    public
    onlyOwner
  {
    IERC721(_tokenAddress).safeTransferFrom(
      address(this),
      msg.sender,
      _tokenId
    );
  }

  function withdrawERC1155(
    address _tokenAddress,
    uint256 _tokenId,
    uint256 _amount
  ) public onlyOwner {
    IERC1155(_tokenAddress).safeTransferFrom(
      address(this),
      msg.sender,
      _tokenId,
      _amount,
      "0x00"
    );
  }

  // PRIVATE FUNCTIONS

  function _parseRandomUInt256(uint256 input) internal pure returns (uint256) {
    return input.mod(10000);
  }

  function _draw(
    uint256 _randomNumber,
    address _drawer,
    bytes32 _requestId
  ) internal {
    uint256 parsed = _parseRandomUInt256(_randomNumber); // parse into 0-10000 or 0.00-100.00%
    uint256 increment = 0;
    bool won = false;
    uint8 winningSlot = 0;
    address winningAssetAddress = address(0);
    uint256 winningTokenId = 0;

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
          winningAssetAddress = slot.assetAddress;
          winningTokenId = slot.tokenId;
          _claimNft(winningSlot);
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

    emit Drawn(_drawer, won, winningAssetAddress, winningTokenId);
  }

  function _enqueue(ReserveNft memory _data) private {
    lastQueue += 1;
    reserveQueue[lastQueue] = _data;
  }

  function _dequeue() private returns (ReserveNft memory) {
    require(lastQueue >= firstQueue); // non-empty queue

    ReserveNft memory data = ReserveNft({
      assetAddress: reserveQueue[firstQueue].assetAddress,
      randomnessChance: reserveQueue[firstQueue].randomnessChance,
      tokenId: reserveQueue[firstQueue].tokenId,
      is1155: reserveQueue[firstQueue].is1155
    });

    delete reserveQueue[firstQueue];
    firstQueue += 1;
    return data;
  }

  function _safeTransferETH(address to, uint256 value) internal {
    (bool success, ) = to.call{ value: value }(new bytes(0));
    require(success, "TransferHelper::safeTransferETH: ETH transfer failed");
  }
}
