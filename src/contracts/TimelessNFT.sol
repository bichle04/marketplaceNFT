// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimelessNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;
    mapping(string => uint8) existingURIs;
    mapping(uint256 => address) public holderOf;
    mapping(uint256 => address) public minters; // Feature: Royalty
    mapping(uint256 => bool) public isBlindBox; // Feature: Blind Box

    address public artist;
    uint256 public royalityFee;
    uint256 public supply = 0;
    uint256 public totalTx = 0;
    uint256 public cost = 0.01 ether;

    // Feature: Auction
    struct AuctionStruct {
        uint256 tokenId;
        address seller;
        address highestBidder;
        uint256 highestBid;
        uint256 endAt;
        bool started;
        bool ended;
    }
    mapping(uint256 => AuctionStruct) public auctions;
    mapping(address => mapping(uint256 => uint256)) public bids; // detailed bids for refund

    event Sale(
        uint256 id,
        address indexed owner,
        uint256 cost,
        string metadataURI,
        uint256 timestamp
    );

    event AuctionCreated(
        uint256 indexed tokenId,
        uint256 duration,
        uint256 startPrice
    );
    event AuctionBid(
        uint256 indexed tokenId,
        address indexed sender,
        uint256 value
    );
    event AuctionEnded(
        uint256 indexed tokenId,
        address indexed winner,
        uint256 value
    );

    struct TransactionStruct {
        uint256 id;
        uint256 tokenId;
        address owner;
        uint256 cost;
        string title;
        string description;
        string metadataURI;
        uint256 timestamp;
        string msg; // Added transaction type label
    }

    TransactionStruct[] transactions;
    TransactionStruct[] minted;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royalityFee,
        address _artist
    ) ERC721(_name, _symbol) {
        royalityFee = _royalityFee;
        artist = _artist;
    }

    // Feature: Blind Box included in mint
    function payToMint(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice,
        bool _isBlindBox
    ) external payable {
        require(msg.value >= cost, "Ether too low for minting!");
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(artist, royality);
        payTo(owner(), (msg.value - royality));

        supply++;

        minted.push(
            TransactionStruct(
                supply,
                supply, // tokenId is same as id for minted
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp,
                "Minted" // Transaction Type
            )
        );

        // Also record in transactions history
        totalTx++;
        transactions.push(
            TransactionStruct(
                totalTx,
                supply,
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp,
                "Minted"
            )
        );

        emit Sale(supply, msg.sender, msg.value, metadataURI, block.timestamp);

        _safeMint(msg.sender, supply);
        existingURIs[metadataURI] = 1;
        holderOf[supply] = msg.sender;
        minters[supply] = msg.sender; // Record creator for royalty
        isBlindBox[supply] = _isBlindBox;
    }

    // Feature: Reveal Blind Box
    function revealBox(uint256 id) external {
        require(msg.sender == minted[id - 1].owner, "Only owner can reveal");
        require(isBlindBox[id], "Not a blind box");

        isBlindBox[id] = false;
        // minted[id - 1].metadataURI = newURI; // No longer overwriting URI
    }

    function payToBuy(uint256 id) external payable {
        require(
            msg.value >= minted[id - 1].cost,
            "Ether too low for purchase!"
        );
        require(msg.sender != minted[id - 1].owner, "Operation Not Allowed!");

        // Feature: Royalty paid to Minter (Creator)
        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(minters[id], royality); // Changed from 'artist' to 'minters[id]'
        payTo(minted[id - 1].owner, (msg.value - royality));

        totalTx++;

        transactions.push(
            TransactionStruct(
                totalTx,
                id, // tokenId matches the NFT id
                msg.sender,
                msg.value,
                minted[id - 1].title,
                minted[id - 1].description,
                minted[id - 1].metadataURI,
                block.timestamp,
                "Sales" // Transaction Type
            )
        );

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            minted[id - 1].metadataURI,
            block.timestamp
        );

        _transfer(minted[id - 1].owner, msg.sender, id); // Use internal transfer
        minted[id - 1].owner = msg.sender;
        holderOf[id] = msg.sender;
    }

    // Feature: Transfer NFT
    function transferNFT(address to, uint256 id) external {
        require(msg.sender == minted[id - 1].owner, "Only owner can transfer");
        require(to != address(0), "Invalid address");

        _transfer(msg.sender, to, id);
        minted[id - 1].owner = to; // Update struct
        holderOf[id] = to;

        // Record Transfer in History
        totalTx++;
        transactions.push(
            TransactionStruct(
                totalTx,
                id,
                to,
                0, // 0 cost for transfer
                minted[id - 1].title,
                minted[id - 1].description,
                minted[id - 1].metadataURI,
                block.timestamp,
                "Transfer" // Transaction Type
            )
        );
    }

    // Feature: Auction - Create
    function createAuction(
        uint256 tokenId,
        uint256 duration,
        uint256 startPrice
    ) external {
        require(
            msg.sender == minted[tokenId - 1].owner,
            "Only owner can auction"
        );
        require(!auctions[tokenId].started, "Already in auction");

        AuctionStruct memory auction = AuctionStruct(
            tokenId,
            msg.sender,
            address(0), // No bidder yet
            startPrice,
            block.timestamp + duration,
            true, // started
            false // ended
        );
        auctions[tokenId] = auction;

        // Lock NFT in contract
        _transfer(msg.sender, address(this), tokenId);
        minted[tokenId - 1].owner = address(this);
        holderOf[tokenId] = address(this);

        emit AuctionCreated(tokenId, duration, startPrice);
    }

    // Feature: Auction - Bid
    function bid(uint256 tokenId) external payable {
        AuctionStruct storage auction = auctions[tokenId];
        require(auction.started, "Auction not started");
        require(block.timestamp < auction.endAt, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            payTo(auction.highestBidder, auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit AuctionBid(tokenId, msg.sender, msg.value);
    }

    // Feature: Auction - End
    function endAuction(uint256 tokenId) external {
        AuctionStruct storage auction = auctions[tokenId];
        require(auction.started, "Not started");
        require(!auction.ended, "Already ended");
        require(
            block.timestamp >= auction.endAt || msg.sender == auction.seller,
            "Not finished yet"
        );

        auction.ended = true;
        auction.started = false;

        if (auction.highestBidder != address(0)) {
            // Transfer NFT to winner
            _transfer(address(this), auction.highestBidder, tokenId);
            minted[tokenId - 1].owner = auction.highestBidder;
            holderOf[tokenId] = auction.highestBidder;

            // Pay seller (Royalty applies?) - Simplified: Pay seller fully or handle royalty?
            // For simple auction, let's just pay seller minus generic platform fee (optional)
            // Let's apply standard Royalty to original Creator for consistency
            uint256 royality = (auction.highestBid * royalityFee) / 100;
            payTo(minters[tokenId], royality);
            payTo(auction.seller, auction.highestBid - royality);

            // Record Transaction
            totalTx++;
            transactions.push(
                TransactionStruct(
                    totalTx,
                    tokenId,
                    auction.highestBidder,
                    auction.highestBid,
                    minted[tokenId - 1].title,
                    minted[tokenId - 1].description,
                    minted[tokenId - 1].metadataURI,
                    block.timestamp,
                    "Auction Won" // Transaction Type
                )
            );
            emit AuctionEnded(
                tokenId,
                auction.highestBidder,
                auction.highestBid
            );
        } else {
            // No bids, return NFT to seller
            _transfer(address(this), auction.seller, tokenId);
            minted[tokenId - 1].owner = auction.seller;
            holderOf[tokenId] = auction.seller;
        }
    }

    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether, "Ether too low!");
        require(msg.sender == minted[id - 1].owner, "Operation Not Allowed!");

        minted[id - 1].cost = newPrice;
        return true;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getAllNFTs() external view returns (TransactionStruct[] memory) {
        return minted;
    }

    function getNFT(
        uint256 id
    ) external view returns (TransactionStruct memory) {
        return minted[id - 1];
    }

    function getAllTransactions()
        external
        view
        returns (TransactionStruct[] memory)
    {
        return transactions;
    }
}
