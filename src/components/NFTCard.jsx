import { setGlobalState } from "../store"

const NFTCard = ({ nft, onOwnerClick, actionButtonText = "View Details", onAction, isAuction }) => {

    // Default open details if no action provided
    const handleAction = () => {
        if (onAction) {
            onAction(nft)
        } else {
            setGlobalState("nft", nft)
            setGlobalState("showModal", "scale-100")
        }
    }

    const isAuctionExpired = isAuction && nft.auction?.started && new Date().getTime() > nft.auction.endAt * 1000

    return (
        <div className={`w-full bg-[#14171c] rounded-xl p-4 shadow-xl transition-all border cursor-pointer flex flex-col h-[400px]
            ${isAuctionExpired ? 'border-red-500 shadow-red-500/40' : 'border-gray-800 hover:border-pink-500 hover:shadow-pink-500/30'}`}>

            <div className="relative h-48 w-full mb-4">
                <img
                    src={nft.isBlindBox ? 'https://images.unsplash.com/photo-1632213702844-1e0615781374?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80' : nft.metadataURI}
                    alt={nft.title}
                    className={`h-full w-full object-cover rounded-lg ${nft.isBlindBox ? 'blur-sm grayscale' : ''}`}
                />

                {/* Auction Expired Badge */}
                {isAuctionExpired && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                        ⚠️ Action Needed
                    </div>
                )}

                {/* Blind Box Overlay */}
                {nft.isBlindBox && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-3xl">❓</span>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-semibold text-white truncate">{nft.title}</h3>

            <p className="text-gray-400 text-xs mt-1 line-clamp-3 overflow-hidden h-10">
                {nft.isBlindBox ? "Mystery Box - Content Unknown" : nft.description}
            </p>

            <div className="mt-auto pt-3">
                {/* Owner Info - Optional */}
                {onOwnerClick && (
                    <div
                        className="flex items-center gap-2 cursor-pointer mb-2"
                        onClick={() => onOwnerClick(nft.owner)}
                    >
                        <p className="text-sm font-semibold text-white">Owner:</p>
                        <small className="text-pink-400 font-semibold">
                            {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                        </small>
                    </div>
                )}

                <div className="flex justify-between items-center text-white">
                    <div className="flex flex-col leading-tight">
                        {isAuctionExpired ? (
                            <small className="text-red-500 font-bold">Ended</small>
                        ) : (
                            <small className="text-gray-400">Price</small>
                        )}
                        <p className="font-bold text-pink-400">{nft.cost} ETH</p>
                    </div>

                    <button
                        onClick={handleAction}
                        className={`px-4 py-1.5 rounded-full text-white text-sm shadow transition-colors ${isAuctionExpired
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-pink-600 hover:bg-pink-700'
                            }`}
                    >
                        {isAuctionExpired ? "Finalize" : actionButtonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NFTCard
