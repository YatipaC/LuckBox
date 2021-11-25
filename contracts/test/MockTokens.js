const { expect } = require("chai")
const { ethers } = require("hardhat")
const { fromEther } = require("./Helpers")

let erc20
let erc721
let erc721_2
let erc1155
let erc1155_2

let admin
let alice
let bob


describe("ERC20", () => {

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const MockERC20 = await ethers.getContractFactory("MockERC20");

        erc20 = await MockERC20.deploy("Mock Token", "MOCK")

    })

    it("Total Supply = Balance", async function () {
        const bal = await erc20.balanceOf(admin.address);
        expect(await erc20.totalSupply()).to.equal(bal);
    });

    it("Checks NAME & SYMBOL", async function () {
        const name = await erc20.name();
        expect(name).to.equal("Mock Token");

        const symbol = await erc20.symbol();
        expect(symbol).to.equal("MOCK");

    });

    it("Faucet is working", async function () {

        await erc20.connect(alice).faucet();

        const aliceBalance = await erc20.balanceOf(alice.address);
        expect(fromEther(aliceBalance)).to.equal("10000.0");
    });

})

describe("ERC721", () => {

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const MockERC721 = await ethers.getContractFactory("MockERC721");

        erc721 = await MockERC721.deploy("Mock NFT", "MOCK")

        // load existing one
        erc721_2 = await ethers.getContractAt('MockERC721', "0x85cbf58c9d20459339a0b1f586a5fac643a29286")

    })

    it("Checks NAME & SYMBOL", async function () {
        const name = await erc721.name();
        expect(name).to.equal("Mock NFT");

        const symbol = await erc721.symbol();
        expect(symbol).to.equal("MOCK");

    });

    it("Mints 3 NFTs", async function () {

        await erc721.mint(admin.address, 0)
        await erc721.mint(alice.address, 1)
        await erc721.mint(bob.address, 2)

        expect(await erc721.tokenURI(0)).to.equal("https://api.cryptokitties.co/kitties/0");
        expect(await erc721.tokenURI(1)).to.equal("https://api.cryptokitties.co/kitties/1");
        expect(await erc721.tokenURI(2)).to.equal("https://api.cryptokitties.co/kitties/2");

        expect(await erc721.ownerOf(0)).to.equal(admin.address);
        expect(await erc721.ownerOf(1)).to.equal(alice.address);
        expect(await erc721.ownerOf(2)).to.equal(bob.address);

    });

    it("Transfers them all to Admin", async function () {

        await erc721.connect(alice).transferFrom(alice.address, admin.address, 1)
        await erc721.connect(bob).transferFrom(bob.address, admin.address, 2)

        expect(await erc721.balanceOf(admin.address)).to.equal(3)

        expect(await erc721.ownerOf(1)).to.equal(admin.address);
        expect(await erc721.ownerOf(2)).to.equal(admin.address);
    })

    it("Checks URI of 2nd NFT", async function () {

        // in case of running without forked mainnet
        try {
            expect(await erc721_2.tokenURI(1511)).to.equal("https://gateway.pinata.cloud/ipfs/QmfWCimPFew6S2LL3YEFcexbd1oDpJAZ8n8qJn5UYozCqK")
            expect(await erc721_2.tokenURI(2502)).to.equal("https://gateway.pinata.cloud/ipfs/QmVe39KBvkSG8mXDr5yARfsqajLP9dcpaMx6YSeXZdS2qF")
        } catch (e) {

        }
    })

})

describe("ERC1155", () => {

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const MockERC1155 = await ethers.getContractFactory("MockERC1155");

        erc1155 = await MockERC1155.deploy("https://api.cryptokitties.co/kitties/{id}")

        // load existing one
        erc1155_2 = await ethers.getContractAt('MockERC1155', "0x2215463d57ed278a778c5cfd9509919acf8cef8d")

        // FIXME: Support Opensea Standard
    })

    it("Mints 100 Tokens /w the same id", async function () {

        await erc1155.mint(admin.address, 0, 100, "0x00")

        expect(await erc1155.balanceOf(admin.address, 0)).to.equal(100)

        // transfers some to Alice and Bob
        await erc1155.safeTransferFrom(admin.address, alice.address, 0, 50, "0x00")
        await erc1155.safeTransferFrom(admin.address, bob.address, 0, 50, "0x00")

        expect(await erc1155.balanceOf(admin.address, 0)).to.equal(0)
        expect(await erc1155.balanceOf(alice.address, 0)).to.equal(50)
        expect(await erc1155.balanceOf(bob.address, 0)).to.equal(50)
    })

    it("Mints batch 3 ids with 100 tokens each", async function () {

        await erc1155.mintBatch(admin.address, [1, 2, 3], [100, 100, 100], "0x00")

        expect(await erc1155.balanceOf(admin.address, 1)).to.equal(100)
        expect(await erc1155.balanceOf(admin.address, 2)).to.equal(100)
        expect(await erc1155.balanceOf(admin.address, 3)).to.equal(100)

    })

    it("Checks second NFT", async function () {

        // in case of running without forked mainnet
        try {
            expect(await erc1155_2.uri(1)).to.equal("https://tamagofinance-nft-metadata-api.vercel.app/api/egg/1")
            expect(await erc1155_2.uri(2)).to.equal("https://tamagofinance-nft-metadata-api.vercel.app/api/egg/2")
        } catch (e) {

        }



    })

})