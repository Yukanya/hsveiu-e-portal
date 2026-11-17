# HSV EIU DESIGN SYSTEM (DESIGN.md)
<!-- impeccable:design-schema 1 -->

Hệ thống Quy chuẩn Thiết kế Giao diện (Design System & Visual Language) Cổng thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU Portal) — Khóa II, Nhiệm kỳ 2026 – 2028.

Tất cả các trang web trực thuộc (bao gồm Phân vùng Công khai `(public)`, Cổng Hội viên `(student-portal)`, Không gian Tác nghiệp `(workspace)` và các micro-sites cơ sở) **BẮT BUỘC** phải tuân thủ nghiêm ngặt ngôn ngữ thiết kế đã được chuẩn hóa tại Trang chủ.

---

## 1. Triết lý Thiết kế Cốt lõi (Design Philosophy)

### "70% Di sản Học thuật EIU × 30% Bản sắc Thanh niên HSV"

1. **70% Di sản Học thuật EIU (Academic Heritage):**
   - Kế thừa toàn vẹn từ ngôn ngữ kiến trúc trường Đại học Quốc tế Miền Đông (`eiu.edu.vn` & `lib.eiu.edu.vn`):
     - Góc vuông kiến trúc dứt khoát `0px` (`rounded-none`).
     - Hệ màu Xanh Navy học thuật (`#133F68` / `#144069` / `#02294E`).
     - Vàng đồng trang trọng (`#A68556`), Kem thanh nhã (`#EAE3D2`), Cát ngà chân trang (`#DED1BE`).
     - Bố cục lưới chặt chẽ, đường viền mảnh tinh tế (`border-slate-200/90`).
     - Kiểu chữ có chân cổ điển `Crimson Text` cho Chân trang học thuật, số hiệu văn bản pháp lý, chỉ số định lượng và điểm nhấn tiêu đề.
2. **30% Bản sắc Thanh niên Hội Sinh viên (Youth Digital Identity):**
   - Đưa năng lượng chuyển đổi số của thế hệ trẻ vào các chi tiết then chốt:
     - Sắc xanh thương hiệu Hội Sinh viên Việt Nam (`#0054A6`).
     - Cyan kỹ thuật số điểm nhấn (`#00BCFF` — `--eiu-cyan-badge`).
     - Vàng hổ phách hành động (`#FCB900`).
     - Khối đa giác cắt chéo đỏ đô EIU (`#C10230`, góc xiên $91^\circ$ `polygon(0 0, 100% 0, 91% 100%, 0% 100%)`).
     - Hoạt ảnh phản hồi xúc giác (micro-interactions) tinh tế, mượt mà và tôn trọng `prefers-reduced-motion`.
3. **Nguyên tắc "Zero Redundancy" (Không lặp thông tin):**
   - Tuyệt đối không dùng hộp màu trơn in lặp lại tiêu đề thẻ. Mọi thẻ thông tin sử dụng **Architectural Graphic Header** (chiều cao đồng bộ `h-36`) kết hợp hoa văn `eiu-arch-pattern` để hiển thị chuyên mục, nhãn trạng thái và chỉ số định lượng (`+5.0 Ngày TN`, `Top 10%`, `Chi hội 25CNTT01`), còn tiêu đề chính chỉ xuất hiện **duy nhất 01 lần** ở phần thân thẻ.

---

## 2. Hệ Thống Màu Nhận Diện (Chromatic Architecture)

