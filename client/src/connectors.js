import { InjectedConnector } from "@web3-react/injected-connector"
import { UAuthConnector } from "@uauth/web3-react"
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"

import MetamaskLogo from "./images/wallet-provider/metamask.png"
import WalletConnectLogo from "./images/wallet-provider/wallet-connect.svg"
// import TorusLogo from './images/wallet-provider/torus.png'
// import PortisLogo from './images/wallet-provider/portis.png'
import CoinbaseLogo from "./images/wallet-provider/coinbase.svg"
import ImTokenLogo from "./images/wallet-provider/imToken.jpeg"
import UnstopableDomainLogo from "./images/wallet-provider/unstopable.jpeg"

import { POLYGON_RPC_SERVER, MAINNET_RPC_SERVER } from "./constants"

const RPC = {
  1: MAINNET_RPC_SERVER,
  42: "https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER",
  137: POLYGON_RPC_SERVER,
  80001: "https://rpc-mumbai.matic.today",
}

const supportedChainIds = [1, 137]

export const injected = new InjectedConnector({ supportedChainIds })

export const walletconnect = new WalletConnectConnector({
  rpc: RPC,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
})

export const uauth = new UAuthConnector({
  clientID: "ItpQh1IrZ8BLztae0KGsl4AvYCQVBpSgXdHS1po9VD8=",
  clientSecret: "xQxSSxj1lYX1D3dLad+Fam8pcVuU1WHeZRNVylPCJsY=",
  redirectUri: "https://app.tamago.finance/",
  postLogoutRedirectUri: "https://app.tamago.finance/",
  // Scope must include openid and wallet
  scope: 'openid wallet',

  // Injected and walletconnect connectors are required.
  connectors: {injected, walletconnect},
})

// mainnet only
// export const torus = new TorusConnector({
// 	chainId: 1,
// })

// mainnet only
// export const portis = new PortisConnector({
// 	dAppId: '',
// 	networks: [1],
// })

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC[1],
  appName: "Tamago Finance",
  // appLogoUrl: TamagoLogo,
})

export const Connectors = [
  {
    name: "MetaMask",
    connector: injected,
    img: MetamaskLogo,
  },
  {
    name: "imToken",
    connector: walletconnect,
    img: ImTokenLogo,
  },
  {
    name: "WalletConnect",
    connector: walletconnect,
    img: WalletConnectLogo,
  },
  // {
  // 	name: 'Portis',
  // 	connector: portis,
  // 	img: PortisLogo
  // },
  // {
  // 	name: 'Torus',
  // 	connector: torus,
  // 	img: TorusLogo
  // },
  {
    name: "Wallet Link",
    connector: walletlink,
    img: CoinbaseLogo,
  },
  {
    name: "Unstoppable Domain",
    connector: uauth,
    img: UnstopableDomainLogo
  }
]
