const GITHUB_USER = "shenshuo-maker";

/** 离线回退：与当前公开仓库同步，可在无网络或 API 受限时使用 */
const FALLBACK_REPOS = [
  {
    name: "fin-research-ai",
    html_url: "https://github.com/shenshuo-maker/fin-research-ai",
    description: null,
    language: "Java",
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: "2026-04-04T14:23:08Z",
    updated_at: "2026-04-04T14:23:14Z",
    topics: [],
  },
  {
    name: "finresearch-mvp",
    html_url: "https://github.com/shenshuo-maker/finresearch-mvp",
    description: null,
    language: null,
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: "2026-03-30T06:29:55Z",
    updated_at: "2026-03-30T06:29:55Z",
    topics: [],
  },
  {
    name: "---",
    html_url: "https://github.com/shenshuo-maker/---",
    description: "大创项目第一阶段成果，包含核心模块原型与初步实验数据。",
    language: "Python",
    stargazers_count: 0,
    forks_count: 0,
    pushed_at: "2026-03-12T01:10:44Z",
    updated_at: "2026-03-12T01:10:47Z",
    topics: [],
  },
];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function repoCard(repo) {
  const title = escapeHtml(repo.name);
  const url = escapeHtml(repo.html_url);
  const desc = repo.description
    ? escapeHtml(repo.description)
    : '<span class="muted">暂无简介，可在 GitHub 仓库设置里补充 description。</span>';
  const lang = repo.language
    ? `<span class="lang-pill">${escapeHtml(repo.language)}</span>`
    : "";
  const topics = Array.isArray(repo.topics)
    ? repo.topics
        .slice(0, 4)
        .map((t) => `<span class="lang-pill" style="background:rgba(99,102,241,0.15);color:#a5b4fc;">#${escapeHtml(t)}</span>`)
        .join(" ")
    : "";
  return `
    <article class="card">
      <h3><a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
      <div class="card-meta">
        ${lang}
        <span>★ ${repo.stargazers_count ?? 0}</span>
        <span>⑂ ${repo.forks_count ?? 0}</span>
        <span>更新 ${formatDate(repo.updated_at)}</span>
      </div>
      ${topics ? `<div class="card-meta" style="margin-bottom:8px;">${topics}</div>` : ""}
      <p class="card-desc">${desc}</p>
    </article>
  `;
}

async function loadRepos() {
  const grid = document.getElementById("repo-grid");
  const status = document.getElementById("repo-status");
  if (!grid) return;

  const apply = (repos, fromApi, errMsg) => {
    const sorted = [...repos].sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at));
    grid.innerHTML = sorted.map(repoCard).join("");
    if (status) {
      if (fromApi) {
        status.textContent = `已从 GitHub 加载 ${sorted.length} 个公开仓库。`;
        status.classList.remove("error");
      } else {
        status.textContent = errMsg || "使用本地缓存列表展示仓库。";
        status.classList.toggle("error", Boolean(errMsg));
      }
    }
    const countEl = document.getElementById("public-repo-count");
    if (countEl) countEl.textContent = String(sorted.length);
  };

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      apply(FALLBACK_REPOS, false, "API 返回为空，已使用本地列表。");
      return;
    }
    apply(data, true);
  } catch (e) {
    apply(FALLBACK_REPOS, false, `无法连接 GitHub API（${e.message}），已显示离线列表。`);
  }
}

async function loadProfile() {
  const avatar = document.getElementById("avatar");
  const ghCount = document.getElementById("gh-public-repos");
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return;
    const u = await res.json();
    if (avatar && u.avatar_url) avatar.src = u.avatar_url;
    if (ghCount && typeof u.public_repos === "number") ghCount.textContent = String(u.public_repos);
  } catch {
    /* 静默失败，使用 HTML 默认头像与占位 */
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadRepos();
  loadProfile();
});
