# TÀI LIỆU THIẾT KẾ CƠ SỞ DỮ LIỆU TẬP TRUNG (DATABASE SCHEMA)
**Dự án:** Hệ thống Thông tin Điện tử & E-Office Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông (HSV EIU Portal)  
**Hệ quản trị CSDL:** Supabase (PostgreSQL 15+ với Row Level Security - RLS)  
**Nguyên tắc bắt buộc:** Mọi thay đổi về bảng, cột, enum hoặc quan hệ trong quá trình phát triển từ Giai đoạn 1 đến Giai đoạn 7 đều phải được cập nhật đồng bộ tại tệp `/docs/03_DATABASE_SCHEMA.md` này.

---

## 1. DANH MỤC KIỂU DỮ LIỆU ĐỊNH ĐỊNH NGHĨA TRƯỚC (ENUM TYPES)

```sql
-- 1. Cấp độ quyền hệ thống (6 cấp)
CREATE TYPE system_role_enum AS ENUM (
  'student',             -- Cấp 1: Hội viên, Sinh viên EIU (@eiu.edu.vn)
  'collaborator',        -- Cấp 2: Cộng tác viên các Ban, Văn phòng, BCH cơ sở hỗ trợ
  'unit_leader',         -- Cấp 3: Thường trực Cơ sở Hội (Chi hội trưởng/phó, Chủ nhiệm/Phó CN CLB, Đội trưởng/phó)
  'department_officer',  -- Cấp 4: Lãnh đạo & Cán bộ Văn phòng, Ban TG-PT, Ban TC-XDH (gồm Cụm trưởng 5 Cụm)
  'executive_board',     -- Cấp 5: Ủy viên Ban Chấp hành (BCH), Ủy viên Ban Kiểm tra (BKT) HSV Trường
  'standing_committee'   -- Cấp 6: Thường trực Hội / Ban Thư ký (Chủ tịch, Phó Chủ tịch, UV BTK) & Super Admin
);

-- 2. Phân loại Đơn vị trong hệ thống Hội Sinh viên EIU
CREATE TYPE unit_type_enum AS ENUM (
  'standing_committee',  -- Thường trực / Ban Thư ký / BCH / Ban Kiểm tra cấp Trường
  'office',              -- Văn phòng Hội Sinh viên Trường (Phòng 206.B06)
  'department',          -- Ban Chuyên môn (Ban Tuyên giáo - Phong trào, Ban Tổ chức và Xây dựng Hội)
  'faculty_cluster',     -- Cụm Chi hội Khoa (CIT, BBS, SET, SNS) & Cụm CLB/Đội/Nhóm
  'branch',              -- Chi hội lớp (VD: 23QTKD01, 24QTKD01, 25CNTT01, 25KT01, 25KHSK01...)
  'club',                -- Câu lạc bộ trực thuộc (CLB SV5T, CLB MC VoiceUp, CLB Hiến máu, CLB BEAM...)
  'team'                 -- Đội / Nhóm trực thuộc (Đội CTV Xung kích...)
);

-- 3. Mã 4 Khoa đào tạo tại EIU (Tự động nhận diện từ email @eiu.edu.vn)
CREATE TYPE faculty_code_enum AS ENUM (
  'CIT',   -- Khoa Công nghệ Thông tin (School of Computing and Information Technology)
  'BBS',   -- Khoa Quản trị Kinh doanh (Becamex Business School)
  'SET',   -- Khoa Kỹ thuật (School of Engineering and Technology)
  'SNS',   -- Khoa Điều dưỡng / Khoa học Sức khỏe (School of Nursing / Health Sciences)
  'OTHER'  -- Khác / Chuyên viên Phòng Công tác Sinh viên
);

-- 4. Lĩnh vực quy đổi Ngày tình nguyện (Theo Phụ lục 2, QĐ 09/QĐ-HSV)
CREATE TYPE volunteer_category_enum AS ENUM (
  'community',     -- 01. Cộng đồng (Mái ấm, nhà tình thương, viện dưỡng lão, CTXH)
  'support',       -- 02. Hỗ trợ
  'education',     -- 03. Giáo dục (Gia sư tình thương, gia sư EIU, lớp kỹ năng/ngoại ngữ miễn phí)
  'health',        -- 04. Sức khỏe (Tình nguyện bệnh viện, Hiến máu tình nguyện = 5 ngày/lần)
  'environment',   -- 05. Môi trường (Trồng cây, dọn rác, Chủ nhật xanh)
  'union_work'     -- 06. Công tác Đoàn – Hội (Nhân hệ số 3 / 2 / 1 theo vai trò)
);

-- 5. Hệ số vai trò tham gia Công tác Đoàn – Hội (Phụ lục 2, QĐ 09/QĐ-HSV)
CREATE TYPE participation_multiplier_enum AS ENUM (
  'participant',        -- Hệ số 1: Cộng tác viên hỗ trợ / Chiến sĩ / Sinh viên tham gia
  'organizer_member',   -- Hệ số 2: Thành viên Ban Tổ chức
  'organizer_leader'    -- Hệ số 3: Trưởng, Phó các Ban / Đội / Đội hình
);

-- 6. Trạng thái thẩm định quy đổi ngày tình nguyện & cấp GCN (Theo QĐ 28/QĐ-HSV)
CREATE TYPE cert_workflow_status_enum AS ENUM (
  'draft',                      -- Bản nháp
  'pre_approval_pending',       -- Đang xin ý kiến công nhận ngày TN trước 03 ngày (Điều 4)
  'pre_approval_approved',      -- Đã được BTK / Trưởng Ban TC-XDH đồng ý chủ trương quy đổi ngày TN
  'pre_approval_rejected',      -- Không đủ điều kiện quy đổi ngày TN (hoặc nộp trễ hạn 03 ngày)
  'list_submitted',             -- Đã nộp Danh sách đề nghị cấp GCN sau sự kiện (Bắt đầu đếm SLA 07 ngày làm việc)
  'revision_requested',         -- Yêu cầu Bên đề nghị chỉnh sửa/bổ sung danh sách hoặc minh chứng
  'decision_issued',            -- Đã ban hành Quyết định công nhận & kích hoạt E-Certificate
  'rejected'                    -- Từ chối cấp GCN do vi phạm/gian lận
);

-- 7. Trạng thái xét duyệt Hồ sơ "Sinh viên 5 Tốt" (3 cấp duyệt)
CREATE TYPE sv5t_review_status_enum AS ENUM (
  'draft',                      -- Sinh viên đang lưu nháp minh chứng
  'submitted',                  -- Sinh viên đã nộp hồ sơ
  'level1_branch_approved',     -- Cấp 1 (Chi hội / CLB) đã sơ duyệt Đạt
  'level1_branch_returned',     -- Cấp 1 yêu cầu bổ sung
  'level2_dept_approved',       -- Cấp 2 (Ban TG-PT / Ban TC-XDH) đã thẩm định Đạt
  'level2_dept_returned',       -- Cấp 2 yêu cầu bổ sung
  'level3_final_approved',      -- Cấp 3 (Thường trực / Hội đồng) chốt công nhận "Sinh viên 5 Tốt" cấp Trường
  'level3_outstanding_approved',-- Công nhận "Sinh viên 5 Tốt Tiêu biểu Toàn trường" (Top 10%)
  'rejected'                    -- Không đạt
);
```