| Tên Màu / Token | Mã Hex | Vai trò & Quy tắc Ứng dụng |
| :--- | :--- | :--- |
| **EIU Midnight Navy** | `#02294E` | Nền Hero chính, nền Carousel SV5T, nền thẻ bài viết tiêu điểm 01, Header thẻ sự kiện. Đại diện cho chiều sâu tri thức và sự trang nghiêm. |
| **EIU Institutional Navy** | `#133F68` | Nền Thanh Chân trang học thuật (Footer), màu chữ tiêu đề chính H1/H2/H3, thanh slogan học thuật, đường viền active. |
| **EIU Dropdown Navy** | `#144069` | Nền menu xổ xuống (Dropdown Panel), nền thẻ phụ tiêu điểm 02 trong lưới Magazine Editorial, nền thẻ Bento cán bộ. |
| **HSV Signature Blue** | `#0054A6` | Sắc xanh biểu trưng Hội Sinh viên Việt Nam: Thanh tiến độ đăng ký, nút bấm liên kết hành động, thẻ Bento SV5T, viền hover thẻ tin tức. |
| **HSV Cyan Badge** | `#00BCFF` | Nhãn phân loại chuyên mục tin tức trên nền tối, chip trạng thái kỹ thuật số, điểm nhấn công nghệ. |
| **EIU Crimson** | `#C10230` | Khối đa giác thương hiệu Hero, Tab/Filter pill đang được chọn, gạch chân tiêu đề Section (`w-12 h-1`), cảnh báo SLA khẩn cấp. |
| **Active Amber / Gold** | `#FCB900` | Nút CTA chính ("ĐĂNG NHẬP SỔ TAY", "Đọc ngay"), chữ tiêu đề phụ Serif ("Sinh viên 5 tốt"), nhãn "TIÊU ĐIỂM", huy hiệu Sao vàng. |
| **EIU Academic Sand** | `#A68556` | Viền ngăn cách học thuật (`border-[#A68556]`), hiệu ứng hover menu chính, icon MapPin/Clock phụ trợ. |
| **EIU Light Sand** | `#EAE3D2` | Nền hover các nút pill bộ lọc, nền thẻ thông tin phụ trên trang con. |
| **EIU Footer Cream** | `#DED1BE` | Màu chữ `Crimson Text` trên toàn bộ Chân trang học thuật `#133F68` (đạt tương phản WCAG AA $\ge 4.5:1$). |
| **EIU Campus Green** | `#51803A` | Thẻ CLB – Đội – Nhóm, nhãn sự kiện "Đang mở đăng ký", thanh tiến độ sự kiện đã đủ quân số ($\ge 100\%$). |
| **Surface Off-White** | `#F5F5F5` | Nền trang xen kẽ giữa các phân vùng trắng `#FFFFFF` nhằm tạo nhịp điệu thị giác (visual rhythm). |

---

## 3. Hệ Thống Kiểu Chữ 3 Bộ Font Chuẩn (Typography Scale)

Dự án chỉ sử dụng duy nhất 03 bộ font chữ tiêu chuẩn, không sử dụng font khác:

```
Montserrat (Display / Sans) + Be Vietnam Pro (Body / UI) + Crimson Text (Academic / Serif)
```

| Phông chữ | Class Tailwind | Nhóm chức năng | Cỡ chữ & Quy chuẩn hiển thị |
| :--- | :--- | :--- | :--- |
| **Montserrat** | `font-eiu-display` / `font-sans` | Heading, Thanh điều hướng (Nav), Nhãn phân loại (Badges), Nút CTA | Banner H1: `24px – 32px` Extrabold<br>Section H2: `20px – 26px` Bold UPPERCASE<br>Card H3: `15.5px – 18px` Bold<br>Menu Nav: `13px – 14px` Bold<br>Badges / Tags: `10.5px – 11.5px` Extrabold UPPERCASE |
| **Be Vietnam Pro** | `font-sans` | Toàn bộ văn bản nội dung, biểu mẫu, bảng dữ liệu, mô tả tóm tắt | Body tiêu chuẩn: `14px` (`leading-relaxed`), tối ưu dấu tiếng Việt<br>Mô tả thẻ: `12.5px – 13px` (`text-slate-600 line-clamp-3`)<br>Ô nhập liệu: `13px – 14px` |
| **Crimson Text** | `font-eiu-serif` | Chân trang học thuật, Tiêu đề nghệ thuật, Số thứ tự Magazine, Số hiệu & Ngày tháng | Chân trang học thuật: `14px – 17px` (`text-[#DED1BE]`)<br>Tiêu đề nghệ thuật: `italic font-bold text-[#FCB900]`<br>Số thứ tự outline: `text-4xl – 6xl font-light` (`WebkitTextStroke`)<br>Ngày tháng: `formatDateDot` (`DD.MM.YYYY`) |

---

## 4. Quy Chuẩn Hình Học & Khung Lưới (Geometry & Spatial System)

