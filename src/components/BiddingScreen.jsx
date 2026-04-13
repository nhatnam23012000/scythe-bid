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
