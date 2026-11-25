// =============================================================================
// DỮ LIỆU CHÍNH THỐNG PHÂN HỆ GIỚI THIỆU, HỘI SINH VIÊN VIỆT NAM,
// HỘI SINH VIÊN EIU, CƠ CẤU TỔ CHỨC CẤP TRƯỜNG, CHI HỘI VÀ CLB - ĐỘI - NHÓM
// Nguồn: Điều lệ HSV VN (QĐ 1739/QĐ-BNV), Dự thảo Văn kiện Đại hội II EIU
// (2026–2028), Thông báo phân công BCH hiệu lực 01/11/2026, Bảng tổng hợp
// Cơ sở Hội CSV và Cổng thông tin Câu lạc bộ EIU (eiu.edu.vn).
// =============================================================================

export interface CharterArticle {
  number: string;
  title: string;
  content: string[];
}

export interface CharterChapter {
  id: string;
  chapterNumber: string;
  title: string;
  articles: CharterArticle[];
}

export interface HistoryMilestone {
  year: string;
  title: string;
  detail: string;
  region?: 'VN' | 'HCM';
}

export interface AwardItem {
  id: string;
  name: string;
  level: string;
  sinceYear: string;
  accent: string;
  description: string;
  criteriaHighlight: string;
  imageUrl: string;
  imageCaption: string;
}

export interface NationalCongressItem {
  label: string;
  date: string;
  location: string;
  scale: string;
  leader: string;
  highlight: string;
}

export interface CongressEra {
  id: 'khang-chien' | 'doi-moi' | 'sv5t-so';
  roman: string;
  period: string;
  title: string;
  lead: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  congresses: NationalCongressItem[];
}

export interface SongStanza {
  label: string;
  lines: string[];
}

export interface OrgDepartmentOfficer {
  fullName: string;
  currentRole: string;
  assignedPosition: string;
  division?: string;
  staffId?: string;
}

export interface OrgDepartmentGroup {
  id: 'tgpt' | 'vp' | 'tcxdh';
  name: string;
  shortName: string;
  coordinatorName: string;
  coordinatorTitle: string;
  coordinatorStaffId: string;
  summary: string;
  badge: string;
  subDivisions: string[];
  officers: OrgDepartmentOfficer[];
}

export interface ChiHoiBoardMember {
  position: 'Chi hội trưởng' | 'Chi hội phó' | 'Ủy viên BCH';
  fullName: string;
}

export interface ChiHoiItem {
  code: string;
  slug: string;
  cohort: number;
  facultyCluster: 'QTKD' | 'KT' | 'CNTT' | 'KHSK';
  hasActiveBoard: boolean;
  studentCount: number | null;
  eliteMemberCount: number | null;
  representativeName?: string;
  representativeRole?: string;
  representativeEmail?: string;
  latestDecisionFile?: string;
  boardMembers: ChiHoiBoardMember[];
}

export interface ChiHoiClusterMeta {
  code: 'QTKD' | 'KT' | 'CNTT' | 'KHSK';
  shortFacultyCode: 'BBS' | 'SET' | 'CIT' | 'SNS';
  name: string;
  englishName: string;
  supervisorName: string;
  supervisorTitle: string;
  accentColor: string;
}

export type ClubDirectoryGroup =
  | 'HOC_THUAT'
  | 'NGHE_THUAT'
  | 'THE_THAO'
  | 'CONG_DONG';

export interface ClubBoardMember {
  role: string;
  fullName: string;
}

export interface EiuClubProfile {
  id: string;
  code: string;
  slug?: string;
  name: string;
  englishName?: string;
  group: ClubDirectoryGroup;
  isHsvAffiliated: boolean;
  memberCountLabel?: string;
  slogan?: string;
  description: string;
  highlights?: string[];
  boardMembers: ClubBoardMember[];
  email?: string;
  facebookUrl?: string;
  logoUrl?: string;
  photoUrl?: string;
}

// =============================================================================
// 1. HỘI SINH VIÊN VIỆT NAM VÀ HỘI SINH VIÊN TP. HỒ CHÍ MINH
// =============================================================================

export const HSV_VN_GENERAL = {
  vietnameseName: 'HỘI SINH VIÊN VIỆT NAM',
  englishName: 'VIETNAM NATIONAL UNION OF STUDENTS',
  traditionalDay: 'Ngày 09 tháng 01 (1950)',
  charterDecision:
    'Quyết định số 1739/QĐ-BNV ngày 25/12/2009 của Bộ trưởng Bộ Nội vụ',
  songTitle: 'Bài ca sinh viên',
  songAuthor: 'Nhạc và lời: Nhạc sĩ Trần Hoàng Tiến (1985)',
  videoUrl: '/videos/bai-ca-sinh-vien.mp4',
  heroImageUrl:
    'https://cdn.tuoitre.vn/471584752817336320/2023/12/20/base64-17030474602421687995780.jpeg',
  heroImageCaption:
    'Đại biểu sinh viên cả nước với khẩu hiệu hành động nhiệm kỳ XI (2023 – 2028) tại Hà Nội – Ảnh: Báo Tuổi Trẻ (Nam Trần).',
  hallImageUrl:
    'https://cdn.tuoitre.vn/471584752817336320/2023/12/20/base64-17030467084641316274876.jpeg',
  logoSpec:
    'Biểu tượng hình tròn, nền xanh da trời (xanh cyan 100%), biểu tượng hình ngọn lửa cách điệu cánh chim bồ câu trắng và ngôi sao năm cánh, phía dưới có dòng chữ "Hội Sinh viên Việt Nam".',
  congress11Slogan:
    'Sinh viên Việt Nam: Vững bản sắc – Giàu khát vọng – Kiến tạo tương lai – Dựng xây đất nước',
  hoChiMinhQuote:
    'Yêu Tổ quốc, yêu nhân dân, yêu chủ nghĩa xã hội, yêu lao động, yêu khoa học và yêu kỷ luật – Làm người anh hùng trong thời đại anh hùng.',
  hoChiMinhQuoteSource:
    'Lời căn dặn "Sáu cái yêu" của Chủ tịch Hồ Chí Minh tại Đại hội II Hội Liên hiệp Sinh viên Việt Nam (tháng 05/1958)',
  purpose:
    'Hội Sinh viên Việt Nam là tổ chức chính trị – xã hội của sinh viên Việt Nam, đoàn kết, tập hợp rộng rãi mọi sinh viên Việt Nam cùng phấn đấu học tập, rèn luyện vì mục tiêu, lý tưởng của Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh; góp phần xây dựng nước Việt Nam hòa bình, độc lập, giàu mạnh, công bằng, dân chủ, văn minh theo định hướng xã hội chủ nghĩa, vì quyền lợi hợp pháp, chính đáng của sinh viên; đoàn kết và hợp tác bình đẳng với các tổ chức sinh viên, thanh niên tiến bộ trên thế giới.',
  scaleFacts: [
    { value: '1,7+ triệu', label: 'Hội viên sinh viên cả nước' },
    { value: '28', label: 'HSV Tỉnh, Thành phố trực thuộc' },
    { value: '260+', label: 'HSV Trường Đại học, Cao đẳng' },
    { value: '13', label: 'HSV Việt Nam ở nước ngoài' },
  ],
  stateOrders: [
    { year: '2000', title: 'Huân chương Độc lập hạng Nhất', occasion: 'Kỷ niệm 50 năm Ngày Truyền thống' },
    { year: '2005', title: 'Huân chương Hồ Chí Minh', occasion: 'Lần thứ nhất' },
    { year: '2010', title: 'Huân chương Sao Vàng', occasion: 'Kỷ niệm 60 năm Ngày Truyền thống' },
    { year: '2020', title: 'Huân chương Hồ Chí Minh', occasion: 'Lần thứ hai – Kỷ niệm 70 năm' },
  ],
  principles: [
    'Tự nguyện: Tất cả sinh viên tham gia vào tổ chức và hoạt động của Hội trên cơ sở tự nguyện.',
    'Hiệp thương dân chủ: Dân chủ thảo luận, hiệp thương biểu quyết bằng hình thức giơ tay khi quyết định nội dung công tác và bầu cơ quan lãnh đạo các cấp.',
    'Phối hợp và thống nhất hành động: Các thành viên có trách nhiệm đề xuất, thảo luận, thống nhất và phối hợp tổ chức thực hiện các chương trình hoạt động của Hội.',
  ],
};

export const HSV_VN_JANUARY_9 = {
  dateLabel: '09/01/1950',
  headline: 'Ngọn lửa Trần Văn Ơn và Ngày Truyền thống Học sinh, Sinh viên Việt Nam',
  lead:
    'Giữa lòng Sài Gòn – Chợ Lớn bị chiếm đóng, hơn 2.000 học sinh, sinh viên các trường Pétrus Ký, Gia Long, Nguyễn Văn Khuê, Huỳnh Khương Ninh, Kỹ thuật cùng hàng nghìn giáo viên, đồng bào đã xuống đường biểu tình trước Dinh Thủ hiến Nam phần đòi bảo đảm an ninh học đường và trả tự do cho những học sinh bị bắt.',
  body: [
    'Lúc 13 giờ ngày 09/01/1950, chính quyền thực dân huy động cảnh sát, lính lê dương và xe vòi rồng đàn áp đẫm máu, bắt 150 người và làm 30 người trọng thương. Anh Trần Văn Ơn (sinh năm 1931, học sinh Ban Tú tài Trường Pétrus Ký – nay là THPT chuyên Lê Hồng Phong) hiên ngang đứng ở tuyến đầu che chở cho các em nhỏ và nữ sinh bị thương, trúng đạn địch và hy sinh lúc 15 giờ 30 phút cùng ngày ở tuổi 18.',
    'Lễ tang anh ngày 12/01/1950 biến thành cuộc biểu dương lực lượng yêu nước chấn động cả nước với hơn 25.000 người trực tiếp đi trong đoàn đưa tang cùng hàng chục vạn đồng bào tiễn biệt, nổi bật là biểu ngữ của nữ sinh Gia Long: "Bạn dẫu thác, tên bạn muôn đời còn sống". Tháng 02/1950, Đại hội toàn quốc Liên đoàn Thanh niên Việt Nam lần thứ I chọn ngày 09/01 hằng năm là Ngày Truyền thống Học sinh, Sinh viên; đến Đại hội V (11/1993), ngày 09/01 chính thức trở thành Ngày Truyền thống Hội Sinh viên Việt Nam.',
  ],
  quote: '“Bạn dẫu thác, tên bạn muôn đời còn sống.”',
  quoteAttribution:
    'Biểu ngữ của nữ sinh Trường Gia Long (nay là THPT Nguyễn Thị Minh Khai) trong lễ tang anh hùng liệt sĩ Trần Văn Ơn ngày 12/01/1950',
  photos: [
    {
      url: 'https://cdn.tuoitre.vn/471584752817336320/2023/10/13/hoc-sinh-truong-vinh-ky-read-only-16971649606471913944915.jpg',
      caption:
        'Tư liệu 12/01/1950: Học sinh Trường Pétrus Ký tuần hành tiễn biệt học sinh Trần Văn Ơn tại Sài Gòn.',
      credit: 'Tư liệu Báo Tuổi Trẻ / Sưu tập Nguyễn Đại Hùng Lộc',
      archival: true,
    },
    {
      url: 'https://cdn.tuoitre.vn/471584752817336320/2023/10/13/toan-canh-mit-tinh-va-nu-sinh-gia-long-read-only-16971649606521372615314.jpg',
      caption:
        'Tư liệu 12/01/1950: Toàn cảnh lễ mít tinh và biểu ngữ của nữ sinh Trường Gia Long trong ngày đưa tang.',
      credit: 'Tư liệu Báo Tuổi Trẻ',
      archival: true,
    },
    {
      url: 'https://cdn2.tuoitre.vn/471584752817336320/2026/1/9/lh-que-anh-on-1767929014926749073907.jpg',
      caption:
        'Thế hệ sinh viên TP.HCM tiếp lửa truyền thống tại Khu tưởng niệm Anh hùng LLVT, liệt sĩ Trần Văn Ơn.',
      credit: 'Báo Tuổi Trẻ (Lê Huy)',
      archival: false,
    },
  ],
};

