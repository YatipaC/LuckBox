import BigNumber from "bignumber.js"
import multicall from "../../utils/multicall"
import FactoryABI from "../../abi/Factory.json"

const fetchFactory = async (factoryToFetch) => {
  const [totalBoxes] = await multicall(FactoryABI, [
    {
      address: factoryToFetch,
      name: "totalBoxes",
    },
  ])

  const result = await Promise.all(
    Array(parseInt(totalBoxes[0]))
      .fill(0)
      .map(async (_, index) => {
        const calls = [
          {
            address: factoryToFetch,
            name: "getBoxName",
            params: [index],
          },
          {
            address: factoryToFetch,
            name: "getBoxSymbol",
            params: [index],
          },
          {
            address: factoryToFetch,
            name: "getBoxOwner",
            params: [index],
          },
          {
            address: factoryToFetch,
            name: "getBoxContractAddress",
            params: [index],
          },
        ]

        const [name, symbol, owner, boxAddress] = await multicall(
          FactoryABI,
          calls
        )

        return {
          name: name[0],
          symbol: symbol[0],
          owner: owner[0],
          boxAddress: boxAddress[0],
        }
      })
  )
  return result
}

export default fetchFactory
