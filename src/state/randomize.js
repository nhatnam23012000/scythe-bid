import { FACTIONS } from '../data/factions.js';
import { PLAYER_MATS } from '../data/playerMats.js';
import { BANNED_COMBOS } from '../data/bannedCombos.js';

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function hasBannedCombo(combos) {
  return combos.some(combo =>
    BANNED_COMBOS.some(
      banned => banned.faction === combo.faction && banned.mat === combo.mat
    )
  );
}

export function randomizeCombos(playerCount, expansions) {
  const factionPool = FACTIONS.filter(f => {
    if (f.source === 'base') return true;
    if (f.source === 'invadersFromAfar') return expansions.invadersFromAfar;
    if (f.source === 'riseOfFenris') return expansions.riseOfFenris;
    return false;
  });

  const selectedFactions = shuffle(factionPool).slice(0, playerCount);

  let combos;
  do {
    const selectedMats = shuffle(PLAYER_MATS).slice(0, playerCount);
    combos = selectedFactions.map((faction, i) => ({
      faction: faction.id,
      mat: selectedMats[i].id,
      currentBid: 0,
      holderId: null,
    }));
  } while (hasBannedCombo(combos));

  // Fenris and Vesna use another faction's home base
  const selectedIds = selectedFactions.map(f => f.id);
  const availableBases = shuffle(
    FACTIONS.filter(f => f.source !== 'riseOfFenris' && !selectedIds.includes(f.id))
  );
  let baseIdx = 0;
  combos = combos.map(combo => {
    if (combo.faction === 'fenris' || combo.faction === 'vesna') {
      return { ...combo, baseFaction: availableBases[baseIdx++].id };
    }
    return combo;
  });

  return combos;
}
