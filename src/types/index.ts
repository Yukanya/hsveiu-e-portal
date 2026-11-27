export type SystemRole =
  | 'student'
  | 'collaborator'
  | 'unit_leader'
  | 'department_officer'
  | 'executive_board'
  | 'standing_committee';

export type FacultyCode = 'CIT' | 'BBS' | 'SET' | 'SNS' | 'OTHER';

export type UnitType =
  | 'standing_committee'
  | 'office'
  | 'department'
  | 'faculty_cluster'
  | 'branch'
  | 'club'
  | 'team'
  | 'subteam';

export type ClubCategory = 'HOC_THUAT' | 'NGHE_THUAT' | 'THE_THAO' | 'CONG_DONG';

export interface PositionAssignment {
  id: string;
  unitCode: string;
  unitName: string;
  unitType: UnitType;
  positionTitle: string;
  divisionName?: string;
  roleInUnit: SystemRole;
  roleLevel: 1 | 2 | 3 | 4 | 5 | 6;
  isPrimary?: boolean;
}

export interface StaffMember {
  id: string;
  orderNumber: number;
  fullName: string;
  studentId: string; // '-' for university staff
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ';
  dateOfBirth: string;
  hometown: string;
  academicYearText: string;
  majorName: string;
  facultyCode: FacultyCode;
  cohortYear: number | null;
  youthUnionTitle: string;
  bchRole:
    | 'Chủ tịch'
    | 'Phó Chủ tịch thường trực'
    | 'Phó Chủ tịch'
    | 'Ủy viên Ban Thư ký'
    | 'Ủy viên Ban Chấp hành'
    | 'Không';
  isBtkMember: boolean;
  bktRole:
    | 'Trưởng Ban Kiểm tra'
    | 'Phó trưởng Ban Kiểm tra'
    | 'Ủy viên Ban Kiểm tra'
    | 'Không';
  internalDeptRole: string;
  internalDeptCode: 'VP-HSV' | 'BAN-TCXDH' | 'BAN-TGPT' | 'NONE';
  tgptWing?: 'TUYEN_GIAO' | 'PHONG_TRAO' | 'BOTH';
  clusterManaged?: FacultyCode | 'CLUB';
  grassrootsRole: string;
  grassrootsUnitCode?: string;
  positions: PositionAssignment[];
}

export interface BranchUnit {
  id: string;
  code: string; // e.g., '25CNTT01'
  name: string;
  slug: string;
  facultyCode: 'CIT' | 'BBS' | 'SET' | 'SNS';
  facultyName: string;
  cohortYear: 21 | 22 | 23 | 24 | 25 | 26;
  clusterLeaderName: string;
  clusterLeaderEmail: string;
  branchPresidentName?: string;
  branchVicePresidentNames?: string[];
  totalMembers: number;
  sv5tRegisteredRate: number; // % đăng ký phấn đấu SV5T (mục tiêu 100%)
  sv5tAchievedRate: number; // % đạt SV5T cấp trường (mục tiêu >= 30%)
  hasDisciplineViolation: boolean;
  description: string;
}

export interface ClubUnit {
  id: string;
  stt: number;
  code: string;
  name: string;
  shortName: string;
  slug: string;
  category: ClubCategory;
  categoryLabel: string;
  unitType: 'club' | 'team';
  isCoreUnionUnit?: boolean; // CLB SV5T & Đội CTV Xung kích
  linkedToTgptMovement?: boolean; // Đội CTV Xung kích trực thuộc Mảng Phong trào
  managedSubteams?: string[];
  presidentName?: string;
  vicePresidentName?: string;
  mentorName?: string;
  fanpageUrl?: string;
  logoDriveUrl?: string;
  memberCount: number;
  recruitmentOpen: boolean;
  foundedYear?: number;
  description: string;
  highlights: string[];
}

export interface NewsArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  category: 'TIN_HOAT_DONG' | 'SINH_VIEN_5_TOT' | 'TUYEN_TRUYEN' | 'THONG_BAO';
  categoryLabel: string;
  summary: string;
  publishedAt: string;
  authorUnit: string;
  viewCount: number;
  isFeatured?: boolean;
  readMinutes?: number;
  relatedDocNumber?: string;
  leadQuote?: string;
  imageUrl?: string;
  newsLevel?: 'CAP_TRUONG' | 'CO_SO_HOI';
  sections?: NewsArticleSection[];
}

export type EventStatusTag =
  | 'Chưa mở đăng ký'
  | 'Đang mở đăng ký'
  | 'Còn 5 ngày'
  | 'Còn 2 ngày'
  | 'Đã đóng đăng ký'
  | 'Đang diễn ra'
  | 'Đã kết thúc';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  organizerUnit: string;
  organizerCode: string;
  location: string;
  startTime: string;
  endTime: string;
  category: string;
  volunteerCategory: string;
  isUnionWorkMultiplierEligible?: boolean; // Chỉ nhóm 06 - Công tác Đoàn - Hội mới nhân hệ số 1-2-3
  baseVolunteerDays: number;
  hasTrainingPoints?: boolean;
  trainingPoints?: number;
  locationArea?: 'EIU' | 'HCM' | 'OTHER';
  timeSlot?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'MULTI_DAY';
  statusTag?: EventStatusTag;
  preApprovalStatus:
    | 'approved_3days_prior'
    | 'pending_tcxdh'
    | 'no_volunteer_days';
  certWorkflowStatus:
    | 'upcoming'
    | 'ongoing'
    | 'list_submitted_sla'
    | 'decision_issued';
  slaDaysRemaining?: number;
  decisionNumber?: string;
  sv5tCriterion:
    | 'Đạo đức tốt'
    | 'Học tập tốt'
    | 'Thể lực tốt'
    | 'Tình nguyện tốt'
    | 'Hội nhập tốt';
  registeredCount: number;
  maxParticipants: number;
  isGreenEvent: boolean; // Theo Báo cáo Phát triển bền vững EIU (Không chai nhựa 1 lần)
  imageUrl?: string;
  description?: string;
  benefits?: string[];
}

