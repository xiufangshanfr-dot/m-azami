@import /Users/xfs/skills-main/skills/frontend-design/SKILL.md

# PARISSA 艺术家作品集网站 — 技术方案

设计参考：https://www.Antoni-clave.org/（极简设计语言）  
目标：为艺术家 PARISSA 构建双语（法语/英语）作品集网站，PARISSA 本人通过 Payload Admin 自行管理所有内容，无需开发介入。

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
│   │   ├── layout.tsx              # 共享布局：Header + Footer
│   │   ├── page.tsx                # 首页 (accueil)
│   │   ├── actualites/
│   │   │   ├── page.tsx            # Actualités 列表
│   │   │   └── [slug]/page.tsx     # Actualités 详情
│   │   ├── oeuvres/
│   │   │   ├── peintures/page.tsx
│   │   │   ├── sculptures/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── biographie/page.tsx
│   │   └── authentification/page.tsx
│   └── (payload)/                  # Payload Admin UI（自动生成）
├── collections/
│   ├── Media.ts
│   ├── News.ts
│   ├── Works.ts
│   └── Messages.ts
├── globals/
│   ├── Homepage.ts
│   ├── Biography.ts
│   └── SiteSettings.ts
├── components/
│   ├── Header.tsx                  # logo + nav + 语言切换
│   ├── Footer.tsx                  # 版权 + Instagram
│   ├── NewsCard.tsx                # 411×308 卡片
│   ├── WorkCard.tsx                # 380×430 卡片
│   └── ContactForm.tsx             # Authentification 表单
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── middleware.ts
└── payload.config.ts
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
- `type`: select → `['peinture', 'sculpture']`, required
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
- `siteName`: text（默认 "PARISSA"）
- `copyrightText`: text（默认 "© 2026 PARISSA"，可自行修改）
- `instagramUrl`: text

---

## 前台页面

### 导航结构
```
[logo → 首页]    Actualités | Oeuvres ▾ | Biographie | Authentification    [FR / EN]
                                ├── Peintures
                                └── Sculptures
```

| 路由 | 功能 |
|------|------|
| `/[locale]` | 首页：banner(841×404) + 文本 + 最新2条 Actualités |
| `/[locale]/actualites` | 新闻列表，2列网格，卡片 411×308 |
| `/[locale]/actualites/[slug]` | 新闻详情：标题 + 日期 + 富文本 |
| `/[locale]/oeuvres/peintures` | 画作列表，3列网格，图片 380×430 |
| `/[locale]/oeuvres/sculptures` | 雕塑列表，3列网格，图片 380×430 |
| `/[locale]/oeuvres/[slug]` | 作品详情 |
| `/[locale]/biographie` | 富文本传记 |
| `/[locale]/authentification` | 联系表单（姓名、邮件、留言） |

### 图片尺寸规范
| 用途 | 尺寸 | CSS |
|------|------|-----|
| Banner（首页） | 841 × 404 px | `aspect-[841/404] object-contain` |
| 新闻卡片 | 411 × 308 px | `aspect-[411/308] object-cover` |
| 作品卡片 | 380 × 430 px | `aspect-[380/430] object-cover` |

### 字体规范
| 元素 | 字体 | 大小 | 字重 |
|------|------|------|------|
| 页面标题 H1/H2 | EB Garamond，全大写 | 3rem | 400 |
| 正文 | 系统 sans-serif | 1rem / 16px | 300 |
| 新闻卡片文字 | 系统 sans-serif | 16px | 400 |
| 作品卡片说明 | 系统 sans-serif | 12px | 400，italic |
| 导航链接 | 系统 sans-serif | 12px | 200 |
| 图片说明 | 系统 sans-serif | 12px | 400，italic |

### 配色
| 角色 | 值 |
|------|-----|
| 页面背景 | `#fffbf7`（暖米色） |
| 正文文字 | `#1e293b` |
| 品牌色 | `#b91c1c`（红，用于网站标题） |
| 导航悬停 | `#d97706`（琥珀黄） |

---

## 后台 Admin 功能

| 模块 | 后台操作 |
|------|---------|
| 首页 | 新增/删除 banner 图，编辑首页文本 |
| Actualités | 新增/编辑/删除新闻（标题、日期、富文本+图片） |
| Oeuvres | 新增/编辑/删除作品（图片、标题、类型） |
| Biographie | 富文本直接编辑 |
| Messages | 查看留言列表，标记未处理/已处理 |
| 全局设置 | 修改版权文案、Instagram 链接 |

PARISSA 本人为唯一 Admin，首次启动时设置账号密码。

---

## 部署

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
| 5 | 首页（banner + 文本 + 新闻卡片） |
| 6 | Actualités 列表 + 详情页 |
| 7 | Oeuvres Peintures + Sculptures + 详情页 |
| 8 | Biographie 页 |
| 9 | Authentification 表单 + Messages 接收 |
| 10 | 样式打磨（字体、颜色、响应式） |
