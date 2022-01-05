import React, { useContext, useCallback, useState, useMemo } from "react"
import styled from "styled-components"
import { Button } from "./Base"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import ReactHtmlParser from 'react-html-parser'; 

import { FactoryContext } from "../hooks/useFactoryData"
import { shortAddress } from "../helper/index"
import { useLuckBox } from "../hooks/useLuckBox"
import LuckBoxABI from "../abi/LuckBox.json"
import CongratModal from "../components/modals/CongratModal"

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

  ${(props) => props.active && "background-color: #008080;"}
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
    padding: 0px;
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
  let imageUrl
 
  if (data && data.tokenURI && data.tokenURI.image_url) {
    imageUrl = data.tokenURI.image_url
  } else if (data && data.tokenURI && data.tokenURI.image) {
    imageUrl = data.tokenURI.image
  }

  let imageData 

  if (data && data.tokenURI && data.tokenURI.image_data) {
    imageData = data.tokenURI.image_data
  }

  return (
    <>
      {data.assetAddress === ethers.constants.AddressZero ||
        data.pendingWinnerToClaim ? (
        <BoxContainer
          active={active}
          onClick={() => setSelectedNftDetail(null)}
        ></BoxContainer>
      ) : (
        <BoxContainer
          active={active}
          onClick={() => setSelectedNftDetail({ id, ...data })}
        >
          { imageUrl && <img width='128' height='128' src={imageUrl} />}
          { imageData && <div style={{width : "100%", height : "100%"}}> { ReactHtmlParser (imageData) } </div>}
        </BoxContainer>
      )}
    </>
  )
}

