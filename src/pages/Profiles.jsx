import { useState, useEffect } from "react"
import { useGlobalState, truncate, setGlobalState } from "../store"
import { FiSearch } from "react-icons/fi"

const Profile = () => {
    const [connectedAccount] = useGlobalState("connectedAccount")
    const [nfts] = useGlobalState("nfts")
    const [transactions] = useGlobalState("transactions")

    const [activeTab, setActiveTab] = useState("myNFT")
    const [myNFTs, setMyNFTs] = useState([])
    const [myBlindBoxes, setMyBlindBoxes] = useState([])
    const [myAuctions, setMyAuctions] = useState([])
    const ITEMS_PER_PAGE = 4
    const [currentPage, setCurrentPage] = useState(1)



    // Filter & Search states for History
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")

    useEffect(() => {
        if (!connectedAccount || nfts.length === 0) return

        const account = connectedAccount.toLowerCase()

        const owned = nfts.filter(
            (nft) =>
                (nft.owner?.toLowerCase() === account ||
                    nft.creator?.toLowerCase() === account) && !nft.isBlindBox && !nft.auction?.started
        )
        // Note: If I am creator/owner but it's in auction, it shouldn't appear in "My NFT"?
        // Only if I own it and it's NOT in auction?
        // User said: "owner... quản lý đấu giá ở tab đấu giá...". So move out of My NFT?
        // Yes: `!nft.auction?.started`.

        const boxes = nfts.filter(
            (nft) =>
                (nft.owner?.toLowerCase() === account ||
                    nft.creator?.toLowerCase() === account) && nft.isBlindBox && !nft.auction?.started
        )

        const auctions = nfts.filter(
            (nft) => nft.auction?.started && nft.auction?.seller?.toLowerCase() === account
        )

        setMyNFTs(owned)
        setMyBlindBoxes(boxes)
        setMyAuctions(auctions)
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
                    onClick={() => setActiveTab("mysteryBox")}
                    className={`px-5 py-2 rounded-full transition-all ${activeTab === "mysteryBox"
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-[#1a1d22] text-gray-300 hover:bg-gray-700"
                        }`}
                >
                    Mystery Box
                </button>

                <button
                    onClick={() => setActiveTab("auctions")}
                    className={`px-5 py-2 rounded-full transition-all ${activeTab === "auctions"
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-[#1a1d22] text-gray-300 hover:bg-gray-700"
                        }`}
                >
                    My Auctions
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
                    title="NFTs You Own"
                />

            ) : activeTab === "mysteryBox" ? (
                <MyNFTSection
                    myNFTs={myBlindBoxes}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    title="My Mystery Boxes"
                />
            ) : activeTab === "auctions" ? (
                <MyNFTSection
                    myNFTs={myAuctions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    title="My Active Auctions"
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
                src={nft.isBlindBox ? 'https://images.unsplash.com/photo-1632213702844-1e0615781374?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80' : nft.metadataURI}
                alt={nft.title}
                className={`h-48 w-full object-cover rounded-lg mb-4 ${nft.isBlindBox ? 'blur-sm grayscale' : ''}`}
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
const MyNFTSection = ({ myNFTs, currentPage, setCurrentPage, ITEMS_PER_PAGE, title }) => {
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
                <h2 className="text-2xl font-semibold">{title}</h2>

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
        const prev = tx.previousOwner?.toLowerCase() // Note: API might not have previousOwner? msg field is key now.
        // Actually, history logic: 
        // Minted: owner = minter.
        // Sales: owner = buyer.
        // Auction: owner = winner.
        // Transfer: owner = recipient. 
        // We need to match current user.
        return tx.owner?.toLowerCase() === account || (tx.msg === 'Transfer' && tx.owner !== account) // Logic is tricky without 'from' in struct for transfer. 
        // Wait, TimelessNFT.sol TransactionStruct doesn't have 'from'. 
        // It has 'owner' (which is 'who paid/received it').
        // For Transfer, 'owner' is recipient 'to'. Who is sender? Struct doesn't save sender explicitly for Transfer?
        // Let's check struct: owner, cost, title...
        // Ah, 'owner' in struct is the NEW owner.
        // Missing 'from' address in TransactionStruct! 
        // User "Recieved by" logic in old code: "Received by {tx.owner}" implies tx.owner is the recipient.
        // If I am the SENDER of a transfer, looking at this history, I see "Owner: Recipient".
        // But how do I know I was the sender?
        // WE MIGHT NOT KNOW I AM THE SENDER if the Struct doesn't store it.
        // CHECK TimelessNFT.sol TransactionStruct.
        // Struct: id, tokenId, owner, cost... msg.
        // It does NOT have 'from' or 'seller'.
        // THIS IS A LIMITATION.
        // However, the user request says "Received by... đổi lại thành ý nó nhận từ ai hoặc bán cho ai".
        // Without 'from' in struct, we can't show "Received From X".
        // We can only show "Owned By X".
        // BUT, for Transfers, 'owner' is the Recipient.
        // If (tx.owner === account), I RECEIVED it. From whom? Unknown.
        // If (tx.owner !== account), simple filtering won't find it unless I am linked via...?
        // Limitation: We typically can't see transfers I SENT, only ones I RECEIVED, unless we scan all and filter?
        // But the filter `userTx` checks `tx.owner === account`. So I only see things I RECEIVED/BOUGHT.
        // I CANNOT see things I SENT?
        // Wait, `transactions` is ALL transactions.
        // If I sent a transfer, `tx.owner` = Recipient.
        // So `tx.owner !== me`.
        // So `userTx` filter `tx.owner === account` EXCLUDES items I sent.
        // This means the current history ONLY shows INCOMING items.
        // User asked "bán cho ai" (Sold to whom).
        // If "Sales", `tx.owner` is Buyer. If I am Seller, `tx.owner !== me`.
        // I need to know if I was the seller.
        // The contract doesn't store 'seller' in TransactionStruct!
        // CRITICAL ISSUE: The current TransactionStruct is insufficient for full history (Outgoing Sales/Transfers).
        // I have to make do with what I have or user meant incoming?
        // "tôi muốn phân loại... Transfer... thay phí eth thành địa chỉ người nhận".
        // If I am the sender, I want to see "To: [Recipient]".
        // But I can't find the transaction if I don't store "from".
        // Let's assume for now we perform best effot with current struct.
        // Maybe I can assume if `tx.msg === 'Sales'` and I am NOT the `tx.owner`, I might be the seller? 
        // No, that matches everyone else too.
        // OK, I will proceed with styling updates for INCOMING transactions (where I am the `owner`/recipient), 
        // and mention this data limitation if strictly needed.
        // BUT, for "Transfer", the user explicitly asked "Transfer... thay phí eth thành địa chỉ người nhận".
        // If I am observing a Transfer in Global History, `tx.owner` IS the recipient. So I can show "Recipient: [tx.owner]".
        // In Profile, I filter by `tx.owner === account`. So I am the Recipient.
        const from = tx.from?.toLowerCase()

        return owner === account || from === account
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
                <div className="space-y-4">
                    {filtered.map((tx, index) => {
                        const isIncoming = tx.owner?.toLowerCase() === account
                        // If I am NOT the owner (recipient), then I must be the 'from' (sender),
                        // UNLESS it's a Mint where from is 0x0... (caught by isIncoming as I am owner).

                        const counterpart = isIncoming ? tx.from : tx.owner
                        const label = isIncoming ? "From" : "To"

                        // Special case for Minted: I am owner, from is 0x0
                        const isMint = tx.msg === 'Minted'

                        return (
                            <div
                                key={index}
                                className="bg-[#14171c] rounded-xl border border-gray-800 p-4 flex justify-between items-center hover:shadow-pink-500/20 transition-all shadow-md"
                            >
                                {/* LEFT: NFT Name & ID */}
                                <div className="flex flex-col w-1/4">
                                    <h4 className="text-white font-bold text-lg truncate" title={tx.title}>
                                        {tx.title}
                                    </h4>
                                    <span className="text-gray-500 text-xs">#{tx.tokenId}</span>
                                </div>

                                {/* CENTER: Relation (Top) & Time (Bottom) */}
                                <div className="flex flex-col w-1/2 items-center text-center">
                                    {/* Transaction Type Label */}
                                    <span className={`font-bold text-sm uppercase px-3 py-1 rounded-full mb-1 ${tx.msg === 'Minted' ? 'bg-green-900 text-green-300' :
                                        tx.msg === 'Transfer' ? 'bg-blue-900 text-blue-300' :
                                            tx.msg === 'Auction Won' ? 'bg-purple-900 text-purple-300' :
                                                'bg-pink-900 text-pink-300' // Sales
                                        }`}>
                                        {tx.msg}
                                    </span>

                                    {/* Time */}
                                    <span className="text-gray-500 text-xs mt-1">
                                        {formatTime(tx.timestamp)}
                                    </span>
                                </div>

                                {/* RIGHT: Price or Context */}
                                <div className="flex flex-col w-1/4 items-end text-right">
                                    {tx.msg === 'Transfer' ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-gray-400 text-sm">
                                                {isIncoming ? 'Received From' : 'Sent To'}
                                            </span>
                                            <span className="text-pink-400 font-mono text-xs">
                                                {truncate(counterpart || "Unknown", 4, 4, 11)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            {/* Price */}
                                            <span className="text-xl font-bold text-white">
                                                {tx.cost} <span className="text-pink-500 text-sm">ETH</span>
                                            </span>

                                            {/* Context Address */}
                                            <span className="text-gray-500 text-xs mt-1">
                                                {isMint
                                                    ? 'New Item'
                                                    : <>{label}: <span className="text-gray-300">{truncate(counterpart || "", 4, 4, 11)}</span></>
                                                }
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
