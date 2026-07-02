export const theme = {
  bg: '#050505',
  pinkSoft: '#ff8fb1',
  pinkDeep: '#ff4d6d',
  brandRed: '#ff003c',
};

export function applyTheme() {
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  if (!root) return;
  root.style.setProperty('--bg-color', theme.bg);
  root.style.setProperty('--color-pink-soft', theme.pinkSoft);
  root.style.setProperty('--color-pink-deep', theme.pinkDeep);
  root.style.setProperty('--color-brand-red', theme.brandRed);
}

export default theme;
