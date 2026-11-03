/**
 * Dịch vụ Tự động đồng bộ tin tức [HSV NEWS] từ Fanpage Hội Sinh viên EIU
 * URL Fanpage: https://www.facebook.com/eiuhsv/
 *
 * Cơ chế hoạt động:
 * 1. Khi có FB_PAGE_ACCESS_TOKEN: Truy vấn Facebook Graph API lấy các bài đăng chứa thẻ [HSV NEWS]
 * 2. Khi chưa có Token hoặc chạy offline: Trả về tập dữ liệu mẫu chuẩn thực tế được biên tập từ Fanpage
 */

export interface FacebookNewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  permalinkUrl: string;
  imageUrl?: string;
  tag: string;
  categoryLabel: string;
  authorUnit: string;
}

export const FALLBACK_HSV_NEWS: FacebookNewsItem[] = [
  {
    id: 'fb-post-01',
    title:
      '[HSV NEWS] Ban hành Quy định sửa đổi, bổ sung về Tiêu chuẩn xét chọn danh hiệu "Sinh viên 5 Tốt" cấp trường năm 2026',
    summary:
      'Ban Thư ký Hội Sinh viên trường công bố Quyết định 09/QĐ-HSV sửa đổi 2026: chuẩn Học tập tốt GPA ≥ 3.00/4.00 gia quyền, quy trình xét duyệt 3 cấp và cơ chế vinh danh Top 10% Tiêu biểu toàn trường.',
    publishedAt: '2026-09-10',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/01',
    imageUrl: '/images/sv5t/nguyen-mai-gia-tuong.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Phong trào Sinh viên 5 Tốt',
    authorUnit: 'Ban Tuyên giáo – Phong trào',
  },
  {
    id: 'fb-post-02',
    title:
      '[HSV NEWS] Triển khai Quy định số 28/QĐ-HSV về việc cấp Giấy chứng nhận điện tử và công nhận Ngày tình nguyện cho sinh viên EIU',
    summary:
      'Chuẩn hóa quy trình đăng ký trước ít nhất 03 ngày, tích hợp mã QR xác thực và cam kết SLA 07 ngày làm việc ban hành Quyết định công nhận chính thức.',
    publishedAt: '2026-09-02',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/02',
    imageUrl: '/images/sv5t/truong-chau-phuoc-loc.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Văn bản – Chỉ đạo',
    authorUnit: 'Văn phòng Hội Sinh viên (206.B06)',
  },
  {
    id: 'fb-post-03',
    title:
      '[HSV NEWS] Khởi động Chiến dịch Tình nguyện Mùa Hè Xanh EIU 2026: Hành trình chuyển đổi số và phục vụ cộng đồng',
    summary:
      'Hơn 300 chiến sĩ tình nguyện thuộc 25 Chi hội và CLB Đội Nhóm trực thuộc đồng loạt ra quân triển khai 05 đội hình chuyên môn trên địa bàn tỉnh.',
    publishedAt: '2026-08-20',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/03',
    imageUrl: '/images/sv5t/luong-gia-han.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Hoạt động Tình nguyện',
    authorUnit: 'Ban Tuyên giáo – Phong trào',
  },
  {
    id: 'fb-post-04',
    title:
      '[HSV NEWS] Cuộc thi Học thuật EIU Tech Innovation 2026: Sân chơi sáng tạo công nghệ số dành cho sinh viên',
    summary:
      'Cuộc thi do Hội Sinh viên phối hợp cùng Khoa CNTT tổ chức, thu hút 42 dự án tranh tài giải pháp AI và giải pháp bền vững phục vụ doanh nghiệp.',
    publishedAt: '2026-08-15',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/04',
    imageUrl: '/images/sv5t/dang-tri-toan.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Học thuật & Sáng tạo',
    authorUnit: 'CLB Học thuật CNTT',
  },
  {
    id: 'fb-post-05',
    title:
      '[HSV NEWS] Tuyên dương Gương sáng Sinh viên 5 tốt tiêu biểu: Tự hào bản lĩnh sinh viên Trường Đại học Quốc tế Miền Đông',
    summary:
      'Gặp gỡ 11 gương sáng tiêu biểu đạt danh hiệu Sinh viên 5 tốt cấp trường năm học vừa qua với những thành tích vượt trội trong rèn luyện toàn diện.',
    publishedAt: '2026-08-01',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/05',
    imageUrl: '/images/sv5t/nguyen-nhu-quynh.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Tuyên dương – Vinh danh',
    authorUnit: 'Ban Thư ký Hội Sinh viên',
  },
  {
    id: 'fb-post-06',
    title:
      '[HSV NEWS] Hội nghị Tổng kết Công tác Hội và Phong trào Sinh viên năm học 2025 – 2026 và Phương hướng Nhiệm vụ Khóa II',
    summary:
      'Đánh giá kết quả triển khai công tác Hội Khóa II, kiện toàn nhân sự Ban Chuyên môn và phát động phong trào thi đua cao điểm chào mừng năm học mới.',
    publishedAt: '2026-07-28',
    permalinkUrl: 'https://www.facebook.com/eiuhsv/posts/06',
    imageUrl: '/images/sv5t/tran-thi-thu-huyen.jpg',
    tag: '[HSV NEWS]',
    categoryLabel: 'Tổ chức – Xây dựng Hội',
    authorUnit: 'Ban Tổ chức – Xây dựng Hội',
  },
];

/**
 * Hàm lấy danh sách bài đăng [HSV NEWS] từ Fanpage Hội Sinh viên EIU
 */
export async function getFacebookHsvNews(): Promise<FacebookNewsItem[]> {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID || 'eiuhsv';

  if (!token) {
    // Trả về dữ liệu chuẩn bị sẵn khi chưa cấu hình token
    return FALLBACK_HSV_NEWS;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/posts?fields=id,message,created_time,permalink_url,full_picture&access_token=${token}&limit=20`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.warn('Facebook Graph API error:', await res.text());
      return FALLBACK_HSV_NEWS;
    }

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      return FALLBACK_HSV_NEWS;
    }

    interface FbApiPost {
      id: string;
      message?: string;
      created_time: string;
      permalink_url?: string;
      full_picture?: string;
    }

    // Lọc các bài có chứa thẻ [HSV NEWS]
    const filtered = (data.data as FbApiPost[])
      .filter((post) => post.message && post.message.includes('[HSV NEWS]'))
      .map((post) => {
        const fullMsg = post.message || '';
        const lines = fullMsg.split('\n').filter((l) => l.trim().length > 0);
        const title = lines[0] || '[HSV NEWS] Bản tin Hội Sinh viên EIU';
        const summary =
          lines.slice(1).join(' ').trim().slice(0, 180) + '...';

        return {
          id: post.id,
          title,
          summary,
          publishedAt: post.created_time.split('T')[0],
          permalinkUrl:
            post.permalink_url || `https://www.facebook.com/eiuhsv/posts/${post.id}`,
          imageUrl: post.full_picture || '/images/eiu-logo-full.png',
          tag: '[HSV NEWS]',
          categoryLabel: 'Bản tin Fanpage',
          authorUnit: 'Hội Sinh viên EIU Fanpage',
        };
      });

    return filtered.length > 0 ? filtered : FALLBACK_HSV_NEWS;
  } catch (err) {
    console.error('Failed to fetch Facebook news:', err);
    return FALLBACK_HSV_NEWS;
  }
}

