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
      }
    }
  });
});
