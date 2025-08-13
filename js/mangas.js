// 📁 js/mangas.js

export const genresMangas = [
  "abu","abandoned", "academy", "acting", "action", "athlete", "adopted","age gap","alien", "androgine", "animals", "animal characteristics","ancestor","amnesia","a.i.", "apocalypse", "art","artist",
  "arts-martiaux", "aventure","aveugle","body swap", "badass", "beast world","beast tamer", "business", "brother", "caretaker",
  "célèbre","child","child lead","changement d'apparence","change species","cohabitation","constellation", "comédie", "cooking", "crazy", "criminel", "crossdressing", "cultivation",
  "demon", "designer","drame", "disciple", "divorce", "dungeon","esclave","ex-op","fantasy", "father", "female lead", "farmer",
  "food","game become reality","gender transformation", "ghosts", "guerre","handicap", "harcelé","harem", "healer","hell", "historical", "horreur", "hero", "isekai", "idol","invincible","intelligent","jeux vidéo","kidnapping",
  "lazy", "library","long life", "magie", "male lead","maid", "manga", "mature","mariage arrangé", "mariage"," mariage contractuel", "mécanique", "médicale", "mental hospital", "mental illness","mendiant", "meurtre","militaire",
  "moderne","mort", "monstre", "mother","monde parallèle", "murim", "multi world", "multi life", "musique", "mystère",
  "novel","noble","non humain", "omegaverse", "overpowered", "patisserie","power","police", "prof", "psychologique" ,"pregnancy", "rajeunissement", "reclus", "réincarnation", "relic","remariage","return","retraite","revival",
  "revenge", "rich", "romance", "saint", "school life","science","servant","showbiz","special ability", "slice of Life", "seconde chance",
  "secret identity", "secte", "sick", "sport","suicide", "supernatural", "survival",
  "système", "tattoo", "time","time limit", "time travel", "tower", "tyrant","transmigration","transformation", "traître", "trahison","ugly", "vampire", "villainess","villain",
  "veuve", "writer","yuri", "yaoi", "zombie"
];

// ✅ Vérifie si une œuvre est bien un manga
export function estManga(oeuvre) {
  return typeof oeuvre.chTotal !== "undefined";
}

// 🔍 Filtre une liste de mangas selon un genre spécifique
export function filtrerMangasParGenre(mangas, genre) {
  return mangas.filter(manga => Array.isArray(manga.genres) && manga.genres.includes(genre));
}

