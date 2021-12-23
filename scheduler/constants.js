const pulumi = require("@pulumi/pulumi")

const config = new pulumi.Config();

exports.FULL_NODE_URL = config.require("fullNodeUrl")

exports.WALLET = config.require("wallet")

exports.FACTORY_ADDRESS = config.require("factoryAddress")