### 4.1. Quy tắc Bo góc Kiến trúc (Corner Radius Hierarchy)
- **Thẻ nội dung (Cards), Khung ảnh (Images), Dropdown Menu, Bảng dữ liệu (Tables), Accordion:** **`rounded-none` (`0px`)** hoặc **`rounded-xs` (`2px`)**. Giữ trọn sự trang trọng, vuông vức của kiến trúc EIU.
- **Ô nhập liệu Form (`input`, `select`, `textarea`) & Nút tác nghiệp trong Bảng:** **`rounded` (`4px`)**.
- **Nút Chuyển Tab, Nút Lọc Tiêu chuẩn (Filter Pills), Nút Đọc ngay & Nút Điều hướng Carousel:** **`rounded-full` (`9999px`)**.

### 4.2. Khung Lưới Chiều Rộng (Container Max-Widths)
- **Khu vực Công khai `(public)`:** Khung chuẩn căn giữa **`max-w-[1140px]`** (`px-4 sm:px-6`).
- **Khu vực Hội viên `(student-portal)` & E-Office `(workspace)`:** Khung mở rộng **`max-w-[1200px]`** hoặc **`max-w-[1240px]`** để tối ưu hóa không gian cho bảng biểu, dashboard và cây dữ liệu 3 cấp.
- **Thanh Điều hướng (Navbar):** Khung **`max-w-[1200px] xl:max-w-[1240px]`** để chứa đủ toàn bộ 6 menu chính mà không bị rớt dòng.

---

## 5. Các Mẫu Thành Phần Nhận Diện Chuẩn (Signature Component Patterns)

### 5.1. Banner Hero Học thuật với Khối Đa giác Nghiêng EIU
- **Nền:** `#02294E` kết hợp họa tiết kiến trúc `eiu-arch-pattern` và dải màu xuyên sáng `radial-gradient`.
- **Khối Tiêu đề Trái (7/12):** Khối nền đỏ `#C10230`/95 cắt góc $91^\circ$:
  ```css
  clip-path: polygon(0 0, 100% 0, 91% 100%, 0% 100%);
  ```
- **Khối Biểu trưng Phải (5/12):** Nền trắng, viền nóc vàng đồng `border-t-4 border-[#A68556]`, đặt song song Logo EIU trường và Biểu trưng Hội Sinh viên Đại hội II, chân đế navy `#133F68` in slogan bằng font `Crimson Text` in nghiêng: *“Trí sáng - Đồng tâm - Vươn tầm - Cất cánh”*.

### 5.2. Lối Vào Hành Động (Hero Action Gateway)
Cung cấp 3 lối vào tức thì đạt chuẩn tương tác tối thiểu `min-h-[44px]`:
1. **Nút Chính (Primary Action):** Nền vàng `#FCB900` chữ navy `#02294E`, icon xoay nhẹ `Sparkles` và mũi tên trượt sang phải khi hover (`ĐĂNG NHẬP SỔ TAY HỘI VIÊN`).
2. **Nút Kính mờ (Secondary Action):** `bg-white/10 hover:bg-white/20 border border-white/25 text-white backdrop-blur-xs` (`SỰ KIỆN PHONG TRÀO`).
3. **Nút Tra cứu (Tertiary Action):** `bg-white/10 hover:bg-white/20 border border-white/25 text-[#DED1BE] hover:text-white backdrop-blur-xs` (`TRA CỨU GCN`).

### 5.3. Lưới Bento Showcases 4 Cột (Khám phá Hội Sinh viên EIU)
- **Thẻ Đôi Chủ đạo (Chiếm 2/4 cột):** Thiết kế 2 nửa (Trái `#02294E` tóm tắt tôn chỉ + Phải `#133F68` biểu trưng song hành EIU × Đại hội II).
- **Các Thẻ Đơn (1/4 cột):** Header đồ họa `h-36` màu sắc ngữ nghĩa (`#0054A6` SV5T, `#133F68` Đại hội II, `#144069` Cán bộ, `#02294E` Chi hội, `#51803A` CLB, `#0054A6` Tin tức).
- **Thân thẻ:** Mô tả tóm tắt 3 dòng (`line-clamp-3`), gạch phân cách mảnh `border-t border-slate-100`, liên kết hành động chữ hoa có chevron trượt khi hover (`group-hover:translate-x-1`).

