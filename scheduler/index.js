"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

const { ethers } = require("ethers");

const { WALLET, FULL_NODE_URL, FACTORY_ADDRESS } = require("./constants")
const { FACTORY_ABI } = require("./abi")

const Scheduler = async (event) => {

    try {

        console.log("Connecting Polygon chain... ")

        const provider = new ethers.getDefaultProvider(FULL_NODE_URL)
        const wallet = new ethers.Wallet(WALLET, provider);
        const walletAddress = wallet.address

        console.log("Connected wallet : ", walletAddress)

        // call the factory contract
        const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, wallet)

        console.log("Invoking requestNonce()")

        await factoryContract.requestNonce({
            from : walletAddress ,
            // chainId :137,
            // gas: 8500000,
            gasPrice: 30000000000 // 30 Gwei
        })

        console.log("Invoked.")

    } catch (e) {
        console.log("running Scheduler error : ", e.message)
    }

}

const luckboxScheduler = new aws.cloudwatch.onSchedule(
    "luckboxScheduler",
    "rate(10 minutes)",
    Scheduler,
);