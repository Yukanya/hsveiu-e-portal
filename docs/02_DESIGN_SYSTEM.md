# HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM) — HSV EIU PORTAL
**Đồng bộ Ngôn ngữ Thiết kế Chính thức của Trường ĐH Quốc tế Miền Đông (`https://eiu.edu.vn/`), Nguyên tắc Apple HIG & Chuẩn Truy cập WCAG 2.1 AA**

---

## 1. Triết lý Thiết kế Cốt lõi (Design Philosophy)

Hệ thống Cổng thông tin Điện tử & E-Office Hội Sinh viên Trường Đại học Quốc tế Miền Đông (HSV EIU) kết hợp **Bản sắc Thương hiệu Đại học Quốc tế Miền Đông (`eiu.edu.vn`)** với **3 Nguyên tắc Cốt lõi của Apple Human Interface Guidelines (HIG)**:

1. **Clarity (Sự Rõ ràng & Minh bạch):**
   - Loại bỏ hoàn toàn hiện tượng "nhồi nhét badge" (tối đa **02 nhãn trạng thái** trên mỗi thẻ).
   - Cỡ chữ tối thiểu cho nhãn phụ (caption/badge) là **`12px` (`text-xs`)**, văn bản nội dung **`14px–16px` (`text-sm` / `text-base`)**, tiêu đề phân cấp rõ ràng bằng font **`Montserrat`** (chuẩn `eiu.edu.vn`) kết hợp **`Be Vietnam Pro`**.
2. **Deference (Tôn vinh Nội dung & Không gian thở):**
   - Sử dụng nền trắng tinh khiết (`#FFFFFF`) xen kẽ nền xám sáng EIU (`#F5F5F5`), khoảng cách giữa các phân khu rộng rãi (`py-14` đến `py-20`), khung chuẩn `max-w-6xl` (`1140px` – đúng chuẩn container của `eiu.edu.vn`).
   - Thanh chuyển đổi vai trò Demo (`PersonaSwitcherBar`) được thu gọn tinh tế vào **Top Utility Bar (`#133F68`)** chuẩn EIU, chỉ bung bảng chọn chi tiết khi người dùng nhấp mở.
3. **Depth & Progressive Disclosure (Chiều sâu & Tiết lộ Thông tin theo Lớp):**
   - Không xếp chồng 7–8 bảng dữ liệu dài trên cùng một màn hình.
   - Tại **Hồ sơ Hội viên (`/portal`)** và **E-Office (`/workspace`)**, sử dụng **Segmented Control / View Switcher** kiểu macOS/iPadOS để người dùng tập trung vào đúng 1 nhóm tác vụ tại một thời điểm.

---

## 2. Bảng Màu Chính thức (Trích xuất từ `https://eiu.edu.vn/` & Nhận diện HSV)

| Vai trò | Tên Token | Mã Hex | Nguồn gốc & Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `eiu-navy` | `#133F68` | Màu chủ đạo chính thức của `eiu.edu.vn` (`--e-global-color-secondary`). Dùng cho Top Utility Bar, Footer, Tiêu đề lớn, Nút hành động chính và Sidebar E-Office. |
| **Union Primary** | `hsv-blue` | `#0054A6` | Màu xanh Hội Sinh viên Việt Nam. Dùng cho huy hiệu Hội, thẻ Hội viên số, nút nghiệp vụ SV5T & tiến độ. |
| **Warm Gold Accent** | `eiu-gold` | `#A68556` | Màu vàng đồng học thuật của `eiu.edu.vn` (`--e-global-color-accent`). Dùng cho đường kẻ nhấn, trạng thái active/hover trên thanh điều hướng, viền chứng nhận danh hiệu SV5T. |
| **Champagne Text** | `eiu-sand` | `#DED1BE` | Màu chữ vàng kem trên nền xanh `#133F68` tại Footer `eiu.edu.vn`. |
| **Highlight Amber** | `eiu-amber` | `#FCB900` | Màu nhấn nổi bật trên nền `#133F68` cho mục đang chọn. |
| **Alert Crimson** | `eiu-crimson` | `#C10230` | Màu đỏ đô EIU (`--e-global-color-2750f59`), dùng cho thông báo khẩn hoặc cảnh báo quá hạn SLA. |
| **Surface Primary** | `surface-white` | `#FFFFFF` | Nền Header chính, nền Thẻ (Card), Bảng dữ liệu. |
| **Canvas Background** | `canvas-gray` | `#F5F5F5` | Nền tổng thể trang web và các dải phân khu xen kẽ (chuẩn `post-7.css` của `eiu.edu.vn`). |
| **Text Primary** | `text-primary` | `#0F172A` | Chữ chính (độ tương phản $> 15:1$ trên nền trắng). |
| **Text Secondary** | `text-secondary` | `#475569` | Chữ mô tả phụ (độ tương phản $> 7:1$ trên nền trắng, đạt chuẩn WCAG AAA). |

