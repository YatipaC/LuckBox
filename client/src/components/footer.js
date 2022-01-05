import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    bottom: 5%;
    left: 0px;
    font-size: 24px;

    @media only screen and (max-width: 600px) {
        font-size: 20px;
    }

    a {
        color: inherit;
        text-decoration: initial;

        :hover {
            text-decoration: underline;
        }

    }


`

const Footer = () => {
    return (
        <Wrapper>
            <div style={{ width : "100vw", textAlign : "center"  }}>
                Copyright © 2021 <a href="https://tamago.finance" target="_blank">Tamago Finance</a>
            </div>
        </Wrapper>
    )
}

export default Footer