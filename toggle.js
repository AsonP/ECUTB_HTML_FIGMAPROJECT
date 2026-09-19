// toggle.js — Dark/Light mode-växlingen
//
// JS-driven av samma anledning som hamburgermenyn (se hamburger.js):
// undviker ordningsberoendet ett CSS-only checkbox-hack skulle haft.

const body = document.body;
const themeToggleBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  body.setAttribute('data-theme', theme);
  themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

themeToggleBtn.addEventListener('click', () => {
  const current = body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});
