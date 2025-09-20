document.addEventListener("DOMContentLoaded", () => {
  let matieresCache = [];
  let touspdfs = []; 

  // Charger les matières au démarrage
  fetch("subjects.json")
    .then(res => {
        if (!res.ok) throw new Error("Erreur de chargement de subjects.json");
        return res.json();
    })
    .then(data => {
      matieresCache = data;

      // Générer les boutons matières
      const container = document.getElementById("matiereContainer");
      container.innerHTML = "";
      data.forEach(m => {
        const link = document.createElement("a");
        link.href = `matiere.html?matiere=${m.name}`;
        link.className = "btn-matiere";
        
        // --- NOUVEAU : Application des couleurs directement ---
        link.style.backgroundColor = m.color; 
        link.style.color = "white"; 
        // Si la couleur est claire, on peut mettre le texte en noir.
        if (m.name === "ecm") {
          link.style.color = "black";
        }
        
        link.innerHTML = `<i class="fas ${m.icon}"></i> ${m.name.charAt(0).toUpperCase() + m.name.slice(1)}`;
        
        // Assurer la couleur de l'icône, car link.style.color peut ne pas s'appliquer
        const icon = link.querySelector('i');
        if (icon) {
            icon.style.color = link.style.color;
        }

        container.appendChild(link);
      });

      // Charger tous les PDFs
      const fetchPromises = data.map(m =>
        fetch(`json/${m.file}`)
          .then(res => {
            if (!res.ok) throw new Error(`Erreur de chargement de ${m.file}`);
            return res.json();
          })
          .catch(err => {
            console.error(err.message);
            return [];
          })
      );
      
      return Promise.all(fetchPromises);
    })
    .then(jsonsArray => {
      jsonsArray.forEach((pdfList, index) => {
        const matiereName = matieresCache[index].name;
        if (Array.isArray(pdfList)) {
          pdfList.forEach(pdfItem => {
            touspdfs.push({
              title: pdfItem.title,
              fichier: pdfItem.file,
              matiereName: matiereName
            });
          });
        }
      });
    })
    .catch(err => {
      console.error(err.message);
      document.getElementById("matiereContainer").innerHTML = "<p style='color:red'>⚠️ Impossible de charger la liste des matières.</p>";
    });

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const suggestionList = document.getElementById("suggestionList");
  const resultatsRecherche = document.getElementById("resultatsRecherche");
  
  // Fonctions de recherche et d'autocomplétion
  const suggestions = () => {
    const val = searchInput.value.toLowerCase();
    suggestionList.innerHTML = "";
    if (!val) return;

    const matches = touspdfs.filter(d => 
      d.title.toLowerCase().includes(val) || d.fichier.toLowerCase().includes(val)
    ).slice(0, 10);

    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = `${match.matiereName.charAt(0).toUpperCase() + match.matiereName.slice(1)} → ${match.title}`;
      li.onclick = () => {
        window.open(match.fichier, "_blank");
        searchInput.value = match.title;
        suggestionList.innerHTML = "";
      };
      suggestionList.appendChild(li);
    });
  };

  const rechercher = () => {
    const motCle = searchInput.value.toLowerCase().trim();
    suggestionList.innerHTML = "";
    resultatsRecherche.innerHTML = "<p>⏳ Recherche en cours...</p>";

    if (!motCle) {
      resultatsRecherche.innerHTML = "<p style='color:red'>⚠️ Entrez un mot clé.</p>";
      return;
    }

    const resultats = touspdfs.filter(d => 
      d.title.toLowerCase().includes(motCle) || d.fichier.toLowerCase().includes(motCle)
    );

    if (resultats.length === 0) {
      resultatsRecherche.innerHTML = "<p style='color:orange'>😢 Aucun document trouvé.</p>";
    } else {
      let html = "<h3>Résultats :</h3><ul>";
      resultats.forEach(r => {
        html += `<li><b>${r.matiereName.charAt(0).toUpperCase() + r.matiereName.slice(1)}</b> → <a href="${r.fichier}" target="_blank">${r.title}</a></li>`;
      });
      html += "</ul>";
      resultatsRecherche.innerHTML = html;
    }
  };

  // Ajout des écouteurs d'événements
  searchInput.addEventListener("input", suggestions);
  searchBtn.addEventListener("click", rechercher);
});