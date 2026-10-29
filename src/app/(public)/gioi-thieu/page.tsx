'use client';

import React, { useState } from 'react';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { FACULTY_METADATA, STAFF_MEMBERS } from '@/data/mock-data';
import { StaffMember } from '@/types';
import { X } from 'lucide-react';

type OrgTabId =
  | 'btk'
  | 'bch'
  | 'bkt'
  | 'vp'
  | 'tcxdh'
  | 'tgpt'
  | 'chart';

const ORG_TABS: { id: OrgTabId; label: string; title: string }[] = [
  {
    id: 'btk',
    label: 'Ban Thư ký',
    title: 'BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG (05 ĐỒNG CHÍ)',
  },
  {
    id: 'bch',
    label: 'Ban Chấp hành',
    title: 'BAN CHẤP HÀNH HỘI SINH VIÊN TRƯỜNG KHÓA II (15 ĐỒNG CHÍ)',
  },
  {
    id: 'bkt',
    label: 'Ban Kiểm tra',
    title: 'BAN KIỂM TRA HỘI SINH VIÊN TRƯỜNG (05 ĐỒNG CHÍ)',
  },
  {
    id: 'vp',
    label: 'Văn phòng Hội (206.B06)',
    title: 'VĂN PHÒNG HỘI SINH VIÊN TRƯỜNG (PHÒNG 206.B06)',
  },
  {
    id: 'tcxdh',
    label: 'Ban Tổ chức & Xây dựng Hội',
    title: 'BAN TỔ CHỨC VÀ XÂY DỰNG HỘI',
  },
  {
    id: 'tgpt',
    label: 'Ban Tuyên giáo - Phong trào',
    title: 'BAN TUYÊN GIÁO - PHONG TRÀO & ĐỘI CTV XUNG KÍCH',
  },
  {
    id: 'chart',
    label: 'Sơ đồ Tổ chức 3 Cấp',
    title: 'SƠ ĐỒ CƠ CẤU TỔ CHỨC BỘ MÁY HỘI SINH VIÊN TRƯỜNG KHÓA II',
  },
];

