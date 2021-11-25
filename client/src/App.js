<<<<<<< HEAD
import styled, { createGlobalStyle } from "styled-components"

import bg from "./images/background.png"
import Footer from "./components/footer"
import Header from "./components/header"
import Assets from "./components/assets"
=======
import styled, { createGlobalStyle } from 'styled-components'
import ParticlesBg from "particles-bg";
// import bg from './images/background.png'
import Footer from "./components/footer"
import Title from "./components/title"
>>>>>>> 6d401e710322117410681a8536f5a8c4bb8ead81

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'VT323', monospace;
    color: #231F20;
    
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
      <ParticlesBg type="square" bg={true} />
      <Wrapper>
        <Header />
        <Assets />
        <Title/>
        <Footer />
      </Wrapper> 
    </>
  )
}

export default App
