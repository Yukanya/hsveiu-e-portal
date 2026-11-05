---
target: tin-tuc
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/yuka/Documents/HỘI SINH VIÊN EIU KHÓA II, 26 - 28/HỘI SINH VIÊN_26–27/CỔNG THÔNG TIN ĐIỆN TỬ HSV TRƯỜNG/src/app/(public)/tin-tuc/page.tsx"
target_fingerprint: "sha256:d248fc56107f716e9b9fd2173460cc08593c4ceba7c7d1010ea955e7e9303782"
target_path: /Users/yuka/Documents/HỘI SINH VIÊN EIU KHÓA II, 26 - 28/HỘI SINH VIÊN_26–27/CỔNG THÔNG TIN ĐIỆN TỬ HSV TRƯỜNG/src/app/(public)/tin-tuc/page.tsx
timestamp: 2026-11-05T01-25-16Z
slug: src-app-public-tin-tuc-page-tsx
---
# BÁO CÁO ĐÁNH GIÁ THIẾT KẾ (DESIGN CRITIQUE REPORT)
Method: dual-agent (A: 6a86b0b0-7296-4c41-b9eb-2b2a9ae927bc · B: 987e3fd3-8d79-4c5e-a95c-49867630be9d)
Target: src/app/(public)/tin-tuc/page.tsx & src/app/(public)/tin-tuc/[slug]/page.tsx
Design System: EIU × HSV Design System (DESIGN.md & 02_DESIGN_SYSTEM.md)

### Design Health Score (Nielsen's 10 Heuristics)

| # | Heuristic | Score | Key Issue / Observation |
|---|-----------|:---:|-------------------------|
| 1 | Visibility of System Status | 3.0/4 | Bộ đếm slide 01/03 trực quan; tuy nhiên lệnh cuộn `window.scrollTo({ top: 380 })` làm lệch trạng thái định vị thị giác khi chuyển trang |
| 2 | Match System / Real World | 3.5/4 | Ngữ cảnh Đoàn - Hội chuẩn mực ("Chi hội", "Cấp trường", "SV5T", "Phụ lục 1"); placeholder ô tìm kiếm "Tìm" hơi vắn tắt |
| 3 | User Control and Freedom | 3.0/4 | Tự dừng slide khi hover/focus, nút xóa từ khóa tức thời; thiếu nút bấm thủ công Play/Pause cho Carousel |
| 4 | Consistency and Standards | 2.5/4 | Màu nền Card Header của lưới 3x3 bị gán ngẫu nhiên theo chỉ số `idx % palettes.length` thay vì theo chuyên mục ngữ nghĩa |
| 5 | Error Prevention | 3.2/4 | Xử lý fallback ảnh lỗi an toàn, khống chế trang hợp lệ; hàm lọc "Tháng này" còn gán chuỗi tĩnh |
| 6 | Recognition Rather Than Recall | 3.5/4 | Thẻ bài viết đính kèm nhãn Cyan, thời lượng đọc, khối văn bản pháp lý gắn kèm số hiệu Quyết định minh bạch |
| 7 | Flexibility and Efficiency | 3.0/4 | Lọc tức thời phía client; thiếu tùy chọn sắp xếp (xem nhiều / mới nhất) và nút chia sẻ nhanh |
| 8 | Aesthetic and Minimalist Design | 3.0/4 | Bố cục gọn gàng, tôn trọng 0px cantilever; 9 thẻ dùng chung một mẫu đồ họa phẳng lặp lại thay vì hiển thị thumbnail ảnh báo chí |
| 9 | Error Recovery | 3.5/4 | Trạng thái rỗng (empty state) chỉn chu với icon và nút khôi phục "Xem tất cả bài viết"; trang 404 có nút quay lại an toàn |
| 10 | Help and Documentation | 3.0/4 | Callout đỏ đô hướng dẫn đăng nhập @eiu.edu.vn mở Sổ tay Hội viên; thiếu search chips gợi ý từ khóa |
| **Tổng** | | **32.2/40** | **Khá Tốt (Good - Publication Ready)** |

