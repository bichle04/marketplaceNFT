import { useEffect, useState } from 'react'
import { setGlobalState, useGlobalState } from '../store'

const MysteryBox = () => {
    const [nfts] = useGlobalState('nfts')
    const [connectedAccount] = useGlobalState('connectedAccount') // Need connectedAccount
    const [end, setEnd] = useState(4)
    const [count] = useState(4)
    const [collection, setCollection] = useState([])

    // Filter & Search States
    const [searchText, setSearchText] = useState("")
    const [sortType, setSortType] = useState("none")

    const getFilteredNFTs = () => {
        const account = connectedAccount?.toLowerCase()

        // Filter: Is Blind Box + Not Auction + Not Owned
        let data = nfts.filter(nft =>
            nft.isBlindBox &&
            !nft.auction?.started &&
            nft.owner?.toLowerCase() !== account
        )

        // Search
        if (searchText.trim() !== "") {
            data = data.filter(nft =>
                nft.title.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Sort
        if (sortType === "asc")
            data = [...data].sort((a, b) => Number(a.cost) - Number(b.cost))

        if (sortType === "desc")
            data = [...data].sort((a, b) => Number(b.cost) - Number(a.cost))

        return data
    }

    useEffect(() => {
        setCollection(getFilteredNFTs().slice(0, end))
    }, [nfts, end, searchText, sortType])

    return (
        <div className="bg-[#151c25] gradient-bg-artworks min-h-screen">
            <div className="w-4/5 py-10 mx-auto">
                <h4 className="text-white text-3xl font-bold uppercase text-gradient">
                    Mystery Boxes
                </h4>
                <p className="text-gray-400 mt-2">Unbox unique treasures!</p>

                {/* SEARCH + SORT */}
                <div className="flex justify-between my-6">
                    {/* SEARCH BAR */}
                    <input
                        type="text"
                        placeholder="Search Mystery Box..."
                        className="bg-gray-800 text-white px-3 py-2 rounded-md w-1/2 outline-none border border-gray-700 focus:border-pink-500"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    {/* SORT */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none border border-gray-700 focus:border-pink-500"
                    >
                        <option value="none">Sort by price</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
                    {collection.length > 0 ? (
                        collection.map((nft, i) => (
                            <Card key={i} nft={nft} />
                        ))
                    ) : (
                        <p className="text-white mt-5">No Mystery Boxes found.</p>
                    )}
                </div>

                {collection.length > 0 && getFilteredNFTs().length > collection.length ? (
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

const Card = ({ nft }) => {
    const setNFT = () => {
        setGlobalState('nft', nft)
        setGlobalState('showModal', 'scale-100')
    }

    return (
        <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 p-3 my-2 flex flex-col h-[320px] border border-yellow-600">

            {/* FORCE BLUR for Mystery Box Page */}
            <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1632213702844-1e0615781374?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
                    alt={nft.title}
                    className="h-full w-full object-cover blur-sm hover:blur-none transition duration-500 ease-in-out cursor-help"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl">❓</span>
                </div>
            </div>

            <h4 className="text-white font-semibold mb-1">{nft.title}</h4>
            <p className="text-gray-400 text-xs mb-2 truncate">Mystery Box - Content Unknown</p>

            <div className="mt-auto flex justify-between items-center text-white pt-1">
                <div className="flex flex-col leading-tight">
                    <small className="text-xs">Price</small>
                    <p className="text-sm font-semibold">{nft.cost} ETH</p>
                </div>

                <button
                    className="shadow-lg shadow-black text-white text-sm bg-yellow-600
        hover:bg-yellow-500 cursor-pointer rounded-full px-3 py-1 animate-pulse"
                    onClick={setNFT}
                >
                    View Box
                </button>
            </div>

        </div>

    )
}

export default MysteryBox