---

## 2. CẤU TRÚC BẢNG CHI TIẾT (CORE TABLES)

### 2.1. Phân hệ Tổ chức, Hồ sơ Sinh viên & Phân quyền Đa vị trí (Giai đoạn 2 & 6)

#### Bảng `units` (Quản lý toàn bộ Ban, Văn phòng, Cụm Khoa, Chi hội, CLB, Đội, Nhóm)
```sql
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,           -- VD: 'VP-HSV', 'BAN-TGPT', 'BAN-TCXDH', 'CUM-CIT', '25CNTT01', 'CLB-SV5T', 'CLB-VOICEUP'
  name VARCHAR(255) NOT NULL,                 -- Tên đầy đủ đơn vị
  slug VARCHAR(120) UNIQUE NOT NULL,          -- Đường dẫn Micro-site: 'clb-mc-voiceup', 'chi-hoi-25cntt01'
  unit_type unit_type_enum NOT NULL,          -- Loại đơn vị
  faculty_code faculty_code_enum,             -- 'CIT', 'BBS', 'SET', 'SNS' (nếu là Cụm Khoa hoặc Chi hội thuộc Khoa)
  parent_unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL, -- Đơn vị cấp trên / Cụm quản lý trực tiếp
  mentor_name VARCHAR(255),                   -- Giảng viên cố vấn (Mentor) đối với CLB học thuật (phục vụ xác nhận SV5T)
  description TEXT,                           -- Giới thiệu đơn vị trên Micro-site
  logo_url TEXT,
  banner_url TEXT,
  contact_email VARCHAR(255),
  fanpage_url TEXT,
  recruitment_open BOOLEAN DEFAULT false,     -- Trạng thái mở đơn tuyển thành viên/CTV
  recruitment_form_config JSONB DEFAULT '{}'::jsonb,
  total_members_count INT DEFAULT 0,          -- Tổng sĩ số hội viên (phục vụ tính tỷ lệ Tập thể SV5T)
  has_discipline_violation BOOLEAN DEFAULT false, -- Có SV vi phạm kỷ luật không (điều kiện Tập thể SV5T)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Bảng `profiles` (Hồ sơ Sinh viên & Cán bộ Hội – Liên kết `auth.users`)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,         -- Bắt buộc @eiu.edu.vn
  full_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(30) UNIQUE,              -- MSSV (VD: '2331200066'). Null nếu là chuyên viên trường
  gender VARCHAR(10),                         -- 'Nam', 'Nữ' (phục vụ định mức Sinh viên khỏe Nam/Nữ)
  date_of_birth DATE,
  phone VARCHAR(20),
  hometown TEXT,                              -- Quê quán
  permanent_address TEXT,                     -- Địa chỉ thường trú
  faculty_code faculty_code_enum DEFAULT 'OTHER', -- Tự động tách từ email (.cit23, .bbs24, .set25, .sns25)
  cohort_year INT,                            -- Khóa nhập học (VD: 23 -> 2023, 24 -> 2024, 25 -> 2025)
  major_name VARCHAR(255),                    -- Ngành học (VD: 'Kỹ thuật phần mềm', 'Quản trị kinh doanh', 'Điều dưỡng')
  primary_branch_id UUID REFERENCES public.units(id) ON DELETE SET NULL, -- Chi hội gốc của sinh viên (VD: 25CNTT01)
  highest_role system_role_enum DEFAULT 'student', -- Cấp quyền cao nhất của tài khoản
  role_level INT DEFAULT 1 CHECK (role_level BETWEEN 1 AND 6), -- 1 đến 6
  youth_union_title VARCHAR(255),             -- Chức vụ bên Đoàn (VD: 'Phó Bí thư Đoàn Trường', 'UV BCH Chi đoàn Khoa...')
  bank_account_number VARCHAR(50),            -- STK Ngân hàng (phục vụ công tác Văn phòng/Tài chính cán bộ Hội)
  bank_name VARCHAR(100),                     -- Tên Ngân hàng (MBBank, Vietcombank, BIDV, ACB...)
  is_disabled_student BOOLEAN DEFAULT false,  -- Sinh viên khuyết tật (áp dụng tiêu chuẩn Thể lực tốt đặc thù theo QĐ 09)
  total_volunteer_days NUMERIC(5,2) DEFAULT 0.00, -- Tổng ngày tình nguyện tích lũy trong năm học
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Bảng `user_positions` (Bảng Phân công Kiêm nhiệm Đa vị trí – Hỗ trợ Context Switcher)
```sql
CREATE TABLE public.user_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  position_title VARCHAR(255) NOT NULL,       -- VD: 'Chủ tịch', 'Phó Ban Tổ chức và Xây dựng Hội', 'Cụm trưởng Cụm Chi hội Khoa CNTT', 'Chi hội trưởng'
  division_name VARCHAR(255),                 -- Mảng phụ trách (VD: 'Mảng Tuyên giáo', 'Mảng Phong trào', 'Mảng Văn thư – Lưu trữ', 'Cụm Khoa CNTT')
  role_in_unit system_role_enum NOT NULL,     -- Quyền hạn khi chuyển sang ngữ cảnh đơn vị này
  term_name VARCHAR(50) DEFAULT 'Khóa II (2026 - 2028)',
  decision_number VARCHAR(100),               -- Số Quyết định/Thông báo phân công (VD: '15/QĐ-BTK-TC', '04/TB-HSV')
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  started_at DATE DEFAULT CURRENT_DATE,
  ended_at DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 2.2. Phân hệ Cổng thông tin Truyền thông - Public CMS (Giai đoạn 3)

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  summary TEXT,
  content_markdown TEXT NOT NULL,
  thumbnail_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL, -- Bài viết của cấp Trường hay của CLB/Chi hội
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Phó Ban/Trưởng Ban TG-PT duyệt
  status VARCHAR(30) DEFAULT 'draft',         -- 'draft', 'pending_review', 'published', 'archived'
  is_featured_hero BOOLEAN DEFAULT false,     -- Hiển thị trên Hero Banner Trang chủ
  view_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 2.3. Phân hệ Sự kiện, QR Check-in, Ngày tình nguyện & E-Certificate (Giai đoạn 4 – Chuẩn QĐ 28/QĐ-HSV)