export const HSV_VN_CONGRESS_ERAS: CongressEra[] = [
  {
    id: 'khang-chien',
    roman: 'Chặng I',
    period: '1955 – 1975',
    title: 'Kháng chiến, Kiến quốc và "Ba sẵn sàng"',
    lead:
      'Từ Đại hội thành lập Hội Liên hiệp Sinh viên Việt Nam năm 1955 tại Hà Nội đến lời căn dặn "Sáu cái yêu" của Chủ tịch Hồ Chí Minh và khí thế "Xếp bút nghiên lên đường chiến đấu" của thế hệ sinh viên hai miền Nam – Bắc.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/10/13/toan-canh-mit-tinh-va-nu-sinh-gia-long-read-only-16971649606521372615314.jpg',
    imageCaption:
      'Khí phách học sinh, sinh viên yêu nước khởi nguồn từ phong trào Sài Gòn – Chợ Lớn (1950) tiếp nối qua các kỳ Đại hội thời kỳ kháng chiến.',
    imageCredit: 'Ảnh tư liệu lịch sử – Báo Tuổi Trẻ',
    congresses: [
      {
        label: 'Đại hội I',
        date: '29 – 31/07/1955',
        location: 'Hà Nội',
        scale: '244 đại biểu chính thức, 255 dự thính',
        leader: 'Chủ tịch: Nguyễn Quang Toàn',
        highlight:
          'Chính thức thành lập với tên gọi "Hội Liên hiệp Sinh viên Việt Nam", thông qua Điều lệ đầu tiên và kêu gọi sinh viên cả nước đấu tranh vì hòa bình, thống nhất Tổ quốc.',
      },
      {
        label: 'Đại hội II',
        date: '05 – 07/05/1958',
        location: 'Hà Nội',
        scale: '228 đại biểu chính thức, 200 dự thính',
        leader: 'Tổng Thư ký TƯ Hội: Lê Hùng Lâm',
        highlight:
          'Chủ tịch Hồ Chí Minh đến thăm và căn dặn "Sáu cái yêu" (Yêu Tổ quốc, yêu nhân dân, yêu chủ nghĩa xã hội, yêu lao động, yêu khoa học, yêu kỷ luật).',
      },
      {
        label: 'Đại hội III',
        date: '03 – 05/03/1962',
        location: 'Trường ĐH Kinh tế – Tài chính Hà Nội',
        scale: '500 đại biểu (đại diện 20.000 sinh viên của 10 trường ĐH – CĐ)',
        leader: 'Chủ tịch: Nguyễn Quang',
        highlight:
          'Đẩy mạnh thi đua học tập, bồi dưỡng phẩm chất chính trị, chuyên môn, cải thiện đời sống sinh viên và đoàn kết đấu tranh thống nhất đất nước.',
      },
      {
        label: 'Đại hội IV',
        date: '06 – 07/01/1970',
        location: 'Hà Nội',
        scale: '500 đại biểu',
        leader: 'Chủ tịch: Nguyễn Văn Huê',
        highlight:
          'Thủ tướng Phạm Văn Đồng căn dặn sinh viên phấn đấu vừa "hồng", vừa "chuyên"; đẩy mạnh phong trào "Ba sẵn sàng" ở miền Bắc và đấu tranh đô thị tại miền Nam.',
      },
    ],
  },
  {
    id: 'doi-moi',
    roman: 'Chặng II',
    period: '1985 – 2003',
    title: 'Đổi mới, Kiện toàn và Bản sắc Hội Sinh viên Việt Nam',
    lead:
      'Giai đoạn bản lề đổi tên tổ chức thành Hội Sinh viên Việt Nam (1985), kiện toàn hệ thống toàn quốc tại Đại hội V (1993), xác lập Ngày Truyền thống 09/01, Biểu trưng, Hội ca và khởi sinh Giải thưởng Sao Tháng Giêng.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/8/4/ra-quan-he-tinh-nguyen-buoi-ra-quan-cac-chuong-trinh-chien-dich-tinh-nguyen-he-nam-2023-anh-kim-anh--169111840558139919255.jpg',
    imageCaption:
      'Phong trào "Sinh viên tình nguyện" bùng nổ từ thập niên 1990 trở thành dấu ấn rực rỡ của tuổi trẻ đại học Việt Nam.',
    imageCredit: 'Báo Tuổi Trẻ (Kim Anh)',
    congresses: [
      {
        label: 'Hội nghị toàn quốc 1985',
        date: 'Tháng 07/1985',
        location: 'Hà Nội',
        scale: 'Ban Chấp hành gồm 49 ủy viên',
        leader: 'Chủ tịch: Vũ Quốc Hùng (1985–1988), Hồ Đức Việt (1988–1996)',
        highlight:
          'Thông qua Điều lệ trong giai đoạn mới và quyết định đổi tên từ Hội Liên hiệp Sinh viên Việt Nam thành "Hội Sinh viên Việt Nam".',
      },
      {
        label: 'Đại hội V',
        date: '21 – 23/11/1993',
        location: 'Bảo tàng Hồ Chí Minh, Hà Nội',
        scale: '255 đại biểu chính thức từ hơn 100 trường ĐH – CĐ',
        leader: 'Chủ tịch: Hồ Đức Việt (từ 1996: Hoàng Bình Quân)',
        highlight:
          'Quyết định lấy ngày 09/01 hằng năm làm Ngày Truyền thống Hội Sinh viên Việt Nam; thống nhất Biểu trưng và Hội ca "Bài ca sinh viên" của nhạc sĩ Trần Hoàng Tiến.',
      },
      {
        label: 'Đại hội VI',
        date: '22 – 23/11/1998',
        location: 'Hà Nội',
        scale: '400 đại biểu đại diện hơn 800.000 sinh viên',
        leader: 'Chủ tịch: Hoàng Bình Quân (từ 04/2003: Bùi Đặng Dũng)',
        highlight:
          'Thông điệp "Sinh viên Việt Nam rèn đức, luyện tài vì tương lai tươi sáng"; ra đời Giải thưởng Sao Tháng Giêng (1999, trao lần đầu 09/01/2000).',
      },
      {
        label: 'Đại hội VII',
        date: '29 – 31/12/2003',
        location: 'Hà Nội',
        scale: '550 đại biểu; BCH 78 ủy viên',
        leader: 'Chủ tịch: Bùi Đặng Dũng (2003–2005), Lâm Phương Thanh (2005–2009)',
        highlight:
          'Triển khai rộng khắp hai phong trào lớn: "Thi đua học tập tốt, rèn luyện tốt" và "Sinh viên tình nguyện".',
      },
    ],
  },
  {
    id: 'sv5t-so',
    roman: 'Chặng III',
    period: '2009 – 2028',
    title: 'Phong trào "Sinh viên 5 tốt" và Kỷ nguyên Chuyển đổi số',
    lead:
      'Kế thừa từ mô hình "Sinh viên 3 tốt" TP.HCM, phong trào "Sinh viên 5 tốt" trở thành trục xuyên suốt toàn quốc; Đại hội XI (2023 – 2028) tập trung nghiên cứu khoa học, chuyển đổi số và hội nhập toàn cầu.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/12/20/base64-17030467084641316274876.jpeg',
    imageCaption:
      'Toàn cảnh 695 đại biểu dự Đại hội XI Hội Sinh viên Việt Nam tại Cung Văn hóa Lao động Hữu nghị Việt Xô (12/2023).',
    imageCredit: 'Báo Tuổi Trẻ (Nam Trần)',
    congresses: [
      {
        label: 'Đại hội VIII',
        date: '14 – 16/02/2009',
        location: 'Hà Nội',
        scale: '647 đại biểu; BCH 89 ủy viên',
        leader: 'Chủ tịch: Nguyễn Đắc Vinh',
        highlight:
          'Phát động Cuộc vận động "Sinh viên 5 tốt" trên quy mô toàn quốc và ban hành Điều lệ sửa đổi kèm QĐ 1739/QĐ-BNV ngày 25/12/2009.',
      },
      {
        label: 'Đại hội IX',
        date: '27 – 29/12/2013',
        location: 'Hà Nội',
        scale: '647 đại biểu; BCH 99 ủy viên',
        leader: 'Chủ tịch: Lê Quốc Phong',
        highlight:
          'Nâng tầm thành Phong trào "Sinh viên 5 tốt" – phong trào chủ đạo với 05 tiêu chí toàn diện, cùng Chương trình xây dựng Hội Sinh viên Việt Nam vững mạnh.',
      },
      {
        label: 'Đại hội X',
        date: '09 – 11/12/2018',
        location: 'Hà Nội',
        scale: '690 đại biểu; BCH 98 ủy viên',
        leader: 'Chủ tịch: Bùi Quang Huy (2018–2021), Nguyễn Minh Triết (từ 12/2021)',
        highlight:
          'Triển khai 01 phong trào ("Sinh viên 5 tốt") và 02 chương trình ("Tư vấn, hỗ trợ sinh viên" và "Xây dựng Hội Sinh viên Việt Nam vững mạnh").',
      },
      {
        label: 'Đại hội XI (Nhiệm kỳ hiện tại)',
        date: '18 – 20/12/2023',
        location: 'Cung Văn hóa Lao động Hữu nghị Việt Xô, Hà Nội',
        scale: '695 đại biểu chính thức đại diện hơn 1,7 triệu hội viên',
        leader: 'Chủ tịch tái đắc cử: Nguyễn Minh Triết',
        highlight:
          'Khẩu hiệu "Vững bản sắc – Giàu khát vọng – Kiến tạo tương lai – Dựng xây đất nước"; triển khai 03 Đề án trọng tâm về NCKH, Chuyển đổi số hoạt động Hội và Nâng cao năng lực cán bộ Hội.',
      },
    ],
  },
];

export const HSV_HCM_STRUGGLE_CHAPTERS = [
  {
    year: '25/08/1963',
    title: 'Nữ sinh Quách Thị Trang trước Công trường Diên Hồng',
    detail:
      'Hơn 5.000 học sinh, sinh viên Sài Gòn biểu tình phản đối thiết quân luật. Nữ sinh 15 tuổi Quách Thị Trang (Trường Nguyễn Khuyến) anh dũng hy sinh ngay tuyến đầu, trở thành biểu tượng bất khuất của tuổi trẻ Sài Gòn.',
  },
  {
    year: '1963 – 1975',
    title: '"Tam giác sắt" Đại học và Trụ sở Số 4 Duy Tân',
    detail:
      'Các trường Văn khoa – Y Dược – Nông Lâm Súc cùng Trụ sở Tổng hội Sinh viên Sài Gòn tại Số 4 Duy Tân (nay là Số 4 Phạm Ngọc Thạch – Nhà Văn hóa Thanh niên TP.HCM) là trung tâm đấu tranh công khai đòi hòa bình, tự trị đại học và chống bắt lính.',
  },
  {
    year: '1968 – 1972',
    title: 'Phong trào "Hát cho đồng bào tôi nghe"',
    detail:
      'Đoàn Văn nghệ Sinh viên – Học sinh Sài Gòn quy tụ các nhạc sĩ Tôn Thất Lập, Trần Long Ẩn, Trương Quốc Khánh, Nguyễn Văn Sanh... biến âm nhạc thành vũ khí đấu tranh với "Hát cho dân tôi nghe", "Dậy mà đi", "Tự nguyện", "Nối vòng tay lớn".',
  },
  {
    year: '1970 – 1975',
    title: 'Chiến dịch "Nói với đồng bào" và ngày 30/04/1975',
    detail:
      'Tổng hội Sinh viên Sài Gòn tổ chức diễn thuyết trực tiếp tại các khu lao động đòi chấm dứt chiến tranh; trưa 30/04/1975, lực lượng sinh viên tham gia tiếp quản Số 4 Duy Tân, bảo vệ trường học và công sở trong giờ phút lịch sử.',
  },
];

export const HSV_HCM_MODERN_MOVEMENTS = [
  {
    tag: '1994 – 1997',
    title: 'Từ "Ánh sáng Văn hóa hè" đến "Mùa hè xanh"',
    detail:
      'Khởi nguồn từ chiến dịch xóa mù chữ năm 1994 tại Bình Chánh, hè 1997 Thành Đoàn – HSV TP.HCM phát động Chiến dịch Tình nguyện Mùa hè xanh vươn tới biên giới, biển đảo (Lý Sơn, Phú Quý, Thổ Chu) và nước bạn Lào, Campuchia.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/8/4/phu-quy-den-nang-luong-16911174952581326339296.jpg',
    imageCredit: 'Báo Tuổi Trẻ',
  },
  {
    tag: '1995 – 2019',
    title: 'Tiếp sức mùa thi, Xuân Tình nguyện, Euréka và Nhà Văn hóa Sinh viên',
    detail:
      'Từ Đại hội I HSV TP.HCM (10/1995), sinh viên Thành phố khởi xướng "Tiếp sức mùa thi" (1996), Giải thưởng NCKH Euréka (1999), "Sinh viên 3 tốt" (2001), "Xuân Tình nguyện" (2005) và khánh thành Nhà Văn hóa Sinh viên 3,55 ha tại ĐHQG-HCM (2019).',
    imageUrl:
      'https://cdn.tuoitre.vn/2019/10/23/ql-co-so-2-nvhsv4--1571802185089237438594.jpg',
    imageCredit: 'Báo Tuổi Trẻ (Q.L.)',
  },
  {
    tag: '2023 – 2028',
    title: 'Đại hội VII HSV TP.HCM – Sáng tri thức, Vững kỹ năng, Tiên phong hội nhập',
    detail:
      'Quy tụ 459 đại biểu đại diện 560.000 hội viên thuộc 61 cơ sở Hội – nơi Hội Sinh viên EIU trực thuộc – cùng Cổng dữ liệu số phong trào HSSV và các chương trình xây dựng nguồn nhân lực chất lượng cao.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/11/5/db-dai-hoi-16991452070431039788076.jpg',
    imageCredit: 'Báo Tuổi Trẻ (Hữu Hạnh)',
  },
];

export const HSV_HCM_ARCHIVE_PHOTO = {
  url: 'https://cdn.tuoitre.vn/471584752817336320/2023/7/26/nhac-si-ton-that-lap-1690370270175190968668.jpg',
  caption:
    'Tư liệu: Nhạc sĩ Tôn Thất Lập cùng học sinh, sinh viên Sài Gòn trong phong trào văn nghệ đấu tranh "Hát cho đồng bào tôi nghe" trước năm 1975.',
  credit: 'Tư liệu Báo Tuổi Trẻ',
};

