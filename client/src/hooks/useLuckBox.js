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

  return { draw, claimNft }
}