```sql
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  organizer_unit_id UUID NOT NULL REFERENCES public.units(id), -- Bên đề nghị / Đơn vị tổ chức
  co_organizer_names TEXT,                    -- Đơn vị phối hợp
  location VARCHAR(500),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  max_participants INT,
  banner_url TEXT,
  
  -- Nghiệp vụ Quy đổi Ngày tình nguyện (Điều 4, QĐ 28/QĐ-HSV & Phụ lục 2, QĐ 09/QĐ-HSV)
  has_volunteer_days BOOLEAN DEFAULT false,
  volunteer_category volunteer_category_enum,
  base_volunteer_days NUMERIC(4,2) DEFAULT 0.00, -- Định mức gốc (VD: 0.5, 1.0, 2.0, 5.0 cho hiến máu)
  pre_approval_requested_at TIMESTAMPTZ,      -- Thời điểm gửi xin ý kiến trước sự kiện (phải <= start_time - 72 giờ)
  pre_approval_by UUID REFERENCES public.profiles(id), -- Đ/c Trưởng Ban TC-XDH / Ban Thư ký duyệt chủ trương
  pre_approval_note TEXT,
  is_late_exception_approved BOOLEAN DEFAULT false, -- Cờ ngoại lệ của Ban Thư ký nếu xin trễ hơn 03 ngày

  -- Nghiệp vụ Cấp Giấy chứng nhận & SLA 07 ngày làm việc (Điều 5, 6, 7 QĐ 28/QĐ-HSV)
  cert_workflow_status cert_workflow_status_enum DEFAULT 'draft',
  cert_header_type VARCHAR(30) DEFAULT 'HSV_ONLY', -- 'DOAN_HSV' (Đoàn TNCS - HSV) hoặc 'HSV_ONLY' (Hội Sinh viên VN)
  valid_list_submitted_at TIMESTAMPTZ,        -- Thời điểm nộp danh sách hợp lệ cuối cùng (Mốc tính 07 ngày làm việc)
  sla_due_at TIMESTAMPTZ,                     -- Hạn chót 07 ngày làm việc (trừ T7, CN, Lễ)
  decision_id UUID,                           -- Liên kết tới Quyết định công nhận chính thức
  allow_digital_seal_image BOOLEAN DEFAULT false, -- Mặc định FALSE: chỉ hiện '(Đã ký)' theo Phụ lục 2 QĐ 28

  -- Cấu hình QR Check-in động & Liên kết tiêu chí SV5T
  qr_secret_seed VARCHAR(128),
  sv5t_linked_criterion VARCHAR(50),          -- 'dao_duc', 'hoc_tap', 'the_luc', 'tinh_nguyen', 'hoi_nhap'
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id VARCHAR(30) NOT NULL,            -- Lưu snapshot MSSV để sắp xếp tăng dần theo Phụ lục 1 QĐ 28
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role_multiplier participation_multiplier_enum DEFAULT 'participant', -- Hệ số 1, 2, 3
  checkin_at TIMESTAMPTZ,
  checkout_at TIMESTAMPTZ,
  attendance_status VARCHAR(30) DEFAULT 'registered', -- 'registered', 'checked_in', 'completed', 'absent'
  
  -- Kết quả công nhận theo Quyết định 28/QĐ-HSV
  proposed_volunteer_days NUMERIC(4,2) DEFAULT 0.00,  -- Số ngày đề nghị (tự động = base_days * hệ số)
  approved_volunteer_days NUMERIC(4,2) DEFAULT 0.00,  -- Số ngày chính thức được HSV xác nhận
  evidence_url TEXT,                          -- Minh chứng ghi nhận ngày tình nguyện
  decision_serial_number INT,                 -- STT của sinh viên theo Danh sách Quyết định (tăng dần theo MSSV)
  certificate_code VARCHAR(100) UNIQUE,       -- Mã định danh GCN chống giả mạo
  certificate_pdf_url TEXT,
  is_verified_by_hsv BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);
```

