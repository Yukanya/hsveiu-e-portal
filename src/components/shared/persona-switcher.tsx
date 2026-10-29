'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { ChevronDown, Search, X } from 'lucide-react';

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

  return (
    <div className="bg-[#133F68] text-white text-[11px] relative z-50">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 min-h-9 py-1.5 flex flex-wrap items-center justify-end gap-2 sm:gap-3 font-eiu-display">
        {/* Tên người dùng + MSSV giống hệt "TRƯƠNG CHÂU PHƯỚC LỘC (2331200066) v" trên lib.eiu.edu.vn */}
        <button
          type="button"
          onClick={() => setOpenDrawer(!openDrawer)}
          aria-expanded={openDrawer}
          aria-controls="persona-switcher-panel"
          className="inline-flex items-center gap-1.5 uppercase tracking-wide font-semibold text-white hover:text-[#FCB900] transition-colors cursor-pointer"
        >
          <span>
            {currentPersona.fullName}{' '}
            {currentPersona.studentId !== '-' ? `(${currentPersona.studentId})` : ''}
          </span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <span className="text-white/40" aria-hidden="true">
          |
        </span>

        <Link
          href="/portal"
          className={`uppercase tracking-wide transition-colors ${
            pathname.startsWith('/portal')
              ? 'text-[#FCB900] font-bold'
              : 'text-white/95 hover:text-[#DED1BE]'
          }`}
        >
          SINH VIÊN
        </Link>

        <span className="text-white/40" aria-hidden="true">
          |
        </span>

        <Link
          href="/workspace"
          className={`uppercase tracking-wide transition-colors ${
            pathname.startsWith('/workspace')
              ? 'text-[#FCB900] font-bold'
              : 'text-white/95 hover:text-[#DED1BE]'
          }`}
        >
          E-OFFICE
        </Link>

        <span className="text-white/40" aria-hidden="true">
          |
        </span>

        <Link
          href="/tra-cuu-gcn"
          className={`uppercase tracking-wide transition-colors ${
            pathname.startsWith('/tra-cuu-gcn')
              ? 'text-[#FCB900] font-bold'
              : 'text-white/95 hover:text-[#DED1BE]'
          }`}
        >
          TRA CỨU GCN
        </Link>

        <span className="hidden sm:inline text-white/40" aria-hidden="true">
          |
        </span>

        <Link
          href="/van-ban"
          className="hidden sm:inline uppercase tracking-wide text-white/95 hover:text-[#DED1BE] transition-colors"
        >
          VĂN BẢN
        </Link>

        <span className="hidden sm:inline text-white/40" aria-hidden="true">
          |
        </span>

        <Link
          href="/to-chuc"
          aria-label="Tìm kiếm đơn vị"
          className="hidden sm:inline-flex items-center text-white/90 hover:text-[#FCB900]"
        >
          <Search className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Khay chuyển đổi tài khoản & vị trí kiêm nhiệm (Góc vuông chuẩn EIU) */}
      {openDrawer && (
        <div
          id="persona-switcher-panel"
          role="region"
          aria-label="Chuyển đổi tài khoản và chức vụ kiêm nhiệm"
          className="bg-[#0D2E4D] border-t border-white/15 shadow-xl"
        >
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FCB900] font-eiu-display">
                Chuyển đổi Tài khoản &amp; Vai trò Kiêm nhiệm (Cấp {activePosition.roleLevel}/6)
              </span>
              <button
                type="button"
                onClick={() => setOpenDrawer(false)}
                aria-label="Đóng"
                className="p-1 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="select-demo-persona"
                  className="block text-xs text-[#DED1BE] mb-1"
                >
                  Tài khoản (@eiu.edu.vn):
                </label>
                <select
                  id="select-demo-persona"
                  value={currentPersona.id}
                  onChange={(e) => setPersonaById(e.target.value)}
                  className="w-full min-h-9 rounded bg-white text-slate-900 px-3 py-1.5 text-xs font-medium"
                >
                  {allPersonas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.studentId}) —{' '}
                      {p.bchRole !== 'Không' ? p.bchRole : p.internalDeptRole}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="select-active-position"
                  className="block text-xs text-[#DED1BE] mb-1"
                >
                  Chức vụ tác nghiệp ({currentPersona.positions.length} vị trí):
                </label>
                <select
                  id="select-active-position"
                  value={activePosition.id}
                  onChange={(e) => setActivePositionById(e.target.value)}
                  className="w-full min-h-9 rounded bg-white text-slate-900 px-3 py-1.5 text-xs font-semibold"
                >
                  {currentPersona.positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      [Cấp {pos.roleLevel}] {pos.positionTitle} — {pos.unitName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
