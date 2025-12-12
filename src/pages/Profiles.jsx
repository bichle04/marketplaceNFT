import { useState, useEffect } from "react"
import { useGlobalState, truncate, setGlobalState } from "../store"
import { FiSearch } from "react-icons/fi"

const Profile = () => {
    const [connectedAccount] = useGlobalState("connectedAccount")
    const [nfts] = useGlobalState("nfts")
    const [transactions] = useGlobalState("transactions")

    const [activeTab, setActiveTab] = useState("myNFT")
    const [myNFTs, setMyNFTs] = useState([])
    const ITEMS_PER_PAGE = 4
    const [currentPage, setCurrentPage] = useState(1)



    // Filter & Search states for History
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")

    useEffect(() => {
        if (!connectedAccount || nfts.length === 0) return

        const owned = nfts.filter(
            (nft) =>
                nft.owner?.toLowerCase() === connectedAccount.toLowerCase() ||
                nft.creator?.toLowerCase() === connectedAccount.toLowerCase()
        )

        setMyNFTs(owned)
        setCurrentPage(1)
    }, [connectedAccount, nfts])


    return (
        <div className="w-4/5 mx-auto py-12 text-white">

            {/* Profile Header */}
            <div className="mb-10 p-6 rounded-xl bg-[#0f1115] border border-gray-800 shadow-xl">
                <h1 className="text-4xl font-bold">My Profile</h1>

                <p className="text-gray-400 mt-2">
                    Connected Wallet:{" "}
                    <span className="text-pink-400 font-semibold">
                        {connectedAccount
                            ? truncate(connectedAccount, 6, 4, 15)
                            : "Not Connected"}
                    </span>
                </p>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 space-x-6">
                <button
                    onClick={() => setActiveTab("myNFT")}
                    className={`px-5 py-2 rounded-full transition-all ${activeTab === "myNFT"
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-[#1a1d22] text-gray-300 hover:bg-gray-700"
                        }`}
                >
                    My NFT
                </button>

                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-5 py-2 rounded-full transition-all ${activeTab === "history"
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-[#1a1d22] text-gray-300 hover:bg-gray-700"
                        }`}
                >
                    History
                </button>
            </div>

            {/* Tab content */}
            {activeTab === "myNFT" ? (
                <MyNFTSection
                    myNFTs={myNFTs}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                />

            ) : (
                <HistorySection
                    transactions={transactions}
                    connectedAccount={connectedAccount}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterType={filterType}
                    setFilterType={setFilterType}
                />
            )}
        </div>
    )
}

export default Profile


/* ---------------------------------------------------------
   CARD đẹp hơn (hover, border, shadow)
--------------------------------------------------------- */

const NFTCard = ({ nft }) => {
    const openDetails = () => {
        setGlobalState("nft", nft)
        setGlobalState("showModal", "scale-100")
    }

    return (
        <div className="bg-[#14171c] rounded-xl p-4 shadow-xl hover:shadow-pink-500/30 transition-all border border-gray-800 hover:border-pink-500 cursor-pointer flex flex-col h-[400px]">
            <img
                src={nft.metadataURI}
                alt={nft.title}
                className="h-48 w-full object-cover rounded-lg mb-4"
            />

            <h3 className="text-lg font-semibold">{nft.title}</h3>

            <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                {nft.description}
            </p>

            <div className="mt-auto flex justify-between items-center pt-3">
                <div>
                    <small className="text-gray-400">Price</small>
                    <p className="font-bold text-pink-400">{nft.cost} ETH</p>
                </div>

                <button
                    onClick={openDetails}
                    className="px-4 py-1 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-sm shadow"
                >
                    View
                </button>
            </div>
        </div>
    )
}


/* ---------------------------------------------------------
   SECTION: My NFT (UI nâng cấp)
--------------------------------------------------------- */
const MyNFTSection = ({ myNFTs, currentPage, setCurrentPage, ITEMS_PER_PAGE }) => {
    const [searchTerm, setSearchTerm] = useState("")

    // Lọc NFT theo từ khóa
    const filteredNFTs = myNFTs.filter((nft) =>
        nft.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredNFTs.length / ITEMS_PER_PAGE)
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const pageNFTs = filteredNFTs.slice(start, end)

    return (
        <div>
            {/* Title + Search in one row */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">NFTs You Own</h2>

                {/* SEARCH + ADD BUTTON */}
                <div className="flex items-center gap-3 w-1/2 justify-end">

                    {/* SEARCH */}
                    <div className="flex items-center bg-[#1a1d22] border border-gray-700 rounded-full px-4 py-2 w-2/3">
                        <FiSearch className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search your NFTs..."
                            className="bg-transparent outline-none text-sm text-gray-300 w-full"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    {/* ADD NFT BUTTON */}
                    <button
                        onClick={() => setGlobalState("modal", "scale-100")}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow"
                    >
                        + Add NFT
                    </button>

                </div>
            </div>


            {filteredNFTs.length === 0 ? (
                <p className="text-gray-400">No NFTs found.</p>
            ) : (
                <>
                    {/* NFT List */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {pageNFTs.map((nft, index) => (
                            <NFTCard key={index} nft={nft} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                className="px-3 py-1 rounded bg-[#e32970] text-white disabled:opacity-40"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1
                                        ? "bg-white text-black"
                                        : "bg-[#e32970] text-white"
                                        }`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
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
                </>
            )}
        </div>
    )
}



/* ---------------------------------------------------------
   HISTORY: Show all transfers related to user (old style)
--------------------------------------------------------- */

const HistorySection = ({
    transactions,
    connectedAccount,
    searchTerm,
    setSearchTerm,
}) => {

    const account = connectedAccount?.toLowerCase()

    /* Chỉ lấy giao dịch liên quan đến bản thân */
    const userTx = transactions.filter((tx) => {
        const owner = tx.owner?.toLowerCase()
        const prev = tx.previousOwner?.toLowerCase()

        return owner === account || prev === account
    })

    /* Format ngày giờ */
    const formatTime = (timestamp) =>
        new Date(timestamp * 1000).toLocaleString()

    /* Search theo title */
    const filtered = userTx.filter((tx) =>
        tx.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Transaction History</h2>

                <div className="flex items-center bg-[#1a1d22] border border-gray-700 rounded-full px-4 py-2 w-1/3">
                    <FiSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="bg-transparent outline-none text-sm text-gray-300 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>


            {/* LIST */}
            {filtered.length === 0 ? (
                <p className="text-gray-400">No transactions found.</p>
            ) : (
                <div className="space-y-5">
                    {filtered.map((tx) => (
                        <div
                            key={tx.id + "-" + tx.timestamp}
                            className="p-5 bg-[#14171c] rounded-xl border border-gray-800 hover:border-pink-500 transition-all shadow-md"
                        >
                            {/* Title */}
                            <h4 className="text-pink-400 font-semibold mb-2">
                                {tx.title} Transferred
                            </h4>

                            {/* Row: Received – Time – Cost */}
                            <div className="flex justify-between items-center mt-2">

                                {/* Left: Received By */}
                                <div className="text-gray-400 text-sm">
                                    Received by{" "}
                                    <span className="text-pink-500 font-semibold">
                                        {truncate(tx.owner || "", 4, 4, 11)}
                                    </span>
                                </div>

                                {/* Middle: Time */}
                                <div className="text-gray-400 text-sm">
                                    <span className="text-pink-400">{formatTime(tx.timestamp)}</span>
                                </div>

                                {/* Right: Cost */}
                                <div className="text-pink-500 text-lg font-bold">
                                    {tx.cost} ETH
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}