### 5.4. Tin Tức Sinh Viên: Bento Magazine Editorial (Trang chủ) & Lưới Tin Tức 3x3 (`/tin-tuc`)
- **Trang chủ (`/`) — Bento Magazine Editorial (12 Cột):**
  - **Cột Trái (6/12) — Bài Viết Tiêu Điểm 01:** Thẻ lớn tràn chiều cao `min-h-[460px]`, số thứ tự khổng lồ nét outline `01`, nhãn vàng `#FCB900` `TIÊU ĐIỂM`, tiêu đề lớn `Crimson Text` $27\text{px}$, nút pill bo tròn `Đọc ngay`.
  - **Cột Phải (6/12) — Bài Phụ 02 & Danh Sách 03–06:** Bài 02 nền `#144069`, số outline `02`, nhãn cyan `#00BCFF`; Danh sách 03–06 chia vạch (`divide-y divide-slate-100`), số thứ tự nét xanh `03–06`, tiêu đề 2 dòng, thumbnail vuông.
- **Trang `/tin-tuc` — Banner Tiêu Điểm Ngang (03 tin mới nhất) & Lưới 3x3 (9 tin/trang):**
  - **Banner Tiêu điểm Ngang:** Ảnh sự kiện full-bleed cross-fade (`5000ms` tự động chuyển, tạm dừng khi hover/focus/`prefers-reduced-motion`).
  - **Feathered Scrim Gradient `#02294E`:** Dùng gradient 8 điểm dừng ease-out từ trái (`0%` → `52%`) trên desktop (`linear-gradient(90deg, #02294E 0%, rgba(2,41,78,0.96) 12%, rgba(2,41,78,0.88) 22%, rgba(2,41,78,0.72) 30%, rgba(2,41,78,0.48) 38%, rgba(2,41,78,0.22) 44%, rgba(2,41,78,0.06) 48%, rgba(2,41,78,0) 52%, transparent 100%)`) và gradient dọc `180deg` trên mobile (`0.96` → `0.85` → `0.45`). Không dùng đường cắt chữ nhật `w-1/3` lộ vệt.
  - **Thanh điều hướng Carousel đáy:** Nền kính mờ `bg-[#02294E]/75 backdrop-blur-xs border-t border-white/15`, bộ đếm `01 / 03`, 3 thanh tiến độ `eiu-progress-active`, nút tròn `<` `>` (`w-9 h-9 active:scale-90 hover:scale-105`).
  - **Thẻ Tin Tức Lưới 3x3 (`GRID_ITEMS_PER_PAGE = 9`):**
    - Header ảnh thật cao `h-44`, phủ gradient dọc `#02294E` (`0.94` ở đáy → `0.48` ở `55%` → `rgba(19,63,104,0.35)` ở đỉnh) + hoa văn `eiu-arch-pattern opacity-25`.
    - Hàng trên: Tag chuyên mục `11.5px` (`#FCB900` cho SV5T, `#00BCFF` cho tin khác) + Logo HSV (`28x28`). Hàng dưới: Đơn vị ban hành (trắng) + `{readMinutes} phút đọc` (`#FCB900` Serif bold).
    - Cố định baseline thân thẻ: Tiêu đề `min-h-[44px]` (`line-clamp-2`), Tóm tắt `min-h-[63px]` (`line-clamp-3`).
    - Thanh phân trang căn giữa (`Trước`, số trang `w-10 h-10` active `#C10230`, `Sau`), cuộn mượt lên `gridTopRef`.

