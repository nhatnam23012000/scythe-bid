export default function TurnIndicator({ player }) {
  const displayName = player.name || `Player ${player.id + 1}`;
  return (
    <div className="turn-indicator">
      <span className="turn-gear">&#9881;</span> {displayName}'s Turn
    </div>
  );
}
