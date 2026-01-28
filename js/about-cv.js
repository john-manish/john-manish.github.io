function isDesktop() {
  return window.matchMedia("(min-width: 769px)").matches;
}




fetch("data/about-cv.json")
  .then(res => res.json())
  .then(data => {
    renderProfile(data.profile);
    renderSections(data.sections, data.profile);
  });

/* =========================
   PROFILE
========================= */

function renderProfile(p) {
  if (!p) return;

  document.getElementById("cvProfile").innerHTML = `
    <img src="${p.avatar || ""}" alt="${p.name}" class="cv-avatar">
    <h2>${p.name}</h2>
    <p class="muted">${p.role}</p>

    <ul class="cv-info">
      <li>📍 ${p.location}</li>
      <li>📧 ${p.email}</li>
      <li>🌐 <a href="${p.website}" target="_blank">${p.website}</a></li>
    </ul>
  `;
}

/* =========================
   SECTIONS
========================= */

function renderSections(sections, profile) {
  if (!sections || !sections.length) return;

  const contentBox = document.getElementById("cvContent");
  const personalBox = document.getElementById("cvPersonal");
  const metricsBox = document.getElementById("cvMetrics");

  sections.forEach(section => {
    /* ---------- PROFESSION ---------- */
    if (section.id === "profession") {
      const el = createSection(section.title);

      el.innerHTML += `
        <p>
          <strong>${section.content.title}</strong>
          <span class="muted">(${section.content.period})</span>
        </p>
        <p>${section.content.description}</p>
      `;

      applyToggle(el, section);
      contentBox.appendChild(el);
    }

    /* ---------- EDUCATION ---------- */
    if (section.id === "education") {
      const el = createSection(section.title);

      el.innerHTML += section.items.map(ed => `
        <p>
          <strong>${ed.institute}</strong>
          <span class="muted">(${ed.period})</span>
        </p>
        <p>${ed.description}</p>
        <hr>
      `).join("");

      applyToggle(el, section);
      contentBox.appendChild(el);
    }

    /* ---------- PROJECTS ---------- */
    if (section.id === "projects") {
      const el = createSection(section.title);

      el.innerHTML += section.items.map(pr => `
        <p>
          <strong>${pr.title}</strong><br>
          <a href="${pr.link}" target="_blank">${pr.link}</a><br>
          <span class="muted">${pr.description}</span>
        </p>
      `).join("");

      applyToggle(el, section);
      contentBox.appendChild(el);
    }

    /* ---------- SKILLS / INTERESTS / AUTHOR ---------- */
    if (section.id === "skills") {
      const el = createSection(section.title);


      el.innerHTML += `
        ${renderChips("Skills", section.content.skills)}
        ${renderChips("Languages", section.content.languages)}
       ${renderChips("Interests", section.content.interests)}

         ${
            profile?.author
        ? `<p class="cv-author">Author — ${profile.author}</p>`
        : ""
    }

      `;

      applyToggle(el, section);
      personalBox.appendChild(el);
    }

    /* ---------- METRICS / FOCUS AREAS ---------- */
    if (section.id === "metrics") {
      const el = createSection(section.title);

      el.innerHTML += section.items.map(m => `
        <div class="metric-item">
          <span>${m.name}</span>
          <div class="metric-bar">
            <div class="metric-fill" style="width:${m.level}%">
              ${m.level}%
            </div>
          </div>
        </div>
      `).join("");

       applyToggle(el, {
          ...section,
          defaultOpen: isDesktop()
        });

        metricsBox.appendChild(el);
      }
  });
}

/* =========================
   SECTION FACTORY
========================= */

function createSection(title) {
  const div = document.createElement("div");
  div.className = "cv-section";
  div.innerHTML = `<h3>${title}</h3>`;
  return div;
}

/* =========================
   SAFE TOGGLE (FIXED)
========================= */

function applyToggle(sectionEl, config) {
  if (!config.toggle) return;

  const header = sectionEl.querySelector("h3");
  if (!header) return;

  const body = document.createElement("div");
  body.className = "toggle-content";

  // 🔒 collect siblings FIRST (critical fix)
  const nodes = [];
  let sibling = header.nextSibling;
  while (sibling) {
    nodes.push(sibling);
    sibling = sibling.nextSibling;
  }

  nodes.forEach(node => body.appendChild(node));
  sectionEl.appendChild(body);

  const icon = document.createElement("span");
  icon.className = "toggle-icon";
  icon.textContent = "+";
  header.appendChild(icon);

  const open = config.defaultOpen === true;
  body.style.display = open ? "block" : "none";
  header.classList.toggle("open", open);

  header.style.cursor = "pointer";
  header.setAttribute("tabindex", "0");
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", String(open));

  function toggleSection() {
    const isOpen = body.style.display === "block";
    body.style.display = isOpen ? "none" : "block";
    header.classList.toggle("open", !isOpen);
    header.setAttribute("aria-expanded", String(!isOpen));
  }

  header.addEventListener("click", toggleSection);
  header.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSection();
    }
  });
}

/* =========================
   CHIPS (WITH AUTHOR SUPPORT)
========================= */

function renderChips(title, items, extra = []) {
  const all = [...(items || []), ...(extra || [])];
  if (!all.length) return "";

  return `
    <div class="chip-group">
      <h4>${title}</h4>
      <div class="chips">
        ${all.map(i => `<span class="chip">${i}</span>`).join("")}
      </div>
    </div>
  `;
}
