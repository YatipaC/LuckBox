import React, { useState, useEffect, useCallback, useContext } from "react"
import {
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroupText,
  InputGroup,
} from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled, { css } from "styled-components"
import { useLuckBox } from "../../hooks/useLuckBox"
import { useERC721 } from "../../hooks/useERC721"
import { ethers } from "ethers"

const InputGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;
`

const InputHeader = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`

const TypeButton = styled.div`
  background-color: #fff;
  border: 3px solid #565049;
  border-radius: 10px;
  color: #000;
  padding: 5px 20px 5px 20px;
  margin-top: 6px;
  margin-right: 8px;
  font-size: 20px;
  line-height: 18px;
  font-weight: bold;

  text-align: center;

  ${(props) =>
    props.selected &&
    css`
      background-color: #008080;
      color: white;
    `}

  ${(props) =>
    props.disabled
      ? `
		opacity: 0.2;
`
      : `
		cursor: pointer;
		:hover {
		opacity: 0.9;
		}
`}
`

function AddNftModal({ toggleModal, modalVisible, boxAddress, slotId }) {
  const { account, library } = useWeb3React()
  const { depositNft } = useLuckBox(boxAddress, account, library)
  const [loading, setLoading] = useState(false)
  const [tokenType, setTokenType] = useState(721)
  const [randomness, setRandomness] = useState("")
  const [assetAddress, setAssetAddress] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [isAssetApprovedToBox, setIsAssetApprovedToBox] = useState(false)

  const onRandomnessChange = (e) => {
    setRandomness(e.target.value)
  }

  const onAssetAddressChange = (e) => {
    setAssetAddress(e.target.value)
  }

  const onTokenIdChange = (e) => {
    setTokenId(e.target.value)
  }

  const assetAddressContract = useERC721(assetAddress, account, library)

  useEffect(() => {
    checkAssetAddresApproved()
  }, [assetAddress])

  const checkAssetAddresApproved = async () => {
    if (!assetAddressContract || !ethers.utils.isAddress(assetAddress)) return
    const isApprove = await assetAddressContract.getIsApprovedForAll(boxAddress)
    setIsAssetApprovedToBox(isApprove)
  }

  const onApproveAssetToBox = async () => {
    if (!assetAddressContract || !ethers.utils.isAddress(assetAddress)) return
    try {
      setLoading(true)
      await assetAddressContract.setApproveForAll(boxAddress)
      setIsAssetApprovedToBox(true)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const onDepositNft = async () => {
    try {
      setLoading(true)
      await depositNft(
        slotId,
        randomness,
        assetAddress,
        tokenId,
        tokenType === 1155
      )
    } catch (e) {
      console.log(e)
    } finally {
      toggleModal()
      setTokenType(721)
      setLoading(false)
      setRandomness("")
      setAssetAddress("")
      setTokenId("")
      setIsAssetApprovedToBox(false)
    }
  }

  return (
    <Modal isOpen={modalVisible} toggle={toggleModal}>
      <ModalHeader style={{ color: "#000" }} toggle={toggleModal}>
        Add Nft
      </ModalHeader>
      <ModalBody>
        <InputHeader>Slot: {slotId + 1}</InputHeader>
        <InputGroupContainer>
          <InputHeader>Random Percent (1 - 20%)</InputHeader>
          <InputGroup>
            <Input
              value={randomness}
              onChange={onRandomnessChange}
              type='number'
              placeholder='Random Percent'
              max='10'
            />
            <InputGroupText>%</InputGroupText>
          </InputGroup>
        </InputGroupContainer>
        <InputGroupContainer>
          <InputHeader>Asset Address</InputHeader>
          <InputGroup>
            <Input
              value={assetAddress}
              onChange={onAssetAddressChange}
              placeholder='Asset Address'
            />
          </InputGroup>
        </InputGroupContainer>
        <InputGroupContainer>
          <InputHeader>Token ID</InputHeader>
          <InputGroup>
            <Input
              value={tokenId}
              onChange={onTokenIdChange}
              placeholder='Token ID'
            />
          </InputGroup>
        </InputGroupContainer>
        <InputGroupContainer>
          <InputHeader>Token Type</InputHeader>
          <InputGroup>
            <TypeButton
              onClick={() => setTokenType(721)}
              selected={tokenType === 721}
            >
              ERC 721
            </TypeButton>
            <TypeButton
              onClick={() => setTokenType(1155)}
              selected={tokenType === 1155}
            >
              ERC 1155
            </TypeButton>
          </InputGroup>
        </InputGroupContainer>
      </ModalBody>
      <ModalFooter>
        {!isAssetApprovedToBox ? (
          <Button
            disabled={
              !isAssetApprovedToBox && !ethers.utils.isAddress(assetAddress)
            }
            color='primary'
            onClick={onApproveAssetToBox}
          >
            Approve
          </Button>
        ) : (
          <Button disabled={loading} color='primary' onClick={onDepositNft}>
            Add
          </Button>
        )}
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AddNftModal