export const HSV_VN_EMBLEM_CALLOUTS = [
  {
    label: 'Nền tròn Xanh da trời (Cyan 100%)',
    detail:
      'Tượng trưng cho hòa bình, tuổi trẻ, tri thức, ước mơ vươn cao và tinh thần đoàn kết trong sáng của sinh viên Việt Nam.',
  },
  {
    label: 'Ngọn lửa – Cánh chim bồ câu trắng',
    detail:
      'Kết tinh ngọn lửa truyền thống 09/01 bất khuất cùng khát vọng hòa bình, sáng tạo và tinh thần hội nhập quốc tế.',
  },
  {
    label: 'Ngôi sao năm cánh màu trắng',
    detail:
      'Biểu trưng cho lý tưởng cách mạng, mục tiêu phấn đấu và định hướng chính trị vững vàng của tổ chức Hội.',
  },
  {
    label: 'Dòng chữ "HỘI SINH VIÊN VIỆT NAM"',
    detail:
      'Khẳng định vị thế tổ chức chính trị – xã hội duy nhất đại diện cho ý chí, nguyện vọng và quyền lợi hợp pháp của sinh viên Việt Nam.',
  },
];

export const HSV_VN_SONG_STANZAS: SongStanza[] = [
  {
    label: 'Lời 1',
    lines: [
      'Bài ca sinh viên ta hát',
      'Có nắng ấm ban mai ửng hồng',
      'Tuổi sinh viên theo năm tháng',
      'Trang giấy trắng ước mơ tràn đầy',
    ],
  },
  {
    label: 'Lời 2',
    lines: [
      'Hàng me đang thay lá mới',
      'Cất tiếng hát bay cao trời mây',
      'Đàn chim hôm nay đã lớn',
      'Ta vẫn nhớ mãi sân trường này',
    ],
  },
  {
    label: 'Điệp khúc',
    lines: [
      'Tới những chân trời mới',
      'Kìa Tổ quốc biết bao tươi đẹp',
      'Tới những công trình mới',
      'Dệt nên những ước mơ cho đời',
      'Ta mơ một ngày mai',
      'Bàn tay ta biến sông thành điện',
      'Đi đi nào bạn ơi',
      'Dệt lên những ước mơ cho đời.',
    ],
  },
];

export const HSV_VN_AWARDS: AwardItem[] = [
  {
    id: 'sv5t',
    name: 'Danh hiệu "Sinh viên 5 tốt"',
    level: 'Cấp Trường • Cấp Thành • Cấp Trung ương',
    sinceYear: 'Khởi nguồn 2001 (TP.HCM) • Toàn quốc từ 2009',
    accent: '#0054A6',
    description:
      'Danh hiệu cao quý nhất ghi nhận quá trình rèn luyện toàn diện của sinh viên Việt Nam, khởi nguồn từ "Sinh viên 3 tốt" TP.HCM, phát động toàn quốc tại Đại hội VIII (2009) và nâng tầm thành phong trào chủ đạo tại Đại hội IX (2013).',
    criteriaHighlight:
      '05 tiêu chuẩn: Đạo đức tốt • Học tập tốt • Thể lực tốt • Tình nguyện tốt • Hội nhập tốt.',
    imageUrl:
      'https://cdn2.tuoitre.vn/471584752817336320/2025/1/8/sinh-vien-5-tot-cap-trung-uong-17363471017571851871625.jpg',
    imageCaption:
      'Lễ tuyên dương "Sinh viên 5 tốt" cấp Trung ương nhân kỷ niệm 75 năm Ngày Truyền thống (01/2025) – Ảnh: Báo Tuổi Trẻ (Hoài Thương).',
  },
  {
    id: 'sao-thang-gieng',
    name: 'Giải thưởng "Sao Tháng Giêng"',
    level: 'Ban Chấp hành Trung ương Hội Sinh viên Việt Nam',
    sinceYear: 'Ra đời 1999 • Trao lần đầu 09/01/2000',
    accent: '#C10230',
    description:
      'Phần thưởng cao quý của Trung ương Hội Sinh viên Việt Nam trao tặng hằng năm nhân dịp 09/01 dành riêng cho các cán bộ Đoàn – Hội là sinh viên trong và ngoài nước có thành tích học tập và cống hiến xuất sắc.',
    criteriaHighlight:
      'Cán bộ Hội, cán bộ Đoàn sinh viên có học lực xuất sắc, rèn luyện tốt và dấu ấn nổi bật trong công tác phong trào.',
    imageUrl:
      'https://cdn2.tuoitre.vn/471584752817336320/2025/1/8/sao-thang-gieng-17363464325841607014099.jpg',
    imageCaption:
      'Lễ trao Giải thưởng "Sao Tháng Giêng" cấp Trung ương dịp 09/01/2025 – Ảnh: Báo Tuổi Trẻ (Hoài Thương).',
  },
  {
    id: 'tap-the-sv5t',
    name: 'Danh hiệu "Tập thể Sinh viên 5 tốt"',
    level: 'Chi hội • Liên chi hội • Tập thể trực thuộc',
    sinceYear: 'Xét chọn hằng năm từ cấp Trường đến Trung ương',
    accent: '#133F68',
    description:
      'Tuyên dương các tập thể Chi hội, Liên chi hội xây dựng môi trường học tập, nghiên cứu, tình nguyện và rèn luyện đoàn kết, tạo bệ phóng giúp đông đảo hội viên đạt danh hiệu cá nhân.',
    criteriaHighlight:
      '100% hội viên đăng ký phong trào, có tỷ lệ hội viên đạt chuẩn cao và không có hội viên vi phạm kỷ luật.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/8/4/ra-quan-he-tinh-nguyen-buoi-ra-quan-cac-chuong-trinh-chien-dich-tinh-nguyen-he-nam-2023-anh-kim-anh--169111840558139919255.jpg',
    imageCaption:
      'Khí thế tập thể sinh viên tình nguyện Thành phố Hồ Chí Minh trong lễ ra quân các chiến dịch hè – Ảnh: Báo Tuổi Trẻ (Kim Anh).',
  },
  {
    id: 'bo-cau-trang',
    name: 'Giải thưởng "Bồ câu trắng"',
    level: 'Hội Sinh viên Việt Nam TP. Hồ Chí Minh',
    sinceYear: 'Giải thưởng thường niên cấp Thành phố',
    accent: '#51803A',
    description:
      'Giải thưởng uy tín của Hội Sinh viên Việt Nam TP. Hồ Chí Minh nhằm vinh danh và nhân rộng các mô hình, giải pháp tiêu biểu, sáng tạo trong công tác Hội và phong trào sinh viên của các cơ sở Hội trên địa bàn Thành phố.',
    criteriaHighlight:
      'Các mô hình, giải pháp sáng tạo có tính lan tỏa cao về học thuật, không gian văn hóa, chuyển đổi số và tình nguyện.',
    imageUrl:
      'https://cdn.tuoitre.vn/471584752817336320/2023/11/5/db-dai-hoi-16991452070431039788076.jpg',
    imageCaption:
      'Đại biểu sinh viên TP. Hồ Chí Minh tại Đại hội VII Hội Sinh viên Thành phố – Ảnh: Báo Tuổi Trẻ (Hữu Hạnh).',
  },
];

