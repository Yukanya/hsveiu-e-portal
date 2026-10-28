# TÀI LIỆU ĐẶC TẢ YÊU CẦU SẢN PHẨM (PRD)
**Dự án:** Hệ thống Thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU Portal)  
**Đơn vị chủ quản:** Ban Chấp hành Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (Khóa II, Nhiệm kỳ 2026 – 2028)  
**Chủ nhiệm dự án / Kiến trúc sư trưởng:** Đ/c Trương Châu Phước Lộc – Chủ tịch Hội Sinh viên Trường  
**Công nghệ cốt lõi:** Next.js (App Router, TypeScript), Supabase (Auth, PostgreSQL, Storage, Realtime), Tailwind CSS  
**Phương pháp triển khai:** Vibe Coding (AI-Assisted Development)

---

## 1. TỔNG QUAN & MỤC TIÊU HỆ THỐNG

Cổng thông tin Điện tử & E-Office Hội Sinh viên EIU là nền tảng số hóa toàn diện phục vụ công tác Hội và phong trào sinh viên tại Trường Đại học Quốc tế Miền Đông (EIU), đáp ứng 3 mục tiêu chiến lược:
1. **Cổng thông tin Truyền thông & Tương tác Sinh viên (`(public)` & `(student-portal)`):** Cung cấp tin tức chính thống, cẩm nang sinh viên, giới thiệu hệ sinh thái Chi hội/CLB/Đội/Nhóm, đăng ký sự kiện 1-chạm (1-Click), thi trực tuyến (Online Quiz), tra cứu Giấy chứng nhận điện tử (E-Certificate), Sổ tay Kỹ thuật số "Sinh viên 5 Tốt" và Hộp thư Lắng nghe Sinh viên.
2. **Hệ thống Quản trị & Chuyên môn cấp Cơ sở và Ban Chuyên môn (`(workspace)`):** Hỗ trợ Ban Chấp hành Chi hội 4 Khoa (`CIT`, `BBS`, `SET`, `SNS`), Ban Chủ nhiệm CLB/Đội/Nhóm, Văn phòng Hội và 2 Ban Chuyên môn (Ban Tuyên giáo - Phong trào, Ban Tổ chức và Xây dựng Hội) vận hành quy trình trình duyệt kế hoạch, xin công nhận ngày tình nguyện, điểm danh QR động, đề nghị cấp GCN và sơ duyệt/thẩm định hồ sơ thi đua.
3. **Trung tâm Điều hành Thường trực & E-Office Không giấy tờ (`(workspace)` cấp Thường trực/BCH/BKT):** Phục vụ Ban Thư ký, Thường trực Hội (Chủ tịch, các Phó Chủ tịch), Ban Kiểm tra và Ban Chấp hành điều hành công việc, quản lý văn thư lưu trữ, ký ban hành Quyết định công nhận, quản lý tài sản/con dấu và trực Văn phòng `206.B06`, họp không giấy (Paperless Meeting) và theo dõi thống kê đa chiều theo thời gian thực.

---

## 2. CƠ CẤU TỔ CHỨC NGHIỆP VỤ (THEO VĂN BẢN PHÁP LÝ KHÓA II, NK 2026 – 2028)

Hệ thống được thiết kế bám sát bộ văn bản pháp lý trong thư mục `/KNOWLEDGE`:
- **Quyết định 23/QĐ-HSV:** Quy chế làm việc của BCH HSV trường khóa II, nhiệm kỳ 2026 – 2028.
- **Quyết định 24/QĐ-HSV:** Quy chế về chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Văn phòng HSV và các Ban Chuyên môn.
- **Thông báo 04/TB-HSV:** Phân công BCH và các đồng chí chủ chốt phụ trách các mảng công tác.
- **Quyết định 09/QĐ-HSV:** Quy định tiêu chuẩn xét chọn danh hiệu "Sinh viên 5 tốt", "Sinh viên 5 tốt tiêu biểu toàn trường" và "Tập thể Sinh viên 5 tốt" cấp trường (sửa đổi, bổ sung năm 2026).
- **Quyết định 28/QĐ-HSV:** Quy định về việc cấp Giấy chứng nhận (GCN) và công nhận ngày tình nguyện của Hội Sinh viên trường cho sinh viên EIU.
- **Sổ tay Sinh viên EIU (EIU Student Handbook 2026 – 2027):** Quy chế đào tạo học kỳ theo Quý (03 HK chính + 01 HK Hè), quy tắc cấu trúc Mã số sinh viên 10 chữ số, thang điểm 4.0, hệ thống 4 Khoa chuyên ngành + Khoa Giáo dục Đại cương, và 4 nhóm Câu lạc bộ sinh viên.
- **Báo cáo Phát triển Bền vững EIU (EIU Sustainability Report 2025):** Triết lý *"Nhân bản – Cộng đồng – Sáng tạo – Bền vững"*, 6 Giá trị cốt lõi (*Xuất sắc, Chính trực, Thiện chí, Hợp tác, Cộng đồng, Bền vững*) và gắn kết hoạt động sinh viên với 17 Mục tiêu Phát triển Bền vững của Liên Hợp Quốc (UN SDGs) & tiêu chuẩn "Sự kiện Xanh" (Không chai nhựa dùng một lần, EIU Green Giving, Thu gom pin).

### 2.1. Các Khối Đơn vị (`units`) trong Hệ thống (Chuẩn hóa theo Sơ đồ Cơ cấu Tổ chức đầy đủ Khóa II)

