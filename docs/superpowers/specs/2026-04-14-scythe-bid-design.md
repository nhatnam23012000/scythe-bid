# Scythe Bid — Design Spec

A mobile-first web app for running Scythe board game faction-mat bidding auctions. No login required. Passed around the table on a single device.

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Plain CSS with CSS custom properties
- **Deployment:** Vercel (zero-config, same as existing sidelane projects)
- **State management:** `useReducer` for the bidding state machine

## Theme: Brass & Steel

- **Background:** Dark steel grey (`#2c2c2c` → `#3a3a3a` gradient)
- **Primary accent:** Gold (`#daa520`)
- **Secondary accent:** Copper/brass (`#b87333`)
- **Typography:** Georgia, serif — uppercase headings with letter-spacing
- **Borders/dividers:** Copper or muted grey (`#555`)
- **Top accent bar:** Horizontal gradient stripe (`#b87333` → `#daa520` → `#b87333`)
- **Overall feel:** 1920s Europa steampunk, mech engineering blueprints

## Screens

### Screen 1 — Game Setup

**Purpose:** Configure players and faction pool before starting the auction.

**Elements:**
- **Player count selector:** Buttons for 2–7 players
- **Player name inputs:** Dynamically generated text inputs based on player count. Default placeholder names ("Player 1", "Player 2", etc.)
- **Expansion toggles:** Two toggle switches:
  - "Invaders from Afar" → adds Albion and Togawa to the faction pool
  - "Rise of Fenris" → adds Fenris and Vesna to the faction pool
- **Base factions:** Always included (Polania, Saxony, Crimea, Nordic, Rusviet) — shown as locked/always-on
- **Validation:** Number of available factions must be >= number of players. If not, disable "Start Bidding" and show a hint.
- **"Start Bidding" button:** Triggers randomization and transitions to Screen 2

**Randomization logic (on start):**
1. Build faction pool: base 5 + toggled expansion factions
2. Shuffle and pick N factions (N = player count)
3. Shuffle all 7 player mats, pick N unique mats
4. Pair each faction with a mat
5. Check for banned combos (Rusviet/Industrial, Crimea/Patriotic). If found, reshuffle mats and re-pair. Repeat until no banned combos exist.

### Screen 2 — Bidding

**Purpose:** Run the auction. Shared view — everyone sees the same screen, phone is passed around.

**Layout:** Vertical card list (mobile-first, scrollable).

**Turn indicator:** Bar at the top showing whose turn it is: "⚙ Player N's Turn — [Name]"

**Combo cards:** Each row displays:
- **Left zone:** Low-opacity faction emblem SVG as watermark background. The emblem sits in its own space (row has `padding-left` to prevent overlap with text).
- **Faction name:** Gold, bold, Georgia serif
- **Mat name:** Copper, smaller, with mat icon prefix (inline SVG)
- **Center zone (bordered):** Tier value label ("TIER") + dollar amount from reference table
- **Right zone:** Current highest bid amount (gold, bold) + bidder name. Or "No bid" if unclaimed.

**Styling states for combo rows:**
- **Has a bid:** Copper gradient background, copper border
- **No bid:** Dark grey background, muted border
- **Currently being bid on (active):** Highlighted border or glow effect

**Bid interaction:**
- Tap a combo row to open a bid modal/bottom sheet
- Modal shows: combo info (faction + mat), current bid to beat, number input, Confirm + Cancel buttons
- Validation: bid must be > current bid (or >= 0 if unclaimed)
- On confirm: update combo state, advance turn

**Turn order:** Players bid in the order they were entered during setup, cycling through rounds.

**Turn logic:**
1. Check if current player already holds a combo that hasn't been outbid → auto-skip, increment skip counter
2. If skip counter equals number of players → auction over, transition to Results
3. If player does not hold a combo (unassigned), they **must** bid — either outbid someone or claim an unclaimed combo at $0. They cannot pass.
4. On bid placed: update combo's `currentBid` and `holderId`. If someone was previously holding that combo, they lose it (become unassigned). Reset skip counter to 0. Advance to next player.

### Screen 3 — Results

**Purpose:** Show final auction outcomes so players know their faction-mat assignment and score deduction.

**Elements:**
- **Summary table:** Faction | Player Mat | Winner | Coin Deduction
- **"Restart" button:** Returns to Screen 1 (full reset)

## Component Structure

```
App
├── SetupScreen
│   ├── PlayerCountSelector
│   ├── PlayerNameInputs
│   └── ExpansionToggles
├── BiddingScreen
│   ├── TurnIndicator
│   ├── ComboCard (×N)
│   └── BidModal
└── ResultsScreen
    └── ResultsTable
```

