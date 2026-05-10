const SAVE_VERSION = 1;
const MAX_UPGRADE_LEVEL = 50;
const DEFAULT_STATE = Object.freeze({
  slides: 0,
  playerLevel: 0,
  swipeExp: 0,
  successfulSwipes: 0,
  upgradeLevels: Object.freeze({
    speed: 0,
    count: 0,
    lucky: 0,
    mart: 0
  })
});

function clampWholeNumber(value, options = {}) {
  const min = options.min ?? 0;
  const max = options.max ?? Number.MAX_SAFE_INTEGER;
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function sanitizeGameState(input) {
  const source = input && typeof input === "object" ? input : {};
  const upgrades = source.upgradeLevels && typeof source.upgradeLevels === "object"
    ? source.upgradeLevels
    : {};

  return {
    slides: clampWholeNumber(source.slides),
    playerLevel: clampWholeNumber(source.playerLevel),
    swipeExp: clampWholeNumber(source.swipeExp),
    successfulSwipes: clampWholeNumber(source.successfulSwipes),
    upgradeLevels: {
      speed: clampWholeNumber(upgrades.speed, { max: MAX_UPGRADE_LEVEL }),
      count: clampWholeNumber(upgrades.count, { max: MAX_UPGRADE_LEVEL }),
      lucky: clampWholeNumber(upgrades.lucky, { max: MAX_UPGRADE_LEVEL }),
      mart: clampWholeNumber(upgrades.mart, { max: MAX_UPGRADE_LEVEL })
    }
  };
}

function serializeGameState(state) {
  return JSON.stringify({
    version: SAVE_VERSION,
    state: sanitizeGameState(state)
  });
}

function deserializeGameState(raw) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== SAVE_VERSION) return null;
    return sanitizeGameState(parsed.state);
  } catch {
    return null;
  }
}

function readGameState(storage, key) {
  if (!storage || typeof storage.getItem !== "function") return null;
  return deserializeGameState(storage.getItem(key));
}

function writeGameState(storage, key, state) {
  if (!storage || typeof storage.setItem !== "function") return false;

  try {
    storage.setItem(key, serializeGameState(state));
    return true;
  } catch {
    return false;
  }
}

const api = {
  DEFAULT_STATE,
  SAVE_VERSION,
  sanitizeGameState,
  serializeGameState,
  deserializeGameState,
  readGameState,
  writeGameState
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (typeof window !== "undefined") {
  window.GamePersistence = api;
}
