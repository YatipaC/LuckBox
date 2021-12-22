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
                Lucky box is a collection of NFTs which are unknown until the
                box is opened. <br />
                <br />
                An NFT Gachapon powered by Chainlink VRF which is live on
                Polygon Mainnet at https://luckbox.wtf , the project is
                NFT-agnostic which means you can draw the NFT from any project
                that has been deposited into the Gachapon smart contract by its
                owner. <br />
                <br />
                The Gachapon contract owner must sourcing attractive NFTs to be
                listed and responsible to set the ticket price in MATIC unit,
                winning chance in percentage terms, all of parameters can be
                visible from the user and seen whether they want to try their
                luck or not. <br />
                <br />
                As this project is in the early stage of development, there are
                some conditions and limitations you need to aware of as
                following: <br />
                <br />
                <ul>
                  <li>Network: Polygon Mainnet</li>

                  <li>Settlement Token: $MATIC </li>

                  <li>
                    Support of ERC-721 only (will be working on ERC-1155 later
                    on){" "}
                  </li>

                  <li>Winning chance per NFT: 0.01%-10% </li>

                  <li>Max. NFT per Gachapon contract: 9 </li>
                </ul>
              </Content>
            </TabPane>
            <TabPane tabId='2'>
              <Content>
                Step by Step <br />
                1) Connect your wallet. <br />
                2) On the main screen, you will see all Gachapon contracts
                (choose Box, NFT inside) available in the system, click through
                it to see what NFTs are being offered from them. <br />
                3) Check out hitting chance by clicking one of the 9 NFTs.{" "}
                <br />
                4) If you are satisfied to play, don’t hesitate to draw it and
                you will need to pay the draw price. <br />
                5) Refresh the website and look for the result at the history
                panel on the bottom of the screen. If you are lucky enough, then
                you can claim the NFT from there.
              </Content>
            </TabPane>
            <TabPane tabId='3'>
              <Content>
                1) Which wallet can I connect? <br />
                2) Which network is accepted? <br />
                3) How is the drawing mechanism? <br />
                4) How can I check if I was lucky and claim my prize?
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