1. **Cấp Trường: Ban Chấp hành, Ban Thư ký & Ban Kiểm tra (Level 01):**
   - **Ban Chấp hành Hội Sinh viên trường (15 Đồng chí):** Cơ quan lãnh đạo cao nhất giữa 2 kỳ Đại hội.
     - **Ban Thư ký Hội Sinh viên trường (05 Đồng chí):**
       - 01 Chủ tịch Hội Sinh viên trường (phụ trách chung, chỉ đạo toàn diện).
       - 01 Phó Chủ tịch Thường trực (điều hành các hoạt động thường trực).
       - 01 Phó Chủ tịch, Trưởng Ban Kiểm tra (phụ trách công tác kiểm tra, giám sát).
       - 02 Ủy viên Ban Thư ký (phụ trách các mảng công tác thường trực của Hội).
     - **Các Ủy viên Ban Chấp hành (10 Đồng chí):**
       - 01 Ủy viên BCH kiêm Ủy viên Ban Kiểm tra.
       - 09 Ủy viên Ban Chấp hành (phụ trách các ban chuyên môn, cụm hoạt động Khoa, Chi hội và các CLB/Đội/Nhóm).
   - **Ban Kiểm tra Hội Sinh viên trường (05 Đồng chí):**
     - 01 Trưởng Ban Kiểm tra (do đồng chí Phó Chủ tịch HSV trường đảm nhiệm).
     - 01 Ủy viên Ban Kiểm tra (do đồng chí Ủy viên BCH đảm nhiệm).
     - 03 Ủy viên Ban Kiểm tra (các Ủy viên chuyên trách công tác kiểm tra, giám sát của Hội).

2. **Khối các Ban Chuyên môn Hội Sinh viên Trường (Level 02 - Quy mô 03 Ban):**
   - **Đơn vị 01 – Văn phòng Hội Sinh viên trường (Phòng 206.B06):**
     - *Cấp điều hành cao nhất (Ngang cấp):* 01 **Chánh Văn phòng** (phụ trách công tác đối ngoại với các phòng, ban trong nhà trường) & 01 **Tổng Thư ký** (điều hành các tác vụ nội bộ của Văn phòng).
     - *Cấp Phó Văn phòng:* 02 **Phó Chánh Văn phòng** (hỗ trợ đối ngoại, hành chính và điều phối nội bộ, văn thư - lưu trữ, tài chính - hậu cần).
     - *Lực lượng thực thi:* Cán bộ Văn phòng (Cán bộ ban) và Cộng tác viên Văn phòng (CTV ban).
   - **Đơn vị 02 – Ban Tổ chức và Xây dựng Hội:**
     - *Cấp Trưởng ban:* 01 **Trưởng ban Tổ chức và Xây dựng Hội** (phụ trách chung công tác tổ chức, nhân sự, phát triển Hội viên và quản lý hệ thống cơ sở Hội).
     - *Cấp Phó ban (05 Phó ban):*
       - 04 Phó ban kiêm **Cụm trưởng Cụm hoạt động theo Khoa** (QTKD, KT, CNTT, KHSK).
       - 01 Phó ban phụ trách **Quản lý Cụm CLB / Đội / Nhóm trực thuộc**.
     - *Lực lượng thực thi:* Cán bộ Ban Tổ chức - Xây dựng Hội và Cộng tác viên (CTV).
   - **Đơn vị 03 – Ban Tuyên giáo - Phong trào (02 Mảng chuyên môn, 06 Tiểu ban & Đội CTVXK):**
     - **Mảng Tuyên giáo:**
       - 01 Trưởng ban (Trưởng mảng Tuyên giáo) + 02 Phó ban (Mảng Tuyên giáo).
       - 03 Tiểu ban chuyên môn: **Tiểu ban Design**, **Tiểu ban Video**, **Tiểu ban Photo**.
       - Cán bộ Mảng Tuyên giáo & Cộng tác viên (CTV).
     - **Mảng Phong trào:**
       - 01 Trưởng ban (Trưởng mảng Phong trào) + 02 Phó ban (Mảng Phong trào).
       - 03 Tiểu ban chuyên môn: **Tiểu ban Tài chính**, **Tiểu ban Nội dung - Kịch bản**, **Tiểu ban MC**.
       - **Đội Cộng tác viên Xung kích (Đội CTVXK):** Đơn vị trực thuộc Mảng Phong trào, trực tiếp quản lý 02 tiểu ban:
         - *Tiểu ban Hậu cần - Sân khấu*
         - *Tiểu ban Lễ tân - Khánh tiết - Văn thể mỹ*
       - Cán bộ Mảng Phong trào & Cộng tác viên (CTV).

3. **Khối Chi hội trực thuộc (Level 03A - Chính xác 25 Chi hội):**
   - Phân bố theo **04 Khoa (Cụm hoạt động)** và **06 Cụm thi đua khóa (2021 – 2026)**:
     - **Khoa Quản trị Kinh doanh (QTKD - 06 Chi hội):** `21QTKD01`, `22QTKD01`, `23QTKD01`, `24QTKD01`, `25QTKD01`, `26QTKD01`.
     - **Khoa Kỹ thuật (KT - 06 Chi hội):** `21KT01`, `22KT01`, `23KT01`, `24KT01`, `25KT01`, `26KT01`.
     - **Khoa Công nghệ Thông tin (CNTT - 07 Chi hội):** `21CNTT01`, `22CNTT01`, `23CNTT01`, `24CNTT01`, `25CNTT01`, `25CNTT02`, `26CNTT01`.
     - **Khoa Khoa học Sức khỏe (KHSK - 06 Chi hội):** `21KHSK01`, `22KHSK01`, `23KHSK01`, `24KHSK01`, `25KHSK01`, `26KHSK01`.
   - **Cơ cấu tổ chức mỗi Chi hội (Chuẩn 05 đồng chí BCH Chi hội):**
     - 01 Chi hội trưởng
     - 02 Chi hội phó
     - 02 Ủy viên Ban Chấp hành Chi hội
     - Tập thể: Các Hội viên ưu tú và Các Hội viên Chi hội.

