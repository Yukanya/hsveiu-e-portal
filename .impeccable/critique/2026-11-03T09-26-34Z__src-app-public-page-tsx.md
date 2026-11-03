---
target: trang chủ
total_score: 23.5
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/yuka/Documents/HỘI SINH VIÊN EIU KHÓA II, 26 - 28/HỘI SINH VIÊN_26–27/CỔNG THÔNG TIN ĐIỆN TỬ HSV TRƯỜNG/src/app/(public)/page.tsx"
target_fingerprint: "sha256:ac8ca8abaebf61b0fd5e4fe43c43572be581d67caf116eff1c5c70f9467da560"
target_path: /Users/yuka/Documents/HỘI SINH VIÊN EIU KHÓA II, 26 - 28/HỘI SINH VIÊN_26–27/CỔNG THÔNG TIN ĐIỆN TỬ HSV TRƯỜNG/src/app/(public)/page.tsx
timestamp: 2026-11-03T09-26-34Z
slug: src-app-public-page-tsx
closed: true
---
Method: dual-agent (A: 5f61bec4-dfd3-4477-9177-a9d9efc38112 · B: a30ccb61-f587-4df3-b2e0-e5f34590ba41)

# Đánh giá Thiết kế Giao diện Trang chủ (HSV EIU Portal)
**Mục tiêu (Target):** `src/app/(public)/page.tsx`  
**Chế độ bề mặt (Surface Mode):** Persuade (Cổng thông tin & Dịch vụ Hội Sinh viên EIU)  
**Tiêu chuẩn thiết kế:** 70% Di sản Học thuật EIU × 30% Bản sắc Chuyển đổi số Thanh niên

---

### Design Health Score (Điểm Sức khỏe Thiết kế)

| # | Heuristic (Nguyên tắc Usability) | Điểm (0–4) | Vấn đề chính / Ghi chú |
|---|----------------------------------|:----------:|------------------------|
| 1 | Visibility of System Status | **3.5** | Tốt. Badge trạng thái sự kiện rõ ràng (`Còn 2 ngày`, `Đang mở`), thanh tiến độ % chỉ tiêu, bộ đếm carousel `01/11`. |
| 2 | Match System / Real World | **3.8** | Xuất sắc. Ngôn ngữ thuần ngữ cảnh EIU: "Ngày tình nguyện", "Chi hội 25CNTT01", "Phòng 206.B06", "QĐ 09/QĐ-HSV". |
| 3 | User Control & Freedom | **2.5** | Trung bình. Carousel SV5T tự cuộn liên tục không có nút Dừng/Phát (Pause/Play), không hỗ trợ `prefers-reduced-motion`. |
| 4 | Consistency & Standards | **2.8** | Cần chỉnh. Tiêu đề tin tức xen kẽ giữa Serif (Crimson Text) và Sans (Montserrat); cấu trúc thẻ nhảy bậc từ `<h1>` xuống `<h3>`. |
| 5 | Error Prevention | **3.5** | Tốt. Bộ lọc sự kiện có trạng thái rỗng thân thiện, có nút quay về xem tất cả. |
| 6 | Recognition Rather Than Recall | **3.6** | Rất tốt. Thẻ sự kiện thể hiện đầy đủ thời gian, địa điểm, hạn chót và quyền lợi SV5T (`+1.0 Ngày TN`). |
| 7 | Flexibility & Efficiency | `n/a` | *Không áp dụng cho trang đích công khai (Persuade Landing Page).* |
| 8 | Aesthetic & Minimalist Design | **2.7** | Cần tinh giản. Phần Bento 7 thẻ gây quá tải nhận thức; trùng lặp slogan 3 lần; chữ vàng Academic Gold `#A68556` bị lỗi tương phản WCAG. |
| 9 | Error Recovery | **3.6** | Tốt. Khi lọc không có sự kiện, có nút bấm khôi phục tức thì về danh sách đầy đủ. |
| 10 | Help & Documentation | `n/a` | *Không áp dụng cho trang chủ (Tài liệu nghiệp vụ nằm tại E-Office / Văn bản).* |
| **Tổng cộng** | | **23.5 / 32** | **73.4% — Good (Nền tảng vững chắc, cần tinh chỉnh trải nghiệm)** |

