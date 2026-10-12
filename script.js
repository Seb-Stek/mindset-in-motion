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
      partner: "Boys & Girls Club of Union",
      status: "done",
      summary: "Our very first event. An hour of soccer games and races with the kids at the Boys & Girls Club of Union.",
      highlights: ["Soccer games and small-sided scrimmages", "Sprint and relay races", "About an hour of nonstop action"]
    },
    {
      id: "event2",
      title: "Event #2: Back for More",
      date: "Aug 17, 2026",
      partner: "Boys & Girls Club of Union",
      status: "done",
      summary: "We came back to the Boys & Girls Club of Union for round two, with more games, more races and more energy.",
      highlights: ["Push-up races and fitness challenges", "Pinnie-team games", "Soccer lessons and drills"]
    },
    {
      id: "next",
      title: "Event #3: Coming soon",
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

$("#year").textContent = new Date().getFullYear();

/* ---------- Nav ---------- */
const nav = $(".nav");
const toggle = $(".nav-toggle");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.textContent = open ? "Close" : "Menu";
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", false);
  toggle.textContent = "Menu";
}));

/* ---------- Reveal on scroll + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: .12 });
function observeReveals() {
  $$(".values li, .schedule li, .ev, .member, .mission-grid > *").forEach(el => el.classList.add("reveal"));
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}

function countUp(el) {
  const target = +el.dataset.count;
  const start = performance.now(), dur = 1000;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const statsIO = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { $$("[data-count]").forEach(countUp); statsIO.disconnect(); }
});
statsIO.observe($(".scoreboard"));

/* ---------- Photos (with a placeholder until the real file exists) ---------- */
function placeholder(src) {
  const d = document.createElement("div");
  d.className = "placeholder";
  d.innerHTML = `<strong>Photo coming soon</strong><small>${esc(src || "")}</small>`;
  return d;
}
function photo(src, alt) {
  if (!src) return placeholder(src);
  const img = new Image();
  img.src = src; img.alt = alt; img.loading = "lazy";
  img.onerror = () => img.replaceWith(placeholder(src));
  return img;
}

/* Hero: the first three photos, pinned up like prints */
const heroPhotos = $("#heroPhotos");
CONFIG.photos.slice(0, 3).forEach(p => {
  const fig = document.createElement("figure");
  fig.className = "print";
  fig.appendChild(photo(p.src, p.caption));
  const cap = document.createElement("figcaption");
  cap.textContent = p.caption;
  fig.appendChild(cap);
  heroPhotos.appendChild(fig);
});