4. **Khối Câu lạc bộ / Đội / Nhóm trực thuộc (Level 03B - Toàn bộ 30 Đơn vị chia 4 nhóm lĩnh vực):**
   - **Cơ cấu tổ chức mỗi CLB / Đội / Nhóm (Chuẩn 05 đồng chí Ban Chủ nhiệm):**
     - 01 Chủ nhiệm
     - 02 Phó Chủ nhiệm
     - 02 Ủy viên Ban Chủ nhiệm
     - Tập thể: Thành viên chính thức và Cộng tác viên (CTV).
   - **Danh mục 30 CLB/Đội/Nhóm trực thuộc Hội Sinh viên trường (theo danh sách chính thức):**
     - **I. Khối Học thuật (06 CLB):**
       1. *CLB Học thuật Honors Club* (Becamex Business School Honors Club)
       2. *CLB Học thuật EIU IT Club* (Khoa Công nghệ Thông tin)
       3. *CLB Học thuật BBS Finance Club* (Tài chính - Ngân hàng)
       4. *CLB Học thuật EIU Korean Club* (Tiếng Hàn & Văn hóa Hàn Quốc)
       5. *CLB Học thuật EIU Student Technical Club* (Khoa Kỹ thuật)
       6. *CLB Học thuật EIU Economics Club* (Kinh tế học)
     - **II. Khối Nghệ thuật (10 CLB):**
       1. *CLB Nghệ thuật EIU The Voice Up Club* (Kỹ năng MC, Dẫn chương trình & Giao tiếp)
       2. *CLB Nghệ thuật EIU Kurume Club* (Văn hóa, Cosplay & Giao lưu Nhật Bản)
       3. *CLB Nghệ thuật Soarers Club* (Âm nhạc, Acoustic)
       4. *CLB Nghệ thuật Bumblebee Dance Club* (Vũ đạo & Nhảy hiện đại)
       5. *CLB Nghệ thuật Passion Club* (Văn nghệ & Nghệ thuật biểu diễn)
       6. *CLB Nghệ thuật EIU Photography Club (EPC)* (Nhiếp ảnh & Truyền thông thị giác)
       7. *CLB Nghệ thuật The Villains*
       8. *CLB Nghệ thuật The Rising Ether Club*
       9. *CLB Nghệ thuật Helios Cheer Club* (Cheerleading / Cổ động)
       10. *CLB Nghệ thuật Nauzzy Dance*
     - **III. Khối Thể thao (07 CLB):**
       1. *CLB Thể thao FireLions* (CLB Bóng rổ EIU Basketball)
       2. *CLB Thể thao EIU Football Club* (CLB Bóng đá)
       3. *CLB Thể thao EIU ACE Volleyball Club* (CLB Bóng chuyền)
       4. *CLB Thể thao EIU Badminton Club* (CLB Cầu lông)
       5. *CLB Thể thao EIU Ping-Pong Club* (CLB Bóng bàn)
       6. *CLB Thể thao EIU Calisthenics Club* (Thể dục thể hình đường phố)
       7. *CLB Thể thao EIU Taekwondo Club* (Võ thuật Taekwondo)
     - **IV. Khối Cộng đồng & Tình nguyện (07 CLB / Đội):**
       1. *CLB Cộng đồng Sunshine Club* (Chủ nhiệm: Trần Thị Tuyết Nhi - Hoạt động thiện nguyện)
       2. *CLB Cộng đồng Blood Donation Club* (CLB Hiến máu tình nguyện EIU - Chủ nhiệm: Nguyễn Duy Huân)
       3. *CLB Cộng đồng EIU BEAM Club* (CLB Truyền thông & Sự kiện - Chủ nhiệm: Đào Văn Thanh)
       4. *CLB Cộng đồng EIU Hospitality Club* (Chủ nhiệm: Lê Trần Bảo Trân)
       5. *CLB Cộng đồng EIU First Aid Club* (CLB Sơ cấp cứu y tế học đường - Chủ nhiệm: Hà Thị Kim Phụng)
       6. *CLB Cộng đồng Sinh viên 5 tốt* (Chủ nhiệm: Nguyễn Mai Gia Tường - Đồng hành rèn luyện phong trào SV5T)
       7. *Đội Cộng tác viên Xung kích* (Đội trưởng: Nguyễn Thanh Đạt - Đội hình thanh niên xung kích cấp trường)

---

## 3. HỆ THỐNG PHÂN QUYỀN 6 CẤP & CƠ CHẾ KIÊM NHIỆM ĐA VAI TRÒ (RBAC + CONTEXT SWITCHER)

### 3.1. Ma trận Phân quyền 6 Cấp độ (`role_level` từ 1 đến 6)

