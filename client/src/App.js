import styled, { createGlobalStyle } from 'styled-components'

import bg from './images/background.png'
import Footer from "./components/footer"

const GlobalStyle = createGlobalStyle`
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
`;

const Wrapper = styled.div`
   
`


function App() {
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Footer />
      </Wrapper>
    </>
  );
}

export default App;
