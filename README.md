# ObsidianVerse - NFT Marketplace

ObsidianVerse is a comprehensive decentralized NFT Marketplace that allows users to mint, trade, auction, and collect unique digital assets. The platform supports standard NFT trading, Mystery Boxes, and Live Auctions with a modern, responsive interface.

## 📚 Features
- **Standard NFT Trading**: Buy and sell NFTs directly.
- **Mystery Boxes**: Create blind boxes whose contents are hidden until revealed.
- **Live Auctions**: Host live auctions for NFTs.
- **Profile**: View your collection and history of transactions.

## 🚀 Technologies Used
- **Frontend**: React.js, Tailwind CSS
- **Blockchain**: Solidity, Web3.js
- **Development Framework**: Truffle Suite
- **Local Blockchain**: Ganache
- **Storage**: IPFS (via Pinata)

## 🛠 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher recommended)
- **Ganache** (for running a local blockchain)
- **Metamask** browser extension

### Step-by-Step Guide
1. **Clone the repository**
   ```bash
   git clone https://github.com/bichle04/marketplaceNFT.git
   cd marketplaceNFT
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Blockchain (Ganache)**
   - Open Ganache.
   - Create a **New Workspace**.
   - Add the `truffle-config.js` from this project to the workspace.
   - Save and Restart.

4. **Deploy Smart Contracts**
   In the project root terminal:
   ```bash
   truffle migrate --reset
   ```
   *This commands compiles and deploys the `ObsidianVerse` smart contract to your local Ganache blockchain.*

5. **Configure Metamask**
   - Import a Private Key from one of the Ganache accounts into Metamask.
   - Ensure Metamask is connected to the **Localhost** network (usually RPC `http://127.0.0.1:7545`, Chain ID `1337`).

6. **Run the Application**
   ```bash
   npm start
   ```
   The app should launch at `http://localhost:3000`.

## 📖 Feature Usage

### 1. Connect Wallet
Click the **"Connect Wallet"** button in the header. You must be connected to perform any transaction.

### 2. Minting NFTs
- Click **"Create NFT"** (or add button in Profile).
- Upload an image, provide a Title, Description, and Price (ETH).
- **Mystery Box**: Check the "Mystery Box" option if you want to mint a blind box whose content is hidden until revealed.

### 3. Marketplace (Trading)
- Browse the **Market** page to see NFTs for sale.
- Click **"View Details"** -> **"Buy Now"** to purchase.
- If you are the owner, you can **"Change Price"** or set it for Auction.

### 4. Auctions
- **Create**: As an owner, go to an NFT's detail page and select "Offer Auction". Set the duration and starting price.
- **Bid**: Go to the **Auctions** page. Click "Place Bid" on active auctions.
- **End**: When time expires, the owner can finalize the auction.

### 5. Profile & History
- **My NFT**: View your collection.
- **Mystery Box**: View your unrevealed boxes.
- **History**: Track all your incoming and outgoing transactions (Sales, Transfers, Mints).

### 6. How to access IPFS via Pinata
- When you create an NFT, the image will be stored on Pinata's system.
- You can log in to Pinata Dashboard, the **Files** section to manage all the NFT images you've created.
- To view public images, you can use Gateway: `https://gateway.pinata.cloud/ipfs/<CID_of_Image>` or `https://ipfs.io/ipfs/<CID_of_Image>`.

## ⚠️ Notes & Troubleshooting

### Common Issues
1. **"TXNonceTooHigh" / Transaction Failures**:
   - **Cause**: If you restart Ganache, the nonce (transaction count) on the blockchain resets to 0, but Metamask remembers the old count.
   - **Fix**: Open Metamask > Settings > Advanced > **Reset Account**. This clears the transaction history cache.

2. **Images not loading**:
   - Ensure your internet connection is active (images are fetched from IPFS/Web).
   - If using local IPFS, ensure the daemon is running.

3. **Contract not found**:
   - Make sure you ran `truffle migrate --reset` after starting Ganache.
   - Ensure Metamask is connected to the correct network (Localhost 7545).

4. **Import Errors**:
   - Since the project uses absolute imports or structural changes (like `src/constants`), ensure you have the latest code and dependencies installed.
