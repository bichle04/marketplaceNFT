# HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG NFT MARKETPLACE (CHI TIẾT TỪ A-Z)

Chào mừng bạn! Tài liệu này sẽ hướng dẫn bạn từng bước để chạy dự án NFT Marketplace trên máy tính cá nhân. Dù bạn chưa biết gì cũng có thể làm được nếu làm đúng theo thứ tự dưới đây.

---

## PHẦN 1: CHUẨN BỊ CÔNG CỤ (CÀI ĐẶT PHẦN MỀM)

Trước khi chạy code, bạn cần chuẩn bị các công cụ sau:

1.  **Node.js**: Môi trường chạy code Javascript.
    *   Tải tại: `https://nodejs.org/` (Chọn bản LTS).
2.  **Ganache**: Giả lập mạng Blockchain Ethereum trên máy cá nhân.
    *   Tải tại: `https://trufflesuite.com/ganache/`
3.  **MetaMask**: Ví điện tử để giao dịch (Cài Extension trên Chrome/Edge).
    *   Tải tại: `https://metamask.io/`
4.  **Tài khoản Pinata**: Dịch vụ lưu trữ IPFS đám mây (Cloud).
    *   Đăng ký tại: `https://app.pinata.cloud/`

---

## PHẦN 2: CẤU HÌNH MÔI TRƯỜNG (QUAN TRỌNG)

### Bước 1: Lấy API Key từ Pinata (Để upload được ảnh)
Thay vì cài phần mềm IPFS Desktop nặng máy, chúng ta dùng Pinata để lưu ảnh nhanh và ổn định hơn.

1.  Đăng nhập vào [Pinata](https://app.pinata.cloud/).
2.  Chọn mục **API Keys** -> Bấm **New Key**.
3.  Bật quyền **Admin** -> Đặt tên Key (ví dụ: `NFT Project`) -> Bấm **Create Key**.
4.  Copy 3 thông tin quan trọng: **API Key**, **API Secret**, và **JWT**.

### Bước 2: Cấu hình biến môi trường trong dự án
1.  Vào thư mục dự án `marketplaceNFT`.
2.  Tạo một file mới tên là `.env` (lưu ý có dấu chấm ở đầu).
3.  Mở file `.env` đó ra và dán nội dung sau vào (thay thế bằng Key của bạn):

```env
REACT_APP_PINATA_API_KEY=your_api_key_here
REACT_APP_PINATA_API_SECRET=your_api_secret_here
REACT_APP_PINATA_JWT=your_jwt_token_here
```
*(Nếu làm đồ án nhóm, các bạn có thể dùng chung 1 file `.env` này cũng được).*

### Bước 3: Cấu hình Ganache (Tạo mạng Blockchain riêng)
Để dữ liệu không bị mất khi tắt máy, chúng ta sẽ tạo một không gian làm việc cố định.

1.  Mở **Ganache**.
2.  Chọn **NEW WORKSPACE**.
3.  Đặt tên ở ô **Workspace Name**: `NFT_Project`.
4.  Chuyển sang tab **Server** (ở tab bên cạnh).
5.  Sửa **Port Number** thành: `7545`.
6.  Bấm nút **Start** (Góc trên bên phải).
    *   Lúc này Ganache sẽ hiện ra danh sách 10 tài khoản có sẵn 100 ETH. Giữ nguyên cửa sổ này.

### Bước 4: Cấu hình MetaMask (Kết nối ví với Ganache)
1.  Mở trình duyệt, bấm vào icon con cáo **MetaMask**.
2.  Bấm vào Tuỳ chọn -> Mạng -> **Add a network manually** (Thêm mạng tuỳ chỉnh).
3.  Điền thông tin sau:
    *   **Network Name**: `Localhost 7545`
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **Chain ID**: `1337`
    *   **Currency Symbol**: `ETH`
4.  Bấm **Save**.

### Bước 5: Nhập tiền vào ví (Import Account)
1.  Quay lại phần mềm **Ganache**.
2.  Chọn tài khoản bất kì và bấm vào biểu tượng **Chìa khóa** (Show Keys) ở cuối dòng.
3.  Copy dòng **Private Key**.
4.  Mở **MetaMask** -> Bấm vào Avatar tròn (Góc trên phải) -> Chọn **Add wallet** (Thêm ví) -> Chọn **Import Account** (Nhập tài khoản).
5.  Dán Private Key vào -> Bấm **Import**.
    *   Lúc này ví MetaMask của bạn sẽ hiện `100 ETH`.

---

## PHẦN 3: CHẠY DỰ ÁN (CODE)

### Bước 1: Cài đặt thư viện
1.  Mở thư mục dự án `marketplaceNFT`.
2.  Mở **Terminal** -> Gõ lệnh: `npm install` -> Chờ nó chạy xong.

### Bước 2: Nạp Hợp đồng thông minh (Deploy Smart Contract)
Đây là bước đưa code Blockchain vào mạng Ganache của bạn.

1.  Tại Terminal, gõ lệnh:
    ```truffle migrate --reset```
2.  Nếu thấy hiện `Transaction hash: ...` và `Total cost: ...` là thành công.

### Bước 3: Chạy trang web (Frontend)
1.  Tại Terminal, gõ lệnh:
    ```npm start```
2.  Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://localhost:3000`.

---

## PHẦN 4: HƯỚNG DẪN SỬ DỤNG TRÊN WEB

1.  **Kết nối ví**: Bấm nút **Connect Wallet** trên web -> Chọn ví MetaMask vừa nhập tiền.
2.  **Tạo NFT (Mint)**:
    *   Bấm nút **Create NFT**.
    *   Chọn ảnh, điền tên, mô tả, giá.
    *   Bấm **Mint Now** -> Hệ thống sẽ upload ảnh lên Pinata -> MetaMask hiện lên -> Bấm **Confirm** (Xác nhận).
    *   Đợi một chút, thông báo thành công hiện ra và trang web sẽ tự tải lại. NFT mới sẽ xuất hiện!
3.  **Mua NFT**:
    *   Dùng một ví khác (làm lại Bước 5 phần 2 để nhập tài khoản số 2 vào MetaMask).
    *   Bấm vào NFT muốn mua -> Bấm **Buy NFT**.

---

## PHẦN 5: CÁCH TRUY CẬP IPFS QUA PINATA

1. Khi bạn tạo NFT, ảnh sẽ được lưu trữ trên hệ thống của Pinata.
2. Bạn có thể đăng nhập vào Pinata Dashboard, mục **Files** để quản lý tất cả các ảnh NFT đã tạo.
3. Để xem ảnh công khai, bạn có thể dùng Gateway: `https://gateway.pinata.cloud/ipfs/<CID_Của_Ảnh>` hoặc `https://ipfs.io/ipfs/<CID_Của_Ảnh>`.

---

## PHẦN 6: CÁC LỖI THƯỜNG GẶP & CÁCH SỬA (FAQ)

### 1. Lỗi "Contract not deployed to this network"
*   **Nguyên nhân**: Bạn đang chọn sai mạng trên MetaMask.
*   **Cách sửa**: Mở MetaMask -> Chọn icon 🌐 -> Chọn lại mạng **Localhost 7545** (Chain ID 1337) mà bạn đã tạo.

### 2. Tạo NFT báo lỗi Minting Failed?
*   **Nguyên nhân**: Thường do file `.env` chưa đúng hoặc Key Pinata bị lỗi.
*   **Cách sửa**:
    *   Kiểm tra lại file `.env` xem đã điền đủ 3 dòng Key chưa.
    *   Nhớ **Restart** lại dự án (Tắt `npm start` đi chạy lại) mỗi khi sửa file `.env`.

### 3. Tắt máy mở lại làm sao để chạy tiếp?
*   **Quy trình chuẩn**:
    1.  Mở **Ganache** -> Chọn Workspace `NFT_Project`.
    2.  Mở Terminal -> Chạy `npm start`.
    3.  **KHÔNG** cần làm gì với Pinata cả (nó chạy online).
    4.  **KHÔNG** cần chạy lại `truffle migrate` (trừ khi muốn reset dữ liệu).
    5.  Vào web dùng bình thường.

---
*Chúc bạn và nhóm thành công với dự án NFT Marketplace!*
