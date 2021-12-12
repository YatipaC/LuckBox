import { useMemo, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import LuckBoxABI from "../abi/LuckBox.json"

export const useLuckBox = (address, account, library, tick) => {
  const luckBoxContract = useMemo(() => {
    if (!account || !address || !library) {
      return
    }
    return new ethers.Contract(address, LuckBoxABI, library.getSigner())
  }, [account, address, library])

  const draw = useCallback(
    async (ticketPrice) => {
      try {
        return await luckBoxContract.draw({
          value: ethers.utils.parseEther(ticketPrice),
        })
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  const claimNft = useCallback(
    async (slotId) => {
      try {
        return await luckBoxContract.claimNft(slotId)
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  const depositNft = useCallback(
    async (slotId, randomness, assetAddress, tokenId, is1155) => {
      try {
        return await luckBoxContract.depositNft(
          slotId,
          randomness * 100,
          assetAddress,
          tokenId,
          is1155
        )
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  const withdrawNft = useCallback(
    async (slotId) => {
      try {
        return await luckBoxContract.withdrawNft(slotId)
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  const withdrawEth = useCallback(async () => {
    try {
      return await luckBoxContract.withdrawAllEth()
    } catch (e) {
      return Promise.reject(e.message)
    }
  }, [luckBoxContract, account])

  const withdrawLink = useCallback(
    async (amount) => {
      try {
        return await luckBoxContract.withdrawLink(
          ethers.utils.parseEther(amount)
        )
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  const setTicketPrice = useCallback(
    async (ticketPrice) => {
      try {
        return await luckBoxContract.setTicketPrice(
          ethers.utils.parseEther(ticketPrice)
        )
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [luckBoxContract, account]
  )

  return {
    draw,
    claimNft,
    depositNft,
    withdrawNft,
    withdrawEth,
    withdrawLink,
    setTicketPrice,
  }
}
