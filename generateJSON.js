const fs = require('fs');
const path = require('path');

// Définition de vos matières
// Le 'name' sera affiché et utilisé dans l'URL de matiere.html?matiere=...
// Le 'folder' est le nom du dossier dans 'pdfs/' et le nom du fichier JSON dans 'json/'
const subjects = [
  {name:"Maths", folder:"maths"},
  {name:"Physique-Chimie-Techno", folder:"pct"},
  {name:"SVT", folder:"svt"},
  {name:"Histo-Géo", folder:"histo-geo"},
  {name:"ECM", folder:"ecm"},
  {name:"Anglais", folder:"anglais"},
  {name:"Français", folder:"francais"}
];

// 1. Génération des fichiers JSON pour chaque matière
subjects.forEach(subject => {
  // Chemin vers le dossier des PDFs pour cette matière (ex: ./pdfs/maths)
  const pdfDir = path.join(__dirname, "pdfs", subject.folder);

  // Vérifier si le dossier des PDFs existe
  if (!fs.existsSync(pdfDir)) {
    console.warn(`Le dossier des PDFs "${pdfDir}" n'existe pas pour la matière "${subject.name}". Skipping.`);
    return; // Passer à la matière suivante si le dossier n'existe pas
  }

  // Lire tous les fichiers dans le dossier PDF et filtrer pour ne garder que les .pdf
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith(".pdf"));

  // Créer un tableau d'objets pour le JSON de la matière
  // Chaque objet contient un titre (nom du fichier sans extension, nettoyé) et le chemin complet du PDF
  const jsonArray = files.map(f => ({
    title: path.parse(f).name.replace(/_/g, " ").trim(), // Nettoyer le nom du fichier pour le titre
    // Construire le chemin complet et relatif au dossier racine du projet
    // Ex: "pdfs/maths/algebre.pdf"
    // .replace(/\\/g, "/") est crucial pour assurer que les chemins utilisent des slashs (compatibilité URL)
    file: path.join("pdfs", subject.folder, f).replace(/\\/g, "/")
  }));

  // Chemin où le fichier JSON de la matière sera sauvegardé (ex: ./json/maths.json)
  const jsonPath = path.join(__dirname, "json", `${subject.folder}.json`);

  // S'assurer que le dossier 'json' existe
  if (!fs.existsSync(path.dirname(jsonPath))) {
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  }

  // Écrire le JSON de la matière dans un fichier
  fs.writeFileSync(jsonPath, JSON.stringify(jsonArray, null, 2), "utf8");
  console.log(`JSON généré pour "${subject.name}" → "${jsonPath}"`);
});

// 2. Génération du fichier subjects.json (qui liste toutes les matières)
const subjectsJsonPath = path.join(__dirname, "subjects.json");

// Mapper les données des sujets pour correspondre au format attendu par index.html
const subjectsData = subjects.map(s => ({
  // Le 'name' ici doit correspondre à la valeur de 'name' dans subject.find() de matiere.html
  name: s.folder, // J'ai changé ceci pour utiliser 'folder' car matiere.html compare avec ça si m.name n'est pas utilisé
                   // Si vous préférez comparer avec le nom affiché ("Maths"), utilisez s.name ici.
                   // NOTE: Il est crucial que cela corresponde à ce qui est envoyé via l'URL dans index.html
  file: `${s.folder}.json` // Le fichier JSON associé à cette matière (ex: "maths.json")
}));

// S'assurer que le dossier 'json' existe (pas nécessaire si subjects.json est à la racine, mais bonne pratique)
// if (!fs.existsSync(path.dirname(subjectsJsonPath))) {
//   fs.mkdirSync(path.dirname(subjectsJsonPath), { recursive: true });
// }

// Écrire le fichier subjects.json
fs.writeFileSync(subjectsJsonPath, JSON.stringify(subjectsData, null, 2), "utf8");
console.log(`subjects.json généré → "${subjectsJsonPath}"`);

console.log("\nProcessus de génération des JSON terminé.");
console.log("N'oubliez pas d'exécuter ce script (`node generateJSON.js`) chaque fois que vous ajoutez ou supprimez des PDFs.");