import styled from "styled-components"

const Wrapper = styled.div`
     
    
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
            <div style={{  textAlign : "center"  }}>
                Copyright © 2021 <a href="https://tamago.finance" target="_blank">Tamago Finance</a>
            </div>
        </Wrapper>
    )
}

export default Footer