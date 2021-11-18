import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    bottom: 5%;
    left: 0px;
    font-size: 24px;
`

const Footer = () => {
    return (
        <Wrapper>
            <div style={{ width : "100vw", textAlign : "center"  }}>
                Made for Chainlink Hackathon Fall 2021
            </div>
        </Wrapper>
    )
}

export default Footer