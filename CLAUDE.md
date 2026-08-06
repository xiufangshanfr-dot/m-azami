@import /Users/xfs/skills-main/skills/frontend-design/SKILL.md

# MORY AZAMI 艺术家作品集网站 — 技术方案

设计参考：https://www.Antoni-clave.org/（极简设计语言）
目标：为艺术家 MORY AZAMI 构建双语（法语/英语）作品集网站，MORY AZAMI 本人通过 Payload Admin 自行管理所有内容，无需开发介入。

> 项目最初以 "PARISSA" 命名（仓库名、部分历史文案仍保留 `parissa`/`PARISSA` 字样），后整站文案已改为艺术家真实姓名 "MORY AZAMI"，本文档统一使用现名。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) + TypeScript |
| CMS后台 | Payload CMS 3.0（基于 Next.js，自带 Admin UI） |
| 样式 | Tailwind CSS |
| 数据库 | PostgreSQL |
| 图片存储 | 本地 `/public/media`（初期），后期迁移 Cloudflare R2 |
| 多语言 | next-intl + Payload i18n（FR 默认，EN 备选） |
| 包管理 | pnpm |

---

## 项目结构

```
src/
├── app/
│   ├── (frontend)/[locale]/
│   │   ├── layout.tsx              # 共享布局：Header（左侧竖排导航）+ Footer
│   │   ├── page.tsx                # 首页 (accueil) —— 极简封面：居中标题 + 留白 + Footer
│   │   ├── actualites/
│   │   │   ├── page.tsx            # Actualités 列表（无导航入口，仅可通过直接访问 URL 到达）
│   │   │   └── [slug]/page.tsx     # Actualités 详情
│   │   ├── oeuvres/
│   │   │   ├── portrait/page.tsx
│   │   │   ├── abstrait-figuratif/page.tsx
│   │   │   ├── abstrait/page.tsx
│   │   │   ├── divers/page.tsx
│   │   │   └── [slug]/page.tsx     # 孤立页面：不再有任何链接指向它（详情改用 Lightbox 全屏展示）
│   │   ├── biographie/page.tsx
│   │   └── authentification/page.tsx
│   └── (payload)/                  # Payload Admin UI（自动生成）
├── collections/
│   ├── Media.ts
│   ├── News.ts
│   ├── Works.ts
│   └── Messages.ts
├── globals/
│   ├── Homepage.ts                 # 后台可编辑（banners/introText），但首页极简化后前台不再展示
│   ├── Biography.ts
│   └── SiteSettings.ts
├── components/
│   ├── Header.tsx                  # 左侧固定竖排导航（品牌名 + Œuvres常驻展开子分类 + Biographie + Authentification + 语言切换），移动端保留顶部条+汉堡菜单
│   ├── Footer.tsx                  # 版权 + Instagram
│   ├── NewsCard.tsx                # 411×308 卡片
│   ├── WorksGallery.tsx            # Oeuvres 网格 + 点击打开 Lightbox，图片 380×430 完整显示（不裁剪）
│   ├── Lightbox.tsx                # 作品全屏查看（键盘/箭头导航）
│   └── ContactForm.tsx             # Authentification 表单
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── middleware.ts
└── payload.config.ts

messages/                           # next-intl 翻译文件（仓库根目录，不在 src/ 下）
├── fr.json
└── en.json
```

---

## CMS 数据模型

### Collections（`src/collections/`）

**Media.ts**
- 字段：filename, alt（多语言）
- imageSizes：thumbnail(411×308), work(380×430), banner(841×404)

**News.ts（Actualités）**
- `title`: text, required, maxLength: 100，多语言
- `publishedAt`: date, required
- `coverImage`: relationship → Media, required
- `content`: richText（Lexical），支持文字+图片
- `slug`: text, unique, auto-generated
- `_status`: draft/published

**Works.ts（Oeuvres）**
- `title`: text, required，多语言
- `type`: select → `['portrait', 'abstrait-figuratif', 'abstrait', 'divers']`, required
- `image`: relationship → Media, required
- `description`: text（可选），多语言，italic 展示
- `slug`: text, unique
- `order`: number（排序）

**Messages.ts（Authentification 接收）**
- `name`: text, required
- `email`: email, required
- `content`: textarea, required
- `status`: select → `['unprocessed', 'processed']`, default: `'unprocessed'`
- `receivedAt`: date, auto

### Globals（`src/globals/`）

**Homepage.ts**
- `banners`: array → `{ image: relationship→Media }`（支持多张，可增删）
- `introText`: textarea, maxLength: 10000，多语言

**Biography.ts**
- `content`: richText（Lexical），多语言

**SiteSettings.ts**
- `siteName`: text（默认 "MORY AZAMI"）
- `copyrightText`: text（默认 "© 2026 Mory AZAMI. Tous droits réservés."，可自行修改；Footer 渲染时优先读取该字段，字段留空才回退到代码里的默认值）
- `instagramUrl`: text
- `logo`: upload → Media（可选，签名/Logo 图）

---

## 前台页面

### 导航结构

桌面端（`lg:` 及以上）导航固定在页面左侧、竖直排列；移动端保留顶部条 + 汉堡菜单展开的竖排列表。**Actualités 已从导航中移除**（页面和数据仍保留，只是没有入口）。

```
┌──────────────┐
│  MORY AZAMI  │ ← 品牌名（点击回首页）
│              │
│  Œuvres      │
│   ├ Portrait │
│   ├ Abstrait figuratif
│   ├ Abstrait │
│   └ Divers   │ ← 常驻展开，非 hover 下拉
│  Biographie  │
│  Authentification
│              │
│  FR / EN     │ ← 语言切换
└──────────────┘
```

