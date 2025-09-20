const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get("file");
const name = urlParams.get("name");

document.getElementById("matiere-title").textContent = `📖 ${name}`;

fetch(`json/${file}`)
.then(res => res.json())
.then(pdfs => {
  console.log(pdfs); // vérifie si les PDF sont bien lus
  const list = document.getElementById("pdf-list");
  pdfs.forEach(pdf => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `pdfs/${file.replace(".json","")}/${pdf.file}`;
    link.textContent = pdf.title;
    link.target = "_blank";
    li.appendChild(link);
    list.appendChild(li);
  });
})
.catch(e => console.error("Erreur:", e));
