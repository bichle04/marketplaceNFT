import Hero from '../components/Hero'
import { Link } from 'react-router-dom'
import { BiRocket, BiGift } from 'react-icons/bi'
import { RiAuctionFill } from 'react-icons/ri'

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* SECTION 1: HERO (Reusing existing Hero for continuity) */}
            <Hero />

            {/* SECTION 2: FEATURES */}
            <div className="w-full bg-[#0f1115] py-16">
                <div className="w-4/5 mx-auto">
                    <h2 className="text-4xl text-white font-bold text-center mb-12">
                        Premier NFT Marketplace
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-[#151c25] p-6 rounded-xl border border-gray-800 hover:border-pink-500 transition-all shadow-lg text-center group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                                <BiRocket className="text-3xl text-white" />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-3">Seamless Trading</h3>
                            <p className="text-gray-400">
                                Buy, sell, and trade NFTs instantly with our secure smart contracts.
                                Low fees and high speed guaranteed.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-[#151c25] p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all shadow-lg text-center group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <BiGift className="text-3xl text-white" />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-3">Mystery Boxes</h3>
                            <p className="text-gray-400">
                                Experience the thrill of the unknown. Buy Mystery Boxes and reveal
                                rare and legendary digital assets.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-[#151c25] p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all shadow-lg text-center group hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                                <RiAuctionFill className="text-3xl text-white" />
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-3">Live Auctions</h3>
                            <p className="text-gray-400">
                                Participate in real-time auctions. Place your bids and win exclusive
                                NFTs from top creators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: HOW IT WORKS */}
            <div className="w-full gradient-bg-artworks py-20 text-white">
                <div className="w-4/5 mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                        {/* Step 1 */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
                                01
                            </div>
                            <h4 className="text-xl font-bold mb-2">Connect Wallet</h4>
                            <p className="text-gray-300">Link your Metamask wallet to get started securely.</p>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden md:block w-24 h-1 bg-gray-700"></div>

                        {/* Step 2 */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
                                02
                            </div>
                            <h4 className="text-xl font-bold mb-2">Browse & Collect</h4>
                            <p className="text-gray-300">Explore specific markets, join auctions, or unbox mysteries.</p>
                        </div>

                        {/* Divider Line */}
                        <div className="hidden md:block w-24 h-1 bg-gray-700"></div>

                        {/* Step 3 */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4">
                                03
                            </div>
                            <h4 className="text-xl font-bold mb-2">Trade & Earn</h4>
                            <p className="text-gray-300">Resell your collection or create your own NFTs to earn ETH.</p>
                        </div>

                    </div>

                    <div className="text-center mt-16">
                        <Link to="/market">
                            <button className="bg-[#e32970] hover:bg-[#bd255f] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-500/40 transition-transform hover:scale-105">
                                Start Exploring Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home
