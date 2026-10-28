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
  bchRole: 'Chủ tịch' | 'Phó Chủ tịch thường trực' | 'Phó Chủ tịch' | 'Ủy viên Ban Thư ký' | 'Ủy viên Ban Chấp hành' | 'Không';
  isBtkMember: boolean;
  bktRole: 'Trưởng Ban Kiểm tra' | 'Phó trưởng Ban Kiểm tra' | 'Ủy viên Ban Kiểm tra' | 'Không';
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
}

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
  baseVolunteerDays: number;
  preApprovalStatus: 'approved_3days_prior' | 'pending_tcxdh' | 'no_volunteer_days';
  certWorkflowStatus: 'upcoming' | 'ongoing' | 'list_submitted_sla' | 'decision_issued';
  slaDaysRemaining?: number;
  decisionNumber?: string;
  sv5tCriterion: 'Đạo đức tốt' | 'Học tập tốt' | 'Thể lực tốt' | 'Tình nguyện tốt' | 'Hội nhập tốt';
  registeredCount: number;
  maxParticipants: number;
  isGreenEvent: boolean; // Theo Báo cáo Phát triển bền vững EIU (Không chai nhựa 1 lần)
}

export interface OfficialDocumentItem {
  id: string;
  documentNumber: string;
  docType: 'QUYẾT ĐỊNH' | 'THÔNG BÁO' | 'KẾ HOẠCH' | 'HƯỚNG DẪN';
  title: string;
  signedDate: string;
  signerName: string;
  signerTitle: string;
  issuingBody: string;
  summary: string;
  qrSlug: string;
}