const ResultContainer = ({ data, account, onClaim }) => {
  const isWinner =
    account &&
    data &&
    data.won &&
    data.drawer.toLowerCase() === account.toLowerCase()

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

const Draw = ({ data, setLuckBoxSelected, toggleManageSelected }) => {
  const { account, library } = useWeb3React()
  const { increaseTick, tick } = useContext(FactoryContext)
  const { nftList, ticketPrice, resultData, boxAddress, owner } = data
  const { draw, claimNft } = useLuckBox(boxAddress, account, library)

  const [loading, setLoading] = useState(false)
  const [selectedNftDetail, setSelectedNftDetail] = useState()
  const [detailData, setDetailData] = useState()
  const [congratModalOpen, setCongratModalOpen] = useState(false)

  const toggleCongratModal = () => {
    setCongratModalOpen(!congratModalOpen)
    setDetailData()
  }

  const onDraw = useCallback(async () => {
    try {
      setLoading(true)
      const box = new ethers.Contract(
        boxAddress,
        LuckBoxABI,
        library.getSigner()
      )
      const estimateGas = await box.estimateGas.draw({
        value: ethers.utils.parseEther(ticketPrice),
      })
      const tx = await draw(ticketPrice, { gasLimit: estimateGas.add(100000) })
      toggleCongratModal()
      box.on("Drawn", (drawer, isWon, assetAddress, tokenId) => {
        if (drawer === account) {
          setDetailData({
            drawer,
            isWon,
            assetAddress,
            tokenId,
            tx,
          })
        }
      })
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

  let imageUrl

  if (
    selectedNftDetail &&
    selectedNftDetail.tokenURI &&
    selectedNftDetail.tokenURI.image_url
  ) {
    imageUrl = selectedNftDetail.tokenURI.image_url
  } else if (
    selectedNftDetail &&
    selectedNftDetail.tokenURI &&
    selectedNftDetail.tokenURI.image
  ) {
    imageUrl = selectedNftDetail.tokenURI.image
  }
 
  return (
    <Wrapper>
      {
        <CongratModal
          toggleModal={toggleCongratModal}
          modalVisible={congratModalOpen}
          drawData={detailData}
          nftList={nftList}
        />
      }
      <Container>
        <TitleContainer>
          <div style={{ flex: 1 }} onClick={() => setLuckBoxSelected(null)}>
            {"<<"} Back
          </div>
          {/* <div>Ticket: {ticketPrice} MATIC</div> */}
          <div style={{ cursor: "default" }}> {data.name}</div>
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
            <h4>History</h4>
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
                    <th scope='col' width='5%'>
                      #
                    </th>
                    <th scope='col'>Drawer</th>
                    <th scope='col'>Won</th>
                    <th scope='col'>Slot</th>
                    {/* <th scope='col'>Output</th> */}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resultData &&
                    resultData.map((data, index) => {
                      const isWinner =
                        account &&
                        data &&
                        data.won &&
                        data.drawer.toLowerCase() === account.toLowerCase()

                      return (
                        <tr>
                          <th scope='row'>{resultData.length - index}</th>
                          <td>{shortAddress(data.drawer, 7, 30)}</td>

                          <td> {data.won ? "Yes" : "No"}</td>
                          <td> {data.won && Number(data.slot) + 1}</td>
                          {/* <td>{(Number(data.output) / 1000).toFixed(2)} </td> */}
                          <td>
                            {/* {isWinner && (
                              <Button
                                style={{ fontSize: "14px", padding: "0px" }}
                                disabled={loading}
                                onClick={() => onClaim(data.slot)}
                              >
                                Claim
                              </Button>
                            )} */}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>

              {resultData.length === 0 && (
                <div style={{ padding: 20, textAlign: "center" }}>
                  No records.
                </div>
              )}
            </>
          </ResultDataContainer>
        </ResultDataContainerWrapper>
      </Container>
      {selectedNftDetail && (
        <NftDetailContainer>
          <ItemContainer>
            {imageUrl && <img width='96' height='96' src={imageUrl} />}
            <br />
            Slot : {Number(selectedNftDetail.id) + 1}
            <br />
            NFT Name :{" "}
            {selectedNftDetail.tokenURI ? selectedNftDetail.tokenURI.name : ""}
            <br />
            Asset Address :{" "}
            <a
              href={`https://polygonscan.com/address/${selectedNftDetail.assetAddress}`}
              target='_blank'
            >
              {shortAddress(selectedNftDetail.assetAddress)}
            </a>
            <br />
            Token Id : {selectedNftDetail.tokenId}
            <hr />
            Chance to get this NFT :{" "}
            {Number(selectedNftDetail.randomnessChance) / 100}%
            {/*             
            <FactoryDetail>
              <Header>Name:</Header>
              <Detail>{selectedNftDetail.tokenURI.name}</Detail>

              <hr/>
              hello
            </FactoryDetail> */}
            {selectedNftDetail && selectedNftDetail.assetAddress === "0x85CBf58C9d20459339a0b1F586A5FAC643a29286" && (
              <>
                <hr />
                <p>
                  The CryptoSharks is a collection of unique Sharks living on
                  Polygon Blockchain.
                </p>
                <p>Floor Price : $22 (27 Nov. 21)</p>
                <p>
                  Links :{" "}
                  <a
                    href='https://opensea.io/collection/originative-cryptosharks'
                    target='_blank'
                  >
                    OpenSea
                  </a>
                  ,{" "}
                  <a href='https://twitter.com/NFT_Originative' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}
            {selectedNftDetail && selectedNftDetail.assetAddress === "0x8634666bA15AdA4bbC83B9DbF285F73D9e46e4C2" && (
              <>
                <hr />
                <p>
                  Join the most fun and exciting Ethereum-based game where you
                  can own and race your chicken to earn ETH. Brought by the
                  makers of Ganja Farmer.
                </p>
                <p>Floor Price : $226 (27 Nov. 21)</p>
                <p>
                  Links :{" "}
                  <a
                    href='https://opensea.io/collection/chicken-derby'
                    target='_blank'
                  >
                    OpenSea
                  </a>
                  ,{" "}
                  <a href='https://twitter.com/bitlovincom' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}
            {selectedNftDetail && selectedNftDetail.assetAddress === "0x2215463d57ed278a778C5cfD9509919ACf8CEF8d" && (
              <>
                <hr />
                <p>
                  Early Adopters will obtain this exclusive Tamago NFT by joining Tamago’s early user interview, helping Tamago to test out the product.
                </p>
                <p>Floor Price : $174 (23 Dec. 21)</p>
                <p>
                  Links :{" "}
                  <a
                    href='https://opensea.io/collection/tamago-finance'
                    target='_blank'
                  >
                    OpenSea
                  </a>
                  ,{" "}
                  <a href='https://twitter.com/TamagoFinance' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}

            {selectedNftDetail && selectedNftDetail.assetAddress === "0x7bC48b21d4985EB8F34807A389161192832dB924" && (
              <>
                <hr />
                <p>
                  Official 0N1 Force Cryptovoxels wearables to rep in the Metaverse! All wearables will be airdropped to 0N1 Force holders!
                </p>
                <p>Floor Price : $18 (23 Dec. 21)</p>
                <p>
                  Links :{" "}
                  <a
                    href='https://opensea.io/collection/0n1-corp'
                    target='_blank'
                  >
                    OpenSea
                  </a>
                  ,{" "}
                  <a href='https://www.twitter.com/0n1force' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}


            {selectedNftDetail && selectedNftDetail.assetAddress === "0x109440e0a0b37c0E2A17F91bDEa42A8Fb17663FB" && (
              <>
                <hr />
                <p>
                  CryptoEmpire Avatars are gifts to the early community members and NFT card holders of the CryptoEmpire project. 3,000 avatars, inspired by the CryptoEmpire NFTs, were distributed to select addresses.
                </p>
                <p>Floor Price : $4 (23 Dec. 21)</p>
                <p>
                  Links :{" "}
                  <a
                    href='https://opensea.io/collection/cryptoempire-avatars'
                    target='_blank'
                  >
                    OpenSea
                  </a>
                  ,{" "}
                  <a href='https://www.twitter.com/cryptoempirenft' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}

            {selectedNftDetail && selectedNftDetail.assetAddress === "0x86935F11C86623deC8a25696E1C19a8659CbF95d" && (
              <>
                <hr />
                <p>
                Aavegotchis are rare crypto-collectibles living on the Ethereum blockchain, backed by the ERC721 standard.
                </p>
                
                <p>
                  Links :{" "}
                  <a
                    href='https://aavegotchi.com/'
                    target='_blank'
                  >
                    Website
                  </a>
                  ,{" "}
                  <a href='https://twitter.com/aavegotchi' target='_blank'>
                    Twitter
                  </a>
                </p>
              </>
            )}

          </ItemContainer>
          {/* <Button style={{ width: "100%" }} disabled={loading || !pendingClaimed} onClick={() => onClaim(selectedNftDetail.id)}>
            Claim
          </Button>
          { pendingClaimed && <TicketPrice style={{ width: "100%" }}>You can claim it!</TicketPrice> } */}
        </NftDetailContainer>
      )}
      <DrawContainer>
        {account && owner.toLowerCase() === account.toLowerCase() && (
          <Button onClick={toggleManageSelected}>Manage</Button>
        )}
        <Button disabled={loading || !account} onClick={onDraw}>
          Draw
        </Button>
        {!account && (
          <div style={{ textAlign: "center", color: "red" }}>
            Wallet is not connected
          </div>
        )}
        <TicketPrice>Price: {ticketPrice} MATIC</TicketPrice>
        <Steps>
          <u>To Play</u>
          <ol>
            <li>Connnect your wallet to Polygon chain</li>
            <li>Check out hitting chance by clicking one of the NFT</li>
            <li>Clicking "Draw" button if you are interested</li>
          </ol>
        </Steps>
      </DrawContainer>
    </Wrapper>
  )
}

export default Draw
