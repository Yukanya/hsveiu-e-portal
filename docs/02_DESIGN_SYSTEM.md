# HỆ THỐNG THIẾT KẾ GIAO DIỆN (DESIGN SYSTEM)
**Dự án:** Hệ thống Thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU Portal)  
**Định hướng Phong cách:** **Hành chính – Chuyên nghiệp – Hiện đại (Clean Corporate & E-Gov First)**  
**Bản sắc Thương hiệu:** Kết hợp hài hòa giữa **Xanh Hội Sinh viên Việt Nam (HSV Blue)** và **Xanh Navy đậm Trường Đại học Quốc tế Miền Đông (EIU Deep Navy)**.

---

## 1. TRIẾT LÝ THIẾT KẾ (DESIGN PRINCIPLES)

1. **Chuẩn mực & Trang trọng (Institutional Trust):** Thể hiện tính chính danh của tổ chức chính trị – xã hội của sinh viên Việt Nam tại EIU; bố cục rõ ràng, phân cấp thông tin mạch lạc như một hệ thống Cổng thông tin Hành chính – E-Office hiện đại.
2. **Sạch sẽ & Tối ưu Hiệu suất tác nghiệp (Clean Corporate First):** Sử dụng nền sáng (`#F8FAFC` / `#FFFFFF`), đường viền mảnh tinh tế (`#E2E8F0`), đổ bóng nhẹ (`shadow-sm`), mật độ thông tin cao nhưng thoáng mắt giúp cán bộ Hội duyệt hàng trăm hồ sơ SV5T, danh sách GCN, văn bản mà không mỏi mắt.
3. **Thích ứng Đa thiết bị (Mobile-Responsive Excellence):**
   - Giao diện Sinh viên (`(public)`, `(student-portal)`) tối ưu thao tác 1 chạm trên điện thoại (đăng ký sự kiện, xuất trình mã QR, chụp minh chứng SV5T).
   - Giao diện Quản trị (`(workspace)`) có Sidebar co giãn thông minh, bảng biểu hỗ trợ cuộn ngang mượt mà và bộ lọc cố định trên Desktop/Tablet.

---

## 2. BẢNG MÀU QUY CHUẨN (COLOR PALETTE)

### 2.1. Màu Thương hiệu Chủ đạo (Brand Colors)
| Tên màu | Mã Hex | Biến CSS / Tailwind | Ý nghĩa & Phạm vi sử dụng |
| :--- | :--- | :--- | :--- |
| **HSV Primary Blue** (Xanh Hội Sinh viên) | `#0054A6` | `bg-hsv-600`, `text-hsv-600` | Màu chủ đạo của Hội Sinh viên Việt Nam: Nút hành động chính (Primary CTA), Active Tab, Huy hiệu Hội, liên kết chính. |
| **HSV Cyan Accent** (Xanh Thanh niên) | `#0284C7` | `bg-hsv-500`, `text-hsv-500` | Trạng thái Hover của nút chính, điểm nhấn biểu đồ, dải chuyển màu (Gradient) tinh tế trên Hero/Header. |
| **HSV Light Tint** (Nền Xanh nhạt) | `#F0F7FF` | `bg-hsv-50`, `border-hsv-200` | Nền thẻ đang chọn, nền thông báo ghim, nền Badge cấp độ quyền. |
| **EIU Deep Navy** (Xanh Navy đậm EIU) | `#0B2545` | `bg-eiu-900`, `text-eiu-900` | Màu thương hiệu EIU: Nền Topbar hành chính, nền Sidebar Workspace, tiêu đề chính (`H1`, `H2`), chân trang (Footer). |
| **EIU Slate Navy** (Xanh Navy trung tính) | `#133B5C` | `bg-eiu-800`, `text-eiu-800` | Khối thẻ điều hành của Thường trực, Header bảng dữ liệu E-Office. |
| **EIU Gold / Amber** (Vàng Huy hiệu / Tuyên dương) | `#D97706` | `bg-amber-600`, `text-amber-600` | Điểm nhấn dành riêng cho Danh hiệu **"Sinh viên 5 Tốt"**, **"SV5T Tiêu biểu Toàn trường"** và Khen thưởng. |

