const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

export function createTrial(userId) {
  const startedAt = Date.now();
  const expiresAt = startedAt + TRIAL_DURATION_MS;

  return {
    userId,
    type: "trial",
    startedAt,
    expiresAt,
    active: true
  };
}

export function isTrialActive(trial) {
  if (!trial) return false;

  return Date.now() < trial.expiresAt;
}

export function getTrialRemaining(trial) {
  if (!isTrialActive(trial)) return 0;

  return trial.expiresAt - Date.now();
}
