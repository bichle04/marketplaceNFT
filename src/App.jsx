import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { getAllNFTs, isWallectConnected } from './Blockchain.Services'

import Alert from './components/Alert'
import Artworks from './components/Artworks'
import CreateNFT from './components/CreateNFT'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Loading from './components/Loading'
import ShowNFT from './components/ShowNFT'
import Transactions from './components/Transactions'
import UpdateNFT from './components/UpdateNFT'

import Marketplace from './pages/Marketplace'
import Profiles from './pages/Profiles'
import MysteryBox from './pages/MysteryBox'
import AuctionPage from './pages/AuctionPage'


const App = () => {
  useEffect(() => {
    const loadData = async () => {
      await isWallectConnected()
      await getAllNFTs()
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0f13]">
      <div className="gradient-bg-hero">
        <Header />
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Artworks />
              <Transactions />
            </>
          }
        />

        <Route path="/market" element={<Marketplace />} />
        <Route path="/auctions" element={<AuctionPage />} />
        <Route path="/profile" element={<Profiles />} />
        <Route path="/mystery-box" element={<MysteryBox />} />
      </Routes>

      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
      <Footer />
      <Alert />
      <Loading />
    </div>
  )
}

export default App
