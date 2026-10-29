# BỘ QUY CHUẨN THIẾT KẾ CỐT LÕI (EIU DESIGN SPECIFICATION)
**Chuẩn hóa 100% theo Ngôn ngữ Thiết kế Thực tế của `eiu.edu.vn` & `lib.eiu.edu.vn`**

---

## 1. Nguyên tắc Tối thượng: "Tinh gọn – Học thuật – Không giải thích rườm rà" (Zero Over-explaining)

1. **Không giải thích quy chế dài dòng trên giao diện:**
   - Tuyệt đối **bỏ** các đoạn văn giải thích luật/quyết định dài 3–4 dòng dưới mỗi tiêu đề.
   - Mỗi thẻ (Card) chỉ gồm tối đa **3 thành phần**: **Tiêu đề ngắn** + **1 câu mô tả (tối đa 2 dòng)** + **Liên kết `> XEM THÊM`**.
2. **Không lạm dụng Badge / Tag màu sắc:**
   - Loại bỏ toàn bộ các pill/badge trạng thái xanh đỏ tím vàng rườm rà trên các thẻ nội dung.
3. **Định danh Thương hiệu Đồng bộ (`EIU | STUDENT UNION` / `EIU | HỘI SINH VIÊN`):**
   - Thiết kế cụm Logo Header & Footer theo đúng cấu trúc `EIU | LIBRARY` của `lib.eiu.edu.vn`:
     `[Logo EIU]  |  HỘI SINH VIÊN` (màu `#133F68`, font chữ trang trọng).

---

## 2. Bảng Màu Quy Chuẩn (Trích xuất từ 5 Giao diện Mẫu `eiu.edu.vn` & `lib.eiu.edu.vn`)

| Nhóm màu | Mã Hex | Vai trò trong Giao diện |
| :--- | :--- | :--- |
| **EIU Primary Navy** | `#133F68` | Thanh Top Bar trên cùng, Nền Footer, Thanh tiêu đề bảng/form (như trang *Đặt phòng học*), Tiêu đề Section & Tiêu đề Card. |
| **EIU Crimson Red** | `#C10230` | Khối hình thang nghiêng trên Banner trang con, Nút Tab đang chọn (`TIN TỨC`), Mục đang chọn trên Menu dọc cột trái (`Hội đồng trường`), Khối thông tin nổi bật bên phải (`Thông tin đặt phòng`). |
| **EIU Warm Sand / Beige** | `#EAE3D2` | Nền các mục chưa chọn trong Menu dọc cột trái (như trang *Đội ngũ EIU*), chữ phụ trên Footer (`#DED1BE`). |
| **EIU Gold / Bronze** | `#A68556` | Nút tìm kiếm (`Search`), điểm nhấn học thuật. |
| **Bento Block Colors** | `#133F68` (Navy)<br>`#B44425` (Cam đất)<br>`#52813B` (Xanh ô-liu)<br>`#4E4E50` (Xám than)<br>`#C10230` (Đỏ đô) | Màu nền cho nửa trái của các **Thẻ Ghép Đôi 50/50 (Split Feature Cards)** trên Trang chủ (giống mục *Giới thiệu*, *Tuyển sinh*, *Room Reservation*). |
| **Action Blue (Form)** | `#0D6EFD` / `#0054A6` | Nút `Lưu` / `Xác nhận` trong các biểu mẫu tác nghiệp (như nút `Lưu` bên cạnh nút `Hủy` trên `lib.eiu.edu.vn`). |
| **Nền & Đường kẻ** | `#FFFFFF` (Trắng)<br>`#F5F5F5` (Xám nhạt)<br>`#EFEFEF` (Xám bảng)<br>`#E5E7EB` (Viền mảnh) | Nền Header chính `#FFFFFF`, nền dải Breadcrumb & vùng tìm kiếm `#F5F5F5`, tiêu đề bảng/accordion phụ `#EFEFEF`. |

---

## 3. Quy chuẩn Font chữ, Cỡ chữ & Khoảng cách dòng (Typography Scale)

- **Font chữ chính (`Primary Font`):** **`Montserrat`** (hoặc `Be Vietnam Pro` đồng bộ độ dày) cho toàn bộ Heading, Menu, Nút bấm và Nội dung ngắn.
- **Hệ thống phân cấp cỡ chữ (Type Scale):**

| Cấp độ (Level) | Cỡ chữ (`font-size`) | Độ đậm (`font-weight`) | Chiều cao dòng (`line-height`) | Quy cách hiển thị |
| :--- | :--- | :--- | :--- | :--- |
| **Top Utility Bar** | `11px – 12px` | `500` (Medium) | `1.4` | IN HOA (`TRƯƠNG CHÂU PHƯỚC LỘC (MSSV) \| TRA CỨU GCN \| E-OFFICE`), chữ trắng trên nền `#133F68`. |
| **Main Nav Menu** | `13px – 14px` | `600 / 700` | `1.4` | IN HOA trên `eiu.edu.vn` hoặc Title Case gọn trên `lib.eiu.edu.vn`, màu `#133F68`. |
| **Banner Overlay Title (H1)** | `24px – 28px` | `700` (Bold) | `1.25` | Chữ trắng đặt trong khối hình thang nghiêng `#C10230`, phía trên có vạch ngang trắng `—` dài `36px`. |
| **Section Heading (H2)** | `20px – 24px` | `700` (Bold) | `1.3` | Màu `#133F68`, IN HOA căn giữa (`TUYỂN SINH`, `TIN TỨC & SỰ KIỆN`) hoặc căn trái (`HỘI ĐỒNG TRƯỜNG`, `THÔNG TIN HỌC PHÍ`). |
| **Table / Form Bar Header** | `14px – 15px` | `700` (Bold) | `1.4` | Chữ trắng trên dải nền `#133F68` cao `40px` (`Đặt phòng`, `Mô tả`). |
| **Card Title (H3)** | `15px – 16px` | `700` (Bold) | `1.35` | Màu `#133F68` (trên nền trắng) hoặc `#FFFFFF` (trên thẻ màu). |
| **Body / Table Text** | `13.5px – 14px` | `400` (Regular) | `1.6` | Màu `#333333` / `#4E4E50`, ngắn gọn, tối đa 2–3 dòng trong thẻ. |
| **Card Footer Link** | `11px – 12px` | `600` (SemiBold) | `1.4` | IN HOA màu `#133F68` hoặc `#0054A6`: `> XEM THÊM`, `> TIN TỨC`, `> ĐĂNG KÝ`. |