### 5.5. Phân Vùng Sự Kiện & Bộ Lọc Đa Tiêu Chí (`/` & `/su-kien`)
- **Pills Bộ Lọc SV5T:** Các nút bo tròn `rounded-full min-h-[38px]` đếm số lượng sự kiện thời gian thực (`ALL`, `Học tập tốt`, `Đạo đức tốt`, `Thể lực tốt`, `Tình nguyện tốt`, `Hội nhập tốt`). Nút đang chọn: `bg-[#C10230] text-white shadow-xs scale-[1.02]`. Nút chưa chọn: `bg-white text-[#133F68] border border-slate-300 hover:bg-[#EAE3D2]/40`.
- **Hiệu Ứng Lọc Êm Dịu (Filter Continuity):** Toàn bộ lưới sự kiện chuyển trạng thái mềm mại (`opacity-40 translate-y-1` $\rightarrow$ `opacity-100 translate-y-0` trong $180\text{ms}$), không gây giật màn hình.
- **Tương Tác Click Mở Đăng Ký Toàn Diện:** Cả **toàn bộ vùng Header Banner (`h-36`)**, **Tiêu đề `<h3>`**, và **Nút chân thẻ** đều cho phép bấm mở luồng đăng ký (`openEventModal(ev)` tại `/su-kien` hoặc `<Link href="/su-kien?event=...">` tại Trang chủ `/`).
- **Quy chuẩn riêng Trang `/su-kien` (Tối đa 12 sự kiện/trang):**
  - **Hero SubpageBanner:** Tiêu đề `LỊCH SỰ KIỆN VÀ HOẠT ĐỘNG`, mô tả `Tổng hợp tất cả các sự kiện sinh viên dành cho Sinh viên trường Đại học Quốc tế Miền Đông.` (Không hiển thị khối Quy trình 05 Bước GCN, nhãn `Duyệt >= 3 ngày`, tag `Sự kiện Xanh SDGs` hay đơn vị tổ chức trên thẻ).
  - **Bộ lọc chuyên sâu 5 tiêu chí (`lg:grid-cols-5`) + Lọc nhanh:** Ô tìm kiếm + nút nhanh `Đang mở đăng ký` (`bg-[#51803A]` khi active) + 5 bộ lọc: **Trạng thái (07 Tag)**, **Ngày tình nguyện** (`0–1`, `1.5–2`, `>2`), **Điểm rèn luyện** (`Có`/`Không`), **Thời gian tổ chức** (`Sáng 7h30–11h30`, `Chiều 12h30–4h30`, `Tối 4h30–8h30`, `Nhiều ngày`), **Địa điểm tổ chức** (`EIU`, `Thành phố Hồ Chí Minh`, `Khác`).
  - **07 Tag Trạng thái chuẩn & Thu nhỏ 75% Header Tags:**
    - Tag trái (`text-[8.5px] px-2 py-0.5`): `Chưa mở đăng ký` (`bg-slate-600 text-white`), `Đang mở đăng ký` (`bg-[#51803A] text-white`), `Còn 5 ngày` (`bg-[#FCB900] text-[#02294E]`), `Còn 2 ngày` (`bg-[#C10230] text-white`), `Đã đóng đăng ký` (`bg-[#EEB31D] text-[#02294E]`), `Đang diễn ra` (`bg-[#0054A6] text-white`), `Đã kết thúc` (`bg-slate-700 text-slate-100`).
    - Cột 3 box phải (`font-eiu-serif text-[9px] font-bold px-2 py-0.5`): `Tiêu chuẩn: {criterion}` (`bg-white text-[#133F68]`), `+{X.X} Ngày TN` (`bg-[#FCB900] text-[#02294E]`), và **`+1 ĐRL`** (`bg-[#EAE3D2] text-[#133F68]`, cố định mức `+1 ĐRL` cho mọi chương trình có ĐRL).
  - **Thân thẻ:** Địa điểm (`MapPin`), Thời gian (`Clock`), tiến độ và hạn đăng ký dùng đồng bộ **`font-sans font-normal`** (`text-xs` cho địa điểm và thời gian). Thanh đo đăng ký đổi màu 3 ngưỡng: `< 85%` (`#0054A6`), `85% – 99%` (`#EEB31D`), $\ge 100\%$ (`#51803A`).
  - **Chân thẻ & Phân trang:** Nút chân thẻ `min-h-[36px]` hiển thị `ĐĂNG KÝ NGAY` (khi còn hạn mở đơn), `NHẬN GCN` (khi `Đã kết thúc`), hoặc nhãn trạng thái tương ứng; phân trang căn giữa tối đa `12` sự kiện/trang đồng bộ `/tin-tuc`.

### 5.6. Băng Chuyền "Gương Sáng Sinh Viên 5 Tốt" (Infinite Seamless Carousel)
- **Tiêu đề Phân vùng:**
  ```html
  <span>Gương sáng</span>
  <span class="font-eiu-serif italic font-bold text-[#FCB900] text-[1.18em]">
    Sinh viên 5 tốt
  </span>
  ```
- **Thẻ Sinh Viên:**
  - Kích thước chuẩn: Rộng `270px – 285px` $\times$ Cao `360px – 380px`.
  - Ảnh chân dung sinh viên thật tràn viền với lớp phủ gradient tối bảo vệ độ tương phản chữ.
  - Phù hiệu monogram dự phòng (Initials Avatar + Ngôi sao vàng) tự động hiển thị nếu ảnh lỗi tải.
  - Hàng trên: Tag Chi hội mờ kính (`Chi hội 25CNTT01`) + Số thứ tự slide nét outline mạ bạc (`01`, `02`...).
  - Hàng dưới: Huy hiệu vàng `Sinh viên 5 tốt`, Họ tên sinh viên in đậm rực rỡ, Tên khoa chuyên ngành.
