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
│   │   ├── page.tsx                # 首页 (Accueil) —— 居中标题 + 后台可编辑的模块化内容（按顺序平铺）+ Footer
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
│   │   ├── contact/page.tsx        # 原 authentification/，已改名（内容不变）
│   │   ├── portrait/page.tsx       # 单页三段式：Classique / Contemporain / Abstrait，各带醒目 H2 标题
│   │   ├── peinture-abstrait/page.tsx
│   │   └── cabinet-de-dessin/page.tsx
│   └── (payload)/                  # Payload Admin UI（自动生成）
├── collections/
│   ├── Media.ts
│   ├── News.ts
│   ├── Works.ts                    # 保留，前台已无导航入口（见"导航结构"），与新版 Portrait/Peinture abstrait/Cabinet de dessin 数据完全独立、本次未迁移
│   └── Messages.ts
├── blocks/                         # `type: 'blocks'` 字段用的 Payload Block 定义
│   ├── ModuleOne.ts                # 首页模块1：title + image + link
│   ├── ModuleTwo.ts                # 首页模块2：title + images（定长3项，各含 image/caption/link）
│   ├── ArtworkRowBlock.ts          # "作品行"：itemCount（该行作品总数量）+ items（image/title/creationDate，长度须等于 itemCount）
│   └── TextRowBlock.ts             # "文字块"：richText（继承全局 Lexical 特性集）
├── globals/
│   ├── Homepage.ts                 # 后台可编辑：modules（blocks 字段，Module 1 / Module 2，按后台排列顺序平铺展示在首页）
│   ├── Biography.ts
│   ├── SiteSettings.ts
│   ├── Portrait.ts                 # classique / contemporain / abstrait 三个分组，各自一个 content（blocks: 作品行/文字块）字段
│   ├── PeintureAbstrait.ts         # 单个 content（blocks: 作品行/文字块）字段，无子分类
│   └── CabinetDeDessin.ts          # 单个 content（blocks: 作品行/文字块）字段，无子分类
├── components/
│   ├── Header.tsx                  # 左侧固定竖排导航（Accueil / Portrait（点箭头展开二级子分类）/ Peinture abstrait / Cabinet de dessin / Biographie / Contact + 语言切换，无品牌名文字），移动端保留顶部条+汉堡菜单
│   ├── Footer.tsx                  # 版权 + Instagram
│   ├── NewsCard.tsx                # 411×308 卡片
│   ├── WorksGallery.tsx            # 旧 Oeuvres 网格 + 点击打开 Lightbox，图片 380×430 完整显示（不裁剪）——保留，仅供无导航入口的 `oeuvres/*` 路由使用
│   ├── Lightbox.tsx                # 作品全屏查看（键盘/箭头导航），被 WorksGallery 与新版 ContentBlocksRenderer 共用
│   ├── ModuleOne.tsx               # 首页模块1 渲染：标题（加粗）+ 图片（不裁剪，四周留白）+ "查看"按钮（新标签页）
│   ├── ModuleTwo.tsx               # 首页模块2 渲染：标题 + 三图并排（移动端单列堆叠），各图配说明文字与"查看"按钮
│   ├── ContentBlocksRenderer.tsx   # Portrait/Peinture abstrait/Cabinet de dessin 的行内容渲染：作品行按实际图片数量渲染网格列数+点击 Lightbox；文字块用 RichText 渲染，与上下内容保留默认间距
│   └── ContactForm.tsx             # Contact 表单
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

**Works.ts（Oeuvres，旧版数据模型，保留未删除）**
- `title`: text, required，多语言
- `type`: select → `['portrait', 'abstrait-figuratif', 'abstrait', 'divers']`, required
- `image`: relationship → Media, required
- `description`: text（可选），多语言，italic 展示
- `slug`: text, unique
- `order`: number（排序）
- 前台 `oeuvres/*` 路由仍可直接访问，但导航中已无入口；与下方 Portrait/Peinture abstrait/Cabinet de dessin 的新数据模型完全独立，本次改版未做任何数据迁移

**Messages.ts（Authentification 接收）**
- `name`: text, required
- `email`: email, required
- `content`: textarea, required
- `status`: select → `['unprocessed', 'processed']`, default: `'unprocessed'`
- `receivedAt`: date, auto

### Globals（`src/globals/`）

