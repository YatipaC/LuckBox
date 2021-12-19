import React, { useCallback, useContext, useState } from "react"
import styled from "styled-components"
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

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

    font-size: 20px;
    line-height: 22px; 

    .nav-link {
        color : black;
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

    const [activeTab, setActiveTab] = useState('1')

    return (
        <Wrapper>
            <Box>
                <div>
                    <Nav tabs fill>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '1' })}
                                onClick={() => { setActiveTab('1'); }}
                            >
                                What's Luckbox?
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '2' })}
                                onClick={() => { setActiveTab('2'); }}
                            >
                                How To Play
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === '3' })}
                                onClick={() => { setActiveTab('3'); }}
                            >
                                FAQs
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            <Content>
                                TBD
                            </Content>
                        </TabPane>
                        <TabPane tabId="2">
                            <Content>
                                TBD
                            </Content>
                        </TabPane>
                        <TabPane tabId="3">
                            <Content>
                                TBD
                            </Content>
                        </TabPane>
                    </TabContent>
                </div>
            </Box>
        </Wrapper>
    )
}

export default Info