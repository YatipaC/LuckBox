# LuckBox

> NFT Gachapon powered by Chainlink VRF

![Screenshot from 2021-11-26 13-18-06](https://user-images.githubusercontent.com/18402217/143536004-388059ee-f87f-4f94-919b-b0a656b26211.png)

## Introduction

Normally, the only way for NFT artists and projects to distribute their NFT is listing on the NFT exchange likes OpenSea, many of them are struggle because of many reason, we're making the Gashapon-liked smart contract to help distributing along with generating some revenues at the same time.

The Gashapon which is vending machine that dispense capsules of toys. These vending machines appear almost at every corner in Japan's streets. People love the excitement to open a box that is full of hope and imagination with infinite possibility. People buy special NFT with lower price. There really is something for everyone, no matter your age, gender or interests. In terms of NFT owners and creaters, they don’t find the right buyers for the right NFT. The boxes consisting of unique/ the hottest NFT will

## Live
https://luckbox.wtf

## Technologies

* Polygon chain - L2 chain, cheaper gas price and faster than Ethereum Mainnet
* Chainlink VRF - A random number generator solution from Chainlink
* Alchemy Ethereum API - Providng RPC calls from the frontend without the need of web3 wallet connection.

## Features

* Enabling creation of Gachapon-styled for NFT
* Earn drawing fees in $MATIC
* Support of ERC-721 NFT
* Customizable winning chance per NFT from 0.1% to 10%
* Allows maximum 9 NFTs per Gachapon contract

## Install

This project comprises of 2 modules, the smart contracts and the frontend, before going a bit deeeper once this repo has been downloaded locally you can install all dependencies by run

```
yarn
```

### Solidity contracts

To test it, make sure you have Hardhat in your machine then run

```
cd contracts
npx hardhat test
```

To deploy it to the network, we're suggesting to use just Remix and we have a flatten version reside on /deployment folder, checkout the Medium article for more details.

### Frontend Dapp

This made by react-create-app that compatible to most modern browsers, to run it locally just run

```
cd client
yarn start
```

## Deployment

### Polygon Mainnet

Contract Name | Contract Address 
--- | --- 
Factory | 0x43A1fFFB15c35e6D4B7A712CFBb2Ef8A3FCFb46C 
Luckbox (CryptoSharks) | 0xe26a890C309b60B76A1369F42887820aE2e0C6cD
Luckbox (Chicken Derby) | 0x2b1648A576Ba7547a27D24FDf948D6319a17Eef4

## Links

* https://medium.com/@pisuthd/chainlink-hackathon-fall-2021-nft-luckbox-live-now-on-polygon-390d72a57575

## License

MIT ©
