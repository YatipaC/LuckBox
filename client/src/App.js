import { useState } from "react"
import bg from "./images/background.png"
import Account from "./components/account"
import Assets from "./components/assets"
import styled, { createGlobalStyle } from "styled-components"

import { Container } from "reactstrap"

// import bg from './images/background.png'
import Footer from "./components/footer"
import Title from "./components/title"
import Draw from "./components/draw"
import Info from "./components/info"
import CreateLuckBoxModal from "./components/modals/CreateLuckBoxModal"
import Manage from "./components/manage"
import Intro from "./components/intro"
import Collections from "./components/collections"

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'VT323', monospace;
    color: white;
    background-color: #0b081b;
    
    /* Full height */
    height: 100vh;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
`


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

      <Container>
        <Account setLuckBoxSelected={setLuckBoxSelected} />

        {luckBoxSelected
          ?
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
          :
          <>
            <Intro />
            <Collections
              toggleCreateLuckBox={toggleCreateLuckBox}
              setLuckBoxSelected={setLuckBoxSelected}
            />

          </>
        }
        <Info />
        <Footer />
      </Container>

      {/* <Wrapper>
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
      </Wrapper> */}
    </>
  )
}

export default App