## State Shape (useReducer)

```
{
  phase: "setup" | "bidding" | "results",
  players: [{ id: number, name: string }],
  combos: [{
    faction: string,
    mat: string,
    currentBid: number,
    holderId: number | null
  }],
  currentPlayerIndex: number,
  skippedCount: number
}
```

**Actions:**
- `SET_PLAYERS` — update player count and names
- `START_BIDDING` — randomize combos, transition to bidding phase
- `PLACE_BID` — update a combo's bid and holder, handle outbid logic, advance turn
- `SKIP_TURN` — auto-skip for players holding a combo, advance turn
- `END_AUCTION` — transition to results phase
- `RESTART` — reset everything back to setup

## Data Constants

### Factions

| Faction | Source |
|---------|--------|
| Polania | Base |
| Saxony | Base |
| Crimea | Base |
| Nordic | Base |
| Rusviet | Base |
| Albion | Invaders from Afar |
| Togawa | Invaders from Afar |
| Fenris | Rise of Fenris |
| Vesna | Rise of Fenris |

### Player Mats

| Mat | Icon |
|-----|------|
| Industrial | Gear/cog |
| Engineering | Wrench |
| Patriotic | Flag |
| Mechanical | Robot/mech |
| Agricultural | Wheat/grain |
| Militant | Crossed swords |
| Innovative | Lightbulb |

### Tier Values (community reference, display only)

**Note:** Fenris and Vesna (Rise of Fenris) do not have community tier values. If a combo includes Fenris or Vesna, display "—" in the tier column.

| Mat \ Faction | Polania | Saxony | Crimea | Nordic | Rusviet | Albion | Togawa |
|---------------|---------|--------|--------|--------|---------|--------|--------|
| Industrial | $17 | $15 | $22 | $15 | $31 | $4 | $5 |
| Engineering | $8 | $5 | $16 | $7 | $22 | $3 | $5 |
| Patriotic | $12 | $10 | $31 | $16 | $21 | $8 | $11 |
| Mechanical | $11 | $9 | $23 | $10 | $26 | $1 | $0 |
| Agricultural | $9 | $8 | $12 | $6 | $17 | $3 | $7 |
| Militant | $25 | $18 | $34 | $10 | $30 | $13 | $7 |
| Innovative | $24 | $23 | $29 | $17 | $35 | $12 | $13 |

### Banned Combinations

- Rusviet + Industrial
- Crimea + Patriotic

If randomization produces a banned combo, reshuffle mats and re-pair until no banned combos exist.

## Iconography

**Faction emblems:** Inline SVG silhouettes used as low-opacity (10-12%) watermarks positioned on the left side of each combo row. Each faction gets a unique emblem representing its identity (bear for Rusviet, eagle for Polania, etc.).

**Mat icons:** Small inline SVGs displayed next to the mat name:
- Industrial → gear/cog
- Engineering → wrench
- Patriotic → flag
- Mechanical → robot/mech
- Agricultural → wheat/grain
- Militant → crossed swords
- Innovative → lightbulb

## Visual Design Details

**Combo row layout (bidding screen):**
- Row with `position: relative; overflow: hidden`
- Faction emblem SVG: `position: absolute; left: -5px; opacity: 0.12; width: 65px`
- Row `padding-left: 60px` to give emblem its own space
- Three zones: faction+mat (left, flex), tier value (center, bordered), bid+holder (right)

**Bid modal:**
- Bottom sheet or centered modal overlay
- Shows combo being bid on (faction + mat)
- Shows current bid to beat
- Number input for bid amount
- Confirm and Cancel buttons
- Steampunk-styled with brass borders and dark background

## Project Structure

```
scythe-bid/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── SetupScreen.jsx
│   │   ├── BiddingScreen.jsx
│   │   ├── ComboCard.jsx
│   │   ├── BidModal.jsx
│   │   ├── ResultsScreen.jsx
│   │   └── TurnIndicator.jsx
│   ├── data/
│   │   ├── factions.js
│   │   ├── playerMats.js
│   │   ├── tierValues.js
│   │   └── bannedCombos.js
│   ├── hooks/
│   │   └── useGameReducer.js
│   └── icons/
│       ├── factionEmblems.jsx
│       └── matIcons.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
└── .nvmrc
```

## Deployment

- Vercel zero-config deployment (same as duneImperiumLeaderRandomizer)
- `vercel.json` for SPA routing
- `.nvmrc` for Node version
- `.vercelignore` for clean deploys
