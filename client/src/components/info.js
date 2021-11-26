import React, { useCallback, useContext, useState } from "react"
import styled from "styled-components"

const Wrapper = styled.div`
    position: absolute;
    top: 55%;
    left: 0px;
    width: 100vw; 
    display: flex;
    justify-content: center;

    a {
        color: inherit;
    }

    p {
        margin-top: 5px;
    }

`

const Box = styled.div`
    background-color: #008080;
    color: white; 
    border: 2px solid #565049;
    text-align: center;
    padding: 20px;
    max-width: 600px;
    
    font-size: 20px;
    line-height: 22px; 

    @media only screen and (max-width: 600px) {
        margin-left: 20px;
        margin-right: 20px;

    }

`

const Info = () => {
    return (
        <Wrapper>

            <Box>
                Try your luck with the prize of well-known NFTs available on Polygon Mainnet in a permissionless manner, secure and extremely fair for anyone who dare to bet.
                <p>
                    <a href="#" target="_blank">Medium Post</a>|
                    <a href="#" target="_blank">Twitter</a>|
                    <a href="#" target="_blank">Telegram</a>
                </p>

            </Box>

        </Wrapper>
    )
}

export default Info