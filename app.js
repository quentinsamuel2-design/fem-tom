/* ===== Données de démo ===== */
const PROFILES = [
  {
    id: 1, name: "Léo", age: 23, vibe: "femboy", emoji: "🧷",
    color: "linear-gradient(135deg, #ffb3d1, #ffd6e4)", accent: "#ff8fb8",
    city: "Lyon", pronouns: "il/lui", bio: "Skirt + sneakers, c'est ma signature. Je collectionne les vernis pastel et je fais des playlists pour chaque humeur. À la recherche de quelqu'un qui aime les boulangeries le dimanche matin.",
    tags: ["Mode", "K-pop", "Vernis pastel", "Cafés", "Playlists"]
  },
  {
    id: 2, name: "Nour", age: 26, vibe: "tomboy", emoji: "🏀",
    color: "linear-gradient(135deg, #9ecbff, #c9e4ff)", accent: "#8fc7ff",
    city: "Paris", pronouns: "iel", bio: "Basket le matin, skate le soir. Je code des jeux indés le week-end. Si tu sais faire des crêpes, c'est déjà un bon début.",
    tags: ["Skate", "Jeux indés", "Basket", "Bande dessinée", "Crêpes"]
  },
  {
    id: 3, name: "Ada", age: 22, vibe: "tomboy", emoji: "🎸",
    color: "linear-gradient(135deg, #a8c8ff, #d4e2ff)", accent: "#8fb4ff",
    city: "Bordeaux", pronouns: "elle", bio: "Guitariste dans un groupe de shoegaze. Coupe courte, chemises oversize, et un faible pour les marchés aux puces à 6h.",
    tags: ["Shoegaze", "Vintage", "Tatouages", "Marchés aux puces"]
  },
  {
    id: 4, name: "Milo", age: 25, vibe: "fluide", emoji: "🌙",
    color: "linear-gradient(135deg, #d3b8ff, #a3ccff)", accent: "#b9a3ff",
    city: "Nantes", pronouns: "iel", bio: "Mon style change selon la météo de mon cœur. Bénévole dans une assoc' LGBTQ+, grand fan de cinéma d'animation japonaise.",
    tags: ["Animation JP", "Assoc'", "Pâtisserie", "Thrillers", "Thé"]
  },
  {
    id: 5, name: "Camille", age: 24, vibe: "femboy", emoji: "🪞",
    color: "linear-gradient(135deg, #ffc4d8, #ffe3ee)", accent: "#ff9ec4",
    city: "Lille", pronouns: "il", bio: "Je fais du threading (les perles, pas le spa… quoique). Maman m'a appris à coudre, maintenant je customise tout mon dressing.",
    tags: ["Perlage", "Couture", "Chill-hop", "Boba tea"]
  },
  {
    id: 6, name: "Jules", age: 27, vibe: "tomboy", emoji: "🛹",
    color: "linear-gradient(135deg, #93c5fd, #bcdffb)", accent: "#7fb8f5",
    city: "Toulouse", pronouns: "elle", bio: "Plombière le jour, DJ le samedi. On dit que je fixe les fuites et que je fais fuir les cœurs (désolée, ma pire blague).",
    tags: ["DJ set", "Skatepark", "Mécanique", "Techno", "Puns"]
  },
  {
    id: 7, name: "Sacha", age: 21, vibe: "fluide", emoji: "🌟",
    color: "linear-gradient(135deg, #c9a7ff, #9ac6ff)", accent: "#b08cf5",
    city: "Rennes", pronouns: "iel/elle", bio: "Étudiant·e en art, toujours avec du scotch washi sur les mains. Je dessine des portraits de gens dans le métro.",
    tags: ["Dessin", "Washi tape", "Métro", "Poésie", "Mangas"]
  },
  {
    id: 8, name: "Elias", age: 28, vibe: "femboy", emoji: "🌸",
    color: "linear-gradient(135deg, #ffb0cc, #ffd9e7)", accent: "#ff87b6",
    city: "Strasbourg", pronouns: "il/lui", bio: "Fleuriste. Oui, je peux faire un bouquet qui dit 'je t'aime bien sans faire trop'. Jardinage sur mon balcon minuscule.",
    tags: ["Fleurs", "Jardinage", "Photos Polaroid", "Marchés"]
  }
];

