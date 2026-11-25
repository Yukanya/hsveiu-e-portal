export type WorkspaceModuleId =
  | 'overview'
  | 'certificates'
  | 'sv5t'
  | 'collective'
  | 'documents'
  | 'tgpt'
  | 'office'
  | 'meetings';

export interface WorkspaceModuleMeta {
  id: WorkspaceModuleId;
  groupId: 'governance' | 'documents_movement' | 'office_meetings';
  label: string;
  badge?: string;
  title: string;
  shortDesc: string;
}

export const WORKSPACE_MODULE_GROUPS: {
  id: 'governance' | 'documents_movement' | 'office_meetings';
  label: string;
  moduleIds: WorkspaceModuleId[];
}[] = [
  {
    id: 'governance',
    label: 'Điều hành và Phê duyệt',
    moduleIds: ['overview', 'certificates', 'sv5t', 'collective'],
  },
  {
    id: 'documents_movement',
    label: 'Văn thư và Phong trào',
    moduleIds: ['documents', 'tgpt'],
  },
  {
    id: 'office_meetings',
    label: 'Văn phòng và Hội họp',
    moduleIds: ['office', 'meetings'],
  },
];

export const WORKSPACE_MODULES: WorkspaceModuleMeta[] = [
  {
    id: 'overview',
    groupId: 'governance',
    label: 'Tổng quan Điều hành',
    title: 'TRUNG TÂM ĐIỀU HÀNH E-OFFICE',
    shortDesc: 'Tổng hợp chỉ số hoạt động và hàng đợi phê duyệt.',
  },
  {
    id: 'certificates',
    groupId: 'governance',
    label: 'Duyệt Ngày TN và Cấp GCN',
    title: 'THẨM ĐỊNH NGÀY TÌNH NGUYỆN VÀ CẤP GIẤY CHỨNG NHẬN',
    shortDesc:
      'Thẩm định chủ trương hoạt động tình nguyện và ban hành quyết định công nhận.',
  },
  {
    id: 'sv5t',
    groupId: 'governance',
    label: 'Hội đồng Xét chọn SV5T',
    title: 'HỘI ĐỒNG XÉT CHỌN SINH VIÊN 5 TỐT',
    shortDesc:
      'Xét duyệt hồ sơ Sinh viên 5 Tốt cấp Trường và danh sách tiêu biểu.',
  },
  {
    id: 'collective',
    groupId: 'governance',
    label: 'Tập thể Sinh viên 5 Tốt',
    title: 'CHỈ TIÊU TẬP THỂ SINH VIÊN 5 TỐT',
    shortDesc: 'Theo dõi tiến độ đăng ký và tỷ lệ đạt chuẩn của 25 Chi hội.',
  },
  {
    id: 'documents',
    groupId: 'documents_movement',
    label: 'Văn thư và Duyệt Kế hoạch',
    title: 'VĂN THƯ LƯU TRỮ VÀ TRÌNH DUYỆT KẾ HOẠCH',
    shortDesc:
      'Tiếp nhận, thẩm định thể thức và ban hành kế hoạch hoạt động.',
  },
  {
    id: 'tgpt',
    groupId: 'documents_movement',
    label: 'Ban TG-PT và Đội CTVXK',
    title: 'BAN TUYÊN GIÁO – PHONG TRÀO VÀ ĐỘI CTV XUNG KÍCH',
    shortDesc:
      'Điều phối hoạt động chuyên môn và quản trị bản tin cổng thông tin.',
  },
  {
    id: 'office',
    groupId: 'office_meetings',
    label: 'Văn phòng 206.B06 và Tài sản',
    title: 'QUẢN TRỊ VĂN PHÒNG 206.B06 VÀ TÀI SẢN',
    shortDesc:
      'Quản lý lịch trực, thiết bị dùng chung và nhật ký đóng dấu.',
  },
  {
    id: 'meetings',
    groupId: 'office_meetings',
    label: 'Họp Không Giấy và Ban KT',
    title: 'PHÒNG HỌP KHÔNG GIẤY VÀ BAN KIỂM TRA',
    shortDesc:
      'Biểu quyết nghị quyết trực tuyến và theo dõi hồ sơ Ban Kiểm tra.',
  },
];