---

### Design Specificity Verdict (Độ Đặc thù Bản sắc Thiết kế)

- **Đánh giá Chuyên gia (Assessment A):** Giao diện thể hiện rõ nét bản sắc tổ chức của Hội Sinh viên EIU với bảng màu nhận diện chuẩn mực (Navy `#02294E`, Gold `#A68556`, Đỏ HSV `#C10230`, góc vuông kiến trúc `rounded-none`). Tuy nhiên, trang đang mắc phải "hội chứng sổ tay hành chính" khi thiếu vắng hoàn toàn hình ảnh thực tế của sinh viên: vinh danh SV5T dùng ký tự viết tắt dạng avatar CRM, ảnh sự kiện dùng khối màu trừu tượng, và Hero Banner như một tấm biển thông cáo tĩnh thiếu nút kêu gọi hành động (CTA).
- **Quét Tự động Xác thực (Assessment B):** Quét Chromium trực tiếp trên DOM phát hiện 28 cảnh báo trên Desktop và 26 trên Mobile. Xác nhận 6 điểm vi phạm độ tương phản WCAG AA nghiêm trọng (chữ vàng `#A68556` và badge đóng đăng ký trên nền xám), 1 lỗi nhảy bậc tiêu đề (`h1` $\rightarrow$ `h3`), và văn bản phụ trợ nhỏ dưới ngưỡng 11px. Đồng thời lọc bỏ 2 cảnh báo sai (font Montserrat và dải màu nền là chuẩn nhận diện thương hiệu EIU).
- **Trạng thái Trực quan:** Kiểm tra DOM hoàn tất qua Chromium headless; giao diện được kiểm chứng độ an toàn tràn ngang (0 overflow) trên cả 1280px và 390px.

---

### Overall Impression (Ấn tượng Tổng thể)
Trang chủ sở hữu cấu trúc trang trọng, nghiêm túc, đậm chất học thuật EIU và thể hiện trọn vẹn sự chuẩn xác về mặt tổ chức Đoàn – Hội. Tuy nhiên, trang đang thiên quá nhiều về "thông báo hành chính một chiều" mà thiếu đi sự tương tác mời gọi của một Cổng dịch vụ sinh viên thế hệ mới. Cơ hội lớn nhất là đưa hình ảnh sinh viên thật vào trung tâm và bổ sung các lối tắt hành động một chạm.

---

### What's Working (3 Điểm sáng Nổi bật)
1. **Kỷ luật Màu sắc & Bản sắc Kiến trúc EIU:** Không rơi vào bẫy giao diện SaaS công nghiệp, tuân thủ tuyệt đối tỷ lệ 70% Di sản Học thuật (Navy, Gold, góc vuông 0px) kết hợp 30% Tuổi trẻ Năng động (Đỏ HSV, Vàng Amber).
2. **Kiến trúc Thông tin Sự kiện Đúng Trọng tâm:** Thẻ sự kiện giải quyết trực tiếp nhu cầu thiết yếu nhất của hội viên khi gắn liền với quyền lợi cụ thể: `+1.0 Ngày Tình nguyện`, `Tiêu chuẩn SV5T`, thanh tiến độ chỉ tiêu trực quan.
3. **Phân cấp Tạp chí Tin tức Uy tín:** Bố cục tin tức dạng tòa soạn với số thứ tự phóng to `01`, `02` mang lại cảm giác trang trọng, tin cậy cho các thông tin chỉ đạo của Hội.

---

### Priority Issues (Các Vấn đề Ưu tiên Giải quyết)

