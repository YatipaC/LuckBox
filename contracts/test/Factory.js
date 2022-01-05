const { expect } = require("chai")
const { ethers } = require("hardhat")

let factory
let erc721

let admin
let alice
let bob
let charlie

const DEV_ADDRESS = "0x91C65f404714Ac389b38335CccA4A876a8669d32"

describe("Factory", () => {

    before(async () => {

        [admin, alice, bob, charlie] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("Factory");
        const MockERC721 = await ethers.getContractFactory("MockERC721")

        factory = await Factory.deploy(DEV_ADDRESS)
        erc721 = await MockERC721.deploy("Mock NFT", "MOCK")

    })

    it("totalBoxs should returns empty", async () => {

        expect(await factory.totalBoxes()).to.equal(0)

    })

    it("Alice creates a new box", async () => {

        await factory.connect(alice).createLuckbox("ALICE BOX", "ALICE",  ethers.utils.parseEther("1") )

        expect(await factory.totalBoxes()).to.equal(1)
        expect(await factory.getBoxOwner(0)).to.equal(alice.address)
        expect(await factory.getBoxName(0)).to.equal("ALICE BOX")
        expect(await factory.getBoxSymbol(0)).to.equal("ALICE")

    })

    it("Bob creates a new box", async () => {

        await factory.connect(bob).createLuckbox("BOB BOX", "BOB", 2)

        expect(await factory.totalBoxes()).to.equal(2)
        expect(await factory.getBoxOwner(1)).to.equal(bob.address)
        expect(await factory.getBoxName(1)).to.equal("BOB BOX")
        expect(await factory.getBoxSymbol(1)).to.equal("BOB")

    })

    it("Bans Charlie's box", async () => {

        await factory.connect(charlie).createLuckbox("CHARLIE BOX", "CHARLIE", 1)

        expect(await factory.totalBoxes()).to.equal(3)
        expect(await factory.isBanned(2)).to.equal(false)

        await factory.connect(admin).setBan(2, true)

        expect(await factory.isBanned(2)).to.equal(true)
    })

    it("Fees deduction", async () => {

        const luckboxAddress = await factory.getBoxContractAddress(0)
        const luckbox = await ethers.getContractAt('LuckBox', luckboxAddress)

        // Mint 1 NFT
        await erc721.connect(alice).mint(alice.address, 1)
        await erc721.connect(alice).setApprovalForAll(luckbox.address, true)

        // Deposit it
        await luckbox.connect(alice).depositNft(0, 10 * 100, erc721.address, 1, false)

        await luckbox.connect(alice).forceDraw("86094932484784572602761682576856776552064994904805306551989412218779281822076", {
            value: ethers.utils.parseEther("1"),
        })

        // Verify fees
        expect( ethers.utils.formatEther( await luckbox.totalEth() ) ).to.equal("0.97")
        expect( ethers.utils.formatEther( await ethers.provider.getBalance(DEV_ADDRESS) ) ).to.equal("0.03")

    })

})