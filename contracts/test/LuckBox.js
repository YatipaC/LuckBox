const { expect } = require("chai")
const { ethers } = require("hardhat")
const {
  USDC_ADDRESS,
  TAMG_ADDRESS,
  TAMG_WHALE,
  USDC_WHALE,
} = require("../constants")
const ERC20ABI = require("../constants/abi/ERC20Abi.json")

describe("LuckBox", function () {
  let tamgToken
  let usdcToken

  let luckBox

  let admin
  let player1
  let player2
  let player3
  let tamgWhale
  let usdcWhale

  beforeEach(async () => {
    ;[admin, player1, player2, player3, dev, treasury] =
      await ethers.getSigners()

    tamgToken = await ethers.getContractAt(ERC20ABI, TAMG_ADDRESS)
    usdcToken = await ethers.getContractAt(ERC20ABI, USDC_ADDRESS)

    const LuckBox = await ethers.getContractFactory("LuckBox")

    luckBox = LuckBox.deploy()
  })

  it("Should work", async () => {
    expect("gang").to.eq("gang")
  })
})
