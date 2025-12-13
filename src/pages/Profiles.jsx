import { useState, useEffect, useMemo } from "react"
import { useGlobalState, truncate, setGlobalState } from "../store"
import NFTCard from "../components/NFTCard"
import useNFTCollection from "../hooks/useNFTCollection"

const Profile = () => {
    const [connectedAccount] = useGlobalState("connectedAccount")
    const [nfts] = useGlobalState("nfts")
    const [transactions] = useGlobalState("transactions")

    const [activeTab, setActiveTab] = useState("myNFT")

    // Memoize Data filtering
    const { myNFTs, myBlindBoxes, myAuctions } = useMemo(() => {
        if (!connectedAccount || nfts.length === 0) return { myNFTs: [], myBlindBoxes: [], myAuctions: [] }

        const account = connectedAccount.toLowerCase()

        // Owns and NOT in auction
        const owned = nfts.filter(nft =>
            (nft.owner?.toLowerCase() === account || nft.creator?.toLowerCase() === account)
            && !nft.isBlindBox
            && !nft.auction?.started
        )

        // Mystery Boxes
        const boxes = nfts.filter(nft =>
            (nft.owner?.toLowerCase() === account || nft.creator?.toLowerCase() === account)
            && nft.isBlindBox
            && !nft.auction?.started
        )

        // Active Auctions (Seller)
        const auctions = nfts.filter(nft =>
            nft.auction?.started && nft.auction?.seller?.toLowerCase() === account
        )

        return { myNFTs: owned, myBlindBoxes: boxes, myAuctions: auctions }
    }, [nfts, connectedAccount])

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
                {[
                    { id: "myNFT", label: "My NFT" },
                    { id: "mysteryBox", label: "Mystery Box" },
                    { id: "auctions", label: "My Auctions" },
                    { id: "history", label: "History" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2 rounded-full transition-all ${activeTab === tab.id
                            ? "bg-pink-600 text-white shadow-lg"
                            : "bg-[#1a1d22] text-gray-300 hover:bg-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === "myNFT" ? (
                <MyNFTSection data={myNFTs} title="NFTs You Own" />
            ) : activeTab === "mysteryBox" ? (
                <MyNFTSection data={myBlindBoxes} title="My Mystery Boxes" />
            ) : activeTab === "auctions" ? (
                <MyNFTSection data={myAuctions} title="My Active Auctions" isAuctionList={true} />
            ) : (
                <HistorySection
                    transactions={transactions}
                    connectedAccount={connectedAccount}
                />
            )}
        </div>
    )
}

// Sub-component using the Hook
const MyNFTSection = ({ data, title, isAuctionList = false }) => {
    // We can use the hook here!
    const {
        pageItems,
        currentPage,
        setCurrentPage,
        totalPages,
        searchText,
        setSearchText,
    } = useNFTCollection(data)

    // Note: useNFTCollection handles search internally if we pass setSearchText.
    // The previous code had a specific search input.

    return (
        <div>
            {/* Title + Search */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{title}</h2>

                <div className="flex items-center gap-4 w-3/4 justify-end">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value)
                            setCurrentPage(1)
                        }}
                    />

                    <button
                        onClick={() => setGlobalState("modal", "scale-100")}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow shrink-0"
                    >
                        + Add NFT
                    </button>
                </div>
            </div>

            {pageItems.length === 0 ? (
                <p className="text-gray-400">No items found.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
                        {pageItems.map((nft, index) => (
                            <NFTCard
                                key={index}
                                nft={nft}
                                isAuction={isAuctionList}
                            // If auction list (my auctions), button should say 'View' or special action?
                            // Default 'View' works. 
                            // Expired Logic is handled inside NFTCard.
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
                </>
            )}
        </div>
    )
}

const HistorySection = ({ transactions, connectedAccount }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const account = connectedAccount?.toLowerCase()

    /* Filter user related transactions */
    const userTx = transactions.filter((tx) => {
        const owner = tx.owner?.toLowerCase()
        const from = tx.from?.toLowerCase()
        return owner === account || from === account
    })

    /* Search & Filter Logic */
    const filtered = userTx.filter((tx) => {
        const matchesSearch = tx.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === 'all' || tx.msg === filterType
        return matchesSearch && matchesFilter
    })

    const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleString()

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Transaction History</h2>

                <div className="flex items-center gap-6 w-3/4 justify-end">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none shrink-0 border border-gray-700 focus:border-pink-500 transition-colors"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="Sales">Sales</option>
                        <option value="Minted">Minted</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Auction Won">Auction Won</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-400">No transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {filtered.map((tx, index) => {
                        const isIncoming = tx.owner?.toLowerCase() === account
                        const counterpart = isIncoming ? tx.from : tx.owner
                        const label = isIncoming ? "From" : "To"
                        const isMint = tx.msg === 'Minted'

                        return (
                            <div key={index} className="bg-[#14171c] rounded-xl border border-gray-800 p-4 flex justify-between items-center hover:shadow-pink-500/20 transition-all shadow-md">
                                <div className="flex flex-col w-1/4">
                                    <h4 className="text-white font-bold text-lg truncate" title={tx.title}>{tx.title}</h4>
                                    <span className="text-gray-500 text-xs">#{tx.tokenId}</span>
                                </div>

                                <div className="flex flex-col w-1/2 items-center text-center">
                                    <span className={`font-bold text-sm uppercase px-3 py-1 rounded-full mb-1 ${tx.msg === 'Minted' ? 'bg-green-900 text-green-300' :
                                        tx.msg === 'Transfer' ? 'bg-blue-900 text-blue-300' :
                                            tx.msg === 'Auction Won' ? 'bg-purple-900 text-purple-300' :
                                                'bg-pink-900 text-pink-300' // Sales
                                        }`}>
                                        {tx.msg}
                                    </span>
                                    <span className="text-gray-500 text-xs mt-1">{formatTime(tx.timestamp)}</span>
                                </div>

                                <div className="flex flex-col w-1/4 items-end text-right">
                                    {tx.msg === 'Transfer' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-400 text-sm">{isIncoming ? 'Received From' : 'Sent To'}</span>
                                            <span className="text-pink-400 font-mono text-xs">{truncate(counterpart || "Unknown", 4, 4, 11)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-bold text-white">{tx.cost} <span className="text-pink-500 text-sm">ETH</span></span>
                                            <span className="text-gray-500 text-xs mt-1">
                                                {isMint ? 'New Item' : <>{label}: <span className="text-gray-300">{truncate(counterpart || "", 4, 4, 11)}</span></>}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Profile
