## UI Layout & Visual Standards (Trang chủ, Tin tức, Sự kiện)

Khi chỉnh sửa hoặc mở rộng giao diện công khai (`src/app/(public)/page.tsx`, `tin-tuc`, `su-kien`) và dữ liệu liên quan, bắt buộc tuân thủ các quy chuẩn sau:

1. **Banner Tiêu Điểm & Feathered Scrim Gradient (`/tin-tuc`):**
   - Dùng **Feathered Scrim Gradient** màu thương hiệu Navy `#02294E` với 8 điểm dừng ease-out từ `0%` đến `52%` trên desktop (`linear-gradient(90deg, #02294E 0%, rgba(2, 41, 78, 0.96) 12%, rgba(2, 41, 78, 0.88) 22%, rgba(2, 41, 78, 0.72) 30%, rgba(2, 41, 78, 0.48) 38%, rgba(2, 41, 78, 0.22) 44%, rgba(2, 41, 78, 0.06) 48%, rgba(2, 41, 78, 0) 52%, transparent 100%)`). Tuyệt đối không tạo vệt cắt thẳng (`w-1/3`) hoặc gradient gắt che quá sâu sang nửa phải ảnh.
   - Trên mobile (`< sm`), dùng gradient dọc `180deg` (`rgba(2, 41, 78, 0.96)` → `0.85` → `0.45`).
   - Thanh điều hướng slide đáy dùng nền kính mờ `bg-[#02294E]/75 backdrop-blur-xs border-t border-white/15`, hiển thị bộ đếm `01 / 03`, thanh tiến độ `eiu-progress-active` (`5000ms`), và nút tròn `<` / `>` (`w-9 h-9 active:scale-90 hover:scale-105`).

2. **Thẻ Tin Tức Lưới 3x3 (`/tin-tuc`, tối đa 9 tin/trang):**
   - Header ảnh thật cao `h-44`, phủ gradient dọc `#02294E` (`0.94` ở đáy → `0.48` ở `55%` → `rgba(19, 63, 104, 0.35)` ở đỉnh) kết hợp hoa văn `eiu-arch-pattern opacity-25`.
   - Cố định chiều cao baseline thân thẻ để đều hàng: Tiêu đề `min-h-[44px]` (`line-clamp-2`), Tóm tắt `min-h-[63px]` (`line-clamp-3`).
   - Khi thêm domain ảnh ngoài vào `NEWS_POSTS` (`imageUrl`), bắt buộc khai báo hostname trong `images.remotePatterns` của `next.config.ts` trước khi dùng `next/image`.

3. **Trang Sự Kiện (`/su-kien`, tối đa 12 sự kiện/trang):**
   - **Hero SubpageBanner:** Tiêu đề `LỊCH SỰ KIỆN VÀ HOẠT ĐỘNG`, mô tả `Tổng hợp tất cả các sự kiện sinh viên dành cho Sinh viên trường Đại học Quốc tế Miền Đông.`
   - **Không hiển thị** lại phần Quy trình 05 Bước cấp GCN, nhãn `Duyệt >= 3 ngày`, tag `Sự kiện Xanh SDGs`, hoặc tên đơn vị tổ chức trên thẻ sự kiện.
   - **07 Tag Trạng thái chuẩn:**
     - `Chưa mở đăng ký` (`bg-slate-600 text-white`)
     - `Đang mở đăng ký` (`bg-[#51803A] text-white`)
     - `Còn 5 ngày` (`bg-[#FCB900] text-[#02294E]`)
     - `Còn 2 ngày` (`bg-[#C10230] text-white`)
     - `Đã đóng đăng ký` (`bg-[#EEB31D] text-[#02294E]`)
     - `Đang diễn ra` (`bg-[#0054A6] text-white`)
     - `Đã kết thúc` (`bg-slate-700 text-slate-100`)
   - **Kích thước Tag Header (thu nhỏ 75%):** Tag trạng thái trái dùng `text-[8.5px] px-2 py-0.5`; cột 3 box phải (`Tiêu chuẩn`, `Ngày TN`, `ĐRL`) dùng `font-eiu-serif text-[9px] font-bold px-2 py-0.5`.
   - **Điểm rèn luyện (ĐRL):** Mọi chương trình có cộng điểm rèn luyện (`hasTrainingPoints: true`) **bắt buộc cố định mức `+1 ĐRL`** (`trainingPoints: 1`), không dùng mức +3/+5/+10.
   - **Typography thân thẻ:** Địa điểm (`MapPin`), Thời gian (`Clock`), Thanh tiến độ và Hạn đăng ký đều dùng **`font-sans`**, cỡ chữ & độ đậm đồng nhất (`text-xs font-normal` cho địa điểm và thời gian).
   - **Nhãn nút CTA chân thẻ:** Sự kiện mở đơn dùng `ĐĂNG KÝ NGAY`; sự kiện `Đã kết thúc` dùng `NHẬN GCN`.

4. **Tương Tác Click Trên Thẻ Sự Kiện (`/` và `/su-kien`):**
   - Bấm vào **toàn bộ vùng Header Banner (`h-36`)**, **Tiêu đề `<h3>`**, hoặc **Nút chân thẻ** đều phải mở được luồng đăng ký / xem chi tiết:
     - Trên `/su-kien`: Gọi `openEventModal(ev)` (gắn `role="button"`, `tabIndex={0}`, `cursor-pointer hover:brightness-110` trên header và `pointer-events-none` trên wrapper tag để không cản click).
     - Trên Trang chủ (`/`): Bọc `<Link href={/su-kien?event=${encodeURIComponent(ev.id)}}>` cho cả vùng header `h-36` và text tiêu đề `<h3>`.

5. **Phân Trang & Chuyển Động Chuẩn (Shared Pagination & Motion):**
   - Phân trang căn giữa đồng bộ (`Trước`, các số trang `w-10 h-10` với trang active `#C10230`, `Sau`) và cuộn mượt lên `gridTopRef` (`scrollIntoView({ behavior: 'smooth', block: 'start' })`).
   - Dùng các class chuyển động chuẩn trong `src/app/globals.css` (`eiu-fade-slide-in`, `eiu-card-entrance`, `eiu-progress-active`) kèm `motion-reduce:*`.
