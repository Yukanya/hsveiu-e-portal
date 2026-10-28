'use client';

import React, { useState } from 'react';
import { EVENT_ITEMS } from '@/data/mock-data';
import { useRole } from '@/context/role-context';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  Leaf,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function PublicEventsPage() {
  const { currentPersona } = useRole();
  const [registeredIds, setRegisteredIds] = useState<string[]>(['evt-02']);
  const [selectedRoleMultiplier, setSelectedRoleMultiplier] = useState<Record<string, number>>({});

  const toggleRegister = (eventId: string) => {
    setRegisteredIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="bg-[#0B2545] text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>Quản lý Sự kiện, Đăng ký 1-Click & Quy đổi Ngày Tình nguyện (QĐ 28/QĐ-HSV)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Lịch Sự Kiện & Bảng Quy Đổi Ngày Tình Nguyện Tự Động
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Tự động đồng bộ kết quả tham gia vào Sổ tay Kỹ thuật số "Sinh viên 5 Tốt" và xuất danh
            sách đề nghị cấp Giấy chứng nhận điện tử theo thứ tự tăng dần MSSV.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Bảng tóm tắt Hệ số quy đổi theo Phụ lục 2 QĐ 09/QĐ-HSV & Điều 4 QĐ 28/QĐ-HSV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B2545]">
            <Info className="w-4 h-4 text-[#0054A6]" />
            <span>
              Quy tắc Quy đổi Ngày Tình nguyện (Phụ lục 2, QĐ 09/QĐ-HSV & Điều 4, QĐ 28/QĐ-HSV)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F0F7FF] border border-sky-200">
              <p className="font-bold text-[#0054A6]">1. Quy tắc 03 ngày trước sự kiện</p>
              <p className="text-slate-600 mt-1">
                Đơn vị tổ chức phải xin ý kiến Ban Thư ký (qua Trưởng Ban TC-XDH) ít nhất{' '}
                <strong>03 ngày</strong> trước khi tổ chức để được duyệt quy đổi ngày tình nguyện.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900">2. Hệ số Công tác Đoàn – Hội</p>
              <p className="text-slate-600 mt-1">
                • Trưởng/Phó Ban, Đội hình: <strong>Hệ số 3 (×3)</strong>
                <br />• Thành viên BTC: <strong>Hệ số 2 (×2)</strong>
                <br />• CTV / Chiến sĩ tham gia: <strong>Hệ số 1 (×1)</strong>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200">
              <p className="font-bold text-rose-800">3. Hiến máu Tình nguyện (Lĩnh vực 04)</p>
              <p className="text-slate-600 mt-1">
                Mỗi lần tham gia hiến máu tình nguyện được quy đổi ngay{' '}
                <strong>5.0 ngày tình nguyện</strong> (đủ chuẩn số ngày Tình nguyện tốt cả năm).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <p className="font-bold text-emerald-800">4. Cam kết SLA 07 ngày làm việc</p>
              <p className="text-slate-600 mt-1">
                Sau khi nộp danh sách hợp lệ cuối cùng (xếp tăng dần theo MSSV), HSV Trường ban hành
                Quyết định công nhận trong tối đa <strong>07 ngày làm việc</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sự kiện */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {EVENT_ITEMS.map((evt) => {
            const isRegistered = registeredIds.includes(evt.id);
            const mult = selectedRoleMultiplier[evt.id] || 1;
            const calculatedDays =
              evt.organizerCode === 'CLB-BLOOD'
                ? evt.baseVolunteerDays
                : evt.baseVolunteerDays * mult;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#F0F7FF] text-[#0054A6] border border-sky-200">
                      SV5T: {evt.sv5tCriterion}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {evt.isGreenEvent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Leaf className="w-3 h-3" />
                          Sự kiện Xanh EIU
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Định mức gốc: {evt.baseVolunteerDays} ngày
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#0B2545]">{evt.title}</h2>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p>
                      • Đơn vị đề nghị: <strong className="text-slate-900">{evt.organizerUnit}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {evt.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(evt.startTime).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-[#0054A6] font-medium">
                      • Nhóm quy đổi: {evt.volunteerCategory}
                    </p>
                  </div>

                  {/* Chọn vai trò để thử tính hệ số 1-2-3 */}
                  {evt.organizerCode !== 'CLB-BLOOD' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <label className="block font-semibold text-slate-700">
                        Mô phỏng vai trò tham gia (Tự động nhân hệ số Phụ lục 2):
                      </label>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <select
                          value={mult}
                          onChange={(e) =>
                            setSelectedRoleMultiplier({
                              ...selectedRoleMultiplier,
                              [evt.id]: Number(e.target.value),
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
                        >
                          <option value={1}>CTV hỗ trợ / Chiến sĩ tham gia (Hệ số 1)</option>
                          <option value={2}>Thành viên Ban Tổ chức (Hệ số 2)</option>
                          <option value={3}>Trưởng / Phó Ban, Đội hình BTC (Hệ số 3)</option>
                        </select>
                        <span className="font-mono font-bold text-[#0054A6]">
                          = Nhận {calculatedDays.toFixed(1)} ngày TN
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Đăng ký với tư cách:{' '}
                    <strong className="text-slate-800">{currentPersona.fullName}</strong> (
                    <code className="font-mono">{currentPersona.studentId}</code>)
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRegister(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0054A6] hover:bg-[#004282] text-white'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Đã Đăng ký (Vé QR sẵn sàng)
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Đăng ký 1-Click
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
