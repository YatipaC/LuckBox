import React, { useContext, useCallback, useState, useRef } from "react"
import styled from "styled-components"
import { Button } from "../Base"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../../hooks/useFactoryData"
import { shortAddress } from "../../helper/index"
import { useLuckBox } from "../../hooks/useLuckBox"
import SetTicketPriceModal from "../modals/SetTicketPrice"
import AddNftModal from "../modals/AddNftModal"
import StackNftModal from "../modals/StackNftModal"
import Slider from "react-slick"
import { LeftArrow, RightArrow, Arrow } from "../Base"

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
  margin-bottom: 12px;
`

const StackContainer = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .button-container {
    width: 120px;
    margin-top: 12px;
  }

  @media only screen and (max-width: 600px) {
    top: 33%;
  }
`

const SliderContainer = styled.div`
  width: 800px;

  @media only screen and (max-width: 1024px) {
    width: 600px;
  }

  @media only screen and (max-width: 600px) {
    width: 300px;
  }
`

const Box = ({ data, setSelectedNftDetail, id, active }) => {
  let imageUrl

  if (data && data.tokenURI && data.tokenURI.image_url) {
    imageUrl = data.tokenURI.image_url
  } else if (data && data.tokenURI && data.tokenURI.image) {
    imageUrl = data.tokenURI.image
  }

  return (
    <>
      {data.assetAddress === ethers.constants.AddressZero ||
      data.pendingWinnerToClaim ? (
        <BoxContainer
          active={active}
          onClick={() => setSelectedNftDetail({ id })}
        ></BoxContainer>
      ) : (
        <BoxContainer
          active={active}
          onClick={() => setSelectedNftDetail({ id, ...data })}
        >
          <img width='128' height='128' src={imageUrl} />
        </BoxContainer>
      )}
    </>
  )
}

const Manage = ({ data, toggleManageSelected }) => {
  let sliderRef = useRef()
  const { account, library } = useWeb3React()
  const { increaseTick } = useContext(FactoryContext)
  const {
    name,
    symbol,
    nftList,
    ticketPrice,
    boxAddress,
    totalEth,
    reserveData,
  } = data
  const { withdrawEth, withdrawNft } = useLuckBox(boxAddress, account, library)

  const [loading, setLoading] = useState(false)
  const [setTicketVisible, setSetTicketVisible] = useState(false)
  const [addNftVisible, setAddNftVisible] = useState(false)
  const [stackNftVisible, setStackNftVisible] = useState(false)
  const [selectedNftDetail, setSelectedNftDetail] = useState()

  const toggleSetTicket = () => setSetTicketVisible(!setTicketVisible)
  const toggleAddNft = () => setAddNftVisible(!addNftVisible)
  const toggleStackNft = () => setStackNftVisible(!stackNftVisible)

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const onPrev = () => {
    sliderRef.slickPrev()
  }

  const onNext = () => {
    sliderRef.slickNext()
  }

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

  const onWithdrawEth = useCallback(async () => {
    try {
      setLoading(true)
      await withdrawEth()
    } catch (e) {
      console.log(e)
    } finally {
      increaseTick()
      setLoading(false)
    }
  }, [account, library])

  const onWithdrawNft = useCallback(async () => {
    try {
      setLoading(true)
      await withdrawNft(selectedNftDetail.id)
    } catch (e) {
      console.log(e)
    } finally {
      increaseTick()
      setLoading(false)
    }
  }, [account, library])

  return (
    <Wrapper>
      <SetTicketPriceModal
        toggleModal={toggleSetTicket}
        modalVisible={setTicketVisible}
        boxAddress={boxAddress}
      />
      <AddNftModal
        toggleModal={toggleAddNft}
        modalVisible={addNftVisible}
        boxAddress={boxAddress}
        slotId={selectedNftDetail ? selectedNftDetail.id : 0}
      />
      <StackNftModal
        toggleModal={toggleStackNft}
        modalVisible={stackNftVisible}
        boxAddress={boxAddress}
      />
      <Container>
        <TitleContainer>
          <div style={{ flex: 1 }} onClick={toggleManageSelected}>
            {"<<"} Back
          </div>
          <div>Management</div>
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
        <StackContainer>
          {reserveData && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <LeftArrow onClick={onPrev} />
              <SliderContainer>
                <Slider ref={(ref) => (sliderRef = ref)} {...settings}>
                  {reserveData.map((item, index) => {
                    return (
                      <div key={index}>
                        <Box data={item} />
                      </div>
                    )
                  })}
                </Slider>
              </SliderContainer>
              <RightArrow onClick={onNext} />
            </div>
          )}

          {!reserveData && (
            <div style={{ fontSize: "30px", marginTop: "15px" }}>
              Loading...
            </div>
          )}
          <div className='button-container'>
            <Button disabled={loading} onClick={toggleStackNft}>
              Stack NFT
            </Button>
          </div>
        </StackContainer>
      </Container>
      <NftDetailContainer>
        {selectedNftDetail && Object.keys(selectedNftDetail).length > 1 && (
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
          </ItemContainer>
        )}
        <ItemContainer>
          Name: {name}
          <br />
          Symbol: {symbol}
          <br />
          Ticket Price: {ticketPrice} MATIC
          <br />
          <Button onClick={toggleSetTicket} disabled={loading}>
            Update Ticket Price
          </Button>
        </ItemContainer>
        <ItemContainer>
          Matic Balance: {totalEth} MATIC
          <Button onClick={onWithdrawEth} disabled={loading}>
            Withdraw
          </Button>
        </ItemContainer>
      </NftDetailContainer>
      <DrawContainer>
        {selectedNftDetail && Object.keys(selectedNftDetail).length === 1 && (
          <Button disabled={loading} onClick={toggleAddNft}>
            Add
          </Button>
        )}
        {selectedNftDetail &&
          Object.keys(selectedNftDetail).length > 1 &&
          (!selectedNftDetail.pendingWinnerToClaim ? (
            <Button disabled={loading} onClick={onWithdrawNft}>
              Withdraw
            </Button>
          ) : (
            <Button disabled>Pending to claim</Button>
          ))}
      </DrawContainer>
    </Wrapper>
  )
}

export default Manage
