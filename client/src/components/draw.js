import React, { useContext, useCallback, useState, useMemo } from "react"
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

  ${props => props.active && "background-color: #008080;"}
  
`

const FactoryDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
  flex-direction: column;
`

const NFTContainerWrapper = styled.div`
  width: 100%;
  display: flex;
`

const NFTContainer = styled.div`
  margin-top: 12px;
  max-width: 700px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
`


const Header = styled.div`
  margin-right: 8px;
  font-weight: bold;
`

const DrawContainer = styled.div`
  position: absolute;
  top: 15%;
  right: 5%;
  width: 250px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

// const NftDetailContainer = styled.div`
//   position: absolute;
//   top: 15%;
//   left: 5%;
//   width: 250px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   padding: 12px;
//   background-color: #dbbe8d;
//   border-radius: 10px;
//   border: 3px solid #565049;
// `

const NftDetailContainer = styled.div`
  position: absolute;
  top: 15%;
  left: 5%;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
`

const ItemContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  border: 3px solid #565049;
  width: 100%;
  padding: 10px;
  line-height: 18px;
`

const Detail = styled.div``

const TicketPrice = styled.div`
  padding: 6px 12px 6px 12px;
  background-color: #008080;
  color: white;
  font-size: 20px;
  border-radius: 10px;
  border: 3px solid #565049;
  margin-top: 12px;
  text-align: center;
`

const Steps = styled(TicketPrice)`
  text-align: left;
  line-height: 22px;
  background-color: white;
  color: black;
`




const ResultDataContainerWrapper = styled.div`
  z-index: 3;
  display: flex;
  justify-content: center;
  h4 {
    padding:0px;
    margin: 0px;
    text-align: center;
    margin-bottom: 5px;
  }
`

const ResultDataContainer = styled.div`
  
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  border: 3px solid #565049;
  padding: 12px;
  background-color: white;
  color: black;
  margin-top: 12px;
  width: 100%;
  font-size: 20px;
  line-height: 22px;
  max-width: 700px;
  height: 200px;
  overflow-y: scroll;

`

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const Box = ({ data, setSelectedNftDetail, id, active }) => {



  return (
    <>
      {data.assetAddress === ethers.constants.AddressZero ||
        data.pendingWinnerToClaim ? (
        <BoxContainer active={active} onClick={() => setSelectedNftDetail(null)}></BoxContainer>
      ) : (
        <BoxContainer active={active} onClick={() => setSelectedNftDetail({ id, ...data })}>
          <img width='128' height='128' src={data.tokenURI.image_url} />
        </BoxContainer>
      )}
    </>
  )
}

const ResultContainer = ({ data, account, onClaim }) => {
  const isWinner = account && data && data.won && data.drawer.toLowerCase() === account.toLowerCase()



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

  const pendingClaimed = useMemo(() => {

    if (selectedNftDetail && account && selectedNftDetail.won && selectedNftDetail.drawer.toLowerCase() === account.toLowerCase()) {
      return true
    }

    return false
  }, [selectedNftDetail, account])

  return (
    <Wrapper>

      <Container>
        <TitleContainer>
          <div style={{ flex: 1 }} onClick={() => setLuckBoxSelected(null)}>
            {"<<"} Back
          </div>
          {/* <div>Ticket: {ticketPrice} MATIC</div> */}
          <div> {data.name}</div>
        </TitleContainer>
        <NFTContainerWrapper>
          <NFTContainer>
            {nftList &&
              nftList.map((data, index) => (
                <Box
                  key={index}
                  id={index}
                  data={data}
                  setSelectedNftDetail={setSelectedNftDetail}
                  active={selectedNftDetail && selectedNftDetail.id === index}
                />
              ))}
          </NFTContainer>
        </NFTContainerWrapper>
        <ResultDataContainerWrapper>
          <ResultDataContainer>

            <h4>
              History
            </h4>
            <>
              {/* {resultData &&
                resultData.map((data, index) => (
                  <ResultContainer
                    key={index}
                    data={data}
                    account={account}
                    onClaim={onClaim}
                  />
                ))} */}
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th scope="col" width="5%">#</th>
                    <th scope="col">Drawer</th>
                    <th scope="col">Won</th>
                    <th scope="col">Slot</th>
                    <th scope="col">Output</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resultData && resultData.map((data, index) => {

                    const isWinner = account && data && data.won && data.drawer.toLowerCase() === account.toLowerCase()

                    return (
                      <tr>
                        <th scope="row">{resultData.length - index}</th>
                        <td>{shortAddress(data.drawer, 7, 30)}</td>

                        <td> {data.won ? "Yes" : "No"}</td>
                        <td> {data.won && Number(data.slot) + 1}</td>
                        <td>{(Number(data.output) / 1000).toFixed(2)}  </td>
                        <td>
                          {isWinner && <Button style={{ fontSize: "14px", padding: "0px" }} disabled={loading} onClick={() => onClaim(data.slot)}>
                            Claim
                          </Button> }
                        </td>
                      </tr>
                    )
                  })}


                </tbody>
              </table>


              {resultData.length === 0 && <div style={{ padding: 20, textAlign: "center" }}>No records.</div>}
            </>
          </ResultDataContainer>
        </ResultDataContainerWrapper>

      </Container>
      {selectedNftDetail && (
        <NftDetailContainer>
          <ItemContainer>
            <img width='96' height='96' src={selectedNftDetail.tokenURI.image_url} />
            <br />
            Slot : {Number(selectedNftDetail.id) + 1}
            <br />
            NFT Name : {selectedNftDetail.tokenURI.name}
            <br />
            Asset Address : <a href={`https://polygonscan.com/address/${selectedNftDetail.assetAddress}`} target="_blank">{shortAddress(selectedNftDetail.assetAddress)}</a>
            <br />
            Token Id : {selectedNftDetail.tokenId}
            <hr />
            Chance to get this NFT : {Number(selectedNftDetail.randomnessChance) / 100}%
            {/*             
            <FactoryDetail>
              <Header>Name:</Header>
              <Detail>{selectedNftDetail.tokenURI.name}</Detail>

              <hr/>
              hello
            </FactoryDetail> */}
          </ItemContainer>
          {/* <Button style={{ width: "100%" }} disabled={loading || !pendingClaimed} onClick={() => onClaim(selectedNftDetail.id)}>
            Claim
          </Button>
          { pendingClaimed && <TicketPrice style={{ width: "100%" }}>You can claim it!</TicketPrice> } */}
        </NftDetailContainer>
      )}
      <DrawContainer>
        <Button disabled={loading || !account} onClick={onDraw}>
          Draw
        </Button>
        {!account && <div style={{ textAlign: "center", color: "red" }}>Wallet is not connected</div>}
        <TicketPrice>Price: {ticketPrice} MATIC</TicketPrice>
        <Steps>
          <u>How To Play</u>
          <ol>
            <li>
              Connnect your wallet to Polygon chain
            </li>
            <li>
              Check out hitting chance by clicking one of the NFT
            </li>
            <li>
              Clicking "Draw" button if you are interested
            </li>
            <li>
              Waiting about 1 min. for the result to be generated by Chainlink nodes
            </li>
            <li>
              Check out the history panel at the bottom of the screen to see if you get the prize
            </li>
          </ol>
        </Steps>
      </DrawContainer>

    </Wrapper>
  )
}

export default Draw
