import { randomizeCombos } from './randomize.js';

export const initialState = {
  phase: 'setup',
  playerCount: 2,
  players: [
    { id: 0, name: '' },
    { id: 1, name: '' },
  ],
  expansions: { invadersFromAfar: false, riseOfFenris: false },
  combos: [],
  currentPlayerIndex: 0,
};

function advanceToNextBidder(state) {
  let nextIndex = state.currentPlayerIndex;
  const { players, combos } = state;

  for (let i = 0; i < players.length; i++) {
    nextIndex = (nextIndex + 1) % players.length;
    const holdsCombo = combos.some(c => c.holderId === players[nextIndex].id);
    if (!holdsCombo) {
      return { ...state, currentPlayerIndex: nextIndex };
    }
  }

  // All players hold a combo — auction is over
  return { ...state, phase: 'results' };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PLAYER_COUNT': {
      const count = action.payload;
      const players = Array.from({ length: count }, (_, i) => ({
        id: i,
        name: state.players[i]?.name || '',
      }));
      return { ...state, playerCount: count, players };
    }

    case 'SET_PLAYER_NAME': {
      const { id, name } = action.payload;
      const players = state.players.map(p =>
        p.id === id ? { ...p, name } : p
      );
      return { ...state, players };
    }

    case 'TOGGLE_EXPANSION': {
      const key = action.payload;
      return {
        ...state,
        expansions: {
          ...state.expansions,
          [key]: !state.expansions[key],
        },
      };
    }

    case 'START_BIDDING': {
      const combos = randomizeCombos(state.playerCount, state.expansions);
      return {
        ...state,
        phase: 'bidding',
        combos,
        currentPlayerIndex: 0,
      };
    }

    case 'PLACE_BID': {
      const { comboIndex, playerId, amount } = action.payload;
      const combos = state.combos.map((combo, i) => {
        if (i === comboIndex) {
          return { ...combo, currentBid: amount, holderId: playerId };
        }
        return combo;
      });
      return advanceToNextBidder({ ...state, combos });
    }

    case 'RESTART':
      return initialState;

    default:
      return state;
  }
}
