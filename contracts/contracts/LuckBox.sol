// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ILuckbox.sol";

contract LuckBox is VRFConsumerBase, Ownable, ReentrancyGuard, ILuckbox {
    using SafeMathChainlink for uint256;
    using SafeERC20 for IERC20;

    mapping(bytes32 => address) private requestIdToAddress;

    // for identification purposes
    string public override name;
    string public override symbol;

    bool public locked = false;

    address public constant VRF_COORDINATOR =
        0x3d2341ADb2D31f1c5530cDC622016af293177AE0;
    address public constant LINK_TOKEN =
        0xb0897686c545045aFc77CF20eC7A532E3120E0F1;
    bytes32 public constant KEY_HASH =
        0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da;
    uint256 public constant FEE = 0.0001 * 10**18;
    IUniswapV2Router02 public constant ROUTER =
        IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);
    address public constant TAMG_TOKEN =
        0x53BDA082677a4965C79086D3Fe69A6182d6Af1B8;
    address public constant USDC_TOKEN =
        0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address[] public TAMG_TO_LINK_PATH = [TAMG_TOKEN, USDC_TOKEN, LINK_TOKEN];

    uint256 public override ticketPrice;

    struct Box {
        IERC721 factory;
        uint256 tokenId;
        uint256 winnerNumber;
        bool isClaimed;
    }
    Box[] public nftLists;

    event SetTicketPrice(uint256 ticketPrice);
    event GetLucky(address indexed randomer, bytes32 requestId);
    event ClaimNft(address indexed receiver, address factory, address tokenId);
    event AddNft(address factory, uint256 tokenId);
    event RemoveNft(address factory, uint256 tokenId);

    constructor(
        string memory _name,
        string memory _symbol,
        // IERC721[] memory _factory,
        // uint256[] memory _tokenId,
        uint256 _ticketPrice
    ) public VRFConsumerBase(VRF_COORDINATOR, LINK_TOKEN) {
        name = _name;
        symbol = _symbol;
        ticketPrice = _ticketPrice;

        // for (uint256 i = 0; i < _factory.length; i++) {
        //   IERC721(_factory[i]).safeTransferFrom(
        //     msg.sender,
        //     address(this),
        //     _tokenId[i]
        //   );

        //   nftLists.push(
        //     Box({
        //       factory: _factory[i],
        //       tokenId: _tokenId[i],
        //       winnerNumber: i,
        //       isClaimed: false
        //     })
        //   );
        // }
    }

    function setTicketPrice(uint256 _ticketPrice) public onlyOwner {
        ticketPrice = _ticketPrice;
        emit SetTicketPrice(_ticketPrice);
    }

    function addNft(IERC721 _factory, uint256 _tokenId) public onlyOwner {
        IERC721(_factory).safeTransferFrom(msg.sender, address(this), _tokenId);
        nftLists.push(
            Box({
                factory: _factory,
                tokenId: _tokenId,
                winnerNumber: nftLists.length,
                isClaimed: false
            })
        );

        emit AddNft(address(_factory), _tokenId);
    }

    function removeNft(uint256 _nftId) public onlyOwner nonReentrant {
        Box storage nft = nftLists[_nftId];
        require(address(nft.factory) != address(0), "No nft!");
        require(!nft.isClaimed, "Claimed already.");
        IERC721 factory = nft.factory;
        uint256 tokenId = nft.tokenId;
        nft.factory = IERC721(address(0));
        nft.tokenId = 0;
        nft.winnerNumber = 0;
        nft.isClaimed = false;
        IERC721(factory).transferFrom(address(this), msg.sender, tokenId);
        emit RemoveNft(address(factory), tokenId);
    }

    function getLucky() public nonReentrant returns (bytes32 requestId) {
        IERC20(TAMG_TOKEN).safeTransferFrom(
            msg.sender,
            address(this),
            ticketPrice
        );
        uint256[] memory amount = ROUTER.getAmountsIn(FEE, TAMG_TO_LINK_PATH);
        uint256 tamgToLinkAmount = amount[amount.length.sub(1)];
        require(tamgToLinkAmount >= ticketPrice, "Not enoung TAMG.");
        ROUTER.swapTokensForExactTokens(
            FEE,
            tamgToLinkAmount,
            TAMG_TO_LINK_PATH,
            address(this),
            block.timestamp
        );
        require(
            IERC20(LINK_TOKEN).balanceOf(address(this)) >= FEE,
            "Not enoung link."
        );
        requestId = requestRandomness(KEY_HASH, FEE);
        requestIdToAddress[requestId] = msg.sender;

        emit GetLucky(msg.sender, requestId);
    }

    function setLock(bool _locked) public onlyOwner nonReentrant {
        locked = _locked;
    }

    // PRIVATE FUNCTIONS

    function fulfillRandomness(bytes32 requestId, uint256 _randomness)
        internal
        override
    {
        uint256 randomNubmer = _randomness.mod(100).add(1);
        address receiver = requestIdToAddress[requestId];
        for (uint256 i = 0; i < nftLists.length; i++) {
            Box storage nft = nftLists[i];
            if (nft.winnerNumber == randomNubmer && !nft.isClaimed) {
                nft.isClaimed = true;
                _claimNft(i, receiver);
            }
        }
    }

    function _claimNft(uint256 _nftId, address _receiver) internal {
        Box storage nft = nftLists[_nftId];
        IERC721(nft.factory).safeTransferFrom(
            address(this),
            _receiver,
            nft.tokenId
        );
    }

    modifier isReady() {
        require(
            (locked) == false ,
            "The contract is locked by the owner"
        );
        _;
    }

}
