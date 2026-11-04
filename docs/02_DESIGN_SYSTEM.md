# BỘ QUY CHUẨN THIẾT KẾ CỐT LÕI (EIU × HSV DESIGN SPECIFICATION)
**Quy chuẩn Chuẩn hóa Toàn diện từ Kiến trúc Đại học Quốc tế Miền Đông (`eiu.edu.vn`) kết hợp Bản sắc Số Hội Sinh viên Khóa II (2026 – 2028)**

---

## 1. Triết lý Hòa phối Thương hiệu: "70% Di sản Học thuật EIU × 30% Bản sắc Thanh niên HSV"

1. **Đồng bộ Hệ sinh thái Đại học Quốc tế Miền Đông (70% EIU Heritage):**
   - Kế thừa trọn vẹn khung lưới kiến trúc góc vuông **`0px` (`rounded-none` / `rounded-xs`)**.
   - Hệ màu Xanh Navy học thuật chuẩn xác:
     - `#02294E` (Midnight Deep Navy — Nền Hero chuyên sâu, nền Carousel SV5T, thẻ tiêu điểm).
     - `#133F68` (Institutional Navy — Tiêu đề Section H1/H2, thanh khẩu hiệu, nền Footer học thuật).
     - `#144069` (Dropdown Panel Navy — chuẩn `post-5773.css` của `eiu.edu.vn`).
   - Sắc màu đồng hành trang trọng: Vàng đồng `#A68556` (viền nóc, hover menu), Kem `#EAE3D2` (nền hover pill), Cát ngà `#DED1BE` (chữ Chân trang).
   - **Footer học thuật font có chân `Crimson Text` `14px – 17px` màu `#DED1BE`**.
2. **Bản sắc Chuyển đổi số Hội Sinh viên (30% HSV Youth Identity):**
   - Đưa **Xanh biểu trưng Hội Sinh viên (`#0054A6`)** và **Cyan Điểm nhấn (`#00BCFF` — `--eiu-cyan-badge`)** vào huy hiệu chuyên mục, thanh tiến độ rèn luyện SV5T, chỉ báo đăng ký sự kiện, thẻ Hội viên số và đồ họa tiêu đề thẻ.
   - Điểm nhấn **Đỏ đô EIU (`#C10230`)** trên khối đa giác cắt xiên $91^\circ$ tại Hero, tab đang chọn, gạch chân section và nhãn cảnh báo.
   - Điểm nhấn **Vàng hổ phách (`#FCB900`)** cho các nút hành động chính (CTA Gateway), chữ tiêu đề phụ nghệ thuật ("Sinh viên 5 tốt"), nhãn "TIÊU ĐIỂM" và thanh tiến độ active.
3. **Tinh gọn – Chính xác – Không lặp tiêu đề (Zero Redundancy):**
   - Cấm tuyệt đối việc dùng hộp màu trơn in lặp lại tiêu đề thẻ 2 lần. Mỗi thẻ sử dụng **Card Header Đồ họa Kiến trúc (Architectural Graphic Header, chiều cao `h-36`)** hiển thị mã đơn vị/chuyên mục và chỉ số định lượng nổi bật (`+5.0 Ngày TN`, `Top 10%`, `120 TV`, `05 TH11`), còn tiêu đề chính chỉ xuất hiện **đúng 01 lần** ở thân thẻ.
4. **Định danh Thương hiệu Kép Đồng bộ:**
   - Trên Sticky Header: `[Logo EIU] | [Logo HSV] HỘI SINH VIÊN / STUDENT ASSOCIATION`.
   - Trên Footer: Cụm logo EIU trắng song hành cùng Biểu trưng HSV với slogan nhiệm kỳ: *“Trí sáng - Đồng tâm - Vươn tầm - Cất cánh”*.

---

## 2. Hệ Màu Quy Chuẩn (Chromatic Architecture)

