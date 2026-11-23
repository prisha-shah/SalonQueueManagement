import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime } from '../utils/waitTime';
import { playLuxuryChime } from '../utils/audio';
import { Volume2, Sparkles, MapPin, Clock, Scissors, AlertCircle } from 'lucide-react';

export default function WallDisplay() {
  const { lang, t } = useLanguage();
  const { tokens, barbers } = useQueue();

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Now serving stations
  const servingStations = useMemo(() => {
    return barbers.map(barber => {
      const activeToken = tokens.find(t => 
        (t.assignedBarberId === barber.id || t.chairNumber === barber.chairNumber) && 
        (t.status === 'in_service' || t.status === 'called')
      );
      return {
        barber,
        token: activeToken || null
      };
    });
  }, [barbers, tokens]);

  // Upcoming waiting list (Next 6)
  const upcomingQueue = useMemo(() => {
    return tokens
      .filter(t => t.status === 'waiting')
      .slice(0, 6);
  }, [tokens]);

  const estWait = calculateWaitTime(tokens, null, barbers);

  const handleEnableAudio = () => {
    playLuxuryChime();
    setAudioEnabled(true);
  };

  return (
    <div className="min-h-screen bg-[#231816] text-[#FFF9F5] font-sans flex flex-col justify-between overflow-hidden select-none">
      
      {/* Wall Display Header */}
      <header className="px-8 py-5 border-b border-[#E8C6C2]/20 bg-black/30 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-serif text-3xl tracking-super font-normal text-[#E8C6C2]">
            VÉLORA
          </span>
          <span className="text-[#C58B83]">❖</span>
          <span className="label-caps text-[#F8E9E7]/90 tracking-widest-plus text-xs">
            {t('tagline')}
          </span>
          <span className="text-[#C58B83] hidden sm:inline">·</span>
          <span className="label-caps-sm text-[#C58B83] tracking-widest hidden sm:inline">
            {t('subTagline')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {!audioEnabled && (
            <button
              onClick={handleEnableAudio}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C58B83] bg-[#C58B83]/20 text-[#E8C6C2] text-xs font-semibold uppercase tracking-wider hover:bg-[#C58B83]/30 transition-colors shadow-sm"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#E8C6C2]" /> Enable Chime
            </button>
          )}

          <div className="text-right">
            <span className="font-mono text-2xl font-light text-[#FFF9F5] tracking-wider block">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-[11px] text-[#DCAFA9] tracking-wider uppercase font-sans">
              Sector 12 · Sānand, Gujarat
            </span>
          </div>
        </div>
      </header>

      {/* Main Split Grid (Now Serving Left 55% vs Upcoming Right 45%) */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Now Serving Chairs (7 cols) */}
        <section className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8C6C2]/20 mb-6">
            <span className="label-caps text-[#E8C6C2] text-sm tracking-widest-plus">
              {t('nowServingChairs')}
            </span>
            <span className="text-xs text-[#DCAFA9]">
              {barbers.length} Active Stations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
            {servingStations.map(({ barber, token }) => {
              const isCalled = token && token.status === 'called';
              const isInService = token && token.status === 'in_service';

              return (
                <div
                  key={barber.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-500 ${
                    isCalled
                      ? 'border-[#C58B83] bg-[#3D2522] shadow-[0_0_35px_rgba(197,139,131,0.5)] animate-call-flash'
                      : isInService
                      ? 'border-[#E8C6C2]/30 bg-white/[0.05]'
                      : 'border-white/10 bg-black/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="label-caps-sm text-[#C58B83] block font-bold">
                        CHAIR {barber.chairNumber}
                      </span>
                      <span className="font-serif text-lg text-white font-medium block">
                        {barber.name}
                      </span>
                    </div>

                    <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                      isCalled 
                        ? 'bg-[#C58B83] text-white border-[#C58B83] animate-bounce shadow-sm' 
                        : isInService 
                        ? 'bg-[#2563EB] text-white border-[#3B82F6]' 
                        : 'bg-white/10 text-white/50 border-white/10'
                    }`}>
                      {isCalled ? 'JUST CALLED' : isInService ? 'IN CHAIR' : 'AVAILABLE'}
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    {token ? (
                      <>
                        <div className="font-mono text-5xl font-light text-[#FFF9F5] tracking-tight">
                          {token.tokenNumber}
                        </div>
                        <span className="font-serif text-lg text-[#E8C6C2] mt-1.5 block truncate">
                          {token.customerName}
                        </span>
                        <span className="text-xs text-white/70 block mt-0.5">
                          {token.servicesSummary}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-white/40 tracking-widest uppercase">
                        Station Ready
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 text-center">
                    {isCalled ? (
                      <span className="text-xs font-semibold tracking-wider text-[#E8C6C2] uppercase animate-pulse">
                        ★ {t('pleaseProceed')} ★
                      </span>
                    ) : isInService ? (
                      <span className="text-xs text-[#DCAFA9] font-light">
                        Service in progress
                      </span>
                    ) : (
                      <span className="text-xs text-white/40">
                        {barber.status === 'on_duty' ? 'Next guest calling soon' : 'On scheduled break'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Upcoming Waiting Queue (5 cols) */}
        <section className="lg:col-span-5 flex flex-col justify-between border-l border-[#E8C6C2]/20 pl-0 lg:pl-8">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8C6C2]/20 mb-6">
              <span className="label-caps text-[#E8C6C2] text-sm tracking-widest-plus">
                {t('upcomingQueueList')}
              </span>
              <span className="text-xs text-[#DCAFA9]">
                Est. Wait: ~{estWait} min
              </span>
            </div>

            {upcomingQueue.length === 0 ? (
              <div className="py-16 text-center text-white/40 text-xs font-light">
                No guests currently waiting in line. Walk-in immediately.
              </div>
            ) : (
              <div className="divide-y divide-[#E8C6C2]/15">
                {upcomingQueue.map((item, index) => {
                  const prefB = barbers.find(b => b.id === item.preferredBarberId);
                  return (
                    <div key={item.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-semibold text-[#E8C6C2] w-14">
                          {item.tokenNumber}
                        </span>
                        <div>
                          <span className="text-[#FFF9F5] font-medium text-sm block">
                            {item.customerName.split(' ')[0]} {item.customerName.split(' ')[1] ? item.customerName.split(' ')[1][0] + '.' : ''}
                          </span>
                          <span className="text-white/60 text-[11px] block">
                            {item.servicesSummary}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-[#FFF9F5]/90 block">
                          ~{(index + 1) * 12} min
                        </span>
                        <span className="text-[10px] text-[#C58B83] uppercase tracking-wider font-semibold block">
                          {prefB ? prefB.name.split(' ')[0] : 'Any Stylist'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lounge Hospitality Notice Card */}
          <div className="p-5 rounded-2xl border border-[#E8C6C2]/20 bg-white/[0.04] mt-6">
            <span className="label-caps-sm text-[#C58B83] block mb-1 font-bold">LOUNGE HOSPITALITY</span>
            <p className="text-xs text-[#F8E9E7]/80 font-light leading-relaxed mb-2">
              {t('complimentaryNotice')}
            </p>
            <p className="text-[11px] text-[#DCAFA9]">
              {t('scanQrToTrack')}
            </p>
          </div>

        </section>

      </main>

      {/* Continuous Ambient Wall Ticker */}
      <footer className="border-t border-[#E8C6C2]/20 py-3 bg-black/40 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee-slow w-max text-xs tracking-widest-plus uppercase text-[#DCAFA9] font-medium">
          <span className="mx-6">NOW SERVING GUESTS AT VÉLORA SĀNAND</span>
          <span>❖</span>
          <span className="mx-6">THE ART OF ELEVATION · BEAUTY · STYLE · YOU</span>
          <span>❖</span>
          <span className="mx-6">PLEASE REPORT TO YOUR CHAIR WHEN CALLED</span>
          <span>❖</span>
          <span className="mx-6">PREMIUM GROOMING & LUXURY TREATMENTS</span>
          <span>❖</span>
        </div>
      </footer>

    </div>
  );
}
