import { Interface } from "@ethersproject/abi"
import Web3 from "web3"

import MulticallABI from "../abi/Multicall.json"
import { MULTICALL_ADDRESS , POLYGON_RPC_SERVER } from "../constants"

const multicall = async (abi, calls) => {
  const httpProvider = new Web3.providers.HttpProvider(
    POLYGON_RPC_SERVER,
    { timeout: 10000 }
  )
  const web3 = new Web3(httpProvider)
  const multi = new web3.eth.Contract(MulticallABI, MULTICALL_ADDRESS)
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) =>
    itf.decodeFunctionResult(calls[i].name, call)
  )

  return res
}

export default multicall
