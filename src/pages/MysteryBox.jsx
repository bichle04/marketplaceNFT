import { useMemo } from 'react'
import { useGlobalState } from '../store'
import NFTCard from '../components/NFTCard'
import useNFTCollection from '../hooks/useNFTCollection'

const MysteryBox = () => {
    const [nfts] = useGlobalState('nfts')
    const [connectedAccount] = useGlobalState('connectedAccount')

    // Filter Mystery Boxes
    const mysteryBoxNFTs = useMemo(() => {
        const account = connectedAccount?.toLowerCase()
        return nfts.filter(nft =>
            nft.isBlindBox &&
            !nft.auction?.started &&
            nft.owner?.toLowerCase() !== account
        )
    }, [nfts, connectedAccount])

    // Use Hook
    const {
        loadMoreItems,
        end,
        setEnd,
        count,
        searchText,
        setSearchText,
        setSortType,
        selectedOwner,
        setSelectedOwner,
        filteredData // Need total filtered count to check if more items exist
    } = useNFTCollection(mysteryBoxNFTs)

    return (
        <div className="bg-[#151c25] gradient-bg-artworks min-h-screen">
            <div className="w-4/5 py-10 mx-auto">
                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    {selectedOwner
                        ? `Mystery Boxes owned by ${selectedOwner.slice(0, 6)}...${selectedOwner.slice(-4)}`
                        : loadMoreItems.length > 0
                            ? "Mystery Boxes"
                            : "No Mystery Boxes"}
                </h4>

                {/* Back Button */}
                {selectedOwner && (
                    <button
                        className="mt-4 px-4 py-2 rounded-full bg-[#e32970] text-white hover:bg-[#bd255f]"
                        onClick={() => {
                            setSelectedOwner(null)
                            setEnd(count) // Reset load count
                        }}
                    >
                        ← Back to All
                    </button>
                )}

                {!selectedOwner && <p className="text-gray-400 mt-2">Unbox unique treasures!</p>}

                {/* SEARCH + SORT */}
                <div className="flex justify-between my-6">
                    <input
                        type="text"
                        placeholder="Search Mystery Box..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none border border-gray-700 focus:border-pink-500 transition-colors"
                    >
                        <option value="none">Sort by price</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
                    {loadMoreItems.length > 0 ? (
                        loadMoreItems.map((nft, i) => (
                            <NFTCard
                                key={i}
                                nft={nft}
                                onOwnerClick={setSelectedOwner}
                                actionButtonText="View Box" // Text for button
                            />
                        ))
                    ) : (
                        <p className="text-white mt-5">No Mystery Boxes found.</p>
                    )}
                </div>

                {loadMoreItems.length > 0 && filteredData.length > loadMoreItems.length ? (
                    <div className="text-center my-5">
                        <button
                            className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
                            onClick={() => setEnd(end + count)}
                        >
                            Load More
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default MysteryBox