/* ---------- Events ---------- */
const timeline = $("#timeline");
CONFIG.events.forEach((ev, i) => {
  const count = CONFIG.photos.filter(p => p.event === ev.id).length;
  const upcoming = ev.status === "upcoming";
  const item = document.createElement("article");
  item.className = `ev ${upcoming ? "upcoming" : ""} ${i === 0 ? "open" : ""}`;
  item.innerHTML = `
    <button class="ev-head" aria-expanded="${i === 0}">
      <span class="ev-date">${esc(ev.date)}</span>
      <span>
        <h3>${esc(ev.title)}</h3>
        <span class="ev-partner">${esc(ev.partner)}</span>
      </span>
      <span style="display:flex;gap:1rem;align-items:center">
        <span class="ev-status">${upcoming ? "Upcoming" : "Done"}</span>
        <span class="ev-toggle">${i === 0 ? "–" : "+"}</span>
      </span>
    </button>
    <div class="ev-body"><div><div class="ev-inner">
      <p>${esc(ev.summary)}</p>
      ${ev.highlights.length ? `<ul>${ev.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      ${count ? `<button class="ev-link" data-filter="${ev.id}">See the photos from this event</button>`
              : upcoming ? `<a class="ev-link" href="#involved">Get in touch about hosting</a>` : ""}
    </div></div></div>`;
  timeline.appendChild(item);
});
timeline.addEventListener("click", e => {
  const link = e.target.closest("[data-filter]");
  if (link) { setFilter(link.dataset.filter); $("#gallery").scrollIntoView(); return; }
  const head = e.target.closest(".ev-head");
  if (head) {
    const ev = head.parentElement;
    const open = ev.classList.toggle("open");
    head.setAttribute("aria-expanded", open);
    $(".ev-toggle", head).textContent = open ? "–" : "+";
  }
});

/* ---------- Gallery + filters + lightbox ---------- */
const grid = $("#galleryGrid");
const filters = $("#filters");
const filterDefs = [{ id: "all", label: "All" }, ...CONFIG.events.filter(e => CONFIG.photos.some(p => p.event === e.id)).map(e => ({ id: e.id, label: shortTitle(e) }))];
filters.innerHTML = filterDefs.map((f, i) => `<button class="chip ${i ? "" : "active"}" role="tab" data-f="${f.id}">${esc(f.label)}</button>`).join("");
filters.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) setFilter(b.dataset.f); });

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

function setFilter(id) {
  $$(".chip", filters).forEach(c => c.classList.toggle("active", c.dataset.f === id));
  $$(".g-item", grid).forEach(g => g.classList.toggle("hide", id !== "all" && g.dataset.event !== id));
}

const lb = $("#lightbox");
let lbIndex = 0;
const visiblePhotos = () => $$(".g-item:not(.hide)", grid).map(g => +g.dataset.index);
function openLB(i) {
  lbIndex = i;
  const p = CONFIG.photos[i];
  const media = $("#lbMedia");
  media.innerHTML = "";
  media.appendChild(photo(p.src, p.caption));
  const ev = CONFIG.events.find(e => e.id === p.event);
  $("#lbCaption").textContent = p.caption + (ev ? `, ${shortTitle(ev)}` : "");
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLB() { lb.hidden = true; document.body.style.overflow = ""; }
function stepLB(dir) {
  const list = visiblePhotos();
  const pos = list.indexOf(lbIndex);
  openLB(list[(pos + dir + list.length) % list.length]);
}
grid.addEventListener("click", e => { const g = e.target.closest(".g-item"); if (g) openLB(+g.dataset.index); });
$(".lb-close").onclick = closeLB;
$(".lb-prev").onclick = () => stepLB(-1);
$(".lb-next").onclick = () => stepLB(1);
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLB();
  if (e.key === "ArrowLeft") stepLB(-1);
  if (e.key === "ArrowRight") stepLB(1);
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

function renderSports() {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  sportsGrid.innerHTML = CONFIG.sports.map(s => {
    if (s.current) return `<div class="sport current">${icon(s.key)}<h3>${esc(s.name)}</h3><span class="tag">Playing now</span></div>`;
    const pct = total ? Math.round((votes[s.key] || 0) / total * 100) : 0;
    return `<button class="sport ${myVote === s.key ? "voted" : ""}" data-k="${s.key}" ${myVote ? "disabled" : ""}>
      ${icon(s.key)}<h3>${esc(s.name)}</h3>
      <span class="tag">${myVote === s.key ? "Your pick" : "Coming soon"}</span>
      <span class="pct">${myVote ? pct + "%" : ""}</span>
      <span class="bar" style="width:${myVote ? pct : 0}%"></span>
    </button>`;
  }).join("");
  $("#voteNote").innerHTML = myVote
    ? `Thanks for voting. <button class="ev-link" id="revote">Change my vote</button>`
    : "Tap a sport to vote.";
}
sportsGrid.addEventListener("click", e => {
  const b = e.target.closest("button.sport");
  if (!b || myVote) return;
  myVote = b.dataset.k;
  votes[myVote] = (votes[myVote] || 0) + 1;
  store.set("mim-votes", votes); store.set("mim-myvote", myVote);
  renderSports();
});
$("#voteNote").addEventListener("click", e => {
  if (e.target.id !== "revote") return;
  votes[myVote] = Math.max(0, (votes[myVote] || 1) - 1);
  myVote = null;
  store.set("mim-votes", votes); store.set("mim-myvote", null);
  renderSports();
});
renderSports();

/* ---------- Team jersey cards ---------- */
$("#teamGrid").innerHTML = CONFIG.team.map(m => `
  <button class="member" aria-label="${esc(m.name)}: tap to read bio">
    <div class="member-inner">
      <div class="face front">
        <div class="avatar">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}">` : `<span class="jersey-num">${esc(m.number ?? "")}</span>`}</div>
        <span class="hint">Tap to flip</span>
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
$$(".member").forEach(m => m.addEventListener("click", () => m.classList.toggle("flipped")));

/* ---------- Penalty shootout ---------- */
const goalEl = $("#goal"), keeper = $("#keeper"), ballEl = $("#shotBall"), msg = $("#gameMsg");
let goals = 0, shots = 5, busy = false, best = store.get("mim-best", 0);
$("#best").textContent = best;

function say(text) { msg.textContent = text; msg.classList.remove("pop"); void msg.offsetWidth; msg.classList.add("pop"); }
function resetBall() { ballEl.style.left = "calc(50% - 16px)"; ballEl.style.bottom = "10%"; ballEl.style.transform = "scale(1)"; }
function resetKeeper() { keeper.style.left = "50%"; keeper.style.bottom = "0"; }

goalEl.addEventListener("click", e => {
  if (busy || shots === 0) return;
  busy = true;
  const pitch = $("#pitch").getBoundingClientRect();
  const g = goalEl.getBoundingClientRect();
  const xPct = (e.clientX - g.left) / g.width;               // 0..1 across the goal
  const yPct = 1 - (e.clientY - g.top) / g.height;           // 0 bottom .. 1 top

  ballEl.style.left = `${e.clientX - pitch.left - 16}px`;
  ballEl.style.bottom = `${pitch.bottom - e.clientY - 16}px`;
  ballEl.style.transform = "scale(.65)";

  // Keeper dives to a random third; high shots in the corners can't be saved.
  const dive = Math.floor(Math.random() * 3);                // 0 left, 1 middle, 2 right
  keeper.style.left = ["20%", "50%", "80%"][dive];
  keeper.style.bottom = dive === 1 ? "0" : "6%";
  const zone = xPct < .36 ? 0 : xPct > .64 ? 2 : 1;
  const corner = (xPct < .12 || xPct > .88) && yPct > .6;
  const saved = zone === dive && !corner;

  shots--;
  setTimeout(() => {
    if (saved) say(["Saved", "Keeper read it", "Denied"][Math.floor(Math.random() * 3)]);
    else { goals++; say(corner ? "Top corner!" : "Goal!"); }
    $("#goals").textContent = goals;
    $("#shots").textContent = shots;
    setTimeout(() => {
      resetBall(); resetKeeper(); busy = false;
      if (shots === 0) {
        if (goals > best) { best = goals; store.set("mim-best", best); $("#best").textContent = best; }
        say(goals >= 4 ? `${goals} of 5. Clinical.` : goals >= 2 ? `${goals} of 5. Not bad.` : `${goals} of 5. Run it back.`);
      } else say("Click the goal to shoot");
    }, 1100);
  }, 450);
});
$("#resetGame").addEventListener("click", () => {
  goals = 0; shots = 5; busy = false;
  $("#goals").textContent = 0; $("#shots").textContent = 5;
  resetBall(); resetKeeper(); say("Click the goal to shoot");
});

/* ---------- Get involved form ---------- */
const form = $("#contactForm");
const prompts = {
  "Volunteer": "Tell us a little about yourself and when you're free…",
  "Partner": "Tell us about your organization and the kids you work with…",
  "Donate gear": "What equipment would you like to donate?"
};
$$(".tab").forEach(t => t.addEventListener("click", () => {
  $$(".tab").forEach(x => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
  $("#formType").value = t.dataset.type;
  $("#orgLabel").hidden = t.dataset.type !== "Partner";
  $("#msgField").placeholder = prompts[t.dataset.type];
}));

form.addEventListener("submit", e => {
  e.preventDefault();
  const status = $("#formStatus");
  const data = Object.fromEntries(new FormData(form));
  let ok = true;
  ["name", "email"].forEach(n => {
    const el = form.elements[n];
    const bad = !el.value.trim() || (n === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
    el.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { status.className = "form-status err"; status.textContent = "Please add your name and a valid email."; return; }

  if (!CONFIG.contactEmail) {
    status.className = "form-status err";
    status.textContent = "Our contact form isn't connected yet. Check back soon!";
    return;
  }
  const subject = `Mindset in Motion: ${data.type} inquiry from ${data.name}`;
  const body = `Name: ${data.name}\nEmail: ${data.email}\n${data.org ? `Organization: ${data.org}\n` : ""}\n${data.message}`;
  location.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.className = "form-status ok";
  status.textContent = `Thanks, ${data.name.split(" ")[0]}. We'll be in touch soon.`;
  form.reset();
});

observeReveals();