export type DocTypeCategory =
  | 'KẾ HOẠCH'
  | 'QUYẾT ĐỊNH'
  | 'THÔNG BÁO'
  | 'CÔNG VĂN'
  | 'TỜ TRÌNH'
  | 'BÁO CÁO'
  | 'BIÊN BẢN'
  | 'HƯỚNG DẪN'
  | 'KHÁC';

export type DocFieldCategory =
  | 'Tổ chức và Xây dựng Hội'
  | 'Tuyên giáo và Phong trào'
  | 'Sinh viên 5 Tốt'
  | 'Ngày tình nguyện và Giấy chứng nhận'
  | 'Khác';

export type DocIssuingUnitCategory =
  | 'Ban Thư ký HSV trường'
  | 'Ban Chấp hành HSV trường'
  | 'Ban Kiểm tra HSV trường'
  | 'Chi hội'
  | 'Câu lạc bộ/Đội/Nhóm'
  | 'HSV TP.HCM'
  | 'Trung ương HSV'
  | 'Khác';

export interface OfficialDocumentItem {
  id: string;
  documentNumber: string;
  docType: DocTypeCategory;
  title: string;
  signedDate: string;
  effectiveDate: string;
  field: DocFieldCategory;
  status: 'Còn hiệu lực' | 'Hết hiệu lực';
  signerName: string;
  signerTitle: string;
  issuingBody: string;
  issuingUnitCategory: DocIssuingUnitCategory;
  summary: string;
  keyPoints?: string[];
  attachmentName: string;
  attachmentSize?: string;
  fileUrl?: string;
  relatedDocNumbers?: string[];
  qrSlug: string;
}

export interface IssuedCertificateRecord {
  id: string;
  certSerialNumber: number; // Trùng STT trong Phụ lục 1 của Quyết định (QĐ 28/QĐ-HSV)
  certCode: string; // VD: '32-03/GCN-HSV'
  decisionNumber: string; // VD: '32/QĐ-HSV'
  decisionDate: string; // VD: '19/10/2026'
  headerMode: 'DOAN_HOI' | 'HOI_SINH_VIEN';
  studentId: string; // 10 chữ số EIU, sắp xếp tăng dần trong Phụ lục 1
  fullName: string;
  email: string;
  unitName: string;
  eventId: string;
  eventTitle: string;
  roleTitle: string;
  multiplierApplied: 1 | 2 | 3;
  volunteerDays: number;
  evidenceNote: string;
  signerName: string;
  signerTitle: string;
}

export interface OnlineQuizQuestion {
  id: string;
  topic: string;
  sv5tTarget:
    | 'Đạo đức tốt'
    | 'Học tập tốt'
    | 'Thể lực tốt'
    | 'Tình nguyện tốt'
    | 'Hội nhập tốt';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type ContestTopicCategory =
  | 'Lý luận và Quy chế Hội'
  | 'Học thuật và Chuyên môn'
  | 'Hội nhập và Ngoại ngữ'
  | 'Phát triển bền vững và Kỹ năng';

export interface OnlineContestItem {
  id: string;
  title: string;
  slug: string;
  topic: ContestTopicCategory;
  description: string;
  statusTag: EventStatusTag;
  sv5tCriterion:
    | 'Đạo đức tốt'
    | 'Học tập tốt'
    | 'Thể lực tốt'
    | 'Tình nguyện tốt'
    | 'Hội nhập tốt';
  durationMinutes: number;
  questionCount: number;
  passScore: number;
  maxAttempts: number;
  hasTrainingPoints: boolean;
  trainingPoints: number;
  baseVolunteerDays: number;
  startTime: string;
  endTime: string;
  participantsCount: number;
  maxParticipants: number;
  decisionNumber?: string;
  questions: OnlineQuizQuestion[];
}

export interface OfficeAssetItem {
  id: string;
  assetCode: string;
  name: string;
  category: 'Âm thanh và Bộ đàm' | 'Ấn phẩm và Cờ Hội' | 'Thiết bị Sự kiện';
  totalQty: number;
  availableQty: number;
  borrowerUnit?: string;
  borrowerName?: string;
  dueDate?: string;
  status: 'available' | 'borrowed' | 'maintenance';
}

export interface PlanSubmissionItem {
  id: string;
  planCode: string;
  title: string;
  submittingUnit: string;
  clusterName: string;
  eventDate: string;
  hasVolunteerDays: boolean;
  stage:
    | 'unit_submitted'
    | 'cluster_reviewed'
    | 'office_format_checked'
    | 'btk_approved';
}

export type AwardProgramCategory = 'DANH_HIEU' | 'KHEN_THUONG' | 'HOC_BONG';

export interface AwardProgramItem {
  id: string;
  title: string;
  category: AwardProgramCategory;
  categoryLabel: string;
  academicYear: string;
  deadline: string;
  status: 'OPEN' | 'UPCOMING' | 'CLOSED';
  issuingBody: string;
  summary: string;
  requirements: string[];
  benefits: string[];
}