export const HSV_VN_CHARTER_CHAPTERS: CharterChapter[] = [
  {
    id: 'chuong-1',
    chapterNumber: 'Chương I',
    title: 'Tên gọi, Tôn chỉ, Mục đích',
    articles: [
      {
        number: 'Điều 1',
        title: 'Tên gọi, ngày truyền thống, biểu trưng và bài ca chính thức của Hội',
        content: [
          '1. Tên Tiếng Việt: HỘI SINH VIÊN VIỆT NAM. Tên Tiếng Anh: VIETNAM NATIONAL UNION OF STUDENTS.',
          '2. Ngày truyền thống của Hội: Ngày 9 tháng 1.',
          '3. Biểu trưng của Hội: Biểu tượng hình tròn, nền xanh da trời (xanh cyan 100%), biểu tượng hình ngọn lửa và ngôi sao dưới có dòng chữ Hội Sinh viên Việt Nam.',
          '4. Bài ca chính thức của Hội: Bài ca sinh viên của nhạc sĩ Trần Hoàng Tiến.',
        ],
      },
      {
        number: 'Điều 2',
        title: 'Tôn chỉ, mục đích của Hội',
        content: [
          'Hội Sinh viên Việt Nam là tổ chức chính trị – xã hội của sinh viên Việt Nam, đoàn kết, tập hợp rộng rãi mọi sinh viên Việt Nam cùng phấn đấu học tập, rèn luyện vì mục tiêu, lý tưởng của Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh; góp phần xây dựng nước Việt Nam hòa bình, độc lập, giàu mạnh, công bằng, dân chủ, văn minh theo định hướng xã hội chủ nghĩa, vì quyền lợi hợp pháp, chính đáng của sinh viên; đoàn kết và hợp tác bình đẳng với các tổ chức sinh viên, thanh niên tiến bộ và nhân dân các nước trên thế giới vì mục tiêu hòa bình, độc lập dân tộc, dân chủ và tiến bộ xã hội.',
        ],
      },
      {
        number: 'Điều 3',
        title: 'Nguyên tắc, phạm vi hoạt động, địa vị pháp lý và trụ sở chính của Hội',
        content: [
          '1. Hội tổ chức và hoạt động theo nguyên tắc tự nguyện, hiệp thương dân chủ, phối hợp và thống nhất hành động (tham gia tự nguyện; thảo luận và hiệp thương biểu quyết bằng hình thức giơ tay; đề xuất, thống nhất và phối hợp thực hiện chương trình hoạt động).',
          '2. Hội hoạt động trong phạm vi cả nước, được phép hoạt động ở nước ngoài theo quy định của pháp luật Việt Nam và pháp luật nước sở tại.',
          '3. Hội hoạt động trong khuôn khổ Hiến pháp và pháp luật, dưới sự lãnh đạo của Đảng Cộng sản Việt Nam, sự quản lý của Nhà nước và vai trò nòng cốt chính trị của Đoàn TNCS Hồ Chí Minh. Hội là thành viên tập thể của Hội Liên hiệp Thanh niên Việt Nam và Hội Sinh viên quốc tế.',
          '4. Hội Sinh viên Việt Nam có tư cách pháp nhân, trụ sở Trung ương Hội đặt tại Thủ đô Hà Nội.',
        ],
      },
    ],
  },
  {
    id: 'chuong-2',
    chapterNumber: 'Chương II',
    title: 'Chức năng, Nhiệm vụ',
    articles: [
      {
        number: 'Điều 4',
        title: 'Chức năng, nhiệm vụ',
        content: [
          '1. Tập hợp, đoàn kết, khuyến khích, giúp đỡ hội viên, sinh viên trong học tập và rèn luyện, hoàn thành nhiệm vụ của người sinh viên, góp phần xây dựng nhà trường vững mạnh.',
          '2. Giáo dục lý tưởng, truyền thống đạo đức, lối sống và ý thức pháp luật cho hội viên, sinh viên.',
          '3. Phản ánh nhu cầu, nguyện vọng của sinh viên; tham gia phản biện, đề xuất các chủ trương, chính sách liên quan đến sinh viên. Tổ chức các hoạt động thiết thực chăm lo đời sống vật chất, tinh thần và bảo vệ các quyền lợi hợp pháp, chính đáng của hội viên, sinh viên và tổ chức Hội.',
          '4. Đoàn kết, phát triển quan hệ hữu nghị hợp tác với các tổ chức sinh viên, thanh niên tiến bộ và nhân dân các nước trên thế giới vì hòa bình, độc lập dân tộc, dân chủ và tiến bộ xã hội.',
        ],
      },
    ],
  },
  {
    id: 'chuong-3',
    chapterNumber: 'Chương III',
    title: 'Hội viên',
    articles: [
      {
        number: 'Điều 5',
        title: 'Hội viên',
        content: [
          '1. Sinh viên là công dân Việt Nam đang học bậc đại học, cao đẳng ở trong và ngoài nước tán thành Điều lệ Hội, tự nguyện gia nhập Hội thì được kết nạp vào Hội Sinh viên Việt Nam.',
          '2. Cán bộ, giáo viên, các nhà hoạt động chính trị, khoa học, kinh tế, xã hội, văn hóa, nghệ thuật có uy tín, có đóng góp tích cực và tự nguyện tham gia hoạt động của Hội có thể được kết nạp là hội viên danh dự.',
          '3. Những người đã học qua bậc đại học, cao đẳng, nếu được cử vào cơ quan lãnh đạo của Hội thì tiếp tục hoạt động trong tổ chức Hội.',
        ],
      },
      {
        number: 'Điều 6',
        title: 'Quyền của hội viên',
        content: [
          '1. Yêu cầu tổ chức Hội đại diện, bảo vệ các quyền lợi hợp pháp, chính đáng của mình trước pháp luật và công luận; đề đạt ý kiến, nguyện vọng thông qua tổ chức Hội về học tập, rèn luyện, đời sống.',
          '2. Được cấp thẻ hội viên; tham gia mọi hoạt động và được hưởng các phúc lợi tập thể của Hội hoặc do Hội quản lý.',
          '3. Bàn bạc và giám sát các công việc của Hội, được ứng cử và đề cử vào cơ quan lãnh đạo các cấp của Hội.',
        ],
      },
      {
        number: 'Điều 7',
        title: 'Nhiệm vụ của hội viên',
        content: [
          '1. Luôn phấn đấu vì lý tưởng của Đảng Cộng sản Việt Nam và Chủ tịch Hồ Chí Minh; tích cực học tập, rèn luyện, tham gia công tác xã hội và đoàn kết giúp đỡ hội viên, sinh viên.',
          '2. Chấp hành Hiến pháp và pháp luật, giữ gìn nhân cách người sinh viên, tham gia xây dựng môi trường văn hóa trong sinh viên và xã hội.',
          '3. Thực hiện nghiêm chỉnh Điều lệ và các nghị quyết của Hội, tích cực tuyên truyền, bảo vệ uy tín Hội, sinh hoạt và đóng hội phí đầy đủ đúng quy định.',
        ],
      },
    ],
  },
  {
    id: 'chuong-4',
    chapterNumber: 'Chương IV',
    title: 'Cơ cấu Tổ chức và Hoạt động của Hội',
    articles: [
      {
        number: 'Điều 8 – Điều 9',
        title: 'Hệ thống tổ chức Hội các cấp và tổ chức Hội ở nước ngoài',
        content: [
          'Tổ chức Hội gồm 04 cấp: (a) Trung ương Hội Sinh viên Việt Nam; (b) Hội Sinh viên tỉnh, thành phố; (c) Hội Sinh viên các trường đại học, cao đẳng, học viện; (d) Các đơn vị trực thuộc cấp trường gồm Liên chi hội, Chi hội, Câu lạc bộ, Đội, Nhóm công tác của sinh viên.',
          'Hội Sinh viên Việt Nam được thành lập trong sinh viên Việt Nam ở nước ngoài theo hướng dẫn của Ban Thư ký Trung ương Hội và quy định pháp luật Việt Nam cùng nước sở tại.',
        ],
      },
      {
        number: 'Điều 10',
        title: 'Đại hội Hội Sinh viên các cấp',
        content: [
          'Nhiệm kỳ Đại hội: Toàn quốc, tỉnh/thành phố trực thuộc Trung ương, ĐHQG, ĐH khu vực là 05 năm 01 lần; Cấp trường và Liên chi hội là 05 năm 02 lần; Đại hội Chi hội là 01 năm 01 lần.',
          'Nhiệm vụ Đại hội: Tổng kết công tác nhiệm kỳ, quyết định mục tiêu chương trình hành động nhiệm kỳ mới, hiệp thương bầu Ban Chấp hành, Ban Kiểm tra cùng cấp và đại biểu dự Đại hội cấp trên.',
        ],
      },
      {
        number: 'Điều 11 – Điều 12',
        title: 'Cơ quan lãnh đạo các cấp và số lượng Ủy viên Ban Chấp hành',
        content: [
          'Cơ quan lãnh đạo giữa hai kỳ Đại hội là Ban Chấp hành; giữa hai kỳ họp Ban Chấp hành là Ban Thư ký (gồm Chủ tịch, các Phó Chủ tịch và Ủy viên Ban Thư ký). Thường trực Ban Thư ký điều hành công việc hằng ngày.',
          'Quy mô cấp trường: Ban Chấp hành từ 11 đến 21 ủy viên (trường trên 10.000 SV tối đa 27 ủy viên); Ban Thư ký không quá 1/3 BCH (01 Chủ tịch, 01–03 Phó Chủ tịch). Chi hội: 03 đến 05 ủy viên (Chi hội trưởng và Chi hội phó).',
          'Hội nghị BCH cấp trường họp ít nhất 04 kỳ/năm; BCH chi hội họp ít nhất 01 kỳ/tháng.',
        ],
      },
      {
        number: 'Điều 13',
        title: 'Nhiệm vụ của Ban Chấp hành, Ban Thư ký các cấp và Ban Chấp hành Chi hội',
        content: [
          'Ban Chấp hành tổ chức thực hiện Điều lệ, Nghị quyết Đại hội, quyết định chương trình hành động, triệu tập Đại hội và hiệp thương bầu Trưởng Ban Kiểm tra.',
          'Ban Thư ký thay mặt BCH điều hành thực hiện Nghị quyết, phối hợp các cơ quan, chỉ đạo cấp dưới, phản ánh nguyện vọng sinh viên và chuẩn y kết nạp hội viên mới (ở cấp trường).',
          'Ban Chấp hành Chi hội tổ chức hoạt động chi hội, nắm tình hình sinh viên để kiến nghị, kết nạp và quản lý hội viên, giới thiệu hội viên ưu tú cho Đoàn bồi dưỡng kết nạp và quản lý hội phí.',
        ],
      },
    ],
  },
  {
    id: 'chuong-5',
    chapterNumber: 'Chương V',
    title: 'Công tác Kiểm tra của Hội và Ban Kiểm tra các cấp',
    articles: [
      {
        number: 'Điều 14 – Điều 15',
        title: 'Công tác kiểm tra và Ban Kiểm tra các cấp',
        content: [
          'Kiểm tra là một trong những chức năng lãnh đạo của Hội. Ban Kiểm tra được thành lập từ Trung ương đến cấp trường, do Đại hội cùng cấp hiệp thương bầu ra và được Ban Thư ký Hội cấp trên trực tiếp công nhận, nhiệm kỳ theo BCH cùng cấp.',
          'Liên chi hội, chi hội hiệp thương cử một ủy viên Ban Chấp hành phụ trách công tác kiểm tra.',
        ],
      },
      {
        number: 'Điều 16',
        title: 'Nhiệm vụ của Ban Kiểm tra các cấp',
        content: [
          'Tham mưu kiểm tra thi hành Điều lệ, Nghị quyết và chương trình công tác; kiểm tra cán bộ, hội viên và cấp dưới khi có dấu hiệu vi phạm.',
          'Giải quyết khiếu nại, tố cáo liên quan đến cán bộ, hội viên; bảo vệ quyền lợi hợp pháp của hội viên.',
          'Kiểm tra công tác hội phí, nguồn quỹ; tham mưu công tác khen thưởng, kỷ luật và kiểm tra hoạt động Ban Kiểm tra cấp dưới.',
        ],
      },
    ],
  },
  {
    id: 'chuong-6',
    chapterNumber: 'Chương VI',
    title: 'Khen thưởng và Kỷ luật',
    articles: [
      {
        number: 'Điều 17 – Điều 18',
        title: 'Khen thưởng và Kỷ luật',
        content: [
          'Khen thưởng: Cán bộ, hội viên, các cấp Hội và những người có công trong giáo dục, bồi dưỡng sinh viên và công tác xây dựng Hội đều được xem xét khen thưởng hoặc đề nghị khen thưởng.',
          'Kỷ luật đối với cán bộ, hội viên vi phạm Điều lệ: Khiển trách, cảnh cáo, cách chức, khai trừ ra khỏi Hội.',
          'Kỷ luật đối với các cấp Hội: Khiển trách, cảnh cáo, giải thể theo hướng dẫn của Ban Thư ký Trung ương Hội.',
        ],
      },
    ],
  },
  {
    id: 'chuong-7',
    chapterNumber: 'Chương VII',
    title: 'Tài chính của Hội',
    articles: [
      {
        number: 'Điều 19 – Điều 20',
        title: 'Tài chính và Quản lý tài chính của Hội',
        content: [
          'Nguồn thu của Hội gồm: Hội phí do hội viên đóng góp; kinh phí Nhà nước và nhà trường hỗ trợ; các khoản thu hợp pháp khác.',
          'Các khoản chi của Hội phục vụ cho hoạt động của Hội, công tác khen thưởng và đầu tư cơ sở vật chất. Việc quản lý, sử dụng tài chính do Ban Chấp hành, Ban Thư ký các cấp thực hiện theo nguyên tắc quản lý tài chính của Nhà nước.',
        ],
      },
    ],
  },
];

// =============================================================================
// 2. HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG (EIU)
// =============================================================================

export const HSV_EIU_OVERVIEW = {
  fullName: 'Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông',
  shortName: 'Hội Sinh viên EIU',
  parentOrg: 'Hội Sinh viên Việt Nam Thành phố Hồ Chí Minh',
  officeLocation: 'Phòng 206.B06 — Trường Đại học Quốc tế Miền Đông (Số 81, đường Nam Kỳ Khởi Nghĩa, phường Bình Dương, TP. Hồ Chí Minh)',
  foundingCongressDate: '30/09/2024',
  foundingTerm: 'Nhiệm kỳ Khóa I (2024 – 2026)',
  secondCongressDate: '31/07/2026',
  secondCongressVenue: 'Hội trường 200.B03, Trường Đại học Quốc tế Miền Đông',
  secondTerm: 'Nhiệm kỳ Khóa II (2026 – 2028)',
  actionSlogan: 'Trí sáng – Đồng tâm – Vươn tầm – Cất cánh',
  studentIdentitySlogan:
    'Vững chuyên môn – Hồng tâm đức – Tự tin hội nhập – Phục vụ cộng đồng',
  mission:
    'Xây dựng lớp sinh viên EIU giàu lòng yêu nước, bản lĩnh chính trị vững vàng, có lý tưởng cách mạng và khát vọng cống hiến; rèn luyện đạo đức, tác phong văn minh, sức khỏe tốt; phát huy tinh thần học tập chủ động, tư duy sáng tạo, nghiên cứu khoa học, khởi nghiệp đổi mới sáng tạo, năng lực số và năng lực hội nhập quốc tế để trở thành những "Công dân toàn cầu".',
  role:
    'Kiên trì xây dựng tổ chức Hội Sinh viên Trường vững mạnh về chính trị, tư tưởng, đạo đức, tổ chức và hành động; lấy sinh viên làm trung tâm và chủ thể của phong trào; thực sự là cầu nối tin cậy giữa Nhà trường, doanh nghiệp và hơn 5.600 hội viên, sinh viên EIU.',
  term1Highlights: [
    {
      figure: '4.420',
      label: 'Hội viên mới kết nạp',
      detail: 'Vượt chỉ tiêu nhiệm kỳ I (2024 – 2026); toàn trường hiện có 5.691 tổng số hội viên.',
    },
    {
      figure: '513',
      label: 'Sinh viên tham gia Hành trình SV5T',
      detail: 'Tuyên dương 04 gương "Sinh viên 5 tốt" cấp Trường đầu tiên và mở rộng hệ thống xét trực tuyến.',
    },
    {
      figure: '282',
      label: 'Sinh viên đạt "Sinh viên khỏe"',
      detail: 'Đạt tỷ lệ 94,1% qua 02 đợt kiểm tra thể lực và gần 300 vận động viên dự EIU UniGames.',
    },
    {
      figure: '211',
      label: 'Đơn vị máu hiến tặng',
      detail: 'Tiếp nhận tại Ngày hội Hiến máu tình nguyện EIU 2025 cùng 770 cây xanh trồng mới khuôn viên.',
    },
    {
      figure: '2.000+',
      label: 'Lượt thiếu nhi Lớp Anh văn Định Hòa',
      detail: 'Duy trì bền vững lớp học tình nguyện miễn phí tại Khu nhà ở xã hội Định Hòa và vùng lân cận.',
    },
    {
      figure: '2.900+',
      label: 'Lượt học sinh và tân sinh viên hỗ trợ',
      detail: 'Hơn 1.500 lượt thí sinh "Tiếp sức mùa thi" và hơn 1.400 tân sinh viên "Tiếp sức đến trường".',
    },
    {
      figure: '30 / 04',
      label: 'Hội viên ưu tú học Đảng / Đảng viên mới',
      detail: 'Vượt 600% chỉ tiêu giới thiệu bồi dưỡng đối tượng kết nạp Đảng và 133% chỉ tiêu kết nạp.',
    },
    {
      figure: '05',
      label: 'Dự án khởi nghiệp đổi mới sáng tạo',
      detail: 'Đạt 250% chỉ tiêu, cùng 04 hoạt động thi học thuật/năm (400%) và 05 hoạt động quốc tế/năm (500%).',
    },
  ],
  signaturePrograms: [
    {
      category: 'Sinh viên 5 tốt',
      title: 'Hành trình Sinh viên 5 tốt và 5 Tốt Challenges',
      description:
        'Chuỗi đồng hành, tư vấn minh chứng và kết nối "Gương sáng dắt gương mới" giúp 513 lượt sinh viên xây dựng lộ trình đạt danh hiệu cấp Trường, cấp Thành và Trung ương.',
    },
    {
      category: 'Học thuật và Công nghệ',
      title: 'EIU Microcontroller Car Rally, OLP Tin học và Workshop GenAI',
      description:
        'Các sân chơi công nghệ thực chiến quy tụ hơn 20 đội thi đại học và THPT, đội tuyển Olympic Tin học Sinh viên Việt Nam đạt giải toàn quốc, cùng tọa đàm nghiên cứu khoa học liên kết HSV Việt Nam tại Singapore.',
    },
    {
      category: 'Tình nguyện Cộng đồng',
      title: 'Lớp Anh văn Định Hòa, Xuân Yêu Thương và Ngày hội Hiến máu',
      description:
        'Lan tỏa tinh thần phục vụ cộng đồng qua đêm nhạc gây quỹ hơn 20 triệu đồng trao hơn 40 phần quà Tết, 211 đơn vị máu nhân đạo, 770 cây xanh và hơn 2.000 lượt thiếu nhi học tiếng Anh miễn phí.',
    },
    {
      category: 'Thể chất và Hội nhập',
      title: 'Hội thao EIU UniGames và Giao lưu Quốc tế',
      description:
        'Hội thao truyền thống thu hút gần 300 vận động viên mỗi kỳ cùng các chương trình giao lưu với sinh viên Singapore (Nanyang Polytechnic), Nhật Bản (ĐH Yamaguchi), Đài Loan (ĐH Trung Sơn) và Diễn đàn ICF.',
    },
  ],
  term2Flagships: [
    {
      type: 'Đề án trọng tâm',
      title:
        'Nâng cao năng lực nghiên cứu khoa học và phát triển tư duy khởi nghiệp đổi mới sáng tạo trong sinh viên EIU giai đoạn 2026 – 2028',
    },
    {
      type: 'Chương trình nhiệm kỳ',
      title:
        'Số hóa toàn diện công tác Hội và phát triển Không gian văn hóa số sinh viên Quốc tế Miền Đông',
    },
    {
      type: 'Công trình thanh niên',
      title:
        'Xây dựng mô hình Không gian thời sự Sinh viên tại khuôn viên Trường Đại học Quốc tế Miền Đông',
    },
  ],
  term2KeyTargets: [
    'Phấn đấu ít nhất 50 Sinh viên 5 tốt cấp Trường, 05 cấp Thành, 01 danh hiệu Bồ câu trắng và 01 SV5T cấp Trung ương hoặc Sao Tháng Giêng.',
    '100% Chi hội, CLB tham gia phong trào nâng cao năng lực số; 100% sinh viên tiếp cận các hoạt động AI, Data Science, IoT.',
    'Tổ chức ít nhất 02 hoạt động NCKH/năm (05 đề tài dự sân chơi cấp Thành/Bộ/quốc tế) và 04 chương trình giao lưu quốc tế/năm.',
    'Nâng tỷ lệ hội viên tham gia ít nhất 05 ngày tình nguyện/năm học đạt từ 80% trở lên; vận động ít nhất 150 triệu đồng nguồn lực chăm lo sinh viên và thiếu nhi.',
    'Giới thiệu ít nhất 40 hội viên ưu tú học lớp bồi dưỡng kết nạp Đảng, phấn đấu kết nạp ít nhất 05 đảng viên mới trong nhiệm kỳ.',
  ],
};

