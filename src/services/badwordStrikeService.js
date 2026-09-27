const strikes = new Map();

function getKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

export function getStrikes(groupId, userId) {
  return strikes.get(getKey(groupId, userId)) || 0;
}

export function addStrike(groupId, userId) {
  const key = getKey(groupId, userId);
  const current = getStrikes(groupId, userId);
  const next = current + 1;

  strikes.set(key, next);

  return next;
}

export function resetStrikes(groupId, userId) {
  strikes.delete(getKey(groupId, userId));
  return 0;
}
