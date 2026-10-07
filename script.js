
const GITHUB_USER = "BasilTschopp";
const EXCLUDE = ["basiltschopp.github.io"];          
const FALLBACK = [
  ["we-will-see", "Test automation for web applications."],
  ["py-document-kit", "Split and merge documents locally using a standalone executable."]
];
const list = document.getElementById("projectList");
const esc = t => String(t || "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const render = items => {
  list.innerHTML = items.map(([name, desc]) =>
    `<li><a href="https://github.com/${GITHUB_USER}/${esc(name)}" target="_blank" rel="noopener">github/${esc(name)}</a>` +
    (desc ? `<p>${esc(desc)}</p>` : "") + `</li>`).join("");
};
render(FALLBACK);
fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created&direction=desc`)
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(repos => {
    const items = repos
      .filter(r => !r.fork && !r.archived && !r.private && !EXCLUDE.includes(r.name))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(r => [r.name, r.description]);
    if (items.length) render(items);
  })
  .catch(() => {});