const VIBE_LABEL = { femboy: "Femboy", tomboy: "Tomboy", fluide: "Fluide" };

/* ===== État ===== */
let queue = [];
let matches = [];
let rewindStack = [];
let currentIdx = 0;
const LIKED_BACK = new Set([1, 4, 6, 7]); // profils qui likent en retour

/* ===== Init ===== */
const cardStack = document.getElementById("cardStack");
const matchCountEl = document.getElementById("matchCount");
const matchListEl = document.getElementById("matchList");
const emptyEl = document.getElementById("emptyMatches");

function startDeck() {
  queue = [...PROFILES];
  currentIdx = 0;
  renderStack();
}

function renderStack() {
  cardStack.innerHTML = "";
  const remaining = queue.slice(currentIdx);
  const toShow = remaining.slice(0, 2).reverse();
  toShow.forEach((p, i) => {
    const card = buildCard(p);
    if (i < toShow.length - 1) card.classList.add("back");
    cardStack.appendChild(card);
  });
  if (remaining.length === 0) showEnd();
}

function buildCard(p) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = p.id;
  card.innerHTML = `
    <div class="card-banner" style="background:${p.color}">
      <span class="emoji-bg">${p.emoji}</span>
      <span class="vibe-badge vibe-${p.vibe}">${VIBE_LABEL[p.vibe]}</span>
      <span class="stamp left nope">NOPE</span>
      <span class="stamp right like">LIKE</span>
    </div>
    <div class="card-info">
      <div class="card-name">${p.name}, ${p.age} <small>· ${p.city}</small></div>
      <p class="card-bio">${p.bio}</p>
      <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}<span class="tag city">${p.pronouns}</span></div>
    </div>`;
  attachDrag(card, p);
  card.addEventListener("click", (e) => {
    if (card.dataset.dragged) return;
    openProfile(p);
  });
  return card;
}

/* ===== Drag ===== */
function attachDrag(card, p) {
  let startX = 0, dx = 0, dragging = false;

  card.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    card.dataset.dragged = "";
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    card.style.transition = "none";
    card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    const like = card.querySelector(".stamp.like");
    const nope = card.querySelector(".stamp.nope");
    like.style.opacity = Math.max(0, dx / 110);
    nope.style.opacity = Math.max(0, -dx / 110);
    if (Math.abs(dx) > 8) card.dataset.dragged = "1";
  });
  card.addEventListener("pointerup", () => {
    dragging = false;
    card.style.transition = "";
    if (dx > 110) decide("like", p, card);
    else if (dx < -110) decide("nope", p, card);
    else {
      card.style.transform = "";
      card.querySelector(".stamp.like").style.opacity = 0;
      card.querySelector(".stamp.nope").style.opacity = 0;
    }
    dx = 0;
  });
}

/* ===== Décision ===== */
function decide(action, p, cardEl) {
  rewindStack.push({ profile: p, liked: action === "like" });
  if (action === "like" && LIKED_BACK.has(p.id)) {
    registerMatch(p);
    if (cardEl) {
      cardEl.classList.add("choice", "fly-right");
      setTimeout(() => { currentIdx++; renderStack(); showMatch(p); }, 250);
    } else {
      currentIdx++; renderStack(); showMatch(p);
    }
    return;
  }
  const top = cardEl || cardStack.querySelector(".card:not(.back)");
  if (top) {
    top.classList.add("choice", action === "like" ? "fly-right" : "fly-left");
    setTimeout(() => { currentIdx++; renderStack(); }, 250);
  } else {
    currentIdx++; renderStack();
  }
}