| Cấp độ | Mã định danh (`system_role`) | Đối tượng áp dụng | Quyền hạn cốt lõi trên hệ thống |
| :--- | :--- | :--- | :--- |
| **Cấp 1** | `student` | Toàn thể Hội viên, Sinh viên EIU (`@eiu.edu.vn`) | Đăng nhập Google OAuth `@eiu.edu.vn`; đăng ký sự kiện 1-click; thi Online Quiz; xem/tải E-Certificate; cập nhật Sổ tay Kỹ thuật số & nộp hồ sơ SV5T; gửi ý kiến Hộp thư Lắng nghe Sinh viên; đăng ký tuyển CTV/thành viên CLB. |
| **Cấp 2** | `collaborator` | Cộng tác viên (CTV) các Ban, CTV Văn phòng, Ủy viên BCH Chi hội/CLB hỗ trợ tác nghiệp | Toàn bộ quyền Cấp 1 + Quyền tác nghiệp được giao: Quét mã QR Check-in tại sự kiện được phân công, soạn thảo bài viết nháp (Draft), trực Văn phòng 206.B06, hỗ trợ nhập liệu danh sách đề nghị cấp GCN. |
| **Cấp 3** | `unit_leader` | Thường trực Cơ sở Hội: Chi hội trưởng/phó, Chủ nhiệm/Phó Chủ nhiệm CLB, Đội trưởng/Đội phó Đội/Nhóm | Quản trị Micro-site đơn vị; quản lý danh sách hội viên của đơn vị; tạo dự thảo Kế hoạch hoạt động trình duyệt; gửi đề nghị công nhận ngày tình nguyện (trước 03 ngày) & danh sách đề nghị cấp GCN; **Sơ duyệt cấp 1** hồ sơ SV5T của đơn vị; theo dõi tiến độ "Tập thể SV5T" của đơn vị; đăng ký mượn tài sản/phòng 206.B06. |
| **Cấp 4** | `department_officer` | Lãnh đạo & Cán bộ Ban Chuyên môn / Văn phòng: Trưởng/Phó/Cán bộ Văn phòng, Ban TG-PT, Ban TC-XDH (bao gồm các Cụm trưởng 5 Cụm) | **Theo chức năng từng Ban:**<br>- **Văn phòng:** Quản lý văn thư đi/đến, kiểm tra thể thức văn bản, quản lý thu-chi quỹ Hội, duyệt lịch trực & mượn tài sản/mộc tại phòng 206.B06.<br>- **Ban TG-PT:** Xuất bản bài viết CMS, quản lý Banner, tạo cuộc thi Online Quiz, tổng hợp dư luận sinh viên, **Thẩm định cấp 2** hồ sơ SV5T.<br>- **Ban TC-XDH:** Quản lý hồ sơ cán bộ/hội viên toàn trường, thẩm định nhân sự cơ sở, **thẩm định quy đổi ngày tình nguyện (trước 03 ngày)** và kiểm tra danh sách đề nghị cấp GCN của các Cụm được phân công. |
| **Cấp 5** | `executive_board` | Ủy viên Ban Chấp hành (BCH), Ủy viên Ban Kiểm tra (BKT) HSV Trường | Truy cập không gian "Họp không giấy" (Paperless Meeting), biểu quyết nghị quyết trực tuyến; xem báo cáo định kỳ; **Ban Kiểm tra** có quyền giám sát nhật ký hệ thống (Audit Logs), tiến độ thực hiện quy chế của BCH/Cơ sở và xử lý phản ánh/khiếu nại. |
| **Cấp 6** | `standing_committee` | Thường trực Hội & Ban Thư ký (Chủ tịch, các Phó Chủ tịch, Ủy viên BTK) & Super Admin | Toàn quyền điều hành hệ thống; phê duyệt cuối cùng Kế hoạch hoạt động cấp cơ sở/trường; **Chốt duyệt cấp 3** danh hiệu SV5T & SV5T tiêu biểu toàn trường; ký ban hành Quyết định công nhận GCN & ngày tình nguyện; xem Dashboard Thống kê Real-time đa chiều; phân quyền nhân sự. |

### 3.2. Cơ chế Kiêm nhiệm Đa vị trí (Multi-Role & Context Switcher)
- **Thực tế nghiệp vụ tại HSV EIU:** Một nhân sự trong BCH/BKT thường kiêm nhiệm nhiều chức danh ở các cấp khác nhau (Ví dụ: Đ/c Trần Nguyễn Quỳnh Trân vừa là *Ủy viên Ban Kiểm tra* [Cấp 5], vừa là *Phó Ban TC-XDH kiêm Cụm trưởng Cụm Chi hội Khoa CNTT & Cán bộ Ban TG-PT* [Cấp 4], vừa là *Chi hội phó Chi hội 25CNTT01* [Cấp 3]).
- **Giải pháp Kiến trúc:**
  - Bảng `profiles` lưu `highest_role_level` (cấp quyền cao nhất của cá nhân để mở khóa Workspace).
  - Bảng `user_positions` lưu toàn bộ các chức vụ kiêm nhiệm của người dùng gắn với từng đơn vị (`unit_id`), mảng công tác (`division`), và quyền hạn tương ứng.
  - Giao diện **Workspace Header** có bộ chuyển đổi ngữ cảnh (**Role/Unit Context Switcher**): Cán bộ có thể chọn làm việc dưới góc độ *"Phó Ban TC-XDH (Cụm CNTT)"* hoặc chuyển sang *"BCH Chi hội 25CNTT01"* mà không cần đăng xuất hay dùng nhiều tài khoản.

---

## 4. ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ NGHIỆP VỤ & TÍNH NĂNG ĐỘT PHÁ

### 4.1. Tự động Nhận diện Hồ sơ Sinh viên từ Email `@eiu.edu.vn` & Giải mã MSSV 10 Chữ số (Smart Onboarding)
- Chỉ cho phép đăng nhập Google OAuth với tên miền `@eiu.edu.vn`.
- **Phân tích tự động cấu trúc Email EIU:** `<ten>.<holot>.<makhoa><khoahoc>@eiu.edu.vn` (Ví dụ: `loc.truongchau.cit23@eiu.edu.vn`, `quynh.nguyen.bbs24@eiu.edu.vn`, `hoang.nguyenduc.set23@eiu.edu.vn`, `thuy.phamthi.sns25@eiu.edu.vn`):
  - `cit` $\rightarrow$ **Khoa Công nghệ Thông tin** (`School of Computing and Information Technology` – Phòng 301.B10).
  - `bbs` $\rightarrow$ **Khoa Quản trị Kinh doanh** (`Becamex Business School` – Phòng 104.B3).
  - `set` $\rightarrow$ **Khoa Kỹ thuật** (`School of Engineering` – Phòng 303.B10).
  - `sns` $\rightarrow$ **Khoa Khoa học Sức khỏe** (`School of Health Sciences` – Phòng 311.B10).
  - `23`, `24`, `25`, `26`... $\rightarrow$ Tự động nhận diện Khóa nhập học (Ví dụ: `23` = Khóa 2023).
