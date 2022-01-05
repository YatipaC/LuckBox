import { useMemo, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import FactoryABI from "../abi/Factory.json"

export const useFactory = (address, account, library, tick) => {
  const factoryContract = useMemo(() => {
    if (!account || !address || !library) {
      return
    }
    return new ethers.Contract(address, FactoryABI, library.getSigner())
  }, [account, address, library])

  const createLuckBox = useCallback(
    async (name, symbol, ticketPrice) => {
      try {
        return await factoryContract.createLuckbox(
          name,
          symbol,
          ethers.utils.parseEther(ticketPrice)
        )
      } catch (e) {
        return Promise.reject(e.message)
      }
    },
    [factoryContract, account]
  )

  return { createLuckBox }
}
