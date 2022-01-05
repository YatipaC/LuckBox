import React, {
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import fetchFactory from "./factory/fetchFactory"
import fetchLuckBox from "./luckBox/fetchLuckBox"
import { FACTORY } from "../constants"
import useInterval from "./useInterval"

export const FactoryContext = createContext({})

const Provider = ({ children }) => {
  const { account, library } = useWeb3React()
  const [factoryDetail, setFactoryDetail] = useState()
  const [allBoxesDetail, setAllBoxesDetail] = useState()
  const [tick, setTick] = useState(0)

  const [delay, setDelay] = useState(10000)

  const increaseTick = useCallback(() => {
    setTick(tick + 1)
  }, [tick])

  useInterval(
    () => {
      increaseTick()
    },
    10000
  )

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
  }, [factoryDetail, tick])

  useEffect(() => {
    getFactory()
  }, [account])

  const factoryContext = useMemo(
    () => ({ factoryDetail, allBoxesDetail, increaseTick, tick }),
    [factoryDetail, allBoxesDetail, increaseTick]
  )

  return (
    <FactoryContext.Provider value={factoryContext}>
      {children}
    </FactoryContext.Provider>
  )
}

export default Provider
