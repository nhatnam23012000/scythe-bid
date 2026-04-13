// Player mat icons using emoji for simplicity.

const icons = {
  industrial: '⚙️',
  engineering: '🔧',
  patriotic: '🏴',
  mechanical: '🤖',
  agricultural: '🌾',
  militant: '⚔️',
  innovative: '💡',
};

export function MatIcon({ matId, className }) {
  const emoji = icons[matId] ?? '❓';
  return (
    <span className={className} aria-hidden="true" role="img">
      {emoji}
    </span>
  );
}
