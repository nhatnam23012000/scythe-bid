// Faction emblems using original Scythe game art as blended watermarks.

const EMBLEM_PATHS = {
  polania: '/factions/polania.webp',
  saxony: '/factions/saxony.webp',
  crimea: '/factions/crimea.webp',
  nordic: '/factions/nordic.webp',
  rusviet: '/factions/rusviet.webp',
  albion: '/factions/albion.webp',
  togawa: '/factions/togawa.webp',
  fenris: '/factions/fenris.webp',
  vesna: '/factions/vesna.webp',
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
