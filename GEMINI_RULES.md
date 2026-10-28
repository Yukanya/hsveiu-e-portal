# QUY TẮC SỐNG CÒN DÀNH CHO AI (GEMINI_RULES / VIBE CODING CONSTITUTION)
**Dự án:** Hệ thống Thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU Portal)  
**Chủ nhiệm dự án / Kiến trúc sư trưởng:** Đ/c Trương Châu Phước Lộc – Chủ tịch Hội Sinh viên Trường

---

## 1. MỆNH LỆNH BẮT BUỘC TRƯỚC KHI VIẾT CODE (MANDATORY PRE-FLIGHT READ)

Trước khi thực hiện bất kỳ thao tác thêm/sửa/xóa mã nguồn, tạo giao diện hoặc thay đổi cơ sở dữ liệu nào, AI **BẮT BUỘC** phải tham chiếu và tuân thủ tuyệt đối 3 tệp tài liệu gốc trong thư mục `/docs`:
1. **`/docs/01_PRD.md`**: Đặc tả nghiệp vụ, cơ cấu tổ chức HSV EIU Khóa II (NK 2026 – 2028), hệ thống phân quyền 6 cấp kết hợp kiêm nhiệm đa vị trí (`Context Switcher`), quy chế cấp GCN (QĐ 28/QĐ-HSV) và quy định xét chọn "Sinh viên 5 Tốt" (QĐ 09/QĐ-HSV).
2. **`/docs/02_DESIGN_SYSTEM.md`**: Quy chuẩn màu sắc **Xanh Hội Sinh viên (`#0054A6`) kết hợp Xanh Navy đậm EIU (`#0B2545`)**, phong cách **Hành chính – Chuyên nghiệp (Clean Corporate First)**, bộ font `Be Vietnam Pro` / `JetBrains Mono` và bố cục 3 khu vực `(public)`, `(student-portal)`, `(workspace)`.
3. **`/docs/03_DATABASE_SCHEMA.md`**: Cấu trúc bảng, kiểu Enum và mối quan hệ dữ liệu trên Supabase.

> **CẤM TUYỆT ĐỐI:** Không bao giờ tự ý thay đổi kiến trúc tổng quát, tự ý bỏ qua quy định nghiệp vụ trong `/KNOWLEDGE` và `/docs`, hoặc tự bịa thêm màu sắc/cấu trúc bảng lệch khỏi `/docs`.

---

## 2. CÁC QUY TẮC NGHIỆP VỤ BẤT DI BẤT DỊCH CỦA HSV EIU

1. **Xác thực Tên miền `@eiu.edu.vn` & Nhận diện Tự động:**
   - Hệ thống chỉ chấp nhận tài khoản Google có đuôi `@eiu.edu.vn`.
   - Logic phân tích email phải nhận diện tự động 4 Khoa (`cit` $\rightarrow$ Khoa CNTT, `bbs` $\rightarrow$ Khoa QTKD, `set` $\rightarrow$ Khoa Kỹ thuật, `sns` $\rightarrow$ Khoa Điều dưỡng/KHSK) và Khóa học (`23`, `24`, `25`, `26`...).
2. **Đúng Cơ cấu Bộ máy Khóa II (2026 – 2028) theo QĐ 23, QĐ 24 & TB 04:**
   - Bộ máy cấp trường gồm: Ban Chấp hành, Ban Thư ký (Thường trực), Ban Kiểm tra, **Văn phòng Hội Sinh viên (Phòng 206.B06)** và **02 Ban Chuyên môn**:
     - **Ban Tuyên giáo - Phong trào** (Mảng Tuyên giáo & Mảng Phong trào).
     - **Ban Tổ chức và Xây dựng Hội** (Quản lý 5 Cụm: Cụm Chi hội Khoa CNTT, Cụm Chi hội Khoa QTKD, Cụm Chi hội Khoa Kỹ thuật, Cụm Chi hội Khoa Điều dưỡng, và Cụm CLB/Đội/Nhóm).
   - Hỗ trợ đầy đủ cơ chế **Kiêm nhiệm đa vị trí (Role/Unit Context Switcher)** cho các đồng chí vừa giữ chức vụ ở BCH/BKT/Ban Chuyên môn vừa là Chi hội trưởng/phó hoặc Chủ nhiệm/Phó Chủ nhiệm CLB.
