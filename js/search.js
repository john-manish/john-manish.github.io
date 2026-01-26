document.addEventListener("articlesLoaded", () => {

  /* ===============================
     STATE
  =============================== */

  let activeYear = "all";
  let activeTag = "all";
  let searchQuery = "";

  const articles = document.querySelectorAll(".article");
  if (!articles.length) return;

  const filterBox = document.querySelector(".year-filter");
  const tagFilterBox = document.getElementById("tagFilter");

  const navSearchInput = document.getElementById("navSearchInput");
  const pageSearchInput = document.getElementById("pageSearchInput");

  /* ===============================
     SEARCH HANDLER (shared)
  =============================== */

  function handleSearchInput(value) {
    searchQuery = value.trim().toLowerCase();
    applyFilters();
  }

  navSearchInput?.addEventListener("input", () => {
    handleSearchInput(navSearchInput.value);
    if (pageSearchInput) pageSearchInput.value = navSearchInput.value;
  });

  pageSearchInput?.addEventListener("input", () => {
    handleSearchInput(pageSearchInput.value);
    if (navSearchInput) navSearchInput.value = pageSearchInput.value;
  });

  /* ===============================
     YEAR FILTER
  =============================== */

  if (filterBox) {
    const years = [...new Set(
      [...articles].map(a => a.dataset.year).filter(Boolean)
    )].sort((a, b) => b - a);

    filterBox.appendChild(createYearBtn("All", "all", true));
    filterBox.appendChild(createYearBtn("None", "none"));

    years.forEach(year => {
      filterBox.appendChild(createYearBtn(year, year));
    });
  }

  function createYearBtn(label, value, active = false) {
    const btn = document.createElement("button");
    btn.className = "year-btn" + (active ? " active" : "");
    btn.textContent = label;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".year-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      activeYear = value;
      applyFilters();
    });

    return btn;
  }

  /* ===============================
     TAG FILTER
  =============================== */

  if (tagFilterBox) {
    const tags = new Set();

    articles.forEach(article => {
      article.querySelectorAll(".tag").forEach(tag => {
        tags.add(tag.innerText.toLowerCase());
      });
    });

    tagFilterBox.appendChild(createTagBtn("All", "all", true));

    [...tags].forEach(tag => {
      tagFilterBox.appendChild(createTagBtn(tag, tag));
    });
  }

  function createTagBtn(label, value, active = false) {
    const btn = document.createElement("button");
    btn.className = "tag-btn" + (active ? " active" : "");
    btn.textContent = label;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".tag-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      activeTag = value;
      applyFilters();
    });

    return btn;
  }

  /* ===============================
     HIGHLIGHT HELPERS
  =============================== */

  function highlightText(element, query) {
    if (!query) return;

    if (!element.dataset.originalText) {
      element.dataset.originalText = element.innerText;
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!safeQuery) return;

    const regex = new RegExp(`(${safeQuery})`, "gi");
    element.innerHTML =
      element.dataset.originalText.replace(regex, `<mark>$1</mark>`);
  }

  function resetHighlight(element) {
    if (element.dataset.originalText) {
      element.innerHTML = element.dataset.originalText;
    }
  }

  function highlightElementText(element, query) {
    highlightText(element, query);
  }

  function resetElementHighlight(element) {
    resetHighlight(element);
  }

  /* ===============================
     APPLY FILTERS + ANIMATION
  =============================== */

  function applyFilters() {
    let visible = 0;

    articles.forEach(article => {
      const year = article.dataset.year;
      const title = article.querySelector("h3");
      const tags = [...article.querySelectorAll(".tag")]
        .map(t => t.innerText.toLowerCase());

      const textMatch =
        !searchQuery ||
        title.innerText.toLowerCase().includes(searchQuery) ||
        tags.some(t => t.includes(searchQuery));

      const yearMatch =
        activeYear === "all" ||
        (activeYear === "none" && !year) ||
        year === activeYear;

      const tagMatch =
        activeTag === "all" || tags.includes(activeTag);

      if (textMatch && yearMatch && tagMatch) {
        article.style.display = "flex";
        article.classList.remove("is-hidden");
        visible++;

        if (searchQuery) {
          highlightText(title, searchQuery);
          article.querySelectorAll(".tag")
            .forEach(tag => highlightElementText(tag, searchQuery));
        } else {
          resetHighlight(title);
          article.querySelectorAll(".tag")
            .forEach(resetElementHighlight);
        }

      } else {
        article.classList.add("is-hidden");

        setTimeout(() => {
          article.style.display = "none";
        }, 250);

        resetHighlight(title);
        article.querySelectorAll(".tag")
          .forEach(resetElementHighlight);
      }
    });
  }

  applyFilters();
});
