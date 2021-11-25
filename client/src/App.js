import bg from "./images/background.png"
import Header from "./components/header"
import Assets from "./components/assets"
import styled, { createGlobalStyle } from 'styled-components'
import ParticlesBg from "particles-bg";
// import bg from './images/background.png'
import Footer from "./components/footer"
import Title from "./components/title"

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
