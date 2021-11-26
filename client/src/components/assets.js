import React, { useCallback, useContext, useState } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../hooks/useFactory"
import { shortAddress } from "../helper/index"
import { LeftArrow, RightArrow, Arrow } from "./Base"

const Wrapper = styled.div`
  height: 100vh;
`

const Container = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 35%;
  display: flex;
  justify-content: center; 
`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: #008080;
  color: white;
  border-radius: 10px;
  border: 3px solid #565049;
  cursor: pointer;
  width: 175px;
  word-wrap: break-word;
  font-size: 24px;
  line-height: 30px;
  overflow: hidden;
  min-height: 100px;

  :hover {
    opacity: 0.9;
  }
  
  margin-left: 10px;
  margin-right: 10px;


`

const FactoryDetail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 8px;
`

const Header = styled.div`
  margin-right: 8px;
  font-weight: bold;
`

const Detail = styled.div``

const Box = ({ data, setLuckBoxSelected }) => {

  return (
    <BoxContainer onClick={() => setLuckBoxSelected(data)}>
      <div style={{ textAlign: "center" }}>
        {data && data.symbol}
      </div>
      {/* <FactoryDetail>
        <Header>Contract Address</Header>
        <Detail>{shortAddress(data.boxAddress)}</Detail>
      </FactoryDetail>
      <FactoryDetail>
        <Header>Name</Header>
        <Detail>{data.name}</Detail>
      </FactoryDetail>
      <FactoryDetail>
        <Header>Owner</Header>
        <Detail>{shortAddress(data.owner)}</Detail>
      </FactoryDetail>
      <FactoryDetail>
        <Header>Ticket Price</Header>
        <Detail>{data.ticketPrice} Matic</Detail>
      </FactoryDetail> */}
    </BoxContainer>
  )
}

const CreateNewBox = () => {
  return (
    <BoxContainer onClick={() => alert("Stay Tuned!")}>
      <div style={{ textAlign: "center" }}>
        Create New LuckBox
      </div>

    </BoxContainer>
  )
}

const Assets = ({ setLuckBoxSelected }) => {
  const { account, library } = useWeb3React()
  const { allBoxesDetail } = useContext(FactoryContext)

  const [counter, setCounter] = useState(0)

  const boxes = allBoxesDetail

  const onPrev = useCallback(() => {
    if (counter !== 0) {
      setCounter(counter - 1)
    }
  }, [counter])

  const onNext = useCallback(() => {
    if (counter !== (boxes.length)) {
      setCounter(counter + 1)
    }
  }, [counter, boxes])


  return (
    <Wrapper>
      <Container>
        {allBoxesDetail
          ?
          (
            <>
              <LeftArrow onClick={onPrev} />
              {boxes[counter] &&
                (
                  <Box
                    data={boxes[counter]}
                    setLuckBoxSelected={setLuckBoxSelected}
                  />
                )

              }

              {counter === boxes.length &&
                (
                  <CreateNewBox />
                )

              }

              <RightArrow onClick={onNext} />

            </>
          )
          : null}
        {!allBoxesDetail &&
          <div style={{ fontSize: "30px", marginTop: "15px" }}>
            Loading...
          </div>

        }
      </Container>
    </Wrapper>
  )
}

export default Assets
