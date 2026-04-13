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
