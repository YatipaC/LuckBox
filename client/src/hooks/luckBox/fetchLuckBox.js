import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import multicall from "../../utils/multicall"
import LuckBoxABI from "../../abi/LuckBox.json"
import ERC721ABI from "../../abi/ERC721.json"
import axios from "axios"

const fetchLuckBoxes = async (luckBoxesToFetch) => {
  const data = await Promise.all(
    luckBoxesToFetch.map(async (luckBoxConfig) => {
      const { boxAddress } = luckBoxConfig

      const [ticketPrice] = await multicall(LuckBoxABI, [
        {
          address: boxAddress,
          name: "ticketPrice",
        },
      ])

      const data = await Promise.all(
        Array(parseInt(8))
          .fill(0)
          .map(async (_, index) => {
            const calls = [
              {
                address: boxAddress,
                name: "list",
                params: [index],
              },
            ]

            const [nftBox] = await multicall(LuckBoxABI, calls)
            if (nftBox.assetAddress !== ethers.constants.AddressZero) {
              const erc721Calls = [
                {
                  address: nftBox.assetAddress,
                  name: "tokenURI",
                  params: [nftBox.tokenId.toString()],
                },
              ]

              const [tokenURI] = await multicall(ERC721ABI, erc721Calls)

              const tokenObj = await axios.get(tokenURI)
              return {
                assetAddress: nftBox.assetAddress,
                is1155: nftBox.is1155,
                locked: nftBox.locked,
                pendingWinnerToClaim: nftBox.pendingWinnerToClaim,
                randomnessChance: nftBox.randomnessChance.toString(),
                tokenId: nftBox.tokenId.toString(),
                winner: nftBox.winner,
                tokenURI: tokenObj.data
              }
            }

            return {
              assetAddress: nftBox.assetAddress,
              is1155: nftBox.is1155,
              locked: nftBox.locked,
              pendingWinnerToClaim: nftBox.pendingWinnerToClaim,
              randomnessChance: nftBox.randomnessChance.toString(),
              tokenId: nftBox.tokenId.toString(),
              winner: nftBox.winner,
              tokenURI: "",
            }
          })
      )

      return {
        ...luckBoxConfig,
        nftList: data,
        ticketPrice: ethers.utils.formatEther(ticketPrice[0]._hex),
      }
    })
  )
  return data
}

export default fetchLuckBoxes