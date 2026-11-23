import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, Clock, Sparkles } from 'lucide-react';

export default function ServiceCard({ service, customTitle, customImage, customLink }) {
  const { lang, t } = useLanguage();

  const title = customTitle || (lang === 'gu' ? service.nameGu : service.name);
  const image = customImage || service.image;
  const linkTo = customLink || `/join?service=${service?.id || 'svc-1'}`;

  return (
    <Link 
      to={linkTo}
      className="group relative block rounded-2xl overflow-hidden bg-[#FFF9F5] border border-[#E8C6C2]/60 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden">
        {/* Background Photography with smooth hover zoom */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Subtle Warm Rose Tinted Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2522]/90 via-[#3D2522]/35 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

        {/* Top Service Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold bg-[#FFF9F5]/90 backdrop-blur-sm text-[#9B6B64] rounded-full border border-[#E8C6C2]">
            {service?.category || 'VELORA'}
          </span>
        </div>

        {/* Corner Indicator Arrow in soft rose circle */}
        <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#FFF9F5]/80 backdrop-blur-sm border border-[#E8C6C2] flex items-center justify-center text-[#9B6B64] group-hover:bg-[#C58B83] group-hover:text-[#FFF9F5] transition-all">
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-left flex flex-col justify-end">
          <h3 className="text-[#FFF9F5] text-base sm:text-lg font-serif tracking-wider uppercase drop-shadow-sm group-hover:text-[#F8E9E7] transition-colors leading-snug">
            {title}
          </h3>

          {/* Pricing & Duration Chips */}
          <div className="mt-2.5 flex items-center gap-2 text-[#FFF9F5]/90 text-xs tracking-wider">
            {service?.duration && (
              <span className="flex items-center gap-1 bg-[#3D2522]/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20 text-[11px]">
                <Clock className="w-3 h-3 text-[#E8C6C2]" /> {service.duration} {t('min')}
              </span>
            )}
            {service?.price && (
              <span className="bg-[#C58B83] text-[#FFF9F5] font-semibold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
                ₹{service.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
