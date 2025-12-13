import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { getAllNFTs, isWallectConnected } from './Blockchain.Services'
import Header from './components/Header'
import Footer from './components/Footer'
import Alert from './components/Alert'
import Loading from './components/Loading'
import CreateNFT from './components/CreateNFT'
import ShowNFT from './components/ShowNFT'
import UpdateNFT from './components/UpdateNFT'
import Marketplace from './pages/Marketplace'
import Profiles from './pages/Profiles'
import MysteryBox from './pages/MysteryBox'
import AuctionPage from './pages/AuctionPage'
import Home from './pages/Home'

const App = () => {
  useEffect(() => {
    const loadData = async () => {
      await isWallectConnected()
      await getAllNFTs()
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0f13] flex flex-col">
      <div className="gradient-bg-hero">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Marketplace />} />
          <Route path="/auctions" element={<AuctionPage />} />
          <Route path="/profile" element={<Profiles />} />
          <Route path="/mystery-box" element={<MysteryBox />} />
        </Routes>
      </div>

      <Footer />

      <Alert />
      <Loading />
      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
    </div>
  )
}

export default App
