import { useMemo, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import ERC721ABI from "../abi/ERC721.json"

export const useERC721 = (address, account, library, tick) => {
  const erc721Contract = useMemo(() => {
    if (!account || !address || !library || !ethers.utils.isAddress(address)) {
      return
    }
    return new ethers.Contract(address, ERC721ABI, library.getSigner())
  }, [account, address, library])

  const [balance, setBalance] = useState(0)
  const [name, setName] = useState("--")
  const [symbol, setSymbol] = useState("--")

  const getIsApprovedForAll = useCallback(async (luckBoxAddress) => {
    try {
      const result = await erc721Contract.isApprovedForAll(account, luckBoxAddress)
      return result
    } catch (e) {
      console.log(e)
      return 0
    }
  }, [erc721Contract, account])

  const setApproveForAll = useCallback(async (luckBoxAddress) => {
    try {
      await erc721Contract.setApprovalForAll(luckBoxAddress, true)
    } catch (e) {
      console.log(e)
      return 0
    }
  }, [erc721Contract, account])

  const getBalance = useCallback(async () => {
    try {
      const result = await erc721Contract.balanceOf(account)
      return result.toString()
    } catch (e) {
      console.log(e)
      return 0
    }
  }, [erc721Contract, account])

  const getName = useCallback(async () => {
    try {
      const result = await erc721Contract.name()
      return result
    } catch (e) {
      console.log(e)
      return ""
    }
  }, [erc721Contract, account])

  const getSymbol = useCallback(async () => {
    try {
      const result = await erc721Contract.symbol()
      return result
    } catch (e) {
      console.log(e)
      return ""
    }
  }, [erc721Contract, account])

  useEffect(() => {
    erc721Contract && getBalance().then(setBalance)
    erc721Contract && getName().then(setName)
    erc721Contract && getSymbol().then(setSymbol)
  }, [account, erc721Contract, tick])

  return {
    balance,
    name,
    symbol,
    getIsApprovedForAll,
    setApproveForAll
  }
}
