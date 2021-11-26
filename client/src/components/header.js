import { useState } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Blockies from "react-blockies"

import { shortAddress } from "../helper"
import { Button } from "./Base"
import WalletsModal from "./modals/WalletConnectModal"

const Wrapper = styled.div`
  position: absolute;
  top: 1.5%;
  left: 0px;
  font-size: 24px;
`

const Container = styled.div`
  width: 100vw;
  text-align: center;
  display: flex;
  padding: 0px 48px;
`

const ConnectButton = styled(Button)`
  width: 200px;
`

const Display = styled(Button)`
  width: 200px;
  display: flex;
  align-items: center;
`

const BlockiesContainer = styled(Blockies)`
  margin-right: 8px;
  border-radius: 50%;
`

const Footer = () => {
  const { account, deactivate, library } = useWeb3React()

  const [walletLoginVisible, setWalletLoginVisible] = useState(false)

  const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible)

  return (
    <Wrapper>
      <WalletsModal
        toggleWalletConnect={toggleWalletConnect}
        walletLoginVisible={walletLoginVisible}
      />
      <Container>
        <div style={{ flex: 1 }} />
        {account ? (
          <Display onClick={deactivate}>
            <BlockiesContainer seed={account} size={12} scale={3} />
            {shortAddress(account)}
          </Display>
        ) : (
          <ConnectButton onClick={toggleWalletConnect}>
            Connect Wallet
          </ConnectButton>
        )}
      </Container>
    </Wrapper>
  )
}

export default Footer
