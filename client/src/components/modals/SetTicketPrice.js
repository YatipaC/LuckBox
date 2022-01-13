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
import styled from "styled-components"
import { useLuckBox } from "../../hooks/useLuckBox"

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

function SetTicketPriceModal({ toggleModal, modalVisible, boxAddress }) {
  const { account, library } = useWeb3React()
  const { setTicketPrice } = useLuckBox(boxAddress, account, library)
  const [loading, setLoading] = useState(false)
	const useInput = (initialState) => {
    const [value, setValue] = useState(initialState)
    function handleInput(e) {
      setValue(e.target.value)
    }
    return {
      value,
      onChange: handleInput,
    }
  }
	const { value: ticketPrice, onChange: onTicketPriceChange } = useInput("")

  const onCreateLuckBox = async () => {
    try {
      setLoading(true)
      await setTicketPrice(ticketPrice)
    } catch (e) {
      console.log(e)
    } finally {
      toggleModal()
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={modalVisible} toggle={toggleModal}>
      <ModalHeader style={{ color: "#000" }} toggle={toggleModal}>
        Set Ticket Price
      </ModalHeader>
      <ModalBody style={{color : "black"}}>
        <InputGroupContainer>
          <InputHeader>Ticket Price</InputHeader>
          <InputGroup>
            <Input
              value={ticketPrice}
							onChange={onTicketPriceChange}
              type='number'
              placeholder='Ticket Price'
            />
            <InputGroupText>MATIC</InputGroupText>
          </InputGroup>
        </InputGroupContainer>
      </ModalBody>
      <ModalFooter>
        <Button disabled={loading} color='primary' onClick={onCreateLuckBox}>
          Set
        </Button>
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default SetTicketPriceModal
