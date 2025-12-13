import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import abi from './abis/TimelessNFT.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const getEtheriumContract = async () => {
  const web3 = window.web3
  const networkId = await web3.eth.net.getId()
  const networkData = abi.networks[networkId]
  if (networkData) {
    const contract = new web3.eth.Contract(abi.abi, networkData.address)
    return contract
  } else {
    return null
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0].toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
      await isWallectConnected()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
    } else {
      setGlobalState('connectedAccount', '')
      reportError('Please connect wallet.')
    }
  } catch (error) {
    reportError(error)
  }
}

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.id),
      tokenId: Number(nft.tokenId),
      owner: nft.owner.toLowerCase(),
      from: nft.from ? nft.from.toLowerCase() : '', // Handle empty or new field
      cost: window.web3.utils.fromWei(nft.cost),
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
      isBlindBox: nft.isBlindBox,
      auction: nft.auction,
      msg: nft.msg
    }))
    .reverse()
}

const getAllNFTs = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')

    const contract = await getEtheriumContract()
    const nfts = await contract.methods.getAllNFTs().call()
    const transactions = await contract.methods.getAllTransactions().call()

    // Fetch extra data: BlindBox status & Auction info
    const refinedNfts = await Promise.all(
      nfts.map(async (nft) => {
        const id = nft.id
        const isBlindBox = await contract.methods.isBlindBox(id).call()
        const auction = await contract.methods.auctions(id).call()
        // Create a mutable copy or modify if allowed. Call returns a result object.
        // Safer to return a new object with normalized fields.
        const normalizedAuction = {
          ...auction,
          seller: auction.seller.toLowerCase(),
          highestBidder: auction.highestBidder.toLowerCase()
        }
        return {
          ...nft,
          isBlindBox,
          auction: normalizedAuction,
        }
      })
    )

    setGlobalState('nfts', structuredNfts(refinedNfts))
    setGlobalState('transactions', structuredNfts(transactions))
  } catch (error) {
    reportError(error)
  }
}

const mintNFT = async ({ title, description, metadataURI, price, isBlindBox }) => {
  try {
    price = window.web3.utils.toWei(price.toString(), 'ether')
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    const mintPrice = window.web3.utils.toWei('0.01', 'ether')

    await contract.methods
      .payToMint(title, description, metadataURI, price, !!isBlindBox)
      .send({ from: account, value: mintPrice })

    return true
  } catch (error) {
    reportError(error)
  }
}

const buyNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    const buyer = getGlobalState('connectedAccount')

    await contract.methods
      .payToBuy(Number(id))
      .send({ from: buyer, value: cost })

    return true
  } catch (error) {
    reportError(error)
  }
}

const updateNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer })
  } catch (error) {
    reportError(error)
  }
}

const transferNFT = async ({ id, to }) => {
  try {
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    await contract.methods.transferNFT(to, Number(id)).send({ from: account })
    return true
  } catch (error) {
    reportError(error)
  }
}

const createAuction = async ({ id, duration, price }) => {
  try {
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    const startPrice = window.web3.utils.toWei(price.toString(), 'ether')

    // Duration in seconds
    await contract.methods.createAuction(Number(id), duration, startPrice).send({ from: account })
    return true
  } catch (error) {
    reportError(error)
  }
}

const bidAuction = async ({ id, price }) => {
  try {
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    const bidPrice = window.web3.utils.toWei(price.toString(), 'ether')

    await contract.methods.bid(Number(id)).send({ from: account, value: bidPrice })
    return true
  } catch (error) {
    reportError(error)
  }
}

const endAuction = async ({ id }) => {
  try {
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    await contract.methods.endAuction(Number(id)).send({ from: account })
    return true
  } catch (error) {
    reportError(error)
  }
}

const revealBlindBox = async ({ id }) => {
  try {
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    await contract.methods.revealBox(Number(id)).send({ from: account })
    return true
  } catch (error) {
    reportError(error)
  }
}

const reportError = (error) => {
  setAlert(JSON.stringify(error), 'red')
}

export {
  getAllNFTs,
  connectWallet,
  mintNFT,
  buyNFT,
  updateNFT,
  transferNFT,
  createAuction,
  bidAuction,
  endAuction,
  revealBlindBox,
  isWallectConnected,
}
