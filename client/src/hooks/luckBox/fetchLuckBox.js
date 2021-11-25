import BigNumber from "bignumber.js"
import multicall from "../../utils/multicall"
import LuckBoxABI from "../../abi/LuckBox.json"
import ERC721 from "../../abi/ERC721.json"

const fetchLuckBoxes = async (luckBoxesToFetch) => {
  const data = await Promise.all(
    luckBoxesToFetch.map(async (luckBoxConfig) => {
      const { boxAddress } = luckBoxConfig

      const [nftListLength, ticketPrice] = await multicall(
        LuckBoxABI,
        {
          address: boxAddress,
          name: "getNftListLength",
        },
        {
          address: boxAddress,
          name: "ticketPrice",
        }
      )

      const nftLists = await Promise.all(
        Array(parseInt(nftListLength)).map(async (_, index) => {
          const calls = [
            {
              address: boxAddress,
              name: "nftLists",
              params: [index],
            },
          ]

          const [nftBox] = await multicall(LuckBoxABI, calls)

          const erc721Calls = [
            {
              address: nftBox.factory,
              name: "tokenURI",
              params: [nftBox.tokenId],
            },
          ]

          const [tokenURI] = await multicall(ERC721ABI, erc721Calls)

          return {
            factory: nftBox.factory,
            tokenId: nftBox.tokenId,
            winnerNumber: nftBox.winnerNumber,
            isClaimed: nftBox.isClaimed,
            tokenURI,
          }
        })
      )

      return {
        ...luckBoxConfig,
      }
    })
  )
  return data
}

export default fetchLuckBoxes
