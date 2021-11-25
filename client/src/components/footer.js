import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    bottom: 5%;
    left: 0px;
    font-size: 24px;

    @media only screen and (max-width: 600px) {
        font-size: 20px;
    }

`

const Footer = () => {
    return (
        <Wrapper>
            <div style={{ width : "100vw", textAlign : "center"  }}>
                Made during Chainlink Hackathon Fall 2021
            </div>
        </Wrapper>
    )
}

export default Footer