### 2.2. Màu Ngữ nghĩa & Trạng thái Nghiệp vụ (Semantic & Workflow Status Colors)
| Trạng thái Nghiệp vụ | Màu chữ | Màu nền | Màu viền | Ứng dụng trong E-Office / SV5T / GCN |
| :--- | :--- | :--- | :--- | :--- |
| **Đã phê duyệt / Đạt chuẩn / Đã ban hành QĐ** | `#15803D` (`emerald-700`) | `#F0FDF4` (`emerald-50`) | `#BBF7D0` (`emerald-200`) | Hồ sơ SV5T Chốt duyệt (Cấp 3), Quyết định GCN đã ký ban hành, Sự kiện đang mở đăng ký. |
| **Đang thẩm định / Sơ duyệt (Cấp 1 & 2)** | `#0369A1` (`sky-700`) | `#F0F9FF` (`sky-50`) | `#BAE6FD` (`sky-200`) | Đang chờ Ban Chuyên môn (TG-PT / TC-XDH) thẩm định hoặc Cụm trưởng rà soát. |
| **Chờ xử lý / Đếm ngược SLA 07 ngày** | `#B45309` (`amber-700`) | `#FFFBEB` (`amber-50`) | `#FDE68A` (`amber-200`) | Hồ sơ mới nộp, Đề nghị công nhận ngày tình nguyện chờ duyệt (trước 03 ngày), SLA còn hạn. |
| **Yêu cầu bổ sung / Từ chối / Quá hạn SLA** | `#B91C1C` (`red-700`) | `#FEF2F2` (`red-50`) | `#FECACA` (`red-200`) | Hồ sơ SV5T thiếu minh chứng trả về, Danh sách GCN sai quy chuẩn MSSV, vi phạm quy tắc 03 ngày. |
| **Bản nháp (Draft) / Lưu trữ** | `#475569` (`slate-600`) | `#F8FAFC` (`slate-50`) | `#E2E8F0` (`slate-200`) | Bài viết nháp, Minh chứng SV5T lưu nháp chưa nộp. |

### 2.3. Màu Nhận diện 4 Khoa & Cụm CLB (Unit Cluster Badges)
- **Khoa CNTT (`CIT`):** Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)
- **Khoa Quản trị Kinh doanh (`BBS`):** Blue (`bg-blue-50 text-blue-700 border-blue-200`)
- **Khoa Kỹ thuật (`SET`):** Teal (`bg-teal-50 text-teal-700 border-teal-200`)
- **Khoa Điều dưỡng / KHSK (`SNS`):** Rose/Emerald (`bg-rose-50 text-rose-700 border-rose-200`)
- **Cụm CLB / Đội / Nhóm (`CLUB`):** Purple (`bg-purple-50 text-purple-700 border-purple-200`)

---

## 3. QUY CHUẨN PHÔNG CHỮ (TYPOGRAPHY)

- **Phông chữ Giao diện chính (UI & Nội dung):** **`Be Vietnam Pro`** hoặc **`Inter`** (Google Fonts, hỗ trợ đầy đủ dấu tiếng Việt sắc nét, hiện đại, dễ đọc ở kích thước nhỏ trong bảng dữ liệu).
- **Phông chữ Số liệu & Mã định danh (Monospace):** **`JetBrains Mono`** (Dùng để hiển thị Mã số sinh viên `MSSV`, Số hiệu văn bản `28/QĐ-HSV`, Mã xác thực E-Certificate, điểm GPA `3.75/4.00`, đồng hồ đếm ngược Online Quiz).
- **Phông chữ Văn bản Hành chính & Xuất bản E-Certificate:** **`Times New Roman` / `Noto Serif`** (Tuân thủ Phụ lục 2, Quyết định 28/QĐ-HSV khi hiển thị bản xem trước Quyết định và Giấy chứng nhận điện tử).