### Design Specificity Verdict: ĐẠT (PASS)
- **Đánh giá Đạo diễn Thiết kế (LLM Assessment)**: Đạt 8.8/10. Thoát ly hoàn toàn khỏi các mẫu template tin tức thông thường. Mang đậm dấu ấn "70% Di sản Học thuật EIU × 30% Bản sắc Thanh niên HSV" với cấu trúc hình khối góc vuông cantilever 0px, đa giác cắt góc 91 độ đỏ đô `#C10230`, bảng màu Deep Navy `#02294E` kết hợp Cyan `#00BCFF` và Gold `#A68556`. Đặc biệt, sự tích hợp khối Văn bản Pháp lý Gốc (`relatedDoc`) gắn kèm số hiệu quyết định (`09/QĐ-HSV`, `28/QĐ-HSV`) tạo nên bản sắc nghiệp vụ Đoàn - Hội đại học mà không hệ thống nào khác có được.
- **Bằng chứng Quét Tự động (Deterministic Scan)**:
  - Regex Static Check: 0 lỗi.
  - Live DOM Scan: 17 cảnh báo trên trang danh sách, 1 cảnh báo trên trang chi tiết.
  - *False Positive*: Quy tắc `overused-font` gắn cờ Montserrat được xác định là dương tính giả vì Montserrat là font hiển thị thương hiệu chính thức theo quy chuẩn `DESIGN.md`.
  - *True Positive*: Nhãn chuyên mục kích thước 10.5px (`undersized-ui-text`) và độ tương phản của chữ màu be trên nền xanh lá/đỏ đất (`low-contrast`: 3.1:1 - 3.6:1, dưới ngưỡng 4.5:1 của WCAG AA).

### Tổng quan Nhận định (Overall Impression)
Giao diện toát lên vẻ trang trọng, tin cậy và có tổ chức cao của một trường đại học quốc tế. Điểm nghẽn thị giác và tương tác lớn nhất nằm ở việc màu nền các thẻ tin tức đang được tô ngẫu nhiên khiến ngữ nghĩa bị nhầm lẫn, cùng với việc chưa khai thác trường ảnh báo chí `imageUrl` sẵn có trong dữ liệu để tạo sức sống trẻ trung cho lưới tin 3x3.

### Điểm sáng Nổi bật (What's Working)
1. **Cầu nối Tin tức - Quản trị Pháp trị**: Liên kết bài viết với số quyết định, người ký và Phụ lục 1 minh chứng SV5T là bước đột phá UX xuất sắc.
2. **Khối Tiêu điểm Ngang đẳng cấp tạp chí**: Phối màu Midnight Navy `#02294E` với tiêu đề font Serif Crimson Text và nhãn Active Amber `#FCB900` tạo ấn tượng thị giác sâu sắc ngay từ màn hình đầu tiên.
3. **Kỷ luật căn chỉnh Baseline**: Tiêu đề và tóm tắt thẻ tin tức được khóa chiều cao tối thiểu (`min-h-[44px]`, `min-h-[63px]`), giúp đường phân cách chân trang thẳng hàng tăm tắp qua cả 3 cột của lưới 3x3.

### Vấn đề Ưu tiên Cải thiện (Priority Issues)
- **[P1] Màu nền thẻ bị gán ngẫu nhiên theo vị trí hiển thị (Semantic Palette Drift)**
  - *Tại sao quan trọng*: Dùng `idx % palettes.length` khiến bài viết cùng chuyên mục mang màu sắc khác nhau ngẫu nhiên khi lọc, gây hiểu lầm là cấp độ khẩn cấp.
  - *Khắc phục*: Gán màu ngữ nghĩa cố định theo chuyên mục (SV5T: HSV Blue `#0054A6`, Cấp trường: Navy `#133F68`, Cơ sở Hội: Green `#51803A`).
  - *Lệnh đề xuất*: `/impeccable colorize tin-tuc`
