const header = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const backdrop = document.querySelector('.menu-backdrop');

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
});

const setMenuState = (isOpen) => {
  navigation?.classList.toggle('is-open', isOpen);
  backdrop?.classList.toggle('is-visible', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  document.body.classList.toggle('menu-open', isOpen);
};

menuToggle?.addEventListener('click', () => {
  setMenuState(!navigation?.classList.contains('is-open'));
});

backdrop?.addEventListener('click', () => setMenuState(false));
navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});
