/* =========================================================
   EDIT YOUR CONTENT HERE
   Everything that changes often (team, events, photos, email)
   lives in this CONFIG object. No HTML editing required.
   ========================================================= */
const CONFIG = {
  // Where the contact form sends messages (opens the visitor's email app).
  contactEmail: "mindsetinmotionkids@gmail.com",

  team: [
    {
      name: "Sebastian Steketee",
      role: "Founder & Lead",
      number: 1,
      photo: "",                 // e.g. "photos/founder.jpg"
      bio: "Started Mindset in Motion in the summer of 2026 to bring free, high-energy sports events to kids who don't always get the chance to play. Plans the events, builds the partnerships, and runs the show on game day."
    },
    {
      name: "Boris",
      role: "Co-Founder",
      number: 2,
      photo: "",                 // e.g. "photos/boris.jpg"
      bio: "Helped launch Mindset in Motion from day one. Runs drills, keeps the races competitive, and makes sure every kid gets in on the action."
    }
  ],

  events: [
    {
      id: "event1",
      title: "Event #1: Kickoff",
      date: "Aug 10, 2026",
      cover: "photos/huddle.jpg",   // photo shown on the event card
      partner: "Boys & Girls Club of Union County",
      status: "done",
      summary: "Our very first event. An hour of soccer games and races with the kids at the Boys & Girls Club of Union County.",
      highlights: ["Soccer games and small-sided scrimmages", "Sprint and relay races", "About an hour of nonstop action"]
    },
    {
      id: "event2",
      title: "Event #2: Back for More",
      date: "Aug 17, 2026",
      partner: "Boys & Girls Club of Union County",
      status: "done",
      summary: "We came back to the Boys & Girls Club of Union County for round two, with more games, more races and more energy.",
      highlights: ["Push-up races and fitness challenges", "Pinnie-team games", "Soccer lessons and drills"]
    },
    {
      id: "next",
      title: "Event #3: Your community?",
      date: "TBA",
      partner: "Want to host? Get in touch!",
      status: "upcoming",
      summary: "We're planning our next event and looking for new community partners. Reach out if your organization would like to host.",
      highlights: []
    }
  ],

  // Drop your images into the /photos folder and list them here.
  // event: must match an event id above. layout: "", "wide" or "tall".
  photos: [
    { src: "photos/team-photo.jpg",  caption: "The whole crew",                       event: "event1", layout: "wide" },
    { src: "photos/ball-skills.jpg", caption: "Working on first touches",             event: "event1", layout: "tall" },
    { src: "photos/pushup-race.jpg", caption: "Push-up race",                         event: "event2", layout: "tall" },
    { src: "photos/huddle.jpg",      caption: "Huddle up: hands up if you're ready",  event: "event1", layout: "wide" },
    { src: "photos/pinnies.jpg",     caption: "Picking teams",                        event: "event2", layout: "tall" }
  ],

  sports: [
    { key: "soccer",     name: "Soccer",     current: true },
    { key: "basketball", name: "Basketball" },
    { key: "tennis",     name: "Tennis" },
    { key: "volleyball", name: "Volleyball" },
    { key: "other",      name: "Something else" }
  ]
};

/* ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shortTitle = ev => ev.title.split(":")[0];

/* ---------- Motion helpers ----------
   Visitors who turn on "reduce motion" in their system settings still get
   fades and feedback, but no parallax, zooms, tilting or sliding. */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;
const EASE = "cubic-bezier(.22,1,.36,1)";
const SPRING = "cubic-bezier(.34,1.56,.64,1)";
const animate = (el, kf, o) => el.animate(kf, o);
const wait = ms => new Promise(r => setTimeout(r, ms));
const smooth = reduced ? "auto" : "smooth";
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

