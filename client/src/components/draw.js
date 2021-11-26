import React, { useContext, useCallback, useState } from "react"
import styled from "styled-components"
import { Button } from "./Base"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../hooks/useFactory"
import { shortAddress } from "../helper/index"
import { useLuckBox } from "../hooks/useLuckBox"

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
  top: 3%;
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
  width: 166px;
  height: 166px;
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
  position: absolute;
  top: 15%;
  right: 5%;
  width: 200px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const Detail = styled.div``

const TicketPrice = styled.div`
  padding: 12px;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
  margin-top: 12px;
`

const NftDetailContainer = styled.div`
  position: absolute;
  top: 15%;
  left: 5%;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 12px;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
`

const ResultDataContainer = styled.div`
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
  margin-top: 12px;
  width: 100%;
`

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const Box = ({ data, setSelectedNftDetail }) => {
  return (
    <>
      {data.assetAddress === ethers.constants.AddressZero ||
      data.winner !== ethers.constants.AddressZero ? (
        <BoxContainer onClick={() => setSelectedNftDetail(null)}></BoxContainer>
      ) : (
        <BoxContainer onClick={() => setSelectedNftDetail(data)}>
          <img width='128' height='128' src={data.tokenURI.image_url} />
        </BoxContainer>
      )}
    </>
  )
}

const ResultCotainer = ({ data, account, onClaim }) => {
  const isWinner =
    data.won && data.drawer.toLowerCase() === account.toLowerCase()
  console.log(data)
  return (
    <ResultRow>
      <div style={{ width: "40%", textAlign: "center" }}>{data.drawer}</div>
      <div style={{ width: "40%", textAlign: "center" }}>
        {data.won ? "Win" : "Lose"}
      </div>
      <div style={{ width: "20%", textAlign: "center" }}>
        {isWinner && (
          <div style={{ cursor: "pointer" }} onClick={() => onClaim(data.slot)}>
            Claim
          </div>
        )}
      </div>
    </ResultRow>
  )
}

const Draw = ({ data, setLuckBoxSelected }) => {
  const { account, library } = useWeb3React()
  const { increaseTick, tick } = useContext(FactoryContext)
  const { nftList, ticketPrice, resultData, boxAddress } = data
  const { draw, claimNft } = useLuckBox(boxAddress, account, library)

  const [loading, setLoading] = useState(false)
  const [selectedNftDetail, setSelectedNftDetail] = useState()

  const onDraw = useCallback(async () => {
    try {
      setLoading(true)
      await draw(ticketPrice)
    } catch (e) {
      console.log(e)
    } finally {
      increaseTick()
      setLoading(false)
    }
  }, [account, library])

  const onClaim = useCallback(
    async (slotId) => {
      try {
        setLoading(true)
        await claimNft(slotId)
      } catch (e) {
        console.log(e)
      } finally {
        increaseTick()
        setLoading(false)
      }
    },
    [account, library]
  )

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
          {nftList &&
            nftList.map((data, index) => (
              <Box
                key={index}
                data={data}
                setSelectedNftDetail={setSelectedNftDetail}
              />
            ))}
        </NFTContainer>
        <ResultDataContainer>
          {resultData &&
            resultData.map((data, index) => (
              <ResultCotainer
                key={index}
                data={data}
                account={account}
                onClaim={onClaim}
              />
            ))}
        </ResultDataContainer>
      </Container>
      {selectedNftDetail && (
        <NftDetailContainer>
          <img width='96' height='96' src={selectedNftDetail.tokenURI.image_url} />
          <FactoryDetail>
            <Header>Name:</Header>
            <Detail>{selectedNftDetail.tokenURI.name}</Detail>
          </FactoryDetail>
        </NftDetailContainer>
      )}
      <DrawContainer>
        <Button disabled={loading} onClick={onDraw}>
          Draw
        </Button>
        <TicketPrice>Ticket Price: {ticketPrice} MATIC</TicketPrice>
      </DrawContainer>
    </Wrapper>
  )
}

export default Draw
