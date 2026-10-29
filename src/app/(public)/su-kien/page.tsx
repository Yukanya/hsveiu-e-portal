'use client';

import React, { useState } from 'react';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { EVENT_ITEMS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';

export default function SuKienPage() {
  const { currentPersona } = useRole();
  const [selectedEventId, setSelectedEventId] = useState(EVENT_ITEMS[0].id);
  const [roleMultiplier, setRoleMultiplier] = useState<1 | 2 | 3>(1);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const selectedEvent =
    EVENT_ITEMS.find((e) => e.id === selectedEventId) || EVENT_ITEMS[0];

  const handleRegister = (id: string) => {
    if (!registeredIds.includes(id)) {
      setRegisteredIds([...registeredIds, id]);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title="Đăng ký Sự kiện & Hoạt động Tình nguyện"
        breadcrumbs={[{ label: 'Sự kiện & Tình nguyện' }]}
      />

      {/* Bố cục chuẩn trang "Đặt phòng học" trên lib.eiu.edu.vn */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (8/12): Bảng thanh ngang #133F68 */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hộp chi tiết sự kiện đang chọn */}
            <div className="bg-white border border-slate-200">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
                <span className="text-xs font-bold text-slate-800">
                  Trạng thái:{' '}
                  <strong className="text-[#C10230]">ĐANG MỞ ĐĂNG KÝ</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRegister(selectedEvent.id)}
                    className="px-4 py-1.5 bg-[#0D6EFD] hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    {registeredIds.includes(selectedEvent.id)
                      ? 'Đã đăng ký'
                      : 'Lưu đăng ký'}
                  </button>
                </div>
              </div>

              <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                Thông tin chương trình
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Chọn chương trình:
                  </div>
                  <div className="col-span-8">
                    <select
                      aria-label="Chọn sự kiện"
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-300 rounded text-xs font-semibold text-[#133F68] bg-white"
                    >
                      {EVENT_ITEMS.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Đơn vị tổ chức:
                  </div>
                  <div className="col-span-8 text-slate-800">
                    {selectedEvent.organizerUnit}
                  </div>
                </div>
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Địa điểm:
                  </div>
                  <div className="col-span-8 text-slate-800">
                    {selectedEvent.location}
                  </div>
                </div>
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Thời gian:
                  </div>
                  <div className="col-span-8 font-mono text-slate-800">
                    {new Date(selectedEvent.startTime).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Tiêu chuẩn SV5T:
                  </div>
                  <div className="col-span-8 font-semibold text-[#0054A6]">
                    {selectedEvent.sv5tCriterion} ({selectedEvent.volunteerCategory})
                  </div>
                </div>
              </div>

              <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                Vai trò tham gia &amp; Quy đổi Ngày tình nguyện (Phụ lục 2 QĐ 09/QĐ-HSV)
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="grid grid-cols-12 p-3.5 items-center">
                  <div className="col-span-4 font-bold text-slate-900">
                    Vai trò đăng ký:
                  </div>
                  <div className="col-span-8">
                    <select
                      aria-label="Chọn vai trò tham gia"
                      value={roleMultiplier}
                      onChange={(e) =>
                        setRoleMultiplier(Number(e.target.value) as 1 | 2 | 3)
                      }
                      className="w-full sm:w-80 h-9 px-3 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                    >
                      <option value={1}>
                        Hội viên / Sinh viên tham gia (Hệ số ×1)
                      </option>
                      <option value={2}>
                        Cộng tác viên / Đội CTV Xung kích (Hệ số ×2)
                      </option>
                      <option value={3}>
                        Thành viên Ban Tổ chức (Hệ số ×3)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-12 p-3.5">
                  <div className="col-span-4 font-bold text-slate-900">
                    Số ngày được cộng:
                  </div>
                  <div className="col-span-8 font-mono font-bold text-[#C10230]">
                    +{(selectedEvent.baseVolunteerDays * roleMultiplier).toFixed(1)} ngày tình nguyện
                  </div>
                </div>
              </div>

              <div className="bg-[#133F68] text-white px-4 py-2.5 text-xs font-bold">
                Người đăng ký : ({selectedEvent.registeredCount}/{selectedEvent.maxParticipants})
              </div>
              <div className="p-4 grid grid-cols-12 items-center text-xs">
                <div className="col-span-4 font-bold text-slate-900">
                  Hội viên:
                </div>
                <div className="col-span-8">
                  <div className="font-bold text-slate-900">
                    {currentPersona.fullName}
                  </div>
                  <div className="font-mono text-slate-500">
                    {currentPersona.studentId}
                  </div>
                  <div className="text-slate-500">{currentPersona.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4/12): Khối Đỏ Đô #C10230 giống hệt "Thông tin đặt phòng" */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[#C10230] text-white p-7">
              <div className="w-8 h-0.5 bg-white mb-3" aria-hidden="true" />
              <h2 className="text-lg font-bold leading-snug font-eiu-display">
                Thông tin đăng ký
              </h2>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Danh sách tham gia được xuất chuẩn Phụ lục 1 (sắp xếp tăng dần theo MSSV) và cấp E-Certificate trong 07 ngày làm việc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
