import React, { useContext } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../hooks/useFactory"

const Container = styled.div`
  width: 60%;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
  margin: 120px auto;
`

const Assets = () => {
  const { account, library } = useWeb3React()
  const { allBoxesDetail } = useContext(FactoryContext)
  console.log(allBoxesDetail)

  return <Container>Made for Chainlink Hackathon Fall 2021</Container>
}

export default Assets
