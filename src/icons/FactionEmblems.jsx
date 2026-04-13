// Faction emblem SVG silhouettes based on Scythe game art.
// Used as low-opacity watermarks on combo cards.

const emblems = {
  // Polania — Rampant bear
  polania: (
    <path d="M62,85 L62,70 Q65,65 68,60 L72,55 Q75,50 73,45 L70,40 Q68,38 70,35 L73,30 Q75,27 73,24 L70,22 Q67,20 65,22 L62,25 Q60,28 58,25 L55,20 Q52,16 48,18 L45,22 Q42,25 40,22 L37,18 Q34,15 31,18 L28,22 Q26,26 28,30 L32,35 Q34,38 32,42 L28,48 Q25,55 28,62 L30,65 Q32,68 30,72 L28,78 Q26,82 30,85 Z M42,35 A3,3 0 1,0 48,35 A3,3 0 1,0 42,35 M55,42 Q58,45 56,48 L50,52 Q46,54 42,52 L38,48" />
  ),
  // Saxony — Gas mask skull
  saxony: (
    <>
      <path d="M50,12 Q30,12 22,28 Q14,44 22,56 L26,60 L26,75 Q26,82 34,82 L38,82 L38,72 Q38,68 42,68 L58,68 Q62,68 62,72 L62,82 L66,82 Q74,82 74,75 L74,60 L78,56 Q86,44 78,28 Q70,12 50,12 Z" />
      <circle cx="38" cy="40" r="10" fill="var(--color-bg-primary, #2c2c2c)" />
      <circle cx="62" cy="40" r="10" fill="var(--color-bg-primary, #2c2c2c)" />
      <circle cx="38" cy="40" r="5" />
      <circle cx="62" cy="40" r="5" />
    </>
  ),
  // Crimea — Rearing horse
  crimea: (
    <path d="M55,88 L52,72 Q50,65 52,58 L55,50 Q58,42 56,35 L54,30 Q52,26 55,22 L58,18 Q60,15 58,12 L55,10 Q52,8 50,12 L48,16 Q45,12 42,10 L40,12 Q38,15 40,18 L44,22 Q46,26 44,30 L40,38 Q36,45 38,52 L42,58 Q44,62 42,68 L38,88 Z M35,52 L28,58 Q24,62 26,68 L28,72 M62,48 L68,52 Q72,55 74,60 L72,65" />
  ),
  // Nordic — Thor's hammer (Mjolnir)
  nordic: (
    <>
      <rect x="46" y="10" width="8" height="35" rx="2" />
      <rect x="42" y="8" width="16" height="8" rx="3" />
      <path d="M28,48 L72,48 L72,78 Q72,85 65,85 L35,85 Q28,85 28,78 Z" />
      <path d="M36,55 L64,55 L64,60 L36,60 Z" fill="var(--color-bg-primary, #2c2c2c)" />
      <path d="M42,65 Q50,72 58,65" fill="none" stroke="var(--color-bg-primary, #2c2c2c)" strokeWidth="3" />
      <path d="M38,74 Q50,80 62,74" fill="none" stroke="var(--color-bg-primary, #2c2c2c)" strokeWidth="2" />
    </>
  ),
  // Rusviet — Five-pointed star
  rusviet: (
    <polygon points="50,8 61,38 94,38 67,56 77,88 50,70 23,88 33,56 6,38 39,38" />
  ),
  // Albion — Celtic boar with spiral
  albion: (
    <>
      <path d="M18,60 Q15,50 20,42 Q25,34 32,32 L36,30 Q38,26 42,24 L48,22 Q52,22 56,24 L62,28 Q66,30 70,28 L74,26 Q78,26 80,30 L82,34 Q84,38 82,44 L78,50 Q76,54 78,58 L82,62 Q86,68 82,74 L76,78 Q70,80 65,78 L60,74 Q55,72 50,74 L44,76 Q38,78 32,76 L26,72 Q20,68 18,60 Z" />
      <path d="M35,45 Q38,42 42,44 Q46,46 44,50 Q42,54 38,52 Q34,50 35,45 Z" fill="var(--color-bg-primary, #2c2c2c)" />
      <path d="M48,40 Q52,36 56,38 Q60,40 58,45 Q54,48 50,46 Q46,44 48,40 Z" fill="var(--color-bg-primary, #2c2c2c)" />
    </>
  ),
  // Togawa — Twin koi fish (yin-yang style)
  togawa: (
    <>
      <path d="M50,10 Q70,10 78,25 Q86,40 78,50 Q70,60 50,50 Q30,40 22,50 Q14,60 22,75 Q30,90 50,90" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M50,90 Q30,90 22,75 Q14,60 22,50 Q30,40 50,50 Q70,60 78,50 Q86,40 78,25 Q70,10 50,10" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="35" cy="68" r="5" />
      <circle cx="65" cy="32" r="5" />
      <path d="M42,82 L38,90 M46,84 L44,92" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M58,18 L62,10 M54,16 L56,8" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  // Fenris — Wolf silhouette
  fenris: (
    <path d="M20,70 Q18,60 22,52 L28,44 Q32,38 30,32 L26,24 Q24,18 28,14 L34,12 Q38,12 36,18 L35,24 Q34,28 38,30 L44,32 Q50,32 56,30 L62,28 Q66,26 65,22 L64,16 Q62,12 66,12 L72,14 Q76,18 74,24 L70,32 Q68,38 72,44 L78,52 Q82,60 80,70 L76,76 Q72,80 68,78 L62,74 Q56,72 50,74 L44,76 Q38,78 32,76 L28,74 Q22,78 20,70 Z M36,48 A2,2 0 1,0 40,48 A2,2 0 1,0 36,48 M58,48 A2,2 0 1,0 62,48 A2,2 0 1,0 58,48" />
  ),
  // Vesna — Fox face
  vesna: (
    <>
      <path d="M50,85 Q35,85 28,75 L22,65 Q18,58 22,50 L28,42 Q32,38 30,32 L24,18 Q22,12 28,14 L38,20 Q42,24 44,30 L46,35 Q48,38 50,38 Q52,38 54,35 L56,30 Q58,24 62,20 L72,14 Q78,12 76,18 L70,32 Q68,38 72,42 L78,50 Q82,58 78,65 L72,75 Q65,85 50,85 Z" />
      <path d="M38,52 L42,50 L44,54 Z" fill="var(--color-bg-primary, #2c2c2c)" />
      <path d="M62,52 L58,50 L56,54 Z" fill="var(--color-bg-primary, #2c2c2c)" />
      <circle cx="50" cy="62" r="3" fill="var(--color-bg-primary, #2c2c2c)" />
      <path d="M44,70 Q50,76 56,70" fill="none" stroke="var(--color-bg-primary, #2c2c2c)" strokeWidth="2" />
    </>
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
