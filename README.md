# tech-blog

<p>
  <img src="https://img.shields.io/badge/Pages-静态站-15262F?style=for-the-badge" alt="pages">
  <img src="https://img.shields.io/badge/GitHub_API-仓库列表-B4532A?style=for-the-badge" alt="api">
</p>

个人技术博客静态站点：展示简介、文章与 **GitHub 公开仓库列表**（浏览器调用 GitHub API，失败时使用内置列表）。主仓库请看 [sandbench](https://github.com/shenshuo-maker/sandbench) 与 [profile](https://github.com/shenshuo-maker)。

## 本地预览

在项目根目录执行：

```bash
# Python 3
python -m http.server 8080
```

浏览器打开 `http://127.0.0.1:8080`。

## 目录说明

| 路径 | 说明 |
|------|------|
| `index.html` | 首页 |
| `assets/style.css` | 样式 |
| `assets/app.js` | 拉取仓库、离线回退逻辑 |
| `posts/` | 文章（HTML） |

## 部署到 GitHub Pages

将本仓库启用 **GitHub Pages**（建议用 `main` 分支根目录或 `docs` 目录，按仓库 Settings → Pages 说明操作）。使用 **HTTPS** 后，首页即可正常请求 `api.github.com` 同步仓库列表。

## 修改 GitHub 用户名

若更换账号，编辑 `assets/app.js` 中的 `GITHUB_USER` 与 `FALLBACK_REPOS` 即可。
