import React, { useCallback, useContext, useState } from "react"
import styled from "styled-components"
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
} from "reactstrap"
import classnames from "classnames"

const Wrapper = styled.div`
  position: absolute;
  top: 58%;
  left: 0px;
  width: 100vw;
  display: flex;
  justify-content: center;

  a {
    color: inherit;
  }

  p {
    margin-top: 5px;
  }
`

const Box = styled.div`
  background-color: white;
  color: white;
  border: 3px solid #565049;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  height: 25vh;
  overflow: auto;

  font-size: 20px;
  line-height: 22px;

  .nav-link {
    color: black;
    opacity: 0.8;
    cursor: pointer;
  }

  @media only screen and (max-width: 1000px) {
    width: 600px;
  }

  @media only screen and (max-width: 600px) {
    margin-left: 10px;
    margin-right: 10px;
    width: 400px;
    font-size: 16px;
    line-height: 18px;
  }
`

// const Info = () => {
//     return (
//         <Wrapper>

//             <Box>
//                 Try your luck with the prize of well-known NFTs available on Polygon Mainnet in a permissionless manner, secure and extremely fair for anyone who dare to bet.
//                 <p>
//                     <a href="https://medium.com/@pisuthd/chainlink-hackathon-fall-2021-nft-luckbox-live-now-on-polygon-390d72a57575" target="_blank">Medium Post</a>|
//                     <a href="https://twitter.com/PisuthD" target="_blank">Twitter</a>|
//                     <a href="https://github.com/YatipaC/LuckBox" target="_blank">Github</a>
//                 </p>

//             </Box>

//         </Wrapper>
//     )
// }

const Content = styled.div`
  color: black;
  padding: 20px;
  text-align: left;

  @media only screen and (max-width: 1000px) {
    padding: 5px;
  }
`

const Info = () => {
  const [activeTab, setActiveTab] = useState("1")

  return (
    <Wrapper>
      <Box>
        <div>
          <Nav tabs fill>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  setActiveTab("1")
                }}
              >
                What's Luckbox?
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  setActiveTab("2")
                }}
              >
                How To Play
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => {
                  setActiveTab("3")
                }}
              >
                FAQs
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
              <Content>
                NFT Luckbox is an NFT Gachapon project powered by Chainlink VRF technology live now on Polygon Mainnet allows anyone to draw the NFT with fairness and guaranteed output delivery. The project is NFT-agnostic which means any NFT that based on ERC-721 and ERC-1155 can be deposited and waited for you to get it.
                <br />
                <br />
                Anyone can be a Gachapon contract owner and reponsible to find attrative NFTs and listed in your Gachapon and taking a passive income when someone open your Gachapon.
                <br />
                <br />
                Please be reminded that the prohect is in the early stage of development, do not hesitate to contact us if you have issues whether from being a drawer or Gachapon owner.
                <br />
                <br />
                <div style={{ textAlign: "center" }}>
                  <a href="https://t.me/tamagofinance" target="_blank">Telegram</a> | <a href="https://discord.gg/78fax5dPqk" target="_blank">Discord</a>
                </div>
              </Content>
            </TabPane>
            <TabPane tabId='2'>
              <Content>
                <u>Steps</u> <br />
                1) Connect your wallet and network <br />
                2) You will see all collections (choose Box, NFT inside) available in the system, click through it to see what NFTs are being offered from them. <br />
                3) Check out hitting chance by clicking one of the NFTs.<br/>
                4) Draw it if you want and you will need to pay the ticket that will be transfered to the collection owner.
              </Content>
            </TabPane>
            <TabPane tabId='3'>
              <Content>
                1) Which wallet can I connect to? <br />
                <i style={{ marginRight: 25 }} />We support MetaMask, imToken, WalletConnect, and Wallet Link. <br />
                2) Which network is supported right now?<br />
                <i style={{ marginRight: 25 }} />NFT Luckbox is currently live on Polygon Mainnet.<br />
                3) How is the drawing mechanism?<br />
                <i style={{ marginRight: 25 }} />The randomness of the Luck Box is very fair. The Gachapon contract owner will set a winning percentage. For example, if there are two NFTs in the Gachapon contract and the owner sets the probability of winning to 10%, it will send the request to Chainlink VRF to find a random number between 0 to 10,000. You will receive the first NFT if the number returned is between 0-1000 and the second NFT if the number is between 1001-2000. The rules are simple.<br />
                4) How can I check if I was lucky and claim my prize?<br />
                <i style={{ marginRight: 25 }} />If you win the prize, the LuckBox (Gachapon) smart contract will automatically transfer the NFT to you.
                <br />{" "}
              </Content>
            </TabPane>
          </TabContent>
        </div>
      </Box>
    </Wrapper>
  )
}

export default Info
