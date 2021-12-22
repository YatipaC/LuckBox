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
  Alert
} from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { FACTORY } from "../../constants"
import { useFactory } from "../../hooks/useFactory"

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

function CreateLuckBoxModal({ toggleModal, modalVisible }) {
  const { account, library } = useWeb3React()
  const { createLuckBox } = useFactory(FACTORY, account, library)
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
  const { value: name, onChange: onNameChange } = useInput("")
  const { value: symbol, onChange: onSymbolChange } = useInput("")
  const { value: ticketPrice, onChange: onTicketPriceChange } = useInput("")

  const onCreateLuckBox = async () => {
    try {
      setLoading(true)
      await createLuckBox(name, symbol, ticketPrice)
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
        Create Your Collection
      </ModalHeader>
      <ModalBody>

      <Alert color="primary" size="sm">
          Please reach out to us via either Telegram or Discord when done for the approval.
        </Alert>


        <InputGroupContainer>
          <InputHeader>Name (To be displayed on the main screen)</InputHeader>
          <Input value={name} onChange={onNameChange} placeholder='Name' />
        </InputGroupContainer>
        
        <InputGroupContainer>
          <InputHeader>Symbol (Short name of your Luckbox)</InputHeader>
          <Input value={symbol} onChange={onSymbolChange} placeholder='Symbol' />
        </InputGroupContainer>
        <InputGroupContainer>
          <InputHeader>Ticket Price (You will receive when the user draws yours)</InputHeader>
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

        {!account && (
          <div style={{ textAlign: "center", color: "red" }}>
            Connect your wallet first
          </div>
        )}

        
      </ModalBody>
      <ModalFooter>
        
        <Button disabled={loading || !account} color='primary' onClick={onCreateLuckBox}>
          Proceed
        </Button>
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateLuckBoxModal
