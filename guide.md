# HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG NFT MARKETPLACE (CHI TIẾT TỪ A-Z)

Chào mừng bạn! Tài liệu này sẽ hướng dẫn bạn từng bước để chạy dự án NFT Marketplace trên máy tính cá nhân. Dù bạn chưa biết gì cũng có thể làm được nếu làm đúng theo thứ tự dưới đây.

---

## PHẦN 1: CHUẨN BỊ CÔNG CỤ (CÀI ĐẶT PHẦN MỀM)

Trước khi chạy code, bạn cần cài đặt 4 phần mềm sau vào máy tính:

1.  **Node.js**: Môi trường chạy code Javascript.
    *   Tải tại: `https://nodejs.org/` (Chọn bản LTS).
2.  **Ganache**: Giả lập mạng Blockchain Ethereum trên máy cá nhân.
    *   Tải tại: `https://trufflesuite.com/ganache/`
3.  **IPFS Desktop**: Phần mềm lưu trữ ảnh phi tập trung.
    *   Tải tại: `https://github.com/ipfs/ipfs-desktop/releases`
4.  **MetaMask**: Ví điện tử để giao dịch (Cài Extension trên Chrome/Edge).
    *   Tải tại: `https://metamask.io/`

---

## PHẦN 2: CẤU HÌNH MÔI TRƯỜNG (QUAN TRỌNG)

### Bước 1: Cấu hình IPFS Desktop (Để upload được ảnh)
Mặc định IPFS chặn kết nối từ bên ngoài, bạn cần mở khóa (CORS) cho nó.

1.  Mở **IPFS Desktop**.
2.  Vào tab **Settings** (Cài đặt).
3.  Kéo xuống tìm mục **IPFS Config** (file cấu hình dạng chữ).
4.  Tìm đoạn `"API"` -> `"HTTPHeaders"`. Sửa lại giống hệt như sau:

```json
"API": {
  "HTTPHeaders": {
    "Access-Control-Allow-Origin": [
      "*"
    ],
    "Access-Control-Allow-Methods": [
      "PUT", "POST"
    ]
  }
}
```
5.  **QUAN TRỌNG**: Sau khi sửa xong, bạn phải **Tắt hẳn IPFS Desktop** và mở lại.
    *   *Lưu ý*: Bấm dấu X nó chỉ thu xuống khay hệ thống (góc dưới cùng bên phải màn hình, cạnh đồng hồ). Bạn  mở Task Manager (Ctrl + Shift + Esc), tìm IPFS Desktop và bấm End Task để tắt hẳn. Sau đó mở lại app.

### Bước 2: Cấu hình Ganache (Tạo mạng Blockchain riêng)
Để dữ liệu không bị mất khi tắt máy, chúng ta sẽ tạo một không gian làm việc cố định.

1.  Mở **Ganache**.
2.  Chọn **NEW WORKSPACE**.
3.  Đặt tên ở ô **Workspace Name**: `NFT_Project`.
4.  Chuyển sang tab **Server** (ở tab bên cạnh).
5.  Sửa **Port Number** thành: `7545`.
6.  Bấm nút **Start** (Góc trên bên phải).
    *   Lúc này Ganache sẽ hiện ra danh sách 10 tài khoản có sẵn 100 ETH. Giữ nguyên cửa sổ này.

### Bước 3: Cấu hình MetaMask (Kết nối ví với Ganache)
1.  Mở trình duyệt, bấm vào icon con cáo **MetaMask**.
2.  Bấm vào Tuỳ chọn -> Mạng -> **Add a network manually** (Thêm mạng tuỳ chỉnh).
3.  Điền thông tin sau:
    *   **Network Name**: `Localhost 7545`
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **Chain ID**: `1337`
    *   **Currency Symbol**: `ETH`
4.  Bấm **Save**.

### Bước 4: Nhập tiền vào ví (Import Account)
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
    *   Bấm **Mint Now** -> MetaMask hiện lên -> Bấm **Confirm** (Xác nhận).
    *   Đợi một chút, thông báo thành công hiện ra và trang web sẽ tự tải lại. NFT mới sẽ xuất hiện!
