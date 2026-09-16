// hamburger.js — hamburgermenyn (mobil-navigering)
//
// JS-driven (inte CSS-only checkbox-hack) för att undvika ordnings-
// beroendet i HTML:en som annars kan göra att funktionen tyst slutar
// fungera om någon flyttar om markupen. Se dark-mode-test/README.md
// för en fullständig jämförelse mot CSS-only-varianten.

const navToggleBtn = document.getElementById('navToggleBtn');
const navbarMenu = document.getElementById('navbarMenu');

function isMenuOpen() {
  return navbarMenu.classList.contains('is-open');
}

function openMenu() {
  navbarMenu.classList.add('is-open');
  navToggleBtn.classList.add('is-open');
  navToggleBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  navbarMenu.classList.remove('is-open');
  navToggleBtn.classList.remove('is-open');
  navToggleBtn.setAttribute('aria-expanded', 'false');
}

navToggleBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  isMenuOpen() ? closeMenu() : openMenu();
});

// Klick utanför menyn stänger den
document.addEventListener('click', (event) => {
  if (!isMenuOpen()) return;
  const clickedInside = navbarMenu.contains(event.target) || navToggleBtn.contains(event.target);
  if (!clickedInside) closeMenu();
});

// Escape stänger menyn och flyttar fokus tillbaka till knappen
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen()) {
    closeMenu();
    navToggleBtn.focus();
  }
});

// Bredda fönstret över mobil-brytpunkten medan menyn är öppen? Stäng den.
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && isMenuOpen()) closeMenu();
});