- **Quy tắc Giải mã & Kiểm tra tính hợp lệ Mã số Sinh viên 10 chữ số ($X_1 X_2 X_3 X_4 X_5 X_6 X_7 X_8 X_9 X_{10}$ theo Sổ tay Sinh viên EIU trang 15):**
  - $X_1 X_2$: 2 số cuối năm nhập học (VD: `23`, `24`, `25`).
  - $X_3$: Bậc đào tạo (`3` = Đại học).
  - $X_4$: Loại hình đào tạo (`1`, `2` = Chính quy).
  - $X_5 X_6$: Mã ngành đào tạo (VD: `10` = Điều khiển & Tự động hóa, `12` = Cơ điện tử, `14` = Điện tử - Viễn thông, `15` = Cơ khí, `20` = Kỹ thuật phần mềm, `22` = Mạng máy tính & truyền thông dữ liệu, `30`/`31`/`41` = Quản trị kinh doanh / Kinh tế, `40` = Điều dưỡng).
  - $X_7 X_8 X_9 X_{10}$: Số thứ tự sinh viên (4 chữ số).
- Đối với email cán bộ/chuyên viên không có mã khóa học (ví dụ `hanh.nguyenmy@eiu.edu.vn` – Bộ phận Hoạt động Sinh viên, Phòng CTSV `101.B5`), hệ thống nhận diện là tài khoản Cán bộ/Chuyên viên và đối chiếu danh sách BCH Khóa II để gán quyền tự động.

### 4.2. Cổng thông tin Truyền thông (Public CMS) & Micro-site Cơ sở
- **Trang chủ `(public)`:** Hero Banner sự kiện trọng điểm, luồng Tin tức – Điểm tin hoạt động, Thông báo – Văn bản công khai, Lịch sự kiện sắp diễn ra, Bảng vàng Sinh viên 5 Tốt, Thống kê số liệu phong trào.
- **Trình biên tập cho Ban Tuyên giáo - Phong trào:** Hỗ trợ soạn thảo bài viết (Markdown/Rich Text), gắn thẻ chuyên mục, luồng kiểm duyệt bài viết (Cán bộ soạn nháp $\rightarrow$ Phó Ban Nội dung kiểm duyệt $\rightarrow$ Trưởng Ban Tuyên giáo duyệt đăng).
- **Danh bạ & Micro-site CLB/Đội/Nhóm/Chi hội:** Mỗi đơn vị có 1 trang giới thiệu riêng (Logo, Cơ cấu Ban Chủ nhiệm/BCH Chi hội, Hình ảnh hoạt động, Sự kiện của đơn vị, và Form đăng ký Tuyển thành viên/CTV trực tuyến).

### 4.3. Quản lý Sự kiện, Check-in QR Động & Quy trình Cấp Giấy chứng nhận (Chuẩn QĐ 28/QĐ-HSV)
Tuân thủ tuyệt đối **Quyết định số 28/QĐ-HSV ngày 01/9/2026** và **Phụ lục 2 Quy định 09/QĐ-HSV**:
1. **Bước 1 – Xin ý kiến công nhận Ngày tình nguyện (Trước ít nhất 03 ngày tổ chức):**
   - Khi đơn vị (`Bên đề nghị`: Chi hội, CLB, Đội, Nhóm, BTC) tạo sự kiện có đề xuất quy đổi ngày tình nguyện, hệ thống bắt buộc gửi yêu cầu thẩm định đến **Ban Thư ký thông qua Trưởng Ban Tổ chức và Xây dựng Hội** ít nhất **03 ngày (72 giờ)** trước thời điểm sự kiện diễn ra (Điều 4, QĐ 28/QĐ-HSV).
   - Nếu tạo hoặc gửi đề nghị muộn hơn 03 ngày trước giờ tổ chức, hệ thống tự động khóa tùy chọn "Công nhận ngày tình nguyện" (chỉ cho phép đề nghị cấp GCN tham gia thông thường), trừ khi tài khoản cấp **Ban Thư ký (`standing_committee`)** bật cờ phê duyệt ngoại lệ.
2. **Bước 2 – Bảng quy đổi tự động Số ngày tình nguyện & Hệ số (Phụ lục 2, QĐ 09/QĐ-HSV):**
   - Hỗ trợ 6 lĩnh vực:
     - `01 - Cộng đồng` (0.5–1 ngày $\rightarrow$ 0.5–1 ngày; $\ge 2$ ngày $\rightarrow$ tối đa 15 ngày).
     - `02 - Hỗ trợ` (1–2 ngày $\rightarrow$ 1 ngày).
     - `03 - Giáo dục` (Sự kiện ngắn: 1–2 ngày = 1 ngày, 3–4 ngày = 2 ngày, 5–7 ngày = 3 ngày; Sự kiện dài ngày buổi $\le 6$ tiếng = 0.5 ngày).
     - `04 - Sức khỏe` (Tình nguyện bệnh viện 1–4 ngày = 1–4 ngày; **Hiến máu tình nguyện 1 lần = 5 ngày**).
     - `05 - Môi trường` ($\le 6$ tiếng = 0.5 ngày; 1–2 ngày = 1 ngày; 3–4 ngày = 2 ngày; 5–7 ngày = 3 ngày).
     - `06 - Công tác Đoàn – Hội`:
       - Định mức gốc: Seminar/Workshop/Talkshow/Lễ $\le 1$ ngày = `0.5 ngày`; Hội thi/Giải thể thao/Cuộc thi offline = `1 ngày`; Chương trình thiện nguyện = `1 ngày`; Chiến dịch Xuân tình nguyện / TNTN Hè = `2 ngày`.
       - **Tự động nhân hệ số vai trò:**
         - Trưởng, Phó các Ban/Đội/Đội hình BTC: **Hệ số 3** ($\times 3$).
         - Thành viên Ban Tổ chức: **Hệ số 2** ($\times 2$).
         - Cộng tác viên hỗ trợ / Chiến sĩ tham gia: **Hệ số 1** ($\times 1$).
