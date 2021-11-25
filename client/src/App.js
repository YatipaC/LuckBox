import styled, { createGlobalStyle } from "styled-components"

import bg from "./images/background.png"
import Footer from "./components/footer"
import Header from "./components/header"
import Assets from "./components/assets"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'VT323', monospace;
    color: white;
    background-image: url(${bg});
    /* Full height */
    height: 100vh;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
`

const Wrapper = styled.div``

function App() {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header />
        <Assets />
        <Footer />
      </Wrapper>
    </>
  )
}

export default App
