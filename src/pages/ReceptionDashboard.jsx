import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime } from '../utils/waitTime';
import { 
  Plus, Search, Scissors, Clock, CheckCircle, AlertTriangle, 
  UserCheck, UserX, Phone, RefreshCw, X, AlertCircle, Play, Check 
} from 'lucide-react';

export default function ReceptionDashboard() {
  const { lang, t } = useLanguage();
  const { 
    tokens, barbers, services, settings, 
    joinQueue, callNextForBarber, startService, completeService, 
    cancelToken, markNoShow, updateBarberStatus, resetToSeedData 
  } = useQueue();

  const [activeFilter, setActiveFilter] = useState('all'); // all | waiting | serving
  const [searchQuery, setSearchQuery] = useState('');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [noShowTokenToConfirm, setNoShowTokenToConfirm] = useState(null);

  // Walk-In Form State
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInServices, setWalkInServices] = useState(['svc-1']);
  const [walkInBarber, setWalkInBarber] = useState('any');
  const [walkInError, setWalkInError] = useState('');

  // Active Queue Metrics
  const waitingTokens = useMemo(() => tokens.filter(t => t.status === 'waiting'), [tokens]);
  const servingTokens = useMemo(() => tokens.filter(t => t.status === 'in_service' || t.status === 'called'), [tokens]);
  const completedToday = useMemo(() => tokens.filter(t => t.status === 'completed').length + (settings.totalServedCount || 0), [tokens, settings]);
  const avgWait = useMemo(() => calculateWaitTime(tokens, null, barbers), [tokens, barbers]);

  // Filtered Queue for Table
  const filteredQueue = useMemo(() => {
    return tokens
      .filter(t => {
        if (activeFilter === 'waiting') return t.status === 'waiting';
        if (activeFilter === 'serving') return t.status === 'in_service' || t.status === 'called';
        return t.status !== 'completed' && t.status !== 'cancelled';
      })
      .filter(t => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          t.tokenNumber.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.phoneNumber.includes(q)
        );
      });
  }, [tokens, activeFilter, searchQuery]);

  // Handle Walk-In Submission
  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    setWalkInError('');

    if (!walkInName.trim()) {
      setWalkInError('Guest name is required.');
      return;
    }

    const phoneToUse = walkInPhone.trim() || '0000000000';
    if (phoneToUse !== '0000000000' && !/^\d{10}$/.test(phoneToUse)) {
      setWalkInError('Enter a valid 10-digit number or leave blank for walk-in.');
      return;
    }

    try {
      joinQueue({
        customerName: walkInName.trim(),
        phoneNumber: phoneToUse,
        serviceIds: walkInServices,
        preferredBarberId: walkInBarber,
        isWalkIn: true
      });

      // Reset and close
      setWalkInName('');
      setWalkInPhone('');
      setWalkInServices(['svc-1']);
      setWalkInBarber('any');
      setShowWalkInModal(false);
    } catch (err) {
      setWalkInError(err.message || 'Error creating walk-in token.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8E9E7] py-6 sm:py-10 text-[#3D2D2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Reception Header & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8C6C2]/50 pb-6 mb-8">
          <div>
            <span className="label-caps text-[#C58B83] block mb-1">
              FRONT DESK COMMAND CONSOLE
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl uppercase text-[#9B6B64]">
              {t('receptionTitle')}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowWalkInModal(true)}
              className="btn-velora-primary text-xs py-2.5 px-6 shadow-rose text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> {t('addWalkIn')}
            </button>
            <button
              onClick={resetToSeedData}
              title="Reset sample queue data"
              className="btn-velora-outline text-xs py-2 px-4 bg-[#FFF9F5]"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#8C7471]" /> Reset Demo
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="velora-card p-5 bg-[#FFF9F5]">
            <span className="label-caps-sm text-[#8C7471] block mb-1">{t('waitingCount')}</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#3D2D2A] font-normal block my-1">
              {waitingTokens.length}
            </span>
            <span className="text-[11px] text-[#8C7471] block">in queue waiting</span>
          </div>

          <div className="velora-card p-5 bg-[#FFF9F5]">
            <span className="label-caps-sm text-[#8C7471] block mb-1">{t('inChairFilter')}</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#C58B83] font-normal block my-1">
              {servingTokens.length}
            </span>
            <span className="text-[11px] text-[#8C7471] block">stations active</span>
          </div>

          <div className="velora-card p-5 bg-[#FFF9F5]">
            <span className="label-caps-sm text-[#8C7471] block mb-1">SERVED TODAY</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#059669] font-normal block my-1">
              {completedToday}
            </span>
            <span className="text-[11px] text-[#8C7471] block">clients finished</span>
          </div>

          <div className="velora-card p-5 bg-[#FFF9F5]">
            <span className="label-caps-sm text-[#8C7471] block mb-1">EST. WAIT TIME</span>
            <span className="font-serif text-3xl sm:text-4xl text-[#9B6B64] font-normal block my-1">
              ~{avgWait}m
            </span>
            <span className="text-[11px] text-[#8C7471] block">for new walk-in</span>
          </div>
        </div>

        {/* Main 2-Column Split: Active Table (60%) vs Station Overview (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Queue Table (7 cols) */}
          <div className="lg:col-span-7 velora-card p-6 bg-[#FFF9F5]">
            
            {/* Table Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8C6C2]/50">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm' 
                      : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#9B6B64]'
                  }`}
                >
                  {t('allFilter')}
                </button>
                <button
                  onClick={() => setActiveFilter('waiting')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors ${
                    activeFilter === 'waiting' 
                      ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm' 
                      : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#9B6B64]'
                  }`}
                >
                  {t('waitingFilter')} ({waitingTokens.length})
                </button>
                <button
                  onClick={() => setActiveFilter('serving')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full transition-colors ${
                    activeFilter === 'serving' 
                      ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm' 
                      : 'border border-[#E8C6C2] text-[#8C7471] hover:text-[#9B6B64]'
                  }`}
                >
                  {t('inChairFilter')} ({servingTokens.length})
                </button>
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C7471] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search token, guest..."
                  className="velora-input text-xs pl-8 pr-3 py-1.5 w-full sm:w-48 bg-[#FFF9F5]"
                />
              </div>
            </div>

            {/* Queue Table */}
            {filteredQueue.length === 0 ? (
              <div className="py-12 text-center text-[#8C7471] text-xs">
                <Scissors className="w-8 h-8 text-[#E8C6C2] mx-auto mb-2" />
                {t('noActiveTokens')}
              </div>
            ) : (
              <div className="divide-y divide-[#E8C6C2]/40">
                {filteredQueue.map((item) => {
                  const isWaiting = item.status === 'waiting';
                  const isCalled = item.status === 'called';
                  const isServing = item.status === 'in_service';

                  const assignedB = barbers.find(b => b.id === item.assignedBarberId);
                  const prefB = barbers.find(b => b.id === item.preferredBarberId);

                  return (
                    <div 
                      key={item.id} 
                      className="py-3.5 px-2 rounded-xl transition-colors hover:bg-[#F8E9E7]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      {/* Left: Token & Client info */}
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-base font-bold text-[#9B6B64] w-12 pt-0.5">
                          {item.tokenNumber}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#3D2D2A] text-sm">
                              {item.customerName}
                            </span>
                            {item.isWalkIn && (
                              <span className="px-2 py-0.2 text-[9px] uppercase tracking-wider font-semibold rounded-full bg-[#F8E9E7] border border-[#E8C6C2] text-[#8C7471]">
                                WALK-IN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#8C7471] block">
                            {item.servicesSummary} · ₹{item.totalPrice} ({item.totalDurationMinutes}m)
                          </span>
                          <span className="text-[10px] text-[#8C7471]/80 block mt-0.5">
                            Pref: {item.preferredBarberId === 'any' ? 'Any Stylist' : prefB?.name || 'Specific'}
                            {assignedB && ` → Station: Chair ${item.chairNumber} (${assignedB.name})`}
                          </span>
                        </div>
                      </div>

                      {/* Right: Status Pill & Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                        
                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-semibold border ${
                          isServing 
                            ? 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]' 
                            : isCalled 
                            ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] animate-pulse font-bold' 
                            : 'bg-[#F8E9E7] text-[#8C7471] border-[#E8C6C2]'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>

                        {/* Operational Actions */}
                        {isCalled && (
                          <button
                            onClick={() => startService(item.id)}
                            className="px-3 py-1 bg-[#C58B83] text-[#FFF9F5] text-[10px] font-semibold uppercase tracking-wider rounded-full hover:bg-[#9B6B64] transition-colors shadow-sm"
                          >
                            <Play className="w-3 h-3 inline mr-1" /> {t('startService')}
                          </button>
                        )}

                        {isServing && (
                          <button
                            onClick={() => completeService(item.id)}
                            className="px-3 py-1 bg-[#059669] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full hover:bg-[#047857] transition-colors shadow-sm"
                          >
                            <Check className="w-3 h-3 inline mr-1" /> {t('completeService')}
                          </button>
                        )}

                        {isCalled && (
                          <button
                            onClick={() => setNoShowTokenToConfirm(item)}
                            className="px-2.5 py-1 border border-[#FECACA] text-[#DC2626] bg-[#FFF5F5] text-[10px] font-semibold uppercase tracking-wider rounded-full hover:bg-[#FEE2E2] transition-colors"
                          >
                            {t('noShow')}
                          </button>
                        )}

                        {(isWaiting || isCalled) && (
                          <button
                            onClick={() => cancelToken(item.id)}
                            title="Cancel Token"
                            className="p-1 text-[#8C7471] hover:text-[#DC2626] rounded-full transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Column: Styling Chairs Overview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8C6C2]/50">
              <span className="label-caps text-[#9B6B64]">STYLING CHAIRS OVERVIEW</span>
              <span className="text-[11px] text-[#8C7471] font-light">4 Stations</span>
            </div>

            <div className="space-y-3">
              {barbers.map((barber) => {
                const chairOccupant = tokens.find(t => 
                  (t.assignedBarberId === barber.id || t.chairNumber === barber.chairNumber) && 
                  (t.status === 'in_service' || t.status === 'called')
                );

                const isOnDuty = barber.status === 'on_duty';

                return (
                  <div key={barber.id} className="velora-card p-4 bg-[#FFF9F5]">
                    
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8C6C2]/40">
                      <div className="flex items-center gap-3">
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E8C6C2]"
                        />
                        <div>
                          <span className="font-serif text-sm font-semibold text-[#3D2D2A] block">
                            Chair {barber.chairNumber}: {barber.name}
                          </span>
                          <span className="text-[10px] text-[#8C7471] block">
                            {lang === 'gu' ? barber.specialityGu : barber.speciality}
                          </span>
                        </div>
                      </div>

                      {/* Shift Switcher */}
                      <select
                        value={barber.status}
                        onChange={(e) => updateBarberStatus(barber.id, e.target.value)}
                        className="text-[10px] uppercase font-semibold tracking-wider bg-[#F8E9E7] border border-[#E8C6C2] text-[#9B6B64] py-1 px-2.5 rounded-full outline-none"
                      >
                        <option value="on_duty">{t('onDuty')}</option>
                        <option value="on_break">{t('onBreak')}</option>
                        <option value="off_duty">{t('offDuty')}</option>
                      </select>
                    </div>

                    {/* Chair Occupant Status */}
                    {chairOccupant ? (
                      <div className="p-3 bg-[#F8E9E7]/50 rounded-xl border border-[#E8C6C2]/60 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#9B6B64] text-sm">
                              {chairOccupant.tokenNumber}
                            </span>
                            <span className="text-xs text-[#3D2D2A] font-medium">
                              {chairOccupant.customerName}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8C7471] block mt-0.5">
                            {chairOccupant.servicesSummary}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {chairOccupant.status === 'called' ? (
                            <button
                              onClick={() => startService(chairOccupant.id)}
                              className="px-3 py-1 bg-[#C58B83] text-[#FFF9F5] text-[10px] font-semibold uppercase tracking-wider rounded-full hover:bg-[#9B6B64] shadow-sm"
                            >
                              Seat Client
                            </button>
                          ) : (
                            <button
                              onClick={() => completeService(chairOccupant.id)}
                              className="px-3 py-1 bg-[#059669] text-white text-[10px] font-semibold uppercase tracking-wider rounded-full hover:bg-[#047857] shadow-sm"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between py-1 text-xs">
                        <span className="text-[#8C7471] flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-[#059669]' : 'bg-[#8C7471]'}`}></span>
                          {isOnDuty ? 'Station Available' : 'Station Inactive'}
                        </span>

                        {isOnDuty && (
                          <button
                            onClick={() => callNextForBarber(barber.id)}
                            className="btn-velora-outline py-1 px-3 text-[10px]"
                          >
                            {t('callNextGuest')}
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* Rapid Walk-In Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-[#3D2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8C6C2]/50 mb-4">
              <h3 className="font-serif text-xl uppercase text-[#9B6B64]">
                {t('addWalkIn')}
              </h3>
              <button onClick={() => setShowWalkInModal(false)} className="text-[#8C7471] hover:text-[#9B6B64]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div>
                <label className="block label-caps-sm text-[#8C7471] mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Priyanshi Shah"
                  className="velora-input"
                />
              </div>

              <div>
                <label className="block label-caps-sm text-[#8C7471] mb-1">Mobile (Optional)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  placeholder="10 digits or leave empty"
                  className="velora-input font-mono"
                />
              </div>

              <div>
                <label className="block label-caps-sm text-[#8C7471] mb-1">Primary Service</label>
                <select
                  value={walkInServices[0]}
                  onChange={(e) => setWalkInServices([e.target.value])}
                  className="velora-input"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration}m · ₹{s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block label-caps-sm text-[#8C7471] mb-1">Stylist Assignment</label>
                <select
                  value={walkInBarber}
                  onChange={(e) => setWalkInBarber(e.target.value)}
                  className="velora-input"
                >
                  <option value="any">Any Available Stylist (Fastest)</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} (Chair {b.chairNumber})
                    </option>
                  ))}
                </select>
              </div>

              {walkInError && (
                <div className="p-3 border border-[#FECACA] bg-[#FFF5F5] text-[#DC2626] text-xs rounded-xl">
                  {walkInError}
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="btn-velora-outline flex-1 text-center py-2.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-velora-primary flex-1 text-center py-2.5 text-xs text-white"
                >
                  Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* No-Show Grace Period Confirmation Modal */}
      {noShowTokenToConfirm && (
        <div className="fixed inset-0 z-50 bg-[#3D2522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
            <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
            <h3 className="font-serif text-xl uppercase text-[#9B6B64] mb-2">
              Confirm Guest No-Show
            </h3>
            <p className="text-xs text-[#8C7471] mb-5 leading-relaxed">
              Guest <strong>{noShowTokenToConfirm.customerName}</strong> (Token {noShowTokenToConfirm.tokenNumber}) failed to report to Chair {noShowTokenToConfirm.chairNumber}.
              Marking as no-show will unbind the chair so the stylist can call the next waiting guest.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setNoShowTokenToConfirm(null)}
                className="btn-velora-outline flex-1 text-center text-xs py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  markNoShow(noShowTokenToConfirm.id);
                  setNoShowTokenToConfirm(null);
                }}
                className="btn-velora-primary flex-1 text-center bg-[#DC2626] border-[#DC2626] text-white text-xs hover:bg-[#B91C1C] py-2.5"
              >
                Eject & Free Chair
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
