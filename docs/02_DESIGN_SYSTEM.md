# BỘ QUY CHUẨN THIẾT KẾ CỐT LÕI (EIU × HSV DESIGN SPECIFICATION)
**Chuẩn hóa từ `KNOWLEDGE/eiu-styles/eiu-guideline.css` (15 giao diện thực tế `eiu.edu.vn` & `lib.eiu.edu.vn`) kết hợp Bản sắc Hội Sinh viên Việt Nam**

---

## 1. Triết lý Hòa phối Thương hiệu: "70% Di sản Học thuật EIU × 30% Bản sắc Thanh niên HSV"

1. **Đồng bộ Hệ sinh thái Đại học Quốc tế Miền Đông (70% EIU Heritage):**
   - Kế thừa trọn vẹn khung lưới kiến trúc góc vuông `0px`, hệ màu Xanh Navy `#133F68` / `#144069`, Đỏ đô `#C10230`, Vàng đồng `#A68556`, Kem `#EAE3D2`, bảng biểu thanh ngang `#133F68` và đặc biệt là **Footer học thuật font có chân `Crimson Text` `17px` màu `#DED1BE`**.
2. **Bản sắc Chuyển đổi số Hội Sinh viên (30% HSV Youth Identity):**
   - Đưa **Xanh Hội Sinh viên (`#0054A6`)** và **Cyan Điểm nhấn (`#00BCFF` — `--eiu-cyan-badge`)** vào huy hiệu chuyên mục, thanh tiến độ rèn luyện SV5T, chỉ báo đăng ký sự kiện, thẻ Hội viên số và đồ họa tiêu đề thẻ.
3. **Tinh gọn – Chính xác – Không lặp tiêu đề (Zero Redundancy):**
   - Cấm tuyệt đối việc dùng hộp màu trơn in lặp lại tiêu đề thẻ 2 lần. Mỗi thẻ sử dụng **Card Header Đồ họa Kiến trúc (Architectural Graphic Header)** hiển thị mã đơn vị/chuyên mục và chỉ số định lượng nổi bật (`+5.0 Ngày TN`, `Top 10%`, `120 TV`, `05 TH11`), còn tiêu đề chính chỉ xuất hiện **đúng 01 lần** ở thân thẻ.
4. **Định danh Thương hiệu Đồng bộ (`[Logo EIU] | [Logo HSV] HỘI SINH VIÊN / STUDENT UNION`):**
   - Áp dụng thống nhất trên Sticky Header và Footer học thuật theo chuẩn cấu trúc đơn vị trực thuộc EIU.

---

## 2. Hệ Màu Quy Chuẩn (Chromatic Architecture)

| Nhóm Vai trò | Mã Hex | Nguồn gốc & Quy tắc Ứng dụng |
| :--- | :--- | :--- |
| **EIU Institutional Navy** | `#133F68`<br>`#144069`<br>`#02294E` | **Màu xương sống toàn hệ thống**: Top Utility Bar, Footer (`#133F68`), Dropdown Menu (`#144069` chuẩn `post-5773.css`), Thanh tiêu đề Bảng/Biểu mẫu, Tiêu đề Section, Nền Hero chuyên sâu (`#02294E`). |
| **HSV Signature Youth Blue** | `#0054A6`<br>`#00BCFF` | **Màu nhận diện Hội Sinh viên**: Nhãn chuyên mục bài viết (`#00BCFF` chuẩn `post-5065.css`), Thanh tiến độ SV5T/Sự kiện, Huy hiệu Hội viên, Liên kết hành động dành cho sinh viên. |
| **EIU Academic Gold & Sand** | `#A68556`<br>`#EAE3D2`<br>`#DED1BE` | `#A68556` cho trạng thái Hover menu, nút Tra cứu, ngày đăng bài; `#EAE3D2` cho nền các mục chưa chọn ở Menu dọc cột trái; `#DED1BE` cho chữ `Crimson Text` trên Footer `#133F68`. |
| **EIU Crimson & Active Amber** | `#C10230`<br>`#FCB900` | `#C10230` dành cho Khối đa giác nghiêng trên Banner, Tab/Menu dọc đang chọn, Hộp thông tin tóm tắt và cảnh báo SLA; `#FCB900` đánh dấu mục đang active trên nền Navy tối. |
| **EIU Bento Semantic Tiles** | `#51803A` (Xanh Campus)<br>`#B44625` (Cam đất)<br>`#EEB31D` (Vàng hổ phách) | Trích xuất từ `post-18.css` & `post-555.css`: `#51803A` cho **Sự kiện Xanh (UN SDGs) & Tập thể SV5T**; `#B44625` cho **Cá nhân SV5T Tiêu biểu**; `#EEB31D` cho **Thi đua & Kỹ năng Hội nhập**. |
| **Nền Nhịp điệu (Surfaces)** | `#FFFFFF`<br>`#F5F5F5`<br>`#EFEFEF` | Xen kẽ có chủ đích giữa các Section (`#FFFFFF` ↔ `#F5F5F5` ↔ `#133F68`), tiêu đề accordion phụ `#EFEFEF`, đường viền chuẩn `#D9D9D9` / `#E2E8F0`. |

