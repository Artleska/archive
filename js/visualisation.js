// 📁 js/visualisation.js (optimisé, compact, responsive, avec structure layout améliorée pour la popup)
import { db } from './firebaseConfig.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function chargerDonneesCategorie(nomCollection) {
  const snap = await getDocs(collection(db, nomCollection));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function calculerProgression(oeuvre, type, currentUserKey) {
  if (type === 'mangas' || type === 'novels') {
    const total = oeuvre.chTotal || 0;
    const lusField = currentUserKey === 'J' ? oeuvre.chJade : oeuvre.chLus;
    let lus = 0;
    if (typeof lusField === 'string') {
      const parts = lusField.split('.').map(n => parseInt(n)).filter(n => !isNaN(n));
      if (parts.length) lus = Math.max(...parts);
    } else if (typeof lusField === 'number') {
      lus = lusField;
    }
    const termine = (oeuvre.status || '').toLowerCase().includes('termin') && lus >= total;
    return `${lus}/${total}` + (termine ? ' ✅' : '');
  } else if (type === 'animes' || type === 'series') {
    const epTotal = oeuvre.episodeTotal || 0;
    const saTotal = oeuvre.saisonTotal || 0;
    const ep = currentUserKey === 'J' ? oeuvre.episodeJ || 0 : oeuvre.episodeM || 0;
    const sa = currentUserKey === 'J' ? oeuvre.saisonJ || 0 : oeuvre.saisonM || 0;
    const termine = ep >= epTotal && sa >= saTotal && (oeuvre.status || '').toLowerCase().includes('termin');
    return `${ep}/${epTotal} ép. – ${sa}/${saTotal} sais.` + (termine ? ' ✅' : '');
  } else if (type === 'films') {
    return oeuvre.derniereEcoute ? 'Visionné ✅' : 'Non commencé';
  }
  return '';
}

export function creerCarte(oeuvre, type, currentUserKey) {
  const progression = calculerProgression(oeuvre, type, currentUserKey);
  const img = oeuvre.image || '../images/ImageCarte.jpg';
  return `
    <div class="oeuvre-card" data-id="${oeuvre.id}">
      <div class="img-wrapper">
        <img src="${img}" alt="${oeuvre.title}" loading="lazy"
     onerror="this.onerror=null;this.src='../images/ImageCarte.jpg'">
      </div>
      <h3>${oeuvre.title}</h3>
      <p class="progression">${progression}</p>
    </div>`;
}

export function afficherCartes(oeuvres, type, containerId, currentUserKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = oeuvres.map(o => creerCarte(o, type, currentUserKey)).join('');
  container.querySelectorAll(".oeuvre-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const oeuvre = oeuvres.find(o => o.id === id);
      afficherPopup(oeuvre, type, currentUserKey, oeuvres);
    });
  });
}

function formatDateFr(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return `${day === '01' ? '1er' : parseInt(day)} ${mois[parseInt(month)-1]} ${year}`;
}

