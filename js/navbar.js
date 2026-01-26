/* ======================================
   THEME TOGGLE (same as index.html)
====================================== */

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

// Load saved theme or default to dark
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else {
  root.setAttribute("data-theme", "dark");
}

function updateThemeIcon() {
  themeToggle.textContent =
    root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
}
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  const nextTheme =
    root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
  updateThemeIcon();
});


/* ======================================
   MOBILE MENU TOGGLE
====================================== */

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}


/* ======================================
   DROPDOWN TOGGLE (mobile support)
====================================== */

document.querySelectorAll(".drop-title").forEach(title => {
  title.addEventListener("click", () => {
    title.nextElementSibling.classList.toggle("show");
  });
});


/* ======================================
   NAVBAR SEARCH UI (visual only)
====================================== */

const searchToggle = document.getElementById("searchToggle");
const searchBox = document.querySelector(".nav-search");
const searchInput = document.getElementById("navSearchInput");

if (searchToggle && searchBox && searchInput) {

  // Toggle search (STOP bubbling)
  searchToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
      searchInput.focus();
    }
  });

  // Clicks inside search should NOT close it
  searchBox.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close only when clicking outside
  document.addEventListener("click", () => {
    searchBox.classList.remove("active");
  });
}

