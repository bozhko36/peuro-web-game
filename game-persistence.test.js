const test = require("node:test");
const assert = require("node:assert/strict");

const {
  sanitizeGameState,
  serializeGameState
} = require("./game-persistence.js");

test("sanitizeGameState keeps valid saved values", () => {
  const state = sanitizeGameState({
    slides: 420,
    playerLevel: 7,
    swipeExp: 13,
    successfulSwipes: 91,
    prestigeLevel: 3,
    upgradeLevels: {
      speed: 2,
      count: 4,
      mart: 5
    },
    abilityState: {
      golden: { unlocked: true, cooldownUntil: 100, activeUntil: 50 },
      autoCollector: { unlocked: true, cooldownUntil: 200, activeUntil: 0 },
      lucky: { unlocked: true, cooldownUntil: 0, activeUntil: 0 },
      business: { unlocked: false, cooldownUntil: 0, activeUntil: 300 },
      royal: { unlocked: true, cooldownUntil: 400, activeUntil: 350 }
    }
  });

  assert.deepEqual(state, {
    slides: 420,
    playerLevel: 7,
    swipeExp: 13,
    successfulSwipes: 91,
    prestigeLevel: 3,
    upgradeLevels: {
      speed: 2,
      count: 4,
      mart: 5
    },
    abilityState: {
      golden: { unlocked: true, cooldownUntil: 100, activeUntil: 50 },
      autoCollector: { unlocked: true, cooldownUntil: 200, activeUntil: 0 },
      lucky: { unlocked: true, cooldownUntil: 0, activeUntil: 0 },
      business: { unlocked: false, cooldownUntil: 0, activeUntil: 300 },
      royal: { unlocked: true, cooldownUntil: 400, activeUntil: 350 }
    }
  });
});

test("sanitizeGameState falls back for invalid values", () => {
  const state = sanitizeGameState({
    slides: -10,
    playerLevel: "oops",
    swipeExp: Infinity,
    successfulSwipes: null,
    prestigeLevel: 999,
    upgradeLevels: {
      speed: 88,
      count: -3,
      mart: 6.8
    },
    abilityState: {
      golden: { unlocked: "yes", cooldownUntil: -1, activeUntil: Infinity },
      autoCollector: null,
      lucky: { unlocked: 1, cooldownUntil: "soon", activeUntil: 5.8 },
      business: "bad",
      royal: { unlocked: false, cooldownUntil: 900.9, activeUntil: -10 }
    }
  });

  assert.deepEqual(state, {
    slides: 0,
    playerLevel: 0,
    swipeExp: 0,
    successfulSwipes: 0,
    prestigeLevel: 5,
    upgradeLevels: {
      speed: 50,
      count: 0,
      mart: 6
    },
    abilityState: {
      golden: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
      autoCollector: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
      lucky: { unlocked: false, cooldownUntil: 0, activeUntil: 5 },
      business: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
      royal: { unlocked: false, cooldownUntil: 900, activeUntil: 0 }
    }
  });
});

test("serializeGameState wraps a versioned payload", () => {
  const payload = serializeGameState({
    slides: 77,
    playerLevel: 3,
    swipeExp: 19,
    successfulSwipes: 22,
    prestigeLevel: 2,
    upgradeLevels: {
      speed: 1,
      count: 2,
      mart: 4
    },
    abilityState: {
      golden: { unlocked: true, cooldownUntil: 11, activeUntil: 22 },
      autoCollector: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
      lucky: { unlocked: true, cooldownUntil: 0, activeUntil: 0 },
      business: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
      royal: { unlocked: true, cooldownUntil: 33, activeUntil: 44 }
    }
  });

  assert.equal(typeof payload, "string");
  assert.deepEqual(JSON.parse(payload), {
    version: 1,
    state: {
      slides: 77,
      playerLevel: 3,
      swipeExp: 19,
      successfulSwipes: 22,
      prestigeLevel: 2,
      upgradeLevels: {
        speed: 1,
        count: 2,
        mart: 4
      },
      abilityState: {
        golden: { unlocked: true, cooldownUntil: 11, activeUntil: 22 },
        autoCollector: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
        lucky: { unlocked: true, cooldownUntil: 0, activeUntil: 0 },
        business: { unlocked: false, cooldownUntil: 0, activeUntil: 0 },
        royal: { unlocked: true, cooldownUntil: 33, activeUntil: 44 }
      }
    }
  });
});