3. **Đúng Quy định Cấp Giấy chứng nhận & Ngày Tình nguyện (Quyết định 28/QĐ-HSV):**
   - **Quy tắc 03 ngày:** Đề nghị công nhận ngày tình nguyện phải gửi trước thời gian tổ chức chương trình ít nhất **03 ngày** thông qua Trưởng Ban Tổ chức và Xây dựng Hội trình Ban Thư ký.
   - **Hệ số tình nguyện Đoàn – Hội:** Trưởng/Phó BTC = Hệ số 3; Thành viên BTC = Hệ số 2; CTV/Chiến sĩ tham gia = Hệ số 1. Hiến máu tình nguyện = 5 ngày/lần.
   - **Mẫu danh sách Phụ lục 1:** Bắt buộc sắp xếp **tăng dần theo Mã số sinh viên (MSSV)**.
   - **SLA 07 ngày làm việc:** Tính từ ngày nhận danh sách hợp lệ cuối cùng (không tính Thứ Bảy, Chủ nhật, ngày lễ).
   - **Mẫu E-Certificate Phụ lục 2:** Có mã QR trỏ về Quyết định công nhận; mặc định hiển thị cụm **`(Đã ký)`** (tuyệt đối không tự ý chèn ảnh con dấu/chữ ký nếu chưa bật cờ cho phép của HSV Trường).
4. **Đúng Quy định "Sinh viên 5 Tốt" (Quyết định 09/QĐ-HSV sửa đổi 2026):**
   - GPA Học tập tốt $\ge 3.0/4.0$ (ưu tiên lấy điểm cao hơn giữa Điểm TB năm học tính theo bình quân gia quyền tín chỉ và Điểm tích lũy).
   - Xét duyệt 3 cấp: **Cấp 1 (Cơ sở Hội sơ duyệt) $\rightarrow$ Cấp 2 (Ban Chuyên môn thẩm định) $\rightarrow$ Cấp 3 (Thường trực chốt duyệt)**.
   - **SV5T Tiêu biểu Toàn trường:** Đạt chuẩn SV5T + đạt $\ge 02$ tiêu chí phụ ở 4 tiêu chuẩn (Đạo đức, Học tập, Thể lực, Hội nhập) + đạt tiêu chí ưu tiên Tình nguyện; lấy từ cao xuống thấp theo tổng số tiêu chí phụ, giới hạn tối đa **10%** tổng số SV5T cấp trường.
   - **Tập thể SV5T:** 100% SV đăng ký phấn đấu + $\ge 30\%$ SV đạt SV5T cấp trường + 0% vi phạm kỷ luật.

---

## 3. 4 NGUYÊN TẮC VẬN HÀNH "VIBE CODING"

1. **Chia để trị (One Feature, One Prompt):** Thực thi từng bước nhỏ, rõ ràng, hoàn thiện dứt điểm từng khu vực giao diện và tính năng theo đúng 7 Giai đoạn của Master Roadmap.
2. **Bắt bệnh qua Hình ảnh & Nhật ký lỗi (Log):** Kiểm tra kỹ TypeScript (`tsc --noEmit`), ESLint và giao diện thực tế sau mỗi thay đổi.
3. **Chốt chặn bằng Git liên tục:** Sau mỗi cột mốc hoặc tính năng hoàn chỉnh, đảm bảo mã nguồn sạch, sẵn sàng `git add .` và `git commit`.
4. **Duy trì Trí nhớ Tập trung tại `/docs`:** Bất kỳ khi nào thêm bảng mới, thêm cột mới, hoặc bổ sung quy chuẩn UI/nghiệp vụ, phải cập nhật ngay vào `/docs/01_PRD.md`, `/docs/02_DESIGN_SYSTEM.md` hoặc `/docs/03_DATABASE_SCHEMA.md`.
