import Identicon from 'react-identicons'
import { FaTimes } from 'react-icons/fa'
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store'
import { buyNFT, transferNFT, createAuction, bidAuction, endAuction, revealBlindBox } from '../Blockchain.Services'
import { useState } from 'react'

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal')
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [nft] = useGlobalState('nft')
  const [transactions] = useGlobalState('transactions')

  const [activeTab, setActiveTab] = useState('details')
  const [transferModal, setTransferModal] = useState(false)
  const [toAddress, setToAddress] = useState('')

  const [auctionDuration, setAuctionDuration] = useState('')
  const [auctionPrice, setAuctionPrice] = useState('')
  const [bidAmount, setBidAmount] = useState('')

  const onChangePrice = () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('updateModal', 'scale-100')
  }

  const handleNFTPurchase = async () => {
    setGlobalState('showModal', 'scale-0')
    setGlobalState('loading', { show: true, msg: 'Initializing purchase...' })
    try {
      await buyNFT(nft)
      setAlert('Purchase completed...', 'green')
      window.location.reload()
    } catch (error) {
      console.log('Error purchasing NFT: ', error)
      setAlert('Purchase failed...', 'red')
    }
  }

  const handleTransfer = async () => {
    setGlobalState('loading', { show: true, msg: 'Transferring NFT...' })
    try {
      await transferNFT({ id: nft.id, to: toAddress })
      setAlert('Transfer successful!', 'green')
      setTransferModal(false)
      window.location.reload()
    } catch (error) {
      console.log(error)
      setAlert('Transfer failed', 'red')
    }
  }

  const handleCreateAuction = async () => {
    setGlobalState('loading', { show: true, msg: 'Creating Auction...' })
    try {
      // Duration expected in seconds by contract. Input might be minutes/hours.
      // Let's assume input is minutes for demo.
      const durationSec = parseInt(auctionDuration) * 60
      await createAuction({ id: nft.id, duration: durationSec, price: auctionPrice })
      setAlert('Auction created!', 'green')
      window.location.reload()
    } catch (error) {
      console.log(error)
      setAlert('Auction creation failed', 'red')
    }
  }

  const handleBid = async () => {
    setGlobalState('loading', { show: true, msg: 'Placing Bid...' })
    try {
      await bidAuction({ id: nft.id, price: bidAmount })
      setAlert('Bid placed!', 'green')
      window.location.reload()
    } catch (error) {
      console.log(error)
      setAlert('Bid failed', 'red')
    }
  }

  const handleEndAuction = async () => {
    setGlobalState('loading', { show: true, msg: 'Ending Auction...' })
    try {
      await endAuction({ id: nft.id })
      setAlert('Auction ended!', 'green')
      window.location.reload()
    } catch (error) {
      console.log(error)
      setAlert('End auction failed', 'red')
    }
  }

  const handleReveal = async () => {
    setGlobalState('loading', { show: true, msg: 'Revealing Mystery Box...' })
    try {
      await revealBlindBox({ id: nft.id })
      setAlert('Revealed!', 'green')
      window.location.reload()
    } catch (error) {
      console.log(error)
      setAlert('Reveal failed', 'red')
    }
  }

  const history = transactions.filter(tx => tx.tokenId === nft?.id)

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform transition-transform duration-300 ${showModal}`}>
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-auto p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-gray-400">NFT Details</p>
          <button type="button" onClick={() => setGlobalState('showModal', 'scale-0')} className="border-0 bg-transparent focus:outline-none">
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <img className={`h-48 w-48 object-cover rounded-xl ${nft?.isBlindBox ? 'blur-md grayscale' : ''}`} src={nft?.isBlindBox ? 'https://images.unsplash.com/photo-1632213702844-1e0615781374' : nft?.metadataURI} alt={nft?.title} />
        </div>

        <div className="flex justify-center space-x-4 mb-4 border-b border-gray-700 pb-2">
          <button className={`text-white ${activeTab === 'details' ? 'border-b-2 border-[#e32970]' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
          <button className={`text-white ${activeTab === 'history' ? 'border-b-2 border-[#e32970]' : ''}`} onClick={() => setActiveTab('history')}>History</button>
        </div>

        {activeTab === 'details' ? (
          <div className="flex flex-col">
            <h4 className="text-white font-semibold text-xl">{nft?.title}</h4>
            <p className="text-gray-400 text-sm my-2">{nft?.description}</p>

            <div className="flex justify-between items-center mt-3 text-white bg-gray-800 p-3 rounded-lg">
              <div>
                <small className="text-xs text-gray-400">Owner</small>
                <p className="text-sm font-bold text-pink-500">{nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}</p>
              </div>
              <div>
                <small className="text-xs text-gray-400">Price</small>
                <p className="text-lg font-bold">{nft?.cost} ETH</p>
              </div>
            </div>

            {/* Auction Info */}
            {nft?.auction?.started && (
              <div className="mt-4 bg-gray-900 p-3 rounded border border-pink-600">
                <p className="text-pink-500 font-bold">Live Auction!</p>
                <p className="text-white text-sm">Highest Bid: {window.web3.utils.fromWei(nft.auction.highestBid || '0')} ETH</p>
                <p className="text-gray-400 text-xs">Ends at: {new Date(nft.auction.endAt * 1000).toLocaleString()}</p>
              </div>
            )}

            {/* Action Buttons */}
            {/* Action Buttons */}
            <div className="mt-5 space-y-3">
              {nft?.auction?.started ? (
                connectedAccount === nft?.auction?.seller ? (
                  // Auction Seller Controls
                  <div className="p-4 bg-gray-800 rounded border border-pink-500">
                    <p className="text-gray-400 text-sm mb-2">You are the seller in this auction.</p>
                    <button className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-500" onClick={handleEndAuction}>End Auction / Finalize</button>
                  </div>
                ) : (
                  // Auction Buyer Controls
                  <div className="flex space-x-2">
                    <input type="number" placeholder="Bid Amount (ETH)" className="flex-1 p-2 rounded bg-gray-800 text-white" onChange={(e) => setBidAmount(e.target.value)} />
                    <button className="bg-indigo-600 px-4 text-white rounded hover:bg-indigo-500" onClick={handleBid}>Place Bid</button>
                  </div>
                )
              ) : (
                connectedAccount === nft?.owner ? (
                  // Normal Owner Controls
                  <>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-[#e32970] text-white py-2 rounded-full hover:bg-[#bd255f]" onClick={onChangePrice}>Change Price</button>
                      <button className="flex-1 border border-[#e32970] text-[#e32970] py-2 rounded-full hover:bg-[#e32970] hover:text-white" onClick={() => setTransferModal(!transferModal)}>Transfer</button>
                    </div>

                    <div className="flex space-x-2 mt-2">
                      <input type="number" placeholder="Min (min)" className="w-1/3 p-2 rounded bg-gray-800 text-white text-sm" onChange={(e) => setAuctionDuration(e.target.value)} />
                      <input type="number" placeholder="Start Price" className="w-1/3 p-2 rounded bg-gray-800 text-white text-sm" onChange={(e) => setAuctionPrice(e.target.value)} />
                      <button className="flex-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500" onClick={handleCreateAuction}>Start Auction</button>
                    </div>

                    {nft?.isBlindBox && (
                      <button className="w-full bg-yellow-600 text-white py-2 rounded mt-2 hover:bg-yellow-500 animate-pulse" onClick={handleReveal}>Reveal Mystery Box!</button>
                    )}

                    {transferModal && (
                      <div className="flex mt-2">
                        <input type="text" placeholder="Recipient Address (0x...)" className="flex-1 p-2 rounded-l bg-gray-700 text-white" onChange={(e) => setToAddress(e.target.value)} />
                        <button className="bg-green-600 px-4 text-white rounded-r" onClick={handleTransfer}>Send</button>
                      </div>
                    )}
                  </>
                ) : (
                  // Normal Buyer Controls
                  <button className="w-full bg-[#e32970] text-white py-2 rounded-full hover:bg-[#bd255f]" onClick={handleNFTPurchase}>Purchase Now</button>
                )
              )}
            </div>

          </div>
        ) : (
          /* History Tab */
          <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
            {history.filter(tx => tx.msg !== 'Transfer').length > 0 ? history.filter(tx => tx.msg !== 'Transfer').map((tx, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs">Event</span>
                  <span className="text-white text-sm font-bold">{tx.msg}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-400 text-xs">Price</span>
                  <span className="text-white text-sm">{tx.cost} ETH</span>
                  <span className="text-gray-500 text-[10px]">{new Date(tx.timestamp * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p className="text-gray-500 text-center">No purchase history available.</p>}
          </div>
        )}

      </div>
    </div>
  )
}

export default ShowNFT
