import React, { useState, useEffect, useCallback, useContext, useMemo } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter  } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled, { css } from "styled-components"
import { FadeLoader } from "react-spinners"

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Header = styled.div`
  width: 100%;
  font-size: 32px;
  text-align: center;
`

const SubHeader = styled.div`
  width: 100%;
  font-size: 24px;
  text-align: center;
`

const Link = styled.a`
  width: 100%;
  font-size: 32px;
  text-align: center;
  color: #000;
  cursor: pointer;
`

function CongratModal({ toggleModal, modalVisible, drawData, nftList }) {
  const { account, library } = useWeb3React()

  const winnerNft =
    nftList && drawData
      ? nftList.find(
        (data) =>
          data.assetAddress.toLowerCase() ===
          drawData.assetAddress.toLowerCase() &&
          data.tokenId === drawData.tokenId.toString()
      )
      : null

  const imageUrl = useMemo(() => {

    if (winnerNft && winnerNft.tokenURI && winnerNft.tokenURI.image) {
      return winnerNft.tokenURI.image
    }

    if (winnerNft && winnerNft.tokenURI && winnerNft.tokenURI.image_url) {
      return winnerNft.tokenURI.image_url
    }

    return 
  },[winnerNft])

  return (
    <Modal isOpen={modalVisible} toggle={toggleModal}>
      <ModalHeader style={{ color: "#000" }} toggle={toggleModal}>
        {!drawData ? "Your result is being processed" : "Your result is finally here"}
      </ModalHeader>
      <ModalBody>
        <ContentContainer>
          {!drawData ? (
            <>
              <FadeLoader height='15' width='5' radius='2' margin='2' />
              <p style={{marginTop: 10}}>Close this modal doesn't block you to receive the prize</p> 
            </>
          ) : drawData.isWon ? (
            <>
              <Header>🎉 Congrats! You received NFT 🎉</Header>
              <img width='128' height='128' src={imageUrl} />
              <Link
                href={`https://polygonscan.com/tx/${drawData.tx.hash}`}
                target='_blank'
              >
                View Your Transaction
              </Link>
            </>
          ) : (
            <>
              <Header>😭 You did not receive any NFT 😭</Header>
              <SubHeader onClick={toggleModal}>Please try again</SubHeader>
              <Link
                href={`https://polygonscan.com/tx/${drawData.tx.hash}`}
                target='_blank'
              >
                View Your Transaction
              </Link>
            </>
          )}
        </ContentContainer>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CongratModal