- **[P1] Lệnh cuộn trang cứng `top: 380` làm lệch định vị thị giác (Arbitrary Scroll Offset)**
  - *Tại sao quan trọng*: Chiều cao banner và tiêu điểm lớn hơn 700px, khi bấm chuyển trang người dùng bị cuộn lưng chừng slide tiêu điểm thay vì đến đầu lưới tin tức.
  - *Khắc phục*: Dùng `ref` gắn vào đầu thanh lọc và gọi `scrollIntoView({ behavior: 'smooth', block: 'start' })`.
  - *Lệnh đề xuất*: `/impeccable polish tin-tuc`
- **[P1] Trùng lặp 3 thẻ `<Link>` trên mỗi thẻ bài viết (Keyboard & Screen Reader Fatigue)**
  - *Tại sao quan trọng*: 9 thẻ tạo ra 27 điểm dừng phím Tab liên tiếp đến cùng một URL, gây mỏi thao tác điều hướng bàn phím.
  - *Khắc phục*: Dùng stretched link CSS pattern trên tiêu đề bài viết.
  - *Lệnh đề xuất*: `/impeccable polish tin-tuc`
- **[P2] Tương phản chữ nhỏ và nhãn phụ trên thẻ tin tức (WCAG AA Contrast)**
  - *Tại sao quan trọng*: Chữ 10.5px và màu be `#DED1BE` trên nền cam đất/xanh lá chỉ đạt 3.1:1 - 3.6:1 (chuẩn đòi hỏi 4.5:1).
  - *Khắc phục*: Tăng kích thước nhãn lên 11px/12px và dùng màu chữ trắng tinh `#FFFFFF` với bóng đổ nhẹ.
  - *Lệnh đề xuất*: `/impeccable polish tin-tuc`
- **[P2] Lưới 3x3 chưa khai thác hình ảnh tin tức thực tế (Rich Media Opportunity)**
  - *Tại sao quan trọng*: Mọi bài viết trong dữ liệu đều có `imageUrl`, nhưng lưới 3x3 lại chỉ hiển thị khối màu phẳng lặp lại 9 logo Hội Sinh viên.
  - *Khắc phục*: Cho phép thẻ hiển thị ảnh bìa sự kiện chân thực có lớp phủ màu mờ thay vì chỉ có hình hộp đồ họa.
  - *Lệnh đề xuất*: `/impeccable bolder tin-tuc`

### Rủi ro theo Chân dung Người dùng (Persona Red Flags)
- **Sinh viên Trương Châu Phước Lộc (Ứng viên SV5T)**: Khi lọc mục "Sinh viên 5 tốt", màu sắc các thẻ nhảy lộn xộn khiến Lộc bối rối không biết đâu là tin quan trọng. Khi chuyển trang, màn hình bị giật cuộn lưng chừng slide tiêu điểm.
- **Thầy Nguyễn Xuân Cường (Giảng viên Cố vấn)**: Nhìn thấy ô tìm kiếm chỉ ghi chữ "Tìm" nên ngần ngại không rõ có tìm được số quyết định hay không. Tuy nhiên, khối "Văn bản Pháp lý Gốc" bên cột phải trang chi tiết làm thầy rất an tâm về tính pháp lý.

### Câu hỏi mang tính Đột phá (Provocative Questions)
1. Liệu chúng ta có nên cho phép Card Header trong lưới 3x3 hiển thị ảnh sự kiện thực tế của sinh viên (kèm lớp phủ Navy nhẹ) thay vì 9 khối màu trơn lặp lại cùng một logo Hội Sinh viên?
2. Có nên bổ sung huy hiệu đếm số lượng tin bài trên từng pill lọc (ví dụ: *Tất cả (20)*, *Sinh viên 5 tốt (5)*, *Cơ sở Hội (9)*) để sinh viên dễ dàng định lượng dữ liệu trước khi bấm?
