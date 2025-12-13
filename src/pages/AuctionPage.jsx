import { useEffect, useState } from "react"
import { setGlobalState, useGlobalState } from "../store"
import { Card } from "./Marketplace" // Reuse Card or create new? Reuse for consistency.

const AuctionPage = () => {
    const [nfts] = useGlobalState("nfts")
    const [connectedAccount] = useGlobalState("connectedAccount")

    const ITEMS_PER_PAGE = 12
    const [currentPage, setCurrentPage] = useState(1)
    const [sortType, setSortType] = useState("none")
    const [searchText, setSearchText] = useState("")
    const [collection, setCollection] = useState([])

    // DATA FILTERING
    const getFilteredNFTs = () => {
        // Only show items where auction.started is true
        // And maybe filter out own auctions? User said "người khác có thể vào đây mà đấu giá". 
        // Usually you can see your own auction but can't bid. Let's show all active auctions.
        let data = nfts.filter(nft => nft.auction?.started === true)

        // Search
        if (searchText.trim() !== "") {
            data = data.filter(nft =>
                nft.title.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Sort
        if (sortType === "asc")
            data = [...data].sort((a, b) => Number(a.cost) - Number(b.cost)) // Base cost or current bid? keep simple cost for now

        if (sortType === "desc")
            data = [...data].sort((a, b) => Number(b.cost) - Number(a.cost))

        return data
    }

    useEffect(() => {
        const data = getFilteredNFTs()
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE
        setCollection(data.slice(start, end))
    }, [nfts, currentPage, sortType, searchText, connectedAccount])

    const totalItems = getFilteredNFTs().length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    return (
        <div className="bg-[#151c25] gradient-bg-Marketplace min-h-screen">
            <div className="w-4/5 py-10 mx-auto">

                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    Live Auctions
                </h4>
                <p className="text-gray-400 mt-2">Bid on exclusive items!</p>

                {/* SEARCH + SORT */}
                <div className="flex justify-between my-6">
                    {/* SEARCH BAR */}
                    <input
                        type="text"
                        placeholder="Search auctions..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    {/* SORT */}
                    <select
                        onChange={(e) => {
                            setSortType(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none border border-gray-700 focus:border-pink-500"
                    >
                        <option value="none">Sort by price</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

                {/* LIST NFT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2.5">
                    {collection.length > 0 ? (
                        collection.map((nft, i) => (
                            <Card key={i} nft={nft} setSelectedOwner={() => { }} />
                        ))
                    ) : (
                        <p className="text-white mt-5">No auctions currently active.</p>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            className="px-3 py-1 rounded bg-[#e32970] text-white disabled:opacity-40"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            ← Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 rounded ${currentPage === index + 1
                                    ? "bg-white text-black"
                                    : "bg-[#e32970] text-white"
                                    }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="px-3 py-1 rounded bg-[#e32970] text-white disabled:opacity-40"
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