---

## 3. Hệ thống Chữ viết (Typography)

- **Heading & Navigation Font (`--font-montserrat`):** **`Montserrat`** (Weights: `500`, `600`, `700`, `800`) — đồng bộ 100% với `--e-global-typography-primary-font-family: "Montserrat"` trên `https://eiu.edu.vn/`.
- **Body & UI Font (`--font-be-vietnam`):** **`Be Vietnam Pro`** (Weights: `400`, `500`, `600`, `700`) — tối ưu dấu tiếng Việt cho văn bản hành chính, biểu mẫu và bảng dữ liệu dài.
- **Monospace Font (`--font-jetbrains-mono`):** **`JetBrains Mono`** — hiển thị Mã số sinh viên 10 chữ số, GPA, số hiệu Quyết định (`09/QĐ-HSV`, `28/QĐ-HSV`) và đồng hồ SLA 07 ngày.

---

## 4. Cấu trúc Header 2 Tầng Chuẩn `eiu.edu.vn`

1. **Tầng 1 — Top Utility Bar (`bg-[#133F68] text-white`):**
   - Bên trái: Liên kết phân luồng đối tượng đúng phong cách `eiu.edu.vn`: `SINH VIÊN | CÁN BỘ HỘI | TRA CỨU GCN | VĂN BẢN PHÁP LÝ`.
   - Bên phải: Nút chuyển đổi nhanh **Ngữ cảnh Kiêm nhiệm & Đóng vai Demo** (hiển thị gọn tên cán bộ + cấp quyền, bấm vào mới mở khay chuyển đổi chi tiết).
2. **Tầng 2 — Main Navigation Bar (`bg-white border-b border-slate-200`):**
   - Bên trái: Logo chính thức của **Trường Đại học Quốc tế Miền Đông (`/images/eiu-logo.png`)** đặt cạnh biểu trưng **Hội Sinh viên EIU Khóa II**.
   - Chính giữa: Menu điều hướng in hoa gọn gàng bằng font `Montserrat` (`13px–14px`, `font-semibold`, màu `#133F68`, gạch chân màu vàng đồng `#A68556` khi active).
   - Bên phải: Nút **Sổ tay SV5T (`/portal`)**, **E-Office (`/workspace`)** và **Đăng nhập `@eiu.edu.vn`**.

---

## 5. Tiêu chuẩn Khả năng Truy cập (Accessibility — WCAG 2.1 AA & Apple HIG)

1. **Điều hướng Bàn phím & Skip Link:** Có liên kết `"Chuyển tới nội dung chính"` (`href="#main-content"`) hiển thị ngay khi nhấn phím `Tab` đầu tiên.
2. **Vùng chạm Tối thiểu (Touch Targets):** Mọi nút bấm, tab chuyển đổi, ô nhập liệu đều có chiều cao tối thiểu `40px–44px` (`min-h-10` / `min-h-11`).
3. **Độ tương phản Màu sắc (Contrast Ratio):** Không dùng chữ xám nhạt dưới `slate-500` trên nền sáng; trên nền `#133F68` chỉ dùng `#FFFFFF`, `#DED1BE` hoặc `#FCB900` (đạt tỷ lệ tương phản $\ge 4.5:1$).
4. **Ngữ nghĩa HTML & ARIA:** Đầy đủ `main#main-content`, `nav[aria-label]`, `aria-current="page"`, `role="tablist"`, `role="tab"`, `aria-selected`, `aria-expanded` và `<label htmlFor>` cho mọi trường dữ liệu.