---

### 2.4. Phân hệ Thi Trắc nghiệm Trực tuyến - Online Quiz (Giai đoạn 4)

```sql
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  unit_id UUID REFERENCES public.units(id),
  sv5t_category VARCHAR(50),                  -- Tự động ghi nhận tiêu chí phụ 'dao_duc' hoặc 'hoi_nhap'
  duration_minutes INT NOT NULL DEFAULT 30,
  pass_score INT NOT NULL DEFAULT 70,
  max_attempts INT DEFAULT 1,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  questions_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Ngân hàng câu hỏi & đáp án
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  score INT DEFAULT 0,
  is_passed BOOLEAN DEFAULT false,
  answers_json JSONB DEFAULT '{}'::jsonb
);
```

---

### 2.5. Phân hệ Số hóa Xét duyệt "Sinh viên 5 Tốt" & "Tập thể SV5T" (Giai đoạn 5 – Chuẩn QĐ 09/QĐ-HSV)

```sql
CREATE TABLE public.sv5t_academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,                 -- VD: 'Năm học 2026 - 2027'
  registration_deadline TIMESTAMPTZ,
  submission_deadline TIMESTAMPTZ,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.sv5t_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES public.sv5t_academic_years(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id), -- Chi hội xét sơ duyệt Cấp 1
  is_striving_registered BOOLEAN DEFAULT true, -- Đã đăng ký phấn đấu SV5T (tính tỷ lệ 100% cho Tập thể SV5T)
  
  -- 1. Tiêu chuẩn Đạo đức tốt
  training_score INT,                         -- Điểm rèn luyện (>= 80/100)
  no_law_violation BOOLEAN DEFAULT true,
  ethics_sub_criteria_count INT DEFAULT 0,    -- Số tiêu chí phụ Đạo đức đạt được (>= 1 để đạt SV5T; >= 2 để xét Tiêu biểu)
  
  -- 2. Tiêu chuẩn Học tập tốt (Công thức bình quân gia quyền học kỳ hoặc GPA tích lũy >= 3.0/4.0)
  semester_gpa_details JSONB DEFAULT '[]'::jsonb, -- [{semester: 'HK1', gpa: 3.70, credits: 16}, ...]
  calculated_year_gpa NUMERIC(3,2),           -- Điểm TB năm học tính tự động làm tròn 2 chữ số
  cumulative_gpa NUMERIC(3,2),                -- Điểm tích lũy
  effective_gpa NUMERIC(3,2),                 -- Hệ thống tự động lấy MAX(calculated_year_gpa, cumulative_gpa)
  academic_sub_criteria_count INT DEFAULT 0,  -- Số tiêu chí phụ Học tập đạt được
  
  -- 3. Tiêu chuẩn Thể lực tốt
  pe_courses_completed INT DEFAULT 0,         -- Hoàn thành đủ 3 môn GDTC
  is_healthy_student_certified BOOLEAN DEFAULT false, -- Đạt danh hiệu 'Sinh viên khỏe' (Phụ lục 1)
  healthy_student_metrics JSONB DEFAULT '{}'::jsonb,  -- Kết quả chạy 100m, 800m/1500m, bật xa, nhảy xa, kéo xà
  physical_sub_criteria_count INT DEFAULT 0,  -- Số tiêu chí phụ Thể lực đạt được
  
  -- 4. Tiêu chuẩn Tình nguyện tốt
  total_verified_volunteer_days NUMERIC(5,2) DEFAULT 0.00, -- >= 5.0 ngày/năm
  has_blood_donation_or_social_club BOOLEAN DEFAULT false, -- Hiến máu hoặc tham gia tích cực CLB hiến máu/CTXH
  has_volunteer_priority_award BOOLEAN DEFAULT false,      -- Tiêu chí ưu tiên: Khen thưởng cấp trường trở lên
  
  -- 5. Tiêu chuẩn Hội nhập tốt
  has_soft_skill_course_or_award BOOLEAN DEFAULT false,    -- Khóa kỹ năng thực hành XH (Phụ lục 3) hoặc khen thưởng Đoàn-Hội
  has_integration_activity BOOLEAN DEFAULT false,          -- >= 1 hoạt động hội nhập cấp trường
  english_cert_type VARCHAR(50),              -- 'IELTS', 'TOEIC', 'TOEFL', 'LEVEL_B', 'SECOND_FOREIGN_LANG'
  english_cert_score VARCHAR(50),             -- VD: '6.5'
  integration_sub_criteria_count INT DEFAULT 0, -- Số tiêu chí phụ Hội nhập đạt được

  -- Tổng hợp xét "Sinh viên 5 Tốt Tiêu biểu Toàn trường"
  total_sub_criteria_count INT GENERATED ALWAYS AS (
    ethics_sub_criteria_count + academic_sub_criteria_count + physical_sub_criteria_count + integration_sub_criteria_count
  ) STORED,
  is_eligible_for_outstanding BOOLEAN DEFAULT false, -- Đủ điều kiện >= 2 tiêu chí phụ ở 4 mục + ưu tiên Tình nguyện

  -- Luồng duyệt 3 cấp (Cơ sở -> Ban Chuyên môn -> Thường trực)
  status sv5t_review_status_enum DEFAULT 'draft',
  level1_reviewer_id UUID REFERENCES public.profiles(id),
  level1_reviewed_at TIMESTAMPTZ,
  level1_note TEXT,
  level2_reviewer_id UUID REFERENCES public.profiles(id),
  level2_reviewed_at TIMESTAMPTZ,
  level2_note TEXT,
  level3_approver_id UUID REFERENCES public.profiles(id),
  level3_approved_at TIMESTAMPTZ,
  level3_note TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(academic_year_id, user_id)
);

CREATE TABLE public.sv5t_evidences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.sv5t_applications(id) ON DELETE CASCADE,
  criterion_category VARCHAR(50) NOT NULL,    -- 'dao_duc', 'hoc_tap', 'the_luc', 'tinh_nguyen', 'hoi_nhap'
  sub_criterion_code VARCHAR(100) NOT NULL,   -- Mã tiêu chí cụ thể trong QĐ 09/QĐ-HSV
  title VARCHAR(500) NOT NULL,
  source_type VARCHAR(30) DEFAULT 'external_upload', -- 'internal_event_sync' (Đồng bộ tự động) hoặc 'external_upload' (Minh chứng ngoại viện)
  linked_event_registration_id UUID REFERENCES public.event_registrations(id),
  file_url TEXT,                              -- File PDF/Ảnh trên Supabase Storage
  is_verified BOOLEAN DEFAULT false,
  reviewer_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 2.6. Phân hệ E-Office, Văn thư Lưu trữ, Phòng 206.B06 & Họp Không Giấy (Giai đoạn 6)

```sql
-- 1. Văn thư lưu trữ & Quyết định công nhận (QĐ, TB, KH, BC, BB)
CREATE TABLE public.official_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(100) UNIQUE NOT NULL, -- VD: '23/QĐ-HSV', '24/QĐ-HSV', '28/QĐ-HSV', '04/TB-HSV'
  doc_type VARCHAR(50) NOT NULL,              -- 'QUYET_DINH', 'THONG_BAO', 'KE_HOACH', 'BAO_CAO', 'BIEN_BAN', 'CONG_VAN'
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  issuing_unit_id UUID REFERENCES public.units(id),
  signer_name VARCHAR(255) DEFAULT 'Trương Châu Phước Lộc',
  signer_title VARCHAR(255) DEFAULT 'Chủ tịch Hội Sinh viên Trường',
  signed_date DATE,
  file_pdf_url TEXT,
  qr_verification_slug VARCHAR(150) UNIQUE,   -- Mã QR gắn trên E-Certificate trỏ về Quyết định này (Phụ lục 2 QĐ 28)
  approval_status VARCHAR(50) DEFAULT 'draft',-- 'draft', 'cluster_review', 'office_legal_check', 'btk_approved', 'published'
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Quản lý Tài sản, Mượn trả thiết bị & Sổ đóng dấu (Mộc) tại Văn phòng 206.B06 (Theo QĐ 24/QĐ-HSV)
CREATE TABLE public.office_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,                 -- VD: 'Bộ đàm Motorola', 'Loa kéo di động', 'Standee cuốn nhôm', 'Cờ Hội Sinh viên'
  total_quantity INT DEFAULT 1,
  available_quantity INT DEFAULT 1,
  condition_status VARCHAR(50) DEFAULT 'good',
  location VARCHAR(100) DEFAULT 'Phòng 206.B06',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.office_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type VARCHAR(50) NOT NULL,          -- 'ASSET_BORROW' (Mượn tài sản), 'SEAL_REQUEST' (Xin đóng dấu Mộc), 'DUTY_SHIFT' (Trực VP 206.B06)
  requester_id UUID NOT NULL REFERENCES public.profiles(id),
  unit_id UUID REFERENCES public.units(id),
  title VARCHAR(500) NOT NULL,
  details_json JSONB DEFAULT '{}'::jsonb,     -- Chi tiết thiết bị mượn, số lượng văn bản đóng mộc, hoặc ca trực
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status VARCHAR(30) DEFAULT 'pending',       -- 'pending', 'approved_by_office', 'completed', 'rejected'
  approved_by UUID REFERENCES public.profiles(id), -- Chánh/Phó Chánh Văn phòng duyệt
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Hệ thống "Họp không giấy" (Paperless Meeting - Theo QĐ 23/QĐ-HSV)
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,                -- VD: 'Họp thường kỳ Ban Thư ký tháng 10/2026', 'Họp BCH Quý IV/2026'
  meeting_type VARCHAR(50) NOT NULL,          -- 'BTK_MONTHLY', 'BCH_QUARTERLY', 'UNIT_BRIEFING', 'CONGRESS'
  start_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) DEFAULT 'Phòng 206.B06 / Trực tuyến',
  agenda_markdown TEXT,
  documents_json JSONB DEFAULT '[]'::jsonb,   -- Danh sách tài liệu họp không giấy
  resolutions_json JSONB DEFAULT '[]'::jsonb, -- Các nội dung biểu quyết thông qua Nghị quyết
  status VARCHAR(30) DEFAULT 'scheduled',     -- 'scheduled', 'ongoing', 'concluded'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Hộp thư Lắng nghe Sinh viên & Giám sát Ban Kiểm tra
CREATE TABLE public.student_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_anonymous_to_public BOOLEAN DEFAULT true,
  category VARCHAR(100) NOT NULL,             -- 'HOC_TAP', 'PHONG_TRAO', 'QUYEN_LOI_SV', 'GOP_Y_CAN_BO', 'KHIEU_NAI'
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  assigned_to_unit VARCHAR(50) DEFAULT 'BAN-TGPT', -- 'BAN-TGPT' (Nắm bắt dư luận) hoặc 'BAN-KIEM-TRA' (Khiếu nại/Giám sát)
  status VARCHAR(30) DEFAULT 'new',           -- 'new', 'processing', 'resolved'
  official_response TEXT,
  responded_by UUID REFERENCES public.profiles(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
