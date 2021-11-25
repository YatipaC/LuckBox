import React, { useState, useEffect, useCallback, useContext } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import { Connectors } from "../../connectors"
import useEagerConnect from "../../hooks/useEagerConnect"
import useInactiveListener from "../../hooks/useInactiveListener"
import styled from "styled-components"

const Connector = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  color: #000;

  font-size: 16px;

  :hover {
    cursor: pointer;
    color: white;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0)
      ),
      linear-gradient(101deg, #78e4ff, #ff48fa);
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: none;
  }

  display: flex;
  flex-direction: row;

  img {
    width: 32px;
    height: 32px;
  }

  div {
    flex: 70%;
    display: flex;
    align-items: center;

    :first-child {
      flex: 20%;
    }
    :last-child {
      flex: 10%;
    }
  }
`

function WalletsModal({ toggleWalletConnect, walletLoginVisible }) {
  const context = useWeb3React()

  const { account, activate, deactivate, error, chainId } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState()

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  useEffect(() => {
    if (error && error.name === "UnsupportedChainIdError") {
      //   toastr.warning("Unsupported Network", "Please switch to Polygon Mainnet")
      alert("Please switch to Polygon Mainnet")
    }
  }, [error])

  return (
    <Modal isOpen={walletLoginVisible} toggle={toggleWalletConnect}>
      <ModalHeader style={{color: "#000"}} toggle={toggleWalletConnect}>
        Choose Wallet Provider
      </ModalHeader>
      <ModalBody>
        {Connectors.map((item, index) => {
          const { connector, name, img } = item
          return (
            <Connector
              key={index}
              onClick={() => {
                toggleWalletConnect()
                // setActivatingConnector(connector)
                activate(connector)
              }}
            >
              <div>
                <img src={img} alt={`wallet-icon-${index}`} />
              </div>
              <div>{name}</div>
              <div>{/* TODO : PUT CONNECTION STATUS */}</div>
            </Connector>
          )
        })}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggleWalletConnect}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WalletsModal
