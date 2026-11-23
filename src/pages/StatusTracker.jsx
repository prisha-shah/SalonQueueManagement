import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime, calculatePositionAhead } from '../utils/waitTime';
import confetti from 'canvas-confetti';
import { 
  Clock, Scissors, CheckCircle, AlertTriangle, ArrowLeft, 
  Sparkles, Bell, Volume2, UserX, Phone, Check, RefreshCw, Star 
} from 'lucide-react';

export default function StatusTracker() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const { tokens, barbers, cancelToken } = useQueue();
  const navigate = useNavigate();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Find active customer token
  const token = useMemo(() => {
    return tokens.find(t => t.id === id || t.tokenNumber === id);
  }, [tokens, id]);

  // Assigned barber if called or in service
  const assignedBarber = useMemo(() => {
    if (!token || !token.assignedBarberId) return null;
    return barbers.find(b => b.id === token.assignedBarberId);
  }, [barbers, token]);

  // Preferred barber if specific
  const preferredBarber = useMemo(() => {
    if (!token || !token.preferredBarberId || token.preferredBarberId === 'any') return null;
    return barbers.find(b => b.id === token.preferredBarberId);
  }, [barbers, token]);

  // Live Position ahead & wait time
  const positionAhead = useMemo(() => {
    if (!token || token.status !== 'waiting') return 0;
    return calculatePositionAhead(tokens, token.id);
  }, [tokens, token]);

  const estimatedWait = useMemo(() => {
    if (!token || token.status !== 'waiting') return 0;
    return calculateWaitTime(tokens, token.id, barbers);
  }, [tokens, token, barbers]);

  // Confetti celebration when CALLED
  useEffect(() => {
    if (token && token.status === 'called') {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C58B83', '#E8C6C2', '#9B6B64', '#F8E9E7', '#FFF9F5']
        });
        if (typeof window !== 'undefined' && window.navigator?.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        }
      } catch {}
    }
  }, [token?.status]);

  // Elapsed timer tick when IN_SERVICE
  useEffect(() => {
    if (token?.status === 'in_service' && token.serviceStartedAt) {
      const updateTimer = () => {
        const secs = Math.floor((Date.now() - token.serviceStartedAt) / 1000);
        setElapsedSeconds(secs);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [token?.status, token?.serviceStartedAt]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8E9E7] py-16 flex items-center justify-center text-[#3D2D2A] px-4">
        <div className="max-w-md w-full velora-card p-8 text-center bg-[#FFF9F5]">
          <AlertTriangle className="w-10 h-10 text-[#DC2626] mx-auto mb-4" />
          <h2 className="font-serif text-2xl uppercase mb-2 text-[#9B6B64]">Token Not Found</h2>
          <p className="text-xs text-[#8C7471] mb-6 leading-relaxed">
            This token may have expired, been cleared, or entered incorrectly.
          </p>
          <Link to="/join" className="btn-velora-primary w-full text-center">
            {t('joinQueue')}
          </Link>
        </div>
      </div>
    );
  }

  // Format MM:SS for in-chair timer
  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isApproaching = token.status === 'waiting' && (positionAhead <= 1 || estimatedWait <= 10);

  return (
    <div className="min-h-screen bg-[#F8E9E7] py-8 sm:py-14 text-[#3D2D2A]">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Cancel Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8C7471] hover:text-[#9B6B64] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('home')}
          </Link>
          
          {(token.status === 'waiting' || token.status === 'called') && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-[#9B1C1C] hover:text-[#DC2626] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {t('cancelMySpot')}
            </button>
          )}
        </div>

        {/* Primary Luxury Ticket Sheet */}
        <div className="velora-card overflow-hidden shadow-card-hover bg-[#FFF9F5] border border-[#E8C6C2]">
          
          {/* Ticket Header Strip */}
          <div className="p-6 border-b border-[#E8C6C2]/50 bg-[#F8E9E7]/40 text-center relative">
            <span className="font-serif text-lg uppercase tracking-wider text-[#9B6B64] block mb-0.5">
              VÉLORA · SĀNAND, GUJARAT
            </span>
            <span className="text-[10px] text-[#C58B83] tracking-widest uppercase block mb-1 font-semibold">
              THE ART OF ELEVATION · BEAUTY · STYLE · YOU
            </span>
            <span className="text-xs text-[#8C7471] font-light">
              Guest: <strong>{token.customerName}</strong> ({token.phoneNumber})
            </span>
          </div>

          {/* Giant Token Numeral */}
          <div className="py-8 px-6 text-center border-b border-[#E8C6C2]/40 bg-[#FFF9F5]">
            <span className="label-caps-sm text-[#8C7471] block mb-1">{t('tokenLabel')}</span>
            <div className="font-serif text-6xl sm:text-7xl text-[#9B6B64] tracking-tight font-normal my-1">
              {token.tokenNumber}
            </div>

            {/* Status Pill Badge with Consistent Soft Accessible Colors */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border">
              {token.status === 'waiting' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"></span>
                  <span>{t('statusWaiting')}</span>
                </div>
              )}
              {token.status === 'called' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0EF] text-[#9B6B64] border border-[#E8C6C2] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#C58B83] animate-ping"></span>
                  <span className="font-bold">{t('statusCalled')}</span>
                </div>
              )}
              {token.status === 'in_service' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                  <span className="font-bold">{t('statusInService')}</span>
                </div>
              )}
              {token.status === 'completed' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="font-bold">{t('statusCompleted')}</span>
                </div>
              )}
              {token.status === 'cancelled' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                  <span>{t('statusCancelled')}</span>
                </div>
              )}
              {token.status === 'no_show' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                  <span>{t('statusNoShow')}</span>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC HERO STATE CARD */}
          
          {/* CASE 1: WAITING (> 10 mins away) */}
          {token.status === 'waiting' && !isApproaching && (
            <div className="p-6 sm:p-8 text-center bg-[#F8E9E7]/30">
              <span className="label-caps-sm text-[#8C7471] block mb-2">LIVE QUEUE POSITION</span>
              <div className="font-serif text-2xl sm:text-3xl text-[#3D2D2A] mb-2 font-normal">
                {positionAhead === 0 ? 'YOU ARE NEXT IN LINE' : `${positionAhead} ${positionAhead === 1 ? t('guestAheadSingle') : t('guestsAhead')}`}
              </div>
              <div className="flex items-center justify-center gap-2 text-[#C58B83] font-serif text-xl sm:text-2xl mt-4">
                <Clock className="w-5 h-5 text-[#C58B83]" />
                <span>Estimated Wait: ~{estimatedWait} {t('min')}</span>
              </div>
              {preferredBarber && (
                <p className="text-xs text-[#8C7471] mt-3">
                  Requested Stylist: <strong>{preferredBarber.name}</strong> (Chair {preferredBarber.chairNumber})
                </p>
              )}
            </div>
          )}

          {/* CASE 2: APPROACHING WARNING (<= 10 mins or next in line) */}
          {token.status === 'waiting' && isApproaching && (
            <div className="p-6 sm:p-8 text-center bg-[#FEF3C7]/40 border-y border-[#FDE68A]">
              <span className="inline-flex items-center gap-1.5 label-caps text-[#92400E] font-bold mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" /> APPROACHING TURN
              </span>
              <div className="font-serif text-xl sm:text-2xl text-[#92400E] mb-2 font-medium">
                {t('youAreNext')}
              </div>
              <p className="text-xs text-[#92400E]/90 max-w-sm mx-auto leading-relaxed">
                Please ensure you are inside or nearby the salon lounge. Your stylist chair will be assigned in approximately {estimatedWait} minutes.
              </p>
            </div>
          )}

          {/* CASE 3: CALLED - FULL SCREEN TAKEOVER PROMPT */}
          {token.status === 'called' && (
            <div className="p-6 sm:p-8 text-center bg-[#9B6B64] text-[#FFF9F5] border-y border-[#E8C6C2] animate-call-flash">
              <span className="label-caps-sm text-[#F8E9E7] block mb-2 tracking-widest-plus">
                ❖ YOUR TURN HAS ARRIVED ❖
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#FFF9F5] font-normal mb-3">
                {t('proceedToChair')} {token.chairNumber || (assignedBarber ? assignedBarber.chairNumber : '1')}
              </h2>
              {assignedBarber && (
                <p className="text-sm text-[#F8E9E7] font-light mb-4">
                  Stylist <strong>{assignedBarber.name}</strong> is expecting you at Station {token.chairNumber}.
                </p>
              )}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FFF9F5] text-[#FFF9F5] text-xs font-semibold uppercase tracking-wider bg-white/10">
                <Bell className="w-4 h-4 animate-bounce" /> Report to your styling chair now
              </div>
            </div>
          )}

          {/* CASE 4: IN_SERVICE (Elapsed Timer) */}
          {token.status === 'in_service' && (
            <div className="p-6 sm:p-8 text-center bg-[#FFF9F5]">
              <span className="label-caps-sm text-[#1E40AF] block mb-1">SERVICE IN PROGRESS</span>
              <div className="font-mono text-4xl sm:text-5xl text-[#3D2D2A] font-light my-3">
                {formatTimer(elapsedSeconds)}
              </div>
              <span className="text-xs text-[#8C7471] block mb-4">
                Target Scheduled: {token.totalDurationMinutes} {t('min')}
              </span>
              {assignedBarber && (
                <div className="flex items-center justify-center gap-2 text-xs text-[#3D2D2A] border-t border-[#E8C6C2]/40 pt-3">
                  <Scissors className="w-3.5 h-3.5 text-[#C58B83]" />
                  <span>Serving at Station {token.chairNumber} with {assignedBarber.name}</span>
                </div>
              )}
            </div>
          )}

          {/* CASE 5: COMPLETED */}
          {token.status === 'completed' && (
            <div className="p-6 sm:p-8 text-center bg-[#D1FAE5]/30 border-y border-[#A7F3D0]">
              <CheckCircle className="w-10 h-10 text-[#059669] mx-auto mb-3" />
              <h2 className="font-serif text-xl sm:text-2xl text-[#065F46] mb-1">
                {t('thankYouTitle')}
              </h2>
              <p className="text-xs text-[#8C7471] mb-4">
                {t('thankYouDesc')}
              </p>
              <div className="p-4 border border-[#E8C6C2] bg-[#FFF9F5] rounded-xl max-w-xs mx-auto text-center shadow-sm">
                <span className="label-caps-sm text-[#8C7471] block">TOTAL BILL</span>
                <span className="font-serif text-2xl text-[#9B6B64] font-bold block mt-1">₹{token.totalPrice}</span>
                <span className="text-[10px] text-[#8C7471] block mt-1">{t('payableAtReception')}</span>
              </div>
            </div>
          )}

          {/* CASE 6: CANCELLED OR NO_SHOW */}
          {(token.status === 'cancelled' || token.status === 'no_show') && (
            <div className="p-6 sm:p-8 text-center bg-[#FEE2E2]/20 border-y border-[#FECACA]">
              <UserX className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
              <h2 className="font-serif text-lg uppercase text-[#991B1B] mb-1">
                {token.status === 'cancelled' ? t('statusCancelled') : t('statusNoShow')}
              </h2>
              <p className="text-xs text-[#8C7471] mb-4">
                This token is no longer active in the salon queue.
              </p>
              <Link to="/join" className="btn-velora-primary text-xs py-2.5 px-6">
                {t('joinAgain')}
              </Link>
            </div>
          )}

          {/* Services Breakdown Detail */}
          <div className="p-6 border-t border-[#E8C6C2]/50 bg-[#F8E9E7]/20">
            <h3 className="label-caps-sm text-[#8C7471] mb-3">{t('serviceSummary')}</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#3D2D2A]">
                <span>{token.servicesSummary}</span>
                <span className="font-semibold text-[#9B6B64]">₹{token.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[#8C7471] text-[11px]">
                <span>Total Duration</span>
                <span>{token.totalDurationMinutes} {t('min')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Auto-Sync Notice */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-[#8C7471]">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping"></span>
          <span>Live real-time sync active (&lt; 5s latency)</span>
        </div>

      </div>

      {/* Confirmation Modal: Cancel Spot */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-[#3D2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
            <h3 className="font-serif text-xl uppercase text-[#9B6B64] mb-2">
              {t('confirmCancelTitle')}
            </h3>
            <p className="text-xs text-[#8C7471] mb-6 leading-relaxed">
              {t('confirmCancelDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-velora-outline flex-1 text-center py-2.5"
              >
                {t('keepMySpot')}
              </button>
              <button
                onClick={() => {
                  cancelToken(token.id);
                  setShowCancelModal(false);
                }}
                className="btn-velora-primary flex-1 text-center py-2.5 bg-[#DC2626] border-[#DC2626] hover:bg-[#B91C1C]"
              >
                {t('yesCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