3. **Bước 3 – Đăng ký 1-chạm & Check-in QR Code động:**
   - Sinh viên đăng ký tham gia sự kiện bằng 1 cú nhấp chuột (thông tin Họ tên, MSSV, Email, Khoa tự động lấy từ hồ sơ).
   - Tại sự kiện, BTC bật màn hình QR động (đổi mã token định kỳ chống chụp màn hình điểm danh hộ) hoặc dùng camera quét thẻ QR định danh của sinh viên.
4. **Bước 4 – Tổng hợp Danh sách hợp lệ & Theo dõi SLA 07 ngày làm việc (Điều 5 & Điều 6, QĐ 28/QĐ-HSV):**
   - Sau sự kiện, hệ thống tự động kết xuất **Danh sách đề nghị cấp GCN (theo Mẫu Phụ lục 1 QĐ 28/QĐ-HSV)** gồm: `STT`, `Họ và tên`, `MSSV`, `Email`, `Số ngày tình nguyện (nếu có)`, `Minh chứng`, tự động **sắp xếp theo thứ tự tăng dần của MSSV**.
   - Hệ thống đếm ngược **SLA 07 ngày làm việc** (không tính Thứ Bảy, Chủ nhật và ngày lễ) kể từ khi nhận danh sách hợp lệ cuối cùng để Ban Thư ký kiểm tra và ban hành Quyết định công nhận. Nếu yêu cầu chỉnh sửa, bộ đếm SLA đặt lại khi Bên đề nghị nộp lại danh sách hợp lệ.
5. **Bước 5 – Xuất Giấy chứng nhận điện tử (E-Certificate) chuẩn Phụ lục 2 QĐ 28/QĐ-HSV:**
   - Tự động chọn đúng bộ quốc hiệu/tiêu ngữ & logo (`ĐOÀN TNCS HỒ CHÍ MINH – HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐHQTMĐ` hoặc `HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐHQTMĐ`).
   - Hiển thị chính xác: Họ tên, MSSV, Tên chương trình, Số ngày tình nguyện được công nhận, **Số thứ tự GCN (trùng khớp STT của sinh viên trong Quyết định)**, Ngày ký ban hành Quyết định, **Mã QR dẫn trực tiếp tới văn bản Quyết định đã cấp để xác thực chống làm giả**.
   - **Quy tắc chữ ký & con dấu nghiêm ngặt:** Mặc định hiển thị cụm từ **`(Đã ký)`** cùng Họ tên & Chức vụ người ký Quyết định (không tự ý chèn hình ảnh con dấu và chữ ký trừ khi có cờ cho phép đặc biệt của Thường trực HSV Trường).

### 4.4. Module Cuộc thi Trắc nghiệm Trực tuyến (Online Quiz)
- Phục vụ các cuộc thi tìm hiểu Chủ nghĩa Mác – Lênin, Tư tưởng Hồ Chí Minh, lịch sử, văn hóa, pháp luật, truyền thống Đoàn – Hội hoặc kiến thức hội nhập/ngoại ngữ.
- Hỗ trợ ngân hàng câu hỏi, đảo đề ngẫu nhiên, đếm ngược thời gian làm bài thực tế (Real-time Timer), tự động chấm điểm và tự động đồng bộ kết quả sang tiêu chí phụ của "Sổ tay Sinh viên 5 Tốt" (Đạo đức tốt / Hội nhập tốt).

