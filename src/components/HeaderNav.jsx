import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { Scissors, UserCheck, Tv, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HeaderNav() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { tokens, activeCustomerTokenId } = useQueue();
  const location = useLocation();

  const waitingCount = tokens.filter(t => t.status === 'waiting').length;

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/join', label: t('joinQueue') },
    { path: '/reception', label: t('reception'), icon: UserCheck },
    { path: '/display', label: t('wallTv'), icon: Tv },
    { path: '/admin', label: t('admin'), icon: ShieldCheck },
  ];

  return (
    <div className="sticky top-0 z-40 w-full transition-colors duration-200">
      
      {/* Top Rose Announcement Strip (from Reference Image 1) */}
      <div className="bg-[#E8C6C2] text-[#5E3B36] text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide border-b border-[#DCAFA9]/50 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#9B6B64]" />
        <span>
          {lang === 'gu' 
            ? 'નવા ગ્રાહકો માટે ખાસ ઓફર: પ્રથમ મુલાકાત પર ૨૦% છૂટ.' 
            : 'New Client Offer: Enjoy 20% off your first visit.'}
        </span>
        <Link to="/join" className="underline font-semibold hover:text-[#3D2522] inline-flex items-center gap-0.5 ml-1">
          {lang === 'gu' ? 'હમણાં જોડાઓ' : 'Book Now'} &rarr;
        </Link>
      </div>

      {/* Main Navbar */}
      <header className="w-full border-b border-[#E8C6C2]/40 bg-[#FFF9F5]/95 backdrop-blur-md shadow-[0_2px_15px_-3px_rgba(155,107,100,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 lg:gap-8">
            
            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex flex-col items-start justify-center flex-shrink-0 group py-1">
              <span className="font-serif text-2xl sm:text-[27px] tracking-[0.22em] font-normal text-[#9B6B64] group-hover:text-[#C58B83] transition-colors leading-none uppercase">
                {t('brandName')}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-[#8C7471] group-hover:text-[#9B6B64] transition-colors mt-1.5 leading-none whitespace-nowrap">
                {t('tagline')}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 flex-shrink-0">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded-full transition-all ${
                      isActive 
                        ? 'text-[#FFF9F5] bg-[#C58B83] shadow-sm font-semibold' 
                        : 'text-[#8C7471] hover:text-[#9B6B64] hover:bg-[#F8E9E7]/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Tools: Lang Switcher, Active Token Pill, CTA */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              
              {/* Live Queue Pulse Badge */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 border border-[#E8C6C2] bg-[#FFF9F5] text-[#3D2D2A] text-xs rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7471]">
                  {t('waitingCount')}:
                </span>
                <span className="font-bold text-[#9B6B64]">{waitingCount}</span>
              </div>

              {/* If user has an active token, show quick jump pill */}
              {activeCustomerTokenId && (
                <Link
                  to={`/status/${activeCustomerTokenId}`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8E9E7] text-[#9B6B64] border border-[#E8C6C2] text-xs font-medium rounded-full hover:bg-[#E8C6C2]/40 transition-colors shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5 text-[#C58B83] animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="label-caps-sm">{t('myToken')}</span>
                </Link>
              )}

              {/* Gujarati / English Toggle */}
              <button
                onClick={toggleLanguage}
                title="Toggle English / Gujarati"
                className="px-2.5 py-1 text-xs font-medium border border-[#E8C6C2] hover:border-[#C58B83] rounded-full transition-colors uppercase tracking-wider text-[#3D2D2A] bg-[#FFF9F5] shadow-sm"
              >
                <span className={lang === 'en' ? 'font-bold text-[#9B6B64]' : 'text-[#8C7471]'}>EN</span>
                <span className="mx-1 text-[#E8C6C2]">/</span>
                <span className={lang === 'gu' ? 'font-bold text-[#9B6B64] font-gujarati' : 'text-[#8C7471] font-gujarati'}>ગુજ</span>
              </button>

              {/* Primary Appointment/Queue CTA Button */}
              <Link
                to="/join"
                className="hidden sm:inline-flex btn-velora-primary text-[11px] py-2 px-5 shadow-sm"
              >
                {t('joinQueue')}
              </Link>

              {/* Mobile Direct Join CTA */}
              <Link
                to="/join"
                className="sm:hidden px-3 py-1.5 bg-[#C58B83] text-[#FFF9F5] text-xs uppercase tracking-wider font-medium rounded-full shadow-sm"
              >
                {t('joinQueue')}
              </Link>

            </div>
          </div>

          {/* Mobile Horizontal Sub-Navigation */}
          <div className="md:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-[#E8C6C2]/40 no-scrollbar text-xs">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#C58B83] text-[#FFF9F5] font-semibold' 
                      : 'text-[#8C7471] hover:text-[#9B6B64]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {activeCustomerTokenId && (
              <Link
                to={`/status/${activeCustomerTokenId}`}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] uppercase tracking-wider bg-[#F8E9E7] text-[#9B6B64] font-bold border border-[#E8C6C2]"
              >
                {t('myToken')}
              </Link>
            )}
          </div>

        </div>
      </header>
    </div>
  );
}
