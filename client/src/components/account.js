import { useState } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Blockies from "react-blockies"
import { Row, Col } from "reactstrap"
import MaoDaoLogoPng from "../images/maodao-logo.png"
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
  display: flex;
`

const BrandContainer = styled(Col).attrs(() => ({
  xs: "5"
}))`
  padding: 10px; 

  h1 { 
    
    padding: 0px;
    margin: 0px;
    text-shadow: 2px 2px #3c3949;
    cursor: pointer;
}

`

const ButtonContainer = styled(Col).attrs(() => ({
  xs: "7"
}))`
  padding: 10px;
  display: flex;

`

const MaoDaoLogo = styled.img.attrs(() => ({ src: MaoDaoLogoPng }))`
  height: 60px;
`

const ConnectButton = styled(Button)`
  width: 135px; 
  height: 35px;

`

const DisconnectButton = styled(ConnectButton)`
  display: inline;  
`

const Address = styled(ConnectButton)`
  cursor: default;

`

const Network = styled(Address)`
  margin-right: 5px;
  background-color: #6d6b76;
  width: 120px
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

// const Account = () => {
//   const { account, deactivate, library } = useWeb3React()

//   const [walletLoginVisible, setWalletLoginVisible] = useState(false)

//   const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible)

//   return (
//     <>
//       <Wrapper>
//         <WalletsModal
//           toggleWalletConnect={toggleWalletConnect}
//           walletLoginVisible={walletLoginVisible}
//         />
//         <Container>

//           <div style={{ marginRight: "auto", marginLeft: "auto" }}>
//             {account ? (
//               <DisconnectButton onClick={deactivate}>
//                 Disconnect 🔌
//               </DisconnectButton >
//             ) : (
//               <ConnectButton onClick={toggleWalletConnect}>
//                 Connect 🏦
//               </ConnectButton>
//             )}
//           </div>

//         </Container>
//       </Wrapper>
//     </>
//   )
// }


const Account = ({ setLuckBoxSelected }) => {

  const { account, deactivate, library, chainId } = useWeb3React()

  const [walletLoginVisible, setWalletLoginVisible] = useState(false)

  const toggleWalletConnect = () => setWalletLoginVisible(!walletLoginVisible)


  return (
    <>
      <WalletsModal
        toggleWalletConnect={toggleWalletConnect}
        walletLoginVisible={walletLoginVisible}
      />
      <Row>
        <BrandContainer>
          {/* <MaoDaoLogo /> */}
          <h1 onClick={() => setLuckBoxSelected()}>NFT Luckbox</h1>
        </BrandContainer>
        <ButtonContainer>
          {account ? (
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "row" }}>

              {(chainId === 1 || chainId === 137) && (
                <Network>
                  {chainId === 1 && "Mainnet"}
                  {chainId === 137 && "Polygon"}
                </Network>
              )

              }
              <Address>
                {shortAddress(account, 4, -3)}
              </Address>
            </div>

          ) : (
            <ConnectButton style={{ marginLeft: "auto" }} onClick={toggleWalletConnect}>
              Connect 🏦
            </ConnectButton>
          )}
        </ButtonContainer>
      </Row>
    </>
  )
}

export default Account
