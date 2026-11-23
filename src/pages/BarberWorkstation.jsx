import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { 
  Scissors, Clock, CheckCircle, AlertTriangle, ArrowRight, 
  Coffee, UserCheck, ShieldAlert, Plus, Play, Check 
} from 'lucide-react';

export default function BarberWorkstation() {
  const { name } = useParams();
  const { lang, t } = useLanguage();
  const { 
    barbers, tokens, callNextForBarber, startService, 
    completeService, extendServiceTime, updateBarberStatus 
  } = useQueue();

  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [actionError, setActionError] = useState('');

  // Find stylist by name slug with backward compatibility
  const barber = useMemo(() => {
    const slug = (name || '').toLowerCase();
    let found = barbers.find(b => b.slug.toLowerCase() === slug);
    if (!found) {
      if (slug === 'kabir' || slug === 'lena') found = barbers[0];
      else if (slug === 'meera' || slug === 'isabella') found = barbers[1];
      else if (slug === 'aarav' || slug === 'maya') found = barbers[2];
      else if (slug === 'bhavik' || slug === 'tessa') found = barbers[3];
    }
    return found || barbers[0];
  }, [barbers, name]);

  // Find currently active client in chair or called
  const activeClient = useMemo(() => {
    return tokens.find(t => 
      (t.assignedBarberId === barber.id || t.chairNumber === barber.chairNumber) && 
      (t.status === 'in_service' || t.status === 'called')
    );
  }, [tokens, barber]);

  // Upcoming eligible clients for this barber
  const upcomingForMe = useMemo(() => {
    return tokens
      .filter(t => t.status === 'waiting' && (t.preferredBarberId === barber.id || t.preferredBarberId === 'any'))
      .slice(0, 3);
  }, [tokens, barber]);

  // Service timer tick
  useEffect(() => {
    if (activeClient?.status === 'in_service' && activeClient.serviceStartedAt) {
      const update = () => {
        const secs = Math.floor((Date.now() - activeClient.serviceStartedAt) / 1000);
        setElapsedSecs(secs);
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedSecs(0);
    }
  }, [activeClient?.status, activeClient?.serviceStartedAt]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    setActionError('');
    try {
      const result = callNextForBarber(barber.id);
      if (!result) {
        setActionError('No eligible waiting guests found in the queue right now.');
      }
    } catch (err) {
      if (err.message === 'CHAIR_ALREADY_IN_SERVICE') {
        setActionError('Cannot call next guest while your chair is currently in service.');
      } else {
        setActionError('Failed to call next guest.');
      }
    }
  };

  const targetMinutes = activeClient?.totalDurationMinutes || 30;
  const progressPercent = Math.min(100, Math.floor((elapsedSecs / (targetMinutes * 60)) * 100));

  return (
    <div className="min-h-screen bg-[#F8E9E7] py-8 sm:py-14 text-[#3D2D2A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Mirror Station Header Card */}
        <div className="velora-card p-6 sm:p-7 mb-6 bg-[#FFF9F5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#C58B83] shadow-sm"
                />
                {barber.status === 'on_duty' && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#059669] border-2 border-white shadow-sm"></span>
                )}
              </div>
              <div>
                <span className="label-caps-sm text-[#C58B83] block">
                  STYLING STATION {barber.chairNumber}
                </span>
                <h1 className="font-serif text-2xl uppercase text-[#9B6B64]">
                  {barber.name}
                </h1>
                <span className="text-xs text-[#8C7471]">
                  {lang === 'gu' ? barber.specialityGu : barber.speciality} · Today: {barber.todayServed || 0} served
                </span>
              </div>
            </div>

            {/* Shift Status Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateBarberStatus(barber.id, 'on_duty')}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  barber.status === 'on_duty' 
                    ? 'bg-[#059669] text-white shadow-sm' 
                    : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#3D2D2A]'
                }`}
              >
                {t('onDuty')}
              </button>
              <button
                onClick={() => updateBarberStatus(barber.id, 'on_break')}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  barber.status === 'on_break' 
                    ? 'bg-[#9B6B64] text-white shadow-sm' 
                    : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#3D2D2A]'
                }`}
              >
                {t('onBreak')}
              </button>
            </div>

          </div>
        </div>

        {/* Action Error Warning */}
        {actionError && (
          <div className="mb-6 p-4 border border-[#FECACA] bg-[#FFF5F5] text-[#DC2626] text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* PRIMARY CHAIR CONTROLLER */}
        {activeClient ? (
          
          <div className="velora-card p-6 sm:p-8 mb-6 shadow-card bg-[#FFF9F5]">
            
            <div className="text-center pb-6 border-b border-[#E8C6C2]/40">
              <span className="label-caps-sm text-[#C58B83] block mb-1">
                {activeClient.status === 'called' ? 'GUEST CALLED — AWAITING CHAIR SEAT' : 'GUEST CURRENTLY IN CHAIR'}
              </span>
              <div className="font-mono text-5xl sm:text-6xl text-[#9B6B64] font-bold my-2">
                {activeClient.tokenNumber}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#3D2D2A] font-medium">
                {activeClient.customerName}
              </h2>
              <span className="text-xs text-[#8C7471] block mt-1">
                {activeClient.servicesSummary} · ₹{activeClient.totalPrice}
              </span>
            </div>

            {/* Service Timer Display */}
            {activeClient.status === 'in_service' && (
              <div className="py-8 text-center border-b border-[#E8C6C2]/40">
                <span className="label-caps-sm text-[#8C7471] block mb-1">SERVICE ELAPSED</span>
                <div className="font-mono text-5xl sm:text-6xl text-[#3D2D2A] font-light tracking-tight">
                  {formatTimer(elapsedSecs)}
                </div>
                <span className="text-xs text-[#8C7471] block mt-2">
                  Target Scheduled: {targetMinutes} {t('min')}
                </span>

                {/* Progress Bar */}
                <div className="w-full bg-[#F8E9E7] h-2.5 mt-4 rounded-full overflow-hidden border border-[#E8C6C2]">
                  <div 
                    className="bg-[#C58B83] h-full transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Giant Touch Controls */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {activeClient.status === 'called' && (
                <button
                  onClick={() => startService(activeClient.id)}
                  className="btn-velora-primary py-4 text-center justify-center sm:col-span-2 text-sm shadow-rose text-white"
                >
                  <Play className="w-4 h-4 mr-2" /> Start Service (Seat Guest in Chair)
                </button>
              )}

              {activeClient.status === 'in_service' && (
                <>
                  <button
                    onClick={() => extendServiceTime(activeClient.id, 5)}
                    className="btn-velora-outline py-3.5 text-center justify-center text-xs"
                  >
                    <Plus className="w-4 h-4 mr-1 text-[#C58B83]" /> {t('extendFiveMin')}
                  </button>
                  <button
                    onClick={() => completeService(activeClient.id)}
                    className="btn-velora-primary py-3.5 text-center justify-center text-xs bg-[#059669] border-[#059669] hover:bg-[#047857] text-white shadow-sm"
                  >
                    <Check className="w-4 h-4 mr-1" /> Complete Service
                  </button>
                </>
              )}

            </div>

          </div>

        ) : (

          /* Empty Chair State */
          <div className="velora-card p-8 sm:p-10 text-center mb-6 bg-[#FFF9F5]">
            <Scissors className="w-12 h-12 text-[#C58B83] mx-auto mb-3" />
            <h2 className="font-serif text-2xl uppercase text-[#9B6B64] mb-1">
              {t('stationAvailable')}
            </h2>
            <p className="text-xs text-[#8C7471] max-w-sm mx-auto mb-6">
              {t('stationAvailableDesc')}
            </p>

            <button
              onClick={handleCallNext}
              disabled={barber.status !== 'on_duty'}
              className="btn-velora-primary py-4 px-8 text-xs text-center justify-center uppercase tracking-widest shadow-rose text-white"
            >
              <UserCheck className="w-4 h-4 mr-2" /> {t('callNextGuest')}
            </button>
          </div>

        )}

        {/* Upcoming In My Queue Preview */}
        <div className="velora-card p-6 bg-[#FFF9F5]">
          <h3 className="label-caps text-[#C58B83] mb-4 pb-2 border-b border-[#E8C6C2]/40">
            {t('upcomingInQueue')}
          </h3>

          {upcomingForMe.length === 0 ? (
            <p className="text-xs text-[#8C7471] text-center py-4 font-light">
              {t('noEligibleGuests')}
            </p>
          ) : (
            <div className="divide-y divide-[#E8C6C2]/40">
              {upcomingForMe.map((item, idx) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[#C58B83] font-bold text-sm w-4">{idx + 1}.</span>
                    <div>
                      <span className="font-mono font-bold text-[#9B6B64]">{item.tokenNumber}</span>
                      <span className="ml-2 font-medium text-[#3D2D2A]">{item.customerName}</span>
                      <span className="text-[#8C7471] block text-[11px]">{item.servicesSummary}</span>
                    </div>
                  </div>
                  <span className="label-caps-sm text-[#C58B83]">
                    {item.preferredBarberId === barber.id ? 'Requested You' : 'Any Stylist'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stylist Workstation Switcher */}
        <div className="mt-8 pt-6 border-t border-[#E8C6C2]/50 flex items-center justify-between text-xs text-[#8C7471]">
          <span>Switch Workstation:</span>
          <div className="flex gap-2">
            {barbers.map(b => (
              <Link
                key={b.id}
                to={`/barber/${b.slug}`}
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-colors ${
                  b.id === barber.id 
                    ? 'bg-[#C58B83] text-[#FFF9F5]' 
                    : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#9B6B64]'
                }`}
              >
                {b.name.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
