// js/main.js
import { db } from './firebaseConfig.js';
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const collections = ['mangas', 'animes', 'films', 'series', 'novels'];

const allData = {
  mangas: [],
  animes: [],
  films: [],
  series: [],
  novels: []
};

window.addEventListener('DOMContentLoaded', async () => {
  await chargerToutesLesCollections();
  afficherRésumé();
});

// 🔁 Charge toutes les collections Firestore
async function chargerToutesLesCollections() {
  const now = Date.now();
  const cache = JSON.parse(localStorage.getItem("archiveCache") || "{}");

  // Si le cache a moins de 10 minutes, on l'utilise
  if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
    console.log("📦 Chargement depuis le cache localStorage");
    Object.assign(allData, cache.data);
    return;
  }

  console.log("🔥 Chargement depuis Firestore");
  const freshData = {};

  for (const name of collections) {
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef);
    freshData[name] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  Object.assign(allData, freshData);

  // Enregistre dans le cache local
  localStorage.setItem("archiveCache", JSON.stringify({
    timestamp: now,
    data: freshData
  }));
}


// 📊 Analyse et affiche les stats globales
function afficherRésumé() {
  const container = document.querySelector('main');
  let contenuHTML = '<div class="row g-4 text-center">';

  for (const type of collections) {
    const list = allData[type];
    const total = list.length;

    let enCours = 0, termine = 0, nonCommence = 0;

    list.forEach(item => {
      const statut = (item.status || '').toLowerCase().trim();

      if (type === 'mangas' || type === 'novels') {
        const totalCh = item.chTotal || 0;
        const lusField = currentUserKey === "J" ? item.chJade : item.chLus;
        let chLus = 0;

        if (typeof lusField === 'string') {
          const parts = lusField.split('.').map(n => parseInt(n)).filter(n => !isNaN(n));
          if (parts.length) chLus = Math.max(...parts);
        } else if (typeof lusField === 'number') {
          chLus = lusField;
        }

        if (!chLus || chLus === 0) {
          nonCommence++;
        } else if (
          ['terminé', 'complet', 'abandonné'].some(s => statut.includes(s)) &&
          totalCh > 0 && chLus >= totalCh
        ) {
          termine++;
        } else {
          enCours++;
        }

      } else if (type === 'animes' || type === 'series') {
        const epTotal = item.episodeTotal || 0;
        const saTotal = item.saisonTotal || 0;
        const ep = currentUserKey === "J" ? item.episodeJ || 0 : item.episodeM || 0;
        const sa = currentUserKey === "J" ? item.saisonJ || 0 : item.saisonM || 0;

        if (!ep && !sa) {
          nonCommence++;
        } else if (
          ['terminé', 'complet', 'abandonné'].some(s => statut.includes(s)) &&
          ep >= epTotal && sa >= saTotal
        ) {
          termine++;
        } else {
          enCours++;
        }

      } else if (type === 'films') {
        const ecoute = (item.derniereEcoute || '').trim();
        if (ecoute) {
          termine++;
        } else {
          nonCommence++;
        }
      }
    });

    contenuHTML += `
      <div class="card h-100">
  <div class="card-body">
    <h5 class="card-title text-capitalize mb-3" style="color: var(--primary);">${type}</h5>
    <ul class="list-unstyled text-muted small">
  <li><i class="bi bi-book"></i> <strong>Total :</strong> ${total}</li>
  ${type !== 'films' ? `<li><i class="bi bi-hourglass-split"></i> <strong>En cours :</strong> ${enCours}</li>` : ''}
  <li><i class="bi bi-check-circle"></i> <strong>Terminé :</strong> ${termine}</li>
  <li><i class="bi bi-x-circle"></i> <strong>Non commencé :</strong> ${nonCommence}</li>
</ul>
  </div>
</div>

    `;
  }

  contenuHTML += '</div>';
  container.insertAdjacentHTML('beforeend', contenuHTML);
}
