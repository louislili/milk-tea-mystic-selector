# 入门指南（Getting Started）

本项目为纯静态前端，无需后端与构建。你可以在本地或任意静态站点上直接运行。

## 环境要求
- 任意现代浏览器（Chrome、Safari、Edge、Firefox）
- 推荐安装一个静态服务器工具（Python 或 Node）

## 本地运行
### 方式一：Python
1. 在项目根目录执行：
   ```
   python3 -m http.server 8080
   ```
2. 打开浏览器访问：
   - `http://localhost:8080/oss/`

### 方式二：Node（可选）
1. 全局安装 `serve`：
   ```
   npm i -g serve
   ```
2. 在项目根目录执行：
   ```
   serve . -p 8080
   ```
3. 打开：
   - `http://localhost:8080/oss/`

## 目录说明
- `oss/index.html`：页面结构与核心交互入口
- `oss/style.css`：页面样式（包含开源横幅样式）
- `oss/script.js`：业务逻辑（数据持久化、成就与奖励等）

## 使用提示
- 数字键 `1-6` 可快速选择对应选项
- 数据保存在浏览器 `localStorage`，刷新不丢失
- 移动端优化触摸事件，动画较多设备可适当降低动画强度

## 问题排查
- 看不到页面？确认访问路径包含 `/oss/`
- 数据未保存？检查浏览器是否开启无痕模式或清除了站点数据
- 样式不生效？确认 CSS 路径为 `style.css` 且未被缓存