// 📁 js/mangas.js

export const genresMangas = [
  "abu","abandoned", "academy", "acting", "action", "athlete", "adopted","alien", "androgine", "animals", "animal characteristics","ancestor","amnesia","a.i.", "apocalypse", "art","arttist",
  "arts-martiaux", "aventure","aveugle", "badass", "beast world","beast tamer", "business", "brother", "caretaker",
  "célèbre","child lead","changement d'apparence","change species","cohabitation","constellation", "comédie", "contrat de mariage", "cooking", "crazy", "criminel", "crossdressing", "cultivation",
  "demon", "designer","drame", "disciple", "divorce","différence d'age", "dungeon","échange de corps","esclave", "enfant", "enfer","fantasy", "father", "female lead", "farmer",
  "food", "jeux vidéo","game become reality","gender transformation", "ghosts", "guerre","handicap", "harcelé","harem", "healer", "historical", "horreur", "hero", "isekai", "idol","invinble","intelligent",
  "lazy", "library","long life", "magie", "male lead","maid", "manga", "mature","mariage arrangé", "mariage", "mécanique", "médicale", "mental aspital", "mental illness","mendiant", "meurtre","militaire",
  "moderne","mort", "monstre", "mother","monde parallèle", "murim", "multi world", "multi life", "musique", "mystère",
  "novel","noble","non humain", "omegaverse", "overpowered", "patisserie","power","police", "prof", "psychologique" ,"pregnancy", "rajeunissement", "reclus", "réincarnation", "relic","remarriage","return","retraite","revival",
  "revenge", "rich", "romance", "saint","sans habrie", "school life","science","servant","showbiz","special ability", "slice of Life", "seconde chance",
  "secret identity", "secte", "sick", "sport","suicide", "supernatural", "survie",
  "système", "tattoo", "temps","time limit", "time travel", "tower", "tyrant","transmigration","transformation", "traître", "trahison","ugly", "vampire", "villainess","villain",
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

