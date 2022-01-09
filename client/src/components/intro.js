import React, { useCallback, useContext, useState } from "react"
import styled from "styled-components"
import { Row, Col } from "reactstrap"
import MaoDaoLogoPng from "../images/maodao-logo.png"
import MaoDao1Png from "../images/sample/maodao-1.png"
import MaoDao2Png from "../images/sample/maodao--2.png"
import MaowJpg from "../images/sample/maow.jpg"
import Maow2Jpg from "../images/sample/maow-2.jpg"
import DoodlePng from "../images/sample/doodle.png"
import CryptoKittiesPng from "../images/sample/cryptokitties.png"
import GooncatPng from "../images/sample/goon-cat.png"

const Jumbotron = styled.div`
    border-radius: 20px;
    height: 360px;
    background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 50.71%),
            linear-gradient(336deg, rgba(0,255,0,.8), rgba(0,255,0,0) 80.71%),
            linear-gradient(127deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
            
    display: flex;

    div {
        margin-top: auto;
        margin-bottom: auto;
        padding: 20px;
        font-size: 20px;
        line-height: 22px;

        a {
            color :inherit;
        }

    }

    @media only screen and (max-width: 600px) {
        div {
            font-size: 18px;
            line-height: 18px;
        }

        margin-bottom: 20px;

    }

`

const MaoDaoLogo = styled.img.attrs(() => ({ src: MaoDaoLogoPng }))`
  height: 80px; 
  margin-bottom: 20px;
`

const CryptoKitties = styled.img.attrs(() => ({ src: CryptoKittiesPng }))`
  width: 100%;
`

const MaoDao1 = styled.img.attrs(() => ({ src: MaoDao1Png }))`
height: 100%;
  border-radius: 8px;
`

const MaoDao2 = styled.img.attrs(() => ({ src: MaoDao2Png }))`
    height: 100%;
    border-radius: 8px;
`

const Maow = styled.img.attrs(() => ({ src: MaowJpg }))`
    height: 100%;
    border-radius: 8px;
`

const Maow2 = styled.img.attrs(() => ({ src: Maow2Jpg }))`
    height: 100%;
    border-radius: 8px;
`

const Doodle = styled.img.attrs(() => ({ src: DoodlePng }))`
height: 100%;
    border-radius: 8px;
`

const Gooncat = styled.img.attrs(() => ({ src: GooncatPng }))`
    height: 100%;
    border-radius: 8px;
`

const Item = styled.div`
    
    height: 175px;
    margin: 3px;
    flex: 1;
    
`

const Intro = () => {
    return (
        <Row style={{ marginTop: 10 }}>
            <Col sm="8">
                <Jumbotron>
                    <div>
                        <MaoDaoLogo />
                        <p> 
                            NFT Luckbox is a community-driven NFT lottery project live on Ethereum Mainnet & Polygon chain allows anyone to draw exclusive NFT from various community with fairness and guaranteed output delivery.
                        </p>
                        <hr />
                        <p>Powered by <a href="https://tamago.finance" target="_blank">Tamago Finance</a>, Partner with <a href="https://maonft.com/" target="_blank">MaoDAO</a>.</p>
                    </div>
                </Jumbotron>
            </Col>
            <Col sm="4">
                <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Item>
                            <MaoDao2 />
                        </Item>
                        <Item>
                            <Maow />
                        </Item>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Item>
                            <Maow2 />
                        </Item>

                        <Item>
                            <MaoDao1 />
                        </Item>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Intro