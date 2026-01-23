/* =========================================================
   pass.js
   ---------------------------------------------------------
   Purpose:
   - Handles password authentication for gallery access
   - Uses SHA-256 hashing (client-side, casual protection)
   - Provides show/hide password (eye toggle)
   - Keeps room for legacy auth logic if needed later

   NOTE:
   This is NOT high-security authentication.
   Intended for personal / low-risk private pages only.
   ========================================================= */


/* =========================
   CONFIGURATION
   ========================= */

// Authentication mode selector
// "sha256"  → current secure method (recommended)
// "legacy"  → old plain-text method (disabled by default)
const AUTH_MODE = "sha256";

// Redirect target after successful login
const SUCCESS_REDIRECT = "gallery.html";

// Session key used to remember login state
const SESSION_KEY = "auth";

// SHA-256 password hash (change only this value)
const PASSWORD_HASH =
  "c2a7a056ddbf0555350aed698b983c858b46cd2d0f5ce756ded408b197632483";


/* =========================
   AUTO-REDIRECT (if logged in)
   ========================= */

if (sessionStorage.getItem(SESSION_KEY) === "yes") {
  window.location.href = SUCCESS_REDIRECT;
}


/* =========================
   UTILITIES
   ========================= */

/**
 * Generate SHA-256 hash for a given string
 * @param {string} text - Plain text input
 * @returns {Promise<string>} Hexadecimal hash
 */
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}


/* =========================
   AUTHENTICATION HANDLERS
   ========================= */

/**
 * Main authentication entry point
 * Called from HTML form on submit
 */
async function check() {
  if (AUTH_MODE === "sha256") {
    await sha256Auth();
    return;
  }

  if (AUTH_MODE === "legacy") {
    legacyAuth(); // intentionally inactive
    return;
  }

  console.error("Invalid AUTH_MODE configuration");
}


/**
 * SHA-256 based authentication (ACTIVE)
 */
async function sha256Auth() {
  const input = document.getElementById("pwd").value;
  const hash = await sha256(input);

  if (hash === PASSWORD_HASH) {
    sessionStorage.setItem(SESSION_KEY, "yes");
    window.location.href = SUCCESS_REDIRECT;
  } else {
    alert("Wrong password");
  }
}


/**
 * Legacy plain-text authentication (INACTIVE)
 * -------------------------------------------------
 * This is intentionally kept for reference/testing.
 * DO NOT enable with real passwords.
 */
function legacyAuth() {
  // const PASSWORD = "example_only";
  // const input = document.getElementById("pwd").value;

  // if (input === PASSWORD) {
  //   sessionStorage.setItem(SESSION_KEY, "yes");
  //   window.location.href = SUCCESS_REDIRECT;
  // } else {
  //   alert("Wrong password");
  // }
}


/* =========================
   UI HELPERS
   ========================= */

/**
 * Toggle password visibility (eye icon)
 */
function toggle() {
  const pwd = document.getElementById("pwd");
  const eye = document.getElementById("eye");

  if (pwd.type === "password") {
    pwd.type = "text";
    eye.textContent = "🙈";
  } else {
    pwd.type = "password";
    eye.textContent = "👁️";
  }
}




// LEGACY AUTHENTICATION (PLAIN TEXT) - DISABLED BY DEFAULT // FOR REFERENCE ONLY  // NOT RECOMMENDED FOR USE // LOW SECURITY 
/*  if (AUTH_MODE !== "legacy") return;
const PASSWORD = "my random password";

if (sessionStorage.getItem("auth") === "yes") {
  window.location.href = "gallery.html";
}

function check() {
  const input = document.getElementById("pass").value;
  if (input === PASSWORD) {
    sessionStorage.setItem("auth", "yes");
    window.location.href = "gallery.html";
  } else {
    document.getElementById("msg").innerText = "Wrong password";
  }
}
*/