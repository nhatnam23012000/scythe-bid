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