---

## 3. Hệ thống Chữ viết 4 Tầng (4-Tier Typography Scale)

| Tầng chữ | Font Family | Weights | Cỡ chữ & Quy cách Hiển thị |
| :--- | :--- | :--- | :--- |
| **1. Heading, Nav & CTA** | `Montserrat` | `500, 600, 700, 800` | Banner H1 `24px – 32px`, Section H2 `22px – 26px` IN HOA `#133F68`, Card H3 `16px – 17px`, Main Nav `13.5px – 14px` Bold, Dropdown Item `13.5px`. |
| **2. Nội dung & Bảng biểu** | `Be Vietnam Pro` | `400, 500, 600, 700` | Cỡ chữ chuẩn **`14px`** (`line-height: 1.65`), đảm bảo dấu tiếng Việt trong văn bản pháp lý, bài viết và bảng quản trị E-Office rõ nét, thoáng mắt. |
| **3. Footer Học thuật** | `Crimson Text` (Serif) | `400, 600, 700` | Cỡ chữ **`17px`** (`line-height: 1.5`), tiêu đề cột `#FFFFFF` SemiBold, liên kết `#DED1BE` Regular (hover `#FFFFFF`) chuẩn `post-157.css` của `eiu.edu.vn`. |
| **4. Mã định danh & Số liệu** | `JetBrains Mono` | `400, 500, 600, 700` | Cỡ chữ `12.5px – 14px` cho MSSV 10 chữ số, Số hiệu văn bản (`28/QĐ-HSV`), Mã Chi hội (`25CNTT01`), điểm GPA và đồng hồ SLA. |

---

## 4. Quy chuẩn Hình học & Khung Lưới 3 Khu vực (Geometry & Layout Grids)

1. **Quy tắc Bo góc (Sharp & Architectural):**
   - **Card, Ảnh bìa, Dropdown Panel `#144069`, Bảng dữ liệu, Accordion, Menu dọc cột trái:** **`0px` (`rounded-none`)**.
   - **Ô nhập liệu (`input`, `select`, `textarea`) & Nút tác nghiệp biểu mẫu:** **`3px – 4px` (`rounded`)**.
   - **Nút chuyển Tab (`TIN TỨC` / `SỰ KIỆN`) & Chip bộ lọc nhanh:** **`9999px` (`rounded-full`)**.
2. **Khung Lưới theo Đặc thù Khu vực:**
   - **Khu vực Công khai `(public)`:** Khung chuẩn **`1140px` (`max-w-[1140px]`)** căn giữa; trang danh mục dùng lưới `3/9` (Menu dọc trái `#C10230` / `#EAE3D2` + Nội dung phải `9/12`); trang đọc bài/chi tiết dùng lưới `8/4` hoặc `7/5`.
   - **Khu vực Hội viên `(student-portal)` & E-Office Nội bộ `(workspace)`:** Khung rộng **`1200px` (`max-w-[1200px]` — `--eiu-container-wide`)** kết hợp **`Command Header` sắc gọn** và lưới **`3/9`**, dành trọn `9/12` cột cho bảng xét duyệt 25 Chi hội, Hội đồng SV5T 3 cấp, xuất Phụ lục 1, Máy tính GPA và Phòng thi Online Quiz.
