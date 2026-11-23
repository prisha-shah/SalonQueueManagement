import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { 
  ShieldCheck, Settings, Users, Scissors, Clock, 
  BarChart3, Check, AlertCircle, ToggleLeft, ToggleRight, 
  Edit2, Save, Sparkles, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';

export default function AdminSettings() {
  const { lang, t } = useLanguage();
  const { 
    settings, updateSettings, barbers, updateBarberStatus, 
    services, updateServices, tokens 
  } = useQueue();

  const [activeTab, setActiveTab] = useState('settings'); // settings | services | staff
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editDuration, setEditDuration] = useState(0);

  // Computed metrics
  const completedTokens = tokens.filter(t => t.status === 'completed');
  const noShowTokens = tokens.filter(t => t.status === 'no_show');
  const totalServed = completedTokens.length + (settings.totalServedCount || 0);
  const noShowRate = ((noShowTokens.length / Math.max(1, totalServed + noShowTokens.length)) * 100).toFixed(1);

  const handleStartEdit = (svc) => {
    setEditingServiceId(svc.id);
    setEditPrice(svc.price);
    setEditDuration(svc.duration);
  };

  const handleSaveEdit = (svcId) => {
    const updated = services.map(s => {
      if (s.id === svcId) {
        return {
          ...s,
          price: parseInt(editPrice, 10) || s.price,
          duration: parseInt(editDuration, 10) || s.duration
        };
      }
      return s;
    });
    updateServices(updated);
    setEditingServiceId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8E9E7] py-8 sm:py-12 text-[#3D2D2A] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Executive Header Banner */}
        <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl p-6 sm:p-8 mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.16em] uppercase bg-[#E8C6C2]/40 text-[#9B6B64] border border-[#E8C6C2]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C58B83]" />
                VÉLORA · EXECUTIVE CONTROL CONSOLE
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl text-[#3D2D2A] font-normal tracking-tight">
              {t('adminTitle')}
            </h1>
            <p className="text-sm text-[#8C7471] mt-1 max-w-xl">
              Real-time salon capacity management, live pricing catalog, and stylist workstation orchestration.
            </p>
          </div>

          {/* Luxury Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#F8E9E7] border border-[#E8C6C2] rounded-full self-start md:self-center">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm font-semibold' 
                  : 'text-[#8C7471] hover:text-[#3D2D2A]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Capacity Controls
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                activeTab === 'services' 
                  ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm font-semibold' 
                  : 'text-[#8C7471] hover:text-[#3D2D2A]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              {t('servicesManager')}
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                activeTab === 'staff' 
                  ? 'bg-[#C58B83] text-[#FFF9F5] shadow-sm font-semibold' 
                  : 'text-[#8C7471] hover:text-[#3D2D2A]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t('barberRoster')}
            </button>
          </div>
        </div>

        {/* Real-Time Operational Analytics (4 Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Card 1: Total Served */}
          <div className="p-6 bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl shadow-card hover:shadow-rose transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C7471]">
                {t('totalServed')}
              </span>
              <span className="p-2 rounded-full bg-[#E8C6C2]/30 text-[#9B6B64]">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl text-[#3D2D2A] font-light">{totalServed}</span>
              <span className="text-xs text-[#059669] font-medium flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <span className="text-xs text-[#8C7471] block mt-1">clients served today</span>
          </div>

          {/* Card 2: Average Wait */}
          <div className="p-6 bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl shadow-card hover:shadow-rose transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C7471]">
                {t('avgWaitTime')}
              </span>
              <span className="p-2 rounded-full bg-[#FEF3C7] text-[#D97706]">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl text-[#9B6B64] font-light">18.5m</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-medium">
                Optimal
              </span>
            </div>
            <span className="text-xs text-[#8C7471] block mt-1">average client wait</span>
          </div>

          {/* Card 3: Floor Occupancy */}
          <div className="p-6 bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl shadow-card hover:shadow-rose transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C7471]">
                {t('chairUtilization')}
              </span>
              <span className="p-2 rounded-full bg-[#D1FAE5] text-[#059669]">
                <BarChart3 className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl text-[#059669] font-light">89.2%</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669] font-medium">
                High
              </span>
            </div>
            <span className="text-xs text-[#8C7471] block mt-1">floor chair occupancy</span>
          </div>

          {/* Card 4: No-Show Rate */}
          <div className="p-6 bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl shadow-card hover:shadow-rose transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#8C7471]">
                {t('noShowRate')}
              </span>
              <span className="p-2 rounded-full bg-[#FEE2E2] text-[#DC2626]">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl text-[#DC2626] font-light">{noShowRate}%</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-medium">
                Grace 10m
              </span>
            </div>
            <span className="text-xs text-[#8C7471] block mt-1">unfulfilled calls</span>
          </div>
        </div>

        {/* TAB 1: Capacity Controls */}
        {activeTab === 'settings' && (
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8C6C2]">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#9B6B64]">
                  Master Salon Capacity Rules
                </h2>
                <p className="text-xs text-[#8C7471] mt-0.5">
                  Automated ingress throttle controls and operating schedule boundaries.
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[#C58B83]" />
            </div>

            {/* Master Queue Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#E8C6C2] bg-[#F8E9E7]/40 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-[#3D2D2A] font-medium">
                    {t('masterQueueToggle')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    settings.isQueueOpen 
                      ? 'bg-[#D1FAE5] text-[#059669]' 
                      : 'bg-[#FEE2E2] text-[#DC2626]'
                  }`}>
                    {settings.isQueueOpen ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-[#8C7471] max-w-lg mt-1 leading-relaxed">
                  Instantly open or pause remote customer queue registration on <code className="px-1.5 py-0.5 rounded bg-white text-[#9B6B64] border border-[#E8C6C2]">/join</code>. In-salon receptionist walk-in entry remains unaffected.
                </p>
              </div>

              <button
                onClick={() => updateSettings({ isQueueOpen: !settings.isQueueOpen })}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 self-start sm:self-auto shadow-sm ${
                  settings.isQueueOpen 
                    ? 'bg-[#059669] text-white hover:bg-[#047857]' 
                    : 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                }`}
              >
                {settings.isQueueOpen ? (
                  <>
                    <Check className="w-4 h-4" /> {t('masterQueueOpen')}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> {t('masterQueueClosed')}
                  </>
                )}
              </button>
            </div>

            {/* 30-Min Auto Cutoff Rule */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#E8C6C2] bg-[#F8E9E7]/40 gap-4">
              <div>
                <span className="font-serif text-lg text-[#3D2D2A] font-medium block">
                  {t('autoCutoffRule')}
                </span>
                <p className="text-xs text-[#8C7471] max-w-lg mt-1 leading-relaxed">
                  {t('autoCutoffDesc')} Prevents client dissatisfaction by rejecting remote joins when the calculated wait time exceeds closing time.
                </p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={settings.autoCutoffEnabled}
                  onChange={(e) => updateSettings({ autoCutoffEnabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-[#C58B83] cursor-pointer"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9B6B64]">
                  {settings.autoCutoffEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            {/* Closing Time Config */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-[#E8C6C2] bg-[#F8E9E7]/40 gap-4">
              <div>
                <span className="font-serif text-lg text-[#3D2D2A] font-medium block">
                  Daily Salon Closing Time
                </span>
                <p className="text-xs text-[#8C7471] max-w-lg mt-1 leading-relaxed">
                  Used by the auto-cutoff engine to evaluate current queue backlog vs salon operating hours.
                </p>
              </div>

              <input
                type="time"
                value={settings.closingTime}
                onChange={(e) => updateSettings({ closingTime: e.target.value })}
                className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-xl px-4 py-2 text-sm font-mono text-[#3D2D2A] outline-none focus:border-[#C58B83] focus:ring-1 focus:ring-[#C58B83] self-start sm:self-auto shadow-sm"
              />
            </div>

          </div>
        )}

        {/* TAB 2: Services Catalog Manager */}
        {activeTab === 'services' && (
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8C6C2] mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#9B6B64]">
                  Services Pricing & Duration Catalog
                </h2>
                <p className="text-xs text-[#8C7471] mt-0.5">
                  Update service durations and prices in real-time. Changes immediately reflect across remote booking and reception.
                </p>
              </div>
              <Scissors className="w-5 h-5 text-[#C58B83]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8C6C2] text-[#8C7471] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-semibold">Service Name</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">{t('duration')}</th>
                    <th className="py-3 px-4 font-semibold">{t('price')}</th>
                    <th className="py-3 px-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8C6C2]/60">
                  {services.map((svc) => {
                    const isEditing = editingServiceId === svc.id;
                    return (
                      <tr key={svc.id} className="hover:bg-[#F8E9E7]/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-serif text-sm font-medium text-[#3D2D2A] block">
                            {svc.name}
                          </span>
                          <span className="text-[11px] text-[#8C7471] font-gujarati">
                            {svc.nameGu}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-[#E8C6C2]/40 text-[#9B6B64] border border-[#E8C6C2]">
                            {svc.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              min={10}
                              max={180}
                              step={5}
                              value={editDuration}
                              onChange={(e) => setEditDuration(e.target.value)}
                              className="w-20 border border-[#E8C6C2] bg-white rounded-lg p-1.5 font-mono text-xs text-[#3D2D2A] outline-none focus:border-[#C58B83]"
                            />
                          ) : (
                            <span className="font-mono text-sm text-[#3D2D2A]">{svc.duration} min</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              min={100}
                              step={50}
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 border border-[#E8C6C2] bg-white rounded-lg p-1.5 font-mono text-xs text-[#3D2D2A] outline-none focus:border-[#C58B83]"
                            />
                          ) : (
                            <span className="font-mono text-sm font-semibold text-[#9B6B64]">₹{svc.price}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(svc.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#059669] text-white hover:bg-[#047857] transition-all shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" /> Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(svc)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border border-[#E8C6C2] text-[#9B6B64] hover:bg-[#E8C6C2]/30 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: Barber Roster & Chair Allocations */}
        {activeTab === 'staff' && (
          <div className="bg-[#FFF9F5] border border-[#E8C6C2] rounded-2xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8C6C2] mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#9B6B64]">
                  Stylist Shift Roster & Chair Assignments
                </h2>
                <p className="text-xs text-[#8C7471] mt-0.5">
                  Update active shift statuses. Stylists on break or off-duty are automatically excluded from the queue dispatch calculation.
                </p>
              </div>
              <Users className="w-5 h-5 text-[#C58B83]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {barbers.map((b) => (
                <div 
                  key={b.id} 
                  className="p-5 rounded-2xl border border-[#E8C6C2] bg-[#F8E9E7]/30 hover:bg-[#F8E9E7]/60 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#E8C6C2] shadow-sm flex-shrink-0"
                    />
                    <div>
                      <span className="font-serif text-base font-semibold text-[#3D2D2A] block">
                        {b.name}
                      </span>
                      <span className="text-xs text-[#8C7471] block mt-0.5">
                        Station Chair #{b.chairNumber} · {b.speciality}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8C6C2]/40 text-[#9B6B64] font-medium">
                          Today: {b.todayServed || 0} clients served
                        </span>
                        {b.instagram && (
                          <span className="text-[10px] text-[#8C7471]">
                            {b.instagram}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <select
                    value={b.status}
                    onChange={(e) => updateBarberStatus(b.id, e.target.value)}
                    className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-full border outline-none cursor-pointer self-start sm:self-center transition-all ${
                      b.status === 'on_duty'
                        ? 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]'
                        : b.status === 'on_break'
                        ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                        : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]'
                    }`}
                  >
                    <option value="on_duty">{t('onDuty')}</option>
                    <option value="on_break">{t('onBreak')}</option>
                    <option value="off_duty">{t('offDuty')}</option>
                  </select>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