| Nhóm Vai trò | Mã Hex | Nguồn gốc & Quy tắc Ứng dụng Bắt buộc |
| :--- | :--- | :--- |
| **EIU Midnight Navy** | `#02294E` | **Màu nền chiều sâu**: Nền Hero chính, nền Phân vùng Carousel SV5T, thẻ bài viết tiêu điểm 01, Header thẻ sự kiện. |
| **EIU Institutional Navy** | `#133F68` | **Màu xương sống**: Nền Footer học thuật, màu chữ tiêu đề H1/H2/H3, thanh slogan học thuật, đường viền active. |
| **EIU Dropdown Navy** | `#144069` | **Màu menu & bento phụ**: Nền Dropdown Menu (chuẩn `post-5773.css`), bài viết phụ 02 trong lưới Magazine, thẻ Bento Cán bộ. |
| **HSV Signature Youth Blue** | `#0054A6` | **Màu nhận diện Hội Sinh viên**: Nhãn chuyên mục, thanh tiến độ SV5T/Sự kiện, liên kết hành động, thẻ Bento SV5T. |
| **HSV Cyan Digital Accent** | `#00BCFF` | **Điểm nhấn kỹ thuật số**: Nhãn chuyên mục trên nền tối, chip trạng thái số, vạch dẫn hướng menu. |
| **EIU Crimson** | `#C10230` | **Đỏ đô EIU**: Khối đa giác nghiêng trên Banner, Tab/Filter pill đang chọn, gạch chân tiêu đề section (`w-12 h-1`), cảnh báo SLA. |
| **Active Amber / Gold** | `#FCB900` | **Vàng hổ phách hành động**: Nút CTA chính ("ĐĂNG NHẬP SỔ TAY", "Đọc ngay"), chữ nghệ thuật Serif ("Sinh viên 5 tốt"), nhãn "TIÊU ĐIỂM", huy hiệu Sao vàng. |
| **EIU Academic Sand** | `#A68556` | **Vàng đồng học thuật**: Viền nóc thẻ (`border-t-4 border-[#A68556]`), viền dropdown, hover menu chính, icon MapPin/Clock. |
| **EIU Light Sand** | `#EAE3D2` | **Kem học thuật**: Nền hover các nút pill bộ lọc, nền thẻ thông tin phụ. |
| **EIU Footer Cream** | `#DED1BE` | **Chữ nền tối**: Chữ `Crimson Text` trên Footer `#133F68` (đảm bảo độ tương phản WCAG AA $\ge 4.5:1$). |
| **EIU Bento Semantic Tiles** | `#51803A`<br>`#EEB31D`<br>`#B44625` | `#51803A` (Xanh Campus): Thẻ CLB, nhãn "Đang mở đăng ký", sự kiện $\ge 100\%$.<br>`#EEB31D` (Hổ phách): Sự kiện đạt 85–99% chỗ.<br>`#B44625` (Cam đất): Cá nhân SV5T tiêu biểu. |
| **Nền Nhịp điệu (Surfaces)** | `#FFFFFF`<br>`#F5F5F5` | Xen kẽ có chủ đích giữa các Section (`#FFFFFF` ↔ `#F5F5F5` ↔ `#02294E`), đường viền chuẩn `#E2E8F0` / `border-slate-200/90`. |

---

## 3. Hệ Thống Chữ Viết 3 Bộ Font Chuẩn (Typography Scale)

Toàn bộ hệ thống Cổng thông tin & E-Office HSV EIU chỉ sử dụng duy nhất 03 bộ font chữ:

| Nhóm chức năng | Font Family | Weights | Cỡ chữ & Quy cách Hiển thị |
| :--- | :--- | :--- | :--- |
| **1. Heading, Menu & CTA** | `Montserrat`<br>(`font-eiu-display`) | `500, 600, 700, 800` | Banner H1: `24px – 32px` Extrabold<br>Section H2: `20px – 26px` Bold IN HOA kèm gạch đỏ đô `#C10230`<br>Card H3: `15.5px – 18px` Bold (`line-clamp-2 break-words`)<br>Main Nav: `13px – 14px` Bold<br>Badges / Tags: `10.5px – 11.5px` Extrabold IN HOA |
| **2. Nội dung, Form & Bảng biểu** | `Be Vietnam Pro`<br>(`font-sans`) | `400, 500, 600, 700` | Cỡ chữ nền chuẩn: **`14px`** (`line-height: 1.65`), tối ưu dấu tiếng Việt trong văn bản pháp lý, bài viết, biểu mẫu tác nghiệp và bảng dữ liệu E-Office.<br>Mô tả thẻ: `12.5px – 13px` (`text-slate-600 line-clamp-3`). |
| **3. Footer Học thuật & Mã số / Số liệu** | `Crimson Text`<br>(`font-eiu-serif` / Serif) | `400, 600, 700` | Chân trang học thuật: **`14px – 17px`** màu `#DED1BE` chuẩn `post-157.css`.<br>Tiêu đề nghệ thuật: `italic font-bold text-[#FCB900]` (cỡ chữ $\times 1.18$ font chính).<br>Số thứ tự Magazine Editorial: `text-4xl – 6xl font-light` (`WebkitTextStroke: 1.5px`).<br>Đồng thời **thay thế toàn bộ font `JetBrains Mono`** cho MSSV 10 chữ số, Số hiệu văn bản (`28/QĐ-HSV`), Mã đơn vị (`25CNTT01`), điểm GPA và chỉ số KPI. |

