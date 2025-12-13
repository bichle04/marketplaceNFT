import { useMemo } from "react"
import { useGlobalState } from "../store"
import NFTCard from "../components/NFTCard"
import useNFTCollection from "../hooks/useNFTCollection"

const AuctionPage = () => {
    const [nfts] = useGlobalState("nfts")

    // Filter Active Auctions
    const auctionNFTs = useMemo(() => {
        return nfts.filter(nft => nft.auction?.started === true)
    }, [nfts])

    // Use Custom Hook
    const {
        pageItems,
        currentPage,
        setCurrentPage,
        totalPages,
        searchText,
        setSearchText,
        setSortType,
    } = useNFTCollection(auctionNFTs)

    return (
        <div className="bg-[#151c25] gradient-bg-Marketplace min-h-screen">
            <div className="w-4/5 py-10 mx-auto">

                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    Live Auctions
                </h4>
                <p className="text-gray-400 mt-2">Bid on exclusive items!</p>

                {/* SEARCH + SORT */}
                <div className="flex justify-between my-6">
                    <input
                        type="text"
                        placeholder="Search auctions..."
                        className="bg-gray-800 text-white px-4 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    <select
                        onChange={(e) => {
                            setSortType(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                    >
                        <option value="none">Sort by price</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

                {/* LIST NFT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2.5">
                    {pageItems.length > 0 ? (
                        pageItems.map((nft, i) => (
                            <NFTCard
                                key={i}
                                nft={nft}
                                isAuction={true}
                                actionButtonText="Place Bid"
                            />
                        ))
                    ) : (
                        <p className="text-white mt-5">No auctions currently active.</p>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            className="px-3 py-1 rounded bg-[#e32970] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            ← Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 rounded transition-colors ${currentPage === index + 1
                                    ? "bg-white text-black font-bold"
                                    : "bg-[#e32970] text-white hover:bg-[#bd255f]"
                                    }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="px-3 py-1 rounded bg-[#e32970] text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AuctionPage
