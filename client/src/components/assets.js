import React, { useContext } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { FactoryContext } from "../hooks/useFactory"
import { shortAddress } from "../helper/index"

const Wrapper = styled.div`
  height: 100vh;
`

const Container = styled.div`
  position: relative;
  width: 60%;
  margin: 0 auto;
  top: 40%;
  display: flex;
  justify-content: center;
`

const BoxContainer = styled.div`
  padding: 16px;
  background-color: #dbbe8d;
  border-radius: 10px;
  border: 3px solid #565049;
  cursor: pointer;
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
      <FactoryDetail>
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
      </FactoryDetail>
    </BoxContainer>
  )
}

const Assets = ({ setLuckBoxSelected }) => {
  const { account, library } = useWeb3React()
  const { allBoxesDetail } = useContext(FactoryContext)

  return (
    <Wrapper>
      <Container>
        {allBoxesDetail
          ? allBoxesDetail.map((data, index) => (
              <Box
                key={index}
                data={data}
                setLuckBoxSelected={setLuckBoxSelected}
              />
            ))
          : null}
      </Container>
    </Wrapper>
  )
}

export default Assets