---

## 4. Quy Chuẩn Hình Học & Khung Lưới (Geometry & Layout Grids)

1. **Quy tắc Bo góc (Sharp & Architectural):**
   - **Thẻ nội dung (Card), Khung ảnh bìa, Dropdown Panel `#144069`, Bảng dữ liệu, Accordion, Menu dọc:** **`0px` (`rounded-none`)** hoặc **`2px` (`rounded-xs`)**. Tuyệt đối không bo góc tròn tùy tiện.
   - **Ô nhập liệu Form (`input`, `select`, `textarea`) & Nút tác nghiệp trong bảng:** **`3px – 4px` (`rounded`)**.
   - **Nút chuyển Tab, Nút Lọc Tiêu chuẩn (Filter Pills), Nút Đọc ngay & Nút Điều hướng Carousel:** **`9999px` (`rounded-full`)**.
2. **Khung Lưới theo Đặc thù Khu vực:**
   - **Khu vực Công khai `(public)`:** Khung chuẩn **`1140px` (`max-w-[1140px]`)** căn giữa; trang danh mục dùng lưới `3/9` (Menu dọc trái `#C10230` / `#EAE3D2` + Nội dung phải `9/12`); trang đọc bài/chi tiết dùng lưới `8/4` hoặc `7/5`.
   - **Khu vực Hội viên `(student-portal)` & E-Office Nội bộ `(workspace)`:** Khung rộng **`1200px` (`max-w-[1200px]`)** hoặc **`1240px`**, tối ưu không gian cho bảng biểu xét duyệt 25 Chi hội, Hội đồng SV5T 3 cấp, xuất Phụ lục 1, Máy tính GPA và Phòng thi Online Quiz.
   - **Thanh Điều hướng (Navbar):** Khung rộng **`1200px – 1240px`** đảm bảo đủ không gian cho 6 đề mục cấp 1 trên màn hình desktop.

---

## 5. Quy Chuẩn Các Phân Vùng Giao Diện Then Chốt (Key UI Patterns)

### 5.1. Phân Vùng 1: Banner Hero Học Thuật
- Khối đa giác đỏ đô `#C10230`/95 cắt xiên $91^\circ$ ở cột trái (7/12) với hiệu ứng xuất hiện gia tốc `cubic-bezier(0.16, 1, 0.3, 1)` trong 700ms.
- Khối Biểu trưng kép cột phải (5/12): Logo EIU + Logo Đại hội II trên nền trắng có viền vàng đồng `#A68556` và chân đế navy chứa slogan: *“Trí sáng - Đồng tâm - Vươn tầm - Cất cánh”*.

### 5.2. Phân Vùng 2: Bento Showcase (Khám phá HSV EIU)
- Lưới 4 cột: Thẻ đôi 2/4 cột (Giới thiệu Hội Sinh viên) + 6 Thẻ đơn 1/4 cột (Sinh viên 5 tốt, Đại hội II, Đội ngũ cán bộ, Chi hội, CLB – Đội – Nhóm, Tin tức nổi bật).
- Mỗi thẻ gồm Header đồ họa kiến trúc `h-36` + Icon có micro-motion + Chevron trượt + Mô tả 3 dòng (`line-clamp-3`) + Nút liên kết chân thẻ.

### 5.3. Phân Vùng 3: Tin Tức Sinh Viên Bento Magazine Editorial
- Cột trái (6/12): Bài viết tiêu điểm 01 cao `min-h-[460px]`, số outline `01`, nhãn vàng `#FCB900` `TIÊU ĐIỂM`, tiêu đề lớn `Crimson Text`, nút pill bo tròn `Đọc ngay`.
- Cột phải (6/12): Bài 02 nền xanh `#144069` nhãn cyan `#00BCFF` + Danh sách bài 03–06 có số nét xanh, tiêu đề 2 dòng và ảnh đại diện có fallback.

### 5.4. Phân Vùng 4: Sự Kiện Phong Trào & Bộ Lọc Tiêu Chuẩn 5 Tốt
- Thanh lọc tiêu chuẩn gồm các nút pill `rounded-full min-h-[38px]` đếm số lượng thời gian thực (`ALL`, `Học tập tốt`, `Đạo đức tốt`, `Thể lực tốt`, `Tình nguyện tốt`, `Hội nhập tốt`).
- Chuyển đổi trạng thái êm dịu (`opacity-40 translate-y-1` $\rightarrow$ `opacity-100 translate-y-0` trong 180ms).
- Thẻ sự kiện: Header `h-36` chứa tag trạng thái bên trái, hộp tiêu chuẩn trắng và hộp ngày tình nguyện vàng `#FCB900` bên phải. Thân thẻ hiển thị tên chương trình, MapPin địa điểm, Clock thời gian, thanh tiến độ đổi màu theo ngưỡng lấp đầy và liên kết Đăng ký / Xem tiến độ GCN `min-h-[36px]`.