---

## 4. Quy chuẩn Bo góc (Border Radius) & Khung Lưới (Grid & Spacing)

1. **Quy tắc Bo góc (Sharp & Architectural):**
   - **Thẻ (Cards), Khối ảnh, Bảng (Tables), Thanh tiêu đề `#133F68`, Menu dọc cột trái:** **`0px` (`rounded-none`)** — vuông vức, sắc nét tuyệt đối giống 100% hình chụp `eiu.edu.vn` và `lib.eiu.edu.vn`.
   - **Ô nhập liệu (Input, Select) & Nút bấm hành động (`Hủy`, `Lưu`, `Search`):** Bo góc nhẹ **`4px` (`rounded`)**.
   - **Nút chuyển Tab (`TIN TỨC` / `SỰ KIỆN`) & Nút lối tắt dưới thanh Search:** Bo tròn hoàn toàn **`9999px` (`rounded-full`)**.
2. **Khung Lưới (Container & Grid):**
   - Độ rộng khung chuẩn: **`1140px` (`max-w-[1140px]`)**, căn giữa màn hình.
   - Khoảng cách giữa các thẻ trong lưới (Grid Gap): **`16px – 20px` (`gap-4` / `gap-5`)**.
   - Khoảng cách giữa các Section lớn: **`48px – 64px` (`py-12` / `py-16`)**.

---

## 5. 06 Mẫu Thiết kế Đặc trưng (Signature Design Patterns) Áp dụng vào Cổng HSV EIU

1. **Header 2 Tầng chuẩn EIU / EIU Library:**
   - Tầng trên (`#133F68`, cao `34px`): Bên phải hiển thị tên người dùng đang đăng nhập `TRƯƠNG CHÂU PHƯỚC LỘC (MSSV) ▾ | HỒ SƠ SV5T | E-OFFICE | TRA CỨU GCN`.
   - Tầng dưới (`#FFFFFF`, cao `76px`): Bên trái là `EIU | HỘI SINH VIÊN`, bên phải là 6 mục menu gọn gàng.
2. **Banner Trang Con với Khối Đỏ Đô Nghiêng (`#C10230` Slanted Overlay) + Dải Breadcrumb `#F5F5F5`:**
   - Dùng cho các trang `/gioi-thieu`, `/to-chuc`, `/su-kien`, `/van-ban`, `/tra-cuu-gcn`, `/portal`.
3. **Bố cục Trang Con Có Menu Dọc Cột Trái (3/9 Layout — Mẫu trang `Đội ngũ EIU`):**
   - Cột trái (3 phần): Menu dọc góc vuông — mục đang chọn màu **Đỏ đô `#C10230` chữ trắng**, các mục khác màu **Vàng kem `#EAE3D2` chữ đen**.
   - Cột phải (9 phần): Hiển thị nội dung của đúng mục đang chọn (ví dụ: ở trang *Bộ máy*, chọn *Ban Chấp hành* | *Ban Thư ký* | *Ban Kiểm tra* | *Văn phòng* | *Ban TC-XDH* | *Ban TG-PT*; ở trang *Hồ sơ SV*, chọn *Tiến độ SV5T* | *Máy tính GPA* | *Đặt lịch / Hộp thư*).
4. **Lưới Thẻ Bento Ghép Đôi 50/50 & Thẻ Dọc Vuông Vức (Mẫu Trang chủ `eiu.edu.vn` & `lib.eiu.edu.vn`):**
   - Kết hợp thẻ ngang 50/50 (1 bên nền màu đặc `#133F68` / `#C10230` / `#52813B` / `#B44425`, 1 bên hình ảnh) và thẻ dọc 4 cột (ảnh trên, chữ dưới, đáy có `> XEM THÊM`).
5. **Nút Chuyển Tab Viên Thuốc Đỏ/Trắng (`#C10230` Pill Switcher):**
   - Đặt ngay dưới tiêu đề Section căn giữa (ví dụ: chuyển giữa `[ TIN TỨC ]` và `[ SỰ KIỆN ]`, hoặc `[ 30 CÂU LẠC BỘ ]` và `[ 25 CHI HỘI ]`).
6. **Bảng & Biểu mẫu Thanh Ngang `#133F68` + Khối Tóm tắt Đỏ `#C10230` (Mẫu trang `Đặt phòng học` & `Học phí`):**
   - Dùng cho **Hồ sơ SV5T (`/portal`)**, **Tra cứu GCN (`/tra-cuu-gcn`)** và **E-Office (`/workspace`)**: Dải tiêu đề từng mục màu `#133F68` chữ trắng, các dòng dữ liệu 2 cột gọn gàng, bên phải có hộp tóm tắt màu đỏ `#C10230` kèm gạch trắng `—`.
