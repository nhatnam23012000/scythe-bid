# Scythe Bid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first React web app for running Scythe board game faction-mat bidding auctions on a single shared device.

**Architecture:** Single-page React app with three phase screens (Setup → Bidding → Results) driven by a `useReducer` state machine. All state is client-side. Faction-mat combos are randomized at game start with banned combo enforcement. Bidding is turn-based with auto-skip for players holding combos. Brass & Steel steampunk theme.

**Tech Stack:** React 19, Vite, Plain CSS with custom properties, Vitest for testing, Vercel for deployment.

---

## File Structure

```
scythe-bid/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root component, phase router
│   ├── App.css                     # App-level styles
│   ├── index.css                   # Global theme (CSS custom properties)
│   ├── data/
│   │   ├── factions.js             # Faction list with expansion sources
│   │   ├── playerMats.js           # Player mat list
│   │   ├── tierValues.js           # Community bid reference values
│   │   └── bannedCombos.js         # Banned faction-mat pairings
│   ├── state/
│   │   ├── gameReducer.js          # useReducer state machine
│   │   ├── randomize.js            # Combo randomization utility
│   │   └── __tests__/
│   │       ├── randomize.test.js
│   │       └── gameReducer.test.js
│   ├── components/
│   │   ├── SetupScreen.jsx
│   │   ├── SetupScreen.css
│   │   ├── BiddingScreen.jsx
│   │   ├── BiddingScreen.css
│   │   ├── TurnIndicator.jsx
│   │   ├── ComboCard.jsx
│   │   ├── ComboCard.css
│   │   ├── BidModal.jsx
│   │   ├── BidModal.css
│   │   ├── ResultsScreen.jsx
│   │   └── ResultsScreen.css
│   └── icons/
│       ├── FactionEmblems.jsx      # Low-opacity watermark SVGs
│       └── MatIcons.jsx            # Small inline SVG icons
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
└── .nvmrc
```

---

### Task 1: Project Scaffolding & Data Constants

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.nvmrc`
- Modify: `.gitignore` (add standard Vite ignores)
- Create: `vercel.json`
- Create: `src/main.jsx`
- Create: `src/data/factions.js`
- Create: `src/data/playerMats.js`
- Create: `src/data/tierValues.js`
- Create: `src/data/bannedCombos.js`

- [ ] **Step 1: Initialize Vite project and install dependencies**

Run from the `scythe-bid/` directory:

```bash
npm create vite@latest . -- --template react
npm install
npm install -D vitest
```

This scaffolds the React + Vite project. Accept overwriting existing files if prompted.

- [ ] **Step 2: Update package.json scripts to include test**

Add `"test"` script to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 4: Update index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scythe Bid</title>
    <meta name="description" content="Faction-mat bidding auction for Scythe board game" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create deployment config files**

`.nvmrc`:
```
20
```

`vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

- [ ] **Step 6: Update .gitignore**

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vercel
.vercel

# Superpowers
.superpowers/
```

- [ ] **Step 7: Create src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Create src/data/factions.js**

```js
export const FACTIONS = [
  { id: 'polania', name: 'Polania', source: 'base' },
  { id: 'saxony', name: 'Saxony', source: 'base' },
  { id: 'crimea', name: 'Crimea', source: 'base' },
  { id: 'nordic', name: 'Nordic', source: 'base' },
  { id: 'rusviet', name: 'Rusviet', source: 'base' },
  { id: 'albion', name: 'Albion', source: 'invadersFromAfar' },
  { id: 'togawa', name: 'Togawa', source: 'invadersFromAfar' },
  { id: 'fenris', name: 'Fenris', source: 'riseOfFenris' },
  { id: 'vesna', name: 'Vesna', source: 'riseOfFenris' },
];
```

- [ ] **Step 9: Create src/data/playerMats.js**

```js
export const PLAYER_MATS = [
  { id: 'industrial', name: 'Industrial' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'patriotic', name: 'Patriotic' },
  { id: 'mechanical', name: 'Mechanical' },
  { id: 'agricultural', name: 'Agricultural' },
  { id: 'militant', name: 'Militant' },
  { id: 'innovative', name: 'Innovative' },
];
```

- [ ] **Step 10: Create src/data/tierValues.js**

```js
// Community-sourced tier adjusted bid values.
// Keyed by mat ID, then faction ID. Value is the dollar amount.
// Fenris and Vesna have no community data — display "—" in the UI.
export const TIER_VALUES = {
  industrial:   { polania: 17, saxony: 15, crimea: 22, nordic: 15, rusviet: 31, albion: 4,  togawa: 5  },
  engineering:  { polania: 8,  saxony: 5,  crimea: 16, nordic: 7,  rusviet: 22, albion: 3,  togawa: 5  },
  patriotic:    { polania: 12, saxony: 10, crimea: 31, nordic: 16, rusviet: 21, albion: 8,  togawa: 11 },
  mechanical:   { polania: 11, saxony: 9,  crimea: 23, nordic: 10, rusviet: 26, albion: 1,  togawa: 0  },
  agricultural: { polania: 9,  saxony: 8,  crimea: 12, nordic: 6,  rusviet: 17, albion: 3,  togawa: 7  },
  militant:     { polania: 25, saxony: 18, crimea: 34, nordic: 10, rusviet: 30, albion: 13, togawa: 7  },
  innovative:   { polania: 24, saxony: 23, crimea: 29, nordic: 17, rusviet: 35, albion: 12, togawa: 13 },
};
```

- [ ] **Step 11: Create src/data/bannedCombos.js**

```js
export const BANNED_COMBOS = [
  { faction: 'rusviet', mat: 'industrial' },
  { faction: 'crimea', mat: 'patriotic' },
];
```

- [ ] **Step 12: Create placeholder App.jsx so dev server runs**

```jsx
export default function App() {
  return <div>Scythe Bid</div>
}
```

- [ ] **Step 13: Verify dev server starts**

Run: `npm run dev`
Expected: Vite dev server starts, page shows "Scythe Bid" in browser.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Vite + React and add data constants"
```