function afficherPopup(oeuvre, type, currentUserKey, allOeuvres) {
  const popup = document.createElement('div');
  popup.className = 'modal-lux';

 const titres = [oeuvre.title, ...(oeuvre.otherTitles || [])]
  .filter(Boolean)
  .map(t => `<span class="titre-item">${t}</span>`)
  .join('');
  const description = oeuvre.description || "";
  const genres = (oeuvre.genres || []).map(g => `<span class="badge-genre">${g}</span>`).join('');
  const links = Object.entries(oeuvre.externalLinks || {}).map(([name, url]) => `<a class="badge-link" href="${url}" target="_blank">${name}</a>`).join('');

  const chLus = oeuvre.chLus || '';
  const chJade = oeuvre.chJade || '';
  const dernierLecture = oeuvre.derniereLecture || '';
  const page = oeuvre.page || '';
  const lastModif = oeuvre.lastModified || '';

  const similaires = (oeuvre.similaires || []).map(id => {
    const match = allOeuvres.find(o => o.id === id);
    if (!match) return '';
    return `<div class="oeuvre-card mini" data-id="${match.id}"><div class="img-wrapper"><img src="${match.image || ''}" alt="" /></div><h3>${match.title}</h3></div>`;
  }).join('');

const userInfo = currentUserKey === 'M'
  ? `
    <div class="popup-mini-fields">
      <div><b>Date</b><br>${oeuvre.date || '—'}</div>
      <div><b>Lecture</b><br>${formatDateFr(dernierLecture) || '—'}</div>
      <div><b>Ch lus</b><br>${chLus || '—'}</div>
      <div><b>Ch total</b><br>${oeuvre.chTotal || '—'}</div>
    </div>`
  : `
    <div class="popup-mini-fields">
      <div><b>Date</b><br>${oeuvre.date || '—'}</div>
      <div><b>Page</b><br>${page || '—'}</div>
      <div><b>Ch lus</b><br>${chJade || '—'}</div>
      <div><b>Ch total</b><br>${oeuvre.chTotal || '—'}</div>
    </div>`;


  const toggleFields = currentUserKey === 'M'
    ? `<span class="toggle-btn" data-target="J">J</span><span class="toggle-btn" data-target="page">📖</span>`
    : `<span class="toggle-btn" data-target="M">M</span><span class="toggle-btn" data-target="lecture">📅</span>`;

  const hiddenFields = currentUserKey === 'M'
    ? `<div class="hidden-field" data-role="J"><b>Ch lus</b> ${chJade}</div><div class="hidden-field" data-role="page"><b>Page</b> ${page}</div>`
    : `<div class="hidden-field" data-role="M"><b>Ch lus:</b> ${chLus}</div><div class="hidden-field" data-role="lecture"><b>Dernière lecture</b> ${formatDateFr(dernierLecture)}</div>`;

    const statut = oeuvre.status || '';

  popup.innerHTML = `
    <div class="modal-content-lux">
      <span class="modal-close">×</span>
      <!-- remplace le bloc image par ça -->
<div class="modal-illustration">
  <img class="img-blur" alt="" aria-hidden="true">
  <img class="img-main" alt="cover">
</div>

      <div class="popup-header">
  <div class="title-id-row">
    <h2>${oeuvre.title}</h2>
    <span class="id-badge" onclick="this.nextElementSibling.classList.toggle('show')">ID</span>
    <div class="hidden-field"><span>${oeuvre.id}</span><button class="id-copy" onclick="navigator.clipboard.writeText('${oeuvre.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
</svg></button></div>
  </div>
</div>

      <div class="popup-titres">${titres}</div>
      <div class="genres-scroll">${genres}</div>
      ${statut ? `<div class="popup-statut"><strong>Statut :</strong> ${statut}</div>` : ''}
      ${userInfo}
      <div class="popup-desc">${description}</div>
      <div class="popup-links">${links}</div>
      <div class="popup-toggle-group">${toggleFields}<span class="toggle-btn" data-target="modif">🕓</span></div>
      <div class="hidden-field" data-role="modif">Modifié : ${lastModif}</div>
      ${hiddenFields}
      <div class="modal-section"><h3>Similaires</h3><div class="row g-2">${similaires}</div></div>
    </div>`;


    const cover = oeuvre.image || '../images/ImageCarte.jpg';
popup.querySelector('.img-main').src = cover;
popup.querySelector('.img-blur').src = cover;

// Crée une bande floue placée derrière l’image nette, pleine largeur
const blurBar = document.createElement('div');
blurBar.className = 'popup-blur-behind-image';
blurBar.style.backgroundImage = `url('${oeuvre.image || '../images/ImageCarte.jpg'}')`;

const imgWrapper = popup.querySelector('.img-wrapper');
imgWrapper.parentNode.insertBefore(blurBar, imgWrapper); // place AVANT l’image nette

// 💥 ERREUR ici : imgMain n'est pas encore défini
const imgMain = popup.querySelector('.img-main'); // <-- tu dois le définir ici

if (imgWrapper && imgMain) {
  imgMain.src = oeuvre.image || '../images/ImageCarte.jpg';
  imgMain.onerror = () => {
    imgMain.src = '../images/ImageCarte.jpg';
  };

  const oldBlur = imgWrapper.querySelector('.img-blur');
  if (oldBlur) oldBlur.remove();

  const blur = document.createElement('div');
  blur.className = 'img-blur';
  blur.style.backgroundImage = `url('${oeuvre.image || ''}')`;
  imgWrapper.prepend(blur);
}

document.body.appendChild(popup);
popup.querySelector(".modal-close").onclick = () => popup.remove();

popup.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.onclick = () => {
    const role = btn.dataset.target;
    popup.querySelectorAll(`.hidden-field[data-role="${role}"]`).forEach(el => el.classList.toggle('show'));
  };
});

popup.querySelectorAll(".oeuvre-card.mini").forEach(card => {
  card.addEventListener("click", () => {
    popup.remove();
    const id = card.dataset.id;
    const match = allOeuvres.find(o => o.id === id);
    afficherPopup(match, type, currentUserKey, allOeuvres);
  });
});
} // 👈 cette accolade-là est la vraie fin de la fonction
