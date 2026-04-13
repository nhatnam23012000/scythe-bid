// Faction emblems using original Scythe game art as blended watermarks.

const EMBLEM_PATHS = {
  polania: '/factions/polania.png',
  saxony: '/factions/saxony.png',
  crimea: '/factions/crimea.png',
  nordic: '/factions/nordic.png',
  rusviet: '/factions/rusviet.png',
  albion: '/factions/albion.png',
  togawa: '/factions/togawa.png',
  fenris: '/factions/fenris.png',
  vesna: '/factions/vesna.png',
};

export function FactionEmblem({ factionId, className }) {
  const src = EMBLEM_PATHS[factionId];
  if (!src) return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
}
