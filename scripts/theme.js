document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️ Mode clair";
  } else {
    toggleBtn.textContent = "🌙 Mode sombre";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.add("fade");
    setTimeout(() => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️ Mode clair";
      } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙 Mode sombre";
      }
      body.classList.remove("fade");
    }, 200);
  });
});
