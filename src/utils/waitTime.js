/**
 * Calculates estimated wait time in minutes for a given token or new joiner.
 * Follows the mathematical formula from docs/03-flows-rules.md:
 * ceil((Sum of durations of customers ahead) / (Active On-Duty Barbers) / 5) * 5
 */
export function calculateWaitTime(tokens, targetTokenOrId, barbers) {
  // Active on-duty barbers
  const activeBarbers = barbers.filter(b => b.status === 'on_duty');
  const activeCount = Math.max(1, activeBarbers.length);

  // If no target provided, calculate wait for a hypothetical new guest joining right now
  if (!targetTokenOrId) {
    const queueTokens = tokens.filter(t => t.status === 'waiting' || t.status === 'called' || t.status === 'in_service');
    let totalMinutes = 0;

    queueTokens.forEach(t => {
      if (t.status === 'in_service' && t.serviceStartedAt) {
        const elapsedMins = (Date.now() - t.serviceStartedAt) / (1000 * 60);
        const remaining = Math.max(0, t.totalDurationMinutes - elapsedMins);
        totalMinutes += remaining;
      } else {
        totalMinutes += (t.totalDurationMinutes || 30);
      }
    });

    const rawWait = totalMinutes / activeCount;
    return Math.max(5, Math.ceil(rawWait / 5) * 5);
  }

  // Find target token
  const target = typeof targetTokenOrId === 'string'
    ? tokens.find(t => t.id === targetTokenOrId || t.tokenNumber === targetTokenOrId)
    : targetTokenOrId;

  if (!target) return 0;

  // If already in service or completed
  if (target.status === 'in_service') return 0;
  if (target.status === 'completed' || target.status === 'cancelled' || target.status === 'no_show') return 0;
  if (target.status === 'called') return 0;

  // Filter queue tokens that are ahead of this customer
  const activeQueue = tokens.filter(t => t.status === 'waiting' || t.status === 'called' || t.status === 'in_service');
  const targetIndex = activeQueue.findIndex(t => t.id === target.id);

  if (targetIndex === -1) return 0;

  // All tokens ahead
  const tokensAhead = activeQueue.slice(0, targetIndex);

  // If target selected a specific barber
  if (target.preferredBarberId && target.preferredBarberId !== 'any') {
    const targetBarber = barbers.find(b => b.id === target.preferredBarberId);
    const isTargetBarberActive = targetBarber && targetBarber.status === 'on_duty';
    if (!isTargetBarberActive) {
      // Barber on break or offline - fallback estimate with notice
      return 45;
    }

    let barberSpecificMinutes = 0;
    tokensAhead.forEach(t => {
      // Patron ahead either asked for this barber or asked for any barber
      if (t.preferredBarberId === target.preferredBarberId) {
        if (t.status === 'in_service' && t.serviceStartedAt) {
          const elapsed = (Date.now() - t.serviceStartedAt) / (1000 * 60);
          barberSpecificMinutes += Math.max(0, t.totalDurationMinutes - elapsed);
        } else {
          barberSpecificMinutes += t.totalDurationMinutes;
        }
      } else if (t.preferredBarberId === 'any') {
        // Shared weight among active chairs
        barberSpecificMinutes += (t.totalDurationMinutes / activeCount);
      }
    });

    return Math.max(5, Math.ceil(barberSpecificMinutes / 5) * 5);
  }

  // Target selected "any barber (fastest)"
  let totalMinutesAhead = 0;
  tokensAhead.forEach(t => {
    if (t.status === 'in_service' && t.serviceStartedAt) {
      const elapsed = (Date.now() - t.serviceStartedAt) / (1000 * 60);
      totalMinutesAhead += Math.max(0, t.totalDurationMinutes - elapsed);
    } else {
      totalMinutesAhead += (t.totalDurationMinutes || 30);
    }
  });

  const rawEstimate = totalMinutesAhead / activeCount;
  return Math.max(5, Math.ceil(rawEstimate / 5) * 5);
}

/**
 * Calculates position in line among WAITING customers
 */
export function calculatePositionAhead(tokens, targetTokenId) {
  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const index = waitingTokens.findIndex(t => t.id === targetTokenId);
  return index === -1 ? 0 : index;
}