#### [P1] Thiếu Lối vào Hành động tại Hero Banner (Zero Primary CTA)
- **Vấn đề:** Hero Banner chỉ như tấm biển tên tĩnh, không có nút bấm nào để sinh viên bắt đầu trải nghiệm.
- **Tác động:** Tân sinh viên và hội viên mới truy cập không biết bước tiếp theo phải làm gì, tăng tỷ lệ thoát trang.
- **Giải pháp:** Bổ sung cụm nút hành động kép ngay tại Hero:
  1. Nút chính: `Đăng nhập Sổ tay Hội viên` (kết nối `@eiu.edu.vn` vào `/portal`).
  2. Nút phụ: `Khám phá Sự kiện đang mở` (cuộn mượt xuống mục Sự kiện).
- **Lệnh đề xuất:** `/impeccable layout` hoặc `/impeccable clarify`

#### [P1] "Hội chứng Avatar Vô danh" tại Mục Gương sáng SV5T & Tin tức
- **Vấn đề:** 11 gương sáng SV5T xuất sắc chỉ hiển thị chữ cái viết tắt (`GT`, `NQ`, `DH`) trong vòng tròn vàng thay vì chân dung sinh viên; tin tức phụ dùng logo HSV đại trà.
- **Why it matters:** Làm mất đi tính truyền cảm hứng và niềm tự hào sinh viên – linh hồn của danh hiệu SV5T.
- **Giải pháp:** Tích hợp ảnh chân dung sinh viên thật (hoặc ảnh minh họa chuẩn photographic profile), kèm ảnh chụp hoạt động phong trào thực tế cho danh mục tin tức.
- **Lệnh đề xuất:** `/impeccable polish`

#### [P2] Băng chuyền Tự cuộn SV5T Vi phạm Tiếp cận & Gây Xung đột Cảm ứng
- **Vấn đề:** Băng chuyền chạy tự động liên tục bằng `requestAnimationFrame` (38px/s) không có nút Dừng/Phát (Pause/Play), không hỗ trợ `prefers-reduced-motion` (vi phạm WCAG 2.2.2), và gây giật lag khi người dùng vuốt cảm ứng trên di động.
- **Tác động:** Gây chóng mặt cho người dùng nhạy cảm chuyển động, cản trở trình đọc màn hình và ức chế thao tác vuốt trên điện thoại.
- **Giải pháp:** 
  1. Thêm nút chuyển đổi Dừng/Phát cạnh nút chuyển slide.
  2. Tắt tự cuộn khi người dùng bật chế độ giảm chuyển động trong hệ điều hành.
  3. Trên màn hình di động, chuyển sang chế độ cuộn chạm tự nhiên CSS Snap (`snap-x snap-mandatory`).
- **Lệnh đề xuất:** `/impeccable adapt` hoặc `/impeccable animate`

#### [P2] Quá tải Nhận thức & Trùng lặp tại Bento 7 Thẻ
- **Vấn đề:** Phần Bento mở đầu hiển thị tới 7 thẻ điều hướng cùng lúc (vượt ngưỡng trí nhớ làm việc $\le 4$ lựa chọn theo Định luật Miller). Thẻ số 7 "Tin tức nổi bật" chỉ là liên kết nhảy nội bộ xuống ngay mục dưới, thẻ số 1 lặp lại khẩu hiệu đã xuất hiện ở Hero.
- **Tác động:** Phân tán sự chú ý của sinh viên, tạo cảm giác rối mắt trước khi tiếp cận nội dung chính.
- **Giải pháp:** Cô đọng 7 thẻ thành **4 trụ cột chiến lược**:
  1. *Về Hội Sinh viên EIU & Đại hội II*
  2. *Hành trình Sinh viên 5 Tốt*
  3. *Cơ sở Hội: 25 Chi hội & 30 CLB*
  4. *Dịch vụ & Tra cứu GCN* (bỏ thẻ Tin tức vì đã có chuyên mục riêng).
