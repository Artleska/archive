import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { genresMangas } from './mangas.js';
import { genresAnimes } from './animes.js';
import { genresFilms } from './films.js';
import { genresSeries } from './series.js';
import { genresNovels } from './novels.js';

const statutPossibles = ["en cours", "terminé", "abandonné"];

function createForm(formId, genres, collectionName, fields) {
  const container = document.getElementById(formId);
  if (!container) return;

  const genreSelectId = `${formId}-genreSelect`;
  const linkContainerId = `${formId}-linksContainer`;

  const formHtml = `
    <form class="lux-form">
      <div class="form-grid">
        ${fields.join('')}
        <div class="form-group full">
          <select id="${genreSelectId}" name="genres" multiple placeholder="Choisir les genres..."></select>
        </div>
        <div class="form-group full">
          <div id="${linkContainerId}" class="link-flex"></div>
          <button type="button" class="lux-btn-outline" id="${formId}-addLink">+ Ajouter un lien</button>
        </div>
        <div class="form-group full">
          <button type="submit" class="lux-btn">Ajouter</button>
        </div>
      </div>
    </form>`;

  container.innerHTML = formHtml;

  const genreSelect = new TomSelect(`#${genreSelectId}`, {
    options: genres.map(g => ({ value: g, text: g })),
    plugins: ['remove_button'],
    persist: false,
    create: false,
    maxOptions: 500,
    render: { option: data => `<div>${data.text}</div>` }
  });

  document.getElementById(`${formId}-addLink`).addEventListener("click", () => {
    const linkContainer = document.getElementById(linkContainerId);
    const div = document.createElement("div");
    div.className = "link-pair-row";
    div.innerHTML = `
      <input type="text" placeholder="Nom du site">
      <input type="url" placeholder="Lien URL">`;
    linkContainer.appendChild(div);
  });

  container.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    const links = {};
    document.querySelectorAll(`#${linkContainerId} .link-pair-row`).forEach(row => {
      const inputs = row.querySelectorAll("input");
      const name = inputs[0].value.trim();
      const url = inputs[1].value.trim();
      if (name && url) links[name] = url;
    });

    const otherTitles = (data.otherTitles || "").split(',').map(t => t.trim()).filter(Boolean);

    const doc = {
      ...data,
      otherTitles,
      genres: genreSelect.getValue(),
      externalLinks: links,
      modifieLe: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, collectionName), doc);
      alert("✅ Ajouté avec succès");
      form.reset();
      genreSelect.clear();
      document.getElementById(linkContainerId).innerHTML = "";
    } catch (err) {
      console.error("Erreur Firestore:", err);
      alert("Erreur lors de l'ajout.");
    }
  });
}

function afficherFormulaire(formId) {
  onglets.forEach(o => {
    const container = document.getElementById(o.id);
    const tab = document.getElementById(`tab-${o.id}`);
    if (container) {
      container.style.display = (o.id === formId) ? "block" : "none";
      container.classList.toggle("active", o.id === formId);
    }
    if (tab) tab.classList.toggle("active", o.id === formId);
  });
}

function initialiserOnglets() {
  const ongletsHtml = document.getElementById("onglets-formulaires");
  ongletsHtml.innerHTML = '';
  onglets.forEach(o => {
    const btn = document.createElement("button");
    btn.innerHTML = `<span>${o.label}</span>`;
    btn.className = "tab-button";
    btn.id = `tab-${o.id}`;
    btn.onclick = () => afficherFormulaire(o.id);
    ongletsHtml.appendChild(btn);
  });
  afficherFormulaire("mangaForm");
}

function renderAllForms() {
  onglets.forEach(o => createForm(o.id, o.genres, o.collection, o.champs));
  initialiserOnglets();
}

function champ(label, name, required = false, type = "text", full = false, role = "ALL") {
  return `<div class="form-group ${full ? 'full' : ''}" data-role="${role}">
    <input type="${type}" name="${name}" placeholder="${label}" ${required ? 'required' : ''}>
  </div>`;
}

function textarea(label, name, role = "ALL") {
  return `<div class="form-group full" data-role="${role}">
    <textarea name="${name}" placeholder="${label}" rows="3"></textarea>
  </div>`;
}

function selectStatut(role = "ALL") {
  return `<div class="form-group" data-role="${role}">
    <select name="status">
      ${statutPossibles.map(s => `<option value="${s}">${s}</option>`).join('')}
    </select>
  </div>`;
}

