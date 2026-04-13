import { describe, it, expect } from 'vitest';
import { randomizeCombos } from '../randomize.js';

describe('randomizeCombos', () => {
  const noExpansions = { invadersFromAfar: false, riseOfFenris: false };
  const allExpansions = { invadersFromAfar: true, riseOfFenris: true };

  it('returns the correct number of combos', () => {
    const combos = randomizeCombos(3, noExpansions);
    expect(combos).toHaveLength(3);
  });

  it('each combo has faction, mat, currentBid 0, holderId null', () => {
    const combos = randomizeCombos(2, noExpansions);
    for (const combo of combos) {
      expect(combo).toHaveProperty('faction');
      expect(combo).toHaveProperty('mat');
      expect(combo.currentBid).toBe(0);
      expect(combo.holderId).toBeNull();
    }
  });

  it('uses only base factions when no expansions enabled', () => {
    const baseFactions = ['polania', 'saxony', 'crimea', 'nordic', 'rusviet'];
    for (let i = 0; i < 20; i++) {
      const combos = randomizeCombos(5, noExpansions);
      for (const combo of combos) {
        expect(baseFactions).toContain(combo.faction);
      }
    }
  });

  it('can include Invaders from Afar factions when enabled', () => {
    const ifaFactions = ['albion', 'togawa'];
    let foundIfa = false;
    for (let i = 0; i < 50; i++) {
      const combos = randomizeCombos(7, { invadersFromAfar: true, riseOfFenris: false });
      if (combos.some(c => ifaFactions.includes(c.faction))) {
        foundIfa = true;
        break;
      }
    }
    expect(foundIfa).toBe(true);
  });

  it('can include Rise of Fenris factions when enabled', () => {
    const rofFactions = ['fenris', 'vesna'];
    let foundRof = false;
    for (let i = 0; i < 50; i++) {
      const combos = randomizeCombos(7, { invadersFromAfar: false, riseOfFenris: true });
      if (combos.some(c => rofFactions.includes(c.faction))) {
        foundRof = true;
        break;
      }
    }
    expect(foundRof).toBe(true);
  });

  it('uses unique factions (no duplicates)', () => {
    for (let i = 0; i < 20; i++) {
      const combos = randomizeCombos(5, allExpansions);
      const factions = combos.map(c => c.faction);
      expect(new Set(factions).size).toBe(factions.length);
    }
  });

  it('uses unique mats (no duplicates)', () => {
    for (let i = 0; i < 20; i++) {
      const combos = randomizeCombos(5, allExpansions);
      const mats = combos.map(c => c.mat);
      expect(new Set(mats).size).toBe(mats.length);
    }
  });

  it('never produces banned combos (Rusviet/Industrial, Crimea/Patriotic)', () => {
    for (let i = 0; i < 100; i++) {
      const combos = randomizeCombos(5, noExpansions);
      for (const combo of combos) {
        const isBanned =
          (combo.faction === 'rusviet' && combo.mat === 'industrial') ||
          (combo.faction === 'crimea' && combo.mat === 'patriotic');
        expect(isBanned).toBe(false);
      }
    }
  });
});