---

### Task 2: Randomization Utility (TDD)

**Files:**
- Create: `src/state/randomize.js`
- Create: `src/state/__tests__/randomize.test.js`

- [ ] **Step 1: Write failing tests for randomizeCombos**

Create `src/state/__tests__/randomize.test.js`:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/state/__tests__/randomize.test.js`
Expected: FAIL — `randomize.js` does not exist yet.

- [ ] **Step 3: Implement randomizeCombos**

Create `src/state/randomize.js`:

```js
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

  return combos;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/state/__tests__/randomize.test.js`
Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/state/randomize.js src/state/__tests__/randomize.test.js
git commit -m "feat: add randomizeCombos utility with banned combo enforcement"
```

---

### Task 3: Game Reducer (TDD)

**Files:**
- Create: `src/state/gameReducer.js`
- Create: `src/state/__tests__/gameReducer.test.js`

- [ ] **Step 1: Write failing tests for the game reducer**

Create `src/state/__tests__/gameReducer.test.js`:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/state/__tests__/gameReducer.test.js`
Expected: FAIL — `gameReducer.js` does not exist yet.

- [ ] **Step 3: Implement the game reducer**

Create `src/state/gameReducer.js`:

```js
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/state/__tests__/gameReducer.test.js`
Expected: All 11 tests PASS.

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS (randomize + gameReducer).

- [ ] **Step 6: Commit**

```bash
git add src/state/gameReducer.js src/state/__tests__/gameReducer.test.js
git commit -m "feat: add game reducer with bidding state machine"
```

---

### Task 4: Theme CSS & Global Styles

**Files:**
- Create: `src/index.css`

- [ ] **Step 1: Create global theme CSS**

Create `src/index.css`:

```css
:root {
  --color-bg-primary: #2c2c2c;
  --color-bg-secondary: #3a3a3a;
  --color-bg-card: rgba(60, 60, 60, 0.5);
  --color-bg-card-active: linear-gradient(180deg, rgba(184, 115, 51, 0.2), rgba(184, 115, 51, 0.05));
  --color-gold: #daa520;
  --color-gold-glow: rgba(218, 165, 32, 0.3);
  --color-copper: #b87333;
  --color-text-primary: #e8d5a3;
  --color-text-secondary: #aaa;
  --color-text-muted: #666;
  --color-border: #555;
  --color-border-active: #b87333;
  --font-heading: Georgia, 'Times New Roman', serif;
  --font-body: Georgia, 'Times New Roman', serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 50%, var(--color-bg-primary) 100%);
  color: var(--color-text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

input {
  font-family: var(--font-body);
  color: inherit;
  background: none;
  border: none;
  outline: none;
}

input::placeholder {
  color: var(--color-text-muted);
}
```

- [ ] **Step 2: Verify dev server shows styled page**

Run: `npm run dev`
Expected: Dark background with serif font renders. "Scythe Bid" text from placeholder App.jsx visible.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add Brass & Steel global theme CSS"
```

---

### Task 5: SVG Icons

**Files:**
- Create: `src/icons/FactionEmblems.jsx`
- Create: `src/icons/MatIcons.jsx`

- [ ] **Step 1: Create faction emblem SVG components**

Create `src/icons/FactionEmblems.jsx`:

```jsx
const EMBLEMS = {
  polania: (
    // Eagle silhouette
    <>
      <polygon points="50,10 40,35 25,30 32,50 18,75 50,60 82,75 68,50 75,30 60,35" />
      <polygon points="50,18 45,32 38,30 42,45 35,60 50,52 65,60 58,45 62,30 55,32" fill="var(--color-bg-primary)" />
    </>
  ),
  saxony: (
    // Iron cross / shield
    <>
      <path d="M50,12 L65,30 L80,30 L80,55 L65,70 L50,88 L35,70 L20,55 L20,30 L35,30 Z" />
      <line x1="50" y1="28" x2="50" y2="72" stroke="var(--color-bg-primary)" strokeWidth="6" />
      <line x1="30" y1="48" x2="70" y2="48" stroke="var(--color-bg-primary)" strokeWidth="6" />
    </>
  ),
  crimea: (
    // Crescent and star
    <>
      <path d="M30,50 A25,25 0 1,1 50,80 A20,20 0 1,0 30,50" />
      <polygon points="70,25 72,33 80,33 74,38 76,46 70,42 64,46 66,38 60,33 68,33" />
    </>
  ),
  nordic: (
    // Compass rose / snowflake
    <>
      <line x1="50" y1="10" x2="50" y2="90" strokeWidth="4" stroke="currentColor" />
      <line x1="10" y1="50" x2="90" y2="50" strokeWidth="4" stroke="currentColor" />
      <line x1="22" y1="22" x2="78" y2="78" strokeWidth="3" stroke="currentColor" />
      <line x1="78" y1="22" x2="22" y2="78" strokeWidth="3" stroke="currentColor" />
      <circle cx="50" cy="50" r="8" />
      <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  rusviet: (
    // Bear silhouette
    <>
      <circle cx="50" cy="32" r="16" />
      <ellipse cx="50" cy="60" rx="24" ry="20" />
      <circle cx="38" cy="22" r="7" />
      <circle cx="62" cy="22" r="7" />
      <ellipse cx="38" cy="78" rx="5" ry="8" />
      <ellipse cx="62" cy="78" rx="5" ry="8" />
    </>
  ),
  albion: (
    // Crown
    <>
      <path d="M20,65 L20,40 L35,55 L50,30 L65,55 L80,40 L80,65 Z" />
      <rect x="20" y="65" width="60" height="12" rx="2" />
      <circle cx="35" cy="35" r="4" />
      <circle cx="50" cy="22" r="4" />
      <circle cx="65" cy="35" r="4" />
    </>
  ),
  togawa: (
    // Torii gate
    <>
      <rect x="22" y="30" width="8" height="55" rx="2" />
      <rect x="70" y="30" width="8" height="55" rx="2" />
      <rect x="15" y="25" width="70" height="8" rx="3" />
      <rect x="20" y="40" width="60" height="5" rx="2" />
      <path d="M12,25 Q50,12 88,25" fill="none" stroke="currentColor" strokeWidth="4" />
    </>
  ),
  fenris: (
    // Wolf head
    <>
      <polygon points="25,20 35,50 25,80 50,65 75,80 65,50 75,20 60,40 50,30 40,40" />
      <circle cx="40" cy="42" r="3" fill="var(--color-bg-primary)" />
      <circle cx="60" cy="42" r="3" fill="var(--color-bg-primary)" />
    </>
  ),
  vesna: (
    // Mechanical butterfly / gears
    <>
      <circle cx="50" cy="50" r="8" />
      <ellipse cx="32" cy="38" rx="16" ry="12" transform="rotate(-20 32 38)" />
      <ellipse cx="68" cy="38" rx="16" ry="12" transform="rotate(20 68 38)" />
      <ellipse cx="35" cy="62" rx="12" ry="10" transform="rotate(15 35 62)" />
      <ellipse cx="65" cy="62" rx="12" ry="10" transform="rotate(-15 65 62)" />
      <line x1="50" y1="42" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
    </>
  ),
};

export function FactionEmblem({ factionId, className }) {
  const emblem = EMBLEMS[factionId];
  if (!emblem) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {emblem}
    </svg>
  );
}
```

- [ ] **Step 2: Create mat icon SVG components**

Create `src/icons/MatIcons.jsx`:

```jsx
const ICONS = {
  industrial: (
    // Gear/cog
    <>
      <path d="M12,1 L12,3.5 A8.5,8.5 0 0,1 14.5,4.2 L16.3,2.5 L17.7,3.9 L16,5.8 A8.5,8.5 0 0,1 16.5,8 L19,8 L19,10 L16.5,10 A8.5,8.5 0 0,1 16,12.2 L17.7,14.1 L16.3,15.5 L14.5,13.8 A8.5,8.5 0 0,1 12,14.5 L12,17 L10,17 L10,14.5 A8.5,8.5 0 0,1 7.5,13.8 L5.7,15.5 L4.3,14.1 L6,12.2 A8.5,8.5 0 0,1 5.5,10 L3,10 L3,8 L5.5,8 A8.5,8.5 0 0,1 6,5.8 L4.3,3.9 L5.7,2.5 L7.5,4.2 A8.5,8.5 0 0,1 10,3.5 L10,1 Z" />
      <circle cx="11" cy="9" r="3" fill="var(--color-bg-primary, #2c2c2c)" />
    </>
  ),
  engineering: (
    // Wrench
    <path d="M5,15.5 L3,13.5 L10,6.5 A4,4 0 1,1 11.5,8 L5,15.5 Z M14,3 L17,3 L17,5 L15.5,5 L14.5,6 L15.5,7 L17,7 L17,9 L14,9 A4,4 0 0,1 14,3 Z" />
  ),
  patriotic: (
    // Flag
    <>
      <rect x="3" y="2" width="2" height="16" rx="0.5" />
      <path d="M5,2 L17,2 L14,5.5 L17,9 L5,9 Z" />
    </>
  ),
  mechanical: (
    // Robot/mech head
    <>
      <rect x="4" y="6" width="14" height="10" rx="2" />
      <circle cx="8" cy="11" r="2" fill="var(--color-bg-primary, #2c2c2c)" />
      <circle cx="14" cy="11" r="2" fill="var(--color-bg-primary, #2c2c2c)" />
      <rect x="9" y="2" width="4" height="4" rx="1" />
      <rect x="2" y="9" width="2" height="4" rx="0.5" />
      <rect x="18" y="9" width="2" height="4" rx="0.5" />
    </>
  ),
  agricultural: (
    // Wheat stalk
    <>
      <line x1="11" y1="18" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="8" cy="6" rx="2.5" ry="4" transform="rotate(-20 8 6)" />
      <ellipse cx="14" cy="6" rx="2.5" ry="4" transform="rotate(20 14 6)" />
      <ellipse cx="7" cy="11" rx="2" ry="3.5" transform="rotate(-25 7 11)" />
      <ellipse cx="15" cy="11" rx="2" ry="3.5" transform="rotate(25 15 11)" />
    </>
  ),
  militant: (
    // Crossed swords
    <>
      <line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="17" x2="3" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="15" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="15" x2="11" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="3" r="1.5" />
      <circle cx="3" cy="3" r="1.5" />
    </>
  ),
  innovative: (
    // Lightbulb
    <>
      <path d="M11,2 A6,6 0 0,1 17,8 C17,11 14,12 14,14 L8,14 C8,12 5,11 5,8 A6,6 0 0,1 11,2 Z" />
      <rect x="8" y="15" width="6" height="2" rx="0.5" />
      <rect x="9" y="17.5" width="4" height="1" rx="0.5" />
      <line x1="11" y1="6" x2="11" y2="10" stroke="var(--color-bg-primary, #2c2c2c)" strokeWidth="1" />
      <line x1="9" y1="8" x2="13" y2="8" stroke="var(--color-bg-primary, #2c2c2c)" strokeWidth="1" />
    </>
  ),
};

export function MatIcon({ matId, className }) {
  const icon = ICONS[matId];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 22 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/icons/FactionEmblems.jsx src/icons/MatIcons.jsx
git commit -m "feat: add faction emblem and mat icon SVG components"
```

---

### Task 6: SetupScreen Component

**Files:**
- Create: `src/components/SetupScreen.jsx`
- Create: `src/components/SetupScreen.css`

- [ ] **Step 1: Create SetupScreen.css**

```css
.setup-screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.setup-header {
  text-align: center;
  margin-bottom: 32px;
}

.setup-header h1 {
  font-family: var(--font-heading);
  color: var(--color-gold);
  font-size: 28px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.setup-header .subtitle {
  color: var(--color-text-muted);
  font-size: 13px;
}

.setup-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-copper), var(--color-gold), var(--color-copper));
  margin-bottom: 32px;
  border-radius: 2px;
}

.setup-section {
  margin-bottom: 28px;
}

.setup-section h2 {
  font-family: var(--font-heading);
  color: var(--color-copper);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

/* Player count buttons */
.player-count-buttons {
  display: flex;
  gap: 8px;
}

.player-count-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  transition: all 0.2s;
}

.player-count-btn.active {
  border-color: var(--color-gold);
  color: var(--color-gold);
  background: rgba(218, 165, 32, 0.15);
}

/* Player name inputs */
.player-name-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-name-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: border-color 0.2s;
}

.player-name-input:focus {
  border-color: var(--color-copper);
}

/* Expansion toggles */
.expansion-toggles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.expansion-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  transition: all 0.2s;
}

.expansion-toggle.active {
  border-color: var(--color-copper);
  background: rgba(184, 115, 51, 0.1);
}

.expansion-toggle-info h3 {
  color: var(--color-text-primary);
  font-size: 14px;
  margin-bottom: 2px;
}

.expansion-toggle-info p {
  color: var(--color-text-muted);
  font-size: 12px;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--color-border);
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle-switch.active {
  background: var(--color-copper);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-text-primary);
  transition: transform 0.2s;
}

.toggle-switch.active::after {
  transform: translateX(20px);
}

/* Base factions display */
.base-factions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.base-faction-tag {
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
  background: rgba(85, 85, 85, 0.3);
}

/* Start button */
.start-bidding-btn {
  width: 100%;
  padding: 14px;
  border: 2px solid var(--color-gold);
  border-radius: 8px;
  background: rgba(218, 165, 32, 0.15);
  color: var(--color-gold);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.2s;
  margin-top: 8px;
}

.start-bidding-btn:hover:not(:disabled) {
  background: rgba(218, 165, 32, 0.25);
}

.start-bidding-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.validation-hint {
  color: var(--color-copper);
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
}
```

- [ ] **Step 2: Create SetupScreen.jsx**

```jsx
import { FACTIONS } from '../data/factions.js';
import './SetupScreen.css';

export default function SetupScreen({ state, dispatch }) {
  const { playerCount, players, expansions } = state;

  const availableFactions = FACTIONS.filter(f => {
    if (f.source === 'base') return true;
    if (f.source === 'invadersFromAfar') return expansions.invadersFromAfar;
    if (f.source === 'riseOfFenris') return expansions.riseOfFenris;
    return false;
  });

  const canStart = availableFactions.length >= playerCount;

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <h1>Scythe Bid</h1>
        <p className="subtitle">Faction–Mat Auction</p>
      </div>
      <div className="setup-accent-bar" />

      <div className="setup-section">
        <h2>Players</h2>
        <div className="player-count-buttons">
          {[2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              className={`player-count-btn${playerCount === n ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PLAYER_COUNT', payload: n })}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <h2>Player Names</h2>
        <div className="player-name-inputs">
          {players.map(player => (
            <input
              key={player.id}
              className="player-name-input"
              type="text"
              placeholder={`Player ${player.id + 1}`}
              value={player.name}
              onChange={e =>
                dispatch({
                  type: 'SET_PLAYER_NAME',
                  payload: { id: player.id, name: e.target.value },
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="setup-section">
        <h2>Factions</h2>
        <div className="base-factions">
          {FACTIONS.filter(f => f.source === 'base').map(f => (
            <span key={f.id} className="base-faction-tag">{f.name}</span>
          ))}
        </div>
        <div className="expansion-toggles">
          <button
            className={`expansion-toggle${expansions.invadersFromAfar ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_EXPANSION', payload: 'invadersFromAfar' })}
          >
            <div className="expansion-toggle-info">
              <h3>Invaders from Afar</h3>
              <p>Albion, Togawa</p>
            </div>
            <div className={`toggle-switch${expansions.invadersFromAfar ? ' active' : ''}`} />
          </button>
          <button
            className={`expansion-toggle${expansions.riseOfFenris ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_EXPANSION', payload: 'riseOfFenris' })}
          >
            <div className="expansion-toggle-info">
              <h3>Rise of Fenris</h3>
              <p>Fenris, Vesna</p>
            </div>
            <div className={`toggle-switch${expansions.riseOfFenris ? ' active' : ''}`} />
          </button>
        </div>
      </div>

      <button
        className="start-bidding-btn"
        disabled={!canStart}
        onClick={() => dispatch({ type: 'START_BIDDING' })}
      >
        Start Bidding
      </button>
      {!canStart && (
        <p className="validation-hint">
          Need at least {playerCount} factions for {playerCount} players. Enable an expansion.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SetupScreen.jsx src/components/SetupScreen.css
git commit -m "feat: add SetupScreen component with player config and expansion toggles"
```

---

### Task 7: TurnIndicator & ComboCard Components

**Files:**
- Create: `src/components/TurnIndicator.jsx`
- Create: `src/components/ComboCard.jsx`
- Create: `src/components/ComboCard.css`

- [ ] **Step 1: Create TurnIndicator component**

Create `src/components/TurnIndicator.jsx`:

```jsx
export default function TurnIndicator({ player }) {
  const displayName = player.name || `Player ${player.id + 1}`;
  return (
    <div className="turn-indicator">
      <span className="turn-gear">&#9881;</span> {displayName}'s Turn
    </div>
  );
}
```

Styling for TurnIndicator will live in `BiddingScreen.css` (it's a small element).

- [ ] **Step 2: Create ComboCard.css**

Create `src/components/ComboCard.css`:

```css
.combo-card {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  padding: 12px 12px 12px 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
}

.combo-card.has-bid {
  background: linear-gradient(180deg, rgba(184, 115, 51, 0.2), rgba(184, 115, 51, 0.05));
  border-color: var(--color-border-active);
}

.combo-card:active {
  transform: scale(0.98);
}

/* Faction emblem watermark */
.combo-card .faction-emblem {
  position: absolute;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  opacity: 0.12;
  color: var(--color-gold);
  pointer-events: none;
}

/* Left zone: faction + mat info */
.combo-info {
  flex: 1;
  min-width: 0;
}

.combo-faction-name {
  color: var(--color-gold);
  font-size: 15px;
  font-weight: bold;
  font-family: var(--font-heading);
}

.combo-mat-name {
  color: var(--color-copper);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.combo-mat-name .mat-icon {
  width: 14px;
  height: 14px;
  color: var(--color-copper);
}

/* Center zone: tier value */
.combo-tier {
  text-align: center;
  padding: 0 10px;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  min-width: 52px;
}

.combo-tier-label {
  color: var(--color-text-muted);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.combo-tier-value {
  color: var(--color-copper);
  font-size: 14px;
  font-family: var(--font-heading);
}

/* Right zone: bid info */
.combo-bid {
  text-align: right;
  min-width: 72px;
}

.combo-bid-amount {
  color: var(--color-gold);
  font-size: 15px;
  font-family: var(--font-heading);
  font-weight: bold;
}

.combo-bid-holder {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.combo-no-bid {
  color: var(--color-text-muted);
  font-size: 12px;
}
```

- [ ] **Step 3: Create ComboCard component**

Create `src/components/ComboCard.jsx`:

```jsx
import { TIER_VALUES } from '../data/tierValues.js';
import { FactionEmblem } from '../icons/FactionEmblems.jsx';
import { MatIcon } from '../icons/MatIcons.jsx';
import { FACTIONS } from '../data/factions.js';
import { PLAYER_MATS } from '../data/playerMats.js';
import './ComboCard.css';

export default function ComboCard({ combo, players, onTap }) {
  const faction = FACTIONS.find(f => f.id === combo.faction);
  const mat = PLAYER_MATS.find(m => m.id === combo.mat);
  const tierValue = TIER_VALUES[combo.mat]?.[combo.faction];
  const holder = combo.holderId !== null
    ? players.find(p => p.id === combo.holderId)
    : null;
  const holderName = holder
    ? (holder.name || `Player ${holder.id + 1}`)
    : null;

  return (
    <div
      className={`combo-card${combo.holderId !== null ? ' has-bid' : ''}`}
      onClick={onTap}
    >
      <FactionEmblem factionId={combo.faction} className="faction-emblem" />

      <div className="combo-info">
        <div className="combo-faction-name">{faction?.name}</div>
        <div className="combo-mat-name">
          <MatIcon matId={combo.mat} className="mat-icon" />
          {mat?.name}
        </div>
      </div>

      <div className="combo-tier">
        <div className="combo-tier-label">Tier</div>
        <div className="combo-tier-value">
          {tierValue !== undefined ? `$${tierValue}` : '—'}
        </div>
      </div>

      <div className="combo-bid">
        {combo.holderId !== null ? (
          <>
            <div className="combo-bid-amount">${combo.currentBid}</div>
            <div className="combo-bid-holder">{holderName}</div>
          </>
        ) : (
          <div className="combo-no-bid">No bid</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/TurnIndicator.jsx src/components/ComboCard.jsx src/components/ComboCard.css
git commit -m "feat: add TurnIndicator and ComboCard components"
```

---

### Task 8: BidModal Component

**Files:**
- Create: `src/components/BidModal.jsx`
- Create: `src/components/BidModal.css`

- [ ] **Step 1: Create BidModal.css**

```css
.bid-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.bid-modal {
  background: linear-gradient(135deg, #2c2c2c, #3a3a3a);
  border: 2px solid var(--color-copper);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
}

.bid-modal-accent {
  height: 3px;
  background: linear-gradient(90deg, var(--color-copper), var(--color-gold), var(--color-copper));
  margin: -24px -24px 20px -24px;
  border-radius: 10px 10px 0 0;
}

.bid-modal h3 {
  color: var(--color-gold);
  font-family: var(--font-heading);
  font-size: 18px;
  margin-bottom: 4px;
}

.bid-modal-mat {
  color: var(--color-copper);
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.bid-modal-mat .mat-icon {
  width: 14px;
  height: 14px;
  color: var(--color-copper);
}

.bid-modal-current {
  color: var(--color-text-secondary);
  font-size: 13px;
  margin-bottom: 16px;
}

.bid-modal-current span {
  color: var(--color-gold);
  font-weight: bold;
}

.bid-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.bid-input-prefix {
  color: var(--color-gold);
  font-size: 20px;
  font-weight: bold;
}

.bid-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.bid-input:focus {
  border-color: var(--color-gold);
}

.bid-modal-buttons {
  display: flex;
  gap: 10px;
}

.bid-modal-buttons button {
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.bid-cancel-btn {
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
}

.bid-confirm-btn {
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  background: rgba(218, 165, 32, 0.15);
}

.bid-confirm-btn:hover:not(:disabled) {
  background: rgba(218, 165, 32, 0.25);
}

.bid-confirm-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bid-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: -12px;
  margin-bottom: 12px;
}
```

- [ ] **Step 2: Create BidModal component**

Create `src/components/BidModal.jsx`:

```jsx
import { useState } from 'react';
import { FACTIONS } from '../data/factions.js';
import { PLAYER_MATS } from '../data/playerMats.js';
import { MatIcon } from '../icons/MatIcons.jsx';
import './BidModal.css';

export default function BidModal({ combo, onConfirm, onCancel }) {
  const [bidValue, setBidValue] = useState('');
  const faction = FACTIONS.find(f => f.id === combo.faction);
  const mat = PLAYER_MATS.find(m => m.id === combo.mat);

  const isUnclaimed = combo.holderId === null;
  const minBid = isUnclaimed ? 0 : combo.currentBid + 1;
  const parsed = bidValue === '' ? NaN : parseInt(bidValue, 10);
  const isValid = !isNaN(parsed) && parsed >= minBid;

  function handleConfirm() {
    if (isValid) {
      onConfirm(parsed);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && isValid) {
      handleConfirm();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  }

  return (
    <div className="bid-modal-overlay" onClick={onCancel}>
      <div className="bid-modal" onClick={e => e.stopPropagation()}>
        <div className="bid-modal-accent" />
        <h3>{faction?.name}</h3>
        <div className="bid-modal-mat">
          <MatIcon matId={combo.mat} className="mat-icon" />
          {mat?.name}
        </div>
        <div className="bid-modal-current">
          {isUnclaimed ? (
            'No current bid — start at any amount'
          ) : (
            <>Current bid: <span>${combo.currentBid}</span> — must bid higher</>
          )}
        </div>
        <div className="bid-input-group">
          <span className="bid-input-prefix">$</span>
          <input
            className="bid-input"
            type="number"
            min={minBid}
            value={bidValue}
            onChange={e => setBidValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={String(minBid)}
            autoFocus
          />
        </div>
        {bidValue !== '' && !isValid && (
          <p className="bid-error">Bid must be at least ${minBid}</p>
        )}
        <div className="bid-modal-buttons">
          <button className="bid-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="bid-confirm-btn"
            disabled={!isValid}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BidModal.jsx src/components/BidModal.css
git commit -m "feat: add BidModal component with bid validation"
```

---

### Task 9: BiddingScreen Component

**Files:**
- Create: `src/components/BiddingScreen.jsx`
- Create: `src/components/BiddingScreen.css`

- [ ] **Step 1: Create BiddingScreen.css**

```css
.bidding-screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
}

.bidding-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-copper), var(--color-gold), var(--color-copper));
  margin-bottom: 16px;
  border-radius: 2px;
}

.turn-indicator {
  text-align: center;
  padding: 10px;
  background: rgba(218, 165, 32, 0.15);
  border: 1px solid var(--color-gold);
  border-radius: 6px;
  margin-bottom: 16px;
  color: var(--color-gold);
  font-family: var(--font-heading);
  font-size: 15px;
}

.turn-gear {
  font-size: 16px;
}

.combo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```

- [ ] **Step 2: Create BiddingScreen component**

Create `src/components/BiddingScreen.jsx`:

```jsx
import { useState } from 'react';
import TurnIndicator from './TurnIndicator.jsx';
import ComboCard from './ComboCard.jsx';
import BidModal from './BidModal.jsx';
import './BiddingScreen.css';

export default function BiddingScreen({ state, dispatch }) {
  const [selectedComboIndex, setSelectedComboIndex] = useState(null);
  const currentPlayer = state.players[state.currentPlayerIndex];

  function handleComboTap(index) {
    setSelectedComboIndex(index);
  }

  function handleBidConfirm(amount) {
    dispatch({
      type: 'PLACE_BID',
      payload: {
        comboIndex: selectedComboIndex,
        playerId: currentPlayer.id,
        amount,
      },
    });
    setSelectedComboIndex(null);
  }

  function handleBidCancel() {
    setSelectedComboIndex(null);
  }

  return (
    <div className="bidding-screen">
      <div className="bidding-accent-bar" />
      <TurnIndicator player={currentPlayer} />

      <div className="combo-list">
        {state.combos.map((combo, index) => (
          <ComboCard
            key={index}
            combo={combo}
            players={state.players}
            onTap={() => handleComboTap(index)}
          />
        ))}
      </div>

      {selectedComboIndex !== null && (
        <BidModal
          combo={state.combos[selectedComboIndex]}
          onConfirm={handleBidConfirm}
          onCancel={handleBidCancel}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BiddingScreen.jsx src/components/BiddingScreen.css
git commit -m "feat: add BiddingScreen composing TurnIndicator, ComboCard, and BidModal"
```

---

### Task 10: ResultsScreen Component

**Files:**
- Create: `src/components/ResultsScreen.jsx`
- Create: `src/components/ResultsScreen.css`

- [ ] **Step 1: Create ResultsScreen.css**

```css
.results-screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.results-header {
  text-align: center;
  margin-bottom: 8px;
}

.results-header h1 {
  font-family: var(--font-heading);
  color: var(--color-gold);
  font-size: 24px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.results-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-copper), var(--color-gold), var(--color-copper));
  margin-bottom: 24px;
  border-radius: 2px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 28px;
}

.results-table th {
  color: var(--color-copper);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 6px;
  text-align: left;
  border-bottom: 2px solid var(--color-copper);
}

.results-table td {
  padding: 10px 6px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.results-faction {
  color: var(--color-gold);
  font-weight: bold;
  font-family: var(--font-heading);
}

.results-mat {
  color: var(--color-copper);
  display: flex;
  align-items: center;
  gap: 4px;
}

.results-mat .mat-icon {
  width: 14px;
  height: 14px;
  color: var(--color-copper);
}

.results-winner {
  color: var(--color-text-primary);
}

.results-deduction {
  color: var(--color-gold);
  font-weight: bold;
  font-family: var(--font-heading);
}

.restart-btn {
  width: 100%;
  padding: 14px;
  border: 2px solid var(--color-copper);
  border-radius: 8px;
  background: rgba(184, 115, 51, 0.15);
  color: var(--color-copper);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.2s;
}

.restart-btn:hover {
  background: rgba(184, 115, 51, 0.25);
}
```

- [ ] **Step 2: Create ResultsScreen component**

Create `src/components/ResultsScreen.jsx`:

```jsx
import { FACTIONS } from '../data/factions.js';
import { PLAYER_MATS } from '../data/playerMats.js';
import { MatIcon } from '../icons/MatIcons.jsx';
import './ResultsScreen.css';

export default function ResultsScreen({ state, dispatch }) {
  return (
    <div className="results-screen">
      <div className="results-header">
        <h1>Auction Results</h1>
      </div>
      <div className="results-accent-bar" />

      <table className="results-table">
        <thead>
          <tr>
            <th>Faction</th>
            <th>Mat</th>
            <th>Winner</th>
            <th>-$</th>
          </tr>
        </thead>
        <tbody>
          {state.combos.map((combo, i) => {
            const faction = FACTIONS.find(f => f.id === combo.faction);
            const mat = PLAYER_MATS.find(m => m.id === combo.mat);
            const holder = state.players.find(p => p.id === combo.holderId);
            const holderName = holder
              ? (holder.name || `Player ${holder.id + 1}`)
              : '—';

            return (
              <tr key={i}>
                <td className="results-faction">{faction?.name}</td>
                <td>
                  <div className="results-mat">
                    <MatIcon matId={combo.mat} className="mat-icon" />
                    {mat?.name}
                  </div>
                </td>
                <td className="results-winner">{holderName}</td>
                <td className="results-deduction">${combo.currentBid}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        className="restart-btn"
        onClick={() => dispatch({ type: 'RESTART' })}
      >
        New Game
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ResultsScreen.jsx src/components/ResultsScreen.css
git commit -m "feat: add ResultsScreen with summary table and restart"
```

---

### Task 11: App Shell & Final Integration

**Files:**
- Modify: `src/App.jsx`
- Create: `src/App.css`

- [ ] **Step 1: Create App.css**

```css
.app {
  min-height: 100vh;
  min-height: 100dvh;
}
```

- [ ] **Step 2: Wire up App.jsx with reducer and phase routing**

Replace `src/App.jsx`:

```jsx
import { useReducer } from 'react';
import { gameReducer, initialState } from './state/gameReducer.js';
import SetupScreen from './components/SetupScreen.jsx';
import BiddingScreen from './components/BiddingScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div className="app">
      {state.phase === 'setup' && (
        <SetupScreen state={state} dispatch={dispatch} />
      )}
      {state.phase === 'bidding' && (
        <BiddingScreen state={state} dispatch={dispatch} />
      )}
      {state.phase === 'results' && (
        <ResultsScreen state={state} dispatch={dispatch} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Delete Vite scaffolded files that are no longer needed**

Remove any leftover Vite template files:

```bash
rm -f src/App.css.bak src/assets/react.svg public/vite.svg
```

(Only delete files that exist — skip if already gone.)

- [ ] **Step 4: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS.

- [ ] **Step 5: Run dev server and test manually**

Run: `npm run dev`

Test the full flow in a mobile browser or responsive mode:

1. **Setup screen:** Select player count 3, enter names, toggle Invaders from Afar on, click Start Bidding
2. **Bidding screen:** Verify 3 combo cards appear with faction emblems, mat icons, tier values. Tap a combo, enter bid, confirm. Verify turn advances. Test outbidding. Verify auction ends when all combos are claimed.
3. **Results screen:** Verify table shows faction, mat, winner, deduction. Click New Game to restart.

- [ ] **Step 6: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors. Output in `dist/`.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/App.css
git commit -m "feat: wire up App shell with phase routing — app is fully functional"
```

---

## Post-Implementation Checklist

After all tasks are complete, verify:

- [ ] All tests pass: `npx vitest run`
- [ ] Dev server runs: `npm run dev`
- [ ] Production build succeeds: `npm run build`
- [ ] Full bidding flow works on mobile viewport
- [ ] Banned combos (Rusviet/Industrial, Crimea/Patriotic) never appear
- [ ] Tier values show correctly (and "—" for Fenris/Vesna combos)
- [ ] Faction emblem watermarks visible on left side of combo cards
- [ ] Mat icons display next to mat names
- [ ] Auto-skip works for players holding combos
- [ ] Auction ends correctly when all combos are claimed
- [ ] Results table shows correct deductions
- [ ] Restart returns to setup screen