- **Lệnh đề xuất:** `/impeccable distill`

#### [P3] Lỗi Tương phản Màu chữ Vàng EIU & Nhảy Bậc Tiêu đề (Accessibility)
- **Vấn đề:** Quét DOM ghi nhận màu vàng `#A68556` trên nền trắng chỉ đạt tương phản 3.4:1 (chuẩn WCAG AA yêu cầu 4.5:1); thẻ `<h1>` nhảy cóc sang `<h3>` ở phần Bento.
- **Tác động:** Sinh viên mắt kém hoặc đọc dưới ánh nắng ngoài trời gặp khó khăn; trình đọc màn hình mất cấu trúc phân cấp.
- **Giải pháp:** Dùng token vàng tương phản cao `#8E6D3E` trên nền sáng, dùng `#FCB900` trên nền tối; chuẩn hóa tiêu đề mục Bento thành `<h2>`.
- **Lệnh đề xuất:** `/impeccable polish` hoặc `/impeccable typeset`

---

### Persona Red Flags (Cảnh báo Trải nghiệm Người dùng)
- **Jordan (Tân sinh viên EIU):** Vào trang không thấy chỗ hướng dẫn cho sinh viên mới khóa 2026; nhìn thấy 7 thẻ Bento nhưng không biết Chi hội của mình ở đâu và điểm SV5T để làm gì.
- **Casey (Sinh viên lướt điện thoại):** Toàn bộ màn hình đầu tiên bị chiếm trọn bởi văn bản Hero không có nút bấm; khi lướt xuống mục SV5T thì băng chuyền chạy trôi mất chữ khi đang cố đọc tên bạn mình; các nút lọc sự kiện bị rớt thành nhiều dòng lộn xộn.
- **Riley (Kiểm thử Kỹ thuật):** Bấm phím Tab kiểm tra bàn phím thấy slide SV5T bị nhảy giật bất thường; mã nguồn có các mốc thời gian fix cứng (`17:00 03/11/2026`) thay vì xử lý linh hoạt từ CSDL.
- **Hội viên phấn đấu SV5T:** Rất thích huy hiệu `+1.0 Ngày Tình nguyện`, nhưng muốn có thêm thanh chỉ báo hiển thị ngay số ngày tình nguyện cá nhân đã tích lũy khi đăng nhập.

---

### Minor Observations (Quan sát Nhỏ)
1. **Đồng bộ Định dạng Ngày:** Tin tức dùng dấu chấm (`03.11.2026`), Sự kiện dùng dấu gạch chéo (`03/11/2026`). Cần chuẩn hóa toàn hệ thống theo dạng `DD/MM/YYYY`.
2. **Khẩu hiệu Lặp lại 3 Lần:** Câu *"Trí sáng - Đồng tâm - Vươn tầm - Cất cánh"* xuất hiện ở cả Hero, Bento và Footer. Nên giữ ở Hero và Footer, gỡ khỏi Bento để thanh thoát.
3. **Liên kết Mở Tab Mới:** Các icon mạng xã hội ở Footer có `target="_blank"` nhưng thiếu thuộc tính cảnh báo trợ năng cho người khiếm thị.

---

### Questions to Consider (Câu hỏi Gợi mở Đột phá)
1. *Nếu tân sinh viên truy cập Cổng thông tin lần đầu, vì sao họ phải kéo chuột xuống dưới khi ngay màn hình đầu tiên không có một nút bấm nào chào đón họ?*
2. *Liệu một băng chuyền chạy liên tục có thực sự tôn vinh sinh viên, hay đang biến thành tích rèn luyện của các bạn thành một bảng tin chạy quá nhanh để kịp ghi nhận?*
3. *Điều gì sẽ xảy ra nếu phần khám phá được nhóm tinh gọn lại theo 2 nhu cầu cốt lõi: "Phát triển bản thân" (SV5T, Sự kiện) và "Kết nối Cộng đồng" (Chi hội, CLB)?*
