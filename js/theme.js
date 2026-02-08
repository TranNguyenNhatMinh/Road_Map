(function () {
  const KEY = "roadmap-theme";

  function getTheme() {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch (_) {}
    if (typeof window.matchMedia !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (_) {}
    updateToggleLabel(theme);
  }

  function updateToggleLabel(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const label = btn.querySelector(".theme-toggle-label");
    const icon = btn.querySelector(".theme-toggle-icon");
    if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    if (icon) icon.textContent = theme === "dark" ? "☀" : "☽";
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || getTheme();
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  }

  function init() {
    const theme = getTheme();
    document.documentElement.setAttribute("data-theme", theme);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
      updateToggleLabel(theme);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