export default function GioiThieuPage() {
  const [activeTab, setActiveTab] = useState<OrgTabId>('btk');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const currentTabMeta =
    ORG_TABS.find((t) => t.id === activeTab) || ORG_TABS[0];

  const getFilteredMembers = (): StaffMember[] => {
    switch (activeTab) {
      case 'btk':
        return STAFF_MEMBERS.filter((m) => m.isBtkMember);
      case 'bch':
        return STAFF_MEMBERS.filter((m) => m.bchRole !== 'Không');
      case 'bkt':
        return STAFF_MEMBERS.filter((m) => m.bktRole !== 'Không');
      case 'vp':
        return STAFF_MEMBERS.filter((m) => m.internalDeptCode === 'VP-HSV');
      case 'tcxdh':
        return STAFF_MEMBERS.filter(
          (m) =>
            m.internalDeptCode === 'BAN-TCXDH' ||
            m.internalDeptRole.includes('Tổ chức và Xây dựng Hội')
        );
      case 'tgpt':
        return STAFF_MEMBERS.filter(
          (m) =>
            m.internalDeptCode === 'BAN-TGPT' ||
            m.internalDeptRole.includes('Tuyên giáo - Phong trào')
        );
      default:
        return STAFF_MEMBERS;
    }
  };

  const filteredMembers = getFilteredMembers();

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Đội ngũ Cán bộ & Cơ cấu Tổ chức"
        subtitle="Ban Chấp hành Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông Khóa II, nhiệm kỳ 2026 – 2028"
        breadcrumbs={[
          { label: 'Khám phá', href: '/gioi-thieu' },
          { label: 'Đội ngũ HSV EIU' },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (3/12): Menu dọc Đỏ #C10230 / Vàng kem #EAE3D2 giống hệt trang "Đội ngũ EIU" */}
          <aside
            aria-label="Danh mục Ban và Bộ phận"
            className="lg:col-span-3 flex flex-col divide-y divide-white border border-slate-200/80"
          >
            {ORG_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`w-full text-left px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#C10230] text-white font-bold'
                      : 'bg-[#EAE3D2] text-slate-900 hover:bg-[#dfd5be]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </aside>

          {/* CỘT PHẢI (9/12): Tiêu đề IN HOA #133F68 + Lưới thẻ 3 cột vuông vức */}
          <div className="lg:col-span-9 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display">
              {currentTabMeta.title}
            </h2>

            {activeTab !== 'chart' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredMembers.map((member) => {
                  const initials = member.fullName
                    .split(' ')
                    .slice(-2)
                    .map((n) => n[0])
                    .join('');
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedStaff(member)}
                      className="bg-white border border-slate-200/80 hover:border-[#133F68] transition-all text-center flex flex-col cursor-pointer group"
                    >
                      {/* Khung ảnh chân dung chuẩn tỷ lệ 4:4 của trang Hội đồng trường EIU */}
                      <div className="aspect-square w-full bg-gradient-to-b from-[#133F68] to-[#0D2E4D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        <img
                          src="/images/hsv-logo.png"
                          alt=""
                          className="w-8 h-8 object-contain absolute top-3 right-3 opacity-80"
                        />
                        <div className="w-24 h-24 rounded-full bg-white/15 border-2 border-[#A68556] flex items-center justify-center text-2xl font-bold text-white font-eiu-display group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <span className="mt-3 text-[11px] font-mono text-[#DED1BE]">
                          {member.studentId !== '-'
                            ? `MSSV: ${member.studentId}`
                            : 'Chuyên viên CTSV'}
                        </span>
                      </div>

                      {/* Phần tên & chức vụ căn giữa giống hệt mẫu "SV Trương Châu Phước Lộc" trên eiu.edu.vn */}
                      <div className="p-4 flex-1 flex flex-col justify-start space-y-1">
                        <div className="text-sm font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors">
                          Đ/c {member.fullName}
                        </div>

                        {member.bchRole !== 'Không' && (
                          <div className="text-xs text-slate-800 font-medium">
                            {member.bchRole} Hội Sinh viên Trường
                          </div>
                        )}

                        {member.bktRole !== 'Không' && (
                          <div className="text-xs text-slate-700">
                            {member.bktRole}
                          </div>
                        )}

                        <div className="text-xs text-slate-600 leading-snug">
                          {member.internalDeptRole}
                        </div>

                        {member.grassrootsRole !== 'Không' && (
                          <div className="text-[11px] text-slate-500 pt-0.5">
                            {member.grassrootsRole}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Sơ đồ Tổ chức 3 Cấp trình bày theo chuẩn Bảng Thanh ngang #133F68 của eiu.edu.vn */
              <div className="space-y-6">
                {/* CẤP 01 */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-sm font-bold">
                    CẤP 01 — CẤP LÃNH ĐẠO, CHỈ ĐẠO &amp; GIÁM SÁT TOÀN TRƯỜNG
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        Ban Chấp hành (15 đ/c):
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        05 đ/c Ban Thư ký (01 Chủ tịch, 01 PCT Thường trực, 01 PCT kiêm Trưởng BKT, 02 UV BTK) và 10 đ/c Ủy viên BCH.
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        Thường trực Hội Sinh viên:
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Đ/c Trương Châu Phước Lộc (Chủ tịch), Đ/c Nguyễn Như Quỳnh (PCT Thường trực), Đ/c Trần Thị Thu Huyền (PCT).
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        Ban Kiểm tra (05 đ/c):
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Trưởng ban: Đ/c Trần Thị Thu Huyền • Phó ban: Đ/c Đặng Trí Toàn • 03 Ủy viên: Đ/c Nguyễn Thị Thúy Nhi, Đ/c Trần Nguyễn Quỳnh Trân, Đ/c Lê Thị Hải Yến.
                      </div>
                    </div>
                  </div>
                </div>

                {/* CẤP 02 */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-sm font-bold">
                    CẤP 02 — VĂN PHÒNG &amp; CÁC BAN CHUYÊN MÔN (03 ĐƠN VỊ)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        01. Văn phòng HSV (206.B06):
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Chánh Văn phòng (Đối ngoại): Đ/c Nguyễn Mỹ Hạnh • Tổng Thư ký (Nội bộ): Đ/c Nguyễn Như Quỳnh • 02 Phó CVP: Đ/c Phạm Thị Hồng Ngọc, Đ/c Lê Thị Hải Yến • Cán bộ VP: Đ/c Lương Gia Hân, Đ/c Đào Văn Thanh.
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        02. Ban Tổ chức &amp; Xây dựng Hội:
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Trưởng ban: Đ/c Trần Thị Thu Huyền • 04 Cụm trưởng Khoa: QTKD (Trịnh Thị Phương Thủy), KT (Nguyễn Thanh Nhã), CNTT (Trần Nguyễn Quỳnh Trân), KHSK (Phạm Thị Thanh Thủy) • Phó ban Quản lý CLB/Đội/Nhóm: Đ/c Nguyễn Mỹ Hạnh.
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        03. Ban Tuyên giáo – Phong trào:
                      </div>
                      <div className="sm:col-span-8 text-slate-700 space-y-1">
                        <p>
                          <strong>Mảng Tuyên giáo:</strong> Trưởng mảng Đ/c Đặng Trí Toàn; 02 Phó ban (Võ Chí Kiên, Liêu Gia Kỳ); 03 Tiểu ban (Design, Video, Photo).
                        </p>
                        <p>
                          <strong>Mảng Phong trào:</strong> Trưởng mảng Đ/c Nguyễn Mai Gia Tường; 02 Phó ban (Nguyễn Thị Thúy Nhi, Nguyễn Thanh Đạt); 03 Tiểu ban (Tài chính, Nội dung – Kịch bản, MC) + <strong>Đội CTV Xung kích</strong> quản lý 02 Tiểu ban (Hậu cần – Sân khấu; Lễ tân – Khánh tiết – Văn thể mỹ).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CẤP 03 */}
                <div className="bg-white border border-slate-200">
                  <div className="bg-[#133F68] text-white px-4 py-2.5 text-sm font-bold">
                    CẤP 03 — HỆ THỐNG CƠ SỞ HỘI TRỰC THUỘC (25 CHI HỘI &amp; 30 CLB – ĐỘI – NHÓM)
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        Cấp 03A — 25 Chi hội:
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Cụm Khoa QTKD (06 Chi hội) • Cụm Khoa Kỹ thuật (06 Chi hội) • Cụm Khoa CNTT (07 Chi hội) • Cụm Khoa Khoa học Sức khỏe (06 Chi hội).
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 p-3.5 gap-2">
                      <div className="sm:col-span-4 font-bold text-slate-900">
                        Cấp 03B — 30 CLB / Đội / Nhóm:
                      </div>
                      <div className="sm:col-span-8 text-slate-700">
                        Khối Học thuật (06) • Khối Nghệ thuật (10) • Khối Thể thao (07) • Khối Cộng đồng &amp; Tình nguyện (07, gồm CLB SV5T và Đội CTV Xung kích).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Hồ sơ Cán bộ */}
      {selectedStaff && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"
        >
          <div className="bg-white max-w-lg w-full border border-slate-300 shadow-2xl">
            <div className="bg-[#133F68] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="text-sm font-bold font-eiu-display">
                Thông tin Cán bộ Hội — Đ/c {selectedStaff.fullName}
              </span>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                aria-label="Đóng"
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">Họ và tên:</div>
                <div className="col-span-8 font-semibold text-[#133F68]">
                  {selectedStaff.fullName}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">MSSV / Email:</div>
                <div className="col-span-8 font-mono text-slate-700">
                  {selectedStaff.studentId} • {selectedStaff.email}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">Khoa / Ngành:</div>
                <div className="col-span-8 text-slate-700">
                  {FACULTY_METADATA[selectedStaff.facultyCode].nameVi} — {selectedStaff.majorName}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">Chức vụ BCH/BKT:</div>
                <div className="col-span-8 text-slate-700">
                  {selectedStaff.bchRole !== 'Không' ? selectedStaff.bchRole : 'Không'}
                  {selectedStaff.bktRole !== 'Không' ? ` • ${selectedStaff.bktRole}` : ''}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">Ban Chuyên môn:</div>
                <div className="col-span-8 text-slate-700">
                  {selectedStaff.internalDeptRole}
                </div>
              </div>
              <div className="grid grid-cols-12 p-3.5">
                <div className="col-span-4 font-bold text-slate-800">Cơ sở Hội:</div>
                <div className="col-span-8 text-slate-700">
                  {selectedStaff.grassrootsRole}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
