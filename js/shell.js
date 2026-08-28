const ICONS = {
  facebook: `<svg viewBox="3 3 44 44" aria-hidden="true"><path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877.188,4.512.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588l-.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" fill="currentColor"/></svg>`,
  x: `<svg viewBox="352.95 129.27 962.66 962.66" aria-hidden="true"><circle cx="834.28" cy="610.6" r="481.33" fill="currentColor"/><g transform="translate(52.390088,-25.058597)"><path d="M485.39,356.79l230.07,307.62L483.94,914.52h52.11l202.7-218.98l163.77,218.98h177.32L836.82,589.6l215.5-232.81h-52.11L813.54,558.46L662.71,356.79H485.39z M562.02,395.17h81.46l359.72,480.97h-81.46L562.02,395.17z" fill="var(--shell-bg)"/></g></svg>`,
  pixiv: `<svg viewBox="4 4 40 40" aria-hidden="true"><path d="M24,44C12.972,44,4,35.028,4,24S12.972,4,24,4s20,8.972,20,20S35.028,44,24,44z" fill="currentColor"/><path d="M25.301,11.01c-9.527,0-15.59,6.929-15.59,6.929l1.732,3.132h0.866V19.67c0,0,1.548-2.027,2.598-2.725V35.26h-0.866v1.732h5.197V35.26h-0.866v-4.276c1.621,0.848,3.961,1.678,6.929,1.678c8.661,0,12.992-5.123,12.992-10.393C38.292,17.146,34.828,11.01,25.301,11.01z M25.301,30.064c-3.471,0-5.776-0.771-6.929-1.285V14.722c1.878-.898,4.186-1.557,6.929-1.557c5.75,0,8.661,4.755,8.661,9.104C33.962,25.733,30.94,30.064,25.301,30.064z" fill="var(--shell-bg)"/></svg>`,
  instagram: `<svg viewBox="7 6.902 500 500" aria-hidden="true"><path d="M331.529,139.937H182.498c-23.8,0-43.14,19.34-43.14,43.14v149.008c0,23.8,19.339,43.167,43.14,43.167h149.032c23.773,0,43.141-19.367,43.141-43.167V183.077C374.67,159.276,355.303,139.937,331.529,139.937z M257,335.05c-42.705,0-77.467-34.763-77.467-77.468c0-42.705,34.763-77.467,77.467-77.467c42.732,0,77.467,34.762,77.467,77.467c0,42.705-34.762,77.468-77.467,77.468z M336.97,196.133c-10.119,0-18.333-8.211-18.333-18.33c0-10.095,8.214-18.333,18.333-18.333c10.091,0,18.333,8.238,18.333,18.333C355.303,187.922,347.061,196.133,336.97,196.133z" fill="currentColor"/><path d="M257,212.865c-24.644,0-44.718,20.047-44.718,44.717c0,24.671,20.074,44.745,44.718,44.745c24.671,0,44.745-20.074,44.745-44.745c0-24.644-20.074-44.717-44.745-44.717z" fill="currentColor"/><path d="M257,6.902c-138.07,0-250,111.93-250,250c0,138.07,111.93,250,250,250c138.07,0,250-111.93,250-250c0-138.069-111.93-250-250-250z M407.392,332.085c0,41.861-34.027,75.889-75.862,75.889H182.498c-41.834,0-75.889-34.027-75.889-75.889V183.077c0-41.831,34.055-75.886,75.889-75.886h149.032c41.835,0,75.862,34.055,75.862,75.886V332.085z" fill="currentColor"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
};

const path = window.location.pathname.replace(/\\/g, "/");
const nestedRoot = /^\/(?:characters|bloodveilpedia|chapter)(?:\/|$)/.test(path);
const ROOT = nestedRoot ? "../" : "./";

const nav = [
  ["Home", `${ROOT}index.html`, "home"],
  ["Main Story", `${ROOT}chapter/index.html`, "main-story"],
  ["Characters", `${ROOT}characters/index.html`, "characters"],
  ["Bloodveilpedia", `${ROOT}bloodveilpedia/index.html`, "bloodveilpedia"]
];

function getActivePage() {
  const path = window.location.pathname.replace(/\\/g, "/");
  if (path.includes("/bloodveilpedia/")) return "bloodveilpedia";
  if (path.includes("/characters/")) return "characters";
  if (/\/chapter(?:\/|$)/.test(path)) return "main-story";
  if (/\/index\.html$/.test(path) || path.endsWith("/")) return "home";
  return "";
}

function linkMarkup([label, href, key]) {
  const active = getActivePage() === key;
  return `<a href="${href}" data-nav-key="${key}"${active ? ` aria-current="page"` : ""}>${label}</a>`;
}

function shellMarkup() {
  return `
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="${ROOT}index.html" aria-label="Bloodveil Dawn home">
        <span class="site-brand__icon" aria-hidden="true"><img src="${ROOT}assets/icon.png" alt=""></span>
        <span class="site-brand__name">Bloodveil Dawn</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation">${nav.map(linkMarkup).join("")}</nav>
      <button class="site-menu-toggle" type="button" aria-label="Open navigation" aria-controls="site-mobile-nav" aria-expanded="false">${ICONS.menu}</button>
    </div>
  </header>
  <div class="site-mobile-overlay" data-mobile-close hidden></div>
  <aside class="site-mobile-nav" id="site-mobile-nav" aria-label="Mobile navigation" aria-hidden="true">
    <div class="site-mobile-nav__top"><span>Menu</span><button type="button" class="site-mobile-nav__close" data-mobile-close aria-label="Close navigation">${ICONS.close}</button></div>
    <nav>${nav.map(linkMarkup).join("")}</nav>
  </aside>
  `;
}

function footerMarkup() {
  return `<footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand"><a class="site-brand site-brand--footer" href="${ROOT}index.html"><span class="site-brand__icon" aria-hidden="true"><img src="${ROOT}assets/icon.png" alt=""></span><span class="site-brand__name">Bloodveil Dawn</span></a></div>
      <nav class="site-footer__nav" aria-label="Footer navigation">${nav.map(linkMarkup).join("")}</nav>
      <div class="site-footer__community">
      <div class="site-footer__socials" aria-label="Social links">
        <a href="https://www.facebook.com/profile.php?id=61585494031306" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${ICONS.facebook}</a>
        <a href="https://x.com/Scinister69" target="_blank" rel="noopener noreferrer" aria-label="X">${ICONS.x}</a>
        <a href="https://www.pixiv.net/en/users/62913072" target="_blank" rel="noopener noreferrer" aria-label="Pixiv">${ICONS.pixiv}</a>
        <a href="https://www.instagram.com/scinister69" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${ICONS.instagram}</a>
      </div>
      <a class="site-footer__support" href="https://trakteer.id/setya-n-scints/tip" target="_blank" rel="noopener noreferrer"><img src="${ROOT}assets/trakteer.png" alt="" aria-hidden="true"><span>SUPPORT</span></a>
      </div>
    </div>
    <div class="site-footer__bottom">©2025 Scinister</div>
  </footer>`;
}

function initShell() {
  const main = document.querySelector("main");
  if (!main) return;
  const isReader = main.classList.contains("reader-page");
  document.body.classList.toggle("reader-context", isReader);
  main.insertAdjacentHTML("beforebegin", shellMarkup());
  main.insertAdjacentHTML("afterend", footerMarkup());
  const header = document.querySelector(".site-header");
  if (!isReader && header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const updateHeader = () => {
      const currentY = window.scrollY;
      if (currentY <= 12) header.classList.remove("site-header--hidden");
      else if (Math.abs(currentY - lastScrollY) >= 8) header.classList.toggle("site-header--hidden", currentY > lastScrollY);
      lastScrollY = currentY;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { window.requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });
  }
  const toggle = document.querySelector(".site-menu-toggle");
  const drawer = document.querySelector(".site-mobile-nav");
  const overlay = document.querySelector(".site-mobile-overlay");
  const closeButtons = document.querySelectorAll("[data-mobile-close]");
  let lastFocused = null;

  const setOpen = (open) => {
    if (!toggle || !drawer || !overlay) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    drawer.setAttribute("aria-hidden", String(!open));
    overlay.hidden = !open;
    document.body.classList.toggle("mobile-nav-open", open);
    if (open) {
      lastFocused = document.activeElement;
      drawer.querySelector("a, button")?.focus();
    } else {
      lastFocused?.focus?.();
      lastFocused = null;
    }
  };

  toggle?.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  closeButtons.forEach(btn => btn.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") setOpen(false);
  });
  drawer?.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusables = [...drawer.querySelectorAll("a, button")];
    if (!focusables.length) return;
    const first = focusables[0], last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}

initShell();
