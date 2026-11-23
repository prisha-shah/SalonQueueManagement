import React, { useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime } from '../utils/waitTime';
import { Clock, Check, AlertCircle, ArrowLeft, User, Phone, Sparkles, Scissors, Info, Star } from 'lucide-react';

export default function JoinQueue() {
  const { lang, t } = useLanguage();
  const { services, barbers, tokens, joinQueue, settings, checkDuplicateActivePhone } = useQueue();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-selected parameters from URL
  const defaultSvc = searchParams.get('service');
  const defaultBarber = searchParams.get('barber');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState(() => {
    return defaultSvc ? [defaultSvc] : ['svc-1'];
  });
  const [preferredBarberId, setPreferredBarberId] = useState(() => {
    return defaultBarber ? defaultBarber : 'any';
  });
  
  // Validation & Error states
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingDuplicateToken, setExistingDuplicateToken] = useState(null);

  // Computed calculations
  const selectedServices = useMemo(() => {
    return services.filter(s => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.duration, 0);
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const currentEstimatedWait = useMemo(() => {
    return calculateWaitTime(tokens, null, barbers);
  }, [tokens, barbers]);

  // Live Queue snapshot for right panel
  const liveQueueList = useMemo(() => {
    return tokens
      .filter(t => t.status === 'in_service' || t.status === 'called' || t.status === 'waiting')
      .slice(0, 7);
  }, [tokens]);

  // Handle service toggling (Max 3)
  const handleToggleService = (serviceId) => {
    setFormError('');
    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length === 1) {
        setFormError('Please select at least one service.');
        return;
      }
      setSelectedServiceIds(prev => prev.filter(id => id !== serviceId));
    } else {
      if (selectedServiceIds.length >= 3) {
        setFormError(t('maxServicesNotice'));
        return;
      }
      setSelectedServiceIds(prev => [...prev, serviceId]);
    }
  };

  // Live duplicate phone check on blur/change
  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    setFormError('');
    if (cleaned.length === 10) {
      const existing = checkDuplicateActivePhone(cleaned);
      if (existing) {
        setExistingDuplicateToken(existing);
      } else {
        setExistingDuplicateToken(null);
      }
    } else {
      setExistingDuplicateToken(null);
    }
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!settings.isQueueOpen) {
      setFormError(t('queuePausedNotice'));
      return;
    }

    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Please enter your full name (minimum 2 letters).');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (selectedServiceIds.length === 0) {
      setFormError('Please select at least 1 service.');
      return;
    }

    if (selectedServiceIds.length > 3) {
      setFormError(t('maxServicesNotice'));
      return;
    }

    const duplicate = checkDuplicateActivePhone(phoneNumber);
    if (duplicate) {
      setExistingDuplicateToken(duplicate);
      setFormError(`This mobile number already has active Token ${duplicate.tokenNumber}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newToken = joinQueue({
        customerName,
        phoneNumber,
        serviceIds: selectedServiceIds,
        preferredBarberId,
        isWalkIn: false
      });

      // Navigate to status tracker
      navigate(`/status/${newToken.id}`);
    } catch (err) {
      if (err.message === 'DUPLICATE_ACTIVE_PHONE') {
        setFormError('This mobile number already has an active queue token.');
      } else if (err.message === 'ONLINE_QUEUE_PAUSED') {
        setFormError(t('queuePausedNotice'));
      } else {
        setFormError('An unexpected error occurred while generating your token.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8E9E7] py-8 sm:py-14 text-[#3D2D2A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8C7471] hover:text-[#9B6B64] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('home')}
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="border-b border-[#E8C6C2]/50 pb-6 mb-8 text-center sm:text-left">
          <span className="label-caps text-[#C58B83] block mb-1">RESERVE YOUR CHAIR</span>
          <h1 className="font-serif text-3xl sm:text-4xl uppercase text-[#9B6B64]">
            {t('joinHeader')}
          </h1>
          <p className="mt-2 text-[#8C7471] text-sm font-light">
            {t('joinLead')}
          </p>
        </div>

        {/* Master Queue Paused Notice */}
        {!settings.isQueueOpen && (
          <div className="mb-8 p-4 border border-[#FDE8E8] bg-[#FFF5F5] rounded-2xl flex items-start gap-3 text-sm text-[#9B1C1C]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#DC2626]" />
            <div>
              <strong className="block font-medium">Queue Currently Paused</strong>
              <p className="text-xs mt-0.5 opacity-90">{t('queuePausedNotice')}</p>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 velora-card p-6 sm:p-8">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block label-caps mb-2 text-[#8C7471]">
                  {t('fullNameLabel')} <span className="text-[#C58B83]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7471] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => { setCustomerName(e.target.value); setFormError(''); }}
                    placeholder={t('fullNamePlaceholder')}
                    className="velora-input !pl-11"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block label-caps mb-2 text-[#8C7471]">
                  {t('mobileLabel')} (10 DIGITS) <span className="text-[#C58B83]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C7471] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-[#8C7471] font-semibold flex items-center border-r border-[#E8C6C2] pr-2.5 pointer-events-none select-none">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={t('mobilePlaceholder')}
                    className="velora-input font-mono !pl-20"
                    style={{ paddingLeft: '5.25rem' }}
                  />
                </div>
                {existingDuplicateToken && (
                  <div className="mt-2.5 p-3.5 border border-[#E8C6C2] bg-[#F8E9E7]/60 rounded-xl text-xs text-[#3D2D2A] flex items-center justify-between">
                    <span>
                      {t('alreadyHaveToken', { tok: existingDuplicateToken.tokenNumber })}
                    </span>
                    <Link 
                      to={`/status/${existingDuplicateToken.id}`}
                      className="text-[#C58B83] font-bold underline uppercase tracking-wider text-[11px]"
                    >
                      Track Now &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Service Selection (Max 3) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block label-caps text-[#8C7471]">
                    {t('selectServicesLabel')} <span className="text-[#C58B83]">*</span>
                  </label>
                  <span className="text-[11px] text-[#8C7471] font-medium">
                    {selectedServiceIds.length}/3 selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((svc) => {
                    const isSelected = selectedServiceIds.includes(svc.id);
                    const isDisabled = !isSelected && selectedServiceIds.length >= 3;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => !isDisabled && handleToggleService(svc.id)}
                        className={`p-3.5 border rounded-xl text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#C58B83] bg-[#F8E9E7] shadow-sm text-[#3D2D2A]'
                            : isDisabled
                            ? 'border-[#E8C6C2]/40 opacity-45 cursor-not-allowed bg-[#FFF9F5]/50'
                            : 'border-[#E8C6C2]/60 bg-[#FFF9F5] hover:border-[#C58B83] text-[#3D2D2A]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-serif text-sm tracking-wide block font-medium">
                            {lang === 'gu' ? svc.nameGu : svc.name}
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${
                            isSelected ? 'border-[#C58B83] bg-[#C58B83] text-white' : 'border-[#E8C6C2]'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#8C7471]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C58B83]" /> {svc.duration} {t('min')}
                          </span>
                          <span className="font-semibold text-[#9B6B64]">₹{svc.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stylist Preference */}
              <div>
                <label className="block label-caps mb-2 text-[#8C7471]">
                  {t('preferredStylistLabel')}
                </label>

                <div className="space-y-2.5">
                  {/* Any Stylist Option */}
                  <label 
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                      preferredBarberId === 'any' ? 'border-[#C58B83] bg-[#F8E9E7] shadow-sm' : 'border-[#E8C6C2]/60 bg-[#FFF9F5] hover:border-[#C58B83]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="preferredStylist"
                        value="any"
                        checked={preferredBarberId === 'any'}
                        onChange={() => setPreferredBarberId('any')}
                        className="text-[#C58B83] focus:ring-[#C58B83] accent-[#C58B83]"
                      />
                      <div>
                        <span className="text-sm font-medium text-[#3D2D2A] block font-serif">
                          {t('anyStylistFastest')}
                        </span>
                        <span className="text-xs text-[#8C7471]">
                          First available chair claims your ticket
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] label-caps-sm bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] rounded-full">
                      FASTEST
                    </span>
                  </label>

                  {/* Individual Stylists Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {barbers.map((b) => {
                      const isOnDuty = b.status === 'on_duty';
                      return (
                        <label
                          key={b.id}
                          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                            preferredBarberId === b.id 
                              ? 'border-[#C58B83] bg-[#F8E9E7] shadow-sm' 
                              : !isOnDuty 
                              ? 'border-[#E8C6C2]/30 opacity-50 bg-[#FFF9F5]/40' 
                              : 'border-[#E8C6C2]/60 bg-[#FFF9F5] hover:border-[#C58B83]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferredStylist"
                            value={b.id}
                            disabled={!isOnDuty}
                            checked={preferredBarberId === b.id}
                            onChange={() => setPreferredBarberId(b.id)}
                            className="text-[#C58B83] focus:ring-[#C58B83] accent-[#C58B83]"
                          />
                          <img
                            src={b.avatar}
                            alt={b.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#E8C6C2]"
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-medium text-[#3D2D2A] block truncate font-serif">
                              {b.name} (Chair {b.chairNumber})
                            </span>
                            <span className="text-[10px] text-[#8C7471] block truncate">
                              {isOnDuty ? (lang === 'gu' ? b.specialityGu : b.speciality) : 'On Break'}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error Message Display */}
              {formError && (
                <div className="p-3.5 border border-[#FECACA] bg-[#FFF5F5] text-[#DC2626] text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !settings.isQueueOpen}
                className="w-full btn-velora-primary py-4 text-center text-xs justify-center shadow-rose text-white"
              >
                {isSubmitting ? t('calculating') : `${t('getYourToken')} · ₹${totalPrice}`}
              </button>

            </form>

          </div>

          {/* Right Column: Live Summary & Queue Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visit Summary Card */}
            <div className="velora-card p-6">
              <h2 className="label-caps text-[#C58B83] mb-4 pb-2 border-b border-[#E8C6C2]/50">
                {t('summaryTitle')}
              </h2>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#8C7471]">{t('selectedServicesCount')}:</span>
                  <span className="font-semibold text-[#3D2D2A]">{selectedServices.length}</span>
                </div>
                
                <div className="space-y-1.5 pl-2.5 border-l-2 border-[#E8C6C2] my-2">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between items-center text-[#8C7471] text-[11px]">
                      <span>{lang === 'gu' ? s.nameGu : s.name}</span>
                      <span>{s.duration}m · ₹{s.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center py-1 border-t border-[#E8C6C2]/50 pt-2">
                  <span className="text-[#8C7471]">{t('totalDuration')}:</span>
                  <span className="font-semibold text-[#3D2D2A] flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5 text-[#C58B83]" /> {totalDuration} {t('min')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#8C7471]">{t('totalEstimatedPrice')}:</span>
                  <span className="font-serif text-lg text-[#9B6B64] font-semibold">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 bg-[#F8E9E7] px-3.5 rounded-xl border border-[#E8C6C2]/60">
                  <span className="label-caps-sm text-[#8C7471]">{t('estimatedWaitTime')}:</span>
                  <span className="font-serif text-lg text-[#C58B83] font-bold">
                    ~{currentEstimatedWait} {t('min')}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#8C7471] font-light leading-relaxed">
                * Payment is settled in cash or UPI at reception after service completion. No upfront charge.
              </p>
            </div>

            {/* Live Queue Transparency Widget */}
            <div className="velora-card p-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8C6C2]/50">
                <span className="label-caps text-[#3D2D2A]">{t('liveQueue')}</span>
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping"></span>
              </div>

              <div className="divide-y divide-[#E8C6C2]/40">
                {liveQueueList.map((q) => {
                  const isServing = q.status === 'in_service';
                  const isCalled = q.status === 'called';
                  return (
                    <div key={q.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-[#9B6B64] w-12">{q.tokenNumber}</span>
                        <span className="text-[#8C7471] truncate max-w-[120px]">
                          {q.customerName.split(' ')[0]}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-semibold border ${
                        isServing 
                          ? 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]' 
                          : isCalled 
                          ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] animate-pulse' 
                          : 'bg-[#F8E9E7] text-[#8C7471] border-[#E8C6C2]'
                      }`}>
                        {isServing ? 'In Chair' : isCalled ? 'Called' : 'Waiting'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8C6C2]/50 text-center">
                <Link to="/display" className="label-caps-sm text-[#C58B83] hover:underline font-bold">
                  View Full Wall Display &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
