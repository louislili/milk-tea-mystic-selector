# 部署指南（Deployment）

本项目无需构建，适合部署到任何支持静态文件的服务。

## 常见部署方式

### GitHub Pages
1. 将项目推送到 GitHub 仓库
2. 在仓库设置中开启 Pages，选择 `main` 分支根目录
3. 访问 `https://<your-username>.github.io/<repo>/oss/`

### Netlify
1. 在 Netlify 新建站点，选择 Git 仓库
2. 构建设置：
   - Build command：`(空)`
   - Publish directory：`/`（根目录）
3. 部署后访问 `<your-site-url>/oss/`

### Vercel
1. 在 Vercel 导入仓库
2. 框架选择：`Other`，构建命令留空，输出目录为 `/`
3. 部署后访问 `<your-site-url>/oss/`

## 自托管（Nginx 示例）
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/your-project;

    location / {
        index index.html;
    }
}
```
然后通过 `http://example.com/oss/` 访问。

## 注意事项
- 访问路径需要包含 `/oss/` 子目录
- 确保所有资源路径相对且可被静态服务器正确读取
- 不需要任何 API 或密钥，数据仅保存在浏览器 `localStorage`