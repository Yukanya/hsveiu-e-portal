'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DeterministicQrCode } from '@/components/shared/deterministic-qr';
import { IssuedCertificateRecord } from '@/types';

export function CertificatePreviewPhuLuc2({
  cert,
}: {
  cert: IssuedCertificateRecord;
}) {
  const [day = '--', month = '--', year = '----'] = (cert.decisionDate || '').split('/');

  return (
    <section
      aria-label={`Bản xem trước Giấy chứng nhận ${cert.certCode}`}
      className="bg-white border-2 border-[#133F68] p-5 sm:p-10 max-w-4xl mx-auto shadow-xs space-y-6"
    >
      {/* Header Quốc hiệu và Cụm Logo chuẩn Phụ lục 2 Quyết định 28/QĐ-HSV */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start border-b border-slate-200 pb-6 text-center">
        <div className="sm:col-span-5 space-y-1">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Image
              src="/images/eiu-logo-full.png"
              alt="Trường Đại học Quốc tế Miền Đông"
              width={40}
              height={40}
              style={{ width: 'auto' }}
              className="h-10 w-auto object-contain"
            />
            <Image
              src="/images/hsv-logo.png"
              alt="Hội Sinh viên Việt Nam"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          </div>
          {cert.headerMode === 'DOAN_HOI' ? (
            <>
              <div className="text-[11px] font-medium uppercase text-slate-800">
                ĐOÀN TNCS HỒ CHÍ MINH – HỘI SINH VIÊN VIỆT NAM
              </div>
              <div className="text-[11px] font-bold uppercase text-[#133F68]">
                TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] font-medium uppercase text-slate-800">
                HỘI SINH VIÊN VIỆT NAM
              </div>
              <div className="text-[11px] font-bold uppercase text-[#133F68]">
                BCH TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </div>
            </>
          )}
          <div className="text-[11px] font-bold text-slate-900">***</div>
        </div>

        <div className="sm:col-span-7 space-y-1">
          <div className="text-xs font-bold uppercase text-slate-900">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          <div className="text-xs font-bold text-slate-900 underline underline-offset-4">
            Độc lập – Tự do – Hạnh phúc
          </div>
          <div className="pt-2 text-[11px] font-eiu-serif text-slate-500">
            Số thứ tự:{' '}
            <strong className="text-[#133F68]">
              #{String(cert.certSerialNumber).padStart(2, '0')}
            </strong>{' '}
            • Mã xác thực: <strong className="text-[#133F68]">{cert.certCode}</strong>
          </div>
        </div>
      </div>

      {/* Thân Giấy chứng nhận */}
      <div className="text-center space-y-3 py-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
          BAN CHẤP HÀNH HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#C10230] font-eiu-display">
          GIẤY CHỨNG NHẬN
        </h3>

        <div className="pt-2 space-y-1">
          <div className="text-lg sm:text-xl font-bold text-[#133F68] font-eiu-display">
            {cert.fullName}
          </div>
          <div className="text-xs font-eiu-serif text-slate-700">
            Mã số sinh viên: <strong>{cert.studentId}</strong> • Đơn vị:{' '}
            <strong className="font-sans">{cert.unitName}</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 max-w-prose mx-auto leading-relaxed pt-2">
          Đã hoàn thành nhiệm vụ với vai trò{' '}
          <strong className="text-[#133F68]">{cert.roleTitle}</strong> trong
          chương trình <strong>&ldquo;{cert.eventTitle}&rdquo;</strong> – được
          công nhận quy đổi{' '}
          <strong className="font-eiu-serif text-[#C10230]">
            +{cert.volunteerDays.toFixed(1)} ngày tình nguyện
          </strong>{' '}
          theo Quyết định số{' '}
          <strong className="font-eiu-serif">{cert.decisionNumber}</strong>.
        </p>
      </div>

      {/* Footer Giấy chứng nhận: Mã QR 2×2cm xác định theo mã GCN bên trái + Chữ "(Đã ký)" bên phải */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-end pt-6 border-t border-slate-200 text-xs">
        <div className="sm:col-span-5 flex items-center gap-3.5">
          <Link
            href={`/van-ban?doc=${encodeURIComponent(cert.decisionNumber)}`}
            title={`Mở Quyết định gốc ${cert.decisionNumber}`}
            className="w-20 h-20 border-2 border-[#133F68] p-1 flex items-center justify-center bg-white shrink-0 hover:border-[#0054A6]"
          >
            <DeterministicQrCode
              value={`${cert.certCode}|${cert.decisionNumber}|${cert.studentId}`}
              size={68}
              label={`Mã QR xác thực ${cert.certCode}`}
            />
          </Link>
          <div className="space-y-1 text-[11px] text-slate-700 font-eiu-serif">
            <div className="font-bold text-[#133F68]">Số: {cert.certCode}</div>
            <div>Kèm theo: {cert.decisionNumber}</div>
            <Link
              href={`/van-ban?doc=${encodeURIComponent(cert.decisionNumber)}`}
              className="text-[#0054A6] font-sans font-bold hover:underline block"
            >
              Xem Quyết định gốc →
            </Link>
          </div>
        </div>

        <div className="sm:col-span-7 text-center sm:text-right space-y-1.5">
          <div className="italic text-slate-700">
            Thành phố Hồ Chí Minh, ngày {day} tháng {month} năm {year}
          </div>
          <div className="font-bold uppercase text-slate-900 font-eiu-display">
            TM. BAN THƯ KÝ HỘI SINH VIÊN TRƯỜNG
          </div>
          <div className="font-bold uppercase text-slate-900 font-eiu-display">
            CHỦ TỊCH
          </div>
          <div className="py-2 font-bold italic text-[#C10230]">(Đã ký)</div>
          <div className="font-bold text-sm text-[#133F68] font-eiu-display">
            {cert.signerName}
          </div>
        </div>
      </div>
    </section>
  );
}
