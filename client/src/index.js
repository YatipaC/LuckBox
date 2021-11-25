import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { Web3ReactProvider } from "@web3-react/core"
import "bootstrap/dist/css/bootstrap.min.css"
import { ethers } from "ethers"
import FactoryContext from "./hooks/useFactory"

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <FactoryContext>
        <App />
      </FactoryContext>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