- **Tương Tác & Điều Khiển:**
  - Tự động cuộn mượt mà từ phải sang trái (Infinite loop 2 chiều).
  - Tự dừng khi rê chuột (`hover`), khi nhận tiêu điểm (`focus`), hoặc khi tab trình duyệt bị ẩn (`document.hidden`).
  - Hỗ trợ kéo chuột thực tế (Pointer Events) với cơ chế giải phóng capture an toàn khi mất cử chỉ (`pointercancel`, `window blur`).
  - Hỗ trợ phím mũi tên bàn phím (`ArrowLeft`, `ArrowRight`, `Spacebar`).
  - Thanh tiến độ vàng đáy hiển thị số trang hiện hành (`01 / 11`).

### 5.7. Thanh Điều Hướng (Public Navbar)
- **Chiều cao:** Cố định `78px` (`h-[78px]`), bám đỉnh `sticky top-0 z-40`, nền trắng `#FFFFFF`, viền đáy `border-slate-200`.
- **Cụm Logo Kép:** Logo EIU màu chuẩn kết hợp Logo Hội Sinh viên Việt Nam + Tên đối ngoại song ngữ `HỘI SINH VIÊN / STUDENT ASSOCIATION`.
- **Hệ Thống 6 Đề Mục Chính:**
  1. `TRANG CHỦ` (`/`)
  2. `TIN TỨC` (`/tin-tuc`)
  3. `SỰ KIỆN` (`/su-kien` — menu con: *Tham gia sự kiện, Cuộc thi trực tuyến, Khảo sát, Học tập*)
  4. `VĂN BẢN` (`/van-ban` — menu con: *Kế hoạch, Thông báo, Quyết định, Công văn, Biểu mẫu*)
  5. `GIỚI THIỆU` (`/gioi-thieu` — menu con: *Hội Sinh viên EIU, Đại hội II, Ban Chuyên môn, Chi hội, CLB – Đội – Nhóm*)
  6. `TRA CỨU GCN` (`/tra-cuu-gcn`)
- **Dropdown Panel:** Góc vuông sắc nét `0px`, nền xanh navy `#144069`, viền nóc vàng đồng `border-t-2 border-[#A68556]`, hiệu ứng hover chữ vàng `#FCB900` kèm vạch dẫn hướng trái. Hỗ trợ phím `Escape` đóng menu tức thì.

### 5.8. Chân Trang Học Thuật (Academic Public Footer)
- **Nền:** `#133F68`, viền nóc vàng đồng `border-t-4 border-[#A68556]`, chữ màu kem cát `#DED1BE` font `Crimson Text`.
- **Cấu Trúc 4 Cột:**
  - **Cột 1 (4/12):** Logo EIU trắng + Logo HSV + Tên tổ chức + Khẩu hiệu hành động nhiệm kỳ.
  - **Cột 2 (2/12) — Nổi bật:** Về Hội Sinh viên EIU, Đội ngũ cán bộ, Sinh viên 5 tốt, Tin tức Sinh viên.
  - **Cột 3 (2/12) — Hội viên – Sinh viên:** Sự kiện phong trào, Sổ tay hội viên, Học tập và cuộc thi, Tra cứu GCN.
  - **Cột 4 (4/12) — Cán bộ Hội & Kết nối HSV:**
    - Cán bộ Hội: e-Office, Phòng họp số, Văn bản.
    - Kết nối với HSV: Cổng thông tin, Fanpage, Instagram, Tiktok.
    - Form đăng ký nhận tin tức: Ô nhập `placeholder:text-slate-600` với nút mũi tên gửi, có kiểm tra định dạng email và thông báo thành công.
- **Thanh Tác Quyền & Hướng Dẫn:**
  Bắt buộc đặt tại đáy cùng của footer:
  ```
  © 2026 - Phát triển bởi nhóm sinh viên Trương Châu Phước Lộc, Bùi Nhật Linh, Vũ Đức Tùng dưới sự hướng dẫn của Thầy Nguyễn Xuân Cường
  ```

