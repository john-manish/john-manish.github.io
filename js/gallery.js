 // ===== AUTH CHECK =====
// Prevent direct access to gallery page without session auth
// Redirects to pass.html if user is not authenticated 
if (sessionStorage.getItem("auth") !== "yes") {
  window.location.href = "pass.html";
}



// ===== SIDEBAR MENU =====
// Opens and closes mobile sidebar navigation
// Also hides logout button when menu is open to avoid overlap

// Open and close sidebar 

function openMenu() {
  document.getElementById("sidebar").style.right = "0";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("logoutBtn").style.display = "none";
}

function closeMenu() {
  document.getElementById("sidebar").style.right = "-320px";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("logoutBtn").style.display = "block";
}



// Submenu toggle 
// Expand and collapse submenu items

document.querySelectorAll(".submenu-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("open");
  });
});






// ===== LOGOUT =====
// Clears session auth and redirects to password page

// Logout function
function logout() {
  sessionStorage.removeItem("auth");
  window.location.href = "pass.html";
}


// ===== LOGOUT BUTTON AUTO-HIDE =====
// Hides logout button when scrolling down
// Shows it again when scrolling up
// Improves mobile and desktop UX

let lastScrollY = window.scrollY;
const logoutBtn = document.getElementById("logoutBtn");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    // scrolling DOWN → hide
    logoutBtn.style.transform = "translateY(-100px)";
    logoutBtn.style.opacity = "0";
  } else {
    // scrolling UP → show
    logoutBtn.style.transform = "translateY(0)";
    logoutBtn.style.opacity = "1";
  }

  lastScrollY = currentScrollY;
});




//new
// Smooth scroll to top

/* function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}           
 */                                                                          
// End of new




// ===== THEME & FOOTER MODE =====
// Global theme: light / dark
// Footer mode: auto / forced light / forced dark
// Preferences are persisted using localStorage

// Theme and Footer Mode Toggle Script

const body = document.body;
const footer = document.getElementById("siteFooter");

const themeBtn = document.getElementById("themeToggle");
const footerBtn = document.getElementById("footerToggle");

/* ===== LOAD SAVED STATE ===== */
const savedTheme = localStorage.getItem("theme");
const savedFooter = localStorage.getItem("footerMode");

if (savedTheme === "dark") body.classList.add("dark");
footer.dataset.mode = savedFooter || "auto";

syncIcons();

/* ===== GLOBAL THEME TOGGLE ===== */
function toggleTheme() {
  body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    body.classList.contains("dark") ? "dark" : "light"
  );

  /* reset footer to auto when theme changes */
  footer.dataset.mode = "auto";
  localStorage.setItem("footerMode", "auto");

  syncIcons();
}

/* ===== FOOTER-ONLY TOGGLE ===== */
function toggleFooterMode() {
  const mode = footer.dataset.mode;

  if (mode === "auto") {
    footer.dataset.mode = body.classList.contains("dark") ? "light" : "dark";
  } else if (mode === "light") {
    footer.dataset.mode = "dark";
  } else {
    footer.dataset.mode = "light";
  }

  localStorage.setItem("footerMode", footer.dataset.mode);
  syncIcons();
}

/* ===== ICON + LABEL SYNC ===== */
function syncIcons() {
  themeBtn.textContent = body.classList.contains("dark") ? "🌞" : "🌙";

  const fm = footer.dataset.mode;
  footerBtn.textContent =
    fm === "auto" ? "🌓 Auto" : fm === "light" ? "🌞 Light" : "🌙 Dark";
}







// ===== LIGHTBOX =====
// Handles fullscreen image viewing
// Supports:
// - Click to open
// - Keyboard navigation (← → Esc)
// - Swipe navigation (mobile)
// - On-screen arrows (desktop)
// - Image counter (e.g. 3 / 16)


// Cache gallery images once
// Reused by:
// - Lightbox open
// - Navigation
// - Fade-in logic
// Do NOT rename or duplicate this variable
const images = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const counter = document.getElementById("lightbox-counter");

let currentIndex = 0;

// Open
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  updateLightbox();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Update image + counter
function updateLightbox() {
  lightboxImg.src = images[currentIndex].src;
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}


// Navigation
function navigate(dir) {
  currentIndex += dir;

  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;

  updateLightbox();
}

// Close events
closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});


// ===== KEYBOARD SUPPORT =====
// Enables navigation using arrow keys
// Esc closes the lightbox
// Only active when lightbox is open

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") navigate(1);
  if (e.key === "ArrowLeft") navigate(-1);
});



// ===== MOBILE SWIPE SUPPORT =====
// Detects left/right swipe gestures on lightbox
// Used instead of arrows on small screens
// Threshold prevents accidental swipes

let startX = 0;
let endX = 0;

lightbox.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", () => {
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) navigate(1);   // swipe left → next
    else navigate(-1);           // swipe right → previous
  }
});


// ===== LIGHTBOX ARROWS =====
// Visible navigation controls for desktop users
// Guarded to prevent JS errors if buttons are removed later

const prevBtn = document.querySelector(".lightbox-nav.prev");
const nextBtn = document.querySelector(".lightbox-nav.next");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));
}




// ===== IMAGE FADE-IN (FINAL, STABLE) =====
// Adds smooth fade-in effect when images load
// Works with lazy-loading and cached images
// Uses `img.complete` to avoid race conditions
// Error handler ensures broken images are still shown



images.forEach(img => {

  const show = () => img.classList.add("loaded");

  if (img.complete) {
    show();
  } else {
    img.addEventListener("load", show, { once: true });
    img.addEventListener("error", show, { once: true });
  }

});




// ===== IMAGE FILTERING =====
// Filters gallery images based on selected category
// "All" shows all images
// Uses data-category attributes for filtering

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryImages = document.querySelectorAll(".gallery img");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Active button state
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    galleryImages.forEach(img => {
      if (filter === "all" || img.dataset.category === filter) {
        img.style.display = "";
      } else {
        img.style.display = "none";
      }
    });
  });
});

