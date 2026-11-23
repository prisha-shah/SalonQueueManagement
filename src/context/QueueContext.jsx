import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BARBERS, SERVICES, INITIAL_TOKENS } from '../data/seedData';
import { playLuxuryChime } from '../utils/audio';

const QueueContext = createContext(null);

const STORAGE_KEY = 'velora_salon_v2';
const SYNC_CHANNEL_NAME = 'velora_queue_broadcast_channel';

export function QueueProvider({ children }) {
  // Primary state containers
  const [tokens, setTokens] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('luxe_salon_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tokens && Array.isArray(parsed.tokens)) {
          return parsed.tokens;
        }
      }
    } catch (e) {
      console.warn('Could not read saved queue state:', e);
    }
    return INITIAL_TOKENS;
  });

  const [barbers, setBarbers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.barbers && Array.isArray(parsed.barbers)) {
          return parsed.barbers;
        }
      }
    } catch (e) {}
    return BARBERS;
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.services && Array.isArray(parsed.services)) {
          return parsed.services;
        }
      }
    } catch (e) {}
    return SERVICES;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings) {
          return parsed.settings;
        }
      }
    } catch (e) {}
    return {
      isQueueOpen: true,
      autoCutoffEnabled: true,
      closingTime: '21:00',
      totalServedCount: 18
    };
  });

  // Track customer's own active token ID for mobile auto-recovery
  const [activeCustomerTokenId, setActiveCustomerTokenId] = useState(() => {
    try {
      return localStorage.getItem('velora_active_customer_token') || localStorage.getItem('luxe_active_customer_token') || null;
    } catch {
      return null;
    }
  });

  // Save state to localStorage and broadcast across browser windows / tabs
  const persistAndBroadcast = useCallback((newTokens, newBarbers, newServices, newSettings) => {
    try {
      const stateToSave = {
        tokens: newTokens,
        barbers: newBarbers,
        services: newServices,
        settings: newSettings,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

      // BroadcastChannel for sub-second cross-window synchronization
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.postMessage({ type: 'QUEUE_STATE_UPDATE', payload: stateToSave });
        channel.close();
      }
    } catch (err) {
      console.error('Error persisting queue state:', err);
    }
  }, []);

  // Listen for BroadcastChannel & storage events from other tabs / windows
  useEffect(() => {
    let channel;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === 'QUEUE_STATE_UPDATE' && event.data.payload) {
          const { tokens: incomingTokens, barbers: incomingBarbers, services: incomingServices, settings: incomingSettings } = event.data.payload;
          if (incomingTokens) setTokens(incomingTokens);
          if (incomingBarbers) setBarbers(incomingBarbers);
          if (incomingServices) setServices(incomingServices);
          if (incomingSettings) setSettings(incomingSettings);
        }
      };
    }

    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.tokens) setTokens(parsed.tokens);
          if (parsed.barbers) setBarbers(parsed.barbers);
          if (parsed.services) setServices(parsed.services);
          if (parsed.settings) setSettings(parsed.settings);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Duplicate active phone number check
  const checkDuplicateActivePhone = useCallback((phone) => {
    if (!phone) return null;
    const cleanPhone = phone.trim();
    // Default walk-in anonymous numbers are exempt from duplicate check
    if (cleanPhone === '0000000000' || cleanPhone === '9999999999') return null;

    const existing = tokens.find(t => 
      t.phoneNumber === cleanPhone && 
      (t.status === 'waiting' || t.status === 'called' || t.status === 'in_service')
    );
    return existing || null;
  }, [tokens]);

  // Next Token Sequence generator (e.g. A109, A110...)
  const generateNextTokenNumber = useCallback(() => {
    const existingNums = tokens.map(t => {
      const match = t.tokenNumber.match(/\d+/);
      return match ? parseInt(match[0], 10) : 100;
    });
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 100;
    return `A${maxNum + 1}`;
  }, [tokens]);

  // Join Queue action (used by Remote /join and Receptionist walk-in)
  const joinQueue = useCallback(({ customerName, phoneNumber, serviceIds, preferredBarberId, isWalkIn = false }) => {
    // Business Rule Check 1: Master Queue Acceptance
    if (!settings.isQueueOpen && !isWalkIn) {
      throw new Error('ONLINE_QUEUE_PAUSED');
    }

    // Business Rule Check 2: Max 3 services
    if (!serviceIds || serviceIds.length === 0) {
      throw new Error('NO_SERVICES_SELECTED');
    }
    if (serviceIds.length > 3) {
      throw new Error('MAX_SERVICES_EXCEEDED');
    }

    // Business Rule Check 3: Duplicate active phone
    const duplicate = checkDuplicateActivePhone(phoneNumber);
    if (duplicate) {
      const err = new Error('DUPLICATE_ACTIVE_PHONE');
      err.existingToken = duplicate;
      throw err;
    }

    // Aggregate durations and prices
    const selectedSvcs = services.filter(s => serviceIds.includes(s.id));
    const totalDurationMinutes = selectedSvcs.reduce((acc, curr) => acc + curr.duration, 0);
    const totalPrice = selectedSvcs.reduce((acc, curr) => acc + curr.price, 0);
    const servicesSummary = selectedSvcs.map(s => s.name).join(' + ');

    const tokenNumber = generateNextTokenNumber();
    const newToken = {
      id: `t-${Date.now()}`,
      tokenNumber,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      serviceIds,
      servicesSummary,
      totalDurationMinutes,
      totalPrice,
      preferredBarberId: preferredBarberId || 'any',
      assignedBarberId: null,
      chairNumber: null,
      status: 'waiting', // waiting -> called -> in_service -> completed | cancelled | no_show
      createdAt: Date.now(),
      calledAt: null,
      serviceStartedAt: null,
      isWalkIn: Boolean(isWalkIn)
    };

    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);

    if (!isWalkIn) {
      try {
        localStorage.setItem('velora_active_customer_token', newToken.id);
        setActiveCustomerTokenId(newToken.id);
      } catch {}
    }

    return newToken;
  }, [tokens, barbers, services, settings, checkDuplicateActivePhone, generateNextTokenNumber, persistAndBroadcast]);

  // Smart FIFO Barber Call Next
  // Scans FIFO queue and picks the first customer wanting Barber X OR wanting "any"
  const callNextForBarber = useCallback((barberId) => {
    const barber = barbers.find(b => b.id === barberId);
    if (!barber) throw new Error('BARBER_NOT_FOUND');

    // Rule: Single-Chair Concurrency Guard
    // Cannot call if already serving someone
    const currentlyServing = tokens.find(t => 
      (t.assignedBarberId === barberId || t.chairNumber === barber.chairNumber) && 
      t.status === 'in_service'
    );
    if (currentlyServing) {
      throw new Error('CHAIR_ALREADY_IN_SERVICE');
    }

    // Find eligible waiting guest
    const eligibleToken = tokens.find(t => 
      t.status === 'waiting' && 
      (t.preferredBarberId === barberId || t.preferredBarberId === 'any')
    );

    if (!eligibleToken) {
      return null;
    }

    const updatedTokens = tokens.map(t => {
      if (t.id === eligibleToken.id) {
        return {
          ...t,
          status: 'called',
          assignedBarberId: barber.id,
          chairNumber: barber.chairNumber,
          calledAt: Date.now()
        };
      }
      return t;
    });

    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);

    // Audio chime on call
    playLuxuryChime();

    return eligibleToken;
  }, [tokens, barbers, services, settings, persistAndBroadcast]);

  // Barber Starts Service
  const startService = useCallback((tokenId) => {
    const target = tokens.find(t => t.id === tokenId);
    if (!target) throw new Error('TOKEN_NOT_FOUND');

    const updatedTokens = tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'in_service',
          serviceStartedAt: Date.now()
        };
      }
      return t;
    });

    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);
  }, [tokens, barbers, services, settings, persistAndBroadcast]);

  // Complete Service
  const completeService = useCallback((tokenId) => {
    const target = tokens.find(t => t.id === tokenId);
    if (!target) throw new Error('TOKEN_NOT_FOUND');

    const updatedTokens = tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'completed',
          completedAt: Date.now()
        };
      }
      return t;
    });

    // Update barber stats
    const updatedBarbers = barbers.map(b => {
      if (b.id === target.assignedBarberId) {
        return { ...b, todayServed: (b.todayServed || 0) + 1 };
      }
      return b;
    });

    const updatedSettings = {
      ...settings,
      totalServedCount: (settings.totalServedCount || 0) + 1
    };

    setTokens(updatedTokens);
    setBarbers(updatedBarbers);
    setSettings(updatedSettings);
    persistAndBroadcast(updatedTokens, updatedBarbers, services, updatedSettings);

    // If completed token was user's active token, clear active tracker
    if (activeCustomerTokenId === tokenId) {
      try {
        localStorage.removeItem('velora_active_customer_token');
        localStorage.removeItem('luxe_active_customer_token');
      } catch {}
      setActiveCustomerTokenId(null);
    }
  }, [tokens, barbers, services, settings, activeCustomerTokenId, persistAndBroadcast]);

  // Customer or Reception Cancels Token
  const cancelToken = useCallback((tokenId) => {
    const updatedTokens = tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'cancelled',
          cancelledAt: Date.now()
        };
      }
      return t;
    });

    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);

    if (activeCustomerTokenId === tokenId) {
      try {
        localStorage.removeItem('velora_active_customer_token');
        localStorage.removeItem('luxe_active_customer_token');
      } catch {}
      setActiveCustomerTokenId(null);
    }
  }, [tokens, barbers, services, settings, activeCustomerTokenId, persistAndBroadcast]);

  // Mark No-Show
  const markNoShow = useCallback((tokenId) => {
    const updatedTokens = tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'no_show',
          noShowAt: Date.now()
        };
      }
      return t;
    });

    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);

    if (activeCustomerTokenId === tokenId) {
      try {
        localStorage.removeItem('velora_active_customer_token');
        localStorage.removeItem('luxe_active_customer_token');
      } catch {}
      setActiveCustomerTokenId(null);
    }
  }, [tokens, barbers, services, settings, activeCustomerTokenId, persistAndBroadcast]);

  // Add 5 min extension to active service
  const extendServiceTime = useCallback((tokenId, extraMinutes = 5) => {
    const updatedTokens = tokens.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          totalDurationMinutes: t.totalDurationMinutes + extraMinutes
        };
      }
      return t;
    });
    setTokens(updatedTokens);
    persistAndBroadcast(updatedTokens, barbers, services, settings);
  }, [tokens, barbers, services, settings, persistAndBroadcast]);

  // Update Barber Shift Status (on_duty, on_break, off_duty)
  const updateBarberStatus = useCallback((barberId, status) => {
    const updatedBarbers = barbers.map(b => {
      if (b.id === barberId) {
        return { ...b, status };
      }
      return b;
    });
    setBarbers(updatedBarbers);
    persistAndBroadcast(tokens, updatedBarbers, services, settings);
  }, [tokens, barbers, services, settings, persistAndBroadcast]);

  // Update Settings
  const updateSettings = useCallback((newSettingsPartial) => {
    const updatedSettings = { ...settings, ...newSettingsPartial };
    setSettings(updatedSettings);
    persistAndBroadcast(tokens, barbers, services, updatedSettings);
  }, [tokens, barbers, services, settings, persistAndBroadcast]);

  // Update Services Catalog
  const updateServices = useCallback((newServices) => {
    setServices(newServices);
    persistAndBroadcast(tokens, barbers, newServices, settings);
  }, [tokens, barbers, settings, persistAndBroadcast]);

  // Reset to sample initial state
  const resetToSeedData = useCallback(() => {
    setTokens(INITIAL_TOKENS);
    setBarbers(BARBERS);
    setServices(SERVICES);
    const defaultSettings = {
      isQueueOpen: true,
      autoCutoffEnabled: true,
      closingTime: '21:00',
      totalServedCount: 18
    };
    setSettings(defaultSettings);
    persistAndBroadcast(INITIAL_TOKENS, BARBERS, SERVICES, defaultSettings);
  }, [persistAndBroadcast]);

  return (
    <QueueContext.Provider value={{
      tokens,
      barbers,
      services,
      settings,
      activeCustomerTokenId,
      joinQueue,
      callNextForBarber,
      startService,
      completeService,
      cancelToken,
      markNoShow,
      extendServiceTime,
      updateBarberStatus,
      updateSettings,
      updateServices,
      resetToSeedData,
      checkDuplicateActivePhone
    }}>
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
}
