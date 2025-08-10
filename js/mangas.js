// 📁 js/mangas.js

export const genresMangas = [
  "abu", "academy", "acting", "action", "adopted", "androgine", "animals", "apocalypse", "art",
  "arts-martiaux", "aventure", "badass", "beast world", "business", "brother", "caretaker",
  "child lead", "comédie", "contrat de mariage", "cooking", "crossdressing", "cultivation",
  "drame", "disciple", "divorce", "dungeon", "enfant", "fantasy", "father", "female lead",
  "food", "jeux vidéo", "ghosts", "harem", "historical", "horreur", "isekai", "idol",
  "long life", "magie", "male lead", "manga", "mature", "mécanique", "médicale", "militaire",
  "moderne", "monstre", "mother", "murim", "multi world", "multi life", "musique", "mystère",
  "novel", "omegaverse", "power", "prof", "psychologique", "réincarnation", "return",
  "revenge", "rich", "romance", "saint", "school life", "slice of Life", "seconde chance",
  "secret identity", "secte", "sick", "smart", "sport", "supernatural", "survie",
  "système", "teacher", "temps", "time travel", "traître", "trahison", "vampire",
  "veuve", "video game", "voisin", "war", "world building", "yandere"
];

// ✅ Vérifie si une œuvre est bien un manga
export function estManga(oeuvre) {
  return typeof oeuvre.chTotal !== "undefined";
}

// 🔍 Filtre une liste de mangas selon un genre spécifique
export function filtrerMangasParGenre(mangas, genre) {
  return mangas.filter(manga => Array.isArray(manga.genres) && manga.genres.includes(genre));
}

