module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  await deploy("Factory", {
    from: deployer,
    args: [deployer],
    log: true,
  })

  console.log("✅ Done 🦄")
}
module.exports.tags = ["Factory"]