// =============================================================================
// 3. CƠ CẤU TỔ CHỨC CẤP TRƯỜNG (THÔNG BÁO PHÂN CÔNG HIỆU LỰC 01/11/2026)
// =============================================================================

export const SCHOOL_ORG_DEPARTMENTS: OrgDepartmentGroup[] = [
  {
    id: 'tgpt',
    name: 'Ban Tuyên giáo – Phong trào',
    shortName: 'Ban Tuyên giáo – Phong trào',
    coordinatorName: 'Trương Châu Phước Lộc',
    coordinatorTitle: 'Chủ tịch Hội Sinh viên Việt Nam Trường',
    coordinatorStaffId: 'staff-01',
    summary:
      'Quản lý và điều phối công tác tuyên truyền, giáo dục chính trị tư tưởng, truyền thông số (Mảng Tuyên giáo) và tổ chức các phong trào Sinh viên 5 tốt, văn hóa – thể thao, tình nguyện, Đội CTV Xung kích (Mảng Phong trào).',
    badge: '19 nhân sự • 02 Mảng',
    subDivisions: [
      'Mảng Tuyên giáo: Tiểu ban Design, Tiểu ban Video, Tiểu ban Photo',
      'Mảng Phong trào: Tiểu ban Tài chính, Tiểu ban Nội dung, Tiểu ban MC và Đội CTV Xung kích',
    ],
    officers: [
      {
        fullName: 'Đặng Trí Toàn',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Trưởng Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
        staffId: 'staff-06',
      },
      {
        fullName: 'Nguyễn Mai Gia Tường',
        currentRole: 'Ủy viên Ban Thư ký HSV Trường',
        assignedPosition: 'Trưởng Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-04',
      },
      {
        fullName: 'Võ Chí Kiên',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Phó Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
        staffId: 'staff-11',
      },
      {
        fullName: 'Liêu Gia Kỳ',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Phó Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
        staffId: 'staff-12',
      },
      {
        fullName: 'Nguyễn Thị Thùy Nhi',
        currentRole: 'Ủy viên Ban Kiểm tra HSV Trường',
        assignedPosition: 'Phó Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-16',
      },
      {
        fullName: 'Nguyễn Thanh Đạt',
        currentRole: 'Đội trưởng Đội CTV Xung kích HSV Trường',
        assignedPosition: 'Phó Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-20',
      },
      {
        fullName: 'Phạm Thị Thanh Thủy',
        currentRole: 'Ủy viên Ban Thư ký HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-05',
      },
      {
        fullName: 'Trịnh Nguyễn Nguyệt Ánh',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-07',
      },
      {
        fullName: 'Nguyễn Đức Lê Hoàng',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-10',
      },
      {
        fullName: 'Nguyễn Thanh Nhã',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-13',
      },
      {
        fullName: 'Trịnh Thị Phương Thùy',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-15',
      },
      {
        fullName: 'Trần Nguyễn Quỳnh Trân',
        currentRole: 'Ủy viên Ban Kiểm tra HSV Trường',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
        staffId: 'staff-17',
      },
      {
        fullName: 'Huỳnh Nguyễn Thảo Nhi',
        currentRole: 'Ủy viên Ban Chấp hành Chi hội 26KHSK01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
      },
      {
        fullName: 'Đỗ Bình Khôi Nguyên',
        currentRole: 'Hội viên Chi hội 26KT01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
      },
      {
        fullName: 'Lê Hồng Diễm',
        currentRole: 'Chi hội phó Chi hội 26KHSK01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Tuyên giáo',
      },
      {
        fullName: 'Nguyễn Tuyết Nhung',
        currentRole: 'Chi hội trưởng Chi hội 26KT01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
      },
      {
        fullName: 'Nguyễn Phú Quý',
        currentRole: 'Ủy viên Ban Chấp hành Chi hội 26KT01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
      },
      {
        fullName: 'Nguyễn Triệu Mỹ',
        currentRole: 'Chi hội phó Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
      },
      {
        fullName: 'Huỳnh Phú Hào',
        currentRole: 'Chi hội trưởng Chi hội 26CNTT01',
        assignedPosition: 'Cán bộ Ban Tuyên giáo – Phong trào',
        division: 'Mảng: Phong trào',
      },
    ],
  },
  {
    id: 'vp',
    name: 'Văn phòng Hội Sinh viên Trường',
    shortName: 'Văn phòng Hội (206.B06)',
    coordinatorName: 'Nguyễn Như Quỳnh',
    coordinatorTitle: 'Phó Chủ tịch thường trực • Tổng Thư ký Văn phòng HSV Trường',
    coordinatorStaffId: 'staff-02',
    summary:
      'Tham mưu tổng hợp, quản trị hành chính văn phòng 206.B06, công tác văn thư – lưu trữ, con dấu pháp lý, tài chính và quản lý tài sản dùng chung của Hội Sinh viên Trường.',
    badge: '06 nhân sự • Phòng 206.B06',
    subDivisions: [
      'Mảng Quản trị Văn phòng',
      'Mảng Văn thư – Lưu trữ',
      'Mảng Tài chính',
    ],
    officers: [
      {
        fullName: 'Nguyễn Mỹ Hạnh',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Chánh Văn phòng Hội Sinh viên Trường',
        division: 'Phụ trách chung Văn phòng và Đối ngoại',
        staffId: 'staff-08',
      },
      {
        fullName: 'Phạm Thị Hồng Ngọc',
        currentRole: 'Chi hội trưởng Chi hội 24QTKD01',
        assignedPosition: 'Phó Chánh Văn phòng Hội Sinh viên Trường',
        division: 'Mảng: Quản trị văn phòng',
        staffId: 'staff-19',
      },
      {
        fullName: 'Lê Thị Hải Yến',
        currentRole: 'Ủy viên Ban Kiểm tra HSV Trường',
        assignedPosition: 'Phó Chánh Văn phòng Hội Sinh viên Trường',
        division: 'Mảng: Văn thư – Lưu trữ',
        staffId: 'staff-18',
      },
      {
        fullName: 'Lương Gia Hân',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Văn phòng Hội Sinh viên Trường',
        division: 'Mảng: Tài chính',
        staffId: 'staff-09',
      },
      {
        fullName: 'Đào Văn Thanh',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Cán bộ Văn phòng Hội Sinh viên Trường',
        division: 'Mảng: Quản trị văn phòng',
        staffId: 'staff-14',
      },
      {
        fullName: 'Nguyễn Thị Bảo Ngọc',
        currentRole: 'Hội viên Chi hội 26KT01',
        assignedPosition: 'Cán bộ Văn phòng Hội Sinh viên Trường',
        division: 'Mảng: Văn thư – Lưu trữ',
      },
    ],
  },
  {
    id: 'tcxdh',
    name: 'Ban Tổ chức và Xây dựng Hội',
    shortName: 'Ban Tổ chức – Xây dựng Hội',
    coordinatorName: 'Trần Thị Thu Huyền',
    coordinatorTitle: 'Phó Chủ tịch, Trưởng Ban Kiểm tra • Trưởng Ban Tổ chức và Xây dựng Hội',
    coordinatorStaffId: 'staff-03',
    summary:
      'Quản lý công tác tổ chức cơ sở Hội, phát triển hội viên, đào tạo cán bộ, thẩm định hồ sơ Ngày tình nguyện và điều phối trực tiếp 04 Cụm Chi hội Khoa cùng Cụm Câu lạc bộ – Đội – Nhóm.',
    badge: '11 nhân sự • 05 Cụm cơ sở',
    subDivisions: [
      'Cụm Chi hội Khoa Quản trị Kinh doanh',
      'Cụm Chi hội Khoa Công nghệ Thông tin',
      'Cụm Chi hội Khoa Kỹ thuật',
      'Cụm Chi hội Khoa Khoa học Sức khỏe (Điều dưỡng)',
      'Cụm Câu lạc bộ – Đội – Nhóm',
    ],
    officers: [
      {
        fullName: 'Trịnh Thị Phương Thùy',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Phó Ban Tổ chức và Xây dựng Hội',
        division: 'Mảng: Cụm Chi hội Khoa Quản trị Kinh doanh',
        staffId: 'staff-15',
      },
      {
        fullName: 'Trần Nguyễn Quỳnh Trân',
        currentRole: 'Ủy viên Ban Kiểm tra HSV Trường',
        assignedPosition: 'Phó Ban Tổ chức và Xây dựng Hội',
        division: 'Mảng: Cụm Chi hội Khoa Công nghệ Thông tin',
        staffId: 'staff-17',
      },
      {
        fullName: 'Nguyễn Thanh Nhã',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Phó Ban Tổ chức và Xây dựng Hội',
        division: 'Mảng: Cụm Chi hội Khoa Kỹ thuật',
        staffId: 'staff-13',
      },
      {
        fullName: 'Phạm Thị Thanh Thủy',
        currentRole: 'Ủy viên Ban Thư ký HSV Trường',
        assignedPosition: 'Phó Ban Tổ chức và Xây dựng Hội',
        division: 'Mảng: Cụm Chi hội Khoa Điều dưỡng (KHSK)',
        staffId: 'staff-05',
      },
      {
        fullName: 'Nguyễn Mỹ Hạnh',
        currentRole: 'Ủy viên Ban Chấp hành HSV Trường',
        assignedPosition: 'Phó Ban Tổ chức và Xây dựng Hội',
        division: 'Mảng: Cụm Câu lạc bộ – Đội – Nhóm',
        staffId: 'staff-08',
      },
      {
        fullName: 'Nguyễn Tường Vy',
        currentRole: 'Chi hội trưởng Chi hội 26KHSK01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
      {
        fullName: 'Trần Đặng Khánh Ly',
        currentRole: 'Ủy viên Ban Chấp hành Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
      {
        fullName: 'Nguyễn Thanh Hải',
        currentRole: 'Chi hội phó Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
      {
        fullName: 'Phan Hoàng Lam',
        currentRole: 'Chi hội trưởng Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
      {
        fullName: 'Phạm Thị Như Quỳnh',
        currentRole: 'Hội viên Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
      {
        fullName: 'Nguyễn Hồng Ngọc',
        currentRole: 'Hội viên Chi hội 26QTKD01',
        assignedPosition: 'Cán bộ Ban Tổ chức và Xây dựng Hội',
      },
    ],
  },
];

// =============================================================================
// 4. HỆ THỐNG CHI HỘI SINH VIÊN (TỪ BẢNG TỔNG HỢP CSV CHÍNH THỨC)
// =============================================================================

export const CHI_HOI_SUMMARY_STATS = {
  totalGrassrootsUnits: 17, // Theo tổng hợp CSV cơ sở có BCH/BCN hoạt động (11/12 Chi hội + 6 CLB/Đội)
  totalChiHoiAllCohorts: 25,
  totalActiveBoardChiHoi: 12,
  totalHsvClubs: 6,
  totalEliteMembers: 269,
  totalActualMembers: 5003,
  totalMembers: 5691,
};

export const CHI_HOI_CLUSTERS: ChiHoiClusterMeta[] = [
  {
    code: 'QTKD',
    shortFacultyCode: 'BBS',
    name: 'Cụm Khoa Quản trị Kinh doanh',
    englishName: 'Becamex Business School (BBS)',
    supervisorName: 'Trịnh Thị Phương Thùy',
    supervisorTitle: 'Phó Ban Tổ chức và Xây dựng Hội',
    accentColor: '#133F68',
  },
  {
    code: 'KT',
    shortFacultyCode: 'SET',
    name: 'Cụm Khoa Kỹ thuật',
    englishName: 'School of Engineering (SET)',
    supervisorName: 'Nguyễn Thanh Nhã',
    supervisorTitle: 'Phó Ban Tổ chức và Xây dựng Hội',
    accentColor: '#0054A6',
  },
  {
    code: 'CNTT',
    shortFacultyCode: 'CIT',
    name: 'Cụm Khoa Công nghệ Thông tin',
    englishName: 'School of Computing and IT (CIT)',
    supervisorName: 'Trần Nguyễn Quỳnh Trân',
    supervisorTitle: 'Phó Ban Tổ chức và Xây dựng Hội',
    accentColor: '#02294E',
  },
  {
    code: 'KHSK',
    shortFacultyCode: 'SNS',
    name: 'Cụm Khoa Khoa học Sức khỏe',
    englishName: 'School of Nursing (SNS)',
    supervisorName: 'Phạm Thị Thanh Thủy',
    supervisorTitle: 'Phó Ban Tổ chức và Xây dựng Hội',
    accentColor: '#51803A',
  },
];

export const CHI_HOI_LIST: ChiHoiItem[] = [
  // --- CỤM QTKD (6 Chi hội, 4 BCH đang hoạt động) ---
  {
    code: '21QTKD01',
    slug: 'chi-hoi-21qtkd01',
    cohort: 21,
    facultyCluster: 'QTKD',
    hasActiveBoard: false,
    studentCount: 232,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '22QTKD01',
    slug: 'chi-hoi-22qtkd01',
    cohort: 22,
    facultyCluster: 'QTKD',
    hasActiveBoard: false,
    studentCount: 222,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '23QTKD01',
    slug: 'chi-hoi-23qtkd01',
    cohort: 23,
    facultyCluster: 'QTKD',
    hasActiveBoard: true,
    studentCount: 342,
    eliteMemberCount: 10,
    representativeName: 'Nguyễn Mai Gia Tường',
    representativeRole: 'Chi hội phó',
    representativeEmail: 'tuong.nguyenmai.bbs23@eiu.edu.vn',
    latestDecisionFile: '08/QĐ-HSV (27/05/2026) — Chuẩn y nhân sự BCH K13QTKD01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Trịnh Thị Phương Thùy' },
      { position: 'Chi hội phó', fullName: 'Lê Thị Bích Phượng' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Mai Gia Tường' },
      { position: 'Ủy viên BCH', fullName: 'Lê Nguyễn Hoàng Phúc' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Thị Hà Trang' },
    ],
  },
  {
    code: '24QTKD01',
    slug: 'chi-hoi-24qtkd01',
    cohort: 24,
    facultyCluster: 'QTKD',
    hasActiveBoard: true,
    studentCount: 360,
    eliteMemberCount: 12,
    representativeName: 'Phạm Thị Hồng Ngọc',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'ngoc.phamthi.bbs24@eiu.edu.vn',
    latestDecisionFile: '11/QĐ-HSV (28/05/2026) — Chuẩn y nhân sự BCH K14QTKD01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Phạm Thị Hồng Ngọc' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Như Quỳnh' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Võ Hương Giang' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Minh Trí' },
      { position: 'Ủy viên BCH', fullName: 'Trần Thị Nhi' },
    ],
  },
  {
    code: '25QTKD01',
    slug: 'chi-hoi-25qtkd01',
    cohort: 25,
    facultyCluster: 'QTKD',
    hasActiveBoard: true,
    studentCount: 585,
    eliteMemberCount: 11,
    representativeName: 'Lương Gia Hân',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'han.luong.bbs25@eiu.edu.vn',
    latestDecisionFile: '12/QĐ-HSV (28/05/2026) — Chuẩn y nhân sự BCH K15QTKD01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Lương Gia Hân' },
      { position: 'Chi hội phó', fullName: 'Lê Thị Hải Yến' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thị Thùy Nhi' },
      { position: 'Ủy viên BCH', fullName: 'Lê Nguyễn Hoàng Mỹ' },
      { position: 'Ủy viên BCH', fullName: 'Võ Thành Danh' },
    ],
  },
  {
    code: '26QTKD01',
    slug: 'chi-hoi-26qtkd01',
    cohort: 26,
    facultyCluster: 'QTKD',
    hasActiveBoard: true,
    studentCount: 574,
    eliteMemberCount: 13,
    representativeName: 'Phan Hoàng Lam',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'lam.phan.bbs26@eiu.edu.vn',
    latestDecisionFile: '37/QĐ-HSV (22/10/2026) — Chỉ định BCH Chi hội 26QTKD01 khóa I',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Phan Hoàng Lam' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thanh Hải' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Triệu Mỹ' },
      { position: 'Ủy viên BCH', fullName: 'Hán Trịnh Tuyết Nhung' },
      { position: 'Ủy viên BCH', fullName: 'Trần Đặng Khánh Ly' },
    ],
  },

  // --- CỤM KỸ THUẬT (6 Chi hội, 3 BCH đang hoạt động) ---
  {
    code: '21KT01',
    slug: 'chi-hoi-21kt01',
    cohort: 21,
    facultyCluster: 'KT',
    hasActiveBoard: false,
    studentCount: 29,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '22KT01',
    slug: 'chi-hoi-22kt01',
    cohort: 22,
    facultyCluster: 'KT',
    hasActiveBoard: false,
    studentCount: 42,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '23KT01',
    slug: 'chi-hoi-23kt01',
    cohort: 23,
    facultyCluster: 'KT',
    hasActiveBoard: false,
    studentCount: 100,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '24KT01',
    slug: 'chi-hoi-24kt01',
    cohort: 24,
    facultyCluster: 'KT',
    hasActiveBoard: true,
    studentCount: 198,
    eliteMemberCount: 14,
    representativeName: 'Nguyễn Thanh Nhã',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'nha.nguyen.set24@eiu.edu.vn',
    latestDecisionFile: '16/QĐ-HSV (30/05/2026) — Chuẩn y nhân sự BCH K14KT01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Nguyễn Thanh Nhã' },
      { position: 'Chi hội phó', fullName: 'Lê Hồng Anh' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thành Tín' },
      { position: 'Ủy viên BCH', fullName: 'Trần Thành Duy' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Nhân Trí' },
    ],
  },
  {
    code: '25KT01',
    slug: 'chi-hoi-25kt01',
    cohort: 25,
    facultyCluster: 'KT',
    hasActiveBoard: true,
    studentCount: 426,
    eliteMemberCount: 13,
    representativeName: 'Võ Chí Kiên',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'kien.vo.set25@eiu.edu.vn',
    latestDecisionFile: '06/QĐ-HSV (26/05/2026) — Chuẩn y nhân sự BCH K15KT01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Võ Chí Kiên' },
      { position: 'Chi hội phó', fullName: 'Lê Phan Ngọc Hà' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Phú Sự' },
      { position: 'Ủy viên BCH', fullName: 'Đoàn Nhân Nhàn' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Gia Huy' },
    ],
  },
  {
    code: '26KT01',
    slug: 'chi-hoi-26kt01',
    cohort: 26,
    facultyCluster: 'KT',
    hasActiveBoard: true,
    studentCount: 395,
    eliteMemberCount: 8,
    representativeName: 'Nguyễn Tuyết Nhung',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'nhung.nguyen.set26@eiu.edu.vn',
    latestDecisionFile: '39/QĐ-HSV (22/10/2026) — Chỉ định BCH Chi hội 26KT01 khóa I',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Nguyễn Tuyết Nhung' },
      { position: 'Chi hội phó', fullName: 'Hồ Minh Trí' },
      { position: 'Chi hội phó', fullName: 'Lâm Gia Huy' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Trần Tường An' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Phú Quý' },
    ],
  },

  // --- CỤM CNTT (7 Chi hội, 3 BCH đang hoạt động) ---
  {
    code: '21CNTT01',
    slug: 'chi-hoi-21cntt01',
    cohort: 21,
    facultyCluster: 'CNTT',
    hasActiveBoard: false,
    studentCount: 72,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '22CNTT01',
    slug: 'chi-hoi-22cntt01',
    cohort: 22,
    facultyCluster: 'CNTT',
    hasActiveBoard: false,
    studentCount: 127,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '23CNTT01',
    slug: 'chi-hoi-23cntt01',
    cohort: 23,
    facultyCluster: 'CNTT',
    hasActiveBoard: false,
    studentCount: 236,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '24CNTT01',
    slug: 'chi-hoi-24cntt01',
    cohort: 24,
    facultyCluster: 'CNTT',
    hasActiveBoard: false,
    studentCount: 234,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '25CNTT01',
    slug: 'chi-hoi-25cntt01',
    cohort: 25,
    facultyCluster: 'CNTT',
    hasActiveBoard: true,
    studentCount: 291,
    eliteMemberCount: 14,
    representativeName: 'Trần Thị Thu Huyền',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'huyen.tranthi.cit25@eiu.edu.vn',
    latestDecisionFile: '14/QĐ-HSV (30/05/2026) — Chuẩn y nhân sự BCH K15CNTT01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Trần Thị Thu Huyền' },
      { position: 'Chi hội phó', fullName: 'Trần Nguyễn Quỳnh Trân' },
      { position: 'Chi hội phó', fullName: 'Liêu Gia Kỳ' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Hoàng Dung' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Thị Minh Khuê' },
    ],
  },
  {
    code: '25CNTT02',
    slug: 'chi-hoi-25cntt02',
    cohort: 25,
    facultyCluster: 'CNTT',
    hasActiveBoard: true,
    studentCount: null,
    eliteMemberCount: 14,
    representativeName: 'Đặng Trí Toàn',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'toan.dang.cit25@eiu.edu.vn',
    latestDecisionFile: '10/QĐ-HSV (27/05/2026) — Chuẩn y nhân sự BCH K15CNTT02',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Đặng Trí Toàn' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thị Kiều Thu' },
      { position: 'Chi hội phó', fullName: 'Trần Quang Đại' },
      { position: 'Ủy viên BCH', fullName: 'Đặng Thị Khánh An' },
      { position: 'Ủy viên BCH', fullName: 'Trần Hoàng Khang' },
    ],
  },
  {
    code: '26CNTT01',
    slug: 'chi-hoi-26cntt01',
    cohort: 26,
    facultyCluster: 'CNTT',
    hasActiveBoard: true,
    studentCount: 147,
    eliteMemberCount: 10,
    representativeName: 'Huỳnh Phú Hào',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'hao.huynh.cit26@eiu.edu.vn',
    latestDecisionFile: '38/QĐ-HSV (22/10/2026) — Chỉ định BCH Chi hội 26CNTT01 khóa I',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Huỳnh Phú Hào' },
      { position: 'Chi hội phó', fullName: 'Hồ Phúc Đăng' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thị Như Ý' },
      { position: 'Ủy viên BCH', fullName: 'Phạm Hữu Thuận' },
      { position: 'Ủy viên BCH', fullName: 'Võ Trần Anh Thư' },
    ],
  },

  // --- CỤM KHOA HỌC SỨC KHỎE (6 Chi hội, 2 BCH đang hoạt động) ---
  {
    code: '21KHSK01',
    slug: 'chi-hoi-21khsk01',
    cohort: 21,
    facultyCluster: 'KHSK',
    hasActiveBoard: false,
    studentCount: 18,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '22KHSK01',
    slug: 'chi-hoi-22khsk01',
    cohort: 22,
    facultyCluster: 'KHSK',
    hasActiveBoard: false,
    studentCount: 16,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '23KHSK01',
    slug: 'chi-hoi-23khsk01',
    cohort: 23,
    facultyCluster: 'KHSK',
    hasActiveBoard: false,
    studentCount: 70,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '24KHSK01',
    slug: 'chi-hoi-24khsk01',
    cohort: 24,
    facultyCluster: 'KHSK',
    hasActiveBoard: false,
    studentCount: 121,
    eliteMemberCount: null,
    boardMembers: [],
  },
  {
    code: '25KHSK01',
    slug: 'chi-hoi-25khsk01',
    cohort: 25,
    facultyCluster: 'KHSK',
    hasActiveBoard: true,
    studentCount: 166,
    eliteMemberCount: 16,
    representativeName: 'Phạm Thị Thanh Thủy',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'thuy.phamthi.sns25@eiu.edu.vn',
    latestDecisionFile: '15/QĐ-HSV (30/05/2026) — Chuẩn y nhân sự BCH K15ĐD01',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Phạm Thị Thanh Thủy' },
      { position: 'Chi hội phó', fullName: 'Võ Duy Huân' },
      { position: 'Chi hội phó', fullName: 'Lê Nguyễn Nguyệt Nga' },
      { position: 'Ủy viên BCH', fullName: 'Phạm Thùy Dương' },
      { position: 'Ủy viên BCH', fullName: 'Vũ Thị Trúc Oanh' },
    ],
  },
  {
    code: '26KHSK01',
    slug: 'chi-hoi-26khsk01',
    cohort: 26,
    facultyCluster: 'KHSK',
    hasActiveBoard: true,
    studentCount: 155,
    eliteMemberCount: 19,
    representativeName: 'Nguyễn Tường Vy',
    representativeRole: 'Chi hội trưởng',
    representativeEmail: 'vy.nguyentuong.sns26@eiu.edu.vn',
    latestDecisionFile: 'Quyết định công nhận BCH Chi hội 26KHSK01 khóa I',
    boardMembers: [
      { position: 'Chi hội trưởng', fullName: 'Nguyễn Tường Vy' },
      { position: 'Chi hội phó', fullName: 'Lê Hồng Diễm' },
      { position: 'Chi hội phó', fullName: 'Nguyễn Thục Quyên' },
      { position: 'Ủy viên BCH', fullName: 'Huỳnh Nguyễn Thảo Nhi' },
      { position: 'Ủy viên BCH', fullName: 'Nguyễn Bảo Trân' },
    ],
  },
];

