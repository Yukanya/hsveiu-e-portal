'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { decodeEiuEmail } from '@/data/mock-data';
import {
  ChevronDown,
  Globe,
  GraduationCap,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';

export function PersonaSwitcherBar() {
  const {
    currentPersona,
    activePosition,
    setPersonaById,
    setActivePositionById,
    allPersonas,
  } = useRole();
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);
  const emailInfo = decodeEiuEmail(currentPersona.email);

  return (
    <div className="bg-[#133F68] text-white border-b border-white/10 text-xs relative z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-10 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Chuẩn Top Utility Menu của https://eiu.edu.vn/ */}
        <nav
          aria-label="Phân luồng đối tượng sử dụng"
          className="flex items-center gap-1 sm:gap-3 font-eiu-display tracking-wide"
        >
          <Link
            href="/"
            className={`px-2 py-1 rounded transition-colors font-medium ${
              pathname === '/' ||
              (!pathname.startsWith('/portal') && !pathname.startsWith('/workspace'))
                ? 'text-[#FCB900] font-semibold'
                : 'text-white/90 hover:text-[#DED1BE]'
            }`}
          >
            CỔNG THÔNG TIN
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link
            href="/portal"
            className={`px-2 py-1 rounded transition-colors font-medium ${
              pathname.startsWith('/portal')
                ? 'text-[#FCB900] font-semibold'
                : 'text-white/90 hover:text-[#DED1BE]'
            }`}
          >
            SINH VIÊN &amp; HỘI VIÊN
          </Link>
          <span className="text-white/30" aria-hidden="true">
            |
          </span>
          <Link
            href="/workspace"
            className={`px-2 py-1 rounded transition-colors font-medium ${
              pathname.startsWith('/workspace')
                ? 'text-[#FCB900] font-semibold'
                : 'text-white/90 hover:text-[#DED1BE]'
            }`}
          >
            CÁN BỘ HỘI (E-OFFICE)
          </Link>
          <span className="hidden md:inline text-white/30" aria-hidden="true">
            |
          </span>
          <Link
            href="/tra-cuu-gcn"
            className="hidden md:inline px-2 py-1 rounded text-white/90 hover:text-[#DED1BE] transition-colors font-medium"
          >
            TRA CỨU E-CERTIFICATE
          </Link>
        </nav>

        {/* Right: Nút mở Bảng chuyển đổi Vai trò & Kiêm nhiệm gọn gàng theo Apple HIG */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenDrawer(!openDrawer)}
            aria-expanded={openDrawer}
            aria-controls="persona-switcher-panel"
            className="inline-flex items-center gap-2 px-3 py-1.5 min-h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#FCB900] shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              <strong>{currentPersona.fullName}</strong> • {activePosition.positionTitle}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#A68556] text-white font-mono text-[11px] font-bold">
              Cấp {activePosition.roleLevel}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                openDrawer ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Khay chuyển đổi Nhân sự & Vị trí Kiêm nhiệm (chỉ mở khi người dùng bấm) */}
      {openDrawer && (
        <div
          id="persona-switcher-panel"
          role="region"
          aria-label="Bộ chuyển đổi tài khoản thử nghiệm và chức vụ kiêm nhiệm"
          className="bg-[#0D2E4D] border-t border-white/15 shadow-xl"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#DED1BE]">
                <ShieldCheck className="w-4 h-4 text-[#FCB900]" />
                <span>
                  <strong>Chế độ Kiểm thử Phân quyền 6 Cấp &amp; Kiêm nhiệm:</strong> Chọn tài khoản và chức vụ để xem giao diện thay đổi theo thời gian thực.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpenDrawer(false)}
                aria-label="Đóng bảng chọn vai trò"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Chọn 1 trong 10 nhân sự */}
              <div className="md:col-span-5">
                <label
                  htmlFor="select-demo-persona"
                  className="block text-xs font-semibold text-[#DED1BE] mb-1.5"
                >
                  1. Chọn Nhân sự / Tài khoản (@eiu.edu.vn):
                </label>
                <select
                  id="select-demo-persona"
                  value={currentPersona.id}
                  onChange={(e) => setPersonaById(e.target.value)}
                  className="w-full min-h-10 rounded-lg bg-[#133F68] border border-white/25 px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#FCB900]"
                >
                  {allPersonas.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#133F68] text-white">
                      {p.fullName} — {p.bchRole !== 'Không' ? p.bchRole : p.internalDeptRole}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn vị trí kiêm nhiệm */}
              <div className="md:col-span-5">
                <label
                  htmlFor="select-active-position"
                  className="block text-xs font-semibold text-[#DED1BE] mb-1.5"
                >
                  2. Chuyển đổi Chức vụ Kiêm nhiệm ({currentPersona.positions.length} vị trí):
                </label>
                <div className="relative">
                  <select
                    id="select-active-position"
                    value={activePosition.id}
                    onChange={(e) => setActivePositionById(e.target.value)}
                    className="w-full min-h-10 rounded-lg bg-[#133F68] border border-[#A68556] px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-[#FCB900]"
                  >
                    {currentPersona.positions.map((pos) => (
                      <option
                        key={pos.id}
                        value={pos.id}
                        className="bg-[#133F68] text-white"
                      >
                        [Cấp {pos.roleLevel}/6] {pos.positionTitle} — {pos.unitName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lối tắt chuyển khu vực */}
              <div className="md:col-span-2 flex items-center gap-2">
                <Link
                  href="/portal"
                  onClick={() => setOpenDrawer(false)}
                  className="flex-1 min-h-10 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#FCB900]" />
                  Portal
                </Link>
                <Link
                  href="/workspace"
                  onClick={() => setOpenDrawer(false)}
                  className="flex-1 min-h-10 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#A68556] hover:bg-[#8f7146] text-white text-xs font-semibold"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  E-Office
                </Link>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/80">
              <div>
                Email định danh:{' '}
                <code className="font-mono text-[#FCB900]">{currentPersona.email}</code> •
                Nhận diện tự động:{' '}
                <strong className="text-white">{emailInfo.facultyName}</strong>
                {emailInfo.cohortYear ? ` (Khóa 20${emailInfo.cohortYear})` : ''}
              </div>
              <div className="flex items-center gap-1.5 text-[#DED1BE]">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đơn vị đang tác nghiệp: {activePosition.unitName}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
