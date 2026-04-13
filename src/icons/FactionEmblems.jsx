// Placeholder SVG emblems — simple geometric shapes, one per faction.
// Replace with real artwork later.

const emblems = {
  // Circle
  polania: (
    <circle cx="50" cy="50" r="40" />
  ),
  // Square
  saxony: (
    <rect x="10" y="10" width="80" height="80" />
  ),
  // Triangle (up)
  crimea: (
    <polygon points="50,10 90,90 10,90" />
  ),
  // Diamond
  nordic: (
    <polygon points="50,5 95,50 50,95 5,50" />
  ),
  // Pentagon
  rusviet: (
    <polygon points="50,5 95,35 78,90 22,90 5,35" />
  ),
  // Hexagon
  albion: (
    <polygon points="50,5 93,27 93,73 50,95 7,73 7,27" />
  ),
  // Cross / plus
  togawa: (
    <>
      <rect x="35" y="5" width="30" height="90" />
      <rect x="5" y="35" width="90" height="30" />
    </>
  ),
  // Star (6-point)
  fenris: (
    <>
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
    </>
  ),
  // Triangle (down)
  vesna: (
    <polygon points="50,90 10,10 90,10" />
  ),
};

export function FactionEmblem({ factionId, className }) {
  const shape = emblems[factionId] ?? <circle cx="50" cy="50" r="40" />;
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {shape}
    </svg>
  );
}