**Homepage.ts**
- `modules`: `blocks` 字段（block 定义见 `src/blocks/`），后台可新增任意数量、任意顺序的模块，按添加/拖拽排列顺序依次平铺展示在首页标题下方（无需额外 `order` 字段，blocks 数组顺序即展示顺序）：
  - **Module 1**（`moduleOne`）：`title` 文本，必填，多语言，≤100字，前台加粗展示（H2 衬线大写样式）；`image` 上传→Media，必填，尺寸不限，前台完整展示不裁剪、四周留白；`link` 文本，必填，前台展示为"查看"按钮，新标签页打开
  - **Module 2**（`moduleTwo`）：`title` 文本，必填，多语言，≤100字，前台不加粗（同 H2 样式）；`images` 定长数组（`minRows`/`maxRows` = 3，恰好3项），每项含 `image` 上传→Media（必填）、`caption` 文本（必填，多语言，≤100字，加粗展示）、`link` 文本（必填，"查看"按钮，新标签页打开）；前台三图并排展示，移动端单列堆叠

**Portrait.ts / PeintureAbstrait.ts / CabinetDeDessin.ts**（行式内容管理，三者共用同一套 Block 定义 `ArtworkRowBlock` / `TextRowBlock`）
- `Portrait`（slug `portrait`）：`classique` / `contemporain` / `abstrait` 三个 `group` 分组，各自一个 `content`（`blocks` 字段）；三个子分类渲染在同一个 `/portrait` 页面上，各带醒目 H2 标题
- `PeintureAbstrait`（slug `peinture-abstrait`）、`CabinetDeDessin`（slug `cabinet-de-dessin`）：各自一个 `content`（`blocks` 字段），无子分类
- 每个 `content` 字段是 `blocks` 类型，后台新增内容时先选块类型：
  - **作品行**（`ArtworkRowBlock`）：`itemCount` 数字，必填（该行作品总数量，需先设置）；`items` 数组，每项含 `image` 上传→Media（尺寸不限，不裁剪）、`title` 文本（必填，≤100字，多语言）、`creationDate` 纯文本（自由填写，非日期选择器）；保存时校验 `items.length` 必须等于 `itemCount`，不匹配则报错阻止保存。前台按该行实际图片数量渲染对应列数的网格（1~6 列，静态映射）
  - **文字块**（`TextRowBlock`）：`content` 富文本（Lexical，继承全局编辑器特性集：加粗/斜体/下划线/删除线/标题 h1-h4/引用/链接/列表/分割线/对齐/图片上传），前台用 `RichText` 组件渲染，与上下内容之间默认保留间距

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

桌面端（`lg:` 及以上）导航固定在页面左侧、竖直排列；移动端保留顶部条 + 汉堡菜单展开的竖排列表，两端共用同一份 `navConfig` 数据。**Actualités 已从导航中移除**（页面和数据仍保留，只是没有入口）；**Oeuvres 及其四个子分类也已从导航中移除**，由下方新的一级目录取代（`oeuvres/*` 路由本身未删除，仅无导航入口）。

```
┌──────────────┐
│  ACCUEIL     │ ← 首页导航项，点击回首页
│              │
│  PORTRAIT  ▸ │ ← 文字本身跳转 /portrait；旁边箭头单独展开/收起下方子菜单
│   ├ Classique
│   ├ Contemporain
│   └ Abstrait │ ← 默认收起，点箭头展开；子项为 /portrait 页内锚点链接
│  PEINTURE ABSTRAIT
│  CABINET DE DESSIN
│  BIOGRAPHIE  │
│  CONTACT     │
│              │
│  FR / EN     │ ← 语言切换
└──────────────┘
```

侧边栏顶部不再显示品牌名文字 "MORY AZAMI"（桌面端与移动端均已移除），返回首页统一通过 "ACCUEIL" 导航项完成，"ACCUEIL" 固定在导航列表第一位。

首页（`/[locale]`）上这条竖排导航依然存在，但视觉上更低调（低透明度，鼠标悬停恢复正常），不同于其它页面的常规不透明显示。