首页（`/[locale]`）上这条竖排导航依然存在，但视觉上更低调（低透明度，鼠标悬停恢复正常），不同于其它页面的常规不透明显示。

| 路由 | 功能 |
|------|------|
| `/[locale]` | 首页：极简封面，居中大标题 "MORY AZAMI" + 大片留白 + Footer，无 banner/无简介文字/无 Actualités 列表 |
| `/[locale]/actualites` | 新闻列表，2列网格，卡片 411×308（无导航入口，仅可直接访问 URL） |
| `/[locale]/actualites/[slug]` | 新闻详情：标题 + 日期 + 富文本 |
| `/[locale]/oeuvres/portrait` | Portrait 分类作品列表，3列网格，图片 380×430 |
| `/[locale]/oeuvres/abstrait-figuratif` | Abstrait figuratif 分类作品列表 |
| `/[locale]/oeuvres/abstrait` | Abstrait 分类作品列表 |
| `/[locale]/oeuvres/divers` | Divers 分类作品列表 |
| `/[locale]/oeuvres/[slug]` | 孤立页面，无链接指向；作品详情改用点击卡片打开 `Lightbox` 全屏查看（键盘/箭头导航），不再跳转到独立详情页 |
| `/[locale]/biographie` | 富文本传记 |
| `/[locale]/authentification` | 联系表单（姓名、邮件、留言） |

### 图片尺寸规范
| 用途 | 尺寸 | CSS |
|------|------|-----|
| Banner | 841 × 404 px | `Media.ts` 中仍定义该尺寸，但首页极简化后前台暂无展示位置 |
| 新闻卡片 | 411 × 308 px | `aspect-[411/308] object-cover`，容器背景 `bg-[var(--border)]` |
| 作品卡片（Oeuvres） | 380 × 430 px | 容器固定 `aspect-[380/430]`，图片本身用 `object-contain` 完整显示、不裁剪，容器背景 `bg-white` 做 letterbox 填充 |
| Lightbox 全屏 | 视口自适应 | `object-contain`，`max-h-[78vh]` |

### 字体规范
| 元素 | 字体 | 大小 | 字重 |
|------|------|------|------|
| 页面标题 H1/H2 | EB Garamond，全大写 | `clamp(2rem, 5vw, 3.5rem)` / `clamp(1.4rem, 3vw, 2rem)` | 400 |
| 正文 | 系统 sans-serif | 15px | 300 |
| 新闻卡片文字 | 系统 sans-serif | 16px | 400 |
| 作品卡片说明 | 系统 sans-serif | 12px | 400，italic |
| 导航链接 | 系统 sans-serif，全大写 | 11px | 200（extralight） |
| 图片说明 | 系统 sans-serif | 12px | 400，italic |

### 配色
| 角色 | 值 |
|------|-----|
| 页面背景 | `#fffbf7`（暖米色，CSS 变量 `--cream`） |
| 正文文字 | `#1a1a18`（CSS 变量 `--ink`） |
| 品牌色 | `#b91c1c`（红，CSS 变量 `--brand`，用于网站标题和导航悬停） |
| 次要文字/边框 | `--muted: #9a9186`，`--border: #e5ddd4` |

---

## 后台 Admin 功能

| 模块 | 后台操作 |
|------|---------|
| 首页 | 新增/删除 banner 图，编辑首页文本（字段仍可编辑，但首页改为极简封面后前台不再展示这些内容） |
| Actualités | 新增/编辑/删除新闻（标题、日期、富文本+图片）；前台仅可通过直接访问 URL 到达，导航中已无入口 |
| Oeuvres | 新增/编辑/删除作品（图片、标题、四个分类之一：Portrait/Abstrait figuratif/Abstrait/Divers） |
| Biographie | 富文本直接编辑 |
| Messages | 查看留言列表，标记未处理/已处理 |
| 全局设置 | 修改版权文案（`© 2026 Mory AZAMI. Tous droits réservés.`）、Instagram 链接 |

MORY AZAMI 本人为唯一 Admin，首次启动时设置账号密码。

---

## 部署

**当前实际部署**：GitHub 仓库 `xiufangshanfr-dot/m-azami`（`main` 分支），已关联 Vercel 项目 `m-azami`，push 到 `main` 会自动触发生产部署，线上域名 `www.m-azami.com`。对应下方"零运维"方案。本地开发用 `scripts/start-local-pg.mjs`（`embedded-postgres`）跑一个内嵌 Postgres，无需单独安装数据库。

**推荐：VPS 一体化**
```
VPS (4核/8G, ~$20/月)
├── PostgreSQL
├── Next.js + Payload (Node.js, pm2)
├── Nginx (反向代理 + SSL)
└── Cloudflare CDN
```

**备选：零运维**
```
Vercel + Neon DB (PostgreSQL) + Cloudflare R2
```

---

## 开发命令

```bash
pnpm dev      # 启动开发服务器（前台 + Admin）
pnpm build    # 生产构建
pnpm start    # 生产启动
```

后台地址：`http://localhost:3000/admin`

---

## 开发顺序

| 优先级 | 任务 |
|--------|------|
| 1 | 初始化项目（Payload + PostgreSQL） |
| 2 | 定义所有 Collections + Globals |
| 3 | next-intl 路由 + middleware |
| 4 | Header + Footer 组件 |
| 5 | 首页（后由 banner + 文本 + 新闻卡片，改为极简封面版式） |
| 6 | Actualités 列表 + 详情页 |
| 7 | Oeuvres 分类（Portrait / Abstrait figuratif / Abstrait / Divers）+ 详情改为 Lightbox 全屏查看 |
| 8 | Biographie 页 |
| 9 | Authentification 表单 + Messages 接收 |
| 10 | 样式打磨（字体、颜色、响应式） |
