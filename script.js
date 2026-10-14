const header = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const backdrop = document.querySelector('.menu-backdrop');
const ANALYTICS_ENDPOINT = 'https://jaehyeong-analytics.ghkdwogud852.workers.dev/collect';

const track = (action, target = '') => {
  const payload = JSON.stringify({ action, target, path: window.location.pathname });
  const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
  if (navigator.sendBeacon) {
    if (navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)) return;
  }
  fetch(ANALYTICS_ENDPOINT, { method: 'POST', body: payload, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, keepalive: true, mode: 'cors' }).catch(() => {});
};

const awardText = document.querySelector('.news-list li:first-child > span:last-child');
const awardName = awardText?.querySelector('.award-highlight');
const awardPercent = awardText?.querySelector('.percent-highlight');
if (awardText && awardName && awardPercent) {
  const awardRow = awardText.closest('li');
  const awardLink = document.createElement('a');
  awardLink.className = 'award-highlight';
  awardLink.href = 'https://www.ieeeismar.net/2026/awards/#paper-awards-section';
  awardLink.target = '_blank';
  awardLink.rel = 'noopener noreferrer';
  awardLink.title = 'IEEE ISMAR 2026 Best Paper Award';
  awardLink.style.textDecoration = 'none';
  awardLink.append(awardName.textContent, ' ', awardPercent);
  awardName.replaceWith(awardLink);
  awardLink.addEventListener('click', () => track('external_link', awardLink.href));
  let hoverTracked = false;
  awardRow?.classList.add('award-news-item');
  awardRow?.addEventListener('mouseenter', () => {
    if (!hoverTracked) {
      hoverTracked = true;
      track('award_hover', awardLink.href);
    }
  });
  awardRow?.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    track('external_link', awardLink.href);
    window.open(awardLink.href, '_blank', 'noopener,noreferrer');
  });
}

const hapticsAwardUrl = 'https://haptics.or.kr/conference/2026/award.php';
const hapticsAwardRow = [...document.querySelectorAll('.news-list li')]
  .find((row) => row.textContent.includes('Best Paper Honorable Mention Award'));
if (hapticsAwardRow) {
  let hoverTracked = false;
  hapticsAwardRow.classList.add('award-news-item');
  hapticsAwardRow.addEventListener('mouseenter', () => {
    if (!hoverTracked) {
      hoverTracked = true;
      track('award_hover', hapticsAwardUrl);
    }
  });
  hapticsAwardRow.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    track('external_link', hapticsAwardUrl);
    window.open(hapticsAwardUrl, '_blank', 'noopener,noreferrer');
  });
}

track('page_view');

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
  link.addEventListener('click', () => {
    track('menu_click', link.getAttribute('href') || link.textContent.trim());
    setMenuState(false);
  });
});

document.querySelectorAll('.publication-item').forEach((link) => {
  link.addEventListener('click', () => track('publication_click', link.getAttribute('href') || link.textContent.trim()));
});

document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
  link.addEventListener('click', () => track('cv_download', link.getAttribute('href') || 'CV'));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});