---

## 6. Quy Chuẩn Chuyển Động & Hoạt Ảnh (Motion Specification)

- **Nguyên tắc cốt lõi:**
  - Chuyển động có chủ đích, gắn liền với bản sắc kiến trúc cantilver và đà cất cánh của EIU Khóa II.
  - Chỉ tạo chuyển động trên các thuộc tính đồ họa tầng tổng hợp (`transform`, `opacity`, `filter`). Tuyệt đối không can thiệp vào `width`, `height`, `margin`, `padding` gây giật layout (reflow) (trừ thanh tiến độ bên trong khung cố định `overflow-hidden`).
  - Đường cong gia tốc tự nhiên: `cubic-bezier(0.16, 1, 0.3, 1)` (exponential ease-out).
- **Hệ thống Class Motion Chuẩn (`src/app/globals.css`):**
  - `.eiu-fade-slide-in`: Chuyển nội dung slide banner (`420ms`, trượt ngang `-8px` → `0`).
  - `.eiu-card-entrance`: Xuất hiện tuần tự các thẻ lưới (`320ms`, trượt lên `6px` → `0`, stagger delay `idx * 35ms` tối đa `250ms`).
  - `.eiu-progress-active`: Thanh đếm ngược tiến độ slide (`5000ms linear`).
- **Hỗ trợ giảm chuyển động (`prefers-reduced-motion`):**
  - Mọi hiệu ứng chuyển động và tự cuộn **BẮT BUỘC** phải có tiền tố `motion-reduce:transition-none`, `motion-reduce:animate-none`, `motion-reduce:hover:translate-y-0`, `motion-reduce:group-hover:scale-100` và quy tắc `@media (prefers-reduced-motion: reduce)` trong `globals.css`.
  - Carousel tự động tạm dừng cuộn khi phát hiện người dùng bật chế độ giảm chuyển động trong hệ điều hành.

---

## 7. Quy Chuẩn Gia Cố Sản Xuất & Trợ Năng (Hardening & Accessibility)

- **Độ tương phản màu (WCAG 2.1 AA):**
  - Văn bản đọc và placeholder: Đảm bảo độ tương phản tối thiểu $\ge 4.5:1$ so với nền.
  - Tiêu đề lớn: Đảm bảo độ tương phản $\ge 3:1$.
  - Màu chữ `#DED1BE` trên nền `#133F68` và trắng trên `#02294E` đạt chuẩn xuất sắc.
- **Vùng chạm cảm ứng (Touch Target Size):**
  - Mọi nút bấm, tab và liên kết trên giao diện di động phải đạt kích thước tối thiểu **$44\text{px} \times 44\text{px}$** (hoặc `min-h-[44px]`, các nút phụ trong bảng tối thiểu `min-h-[36px]`).
- **Phòng thủ dữ liệu rỗng, Hình ảnh & An toàn kiểu dữ liệu (Defensive UI):**
  - Hàm ngày tháng (`formatDateDot`, `formatEventTimeRange`) bọc kiểm tra `isNaN(getTime())` chống lỗi `NaN:NaN`.
  - Hàm tính tỷ lệ hoàn thành (`fillPct`) khống chế mẫu số `> 0` chống lỗi chia cho 0 (`Infinity` / `NaN`).
  - Hình ảnh mạng qua `next/image` **bắt buộc** khai báo đầy đủ domain ngoài trong `images.remotePatterns` của `next.config.ts` (ví dụ `images.unsplash.com`, `plus.unsplash.com`) và luôn có sự kiện `onError` dự phòng về biểu trưng chính thống hoặc huy hiệu monogram.
  - Tất cả tiêu đề và văn bản dài đều sử dụng `break-words`, `line-clamp-*` và `min-w-0` để không làm vỡ khung trên các thiết bị màn hình hẹp (280px - 320px).

---

> **GHI CHÚ DÀNH CHO CÁC NHÀ PHÁT TRIỂN & AGENT:**  
> Bất kỳ trang web mới nào được tạo thêm trong hệ thống Cổng thông tin HSV EIU đều phải đối chiếu và kế thừa đầy đủ các quy chuẩn trên. Không tự ý sáng tạo phong cách hoặc bảng màu khác biệt làm phân mảnh nhận diện thương hiệu của Hội Sinh viên EIU.

