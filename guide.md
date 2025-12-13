# ObsidianVerse - Sàn Giao Dịch NFT

ObsidianVerse là một nền tảng giao dịch NFT phi tập trung toàn diện, cho phép người dùng đúc (mint), giao dịch, đấu giá và sưu tầm các tài sản kỹ thuật số độc đáo. Nền tảng hỗ trợ giao dịch NFT tiêu chuẩn, Hộp Bí Ẩn (Mystery Boxes) và Đấu Giá Trực Tiếp với giao diện hiện đại và tương thích tốt.

## 📚 Các chức năng
- **Standard NFT Trading**: Mua và bán NFT trực tiếp.
- **Mystery Boxes**: Tạo hộp bí ẩn (blind box) có nội dung bị ẩn cho đến khi mở.
- **Live Auctions**: Tổ chức đấu giá trực tiếp cho NFT.
- **Profile**: Xem bộ sưu tập và lịch sử giao dịch.

## 🚀 Công Nghệ Sử Dụng
- **Frontend**: React.js, Tailwind CSS
- **Blockchain**: Solidity, Web3.js
- **Framework Phát Triển**: Truffle Suite
- **Local Blockchain**: Ganache
- **Lưu trữ**: IPFS (thông qua Pinata)

## 🛠 Cài Đặt & Thiết Lập

### Yêu cầu tiên quyết
- **Node.js** (Khuyên dùng v14 hoặc cao hơn)
- **Ganache** (Để chạy blockchain cục bộ)
- **Metamask** (Extension ví trên trình duyệt)

### Hướng dẫn từng bước
1. **Clone dự án**
   ```bash
   git clone https://github.com/bichle04/marketplaceNFT.git
   cd marketplaceNFT
   ```

2. **Cài đặt thư viện**
   ```bash
   npm install
   ```

3. **Cấu hình Blockchain (Ganache)**
   - Mở **Ganache**.
   - Chọn **NEW WORKSPACE**.
   - Đặt tên ở ô **Workspace Name**: `NFT_Project`.
   - Chuyển sang tab **Server** (ở tab bên cạnh).
   - Sửa **Port Number** thành: `7545`.
   - Bấm nút **Start** (Góc trên bên phải).
    *   Lúc này Ganache sẽ hiện ra danh sách 10 tài khoản có sẵn 100 ETH. Giữ nguyên cửa sổ này.

4. **Triển khai Smart Contracts**
   Tại terminal thư mục gốc dự án:
   ```bash
   truffle migrate --reset
   ```
   *Lệnh này sẽ biên dịch và triển khai smart contract `ObsidianVerse` lên blockchain Ganache của bạn.*

5. **Cấu hình Metamask**
   - Nhập một Private Key từ danh sách tài khoản trong Ganache vào Metamask.
   - Đảm bảo Metamask đang kết nối tới mạng **Localhost 7545** (thường là RPC `http://127.0.0.1:7545`, Chain ID `1337`, Currency Symbol `ETH`).

6. **Chạy ứng dụng**
   ```bash
   npm start
   ```
   Ứng dụng sẽ chạy tại địa chỉ `http://localhost:3000`.

## 📖 Hướng Dẫn Sử Dụng Tính Năng

### 1. Kết Nối Ví (Connect Wallet)
Nhấn nút **"Connect Wallet"** ở góc trên bên phải. Bạn cần kết nối ví để thực hiện bất kỳ giao dịch nào.

### 2. Đúc NFT (Minting)
- Nhấn **"Create NFT"** (hoặc nút thêm trong Profile).
- Tải ảnh lên, nhập Tiêu đề, Mô tả và Giá (ETH).
- **Mystery Box**: Tích chọn "Mystery Box" nếu bạn muốn tạo một blind box (nội dung bên trong sẽ bị ẩn cho đến khi mở).

### 3. Cửa Hàng (Marketplace)
- Truy cập trang **Market** để xem các NFT đang được rao bán.
- Nhấn **"View Details"** -> **"Buy Now"** để mua.
- Nếu bạn là chủ sở hữu, bạn có thể **"Change Price"** (đổi giá) hoặc chuyển sang chế độ Đấu Giá.

### 4. Đấu Giá (Auctions)
- **Tạo đấu giá**: Là chủ sở hữu, vào chi tiết NFT và chọn "Offer Auction". Thiết lập thời gian và giá khởi điểm.
- **Đấu giá**: Truy cập trang **Auctions**. Nhấn "Place Bid" trên các phiên đấu giá đang diễn ra.
- **Kết thúc**: Khi hết giờ, người bán có thể nhấn nút để hoàn tất (Finalize) phiên đấu giá.

### 5. Hồ Sơ & Lịch Sử (Profile & History)
- **My NFT**: Xem bộ sưu tập của bạn.
- **Mystery Box**: Xem các blind box bạn đang sở hữu.
- **History**: Theo dõi lịch sử giao dịch (Mua bán, Chuyển nhượng, Mint).

### 6. CÁCH TRUY CẬP IPFS QUA PINATA
- Khi bạn tạo NFT, ảnh sẽ được lưu trữ trên hệ thống của Pinata.
- Bạn có thể đăng nhập vào Pinata Dashboard, mục **Files** để quản lý tất cả các ảnh NFT đã tạo.
- Để xem ảnh công khai, bạn có thể dùng Gateway: `https://gateway.pinata.cloud/ipfs/<CID_Của_Ảnh>` hoặc `https://ipfs.io/ipfs/<CID_Của_Ảnh>`.


## ⚠️ Lưu Ý & Khắc Phục Lỗi

### Các lỗi thường gặp
1. **Lỗi "TXNonceTooHigh" hoặc Giao dịch thất bại**:
   - **Nguyên nhân**: Khi bạn khởi động lại Ganache, chỉ số nonce (đếm giao dịch) trên blockchain bị reset về 0, nhưng Metamask vẫn nhớ số đếm cũ.
   - **Khắc phục**: Mở Metamask > Cài đặt (Settings) > Nâng cao (Advanced) > **Reset Account**. Việc này sẽ xóa bộ nhớ đệm lịch sử giao dịch của ví.

2. **Lỗi "Contract not deployed to this network"**:
   - **Nguyên nhân**: Bạn đang chọn sai mạng trên MetaMask.
   - **Cách sửa**: Mở MetaMask -> Chọn icon 🌐 -> Chọn lại mạng **Localhost 7545** (Chain ID 1337) mà bạn đã tạo.

3. **Lỗi không tìm thấy Smart Contract**:
   - Đảm bảo bạn đã chạy `truffle migrate --reset` sau khi bật Ganache.
   - Đảm bảo Metamask đang kết nối đúng mạng (Localhost 7545).

4. **Lỗi Import**:
   - Do dự án sử dụng đường dẫn tuyệt đối hoặc thay đổi cấu trúc (như `src/constants`), hãy đảm bảo bạn đã lấy code mới nhất và cài đặt đủ dependencies.