### Thang kích thước chữ (Type Scale)
- **Page Title (`H1`):** `text-2xl md:text-3xl font-bold tracking-tight text-slate-900`
- **Section Heading (`H2`):** `text-lg md:text-xl font-semibold text-slate-900`
- **Card / Panel Title (`H3`):** `text-base font-semibold text-slate-800`
- **Body Default:** `text-sm text-slate-700 leading-relaxed` (Chuẩn Clean Corporate cho hệ thống E-Office)
- **Table Cell / Metadata:** `text-xs md:text-sm text-slate-600`
- **Label / Uppercase Caption:** `text-xs font-semibold uppercase tracking-wider text-slate-500`

---

## 4. QUY CHUẨN BỐ CỤC & COMPONENT UI (COMPONENT STANDARDS)

### 4.1. Cấu trúc 3 Layout Tách biệt
1. **Public Layout `(public)`:**
   - **Top Institutional Bar (Nền `#0B2545` EIU Deep Navy):** Hiển thị dòng chữ *"HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG – KHÓA II (2026 – 2028)"*, đường dẫn nhanh tới Cổng tra cứu GCN, Văn bản, và thông tin Phòng 206.B06.
   - **Main Sticky Navbar (Nền trắng `#FFFFFF`, viền dưới `#E2E8F0`):** Cụm Logo Đoàn – Hội – EIU bên trái, thanh điều hướng trung tâm, nút **"Đăng nhập (@eiu.edu.vn)"** hoặc Avatar người dùng + lối tắt vào `Cổng Sinh viên` / `Workspace` bên phải.
2. **Student Portal Layout `(student-portal)`:**
   - Thanh điều hướng ngang kết hợp Bottom Navigation Bar trên thiết bị di động (Tổng quan, Sự kiện & Vé QR, Sổ tay SV5T, Trắc nghiệm, Lắng nghe).
   - Thẻ thông tin Hội viên số hiển thị rõ Họ tên, MSSV, Khoa (tự động nhận diện từ email `@eiu.edu.vn`), Chi hội và tổng số ngày tình nguyện tích lũy.
3. **Workspace E-Office Layout `(workspace)`:**
   - **Collapsible Left Sidebar (Nền `#0B2545` EIU Deep Navy, chữ trắng/xám nhạt, mục đang chọn nổi bật bằng `#0054A6` HSV Blue):** Phân nhóm rõ ràng theo nghiệp vụ (Điều hành chung, Truyền thông & Sự kiện, Thi đua SV5T, Văn thư & Phòng 206.B06, Tổ chức & Cơ sở Hội, Họp không giấy).
   - **Workspace Top Header:**
     - **Role/Unit Context Switcher (Bộ chuyển đổi vai trò kiêm nhiệm):** Dropdown cho phép cán bộ chuyển đổi nhanh giữa các chức vụ kiêm nhiệm (VD: *Phó Ban TC-XDH – Cụm CNTT* $\leftrightarrow$ *Chi hội phó 25CNTT01*).
     - Thông báo SLA (ví dụ: số danh sách GCN sắp tới hạn 07 ngày làm việc) và Thông tin định danh Cán bộ.

### 4.2. Quy chuẩn Component Đặc thù
- **Cards & Panels:** `bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm transition-all`
- **Primary Button:** `bg-[#0054A6] hover:bg-[#004282] text-white font-medium px-4 py-2 rounded-lg shadow-xs transition-colors`
- **Secondary / Corporate Button:** `bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded-lg transition-colors`
- **Data Tables (Chuẩn E-Office):**
  - Header bảng có nền `bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600`.
  - Cột `MSSV` luôn căn trái với font `font-mono` và hỗ trợ sắp xếp tăng dần mặc định (theo Phụ lục 1, QĐ 28/QĐ-HSV).
- **E-Certificate Preview Component (Chuẩn Phụ lục 2, QĐ 28/QĐ-HSV):**
  - Khung tỷ lệ chuẩn A4 ngang (`aspect-[1.414/1]`), nền trắng trang trọng, viền xanh HSV/EIU chuẩn mực, hiển thị rõ bộ Logo, Quốc hiệu/Tiêu ngữ Đoàn – Hội, Tên sinh viên, MSSV, Tên chương trình, Số ngày tình nguyện, Số thứ tự GCN, Mã QR dẫn tới Quyết định công nhận, và cụm chữ **`(Đã ký)`** đúng quy định.
