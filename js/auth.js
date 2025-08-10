// js/auth.js
import { auth, provider } from './firebaseConfig.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Gmail autorisés
const ADMIN_EMAILS = ['megane.lavoie24@gmail.com', 'jadelavoie51@gmail.com'];

// Affiche un bouton de connexion si besoin
export function checkAuthAccess(onAllowed, onDenied) {
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified && ADMIN_EMAILS.includes(user.email)) {
      console.log("✅ Accès autorisé :", user.email);
      onAllowed(user);
    } else {
      console.warn("❌ Accès refusé");
      onDenied();
    }
  });
}

export function connectWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (ADMIN_EMAILS.includes(user.email)) {
        location.reload(); // Rafraîchir si autorisé
      } else {
        alert("Accès refusé à " + user.email);
        signOut(auth);
      }
    })
    .catch((error) => {
      console.error("Erreur connexion :", error);
    });
}

export function disconnectUser() {
  signOut(auth).then(() => {
    location.reload();
  });
}