3.  **Mua NFT**:
    *   Dùng một ví khác (làm lại Bước 4 phần 2 để nhập tài khoản số 2 vào MetaMask).
    *   Bấm vào NFT muốn mua -> Bấm **Buy NFT**.

---

## PHẦN 5: CÁCH TRUY CẬP IPFS VỚI CID

1. Mở trang localhost:3000, nhấn chuột phải vào bức ảnh NFT bạn vừa tạo -> Chọn **Open Image in New Tab** (Mở hình ảnh trong thẻ mới)
2. Nhìn lên thanh địa chỉ, bạn sẽ thấy đường dẫn có dạng: http://127.0.0.1:8080/ipfs/QmXyz123... -> Cái đoạn QmXyz123... chính là CID của bạn.
3. Bạn có thể mở tab mới và gõ `https://ipfs.io/ipfs/` -> Dán CID vào -> Enter.

---

## PHẦN 6: CÁC LỖI THƯỜNG GẶP & CÁCH SỬA (FAQ)

### 1. Lỗi "Contract not deployed to this network"
*   **Nguyên nhân**: Bạn đang chọn sai mạng trên MetaMask.
*   **Cách sửa**: Mở MetaMask -> Chọn icon 🌐 -> Chọn lại mạng **Localhost 7545** (Chain ID 1337) mà bạn đã tạo.

### 2. Tạo NFT xong nhưng không thấy ảnh hiện ra?
*   **Nguyên nhân**: IPFS Desktop chưa chạy hoặc bị chặn cổng.
*   **Cách sửa**:
    *   Đảm bảo phần mềm **IPFS Desktop đang mở**.
    *   Kiểm tra xem bạn đã cấu hình CORS (Phần 2, Bước 1) chưa. Nếu chưa thì làm lại và nhớ **Tắt hẳn IPFS rồi mở lại**.

### 3. Tắt máy mở lại làm sao để chạy tiếp?
*   **Quy trình chuẩn**:
    1.  Mở **Ganache** -> Chọn Workspace `NFT_Project`.
    2.  Mở **IPFS Desktop**.
    3.  Mở Terminal -> Chạy `npm start`.
    4.  **KHÔNG** cần chạy lại `truffle migrate` nữa (trừ khi bạn muốn xóa sạch làm lại từ đầu).
    5.  Vào web dùng bình thường.

### 4. Thư mục `.ipfs` trong máy là gì?
*   Đó là kho chứa dữ liệu của phần mềm IPFS Desktop. 
*   **Vị trí**: Nó nằm ở thư mục ẩn `C:\Users\ADMIN\.ipfs` (hoặc bạn gõ `%USERPROFILE%\.ipfs` vào thanh địa chỉ của File Explorer rồi Enter).
*   **Cách lưu trữ**: 
    * Bạn sẽ thấy thư mục tên là `blocks`. Tuy nhiên, nếu bạn mở vào đó, bạn sẽ KHÔNG THẤY file ảnh .png hay .jpg nào cả. 
    * Bạn chỉ thấy rất nhiều file có tên loằng ngoằng (ví dụ CIQ...data).
* **Tại sao lại thế?**: IPFS không lưu nguyên file như Windows. Nó "băm" bức ảnh của bạn ra thành nhiều mảnh nhỏ (blocks), mã hóa chúng, rồi vứt lộn xộn vào thư mục blocks đó. Chỉ có phần mềm IPFS Desktop mới có "bản đồ" để gom các mảnh đó lại và hiển thị thành bức ảnh hoàn chỉnh cho bạn xem.
* **Lời khuyên**: Bạn có thể vào xem cho biết, nhưng tuyệt đối đừng xóa hay sửa file trong đó nhé, lỗi database là hỏng hết dữ liệu.

---
*Chúc bạn thành công với dự án NFT Marketplace!*
