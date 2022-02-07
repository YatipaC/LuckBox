import React, { useCallback, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Row, Col } from "reactstrap"
import useInterval from "../hooks/useInterval"
import MaoDaoLogoPng from "../images/maodao-logo.png"
import MaoDao1Png from "../images/sample/maodao-1.png"
import MaoDao2Png from "../images/sample/maodao--2.png"
import MaowJpg from "../images/sample/maow.jpg"
import Maow2Jpg from "../images/sample/maow-2.jpg"
import DoodlePng from "../images/sample/doodle.png"
import Doodle2Png from "../images/sample/doodle-2.png"
import GooncatPng from "../images/sample/goon-cat.png"
import AngbaoJpg from "../images/sample/angbao-1.jpg"
import Angbao2Png from "../images/sample/angbao-2.png"
import Coolcat2Png from "../images/sample/coolcat-2.png"
import Coolcat3Png from "../images/sample/coolcat-3.png"
import Coolcat4Png from "../images/sample/coolcat-4.png"
import CoolcatPng from "../images/sample/coolcat.png"
import CryptoSharkPng from "../images/sample/cryptoshark-1.png"
import CryptoShark2Png from "../images/sample/cryptoshark-2.png"
import BoredPng from "../images/sample/bored.png"
import KarmaPng from "../images/sample/karma.png"

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

const Doodle2 = styled.img.attrs(() => ({ src: Doodle2Png }))`
    height: 100%;
    border-radius: 8px;
`

const Gooncat = styled.img.attrs(() => ({ src: GooncatPng }))`
    height: 100%;
    border-radius: 8px;
`

const Angbao = styled.img.attrs(() => ({ src: AngbaoJpg }))`
    height: 100%;
    border-radius: 8px;
`

const Angbao2 = styled.img.attrs(() => ({ src: Angbao2Png }))`
    height: 100%;
    border-radius: 8px;
`

const Coolcat = styled.img.attrs(() => ({ src: Coolcat2Png }))`
    height: 100%;
    border-radius: 8px;
`

const Coolcat2 = styled.img.attrs(() => ({ src: CoolcatPng }))`
    height: 100%;
    border-radius: 8px;
`

const Coolcat3 = styled.img.attrs(() => ({ src: Coolcat3Png }))`
    height: 100%;
    border-radius: 8px;
`

const Coolcat4 = styled.img.attrs(() => ({ src: Coolcat4Png }))`
    height: 100%;
    border-radius: 8px;
`

const CryptoShark = styled.img.attrs(() => ({ src: CryptoSharkPng }))`
    height: 100%;
    border-radius: 8px;
`

const CryptoShark2 = styled.img.attrs(() => ({ src: CryptoShark2Png }))`
    height: 100%;
    border-radius: 8px;
`

const Bored = styled.img.attrs(() => ({ src: BoredPng }))`
    height: 100%;
    border-radius: 8px;
`

const Karma = styled.img.attrs(() => ({ src: KarmaPng }))`
    height: 100%;
    border-radius: 8px;
`

const Item = styled.div`
    
    height: 175px;
    margin: 3px;
    flex: 1;
    
`

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const Intro = () => {

    const Samples = [
        MaoDao1,
        MaoDao2,
        Maow,
        Maow2,
        Doodle,
        Doodle2,
        Gooncat,
        Angbao,
        Angbao2,
        Coolcat,
        Coolcat2,
        Coolcat3,
        Coolcat4,
        CryptoShark,
        CryptoShark2,
        Bored,
        Karma
    ]

    const [shuffleIndex, setShuffleIndex] = useState(0) // 0, 1, 2, 3
    const [shuffleList, setShuffleList] = useState([])
    const [Img1, setImg1 ] = useState(Samples[Math.floor(Math.random() * Samples.length)])
    const [Img2, setImg2 ] = useState(Samples[Math.floor(Math.random() * Samples.length)])
    const [Img3, setImg3 ] = useState(Samples[Math.floor(Math.random() * Samples.length)])
    const [Img4, setImg4 ] = useState(Samples[Math.floor(Math.random() * Samples.length)])

    useInterval(() => {

        let newIndex = shuffleIndex + 1

        if (newIndex > 3) {
            newIndex = 0
        }

        setShuffleIndex(newIndex)

        if (shuffleList.length === 0) {
            setShuffleList(shuffle(Samples))
        }

    }, 1000)

    useEffect(() => {

        if (shuffleList.length > 0) {
            const data = shuffleList.pop()
            
            switch (shuffleIndex) {
                case 1:
                    setImg2(data)
                    break;
                case 2:
                    setImg3(data)
                    break;
                case 3:
                    setImg4(data)
                    break;
                default:
                    setImg1(data) 
            }

                
        }

    }, [shuffleIndex, shuffleList])

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
                            <Img1 />
                        </Item>
                        <Item>
                            <Img2 /> 
                        </Item>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Item>
                            <Img3 />
                        </Item>

                        <Item>
                          <Img4 /> 
                        </Item>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default Intro