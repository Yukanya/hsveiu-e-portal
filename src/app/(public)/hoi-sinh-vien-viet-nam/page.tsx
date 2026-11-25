'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SubpageBanner } from '@/components/public/subpage-banner';
import {
  HSV_HCM_ARCHIVE_PHOTO,
  HSV_HCM_MODERN_MOVEMENTS,
  HSV_HCM_STRUGGLE_CHAPTERS,
  HSV_VN_AWARDS,
  HSV_VN_CHARTER_CHAPTERS,
  HSV_VN_CONGRESS_ERAS,
  HSV_VN_EMBLEM_CALLOUTS,
  HSV_VN_GENERAL,
  HSV_VN_JANUARY_9,
  HSV_VN_SONG_STANZAS,
} from '@/data/about-data';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Flame,
  Landmark,
  MapPin,
  Medal,
  Music,
  Quote,
  Scale,
  ScrollText,
  Users,
} from 'lucide-react';

export default function HoiSinhVienVietNamPage() {
  const [activeEraId, setActiveEraId] =
    useState<(typeof HSV_VN_CONGRESS_ERAS)[number]['id']>('khang-chien');
  const [activeChapterId, setActiveChapterId] = useState<string>(
    HSV_VN_CHARTER_CHAPTERS[0].id
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const markImageFailed = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  const activeEra =
    HSV_VN_CONGRESS_ERAS.find((e) => e.id === activeEraId) ||
    HSV_VN_CONGRESS_ERAS[0];

  const activeChapterIndex = HSV_VN_CHARTER_CHAPTERS.findIndex(
    (c) => c.id === activeChapterId
  );
  const activeChapter =
    HSV_VN_CHARTER_CHAPTERS[activeChapterIndex] || HSV_VN_CHARTER_CHAPTERS[0];

  const handlePrevChapter = () => {
    const prevIdx = Math.max(0, activeChapterIndex - 1);
    setActiveChapterId(HSV_VN_CHARTER_CHAPTERS[prevIdx].id);
  };

  const handleNextChapter = () => {
    const nextIdx = Math.min(
      HSV_VN_CHARTER_CHAPTERS.length - 1,
      activeChapterIndex + 1
    );
    setActiveChapterId(HSV_VN_CHARTER_CHAPTERS[nextIdx].id);
  };

  return (
    <div className="bg-white min-h-screen">
      <SubpageBanner
        title="HỘI SINH VIÊN VIỆT NAM"
        subtitle="Tổ chức chính trị – xã hội của sinh viên Việt Nam, kế thừa ngọn lửa 09/01/1950 và đồng hành rèn luyện thế hệ sinh viên thời đại mới."
        breadcrumbs={[
          { label: 'Giới thiệu', href: '/gioi-thieu' },
          { label: 'Hội Sinh viên Việt Nam' },
        ]}
      />

      {/* =====================================================================
          CHƯƠNG MỞ MÀN (NỀN TRẮNG): TẠP CHÍ BIÊN NIÊN SỬ BẤT ĐỐI XỨNG
          Ảnh Đại hội XI + 4 Huân chương Nhà nước + Drop Cap & Lời Bác dạy
         ===================================================================== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Cột trái (7/12): Khung ảnh báo chí lớn Đại hội XI + Băng 04 Huân chương */}
            <div className="lg:col-span-7 space-y-6">
              <figure className="border border-slate-200 bg-[#02294E] overflow-hidden">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {!failedImages['hero-congress'] ? (
                    <Image
                      src={HSV_VN_GENERAL.heroImageUrl}
                      alt="Đại hội đại biểu toàn quốc lần thứ XI Hội Sinh viên Việt Nam (2023 – 2028)"
                      fill
                      loading="eager"
                      sizes="(max-width: 1024px) 100vw, 660px"
                      className="object-cover"
                      onError={() => markImageFailed('hero-congress')}
                    />
                  ) : (
                    <div className="w-full h-full eiu-arch-pattern bg-[#02294E] flex items-center justify-center">
                      <Image
                        src="/images/hsv-vn-logo.png"
                        alt="Biểu trưng Hội Sinh viên Việt Nam"
                        width={120}
                        height={120}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#02294E]/95 via-[#02294E]/55 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <p className="font-eiu-serif italic text-sm sm:text-base text-[#FCB900] leading-snug">
                      “{HSV_VN_GENERAL.congress11Slogan}”
                    </p>
                  </div>
                </div>
                <figcaption className="px-4 py-2.5 bg-[#F8FAFC] border-t border-slate-200 text-[11.5px] text-slate-600 font-sans">
                  {HSV_VN_GENERAL.heroImageCaption}
                </figcaption>
              </figure>

              {/* 04 Phần thưởng cao quý của Đảng và Nhà nước */}
              <div className="bg-[#FAF8F4] border border-[#E5DDD0] p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-[#133F68]">
                  <Medal className="w-4 h-4 text-[#C10230] shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-eiu-display">
                    Phần thưởng cao quý của Đảng và Nhà nước trao tặng
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HSV_VN_GENERAL.stateOrders.map((order) => (
                    <div
                      key={`${order.year}-${order.title}`}
                      className="bg-white border border-[#E5DDD0] border-t-2 border-t-[#A68556] p-3 space-y-1"
                    >
                      <div className="font-eiu-serif font-bold text-lg text-[#C10230] tabular-nums leading-none">
                        {order.year}
                      </div>
                      <div className="text-xs font-bold text-[#133F68] font-eiu-display leading-snug">
                        {order.title}
                      </div>
                      <div className="text-[11px] text-slate-600 font-sans leading-snug">
                        {order.occasion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải (5/12): Xã luận Drop Cap + Bảng thông số + Nguyên tắc */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#133F68] font-eiu-display leading-tight text-balance">
                  Ngọn cờ đoàn kết và khát vọng của Sinh viên Việt Nam
                </h2>
                <div className="w-14 h-1 bg-[#C10230]" aria-hidden="true" />
              </div>

              <p className="text-[14.5px] text-slate-700 leading-[1.78] font-sans first-letter:text-5xl first-letter:font-eiu-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5 first-letter:leading-[0.82] first-letter:text-[#C10230]">
                {HSV_VN_GENERAL.purpose}
              </p>

              {/* Bảng chỉ số quy mô toàn quốc hiện nay */}
              <div className="grid grid-cols-2 gap-px bg-slate-200 border border-slate-200">
                {HSV_VN_GENERAL.scaleFacts.map((fact) => (
                  <div key={fact.label} className="bg-white p-3.5 space-y-0.5">
                    <div className="font-eiu-serif font-bold text-xl text-[#0054A6] tabular-nums leading-tight">
                      {fact.value}
                    </div>
                    <div className="text-[11.5px] text-slate-600 font-sans leading-snug">
                      {fact.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 03 Nguyên tắc tổ chức (Điều 3) */}
              <div className="pt-2 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#A68556]" />
                  <span>03 Nguyên tắc tổ chức cốt lõi (Điều 3 Điều lệ)</span>
                </h3>
                <ul className="space-y-2 text-[13px] text-slate-700 font-sans leading-relaxed">
                  {HSV_VN_GENERAL.principles.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#51803A] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Trích dẫn lớn Lời Bác Hồ căn dặn "Sáu cái yêu" (1958) */}
          <blockquote className="bg-[#02294E] text-white eiu-arch-pattern border-t-3 border-t-[#FCB900] px-6 sm:px-10 py-7 sm:py-8">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start gap-5">
              <Quote className="w-9 h-9 text-[#FCB900] shrink-0 opacity-90" />
              <div className="space-y-2">
                <p className="font-eiu-serif italic text-xl sm:text-2xl text-white leading-relaxed">
                  “{HSV_VN_GENERAL.hoChiMinhQuote}”
                </p>
                <footer className="text-xs sm:text-[13px] text-[#DED1BE] font-sans">
                  – {HSV_VN_GENERAL.hoChiMinhQuoteSource}
                </footer>
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 2 (GIẤY NGÀ HỌC THUẬT #FAF8F4): NGỌN LỬA 09/01/1950
          Triển lãm ảnh tư liệu lịch sử 12/01/1950 & Anh hùng Trần Văn Ơn
         ===================================================================== */}
      <section className="bg-[#FAF8F4] border-b border-[#E5DDD0]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#133F68] font-eiu-display leading-snug text-balance">
                <span className="font-eiu-serif text-[#C10230] tabular-nums mr-2.5">
                  {HSV_VN_JANUARY_9.dateLabel}
                </span>
                – {HSV_VN_JANUARY_9.headline}
              </h2>
              <div className="w-14 h-1 bg-[#C10230]" aria-hidden="true" />
            </div>

            <div className="lg:col-span-4 lg:text-right">
              <div className="inline-block bg-white border border-[#E5DDD0] px-4 py-3 text-left">
                <div className="font-eiu-serif italic font-bold text-base text-[#133F68]">
                  {HSV_VN_JANUARY_9.quote}
                </div>
                <div className="text-[11px] text-slate-600 font-sans mt-1">
                  {HSV_VN_JANUARY_9.quoteAttribution}
                </div>
              </div>
            </div>
          </div>

          {/* Bố cục triển lãm tư liệu bất đối xứng 12 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Ảnh tư liệu lớn bên trái (7/12): Học sinh Pétrus Ký 12/01/1950 */}
            <figure className="lg:col-span-7 bg-white border border-[#DED1BE] p-3 space-y-2.5 shadow-2xs">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                {!failedImages['jan9-0'] ? (
                  <Image
                    src={HSV_VN_JANUARY_9.photos[0].url}
                    alt={HSV_VN_JANUARY_9.photos[0].caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-500 motion-reduce:transition-none"
                    onError={() => markImageFailed('jan9-0')}
                  />
                ) : (
                  <div className="w-full h-full eiu-arch-pattern bg-[#02294E]" />
                )}
              </div>
              <figcaption className="px-1 space-y-0.5">
                <p className="text-xs font-semibold text-[#133F68] font-sans leading-snug">
                  {HSV_VN_JANUARY_9.photos[0].caption}
                </p>
                <p className="text-[11px] font-eiu-serif italic text-slate-500">
                  {HSV_VN_JANUARY_9.photos[0].credit}
                </p>
              </figcaption>
            </figure>

            {/* Cột phải (5/12): Tự sự lịch sử + Ảnh lễ mít tinh Gia Long */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-[#DED1BE] p-5 sm:p-6 space-y-3.5 text-[13.5px] text-slate-700 leading-relaxed font-sans">
                <p className="font-semibold text-[#133F68]">
                  {HSV_VN_JANUARY_9.lead}
                </p>
                {HSV_VN_JANUARY_9.body.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HSV_VN_JANUARY_9.photos.slice(1).map((photo, idx) => (
                  <figure
                    key={photo.url}
                    className="bg-white border border-[#DED1BE] p-2 space-y-2"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                      {!failedImages[`jan9-${idx + 1}`] ? (
                        <Image
                          src={photo.url}
                          alt={photo.caption}
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className={`object-cover ${
                            photo.archival
                              ? 'grayscale contrast-105 hover:grayscale-0 transition-all duration-500 motion-reduce:transition-none'
                              : ''
                          }`}
                          onError={() => markImageFailed(`jan9-${idx + 1}`)}
                        />
                      ) : (
                        <div className="w-full h-full eiu-arch-pattern bg-[#02294E]" />
                      )}
                    </div>
                    <figcaption className="text-[11px] text-slate-600 font-sans leading-snug px-0.5">
                      {photo.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 3 (NỀN TRẮNG): BIÊN NIÊN SỬ 11 KỲ ĐẠI HỘI TOÀN QUỐC (1955 – 2028)
          Thanh chuyển 03 Chặng lịch sử dạng gạch chân học thuật (KHÔNG dùng pills)
         ===================================================================== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#133F68] font-eiu-display">
              Quá trình Thành lập và Phát triển qua 11 Kỳ Đại hội Toàn quốc
            </h2>
            <p className="text-[13.5px] text-slate-600 leading-relaxed font-sans">
              Hơn bảy thập kỷ trưởng thành từ Đại hội đại biểu toàn quốc lần thứ
              I năm 1955 tại Hà Nội đến Đại hội XI nhiệm kỳ 2023 – 2028, khẳng
              định vai trò lịch sử của sinh viên Việt Nam qua từng thời kỳ.
            </p>
          </div>

          {/* Thanh chuyển 03 Chặng kiến trúc gạch chân (không bo tròn pill) */}
          <div
            role="tablist"
            aria-label="Chọn chặng lịch sử phát triển Hội Sinh viên Việt Nam"
            className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 bg-[#F8FAFC] divide-y md:divide-y-0 md:divide-x divide-slate-200"
          >
            {HSV_VN_CONGRESS_ERAS.map((era) => {
              const selected = era.id === activeEra.id;
              return (
                <button
                  key={era.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveEraId(era.id)}
                  className={`p-4 sm:p-5 text-left transition-colors cursor-pointer relative ${
                    selected
                      ? 'bg-white text-[#133F68]'
                      : 'bg-[#F8FAFC] text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-eiu-serif font-bold text-base tabular-nums ${
                        selected ? 'text-[#C10230]' : 'text-[#8E6D3E]'
                      }`}
                    >
                      {era.period}
                    </span>
                    <span className="text-[11px] font-bold uppercase font-eiu-display text-slate-500">
                      {era.roman}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-bold font-eiu-display mt-1 leading-snug ${
                      selected ? 'text-[#133F68]' : 'text-slate-700'
                    }`}
                  >
                    {era.title}
                  </div>
                  {selected && (
                    <span
                      className="absolute bottom-0 inset-x-0 h-[3px] bg-[#C10230]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Chi tiết Chặng lịch sử: Cột ảnh bên trái (5/12) + Trục niên biểu bên phải (7/12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
              <figure className="border border-slate-200 bg-white overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-[#02294E]">
                  {!failedImages[`era-${activeEra.id}`] ? (
                    <Image
                      src={activeEra.imageUrl}
                      alt={activeEra.imageCaption}
                      fill
                      sizes="(max-width: 1024px) 100vw, 460px"
                      className={`object-cover ${
                        activeEra.id === 'khang-chien' ? 'grayscale' : ''
                      }`}
                      onError={() => markImageFailed(`era-${activeEra.id}`)}
                    />
                  ) : (
                    <div className="w-full h-full eiu-arch-pattern bg-[#02294E]" />
                  )}
                </div>
                <figcaption className="p-4 space-y-1.5 bg-[#FAF8F4] border-t border-slate-200">
                  <p className="text-xs text-[#133F68] font-medium leading-snug font-sans">
                    {activeEra.imageCaption}
                  </p>
                  <p className="text-[11px] font-eiu-serif italic text-slate-500">
                    {activeEra.imageCredit}
                  </p>
                </figcaption>
              </figure>

              <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                {activeEra.lead}
              </p>
            </div>

            <div className="lg:col-span-7 relative pl-6 sm:pl-8 space-y-5">
              {/* Trục dọc niên biểu mảnh tinh tế */}
              <div
                className="absolute left-2 sm:left-2.5 top-2 bottom-2 w-px bg-slate-300"
                aria-hidden="true"
              />

              {activeEra.congresses.map((cg) => (
                <article
                  key={cg.label}
                  className="relative bg-white border border-slate-200 hover:border-[#133F68] p-5 space-y-2.5 transition-colors"
                >
                  <span
                    className="absolute -left-[22px] sm:-left-[27px] top-6 w-3 h-3 bg-[#C10230] border-2 border-white ring-1 ring-[#C10230]"
                    aria-hidden="true"
                  />

                  <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-slate-100">
                    <h3 className="text-base font-bold text-[#133F68] font-eiu-display">
                      {cg.label}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 font-eiu-serif font-bold text-sm text-[#C10230] tabular-nums">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cg.date}</span>
                    </span>
                  </div>

                  <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                    {cg.highlight}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-sans">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A68556] shrink-0" />
                      <span>{cg.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#0054A6] shrink-0" />
                      <span>{cg.scale}</span>
                    </span>
                  </div>

                  <div className="text-xs font-medium text-[#133F68] font-sans">
                    {cg.leader}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 4 (NỀN NAVY SÂU #02294E): SINH VIÊN SÀI GÒN – GIA ĐỊNH
          VÀ HỘI SINH VIÊN VIỆT NAM THÀNH PHỐ HỒ CHÍ MINH
         ===================================================================== */}
      <section className="bg-[#02294E] text-white eiu-arch-pattern border-b-4 border-b-[#A68556]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-14 sm:py-16 space-y-12">
          {/* Tiêu đề phân cảnh */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-6 border-b border-white/15">
            <div className="lg:col-span-8 flex items-start gap-3">
              <Flame className="w-6 h-6 text-[#FCB900] shrink-0 mt-1" />
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white font-eiu-display leading-tight text-balance">
                Hội Sinh viên Việt Nam TP. Hồ Chí Minh: Từ khí phách Sài Gòn –
                Gia Định đến Cái nôi những Phong trào Toàn quốc
              </h2>
            </div>
            <p className="lg:col-span-4 text-[13px] text-[#DED1BE] leading-relaxed font-sans">
              Hội Sinh viên Việt Nam Trường Đại học Quốc tế Miền Đông tự hào là
              đơn vị trực thuộc Hội Sinh viên Việt Nam TP. Hồ Chí Minh – nơi
              khởi phát những trang sử hào hùng và nhiều phong trào lan tỏa cả
              nước.
            </p>
          </div>

          {/* Hồi 1: 1950 – 1975 Truyền thống đấu tranh Sinh viên Sài Gòn – Gia Định */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <figure className="lg:col-span-5 bg-[#133F68] border border-white/15 p-3 space-y-3">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                {!failedImages['hcm-archive'] ? (
                  <Image
                    src={HSV_HCM_ARCHIVE_PHOTO.url}
                    alt={HSV_HCM_ARCHIVE_PHOTO.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover grayscale contrast-110"
                    onError={() => markImageFailed('hcm-archive')}
                  />
                ) : (
                  <div className="w-full h-full bg-[#02294E]" />
                )}
              </div>
              <figcaption className="px-1 space-y-1">
                <p className="text-xs text-white/95 leading-snug font-sans">
                  {HSV_HCM_ARCHIVE_PHOTO.caption}
                </p>
                <p className="text-[11px] font-eiu-serif italic text-[#DED1BE]">
                  {HSV_HCM_ARCHIVE_PHOTO.credit}
                </p>
              </figcaption>
            </figure>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HSV_HCM_STRUGGLE_CHAPTERS.map((ch) => (
                <article
                  key={ch.year}
                  className="bg-[#133F68]/85 border border-white/15 p-5 space-y-2"
                >
                  <div className="font-eiu-serif font-bold text-lg text-[#FCB900] tabular-nums leading-none">
                    {ch.year}
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-bold text-white font-eiu-display leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-sans">
                    {ch.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Hồi 2: 1994 – 2028 Ba dấu ấn định hình phong trào sinh viên cả nước */}
          <div className="space-y-5 pt-4 border-t border-white/15">
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide text-[#FCB900] font-eiu-display">
              Hội Sinh viên Việt Nam TP. Hồ Chí Minh (1995 – 2028): Khởi nguồn
              những phong trào lớn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {HSV_HCM_MODERN_MOVEMENTS.map((mv, idx) => (
                <article
                  key={mv.title}
                  className="bg-[#133F68] border border-white/15 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#02294E] overflow-hidden">
                    {!failedImages[`hcm-mv-${idx}`] ? (
                      <Image
                        src={mv.imageUrl}
                        alt={mv.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                        onError={() => markImageFailed(`hcm-mv-${idx}`)}
                      />
                    ) : (
                      <div className="w-full h-full eiu-arch-pattern bg-[#02294E]" />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#02294E]/90 text-[#FCB900] font-eiu-serif font-bold text-xs tabular-nums">
                      {mv.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <h4 className="text-[15px] font-bold text-white font-eiu-display leading-snug">
                        {mv.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-white/90 leading-relaxed font-sans">
                        {mv.detail}
                      </p>
                    </div>
                    <div className="text-[11px] font-eiu-serif italic text-[#DED1BE] pt-2 border-t border-white/10">
                      Nguồn ảnh: {mv.imageCredit}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 5 (GIẤY NGÀ #FAF8F4): BIỂU TRƯNG CHÍNH THỨC VÀ
          PHÒNG CHIẾU VIDEO HD "BÀI CA SINH VIÊN" KÈM LỜI BÀI HÁT CHUẨN
         ===================================================================== */}
      <section className="bg-[#FAF8F4] border-b border-[#E5DDD0]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
          {/* 5A. Trưng bày & Giải mã Biểu trưng Hội Sinh viên Việt Nam */}
          <div className="bg-white border border-[#DED1BE] p-6 sm:p-8 space-y-7">
            <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#133F68] font-eiu-display">
                  Biểu trưng chính thức của Hội Sinh viên Việt Nam
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 font-sans">
                  Quy định tại Điều 1, Điều lệ Hội Sinh viên Việt Nam (sửa đổi,
                  bổ sung năm 2009).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-[#FAF8F4] border border-[#E5DDD0] p-8 space-y-4">
                {!failedImages['emblem-vn'] ? (
                  <Image
                    src="/images/hsv-vn-logo.png"
                    alt="Biểu trưng chính thức Hội Sinh viên Việt Nam"
                    width={220}
                    height={220}
                    className="w-52 h-52 object-contain"
                    onError={() => markImageFailed('emblem-vn')}
                  />
                ) : (
                  <Image
                    src="/images/hsv-logo.png"
                    alt="Biểu trưng Hội Sinh viên Việt Nam"
                    width={200}
                    height={200}
                    className="w-48 h-48 object-contain"
                  />
                )}
                <p className="text-xs text-center font-eiu-serif italic text-[#8E6D3E]">
                  Biểu trưng chuẩn – Nền xanh Cyan 100%, cánh chim bồ câu – ngọn
                  lửa và ngôi sao trắng
                </p>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HSV_VN_EMBLEM_CALLOUTS.map((part) => (
                  <div
                    key={part.label}
                    className="bg-[#F8FAFC] border border-slate-200 border-t-2 border-t-[#0054A6] p-4 space-y-1.5"
                  >
                    <h3 className="text-xs sm:text-[13.5px] font-bold text-[#133F68] font-eiu-display">
                      {part.label}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-sans">
                      {part.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5B. Phòng chiếu Video HD "Bài ca sinh viên" và Bảng lời bài hát chuẩn */}
          <div className="bg-[#02294E] text-white border border-[#133F68] overflow-hidden shadow-md">
            <div className="px-6 sm:px-8 py-5 bg-[#133F68] border-b-2 border-[#A68556] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-[#FCB900] shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white font-eiu-display">
                    Bài ca chính thức: {HSV_VN_GENERAL.songTitle}
                  </h2>
                  <p className="text-xs text-[#DED1BE] font-sans">
                    {HSV_VN_GENERAL.songAuthor}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Khung Video HTML5 16:9 bên trái (7/12) */}
              <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center bg-[#02294E]">
                <div className="relative w-full aspect-video bg-black border border-white/20 overflow-hidden shadow-lg">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={HSV_VN_GENERAL.hallImageUrl}
                    aria-label="Video Bài ca sinh viên – Hội ca chính thức Hội Sinh viên Việt Nam"
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src={HSV_VN_GENERAL.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ phát video HTML5.
                  </video>
                </div>
              </div>

              {/* Khung Lời bài hát chuẩn bên phải (5/12) */}
              <div className="lg:col-span-5 bg-[#FAF8F4] text-slate-900 p-6 sm:p-7 border-t lg:border-t-0 lg:border-l border-white/15 flex flex-col justify-between gap-5">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#DED1BE] pb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display">
                      Lời bài hát chuẩn
                    </h3>
                    <span className="text-xs font-eiu-serif italic text-[#8E6D3E]">
                      NS. Trần Hoàng Tiến
                    </span>
                  </div>

                  <div className="space-y-4">
                    {HSV_VN_SONG_STANZAS.map((stanza) => (
                      <div key={stanza.label} className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C10230] font-eiu-display">
                          {stanza.label}
                        </div>
                        <div className="font-eiu-serif italic text-[15.5px] sm:text-base text-[#133F68] leading-[1.65]">
                          {stanza.lines.map((line, i) => (
                            <p key={`${stanza.label}-${i}`}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 6 (NỀN TRẮNG): THƯ VIỆN ẢNH DANH HIỆU VÀ GIẢI THƯỞNG CAO QUÝ
         ===================================================================== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-[#133F68] font-eiu-display">
              Các Danh hiệu và Giải thưởng Cao quý của Hội
            </h2>
            <p className="text-[13.5px] text-slate-600 leading-relaxed font-sans">
              Những phần thưởng uy tín ghi nhận nỗ lực học tập, rèn luyện toàn
              diện và cống hiến sáng tạo của sinh viên, cán bộ Hội từ cấp Trường
              đến cấp Thành phố và Trung ương.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HSV_VN_AWARDS.map((award) => (
              <article
                key={award.id}
                className="bg-white border border-slate-200 overflow-hidden flex flex-col justify-between group"
                style={{ borderTopWidth: '3px', borderTopColor: award.accent }}
              >
                <div>
                  <figure className="relative aspect-[16/10] w-full bg-[#02294E] overflow-hidden">
                    {!failedImages[`award-${award.id}`] ? (
                      <Image
                        src={award.imageUrl}
                        alt={award.imageCaption}
                        fill
                        sizes="(max-width: 768px) 100vw, 540px"
                        className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03]"
                        onError={() => markImageFailed(`award-${award.id}`)}
                      />
                    ) : (
                      <div className="w-full h-full eiu-arch-pattern bg-[#02294E] flex items-center justify-center">
                        <Award className="w-10 h-10 text-[#FCB900]" />
                      </div>
                    )}
                    <div
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#02294E]/90 via-[#02294E]/45 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-3 left-4 right-4 text-white space-y-0.5">
                      <h3 className="text-base sm:text-lg font-bold font-eiu-display leading-snug">
                        {award.name}
                      </h3>
                      <div className="text-[11.5px] font-eiu-serif text-[#FCB900] font-semibold">
                        {award.sinceYear}
                      </div>
                    </div>
                  </figure>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#8E6D3E] font-eiu-display">
                      {award.level}
                    </div>
                    <p className="text-[13.5px] text-slate-700 leading-relaxed font-sans">
                      {award.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3.5 bg-[#F8FAFC] border-t border-slate-200 space-y-1.5 text-xs font-sans">
                  <div className="text-slate-700">
                    <strong className="text-[#133F68]">Trọng tâm xét chọn: </strong>
                    {award.criteriaHighlight}
                  </div>
                  <div className="text-[11px] font-eiu-serif italic text-slate-500">
                    {award.imageCaption}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN CẢNH 7 (GIẤY NGÀ #FAF8F4): SỔ TAY ĐIỀU LỆ HỘI (2 CỘT ĐỌC SÁCH)
         ===================================================================== */}
      <section className="bg-[#FAF8F4] border-b border-[#E5DDD0]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-7">
          <div className="flex items-center gap-2 text-[#133F68]">
            <ScrollText className="w-5 h-5 text-[#C10230]" />
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide font-eiu-display">
              Điều lệ Hội Sinh viên Việt Nam
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#DED1BE] bg-white shadow-2xs">
              {/* Cột trái (4/12): Mục lục 07 Chương */}
              <div
                role="tablist"
                aria-label="Mục lục 07 Chương Điều lệ Hội Sinh viên Việt Nam"
                className="lg:col-span-4 bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-[#DED1BE] divide-y divide-slate-200"
              >
                {HSV_VN_CHARTER_CHAPTERS.map((chapter) => {
                  const selected = chapter.id === activeChapter.id;
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveChapterId(chapter.id)}
                      className={`w-full px-5 py-4 text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                        selected
                          ? 'bg-[#133F68] text-white'
                          : 'bg-transparent text-slate-700 hover:bg-[#EAE3D2]/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div
                          className={`text-xs font-eiu-serif font-bold ${
                            selected ? 'text-[#FCB900]' : 'text-[#C10230]'
                          }`}
                        >
                          {chapter.chapterNumber}
                        </div>
                        <div className="text-[13px] font-bold font-eiu-display leading-snug">
                          {chapter.title}
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 mt-1 ${
                          selected ? 'text-[#FCB900]' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Cột phải (8/12): Trang đọc điều khoản */}
              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h3 className="text-lg sm:text-xl font-extrabold uppercase text-[#133F68] font-eiu-display">
                      <span className="font-eiu-serif text-[#C10230] mr-2">
                        {activeChapter.chapterNumber}:
                      </span>
                      {activeChapter.title}
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {activeChapter.articles.map((art) => (
                      <div
                        key={art.number}
                        className="pb-5 last:pb-0 border-b last:border-b-0 border-slate-100 space-y-2"
                      >
                        <h4 className="text-sm sm:text-[15px] font-bold text-[#133F68] font-eiu-display">
                          <span className="text-[#0054A6] mr-1.5">
                            {art.number}.
                          </span>
                          {art.title}
                        </h4>
                        <div className="space-y-2 text-[13.5px] sm:text-sm text-slate-700 leading-[1.75] font-sans">
                          {art.content.map((para, idx) => (
                            <p key={idx}>{para}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Điều hướng Chương trước / Chương tiếp theo */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={activeChapterIndex <= 0}
                    onClick={handlePrevChapter}
                    className="min-h-[42px] px-3.5 py-2 border border-slate-300 hover:border-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-xs font-bold uppercase tracking-wider text-[#133F68] font-eiu-display inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Chương trước</span>
                  </button>

                  <span className="text-xs font-eiu-serif text-slate-500 tabular-nums">
                    {activeChapterIndex + 1} / {HSV_VN_CHARTER_CHAPTERS.length}
                  </span>

                  <button
                    type="button"
                    disabled={
                      activeChapterIndex >= HSV_VN_CHARTER_CHAPTERS.length - 1
                    }
                    onClick={handleNextChapter}
                    className="min-h-[42px] px-3.5 py-2 bg-[#133F68] hover:bg-[#0054A6] disabled:opacity-35 disabled:pointer-events-none text-xs font-bold uppercase tracking-wider text-white font-eiu-display inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Chương tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* =====================================================================
          CHÂN TRANG KẾT NỐI: SANG HỘI SINH VIÊN EIU VÀ HỆ THỐNG CƠ SỞ HỘI
         ===================================================================== */}
      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 bg-[#133F68] text-[#FCB900] flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#133F68] font-eiu-display">
                Tiếp nối truyền thống tại Hội Sinh viên Trường Đại học Quốc tế
                Miền Đông
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 font-sans">
                Khám phá sứ mệnh, dấu ấn Đại hội II, sơ đồ bộ máy cấp trường và
                mạng lưới Chi hội, Câu lạc bộ trực thuộc.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/gioi-thieu?tab=hsv-eiu"
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Hội Sinh viên EIU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/to-chuc?tab=chi-hoi"
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 border border-[#133F68] text-[#133F68] hover:bg-[#133F68] hover:text-white text-xs font-bold uppercase tracking-wider font-eiu-display transition-colors"
            >
              <span>Chi hội và CLB – Đội – Nhóm</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
