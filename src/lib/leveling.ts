export function calculateXpToNextLevel(level: number): number {
  return (level + 1) * 20;
}

export function addExperience(level: number, xp: number, amount: number) {
  let nextLevel = level;
  let nextXp = xp + amount;

  while (nextXp >= calculateXpToNextLevel(nextLevel)) {
    nextXp -= calculateXpToNextLevel(nextLevel);
    nextLevel += 1;
  }

  return { level: nextLevel, xp: nextXp };
}
