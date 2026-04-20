import { TIER_VALUES } from '../data/tierValues.js';
import { FactionEmblem } from '../icons/FactionEmblems.jsx';
import { MatIcon } from '../icons/MatIcons.jsx';
import { FACTIONS } from '../data/factions.js';
import { PLAYER_MATS } from '../data/playerMats.js';
import './ComboCard.css';

export default function ComboCard({ combo, players, minTierValue, onTap }) {
  const faction = FACTIONS.find(f => f.id === combo.faction);
  const mat = PLAYER_MATS.find(m => m.id === combo.mat);
  const rawTierValue = TIER_VALUES[combo.mat]?.[combo.faction];
  const tierValue = rawTierValue !== undefined ? rawTierValue - minTierValue : undefined;
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
        <div className="combo-faction-name">
          {faction?.name}
          {combo.baseFaction && (
            <span className="combo-base-faction">
              {' '}({FACTIONS.find(f => f.id === combo.baseFaction)?.name} base)
            </span>
          )}
        </div>
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
