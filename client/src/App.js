import { useState } from "react"
import bg from "./images/background.png"
import Account from "./components/account"
import Assets from "./components/assets"
import styled, { createGlobalStyle } from "styled-components"
import ParticlesBg from "particles-bg"
// import bg from './images/background.png'
import Footer from "./components/footer"
import Title from "./components/title"
import Draw from "./components/draw"
import Info from "./components/info"
import CreateLuckBoxModal from "./components/modals/CreateLuckBoxModal"
import Manage from "./components/manage"

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
  const [luckBoxSelected, setLuckBoxSelected] = useState()
  const [createLuckBoxVisible, setCreateLuckBoxVisible] = useState(false)
  const [manageSelected, setManageSelected] = useState(false)

  const toggleCreateLuckBox = () =>
    setCreateLuckBoxVisible(!createLuckBoxVisible)

  const toggleManageSelected = () => {
    setManageSelected(!manageSelected)
  }

  return (
    <>
      <GlobalStyle />
      <ParticlesBg type='square' bg={true} />
      <Wrapper>
        <Account />
        <CreateLuckBoxModal
          toggleModal={toggleCreateLuckBox}
          modalVisible={createLuckBoxVisible}
        />
        {luckBoxSelected ? (
          <>
            {manageSelected ? (
              <Manage
                data={luckBoxSelected}
                toggleManageSelected={toggleManageSelected}
              />
            ) : (
              <Draw
                data={luckBoxSelected}
                setLuckBoxSelected={setLuckBoxSelected}
                toggleManageSelected={toggleManageSelected}
              />
            )}
          </>
        ) : (
          <>
            <Title />
            <Assets
              toggleCreateLuckBox={toggleCreateLuckBox}
              setLuckBoxSelected={setLuckBoxSelected}
            />
            <Info />

            <Footer />
          </>
        )}
      </Wrapper>
    </>
  )
}

export default App