### 4.5. Số hóa Xét duyệt "Sinh viên 5 Tốt" & "Tập thể Sinh viên 5 Tốt" (Chuẩn QĐ 09/QĐ-HSV sửa đổi 2026)
1. **Mô hình hóa 5 Tiêu chuẩn Cá nhân ("Sinh viên 5 Tốt" cấp Trường):**
   - **Đạo đức tốt:** Điểm rèn luyện $\ge 80/100$, không vi phạm pháp luật/quy chế + Đạt **ít nhất 01 tiêu chí phụ** (có $\ge 04$ môn chính trị đạt từ $3.2/4.0$ trở lên; hoặc tham gia đội thi/cuộc thi Mác-Lênin, tư tưởng HCM, lịch sử văn hóa; hoặc tham gia hoạt động giáo dục lòng yêu nước/Đội Cờ đỏ/An ninh xung kích; hoặc đạt giải/hành động dũng cảm/thanh niên tiêu biểu).
   - **Học tập tốt:** Điểm trung bình chung năm học hoặc điểm tích lũy đạt **từ $3.0/4.0$ trở lên** (Hệ thống tự động tính theo công thức bình quân gia quyền tín chỉ $A = \frac{\sum GPA_i \times n_i}{\sum n_i}$ làm tròn 2 chữ số thập phân và **tự động ưu tiên lấy điểm cao hơn giữa GPA năm học và GPA tích lũy**) + Đạt **ít nhất 01 tiêu chí phụ** (NCKH, bài báo/tham luận cấp Khoa trở lên, sản phẩm sáng tạo, đội tuyển học thuật, giải cuộc thi ý tưởng/học thuật, hoặc sinh hoạt thường xuyên tại 01 CLB học thuật cấp trường có giấy xác nhận của Giảng viên mentor và Chủ nhiệm CLB).
   - **Thể lực tốt:** Hoàn thành đủ **03 môn Giáo dục thể chất** trong chương trình + Đạt **ít nhất 01 tiêu chí phụ** (Đạt danh hiệu "Sinh viên khỏe" cấp trường trở lên theo bảng định mức Nam/Nữ tại Phụ lục 1; hoặc tham gia $\ge 01$ hoạt động TDTT trong học kỳ; hoặc rèn luyện định kỳ tại CLB/đội/nhóm thể thao; hoặc thành viên đội tuyển thể thao; hỗ trợ chế độ tiêu chuẩn riêng cho sinh viên khuyết tật).
   - **Tình nguyện tốt:** Đạt **ít nhất 05 ngày tình nguyện/năm** (tự động cộng dồn từ lịch sử sự kiện & quy đổi theo Phụ lục 2) **VÀ** Tham gia hiến máu tình nguyện trong năm hoặc tham gia tích cực CLB/đội/nhóm vận động hiến máu, công tác xã hội + Theo dõi **Tiêu chí ưu tiên** (Được khen thưởng từ cấp trường trở lên về hoạt động tình nguyện).
   - **Hội nhập tốt:** Hoàn thành $\ge 01$ khóa kỹ năng thực hành xã hội (theo 4 nhóm kỹ năng tại Phụ lục 3) hoặc được Đoàn – Hội từ cấp Khoa trở lên khen thưởng trong năm học **VÀ** Tham gia tích cực $\ge 01$ hoạt động hội nhập cấp trường trở lên + Đạt **ít nhất 01 tiêu chí phụ** (Chứng chỉ ngoại ngữ trình độ B / IELTS $\ge 6.0$ hoặc Ngoại ngữ 2 đối với SV chuyên ngành Ngoại ngữ; hoặc tham gia $\ge 01$ hoạt động giao lưu quốc tế; hoặc đạt từ giải Ba cuộc thi kiến thức hội nhập/ngoại ngữ).
2. **Xét chọn Tự động ứng viên "Sinh viên 5 Tốt Tiêu biểu Toàn trường":**
   - Hệ thống tự động lọc các hồ sơ: Đạt chuẩn SV5T cấp trường + Đạt từ **$\ge 02$ tiêu chí phụ trở lên** ở cả 4 tiêu chuẩn (Đạo đức, Học tập, Thể lực, Hội nhập) + Đạt **tiêu chí ưu tiên** ở tiêu chuẩn Tình nguyện tốt.
   - Tự động xếp hạng từ cao xuống thấp theo **tổng số lượng tiêu chí phụ đạt được** và áp trần **10% tổng số SV5T cấp trường** (tối thiểu 01 sinh viên nếu tổng số SV5T $< 10$).
3. **Bảng theo dõi "Tập thể Sinh viên 5 Tốt" cho Chi hội / CLB / Đội / Nhóm:**
   - Theo dõi trực quan 3 điều kiện của từng đơn vị:
     1. **100% sinh viên** của đơn vị đăng ký phấn đấu danh hiệu "Sinh viên 5 tốt" trên hệ thống.
     2. **Ít nhất 30% sinh viên** của đơn vị đạt danh hiệu "Sinh viên 5 tốt" cấp trường.
     3. Không có sinh viên vi phạm pháp luật/quy chế nhà trường.
4. **Luồng xét duyệt 3 cấp & Xuất báo cáo:**
   - **Cấp 1 (Cơ sở Hội sơ duyệt):** BCH Chi hội / BCN CLB kiểm tra hồ sơ hội viên đơn vị mình.
   - **Cấp 2 (Ban Chuyên môn thẩm định):** Ban Tuyên giáo - Phong trào (Mảng Phong trào & SV5T) phối hợp Ban TC-XDH thẩm định từng minh chứng.
   - **Cấp 3 (Thường trực / Hội đồng chốt duyệt):** Ban Thư ký phê duyệt công nhận chính thức và xuất danh sách hàng loạt ra file Excel/Word phục vụ ban hành Quyết định tuyên dương.

### 4.6. E-Office & Quản trị Nội bộ (Chuẩn QĐ 23/QĐ-HSV & QĐ 24/QĐ-HSV)
1. **Phân hệ Văn thư Lưu trữ & Trình duyệt Kế hoạch trực tuyến:**
   - Quản lý văn bản đi/đến: Quyết định (`QĐ-HSV`), Thông báo (`TB-HSV`), Kế hoạch (`KH-HSV`), Công văn, Biên bản.
   - Luồng trình duyệt Kế hoạch: Cấp CLB/Chi hội nộp dự thảo $\rightarrow$ Cụm trưởng (Ban TC-XDH) & Ban TG-PT góp ý chuyên môn $\rightarrow$ Văn phòng HSV rà soát thể thức pháp lý (Điều 3, QĐ 24/QĐ-HSV) $\rightarrow$ Ban Thư ký / Chủ tịch ký duyệt.
2. **Phân hệ Quản lý Văn phòng 206.B06, Tài sản, Tài chính & Con dấu (Mộc):**
   - Lịch đăng ký trực Văn phòng `206.B06` cho cán bộ và CTV.
   - Sổ quản lý Tài sản – Trang thiết bị (đăng ký mượn/trả bộ đàm, loa, standee, cờ, áo thanh niên...) và Sổ theo dõi đóng dấu (Mộc) Hội Sinh viên.
   - Quản lý dự toán kinh phí hoạt động và theo dõi thu – chi Quỹ Hội minh bạch.