// =============================================================================
// 5. HỆ THỐNG CÂU LẠC BỘ – ĐỘI – NHÓM EIU
// (06 CLB/Đội trực thuộc HSV với Ban Chủ nhiệm đầy đủ từ CSV +
//  24 CLB sinh viên EIU còn lại phân theo 04 nhóm chuẩn từ eiu.edu.vn)
// =============================================================================

export const CLUB_GROUP_META: {
  id: ClubDirectoryGroup;
  label: string;
  englishLabel: string;
  accent: string;
  summary: string;
}[] = [
  {
    id: 'CONG_DONG',
    label: 'Cộng đồng và Tình nguyện',
    englishLabel: 'Community Clubs',
    accent: '#C10230',
    summary:
      'Gắn kết sinh viên vì cộng đồng, phong trào Sinh viên 5 tốt, xung kích sự kiện, truyền thông, hiến máu nhân đạo và sơ cấp cứu ban đầu.',
  },
  {
    id: 'HOC_THUAT',
    label: 'Học thuật',
    englishLabel: 'Academic Clubs',
    accent: '#0054A6',
    summary:
      'Nuôi dưỡng tư duy phản biện, nghiên cứu khoa học, công nghệ, tài chính, kinh tế và dự án học thuật chuyên sâu tại các khoa.',
  },
  {
    id: 'NGHE_THUAT',
    label: 'Nghệ thuật',
    englishLabel: 'Cultural Clubs',
    accent: '#133F68',
    summary:
      'Không gian sáng tạo âm nhạc, vũ đạo, cổ động, dẫn chương trình (MC), nhiếp ảnh và giao lưu văn hóa quốc tế năng động.',
  },
  {
    id: 'THE_THAO',
    label: 'Thể thao',
    englishLabel: 'Sport Clubs',
    accent: '#51803A',
    summary:
      'Rèn luyện thể chất định kỳ, tinh thần đồng đội và thi đấu các giải thể thao sinh viên cấp trường và liên trường.',
  },
];

