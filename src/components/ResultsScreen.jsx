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
                <td className="results-faction">
                  {faction?.name}
                  {combo.baseFaction && (
                    <span className="results-base-faction">
                      {' '}({FACTIONS.find(f => f.id === combo.baseFaction)?.name} base)
                    </span>
                  )}
                </td>
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