3. **Phân hệ Hồ sơ Cán bộ Hội & Thi đua – Kỷ luật:**
   - Lưu trữ lý lịch trích ngang cán bộ Hội (Chức vụ Đoàn, Chức vụ BCH, BKT, Bộ máy nội bộ, Cơ sở Hội, MSSV, Khoa, Ngành, lịch sử luân chuyển/kiện toàn qua các nhiệm kỳ) và quá trình khen thưởng/kỷ luật.
4. **Hệ thống "Họp không giấy" (Paperless Meeting):**
   - Phục vụ họp Ban Thư ký định kỳ hàng tháng và họp Ban Chấp hành / giao ban cơ sở hàng quý (Điều 8, QĐ 23/QĐ-HSV): Điểm danh đại biểu bằng QR, truy cập tài liệu họp tập trung, gửi ý kiến thảo luận/chất vấn và biểu quyết nghị quyết trực tuyến theo thời gian thực.
5. **Hộp thư Lắng nghe Sinh viên & Khảo sát Dư luận:**
   - Cho phép sinh viên gửi phản ánh, tâm tư, nguyện vọng hoặc đề xuất hoạt động (hỗ trợ chế độ ẩn danh đối với người ngoài và bảo mật danh tính chỉ dành cho Ban TG-PT / Ban Kiểm tra / Thường trực xử lý).

---

## 5. CẤU TRÚC KHU VỰC GIAO DIỆN (SITEMAP 3 KHU VỰC)

1. **`(public)` – Khu vực Công khai (Không cần đăng nhập):**
   - `/` – Trang chủ Cổng thông tin Điện tử HSV EIU
   - `/gioi-thieu` – Giới thiệu Hội Sinh viên EIU, Cơ cấu Tổ chức BCH Khóa II (NK 2026 – 2028)
   - `/tin-tuc` & `/tin-tuc/[slug]` – Tin tức, Bài viết truyền thông, Điểm tin phong trào
   - `/su-kien` & `/su-kien/[id]` – Danh sách Sự kiện & Chi tiết chương trình
   - `/to-chuc` & `/to-chuc/[slug]` – Danh bạ & Micro-site các Chi hội Khoa (`CIT`, `BBS`, `SET`, `SNS`) và CLB/Đội/Nhóm
   - `/van-ban` – Kho Văn bản, Quy chế, Hướng dẫn công khai
   - `/tra-cuu-gcn` – Cổng tra cứu & xác thực Giấy chứng nhận điện tử / Quyết định công nhận bằng mã QR hoặc MSSV
2. **`(student-portal)` – Khu vực Sinh viên / Hội viên (Yêu cầu đăng nhập `@eiu.edu.vn`):**
   - `/portal` – Tổng quan cá nhân (Thẻ Hội viên số, tổng số ngày tình nguyện, tiến độ SV5T)
   - `/portal/su-kien-cua-toi` – Sự kiện đã đăng ký, vé QR Check-in cá nhân, kho E-Certificate của tôi
   - `/portal/sinh-vien-5-tot` – Sổ tay Kỹ thuật số SV5T (Tự động tính GPA gia quyền, đồng bộ minh chứng nội viện, tải lên minh chứng ngoại viện PDF/Ảnh, đăng ký phấn đấu SV5T)
   - `/portal/cuoc-thi` – Phòng thi Trắc nghiệm trực tuyến (Online Quiz)
   - `/portal/lang-nghe` – Hộp thư Lắng nghe Sinh viên & Khảo sát dư luận
3. **`(workspace)` – Khu vực Quản trị & E-Office Nội bộ (Phân quyền từ Cấp 2 đến Cấp 6, có Context Switcher):**
   - `/workspace` – Dashboard điều hành tổng quan & Biểu đồ Real-time đa chiều
   - `/workspace/cms` – Quản trị Bài viết, Chuyên mục, Banner (Ban TG-PT)
   - `/workspace/events` – Quản lý Sự kiện, Xin công nhận ngày tình nguyện (trước 03 ngày), Điểm danh QR động, Xuất danh sách Phụ lục 1 & Cấp E-Certificate
   - `/workspace/sv5t-review` – Hệ thống xét duyệt "Sinh viên 5 Tốt" 3 cấp (Sơ duyệt cơ sở $\rightarrow$ Thẩm định Ban chuyên môn $\rightarrow$ Thường trực chốt duyệt) & Bảng theo dõi "Tập thể SV5T"
   - `/workspace/e-office` – Văn thư lưu trữ, Cổng trình duyệt Kế hoạch trực tuyến, Quản lý Quyết định công nhận (SLA 07 ngày làm việc)
   - `/workspace/office-206` – Quản lý Trực Văn phòng 206.B06, Mượn/Trả Tài sản, Con dấu (Mộc) & Quỹ Hội (Văn phòng HSV)
   - `/workspace/organization` – Quản lý Hồ sơ Cán bộ Hội, Cụm Chi hội 4 Khoa (`CIT`, `BBS`, `SET`, `SNS`) & Cụm CLB/Đội/Nhóm (Ban TC-XDH)
   - `/workspace/paperless-meeting` – Phòng Họp không giấy & Biểu quyết nghị quyết (BCH / BTK / BKT)
   - `/workspace/feedback` – Quản lý Hộp thư Lắng nghe Sinh viên & Giám sát kiểm tra (Ban TG-PT & Ban Kiểm tra)
   - `/workspace/manual` – Hướng dẫn sử dụng hệ thống & Quy trình chuyển giao nhiệm kỳ
