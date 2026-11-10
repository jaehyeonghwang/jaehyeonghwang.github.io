const header = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const backdrop = document.querySelector(".menu-backdrop");
const ANALYTICS_ENDPOINT =
  "https://jaehyeong-analytics.ghkdwogud852.workers.dev/collect";
const VISITOR_ID_KEY = "jaehyeong_visitor_id";

const getVisitorId = () => {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = globalThis.crypto?.randomUUID?.();
      if (!visitorId) {
        const bytes = new Uint8Array(16);
        globalThis.crypto.getRandomValues(bytes);
        visitorId = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
      }
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  } catch {
    return "";
  }
};

const visitorId = getVisitorId();

const track = (action, target = "") => {
  const payload = JSON.stringify({
    action,
    target,
    path: window.location.pathname,
    visitorId,
  });
  const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
  if (navigator.sendBeacon) {
    if (navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)) return;
  }
  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    mode: "cors",
  }).catch(() => {});
};

document
  .querySelectorAll(".award-news-item[data-award-url]")
  .forEach((awardRow) => {
    const awardUrl = awardRow.dataset.awardUrl;
    let hoverTracked = false;
    awardRow.addEventListener("mouseenter", () => {
      if (!hoverTracked) {
        hoverTracked = true;
        track("award_hover", awardUrl);
      }
    });
    awardRow.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        track("external_link", awardUrl);
        return;
      }
      track("external_link", awardUrl);
      window.open(awardUrl, "_blank", "noopener,noreferrer");
    });
    awardRow.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest("a")) return;
      event.preventDefault();
      track("external_link", awardUrl);
      window.open(awardUrl, "_blank", "noopener,noreferrer");
    });
  });

track("page_view");

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
});

const setMenuState = (isOpen) => {
  navigation?.classList.toggle("is-open", isOpen);
  backdrop?.classList.toggle("is-visible", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  document.body.classList.toggle("menu-open", isOpen);
};

menuToggle?.addEventListener("click", () => {
  setMenuState(!navigation?.classList.contains("is-open"));
});

backdrop?.addEventListener("click", () => setMenuState(false));
navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    track("menu_click", link.getAttribute("href") || link.textContent.trim());
    setMenuState(false);
  });
});

document.querySelectorAll(".publication-item").forEach((link) => {
  link.addEventListener("click", () =>
    track(
      "publication_click",
      link.getAttribute("href") || link.textContent.trim(),
    ),
  );
});

document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
  link.addEventListener("click", () =>
    track("cv_download", link.getAttribute("href") || "CV"),
  );
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuState(false);
});
