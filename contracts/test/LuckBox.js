const { expect } = require("chai")
const { ethers } = require("hardhat")
const { fromEther, toEther } = require("./Helpers")


let luckBox
let erc721
let erc1155

let admin
let alice
let bob

describe("LuckBox", () => {

  before(async () => {

    [admin, alice, bob] = await ethers.getSigners();

    const LuckBox = await ethers.getContractFactory("LuckBox");

    luckBox = await LuckBox.deploy(
      "My Luckbox",
      "LUCKBOX",
      toEther(0.1) // 0.1 MATIC
    )

    const MockERC721 = await ethers.getContractFactory("MockERC721");
    const MockERC1155 = await ethers.getContractFactory("MockERC1155");

    erc721 = await MockERC721.deploy("Mock NFT", "MOCK")
    erc1155 = await MockERC1155.deploy("https://api.cryptokitties.co/kitties/{id}")

  })

  it("Checks initial params", async () => {

    expect(await luckBox.name()).to.equal("My Luckbox")
    expect(await luckBox.symbol()).to.equal("LUCKBOX")
    expect(await luckBox.ticketPrice()).to.equal(toEther(0.1))

    expect(await luckBox.owner()).to.equal(admin.address)

  })

  it("Deposit & Withdraw ERC-721 NFTs to all slots", async () => {

    const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    // minting ERC-721
    for (let id of tokenIds) {
      await erc721.mint(admin.address, id)
    }

    await erc721.setApprovalForAll(luckBox.address, true)

    // depositing
    for (let id of tokenIds) {
      // await erc721.approve(luckBox.address, id)
      await luckBox.depositNft(id, (1 * 100), erc721.address, id, false)
    }

    expect(await erc721.balanceOf(admin.address)).to.equal(0)

    // verifying
    for (let id of tokenIds) {
      const slotData = await luckBox.list(id)
      expect(slotData[0]).to.equal(erc721.address)
      expect(slotData[1]).to.equal(id)
      expect(slotData[2]).to.equal(false)
      expect(slotData[3]).to.equal(true)
      expect(slotData[4]).to.equal(100)
    }

    // withdrawing
    for (let id of tokenIds) {
      await luckBox.withdrawNft(id)
    }

    expect(await erc721.balanceOf(admin.address)).to.equal(9)
  })

  it("Deposit & Withdraw ERC-1155 NFTs to all slots", async () => {

    // FIXME : SUPPORT ERC-1155

  })

  it("Force drawing", async () => {
    // depositing NFTs back
    const tokenIds = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    for (let id of tokenIds) {
      // use 10% winning chance
      await luckBox.depositNft(id, (10 * 100), erc721.address, id, false)
    }

    // winning rates should be at 90% ( 9 NFTs x 10% each)
    expect(await luckBox.winningRates()).to.equal(9000)

    // captures from VRF
    const randoms = [
      "86094932484784572602761682576856776552064994904805306551989412218779281822076", // 2076
      "64398881741260761741327763168487426295964951087742968505382389560792331819070", // 9070
      "50782446984059943978405072465811458195368377587606021142689420825618870315607", // 5607
      "47125627221243712693285114204716024541919440261169951046416752675783626973793", // 3793
      "56677808388515418397845035688777921524411635120334930246921438203618707722478", // 2478
      "24789687723422206504093975672595709196520120609406715522373668926008795395244", // 5244
      "7892590353424658403775693550756982572540459138139681914848281068137357260205", // 205
      "97305658150961137327832525889841521151674547403341010967027383752471741837607" // 7607
    ]

    for (let random of randoms) {
      await luckBox.forceDraw(ethers.BigNumber.from(random), { value: toEther(0.1) })
    }

    // should able to claim 5 NFTs
    for (let id of tokenIds) {
      const slotData = await luckBox.list(id)

      if ([0, 2, 3, 4, 6].indexOf(id) !== -1) {
        expect(slotData[5]).to.equal(true)
        expect(slotData[6]).to.equal(admin.address)

        // then claim it
        await luckBox.claimNft(id)

      } else {
        expect(slotData[5]).to.equal(false)
      }

    }

    expect(await erc721.balanceOf(admin.address)).to.equal(5)

    // winning rates should be reduced to 40%
    expect((await luckBox.winningRates())).to.equal(4000)

    // check earning
    expect(await luckBox.totalEth()).to.equal(toEther(0.8))

    // withdraw earning
    await luckBox.withdrawAllEth()
    expect(await luckBox.totalEth()).to.equal(0)

    // check the record
    const recordCount = await luckBox.resultCount()
    expect(recordCount).to.equal(8)

    for (let i = 0; i < recordCount; i++) {
      const result = await luckBox.result(i)

      if ([0, 2, 3, 4, 6].indexOf(i) !== -1) {
        expect(result[2]).to.true
      }

    }

    // verifying slot 0,2,3,4,6 are empty
    for (let slot of tokenIds) {
      if ([0, 2, 3, 4, 6].indexOf(slot) !== -1) {
        const slotData = await luckBox.list(slot)
        expect(slotData[2]).to.equal(false)
        expect(slotData[3]).to.equal(false)
        expect(slotData[4]).to.equal(0)
        expect(slotData[5]).to.equal(false)
      }
    }


  })


})
