import { useEffect, useState } from "react"
import { setGlobalState, useGlobalState } from "../store"

const Marketplace = () => {
    const [nfts] = useGlobalState("nfts")
    const [connectedAccount] = useGlobalState("connectedAccount")

    const ITEMS_PER_PAGE = 12
    const [currentPage, setCurrentPage] = useState(1)
    const [sortType, setSortType] = useState("none")
    const [selectedOwner, setSelectedOwner] = useState(null)

    // ⭐ SEARCH STATE
    const [searchText, setSearchText] = useState("")

    const [collection, setCollection] = useState([])

    // ===== GET DATA CHO MARKETPLACE HOẶC OWNER =====
    const getFilteredNFTs = () => {
        let data = nfts.filter(
            (nft) => nft.owner?.toLowerCase() !== connectedAccount?.toLowerCase() && !nft.isBlindBox
        )

        // Lọc theo owner khi bấm vào owner
        if (selectedOwner) {
            data = data.filter(
                (nft) => nft.owner?.toLowerCase() === selectedOwner.toLowerCase()
            )
        }

        // ⭐ Lọc theo tên NFT
        if (searchText.trim() !== "") {
            data = data.filter(nft =>
                nft.title.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Sort theo giá
        if (sortType === "asc")
            data = [...data].sort((a, b) => Number(a.cost) - Number(b.cost))

        if (sortType === "desc")
            data = [...data].sort((a, b) => Number(b.cost) - Number(a.cost))

        return data
    }

    // ===== UPDATE COLLECTION THEO TRANG =====
    useEffect(() => {
        const data = getFilteredNFTs()
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE
        setCollection(data.slice(start, end))
    }, [nfts, currentPage, sortType, selectedOwner, searchText, connectedAccount])

    const totalItems = getFilteredNFTs().length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    return (
        <div className="bg-[#151c25] gradient-bg-Marketplace">
            <div className="w-4/5 py-10 mx-auto">

                {/* Tiêu đề */}
                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    {selectedOwner
                        ? `NFTs owned by ${selectedOwner.slice(0, 6)}...${selectedOwner.slice(-4)}`
                        : collection.length > 0
                            ? "Latest Marketplace"
                            : "No Marketplace Yet"}
                </h4>

                {/* Back */}
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

                {/* ⭐ SEARCH + SORT */}
                <div className="flex justify-between my-3">

                    {/* SEARCH BAR */}
                    <input
                        type="text"
                        placeholder="Search NFT by name..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none"
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
                        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
                    >
                        <option value="none">Sort by price</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

                {/* LIST NFT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-2.5">
                    {collection.map((nft, i) => (
                        <Card key={i} nft={nft} setSelectedOwner={setSelectedOwner} />
                    ))}
                </div>

                {/* ===== PHÂN TRANG ===== */}
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


// ========= CARD GIỮ NGUYÊN ==============
export const Card = ({ nft, setSelectedOwner }) => {
    const openNFT = () => {
        setGlobalState("nft", nft)
        setGlobalState("showModal", "scale-100")
    }

    return (
        <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 p-3 my-2 flex flex-col h-[320px]">

            <img
                src={nft.metadataURI}
                alt={nft.title}
                className="h-40 w-full object-cover rounded-lg mb-3"
            />

            <h4 className="text-white font-semibold mb-1">{nft.title}</h4>

            <p
                className="text-gray-400 text-xs mb-1 overflow-hidden"
                style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                }}
            >
                {nft.description}
            </p>

            <div className="mt-auto flex flex-col">

                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setSelectedOwner(nft.owner)}
                >
                    <p className="text-sm font-semibold text-white">Owner:</p>
                    <small className="text-pink-400 font-semibold">
                        {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                    </small>
                </div>

                <div className="flex justify-between items-center text-white pt-1">
                    <div className="flex flex-col leading-tight">
                        <small className="text-xs">Current Price</small>
                        <p className="text-sm font-semibold">{nft.cost} ETH</p>
                    </div>

                    <button
                        className="shadow-lg shadow-black text-white text-sm bg-[#e32970]
                        hover:bg-[#bd255f] cursor-pointer rounded-full px-3 py-1"
                        onClick={openNFT}
                    >
                        View Details
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Marketplace
