import { useState, useEffect, useMemo } from 'react'
import { ITEMS_PER_PAGE } from '../constants'

const useNFTCollection = (nfts, connectedAccount) => {
    const [collection, setCollection] = useState([])
    const [end, setEnd] = useState(ITEMS_PER_PAGE)
    const [count] = useState(ITEMS_PER_PAGE)
    const [currentPage, setCurrentPage] = useState(1)

    // Filter & Search States
    const [searchText, setSearchText] = useState("")
    const [sortType, setSortType] = useState("none")
    const [selectedOwner, setSelectedOwner] = useState(null)

    // Helper to normalize data
    const getFilteredNFTs = useMemo(() => {
        if (!nfts) return []

        // Initial filter logic implies we pass the *base* list of NFTs to this hook?
        // Or we pass the raw global list and a specific filter function?
        // To be flexible, this hook should perhaps take "initial data" which is already roughly filtered (e.g. Marketplace excludes own NFTs) 
        // OR it takes the full list and a filterType. 
        // Given the variety (Marketplace, Profile, Auction, MysteryBox), let's assume 'nfts' passed in is ALREADY the subset we want to list?
        // No, because Marketplace has specific dynamic filters (search, sort).

        // Let's operate on the passed 'nfts' array.
        let data = [...nfts]

        // 1. Text Search
        if (searchText.trim() !== "") {
            data = data.filter(nft =>
                nft.title.toLowerCase().includes(searchText.toLowerCase()) ||
                nft.description?.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // 2. Owner Filter (if applicable)
        if (selectedOwner) {
            data = data.filter(
                (nft) => nft.owner?.toLowerCase() === selectedOwner.toLowerCase()
            )
        }

        // 3. Sort
        if (sortType === "asc")
            data.sort((a, b) => Number(a.cost) - Number(b.cost))
        else if (sortType === "desc")
            data.sort((a, b) => Number(b.cost) - Number(a.cost))

        return data
    }, [nfts, searchText, sortType, selectedOwner])

    // Pagination Logic
    // Marketplace uses Page-based (Prev/Next buttons)
    // MysteryBox/Transactions/Artworks use "Load More" (End index)
    // We should support both or standardize?
    // User asked *not to change logic*, only structure. 
    // Marketplace/Profile use Pagination (Page 1, 2, 3).
    // MysteryBox uses "Load More".
    // I will expose both mechanisms.

    // For Pagination (Page 1, 2, ...)
    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return getFilteredNFTs.slice(start, start + ITEMS_PER_PAGE)
    }, [getFilteredNFTs, currentPage])

    const totalPages = Math.ceil(getFilteredNFTs.length / ITEMS_PER_PAGE)

    // For Load More
    const loadMoreItems = useMemo(() => {
        return getFilteredNFTs.slice(0, end)
    }, [getFilteredNFTs, end])


    return {
        // Data
        totalItems: getFilteredNFTs.length,
        filteredData: getFilteredNFTs,
        // Pagination (Page-based)
        pageItems,
        currentPage,
        setCurrentPage,
        totalPages,
        // Pagination (Load More)
        loadMoreItems,
        end,
        setEnd,
        count,
        // Filters
        searchText,
        setSearchText,
        sortType,
        setSortType,
        selectedOwner,
        setSelectedOwner,
    }
}

export default useNFTCollection
