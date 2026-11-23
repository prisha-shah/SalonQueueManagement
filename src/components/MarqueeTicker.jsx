import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime } from '../utils/waitTime';

export default function MarqueeTicker() {
  const { t } = useLanguage();
  const { tokens, barbers } = useQueue();

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servingTokens = tokens.filter(t => t.status === 'in_service');
  const servingSummary = servingTokens.length > 0 
    ? servingTokens.map(t => `${t.tokenNumber} (${t.assignedBarberId ? barbers.find(b => b.id === t.assignedBarberId)?.name?.split(' ')[0] : 'Chair'})`).join(', ') 
    : '–';

  const estWait = calculateWaitTime(tokens, null, barbers);

  const marqueeItem = (
    <div className="inline-flex items-center space-x-8 text-xs tracking-widest uppercase font-medium text-[#8C7471]">
      <span>
        {t('nowServing')}: <strong className="text-[#9B6B64] font-semibold">{servingSummary}</strong>
      </span>
      <span className="text-[#C58B83]">❖</span>
      <span>
        {t('waitingCount')}: <strong className="text-[#9B6B64] font-semibold">{waitingTokens.length} {t('guests')}</strong>
      </span>
      <span className="text-[#C58B83]">❖</span>
      <span>
        {t('estWaitNew')}: <strong className="text-[#9B6B64] font-semibold">~{estWait} {t('min')}</strong>
      </span>
      <span className="text-[#C58B83]">❖</span>
      <span className="text-[#9B6B64] font-serif font-semibold tracking-wider">VÉLORA · SĀNAND, GUJARAT</span>
      <span className="text-[#C58B83]">❖</span>
      <span>THE ART OF ELEVATION · BEAUTY · STYLE · YOU</span>
      <span className="text-[#C58B83]">❖</span>
      <span>COMPLIMENTARY ARTISAN ESPRESSO & ROSE TEA IN LOUNGE</span>
      <span className="text-[#C58B83]">❖</span>
    </div>
  );

  return (
    <div className="w-full border-y border-[#E8C6C2]/60 bg-[#FFF9F5]/70 py-2.5 overflow-hidden whitespace-nowrap select-none">
      <div className="flex animate-marquee-slow w-max">
        {marqueeItem}
        {marqueeItem}
        {marqueeItem}
        {marqueeItem}
      </div>
    </div>
  );
}
