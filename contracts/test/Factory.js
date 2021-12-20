const { expect } = require("chai")
const { ethers } = require("hardhat")

let factory

let admin
let alice
let bob
let charlie

describe("Factory", () => {

    before(async () => {

        [admin, alice, bob, charlie] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("Factory");

        factory = await Factory.deploy(admin.address)

    })

    it("totalBoxs should returns empty", async () => {

        expect( await factory.totalBoxes() ).to.equal(0)

    })

    it("Alice creates a new box", async () => {

        await factory.connect(alice).createLuckbox("ALICE BOX", "ALICE", 1)

        expect( await factory.totalBoxes() ).to.equal(1)
        expect( await factory.getBoxOwner(0)).to.equal( alice.address )
        expect( await factory.getBoxName(0)).to.equal("ALICE BOX")
        expect( await factory.getBoxSymbol(0)).to.equal("ALICE")

    })

    it("Bob creates a new box", async () => {

        await factory.connect(bob).createLuckbox("BOB BOX", "BOB", 2)

        expect( await factory.totalBoxes() ).to.equal(2)
        expect( await factory.getBoxOwner(1)).to.equal( bob.address )
        expect( await factory.getBoxName(1)).to.equal( "BOB BOX" )
        expect( await factory.getBoxSymbol(1)).to.equal( "BOB" )

    })

    it("Bans Charlie's box", async () => {

        await factory.connect(charlie).createLuckbox("CHARLIE BOX", "CHARLIE", 1)

        expect( await factory.totalBoxes() ).to.equal(3)
        expect( await factory.isBanned(2) ).to.equal( false )

        await factory.connect(admin).setBan(2, true)

        expect( await factory.isBanned(2) ).to.equal( true )
    })

})