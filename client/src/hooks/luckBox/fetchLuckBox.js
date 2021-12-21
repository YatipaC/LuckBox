import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import multicall from "../../utils/multicall"
import LuckBoxABI from "../../abi/LuckBox.json"
import ERC721ABI from "../../abi/ERC721.json"
import ERC1155ABI from "../../abi/ERC1155.json"
import axios from "axios"

const fetchLuckBoxes = async (luckBoxesToFetch) => {
  const data = await Promise.all(
    luckBoxesToFetch.map(async (luckBoxConfig) => {
      const { boxAddress } = luckBoxConfig

      const [ticketPrice, resultCount, owner, totalEth] =
        await multicall(LuckBoxABI, [
          {
            address: boxAddress,
            name: "ticketPrice",
          },
          {
            address: boxAddress,
            name: "resultCount",
          },
          {
            address: boxAddress,
            name: "owner",
          },
          {
            address: boxAddress,
            name: "totalEth",
          }
        ])

      const resultData = await Promise.all(
        Array(parseInt(resultCount[0]))
          .fill(0)
          .map(async (_, index) => {
            const calls = [
              {
                address: boxAddress,
                name: "result",
                params: [index],
              },
            ]

            const [result] = await multicall(LuckBoxABI, calls)

            return {
              requestId: result.requestId,
              drawer: result.drawer,
              won: result.won,
              slot: result.slot.toString(),
              output: result.output.toString(),
              eligibleRange: result.eligibleRange.toString(),
            }
          })
      )

      const waitFor = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay))

      const data = await Promise.all(
        Array(parseInt(9))
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

              const erc1155Calls = [
                {
                  address: nftBox.assetAddress,
                  name: "uri",
                  params: [nftBox.tokenId.toString()],
                },
              ]

              let [tokenURI] = nftBox.is1155
                ? await multicall(ERC1155ABI, erc1155Calls)
                : await multicall(ERC721ABI, erc721Calls)

              tokenURI = nftBox.is1155 ? tokenURI[0] : tokenURI

              let tokenObj

              try {
                // delayed on Pinata cloud
                if (
                  tokenURI &&
                  tokenURI.toString().indexOf("gateway.pinata.cloud") !== -1
                ) {
                  // tokenURI = tokenURI.toString().replace("gateway.pinata.cloud", "ipfs.io")
                  await waitFor(100 * index)
                }

                tokenObj = await axios.get(tokenURI)

                // replace pinata node with IPFS node
                if (
                  tokenObj &&
                  tokenObj.data &&
                  tokenObj.data.image &&
                  tokenObj.data.image.indexOf("gateway.pinata.cloud") !== -1
                ) {
                  tokenObj.data.image = tokenObj.data.image.replace(
                    "gateway.pinata.cloud",
                    "ipfs.io"
                  )
                }
              } catch (e) {
                console.log(`failed at index ${index}`)
              }

              return {
                assetAddress: nftBox.assetAddress,
                is1155: nftBox.is1155,
                locked: nftBox.locked,
                pendingWinnerToClaim: nftBox.pendingWinnerToClaim,
                randomnessChance: nftBox.randomnessChance.toString(),
                tokenId: nftBox.tokenId.toString(),
                winner: nftBox.winner,
                tokenURI: tokenObj && tokenObj.data,
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
        resultData: resultData.reverse(),
        owner: owner[0],
        totalEth: ethers.utils.formatEther(totalEth[0]._hex),
      }
    })
  )
  return data
}

export default fetchLuckBoxes
