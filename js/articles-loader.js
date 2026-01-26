document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("articlesContainer");
  const skeleton = document.getElementById("skeletonContainer");

  if (!container) return;

  try {
    const res = await fetch("data/articles.json");
    const articles = await res.json();

    // 🔽 SORT BY DATE (newest first)
    articles.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    container.innerHTML = articles.map(a => {
      // Tags (optional)
      const tagsHTML = Array.isArray(a.tags)
        ? `<div class="tags">
           ${a.tags.map(tag =>
        `   <button class="tag" data-tag="${tag}">${tag}</button>`
         ).join("")}
          </div>`
        : "";


      return `
        <article class="article" data-year="${a.year}">
          <img src="${a.image}">
          <div class="article-content font12">
            <a href="${a.url}">
              <h3>${a.title}</h3>
            </a>
            <span>${a.date} · ${a.readTime}</span>
            ${tagsHTML}
            <a class="btn btn-primary" href="${a.url}">
              Read more →
            </a>
          </div>
        </article>
      `;
    }).join("");

    // ✅ Hide skeleton AFTER articles render
    if (skeleton) skeleton.style.display = "none";

    // ✅ FIRE EVENT ONLY AFTER ARTICLES EXIST
    document.dispatchEvent(new Event("articlesLoaded"));

  } catch (err) {
    console.error("Article load error:", err);
    container.innerHTML =
      "<p class='muted'>Failed to load articles.</p>";

    if (skeleton) skeleton.style.display = "none";
  }
});
