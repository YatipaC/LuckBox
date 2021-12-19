import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { Web3ReactProvider } from "@web3-react/core"
import "bootstrap/dist/css/bootstrap.min.css"
import { ethers } from "ethers"
import FactoryContext from "./hooks/useFactoryData"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer , Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Flip}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> 
      </FactoryContext>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