function registerMatch(p) {
  matches.push(p);
  matchCountEl.textContent = matches.length;
  emptyEl.style.display = "none";
  renderMatchList();
}

function renderMatchList() {
  matchListEl.innerHTML = "";
  matches.forEach(p => {
    const item = document.createElement("div");
    item.className = "match-item";
    item.innerHTML = `
      <div class="match-emoji" style="background:${p.color}">${p.emoji}</div>
      <div>
        <div class="mi-name">${p.name}, ${p.age}</div>
        <div class="mi-sub">${VIBE_LABEL[p.vibe]} · ${p.city}</div>
      </div>`;
    item.addEventListener("click", () => openProfile(p));
    matchListEl.appendChild(item);
  });
}

/* ===== Modales ===== */
const profileModal = document.getElementById("profileModal");
const matchModal = document.getElementById("matchModal");
const endModal = document.getElementById("endModal");

function openProfile(p) {
  document.getElementById("profileContent").innerHTML = `
    <div class="profile-full">
      <div class="card-banner" style="background:${p.color}; border-radius: 24px 24px 0 0;">
        <span class="emoji-bg">${p.emoji}</span>
        <span class="vibe-badge vibe-${p.vibe}">${VIBE_LABEL[p.vibe]}</span>
      </div>
      <div class="card-info">
        <div class="card-name">${p.name}, ${p.age}</div>
        <p class="card-bio">${p.bio}</p>
        <div class="profile-meta">
          <div><strong>Ville</strong>${p.city}</div>
          <div><strong>Pronoms</strong>${p.pronouns}</div>
          <div><strong>Vibe</strong>${VIBE_LABEL[p.vibe]}</div>
          <div><strong>Âge</strong>${p.age} ans</div>
        </div>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </div>`;
  profileModal.hidden = false;
  profileModal.querySelector('[data-act="like"]').onclick = () => { closeModals(); decide("like", p); };
  profileModal.querySelector('[data-act="nope"]').onclick = () => { closeModals(); decide("nope", p); };
}

function showMatch(p) {
  document.getElementById("matchCard").innerHTML = `
    <div class="mc-emoji" style="background:${p.color}">${p.emoji}</div>
    <div>
      <div class="mc-name">${p.name}, ${p.age}</div>
      <div class="mc-vibe">${VIBE_LABEL[p.vibe]} · ${p.city}</div>
    </div>`;
  matchModal.hidden = false;
}

function showEnd() { endModal.hidden = false; }
function closeModals() {
  profileModal.hidden = true;
  matchModal.hidden = true;
}

document.querySelectorAll("[data-close]").forEach(el =>
  el.addEventListener("click", () => { profileModal.hidden = true; })
);
document.getElementById("keepSwiping").addEventListener("click", () => { matchModal.hidden = true; });
document.getElementById("restartDeck").addEventListener("click", () => {
  endModal.hidden = true;
  currentIdx = 0;
  rewindStack = [];
  renderStack();
});

/* ===== Boutons ===== */
document.getElementById("btnLike").addEventListener("click", () => {
  const p = queue[currentIdx];
  if (p) decide("like", p);
});
document.getElementById("btnNope").addEventListener("click", () => {
  const p = queue[currentIdx];
  if (p) decide("nope", p);
});
document.getElementById("btnRewind").addEventListener("click", () => {
  if (rewindStack.length === 0 || currentIdx === 0) return;
  rewindStack.pop();
  currentIdx--;
  if (matches.length && queue[currentIdx]) {
    const p = queue[currentIdx];
    const idx = matches.findIndex(m => m.id === p.id);
    if (idx > -1 && rewindStack.length && !rewindStack.some(r => r.profile.id === p.id && r.liked)) {
      matches.splice(idx, 1);
      matchCountEl.textContent = matches.length;
      if (!matches.length) emptyEl.style.display = "";
      renderMatchList();
    }
  }
  renderStack();
});

/* ===== Onglets ===== */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

startDeck();