### 5.5. Phân Vùng 5: Gương Sáng Sinh Viên 5 Tốt (Infinite Seamless Carousel)
- Nền xanh sâu `#02294E` với ánh sáng vàng `radial-gradient` và họa tiết kiến trúc `eiu-arch-pattern`.
- Tiêu đề Section kết hợp: "Gương sáng" (Montserrat) + "Sinh viên 5 tốt" (`Crimson Text` in nghiêng, in đậm, màu vàng `#FCB900`, cỡ 1.18em).
- Bộ 3 nút điều khiển tròn 44px: Tạm dừng / Tiếp tục, Xem trước, Xem tiếp theo.
- Thẻ chân dung sinh viên thật (270px – 285px $\times$ 360px – 380px) phủ gradient bảo vệ chữ, có phù hiệu monogram dự phòng (Initials + Star) khi ảnh gặp sự cố mạng.
- Kéo chuột thực tế với Pointer Events API, tự động quay vòng 2 chiều, tạm dừng khi tab trình duyệt bị ẩn và hỗ trợ phím mũi tên bàn phím.
- Thanh tiến độ vàng đáy đếm số thứ tự hiện hành (`01 / 11`).

### 5.6. Thanh Điều Hướng (Public Navbar) & Chân Trang (Public Footer)
- **Navbar:** Cố định `78px` (`h-[78px]`), cụm logo kép `EIU | HỘI SINH VIÊN`, 6 đề mục chính (Trang chủ, Tin tức, Sự kiện, Văn bản, Giới thiệu, Tra cứu GCN), Dropdown Panel vuông `0px` nền `#144069` có viền nóc vàng đồng và hỗ trợ phím `Escape`.
- **Footer:** Nền `#133F68`, viền nóc vàng đồng `border-t-4 border-[#A68556]`, font `Crimson Text` màu `#DED1BE`, 4 cột liên kết (Nổi bật, Hội viên – Sinh viên, Cán bộ Hội, Kết nối với HSV), form đăng ký nhận tin tức, và dòng tác quyền bắt buộc:
  ```
  © 2026 - Phát triển bởi nhóm sinh viên Trương Châu Phước Lộc, Bùi Nhật Linh, Vũ Đức Tùng dưới sự hướng dẫn của Thầy Nguyễn Xuân Cường
  ```

---

## 6. Quy Chuẩn Kỹ Thuật & Khả Năng Chống Chịu Lỗi (Hardening & Quality Floor)

1. **Khả năng tiếp cận (Accessibility - WCAG 2.1 AA):**
   - Độ tương phản chữ thường $\ge 4.5:1$, tiêu đề lớn $\ge 3:1$.
   - Mọi nút bấm, tab và mục chọn trên mobile phải đạt vùng chạm tối thiểu **$44\text{px} \times 44\text{px}$** (hoặc `min-h-[44px]`).
   - Có đầy đủ các thuộc tính ngữ nghĩa ARIA (`role="region"`, `aria-roledescription="carousel"`, `role="tablist"`, `aria-selected`, `aria-expanded`).
2. **Chống chịu lỗi dữ liệu & Mạng (Defensive Engineering):**
   - Không gọi `.split()` hoặc `.getHours()` trực tiếp trên ngày tháng mà không qua hàm bọc an toàn (`formatDateDot`, `formatEventTimeRange`).
   - Khống chế phép chia tỷ lệ phần trăm: `fillPct = Math.min(100, Math.max(0, Math.round((registered / (maxParticipants || 1)) * 100)))`.
   - Tất cả thẻ hình ảnh phải có sự kiện `onError` chuyển sang ảnh dự phòng.
   - Thêm `break-words`, `min-w-0` và `truncate` cho toàn bộ văn bản để không làm vỡ khung giao diện trên các thiết bị màn hình hẹp (280px - 320px).
3. **Tuân thủ Chuyển động (Motion Budget):**
   - Chỉ tạo chuyển động trên `transform`, `opacity`, `filter`.
   - Bắt buộc bổ sung `motion-reduce:*` cho mọi chuyển động để tôn trọng người dùng bật chế độ giảm chuyển động trong hệ điều hành.
