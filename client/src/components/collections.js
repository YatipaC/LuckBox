import React, { useCallback, useContext, useState, useRef } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Slider from "react-slick";
import { Row, Col } from "reactstrap"
import { FactoryContext } from "../hooks/useFactoryData"
import { shortAddress } from "../helper/index"
import { LeftArrow, RightArrow, Arrow } from "./Base"

const SliderContainer = styled.div`
  width: 800px; 
  
  @media only screen and (max-width: 1024px) {
    width: 600px; 
  }

  @media only screen and (max-width: 600px) {
    width: 300px; 
  }

`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: white;
  color: black;
  border-radius: 10px;
  border: 3px solid #565049;
  cursor: pointer;
  width: 175px;
  word-wrap: break-word;
  font-size: 24px;
  line-height: 30px;
  overflow: hidden;
  min-height: 100px;
  display: flex;
  text-align: center;

  :hover {
    background-color: #3c3949;
    color: white;
  }

  margin-left: auto;
  margin-right: auto;
`

const Body = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`


const Box = ({ data, setLuckBoxSelected }) => {
    return (
        <BoxContainer onClick={() => setLuckBoxSelected(data)}>
            <div style={{ margin: "auto" }}>{data && data.symbol}</div>
        </BoxContainer>
    )
}

const Switcher = styled(
    ({ className }) => {

        const { currentNetwork, updateNetwork } = useContext(FactoryContext)

        return (
            <div className={className}>
                <h4>
                    <a className={ currentNetwork === "mainnet" && "selected" } onClick={() => updateNetwork("mainnet")}>Mainnet</a>
                    {` `}|{` `}
                    <a className={ currentNetwork === "polygon" && "selected" } onClick={() => updateNetwork("polygon")}>Polygon</a>
                </h4>
            </div>
        )
    }
)`

text-align: center;
padding: 0px;

a {
    cursor: pointer;
    color: inherit;
}

.selected {
    text-decoration: underline;
}

`


const Collections = ({ setLuckBoxSelected, toggleCreateLuckBox }) => {

    let sliderRef = useRef();
    const { account, library } = useWeb3React()
    const { allBoxesDetail } = useContext(FactoryContext)

    const [counter, setCounter] = useState(0)

    const boxes = allBoxesDetail

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const onPrev = () => {
        sliderRef.slickPrev();
    }

    const onNext = () => {
        sliderRef.slickNext();
    }


    return (
        <Row style={{ marginTop: 10 }}>
            <Col xs="12">
                <h2>Collections</h2>
                <Switcher />
                <Body>
                    {allBoxesDetail && (
                        <>
                            <SliderContainer>
                                <Slider ref={ref => (sliderRef = ref)} {...settings}>
                                    {boxes.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <Box
                                                    data={item}
                                                    setLuckBoxSelected={setLuckBoxSelected}
                                                />
                                            </div>
                                        )
                                    })}
                                </Slider>
                            </SliderContainer>
                        </>
                    )}

                    {!allBoxesDetail && (
                        <div style={{ fontSize: "30px" }}>Loading...</div>
                    )}
                </Body>
            </Col>
        </Row>
    )
}



export default Collections