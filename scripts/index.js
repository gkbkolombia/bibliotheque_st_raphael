fetch("subjects.json")
.then(res => res.json())
.then(subjects => {
  const list = document.getElementById("subjects-list");
  subjects.forEach(s => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `matiere.html?file=${s.file}&name=${encodeURIComponent(s.name)}`;
    link.textContent = s.name;
    li.appendChild(link);
    list.appendChild(li);
  });
})
.catch(e => console.error("Erreur:", e));