| 路由 | 功能 |
|------|------|
| `/[locale]` | 首页：居中大标题 "MORY AZAMI" + 后台 `modules` 驱动的内容模块（Module 1 / Module 2，按后台排列顺序平铺展示）+ Footer |
| `/[locale]/actualites` | 新闻列表，2列网格，卡片 411×308（无导航入口，仅可直接访问 URL） |
| `/[locale]/actualites/[slug]` | 新闻详情：标题 + 日期 + 富文本 |
| `/[locale]/portrait` | 单页三段式：Classique / Contemporain / Abstrait，各带醒目 H2 标题 + 行式内容（作品行网格 / 文字块），锚点 `#classique` `#contemporain` `#abstrait` 供导航子菜单跳转 |
| `/[locale]/peinture-abstrait` | 行式内容（作品行网格 / 文字块），无子分类 |
| `/[locale]/cabinet-de-dessin` | 行式内容（作品行网格 / 文字块），无子分类 |
| `/[locale]/biographie` | 富文本传记 |
| `/[locale]/contact` | 联系表单（姓名、邮件、留言），原 `authentification` 路由改名 |
| `/[locale]/oeuvres/portrait` 等四个分类页 + `/[locale]/oeuvres/[slug]` | **保留但导航无入口**（旧版 Works 数据，本次未迁移，仅可直接访问 URL） |

### 图片尺寸规范
| 用途 | 尺寸 | CSS |
|------|------|-----|
| Banner | 841 × 404 px | `Media.ts` 中仍定义该尺寸，但首页极简化后前台暂无展示位置 |
| 新闻卡片 | 411 × 308 px | `aspect-[411/308] object-cover`，容器背景 `bg-[var(--border)]` |
| 作品卡片（Oeuvres） | 380 × 430 px | 容器固定 `aspect-[380/430]`，图片本身用 `object-contain` 完整显示、不裁剪，容器背景 `bg-white` 做 letterbox 填充 |
| Lightbox 全屏 | 视口自适应 | `object-contain`，`max-h-[78vh]` |
| 首页模块图片（Module 1 / Module 2） | 尺寸不限（≤10MB） | 纯 `<img>` + `.prose-img`（`width:100%; height:auto`），不裁剪，容器四周留白 |
| Portrait/Peinture abstrait/Cabinet de dessin 作品行图片 | 尺寸不限（≤10MB） | 同上，`<img>` + `.prose-img`；每行按实际图片数量（1~6）用静态 Tailwind 列数映射渲染网格 |

### 字体规范
| 元素 | 字体 | 大小 | 字重 |
|------|------|------|------|
| 页面标题 H1/H2 | EB Garamond Variable，全大写 | `clamp(2rem, 5vw, 3.5rem)` / `clamp(1.4rem, 3vw, 2rem)` | 400 |
| 正文 | Instrument Sans Variable（`@fontsource-variable/instrument-sans`，降级 `ui-sans-serif, system-ui`） | 15px | 300 |
| 新闻卡片文字 | Instrument Sans Variable | 16px | 400 |
| 作品卡片说明 | Instrument Sans Variable | 12px | 400，italic |
| 导航链接 | Instrument Sans Variable，全大写 | 11px | 200（extralight） |
| 图片说明 | Instrument Sans Variable | 12px | 400，italic |
| 首页模块2 图片说明 | Instrument Sans Variable | 14–15px | 700（bold） |

### 配色
| 角色 | 值 |
|------|-----|
| 页面背景 | `#ffffff`（纯白，CSS 变量 `--bg`） |
| 正文文字 | `#161513`（CSS 变量 `--ink`） |
| 品牌色 | `#b91c1c`（红，CSS 变量 `--brand`，用于网站标题和导航悬停） |
| 次要文字/边框 | `--muted: #8c8b85`，`--border: #e8e6e1` |

---

## 后台 Admin 功能

| 模块 | 后台操作 |
|------|---------|
| 首页 | 按需新增/删除/拖拽排序内容模块（Module 1：图片+标题+查看链接；Module 2：三图+各自说明+查看链接），前台按后台排列顺序平铺展示 |
| Actualités | 新增/编辑/删除新闻（标题、日期、富文本+图片）；前台仅可通过直接访问 URL 到达，导航中已无入口 |
| Portrait / Peinture abstrait / Cabinet de dessin | 行式内容管理：新增一行前先选"作品行"或"文字块"。作品行需先设置该行"作品总数量"（整数），再逐个上传与数量精确匹配的作品（图片+标题+创作日期），数量不匹配时保存报错；文字块为富文本编辑器（支持加粗/斜体/标题/对齐等）。Portrait 额外分 Classique/Contemporain/Abstrait 三个子分类，各自独立维护 |
| Oeuvres（旧版，导航已无入口） | 新增/编辑/删除作品（图片、标题、四个分类之一：Portrait/Abstrait figuratif/Abstrait/Divers），仅供已有数据存量维护，不建议新增内容 |
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