export const EIU_CLUBS_INTRO = {
  lead:
    'Bên cạnh hoạt động học tập và đào tạo chuẩn quốc tế, Trường Đại học Quốc tế Miền Đông (EIU) và Hội Sinh viên Trường đặc biệt chú trọng xây dựng đời sống tinh thần sinh viên thông qua hệ thống Câu lạc bộ – Đội – Nhóm đa dạng. Đây là sân chơi để sinh viên thể hiện tài năng, giao lưu kết nối và trau dồi kỹ năng thực tiễn.',
  hsvNote:
    'Hiện nay có 06 Câu lạc bộ – Đội trực thuộc Hội Sinh viên Trường (nòng cốt triển khai phong trào Sinh viên 5 tốt, truyền thông – sự kiện, hiến máu và xung kích) cùng hệ thống các Câu lạc bộ sinh viên EIU hoạt động sôi nổi theo 04 nhóm: Học thuật, Nghệ thuật, Thể thao và Cộng đồng.',
  sourceUrl: 'https://eiu.edu.vn/kham-pha/doi-song-eiu/cau-lac-bo-sinh-vien/',
};

export const EIU_CLUBS_DIRECTORY: EiuClubProfile[] = [
  // ---------------------------------------------------------------------------
  // A. 06 CLB – ĐỘI – NHÓM TRỰC THUỘC HỘI SINH VIÊN TRƯỜNG (ĐẦY ĐỦ BCN TỪ CSV)
  // ---------------------------------------------------------------------------
  {
    id: 'hsv-sv5tc',
    code: 'SV5TC',
    slug: 'clb-cong-dong-sinh-vien-5-tot',
    name: 'CLB Sinh viên 5 tốt Hội Sinh viên Trường ĐHQTMĐ',
    englishName: 'EIU 5-Good Students Club',
    group: 'CONG_DONG',
    isHsvAffiliated: true,
    memberCountLabel: '56 thành viên',
    slogan: 'Gương sáng dắt gương mới',
    description:
      'Câu lạc bộ nòng cốt trực thuộc Hội Sinh viên Trường, quy tụ các gương sáng và sinh viên phấn đấu danh hiệu "Sinh viên 5 tốt". Triển khai chuỗi "Hành trình Sinh viên 5 tốt", tư vấn hồ sơ minh chứng 05 tiêu chuẩn và kết nối mạng lưới Mentoring cho sinh viên từ năm thứ nhất.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Nguyễn Mai Gia Tường' },
      { role: 'Phó Chủ nhiệm', fullName: 'Trần Thị Thu Huyền' },
      { role: 'Phó Chủ nhiệm', fullName: 'Đặng Trí Toàn' },
    ],
    email: 'hsv@eiu.edu.vn',
  },
  {
    id: 'hsv-ctvxk',
    code: 'CTVXK',
    slug: 'doi-cong-tac-vien-xung-kich',
    name: 'Đội Cộng tác viên Xung kích Hội Sinh viên Trường ĐHQTMĐ',
    englishName: 'EIU Youth Volunteer Force',
    group: 'CONG_DONG',
    isHsvAffiliated: true,
    memberCountLabel: '35 thành viên',
    slogan: 'Xung kích – Chuyên nghiệp – Trách nhiệm',
    description:
      'Lực lượng xung kích trực thuộc Hội Sinh viên Trường chuyên trách hỗ trợ tổ chức sự kiện quy mô lớn, điều phối hậu cần – sân khấu, lễ tân – khánh tiết và dẫn dắt các chiến dịch tình nguyện như Tiếp sức mùa thi, Tiếp sức đến trường, Ngày Chủ nhật xanh.',
    boardMembers: [
      { role: 'Đội trưởng', fullName: 'Nguyễn Thanh Đạt' },
      { role: 'Đội phó', fullName: 'Lê Thị Mộng Kiều' },
      { role: 'Đội phó', fullName: 'Nguyễn Thị Thùy Nhi' },
    ],
    email: 'hsv@eiu.edu.vn',
  },
  {
    id: 'hsv-beam',
    code: 'BEAM',
    slug: 'clb-truyen-thong-su-kien-beam',
    name: 'CLB Truyền thông Sự kiện BEAM',
    englishName: 'EIU BEAM Club',
    group: 'CONG_DONG',
    isHsvAffiliated: true,
    memberCountLabel: '25 thành viên',
    slogan: 'EIU BEAM – Nơi bạn tỏa sáng, kết nối và trưởng thành',
    description:
      'Câu lạc bộ sự kiện và truyền thông của sinh viên EIU hoạt động trên 04 trụ cột Broadcast – Engage – Assist – Media. Kết nối, đồng hành và lan tỏa giá trị tích cực đến cộng đồng sinh viên, đồng thời là điểm đến đăng ký Cộng tác viên sớm nhất cho các chương trình lớn của Trường và Hội Sinh viên.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Đào Văn Thanh' },
      { role: 'Phó Chủ nhiệm', fullName: 'Trần Minh Quang' },
      { role: 'Phó Chủ nhiệm', fullName: 'Nguyễn Như Quỳnh' },
    ],
    email: 'eiu.beam.club@gmail.com',
    facebookUrl: 'https://facebook.com/eiu.beam.club',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-beam.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-BEAM.jpg',
  },
  {
    id: 'hsv-mcvu',
    code: 'MCVU',
    slug: 'clb-mc-voiceup',
    name: 'CLB MC VoiceUP',
    englishName: 'Voice Up Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: true,
    memberCountLabel: '18 thành viên',
    description:
      'CLB năng động quy tụ sinh viên đam mê nghệ thuật dẫn chương trình (MC), thuyết trình và giao tiếp trước đám đông. Nơi rèn luyện kỹ năng nói, phong thái tự tin, chất giọng cá nhân; tham gia dẫn dắt các lễ lớn, talkshow, giao lưu văn hóa của Trường và đại diện EIU giao lưu liên trường.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Nguyễn Đức Lê Hoàng' },
      { role: 'Phó Chủ nhiệm', fullName: 'Nguyễn Thị Thùy Nhi' },
      { role: 'Phó Chủ nhiệm', fullName: 'Lê Nguyễn Hoàng Mỹ' },
    ],
    email: 'voiceup.eiu@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61577270229144',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-voice-up.png',
  },
  {
    id: 'hsv-bdc',
    code: 'BDC',
    slug: 'clb-hien-mau-tinh-nguyen-eiu',
    name: 'CLB Hiến máu Tình nguyện EIU',
    englishName: 'EIU Blood Donation Club',
    group: 'CONG_DONG',
    isHsvAffiliated: true,
    slogan: 'Một giọt máu cho đi – Một cuộc đời ở lại',
    description:
      'Câu lạc bộ tình nguyện cộng đồng trực thuộc Hội Sinh viên Trường chuyên vận động, truyền thông và phối hợp tổ chức các đợt Ngày hội Hiến máu Tình nguyện EIU, lan tỏa tinh thần nhân ái và chăm sóc sức khỏe cộng đồng.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Phan Thị Thùy Nguyên' },
      { role: 'Phó Chủ nhiệm', fullName: 'Trịnh Nguyễn Nguyệt Ánh' },
      { role: 'Phó Chủ nhiệm', fullName: 'Võ Duy Huân' },
    ],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-blood-donation-club.png',
  },
  {
    id: 'hsv-tre',
    code: 'TRE',
    slug: 'clb-van-nghe-the-rising-ether',
    name: 'CLB Văn nghệ The Rising Ether (TRE)',
    englishName: 'TRE Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: true,
    description:
      'Câu lạc bộ văn nghệ trực thuộc Hội Sinh viên Trường, quy tụ sinh viên yêu thích ca hát, biểu diễn nghệ thuật và dàn dựng tiết mục cho các đêm nhạc gây quỹ, chương trình lễ hội và sự kiện văn hóa tại EIU.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Lương Chu Dâng' }],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-tre.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-tre.jpg',
  },

  // ---------------------------------------------------------------------------
  // B. CÁC CÂU LẠC BỘ SINH VIÊN EIU THEO 04 NHÓM (TỪ EIU.EDU.VN)
  // ---------------------------------------------------------------------------
  // --- NHÓM HỌC THUẬT ---
  {
    id: 'eiu-honors',
    code: 'HONORS',
    name: 'Câu lạc bộ Honors',
    englishName: 'Honors Club',
    group: 'HOC_THUAT',
    isHsvAffiliated: false,
    description:
      'Môi trường học thuật năng động và giàu cảm hứng dành cho sinh viên ưu tú từ Chương trình Sinh viên Tài năng Khoa Quản trị Kinh doanh EIU (BBS). Nuôi dưỡng tư duy phản biện, kỹ năng nghiên cứu, làm việc nhóm chuyên nghiệp, kết nối diễn đàn học thuật, dự án cộng đồng và giao lưu quốc tế.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Phạm Tuấn Kiệt' }],
    email: 'bbshonorsclub@gmail.com',
    facebookUrl: 'https://fb.com/bbshonorsclub',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-honors.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-honors.jpg',
  },
  {
    id: 'eiu-bbs-finance',
    code: 'BBS-FIN',
    name: 'Câu lạc bộ Tài chính BBS (BBS Finance)',
    englishName: 'BBS Finance Club',
    group: 'HOC_THUAT',
    isHsvAffiliated: false,
    description:
      'Tập hợp sinh viên đam mê tài chính, đầu tư và ngân hàng. Thường xuyên tổ chức hội thảo chuyên đề, cuộc thi học thuật, dự án nghiên cứu và chương trình đầu tư mô phỏng nhằm nâng cao năng lực phân tích, tư duy chiến lược và đại diện EIU giao lưu học thuật liên trường.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'GV. Vũ Thị Hồng Nhung' }],
    email: 'bbs.finclub@gmail.com',
    facebookUrl: 'https://www.facebook.com/bbsfinclub',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-bbs-fin-club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-bbs-finance.jpg',
  },
  {
    id: 'eiu-technical',
    code: 'SET-TECH',
    name: 'Câu lạc bộ Sinh viên Kỹ thuật EIU',
    englishName: 'EIU Student Technical Club',
    group: 'HOC_THUAT',
    isHsvAffiliated: false,
    slogan: 'Sáng tạo – Phát triển – Bền vững',
    description:
      'Câu lạc bộ học thuật thuộc Khoa Kỹ thuật (SET), tạo không gian học tập và phát triển dự án thực hành cùng sự đồng hành của giảng viên, chuyên viên cố vấn; tổ chức workshop, học nhóm và dự án nâng cao kỹ năng khoa học – công nghệ – kỹ thuật.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Huỳnh Công Danh' },
      { role: 'Phó Chủ nhiệm – Cố vấn', fullName: 'Võ Phạm Mai Uyên' },
      { role: 'Phó Chủ nhiệm', fullName: 'Biện Trung Tín' },
    ],
    email: 'danh.huynh.set23@eiu.edu.vn',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-technical-club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-teachnical.jpg',
  },
  {
    id: 'eiu-it',
    code: 'IT-CLUB',
    name: 'Câu lạc bộ Công nghệ Thông tin EIU',
    englishName: 'EIU IT Club',
    group: 'HOC_THUAT',
    isHsvAffiliated: false,
    description:
      'Câu lạc bộ học thuật Khoa Công nghệ Thông tin kết nối sinh viên đam mê lập trình, trí tuệ nhân tạo, an ninh mạng và phát triển phần mềm; đồng hành các đội tuyển học thuật và workshop công nghệ mới tại EIU.',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-it-club.png',
  },
  {
    id: 'eiu-economics',
    code: 'ECON',
    name: 'Câu lạc bộ Kinh tế EIU',
    englishName: 'EIU Economics Club',
    group: 'HOC_THUAT',
    isHsvAffiliated: false,
    description:
      'Sân chơi học thuật dành cho sinh viên yêu thích kinh tế học, phân tích thị trường, quản trị kinh doanh và các cuộc thi giải tình huống kinh doanh thực tế tại EIU.',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-economics-club.png',
  },

  // --- NHÓM NGHỆ THUẬT ---
  {
    id: 'eiu-bumblebee',
    code: 'BUMBLEBEE',
    name: 'Câu lạc bộ Bumblebee Dance',
    englishName: 'Bumblebee Dance Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    slogan: "We don't just dance — we breathe passion",
    description:
      'CLB Nhảy của EIU hội tụ những sinh viên yêu thích vũ đạo và đam mê tỏa sáng trên sân khấu. Rèn luyện kỹ năng nhảy, lan tỏa năng lượng tích cực, kết nối sinh viên và xây dựng tinh thần đồng đội.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Võ Diệu Huyền' }],
    email: 'Huyenvo180225@gmail.com',
    facebookUrl: 'https://web.facebook.com/people/Bumblebee-Club/61554129990306/',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-bunblebee.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-bumblebee.jpg',
  },
  {
    id: 'eiu-passion',
    code: 'PASSION',
    name: 'Câu lạc bộ Passion',
    englishName: 'Passion Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'Một trong những câu lạc bộ văn nghệ có bề dày hoạt động tại EIU, gắn bó với phong trào sinh viên qua nhiều thế hệ. Không gian phát huy tài năng, rèn luyện bản lĩnh sân khấu và lan tỏa tinh thần phục vụ cộng đồng qua các hoạt động nghệ thuật đa dạng.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Nguyễn Thị Thanh Ngân' }],
    email: 'Passionclub.20.10@gmail.com',
    facebookUrl: 'https://www.facebook.com/Passion.EIU/',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-passion.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/04/clb-van-nghe-eiu.jpg',
  },
  {
    id: 'eiu-photography',
    code: 'PHOTO',
    name: 'Câu lạc bộ Nhiếp ảnh EIU',
    englishName: 'EIU Photography Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'Nơi hội tụ giao lưu, học hỏi và thực hành sáng tác của những sinh viên EIU có chung niềm đam mê nhiếp ảnh và nghệ thuật thị giác.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Nguyễn Vinh Thắng' }],
    email: 'eiuphotographyclub.offical@gmail.com',
    facebookUrl: 'https://www.facebook.com/EPCbesideyou/',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-club-nhiep-anh.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-nhiep-anh.jpg',
  },
  {
    id: 'eiu-soarers',
    code: 'SOARERS',
    name: 'Câu lạc bộ Soarers',
    englishName: 'Soarers Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'CLB nhảy quy tụ sinh viên nhiệt huyết và đam mê nghệ thuật vũ đạo với đa dạng thể loại từ nhảy hiện đại, hip-hop đến múa truyền thống; thường xuyên biểu diễn trong các chương trình và sự kiện lớn của EIU.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Võ Phạm Quỳnh Giao' }],
    email: 'soarersclub@gmail.com',
    facebookUrl: 'https://www.facebook.com/share/17X5PeLPtJ/?mibextid=wwXIfr',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-soarers.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-soarers.jpg',
  },
  {
    id: 'eiu-villains',
    code: 'VILLAINS',
    name: 'Câu lạc bộ The Villains',
    englishName: 'The Villains Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    slogan: 'Be the villain in their story if it means being the hero on your own',
    description:
      'Câu lạc bộ âm nhạc đại diện cho tinh thần sáng tạo và bứt phá của sinh viên EIU. Tổ chức các buổi biểu diễn âm nhạc từ khuôn viên thư viện đến các sân khấu lớn nhỏ trong và ngoài trường.',
    boardMembers: [
      { role: 'Đồng Chủ nhiệm', fullName: 'Nguyễn Duy Ân' },
      { role: 'Đồng Chủ nhiệm', fullName: 'Mai Khả Duy' },
    ],
    email: 'thevillainsofficialclub@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61558103787131',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-the-villains-club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-the-villains.jpg',
  },
  {
    id: 'eiu-helios',
    code: 'HELIOS',
    name: 'Câu lạc bộ Helios Cheer',
    englishName: 'Helios Cheer Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    slogan: 'Cống hiến – Trân trọng – Sát cánh – Lan tỏa',
    description:
      'Quy tụ sinh viên đam mê nhảy múa, cổ động và biểu diễn sân khấu; xây dựng môi trường năng động để rèn luyện kỹ năng, thể hiện cá tính và lan tỏa năng lượng tích cực đến cộng đồng.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Đinh Thị Lan Thanh' }],
    email: 'helioscheerclub@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61584896382651',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/04/logo-Helios-Cheer-Club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/04/clb-Helios-Cheer-Club.jpg',
  },
  {
    id: 'eiu-nauzzy',
    code: 'NAUZZY',
    name: 'Câu lạc bộ NAUZZY Dance',
    englishName: 'NAUZZY Dance Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'CLB nhảy đa dạng thể loại gồm K-pop Cover Dance, Hip-hop, Choreography, Jazz, Contemporary và Waacking. Chào đón cả thành viên có kinh nghiệm lẫn người mới bắt đầu cùng luyện tập và biểu diễn tại các sự kiện, cuộc thi.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Nguyễn Thanh Thảo' }],
    email: 'nauzzydanceclb2026@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61590389983134',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/07/logo-nauzzy-club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/07/hinh-anh-nauzzy-dance-club.jpg',
  },
  {
    id: 'eiu-korean',
    code: 'KOREAN',
    name: 'Câu lạc bộ Văn hóa Hàn Quốc EIU',
    englishName: 'EIU Korean Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'Không gian giao lưu ngôn ngữ, văn hóa và nghệ thuật Hàn Quốc dành cho sinh viên EIU yêu thích hội nhập đa văn hóa.',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-eiu-korean-club.png',
  },
  {
    id: 'eiu-kurume',
    code: 'KURUME',
    name: 'Câu lạc bộ Kurume',
    englishName: 'Kurume Club',
    group: 'NGHE_THUAT',
    isHsvAffiliated: false,
    description:
      'Câu lạc bộ giao lưu văn hóa và nghệ thuật Nhật Bản tại EIU (thông tin Ban Chủ nhiệm đang được cập nhật trên Cổng thông tin EIU).',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-kurume-club.png',
  },

  // --- NHÓM THỂ THAO ---
  {
    id: 'eiu-pingpong',
    code: 'PINGPONG',
    name: 'Câu lạc bộ Bóng bàn EIU',
    englishName: 'EIU Ping-Pong Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    description:
      'Mái nhà chung của cán bộ, giảng viên và sinh viên đam mê môn bóng bàn tại EIU; tạo môi trường rèn luyện thể chất lành mạnh, thường xuyên giao lưu và thi đấu cho mọi trình độ.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Phan Văn Vinh' }],
    email: 'vinh.phan@eiu.edu.vn',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61565431033674',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-bong-ban.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-bong-ban-rotated.jpg',
  },
  {
    id: 'eiu-firelions',
    code: 'FIRELIONS',
    name: 'Câu lạc bộ Bóng rổ FIRELIONS',
    englishName: 'FIRELIONS Basketball Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    slogan: 'Chơi hết mình – Gắn kết hết sức',
    description:
      'CLB Bóng rổ quy tụ sinh viên yêu thích thể thao, rèn luyện sức khỏe, kỹ năng làm việc nhóm và tinh thần thi đấu; thường xuyên tập luyện, giao lưu nội bộ và tranh tài tại các giải đấu cấp trường, liên trường.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Phạm Chi Na' },
      { role: 'Quản lý CLB', fullName: 'Trần Thị Ngọc Hà' },
    ],
    facebookUrl: 'https://www.facebook.com/EIUFireLions',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-bong-ro.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-bong-ro.jpg',
  },
  {
    id: 'eiu-ace',
    code: 'ACE',
    name: 'Câu lạc bộ Bóng chuyền ACE',
    englishName: 'ACE Volleyball Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    slogan: 'WE PLAY. WE TRUST. WE ACE.',
    description:
      'Nơi dành cho sinh viên yêu thích bóng chuyền, vận động và kết nối; chào đón mọi trình độ cùng tập luyện, học hỏi và thi đấu trong tập thể đoàn kết, nhiệt huyết.',
    boardMembers: [
      { role: 'Chủ nhiệm', fullName: 'Lê Chí Minh' },
      { role: 'Quản lý CLB', fullName: 'Võ Tường Vy' },
    ],
    email: 'eiu.ace.club@gmail.com',
    facebookUrl: 'https://www.facebook.com/share/1CiFppsbGA/?mibextid=wwXIfr',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/10/logo-clb-bong-chuyen-1.png',
    photoUrl:
      'https://eiu.edu.vn/wp-content/uploads/2026/10/1WUpukqa9IWh741Iy7tKrmSOvaoW1xJfP6yhiHr1R8DimPmcsDkRZ3TSAIOPzsbDOaq.jpg',
  },
  {
    id: 'eiu-badminton',
    code: 'BADMINTON',
    name: 'Câu lạc bộ Cầu lông EIU',
    englishName: 'EIU Badminton Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    description:
      'Sân chơi rèn luyện thể lực và giao lưu bộ môn cầu lông tại Khu Liên hợp Thể thao EIU (thông tin Ban Chủ nhiệm đang được cập nhật trên Cổng thông tin EIU).',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-cau-long.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-cau-long.jpg',
  },
  {
    id: 'eiu-football',
    code: 'FOOTBALL',
    name: 'Câu lạc bộ Bóng đá EIU',
    englishName: 'EIU Football Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    description:
      'CLB thể thao tập hợp sinh viên đam mê bóng đá, tổ chức tập luyện định kỳ và tham dự Hội thao EIU UniGames cùng các giải bóng đá sinh viên khu vực.',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-football-club.png',
  },
  {
    id: 'eiu-calisthenics',
    code: 'CALISTHENICS',
    name: 'Câu lạc bộ Calisthenics EIU',
    englishName: 'EIU Calisthenics Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    description:
      'Cộng đồng tập luyện thể lực trọng lượng cơ thể (Street Workout / Calisthenics), khuyến khích lối sống khỏe và chinh phục chuẩn "Sinh viên khỏe".',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-calisthenics-club.png',
  },
  {
    id: 'eiu-taekwondo',
    code: 'TAEKWONDO',
    name: 'Câu lạc bộ Taekwondo EIU',
    englishName: 'EIU Taekwondo Club',
    group: 'THE_THAO',
    isHsvAffiliated: false,
    description:
      'Môi trường rèn luyện võ thuật, kỷ luật, sức bền và tinh thần thượng võ dành cho sinh viên EIU yêu thích bộ môn Taekwondo.',
    boardMembers: [],
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2026/06/logo-taekwondo-club.png',
  },

  // --- NHÓM CỘNG ĐỒNG ---
  {
    id: 'eiu-hospitality',
    code: 'HOSPITALITY',
    name: 'Câu lạc bộ Hospitality',
    englishName: 'Hospitality Club',
    group: 'CONG_DONG',
    isHsvAffiliated: false,
    description:
      'Cộng đồng năng động tại EIU quy tụ sinh viên đam mê lĩnh vực du lịch và khách sạn, phát triển dựa trên nền tảng tích cực, bền vững và cởi mở để cùng học hỏi và lan tỏa cảm hứng nghề nghiệp.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Lê Trần Bảo Trân' }],
    email: 'hospitalityclub2025@gmail.com',
    facebookUrl: 'https://m.facebook.com/bbshospitalityclub/',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-hopitality.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-hopitality.jpg',
  },
  {
    id: 'eiu-sunshine',
    code: 'SUNSHINE',
    name: 'Câu lạc bộ Sunshine (Nhà Nắng)',
    englishName: 'Sunshine Club',
    group: 'CONG_DONG',
    isHsvAffiliated: false,
    slogan: "WE'RE NOT MEAN, WE'RE SHINE",
    description:
      'Môi trường sáng tạo cho sinh viên đam mê truyền thông, tổ chức sự kiện, viết lách, sản xuất video ngắn và nhiếp ảnh. Thường xuyên hỗ trợ sự kiện trường, sản xuất ấn phẩm truyền thông và tổ chức workshop tập huấn cùng chuyên gia.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Trần Thị Tuyết Nhi' }],
    email: 'sunshineclub283@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61565507374096',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-clb-sunshine.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-sunshine.jpg',
  },
  {
    id: 'eiu-first-aid',
    code: 'FIRST-AID',
    name: 'Câu lạc bộ Sơ Cấp Cứu Ban Đầu (First Aid)',
    englishName: 'First Aid Club',
    group: 'CONG_DONG',
    isHsvAffiliated: false,
    description:
      'Tập thể gồm giảng viên và sinh viên cùng học hỏi, thực hành kiến thức và kỹ năng sơ cấp cứu ban đầu, góp phần xây dựng cộng đồng học đường và xã hội an toàn, nhân ái.',
    boardMembers: [{ role: 'Chủ nhiệm', fullName: 'Hà Thị Kim Phụng' }],
    email: 'Firstaidclub.eiu@gmail.com',
    facebookUrl: 'https://www.facebook.com/profile.php?id=61565017873986',
    logoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/logo-first-aid-club.png',
    photoUrl: 'https://eiu.edu.vn/wp-content/uploads/2025/08/clb-first-aid.jpg',
  },
];
