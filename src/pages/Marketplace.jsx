import { useEffect, useMemo } from "react"
import { useGlobalState } from "../store"
import NFTCard from "../components/NFTCard"
import useNFTCollection from "../hooks/useNFTCollection"

const Marketplace = () => {
    const [nfts] = useGlobalState("nfts")
    const [connectedAccount] = useGlobalState("connectedAccount")

    // Filter NFTs for Marketplace (exclude own, exclude blindbox, exclude active auction)
    const marketplaceNFTs = useMemo(() => {
        return nfts.filter(
            (nft) => nft.owner?.toLowerCase() !== connectedAccount?.toLowerCase()
                && !nft.isBlindBox
                && !nft.auction?.started
        )
    }, [nfts, connectedAccount])

    // Use Custom Hook
    const {
        pageItems,
        currentPage,
        setCurrentPage,
        totalPages,
        searchText,
        setSearchText,
        setSortType,
        selectedOwner,
        setSelectedOwner,
    } = useNFTCollection(marketplaceNFTs)

    return (
        <div className="bg-[#151c25] gradient-bg-Marketplace min-h-screen">
            <div className="w-4/5 py-10 mx-auto">

                {/* Header */}
                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    {selectedOwner
                        ? `NFTs owned by ${selectedOwner.slice(0, 6)}...${selectedOwner.slice(-4)}`
                        : pageItems.length > 0
                            ? "Latest Marketplace"
                            : "No Marketplace Yet"}
                </h4>

                {/* Back Button */}
                {selectedOwner && (
                    <button
                        className="mt-4 mb-6 px-4 py-2 rounded-full bg-[#e32970] text-white hover:bg-[#bd255f]"
                        onClick={() => {
                            setSelectedOwner(null)
                            setCurrentPage(1)
                        }}
                    >
                        ← Back
                    </button>
                )}

                {/* Search & Sort */}
                <div className="flex justify-between my-6">
                    <input
                        type="text"
                        placeholder="Search NFT by name..."
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

                {/* NFT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2.5">
                    {pageItems.map((nft, i) => (
                        <NFTCard
                            key={i}
                            nft={nft}
                            onOwnerClick={setSelectedOwner}
                        />
                    ))}
                </div>

                {/* Pagination */}
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

export default Marketplace
