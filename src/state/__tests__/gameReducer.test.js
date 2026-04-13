import { describe, it, expect, vi } from 'vitest';
import { gameReducer, initialState } from '../gameReducer.js';

// Mock randomizeCombos so tests are deterministic
vi.mock('../randomize.js', () => ({
  randomizeCombos: (count) =>
    Array.from({ length: count }, (_, i) => ({
      faction: ['polania', 'saxony', 'crimea', 'nordic', 'rusviet'][i],
      mat: ['industrial', 'engineering', 'patriotic', 'mechanical', 'agricultural'][i],
      currentBid: 0,
      holderId: null,
    })),
}));

describe('gameReducer', () => {
  describe('SET_PLAYER_COUNT', () => {
    it('updates player count and resizes players array', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_COUNT',
        payload: 4,
      });
      expect(state.playerCount).toBe(4);
      expect(state.players).toHaveLength(4);
      expect(state.players[3]).toEqual({ id: 3, name: '' });
    });

    it('preserves existing player names when increasing count', () => {
      let state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        payload: { id: 0, name: 'Alice' },
      });
      state = gameReducer(state, {
        type: 'SET_PLAYER_COUNT',
        payload: 4,
      });
      expect(state.players[0].name).toBe('Alice');
    });

    it('trims players when decreasing count', () => {
      let state = gameReducer(initialState, {
        type: 'SET_PLAYER_COUNT',
        payload: 5,
      });
      state = gameReducer(state, {
        type: 'SET_PLAYER_COUNT',
        payload: 2,
      });
      expect(state.players).toHaveLength(2);
    });
  });

  describe('SET_PLAYER_NAME', () => {
    it('updates the correct player name', () => {
      const state = gameReducer(initialState, {
        type: 'SET_PLAYER_NAME',
        payload: { id: 1, name: 'Bob' },
      });
      expect(state.players[1].name).toBe('Bob');
      expect(state.players[0].name).toBe('');
    });
  });

  describe('TOGGLE_EXPANSION', () => {
    it('toggles invadersFromAfar', () => {
      const state = gameReducer(initialState, {
        type: 'TOGGLE_EXPANSION',
        payload: 'invadersFromAfar',
      });
      expect(state.expansions.invadersFromAfar).toBe(true);
    });

    it('toggles back off', () => {
      let state = gameReducer(initialState, {
        type: 'TOGGLE_EXPANSION',
        payload: 'invadersFromAfar',
      });
      state = gameReducer(state, {
        type: 'TOGGLE_EXPANSION',
        payload: 'invadersFromAfar',
      });
      expect(state.expansions.invadersFromAfar).toBe(false);
    });
  });

  describe('START_BIDDING', () => {
    it('sets phase to bidding and creates combos', () => {
      const state = gameReducer(initialState, { type: 'START_BIDDING' });
      expect(state.phase).toBe('bidding');
      expect(state.combos).toHaveLength(2);
      expect(state.currentPlayerIndex).toBe(0);
    });
  });

  describe('PLACE_BID', () => {
    function startedGame() {
      let state = gameReducer(initialState, {
        type: 'SET_PLAYER_COUNT',
        payload: 3,
      });
      state = gameReducer(state, { type: 'START_BIDDING' });
      return state;
    }

    it('updates combo bid and holder', () => {
      let state = startedGame();
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 0, amount: 5 },
      });
      expect(state.combos[0].currentBid).toBe(5);
      expect(state.combos[0].holderId).toBe(0);
    });

    it('advances to the next player', () => {
      let state = startedGame();
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 0, amount: 5 },
      });
      expect(state.currentPlayerIndex).toBe(1);
    });

    it('skips players who hold a combo', () => {
      let state = startedGame();
      // Player 0 bids on combo 0
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 0, amount: 5 },
      });
      // Player 1 bids on combo 1
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 1, playerId: 1, amount: 3 },
      });
      // Should skip player 0 (holds combo 0) and go to player 2
      expect(state.currentPlayerIndex).toBe(2);
    });

    it('when outbidding, previous holder becomes unassigned', () => {
      let state = startedGame();
      // Player 0 bids on combo 0
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 0, amount: 5 },
      });
      // Player 1 bids on combo 1
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 1, playerId: 1, amount: 3 },
      });
      // Player 2 outbids player 0 on combo 0
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 2, amount: 8 },
      });
      expect(state.combos[0].holderId).toBe(2);
      expect(state.combos[0].currentBid).toBe(8);
      // Player 0 is now unassigned, so it should be their turn
      expect(state.currentPlayerIndex).toBe(0);
    });

    it('ends auction when all players hold a combo', () => {
      let state = startedGame();
      // Player 0 bids on combo 0
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 0, playerId: 0, amount: 5 },
      });
      // Player 1 bids on combo 1
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 1, playerId: 1, amount: 3 },
      });
      // Player 2 bids on combo 2
      state = gameReducer(state, {
        type: 'PLACE_BID',
        payload: { comboIndex: 2, playerId: 2, amount: 0 },
      });
      expect(state.phase).toBe('results');
    });
  });

  describe('RESTART', () => {
    it('resets to initial state', () => {
      let state = gameReducer(initialState, { type: 'START_BIDDING' });
      state = gameReducer(state, { type: 'RESTART' });
      expect(state).toEqual(initialState);
    });
  });
});
