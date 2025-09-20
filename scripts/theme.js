document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Vérifier si un thème a déjà été défini par l'utilisateur
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        body.classList.add(currentTheme);
    }

    themeToggleBtn.addEventListener("click", () => {
        // Basculer la classe 'dark-mode' sur le corps de la page
        body.classList.toggle("dark-mode");

        // Mettre à jour le texte du bouton et enregistrer la préférence
        if (body.classList.contains("dark-mode")) {
            themeToggleBtn.textContent = "☀️ Mode clair";
            localStorage.setItem("theme", "dark-mode");
        } else {
            themeToggleBtn.textContent = "🌙 Mode sombre";
            localStorage.removeItem("theme"); // ou localStorage.setItem("theme", "light-mode");
        }
    });
});