const champsManga = [
  champ("Titre", "title", true, "text", true, "ALL"),
  textarea("Autres titres", "otherTitles","ALL"),
  champ("Image (URL)", "image", false, "url", false, "ALL"),
  selectStatut("ALL"),
  textarea("Description", "description", "ALL"),
  champ("Chapitres total", "chTotal", false, "number", false, "ALL"),
  champ("Date", "date"),

  // Spécifiques M et J
  champ("Chapitres lus (M)", "chLus", false, "text", false, "M"),
  champ("Chapitres (Jade)", "chJade", false, "text", false, "J"),
  champ("Dernière lecture (M)", "derniereLecture", false, "date", false, "M"),
  champ("Page (Jade)", "page", false, "number", false, "J"),
];

const champsAnime = [
  champ("Titre", "title", true, "text", true),
  champ("Autres titres", "otherTitles", false, "text", true),
  champ("Image (URL)", "image"),
  selectStatut(),
  textarea("Description", "description"),
  champ("Épisodes total", "episodeTotal"),
  champ("Épisodes (toi)", "episodeM"),
  champ("Épisodes (Jade)", "episodeJ"),
  champ("Saisons total", "saisonTotal"),
  champ("Saisons (toi)", "saisonM"),
  champ("Saisons (Jade)", "saisonJ"),
  champ("Date", "date"),
  champ("Dernière écoute", "derniereEcoute"),
  champ("Collection", "collection")
];

const champsFilm = [
  champ("Titre", "title", true, "text", true),
  champ("Autres titres", "otherTitles", false, "text", true),
  champ("Image (URL)", "image"),
  textarea("Description", "description"),
  champ("Durée", "duree"),
  champ("Date", "date"),
  champ("Dernière écoute", "derniereEcoute"),
  champ("Collection", "collection")
];

const champsSerie = [
  champ("Titre", "title", true, "text", true),
  champ("Autres titres", "otherTitles", false, "text", true),
  champ("Image (URL)", "image"),
  selectStatut(),
  textarea("Description", "description"),
  champ("Épisodes total", "episodeTotal"),
  champ("Épisodes (toi)", "episodeM"),
  champ("Épisodes (Jade)", "episodeJ"),
  champ("Saisons total", "saisonTotal"),
  champ("Saisons (toi)", "saisonM"),
  champ("Saisons (Jade)", "saisonJ"),
  champ("Date", "date"),
  champ("Dernière écoute", "derniereEcoute"),
  champ("Collection", "collection")
];

const champsNovel = [
  champ("Titre", "title", true, "text", true),
  champ("Autres titres", "otherTitles", false, "text", true),
  champ("Image (URL)", "image"),
  selectStatut(),
  textarea("Description", "description"),
  champ("Chapitres total", "chTotal"),
  champ("Chapitres lus (toi)", "chLus"),
  champ("Chapitres lus (Jade)", "chJade"),
  champ("Date", "date"),
  champ("Dernière lecture", "dernierLecture"),
  champ("Page", "page")
];

const onglets = [
  { id: "mangaForm", label: "Manga", genres: genresMangas, collection: "mangas", champs: champsManga },
  { id: "animeForm", label: "Anime", genres: genresAnimes, collection: "animes", champs: champsAnime },
  { id: "filmForm", label: "Film", genres: genresFilms, collection: "films", champs: champsFilm },
  { id: "serieForm", label: "Série", genres: genresSeries, collection: "series", champs: champsSerie },
  { id: "novelForm", label: "Novel", genres: genresNovels, collection: "novels", champs: champsNovel }
];

window.addEventListener("DOMContentLoaded", renderAllForms);

import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

function setDisabledAll(disabled) {
  document.querySelectorAll('form input, form textarea, form select, form button[type="submit"]').forEach(el => {
    if (el.closest('#loginNotice')) return; // ne touche pas le bandeau
    if (el.tagName === 'BUTTON') { el.disabled = disabled; }
    else { el.readOnly = disabled; el.disabled = disabled; }
  });
}

function applyRoleVisibility(user) {
  const email = user?.email || '';
  const isMegane = /megane\.lavoie24@gmail\.com/i.test(email);
  const isJade   = /jadelavoie51@gmail\.com/i.test(email);
  const role = isJade ? 'J' : isMegane ? 'M' : null;

  const notice = document.getElementById('loginNotice');

  if (!user) {
    // Pas connecté : on affiche tout, mais tout est désactivé
    if (notice) notice.style.display = '';
    document.querySelectorAll('[data-role]').forEach(el => { el.style.display = ''; });
    setDisabledAll(true);
    return;
  }

  // Connecté
  if (notice) notice.style.display = 'none';
  setDisabledAll(false);

  // Montre seulement les champs du rôle + ALL
  document.querySelectorAll('[data-role]').forEach(el => {
    const who = el.getAttribute('data-role'); // M, J, ALL
    el.style.display = (who === 'ALL' || who === role) ? '' : 'none';
  });
}

onAuthStateChanged(auth, (user) => applyRoleVisibility(user));





