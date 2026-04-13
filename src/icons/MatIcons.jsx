// Placeholder SVG mat icons — dead-simple 2-3 element shapes.
// Replace with real artwork later.
// viewBox="0 0 22 20"

const icons = {
  // Gear: circle + ring hint
  industrial: (
    <>
      <circle cx="11" cy="10" r="4" />
      <circle cx="11" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </>
  ),
  // Wrench: rectangle + circle
  engineering: (
    <>
      <rect x="9" y="2" width="4" height="16" rx="2" />
      <circle cx="11" cy="3" r="3" />
    </>
  ),
  // Flag: pole + triangle
  patriotic: (
    <>
      <line x1="5" y1="2" x2="5" y2="18" stroke="currentColor" strokeWidth="2" />
      <polygon points="5,2 17,7 5,12" />
    </>
  ),
  // Robot face: rect + two dots
  mechanical: (
    <>
      <rect x="4" y="5" width="14" height="11" rx="2" />
      <circle cx="8" cy="10" r="1.5" fill="var(--color-bg-card, #1a1a1a)" />
      <circle cx="14" cy="10" r="1.5" fill="var(--color-bg-card, #1a1a1a)" />
    </>
  ),
  // Wheat: vertical line + leaf ovals
  agricultural: (
    <>
      <line x1="11" y1="2" x2="11" y2="18" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="8" cy="8" rx="3" ry="5" transform="rotate(-30 8 8)" />
      <ellipse cx="14" cy="8" rx="3" ry="5" transform="rotate(30 14 8)" />
    </>
  ),
  // Swords: two diagonal lines crossing
  militant: (
    <>
      <line x1="3" y1="3" x2="19" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="19" y1="3" x2="3" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  // Lightbulb: circle + small rectangle base
  innovative: (
    <>
      <circle cx="11" cy="8" r="5" />
      <rect x="8" y="13" width="6" height="4" rx="1" />
    </>
  ),
};

export function MatIcon({ matId, className }) {
  const shape = icons[matId] ?? <circle cx="11" cy="10" r="7" />;
  return (
    <svg
      viewBox="0 0 22 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {shape}
    </svg>
  );
}
