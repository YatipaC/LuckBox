import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    top: 10%;
    left: 0px;
    font-size: 24px;

    h1 {
        letter-spacing: 10px;
        font-size: 80px;
        padding: 0px;
        margin: 0px;
    }

    p {
        padding: 0px;
        margin: 0px;
        margin-top: 10px;
    }

    @media only screen and (max-width: 600px) {
        font-size: 20px;

        h1 {
            font-size: 60px;
        }

    }

`

const Title = () => {
    return (
        <Wrapper>
            <div style={{ width : "100vw", textAlign : "center"  }}>
                <h1>LUCKBOX</h1>
                <p>
                    NFT Gachapon powered by Chainlink VRF
                </p>
            </div>
        </Wrapper>
    )
}

export default Title