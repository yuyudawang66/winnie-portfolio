# Winnie 个人设计作品集 · GitHub Pages

GitHub Pages 静态版本。手机与桌面使用独立背景图，保留四个入口、作品详情及缩放。

运行 `npm ci` 后使用 `npm run dev` 预览，`npm run build` 输出 dist。
GitHub 仓库 Settings → Pages 的 Source 选择 GitHub Actions。推送 main 后自动部署。

作品通过 hash 路由展示，项目直达链接和刷新均不依赖服务器路由。
私密留言入口会打开原工作室，由原网站后台接收；访客点击墙上的彩色便签即可留言。留言不写入 GitHub 仓库。
仓库仅包含公开展示素材，不包含留言数据库、管理员账号或密钥。