function countTo(el, to, dur = 900, suffix = "") {
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Little burst of confetti in the site colors, for goals, votes and messages.
const CONFETTI = ["#f0b43c", "#b5452a", "#1d4d36", "#f7f3ea", "#f0b43c"];
function confetti(x, y, count = 28, power = 1) {
  if (reduced) count = Math.round(count / 3);
  for (let i = 0; i < count; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.background = CONFETTI[i % CONFETTI.length];
    if (i % 3 === 0) { c.style.width = c.style.height = "7px"; c.style.borderRadius = "50%"; }
    document.body.appendChild(c);
    const a = (-90 + (Math.random() - .5) * 160) * Math.PI / 180;
    const v = (90 + Math.random() * 130) * power;
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v;
    const r = (Math.random() - .5) * 900;
    c.animate([
      { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${x + dx}px, ${y + dy}px) rotate(${r / 2}deg)`, opacity: 1, offset: .4 },
      { transform: `translate(${x + dx * 1.35}px, ${y + dy + 220}px) rotate(${r}deg)`, opacity: 0 }
    ], { duration: 1200 + Math.random() * 600, easing: "cubic-bezier(.2,.65,.4,1)" }).onfinish = () => c.remove();
  }
}
const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

const toastEl = $("#toast");
let toastTimer;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  try { await navigator.clipboard.writeText(b.dataset.copy); toast("Email address copied"); }
  catch { toast(b.dataset.copy); }
});

$("#year").textContent = new Date().getFullYear();

/* ---------- Nav: menu, scroll progress, hide on scroll down ---------- */
const nav = $(".nav");
const toggle = $(".nav-toggle");
function setMenu(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) nav.classList.remove("tucked");
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$(".nav-links a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("click", e => { if (nav.classList.contains("open") && !nav.contains(e.target)) setMenu(false); });

const progress = $(".progress");
const toTop = $("#toTop");
const heroMedia = $(".hero-media");
const heroImg = $(".hero-img");
const crestBall = $(".crest-ball");
let lastY = scrollY, scrollQueued = false;
function onScroll() {
  scrollQueued = false;
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  nav.classList.toggle("scrolled", y > 8);
  if (Math.abs(y - lastY) > 6) {
    if (!nav.classList.contains("open")) nav.classList.toggle("tucked", y > lastY && y > 560);
    lastY = y;
  }
  toTop.classList.toggle("show", y > 900);
  if (pending?.size) revealPassed();
  if (!reduced) {
    const h = heroMedia.offsetHeight;
    if (y < h + 200) heroImg.style.setProperty("--py", `${Math.min(y * .1, h * .05)}px`);
    crestBall.style.transform = `rotate(${y * .3}deg)`;
  }
}
addEventListener("scroll", () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); } }, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: smooth }));

// Sliding underline under the section you're reading
const navLinks = $$(".nav-links a:not(.btn)");
const indicator = $(".nav-indicator");
let activeLink = null;
function moveIndicator() {
  if (!activeLink) { indicator.style.opacity = 0; return; }
  indicator.style.opacity = 1;
  indicator.style.width = `${activeLink.offsetWidth}px`;
  indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
}
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    activeLink = navLinks.find(a => a.hash === `#${e.target.id}`) || null;
    navLinks.forEach(a => a.classList.toggle("active", a === activeLink));
    moveIndicator();
  });
}, { rootMargin: "-40% 0px -55% 0px" });
$(".hero").id ||= "hero";
["hero", "mission", "events", "gallery", "team", "involved"].forEach(id => spy.observe(document.getElementById(id)));

/* ---------- Scroll reveals ----------
   Things fade up as they come into view. Items that arrive together
   are staggered left to right. */
const onReveal = new Map();
const pending = new Set();
function show(el, delay = 0) {
  if (el.classList.contains("reveal")) el.style.setProperty("--d", `${delay}ms`);
  el.classList.add("in");
  onReveal.get(el)?.(delay);
  pending.delete(el);
  io?.unobserve(el);
}
const io = "IntersectionObserver" in window && new IntersectionObserver(entries => {
  entries.filter(e => e.isIntersecting).forEach((e, i) => show(e.target, i * 90));
}, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
function reveal(selector, fn) {
  $$(selector).forEach(el => {
    if (el.classList.contains("in")) return;
    if (!el.classList.contains("split")) el.classList.add("reveal");
    if (fn) onReveal.set(el, d => fn(el, d));
    if (!io) return show(el);
    pending.add(el);
    io.observe(el);
  });
}
// Failsafe: anything you jumped past (nav links, End key) is shown, so scrolling back up never finds blanks.
function revealPassed() {
  pending.forEach(el => { if (el.getBoundingClientRect().bottom < 0) show(el); });
}
addEventListener("beforeprint", () => pending.forEach(el => show(el)));

// Headings rise word by word
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.innerHTML = text.split(/\s+/).map((w, i) => `<span class="w" aria-hidden="true"><span style="--wi:${i}">${esc(w)}</span></span>`).join(" ");
  el.classList.add("split");
}

/* ---------- Impact numbers roll like a scoreboard ---------- */
function roll(el, delay) {
  const target = +el.dataset.count;
  if (target > 9) { countTo(el, target); return; }
  const col = $(".roll-col", el);
  col.animate([{ transform: "translateY(0)" }, { transform: `translateY(-${10 + target}em)` }],
    { duration: 1700, delay: delay + 150, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
}
$$("[data-count]").forEach(el => {
  const target = +el.dataset.count;
  if (target > 9) return;
  const seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...Array.from({ length: target + 1 }, (_, k) => k)];
  el.innerHTML = `<span class="sr">${target}</span><span class="roll" aria-hidden="true"><span class="roll-col">${seq.map(n => `<span>${n}</span>`).join("")}</span></span>`;
});

/* ---------- Photos (with a placeholder until the real file exists) ---------- */
function placeholder() {
  const d = document.createElement("div");
  d.className = "placeholder";
  d.textContent = "Photo coming soon";
  return d;
}
function photo(src, alt, lazy = true) {
  if (!src) return placeholder();
  const img = new Image();
  img.src = src; img.alt = alt;
  if (lazy) img.loading = "lazy";
  img.onerror = () => img.replaceWith(placeholder());
  return img;
}

/* ---------- Events (news-style cards) ---------- */
const timeline = $("#timeline");
CONFIG.events.forEach(ev => {
  const pics = CONFIG.photos.filter(p => p.event === ev.id);
  const cover = ev.cover || pics[0]?.src;
  const upcoming = ev.status === "upcoming";
  const card = document.createElement("article");
  card.className = "ev-card";
  card.innerHTML = `
    <div class="ev-cover">
      ${cover ? `<img src="${esc(cover)}" alt="${esc(ev.title)}" loading="lazy">` : `<div class="ev-cover-empty">Coming soon</div>`}
      <span class="ev-badge ${upcoming ? "next" : ""}">${upcoming ? "Up next" : "Recap"}</span>
    </div>
    <div class="ev-body">
      <span class="ev-date">${esc(ev.date)}</span>
      <h3>${esc(ev.title)}</h3>
      <p class="ev-partner">${esc(ev.partner)}</p>
      <p class="ev-summary">${esc(ev.summary)}</p>
      ${ev.highlights?.length ? `<ul class="ev-highlights">${ev.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      ${pics.length ? `<button class="ev-link" data-filter="${ev.id}">See ${pics.length} photo${pics.length > 1 ? "s" : ""} <span class="arr" aria-hidden="true">→</span></button>`
                    : upcoming ? `<a class="ev-link" href="#involved" data-way="Partner">Host an event with us <span class="arr" aria-hidden="true">→</span></a>` : ""}
    </div>`;
  timeline.appendChild(card);
});
timeline.addEventListener("click", e => {
  const link = e.target.closest("[data-filter]");
  if (link) {
    $("#gallery").scrollIntoView({ behavior: smooth });
    setTimeout(() => setFilter(link.dataset.filter), reduced ? 0 : 700);
  }
  const host = e.target.closest("[data-way]");
  if (host) chooseWay($(`.way[data-type="${host.dataset.way}"]`), false);
});

/* ---------- Gallery + filters ---------- */
const grid = $("#galleryGrid");
const filters = $("#filters");
const filterDefs = [
  { id: "all", label: "All", n: CONFIG.photos.length },
  ...CONFIG.events.filter(e => CONFIG.photos.some(p => p.event === e.id))
    .map(e => ({ id: e.id, label: shortTitle(e), n: CONFIG.photos.filter(p => p.event === e.id).length }))
];
filters.innerHTML = `<span class="chip-pill" aria-hidden="true"></span>` + filterDefs.map((f, i) =>
  `<button class="chip ${i ? "" : "active"}" role="tab" aria-selected="${!i}" data-f="${f.id}">${esc(f.label)}<span class="n">${f.n}</span></button>`).join("");
filters.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setFilter(b.dataset.f); });
const pill = $(".chip-pill", filters);
function movePill() {
  const a = $(".chip.active", filters);
  pill.style.width = `${a.offsetWidth}px`;
  pill.style.height = `${a.offsetHeight}px`;
  pill.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`;
}

CONFIG.photos.forEach((p, i) => {
  const fig = document.createElement("button");
  fig.className = `g-item ${p.layout || ""}`;
  fig.dataset.event = p.event;
  fig.dataset.index = i;
  fig.setAttribute("aria-label", `Open photo: ${p.caption}`);
  fig.appendChild(photo(p.src, p.caption));
  const cap = document.createElement("figcaption");
  cap.textContent = p.caption;
  fig.appendChild(cap);
  grid.appendChild(fig);
});

// Photos glide to their new spots when you change the filter (the "FLIP" technique).
function setFilter(id) {
  $$(".chip", filters).forEach(c => {
    c.classList.toggle("active", c.dataset.f === id);
    c.setAttribute("aria-selected", c.dataset.f === id);
  });
  movePill();
  const items = $$(".g-item", grid);
  const before = new Map(items.map(g => [g, g.getBoundingClientRect()]));
  const wasHidden = new Set(items.filter(g => g.classList.contains("hide")));
  items.forEach(g => g.classList.toggle("hide", id !== "all" && g.dataset.event !== id));
  grid.classList.toggle("filtered", id !== "all");
  grid.style.setProperty("--n", items.filter(g => !g.classList.contains("hide")).reduce((n, g) => n + (g.classList.contains("wide") ? 2 : 1), 0));
  let n = 0;
  items.forEach(g => {
    if (g.classList.contains("hide")) return;
    if (reduced) { g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); return; }
    if (wasHidden.has(g)) {
      g.animate([{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "none" }],
        { duration: 500, delay: 80 + n++ * 60, easing: EASE, fill: "backwards" });
      return;
    }
    const a = before.get(g), b = g.getBoundingClientRect();
    if (!b.width) return;
    g.animate([
      { transformOrigin: "0 0", transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` },
      { transformOrigin: "0 0", transform: "none" }
    ], { duration: 600, easing: EASE });
  });
}

/* ---------- Lightbox: zooms out of the photo you tapped ---------- */
const lb = $("#lightbox");
const lbMedia = $("#lbMedia");
let lbIndex = 0, lbOpen = false, lastFocus = null;
const visiblePhotos = () => $$(".g-item:not(.hide)", grid).map(g => +g.dataset.index);
function showPhoto(i, dir = 0) {
  lbIndex = i;
  const p = CONFIG.photos[i];
  const img = photo(p.src, p.caption, false);
  lbMedia.replaceChildren(img);
  const ev = CONFIG.events.find(e => e.id === p.event);
  $("#lbCaption").textContent = p.caption + (ev ? `, ${shortTitle(ev)}` : "");
  const list = visiblePhotos();
  $("#lbCount").textContent = `${list.indexOf(i) + 1} / ${list.length}`;
  // Warm up the neighbours so arrowing through feels instant
  [-1, 1].forEach(d => { const j = list[(list.indexOf(i) + d + list.length) % list.length]; if (CONFIG.photos[j]?.src) new Image().src = CONFIG.photos[j].src; });
  if (dir) animate(img, [{ opacity: 0, transform: reduced ? "none" : `translateX(${dir * 70}px) scale(.96)` }, { opacity: 1, transform: "none" }], { duration: 480, easing: EASE });
  return img;
}
function openLB(i, fromEl) {
  lastFocus = document.activeElement;
  lbOpen = true;
  const sbw = innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${sbw}px`;
  lb.hidden = false;
  void lb.offsetWidth;
  lb.classList.add("open");
  const img = showPhoto(i);
  $(".lb-close").focus({ preventScroll: true });
  if (img.tagName !== "IMG") return;
  if (!fromEl || reduced) { img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 }); return; }
  const from = (fromEl.querySelector("img") || fromEl).getBoundingClientRect();
  const zoom = () => {
    const to = img.getBoundingClientRect();
    if (!to.width) return;
    const s = Math.max(from.width / to.width, from.height / to.height);
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    img.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: .4 }, { transform: "none", opacity: 1 }],
      { duration: 560, easing: EASE });
  };
  img.complete ? zoom() : img.addEventListener("load", zoom, { once: true });
}
function closeLB() {
  if (!lbOpen) return;
  lbOpen = false;
  lb.classList.remove("open");
  const img = $("img", lbMedia);
  if (img && !reduced) animate(img, [{ transform: "none" }, { transform: "scale(.94)" }], { duration: 280, easing: "ease-in", fill: "forwards" });
  setTimeout(() => {
    lb.hidden = true;
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, 300);
  lastFocus?.focus({ preventScroll: true });
}
function stepLB(dir) {
  const list = visiblePhotos();
  const pos = list.indexOf(lbIndex);
  showPhoto(list[(pos + dir + list.length) % list.length], dir);
}
grid.addEventListener("click", e => { const g = e.target.closest(".g-item"); if (g) openLB(+g.dataset.index, g); });
$(".lb-close").onclick = closeLB;
$(".lb-prev").onclick = () => stepLB(-1);
$(".lb-next").onclick = () => stepLB(1);
lb.addEventListener("click", e => { if (e.target === lb || e.target.tagName === "FIGURE") closeLB(); });
addEventListener("keydown", e => {
  if (e.key === "Escape") setMenu(false);
  if (!lbOpen) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") stepLB(-1);
  if (e.key === "ArrowRight") stepLB(1);
  if (e.key === "Tab") {                       // keep focus inside the viewer
    const btns = $$("button", lb);
    const i = btns.indexOf(document.activeElement);
    e.preventDefault();
    btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
  }
});
let touchX = null;
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1);
  touchX = null;
});

/* ---------- Sports vote ----------
   Votes are saved in this visitor's browser only. To collect real votes
   from everyone, connect a form service or a small backend later. */
const ICONS = {
  soccer: `<circle cx="24" cy="24" r="20"/><path d="M24 15l7 5-3 8h-8l-3-8z"/><path d="M24 4v11M31 20l11-4M28 28l6 10M20 28l-6 10M17 20L6 16"/>`,
  basketball: `<circle cx="24" cy="24" r="20"/><path d="M4 24h40M24 4v40"/><path d="M10 9c6 5 6 25 0 30M38 9c-6 5-6 25 0 30"/>`,
  tennis: `<circle cx="24" cy="24" r="20"/><path d="M8 12c8 6 8 18 0 24M40 12c-8 6-8 18 0 24"/>`,
  volleyball: `<circle cx="24" cy="24" r="20"/><path d="M24 24V4M24 24l17 10M24 24L7 34"/><path d="M24 4c8 6 11 15 9 25M41 34c-10 3-19 1-26-6M7 34c0-10 6-18 16-22"/>`,
  other: `<circle cx="24" cy="24" r="20" stroke-dasharray="4 4"/><path d="M24 16v16M16 24h16"/>`
};
const icon = k => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k] || ICONS.other}</svg>`;

const sportsGrid = $("#sportsGrid");
let votes = store.get("mim-votes", {});
let myVote = store.get("mim-myvote", null);

function renderSports(justVoted = null) {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const pctOf = k => total ? Math.round((votes[k] || 0) / total * 100) : 0;
  sportsGrid.innerHTML = CONFIG.sports.map(s => {
    if (s.current) return `<div class="sport current">${icon(s.key)}<h3>${esc(s.name)}</h3><span class="tag">Playing now</span></div>`;
    const pct = pctOf(s.key);
    return `<button class="sport ${myVote === s.key ? "voted" : ""}" data-k="${s.key}" ${myVote ? "disabled" : ""}>
      ${icon(s.key)}<h3>${esc(s.name)}</h3>
      <span class="tag">${myVote === s.key ? "Your pick" : "Coming soon"}</span>
      <span class="pct">${myVote && !justVoted ? pct + "%" : ""}</span>
      <span class="bar" style="width:${myVote && !justVoted ? pct : 0}%"></span>
    </button>`;
  }).join("");
  $("#voteNote").innerHTML = myVote
    ? `Thanks for voting. <button id="revote">Change my vote</button>`
    : "Tap a sport to vote.";
  if (!justVoted) return;
  // Bars grow and percentages count up after a vote
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$("button.sport", sportsGrid).forEach(b => {
      const pct = pctOf(b.dataset.k);
      $(".bar", b).style.width = `${pct}%`;
      countTo($(".pct", b), pct, 900, "%");
    });
  }));
  const card = $(`[data-k="${justVoted}"]`, sportsGrid);
  card.classList.add("just-voted");
  confetti(...centerOf(card), 22, .8);
}
sportsGrid.addEventListener("click", e => {
  const b = e.target.closest("button.sport");
  if (!b || myVote) return;
  myVote = b.dataset.k;
  votes[myVote] = (votes[myVote] || 0) + 1;
  store.set("mim-votes", votes); store.set("mim-myvote", myVote);
  renderSports(myVote);
});
$("#voteNote").addEventListener("click", e => {
  if (e.target.id !== "revote") return;
  votes[myVote] = Math.max(0, (votes[myVote] || 1) - 1);
  myVote = null;
  store.set("mim-votes", votes); store.set("mim-myvote", null);
  renderSports();
});
renderSports();

/* ---------- Team jersey cards: tilt toward the cursor, flip on tap ---------- */
const flipIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg>`;
$("#teamGrid").innerHTML = CONFIG.team.map(m => `
  <button class="member" aria-label="${esc(m.name)}: tap to read bio" aria-pressed="false">
    <div class="member-inner">
      <div class="face front">
        <div class="avatar">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}">` : `<span class="jersey-num">${esc(m.number ?? "")}</span>`}</div>
        <span class="hint">${flipIcon}Tap to flip</span>
        <div class="info">
          <h3>${esc(m.name)}</h3>
          <div class="role">${esc(m.role)}</div>
        </div>
      </div>
      <div class="face back">
        <h3>${esc(m.name)}</h3>
        <span class="role">${esc(m.role)}</span>
        <p>${esc(m.bio)}</p>
      </div>
    </div>
  </button>`).join("");
$$(".member").forEach(m => {
  m.addEventListener("click", () => m.setAttribute("aria-pressed", m.classList.toggle("flipped")));
  if (reduced || !canHover) return;
  m.addEventListener("pointermove", e => {
    const r = m.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    m.classList.add("tilting");
    m.style.setProperty("--ry", `${(x - .5) * 12}deg`);
    m.style.setProperty("--rx", `${(.5 - y) * 9}deg`);
    m.style.setProperty("--mx", `${x * 100}%`);
    m.style.setProperty("--my", `${y * 100}%`);
  });
  m.addEventListener("pointerleave", () => {
    m.classList.remove("tilting");
    m.style.setProperty("--rx", "0deg");
    m.style.setProperty("--ry", "0deg");
  });
});

/* ---------- Penalty shootout ---------- */
const pitchEl = $("#pitch"), goalEl = $("#goal"), keeper = $("#keeper"), ballEl = $("#shotBall"),
      ballSkin = $("i", ballEl), shadowEl = $("#ballShadow"), msg = $("#gameMsg"), aim = $("#aim"),
      dots = $$("#shotDots li"), goalsEl = $("#goals"), shotsEl = $("#shots"), bestEl = $("#best");
let goals = 0, shots = 5, busy = false, best = store.get("mim-best", 0);
let flight = [];
bestEl.textContent = best;
keeper.classList.add("ready");

function say(text, big = false) { msg.textContent = text; msg.classList.toggle("big", big); restart(msg, "pop"); }
function markNext() { dots.forEach((d, i) => d.classList.toggle("next", i === 5 - shots && shots > 0)); }
markNext();

function resetShot() {
  flight.forEach(a => a.cancel());
  flight = [];
  animate(ballEl, [{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: SPRING });
  keeper.style.left = "50%"; keeper.style.bottom = "0"; keeper.style.transform = "translateX(-50%)";
  setTimeout(() => keeper.classList.add("ready"), 400);
}

goalEl.addEventListener("pointermove", e => {
  if (busy || shots === 0) { aim.classList.remove("on"); return; }
  const g = goalEl.getBoundingClientRect();
  aim.style.left = `${e.clientX - g.left - 7}px`;
  aim.style.top = `${e.clientY - g.top - 7}px`;
  aim.classList.add("on");
});
goalEl.addEventListener("pointerleave", () => aim.classList.remove("on"));

goalEl.addEventListener("click", async e => {
  if (busy || shots === 0) return;
  busy = true;
  aim.classList.remove("on");
  keeper.classList.remove("ready");
  const g = goalEl.getBoundingClientRect();
  const b = ballEl.getBoundingClientRect();
  const s = shadowEl.getBoundingClientRect();
  const xPct = (e.clientX - g.left) / g.width;               // 0..1 across the goal
  const yPct = 1 - (e.clientY - g.top) / g.height;           // 0 bottom .. 1 top
  const tx = e.clientX - (b.left + b.width / 2);
  const ty = e.clientY - (b.top + b.height / 2);
  const arc = -Math.max(30, Math.abs(ty) * .3);

  // Keeper dives to a random third; high shots in the corners can't be saved.
  const dive = Math.floor(Math.random() * 3);                // 0 left, 1 middle, 2 right
  const zone = xPct < .36 ? 0 : xPct > .64 ? 2 : 1;
  const corner = (xPct < .12 || xPct > .88) && yPct > .6;
  const saved = zone === dive && !corner;
  setTimeout(() => {
    keeper.style.left = ["24%", "50%", "76%"][dive];
    keeper.style.bottom = dive === 1 ? "14%" : "5%";
    keeper.style.transform = `translateX(-50%) rotate(${[-64, 0, 64][dive]}deg)`;
  }, 90);

  const dur = 520;
  flight = [
    animate(ballEl, [
      { transform: "translate(0, 0) scale(1)" },
      { transform: `translate(${tx * .5}px, ${ty * .5 + arc}px) scale(.8)`, offset: .5 },
      { transform: `translate(${tx}px, ${ty}px) scale(.58)` }
    ], { duration: dur, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" }),
    animate(ballSkin, [{ transform: "rotate(0)" }, { transform: `rotate(${tx > 0 ? 900 : -900}deg)` }], { duration: dur + 300, easing: "ease-out", fill: "forwards" }),
    animate(shadowEl, [
      { transform: "none", opacity: 1 },
      { transform: `translate(${tx}px, ${g.bottom - s.top - 6}px) scale(.45)`, opacity: .35 }
    ], { duration: dur, easing: "cubic-bezier(.3,.6,.4,1)", fill: "forwards" })
  ];
  await wait(dur);                                          // timer, so a background tab can never stall the game

  shots--;
  dots[4 - shots].className = saved ? "miss" : "goal";
  if (saved) {
    // Parried away
    const away = (dive === 0 ? -1 : dive === 2 ? 1 : (tx > 0 ? 1 : -1)) * (70 + Math.random() * 50);
    flight.push(animate(ballEl, [
      { transform: `translate(${tx}px, ${ty}px) scale(.58)` },
      { transform: `translate(${tx + away}px, ${ty + 120}px) scale(.7)` }
    ], { duration: 600, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }));
    restart(pitchEl, "shake");
    say(["Saved", "Keeper read it", "Denied"][Math.floor(Math.random() * 3)]);
  } else {
    goals++;
    flight.push(animate(ballEl, [
      { transform: `translate(${tx}px, ${ty}px) scale(.58)` },
      { transform: `translate(${tx}px, ${ty + 12}px) scale(.54)` }
    ], { duration: 400, easing: "ease-out", fill: "forwards" }));
    restart($(".net", goalEl), "ripple");
    confetti(e.clientX, e.clientY, corner ? 40 : 24, corner ? 1.2 : .9);
    say(corner ? "Top corner!" : "Goal!", corner);
    goalsEl.textContent = goals;
    restart(goalsEl, "bump");
  }
  shotsEl.textContent = shots;
  restart(shotsEl, "bump");
  markNext();

  await wait(1150);
  resetShot();
  busy = false;
  if (shots > 0) { say("Click the goal to shoot"); return; }
  goalEl.classList.add("done");
  if (goals > best) {
    best = goals; store.set("mim-best", best);
    bestEl.textContent = best; restart(bestEl, "bump");
    say(`New best: ${goals} of 5`, true);
    confetti(...centerOf(pitchEl), 50, 1.4);
  } else {
    say(goals >= 4 ? `${goals} of 5. Clinical.` : goals >= 2 ? `${goals} of 5. Not bad.` : `${goals} of 5. Run it back.`);
  }
});
$("#resetGame").addEventListener("click", () => {
  if (busy) return;
  goals = 0; shots = 5;
  goalsEl.textContent = 0; shotsEl.textContent = 5;
  dots.forEach(d => d.className = "");
  goalEl.classList.remove("done");
  markNext();
  say("Click the goal to shoot");
});

/* ---------- Get involved form ---------- */
const form = $("#contactForm");
const formDone = $("#formDone");
const submitBtn = $('button[type="submit"]', form);
const prompts = {
  "Volunteer": "Tell us a little about yourself and when you're free…",
  "Partner": "Tell us about your organization and the kids you work with…",
  "Donate gear": "What equipment would you like to donate?"
};
function chooseWay(t, scroll = true) {
  if (!t) return;
  $$(".way").forEach(x => { x.classList.toggle("active", x === t); x.setAttribute("aria-pressed", x === t); });
  const type = t.dataset.type;
  const label = $("#formTypeLabel");
  if ($("#formType").value !== type) restart(label, "swap");
  $("#formType").value = type;
  label.textContent = type;
  const org = $("#orgLabel");
  const showOrg = type === "Partner";
  if (showOrg && org.hidden) restart(org, "appear");
  org.hidden = !showOrg;
  $("#msgField").placeholder = prompts[type];
  if (scroll) form.scrollIntoView({ block: "center", behavior: smooth });
  setTimeout(() => restart(form, "flash"), scroll && !reduced ? 350 : 0);
}
$$(".way").forEach(t => {
  t.setAttribute("aria-pressed", t.classList.contains("active"));
  t.addEventListener("click", () => chooseWay(t));
});

const fieldOK = el => el.name === "email" ? /^\S+@\S+\.\S+$/.test(el.value.trim()) : !!el.value.trim();
["name", "email"].forEach(n => {
  const el = form.elements[n];
  el.addEventListener("blur", () => { if (el.value) { el.classList.toggle("valid", fieldOK(el)); el.classList.toggle("invalid", !fieldOK(el)); } });
  el.addEventListener("input", () => { if (el.classList.contains("invalid") && fieldOK(el)) { el.classList.remove("invalid"); el.classList.add("valid"); } });
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const status = $("#formStatus");
  const data = Object.fromEntries(new FormData(form));
  const bad = ["name", "email"].map(n => form.elements[n]).filter(el => !fieldOK(el));
  ["name", "email"].forEach(n => form.elements[n].classList.remove("invalid"));
  if (bad.length) {
    void form.offsetWidth;
    bad.forEach(el => el.classList.add("invalid"));
    bad[0].focus();
    status.className = "form-status err";
    status.textContent = "Please add your name and a valid email.";
    return;
  }
  status.textContent = "";
  if (!CONFIG.contactEmail) {
    status.className = "form-status err";
    status.textContent = "Our contact form isn't connected yet. Check back soon!";
    return;
  }
  submitBtn.classList.add("sending");
  submitBtn.firstChild.textContent = "Opening your email… ";
  await wait(450);
  const subject = `Mindset in Motion: ${data.type} inquiry from ${data.name}`;
  const body = `Name: ${data.name}\nEmail: ${data.email}\n${data.org ? `Organization: ${data.org}\n` : ""}\n${data.message}`;
  location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  submitBtn.classList.remove("sending");
  submitBtn.firstChild.textContent = "Send message ";
  $("#doneTitle").textContent = `Almost there, ${data.name.trim().split(" ")[0]}`;
  formDone.hidden = false;
  form.classList.add("is-done");
  setTimeout(() => confetti(...centerOf($(".check", formDone)), 26, .9), 650);
});
$("#formAgain").addEventListener("click", () => {
  form.reset();
  $$(".valid, .invalid", form).forEach(el => el.classList.remove("valid", "invalid"));
  formDone.hidden = true;
  form.classList.remove("is-done");
  form.elements.name.focus();
});

/* ---------- FAQ: smooth open and close ---------- */
$$(".faq details").forEach(d => {
  const sum = $("summary", d);
  let anim = null;
  d.addEventListener("toggle", () => { if (!anim) d.classList.toggle("is-open", d.open); });
  sum.addEventListener("click", e => {
    e.preventDefault();
    const start = d.offsetHeight;
    anim?.cancel();
    if (d.classList.contains("is-open")) {
      const cs = getComputedStyle(d);
      const end = sum.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      d.classList.remove("is-open");
      anim = d.animate({ height: [`${start}px`, `${end}px`] }, { duration: 340, easing: EASE });
      anim.onfinish = () => { anim = null; d.open = false; };
    } else {
      d.open = true;
      d.classList.add("is-open");
      const end = d.offsetHeight;
      anim = d.animate({ height: [`${start}px`, `${end}px`] }, { duration: 420, easing: EASE });
      $("p", d).animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: 80, easing: EASE, fill: "backwards" });
      anim.onfinish = () => { anim = null; };
    }
  });
});

/* ---------- Wire up reveals (after all dynamic content exists) ---------- */
$$("main h2").forEach(splitWords);
reveal("main h2");
reveal(".section .lead, .intro .narrow p:not(.lead)");
reveal(".pillar, .steps li, .ev-card, .gallery-head .filters, .g-item, .partner-inner > *, .sport, .vote-note, .member, .way, .form, .faq details, .game-wrap > *, .footer-inner > *");
reveal(".impact-stats > div", (el, d) => $$("[data-count]", el).forEach(n => roll(n, d)));

const relayout = () => { moveIndicator(); movePill(); };
addEventListener("resize", relayout);
document.fonts?.ready.then(relayout);
relayout();
onScroll();
