import React, { useContext } from "react"
import styled from "styled-components"
import { Button } from "./Base"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../hooks/useFactory"
import { shortAddress } from "../helper/index"

const Wrapper = styled.div`
  height: 100vh;
`

const TitleContainer = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
`

const Container = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 30%;
  display: flex;
  flex-direction: column;
`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
  cursor: pointer;
  margin: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const FactoryDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
`

const NFTContainer = styled.div`
  margin-top: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const Header = styled.div`
  margin-right: 8px;
  font-weight: bold;
`

const DrawContainer = styled.div`
  display: flex;
  align-items: center;
	justify-content: center;
  margin-top: 12px;
  width: 100%;
`

const Detail = styled.div``

const Box = ({ data, setLuckBoxSelected }) => {
  return (
    <>
      {data.assetAddress === ethers.constants.AddressZero ? null : (
        <BoxContainer>
          <img width='128' height='128' src={data.tokenURI.image_url} />
          <FactoryDetail>
            <Header>Name:</Header>
            <Detail>{data.tokenURI.name}</Detail>
          </FactoryDetail>
        </BoxContainer>
      )}
    </>
  )
}

const Draw = ({ data, setLuckBoxSelected }) => {
  const { account, library } = useWeb3React()
  const { allBoxesDetail } = useContext(FactoryContext)
  const { nftList, ticketPrice } = data

  return (
    <Wrapper>
      <Container>
        <TitleContainer>
          <div style={{ flex: 1 }} onClick={() => setLuckBoxSelected(null)}>
            {"<<"} Back
          </div>
          <div>Ticket: {ticketPrice} MATIC</div>
        </TitleContainer>
        <NFTContainer>
          {nftList
            ? nftList.map((data, index) => <Box key={index} data={data} />)
            : null}
        </NFTContainer>
        <DrawContainer>
          <Button>Draw</Button>
        </DrawContainer>
      </Container>
    </Wrapper>
  )
}

export default Draw
