import React, {
  useMemo,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react"
import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import fetchFactory from "./factory/fetchFactory"
import fetchLuckBox from "./luckBox/fetchLuckBox"
import { FACTORY } from "../constants"

export const FactoryContext = createContext({})

const Provider = ({ children }) => {
  const { account, library } = useWeb3React()
  const [factoryDetail, setFactoryDetail] = useState()
  const [allBoxesDetail, setAllBoxesDetail] = useState()

  const getFactory = async () => {
    const data = await fetchFactory(FACTORY)
    setFactoryDetail(data)
  }

  const getAllBoxesDetail = async () => {
    const data = await fetchLuckBox(factoryDetail)
    setAllBoxesDetail(data)
  }

  useEffect(() => {
    if (!factoryDetail) return
    getAllBoxesDetail()
  }, [factoryDetail])

  useEffect(() => {
    getFactory()
  }, [account])

  const factoryContext = useMemo(
    () => ({ factoryDetail, allBoxesDetail }),
    [factoryDetail, allBoxesDetail]
  )

  return (
    <FactoryContext.Provider value={factoryContext}>
      {children}
    </FactoryContext.Provider>
  )
}

export default Provider

// import { useMemo, useEffect, useState, useCallback } from "react"
// import { ethers } from "ethers"
// import FactoryABI from "../abi/Factory.json"

// export const useFactory = (address, account, library, tick) => {
//   const factoryContract = useMemo(() => {
//     if (!account || !address || !library) {
//       return
//     }
//     return new ethers.Contract(address, FactoryABI, library.getSigner())
//   }, [account, address, library])

//   const [totalBoxes, setTotalBoxes] = useState()

//   const getTotalBoxes = useCallback(async () => {
//     try {
//       const result = await factoryContract.totalBoxes()
//       console.log(result)
//       return parseInt(result)
//     } catch (e) {
//       console.log(e)
//       return 0
//     }
//   }, [factoryContract])

//   useEffect(() => {
//     factoryContract && getTotalBoxes().then(setTotalBoxes)
//   }, [account, factoryContract, tick])

//   return {
//     totalBoxes,
//   }
// }
