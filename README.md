# Builder.io Sandbox (Gen 2)

A sandbox for the [Builder.io](https://www.builder.io) Gen 2 SDK (`@builder.io/sdk-react`) with **Next.js 16** App Router and **React 19**. It demonstrates three blog patterns: **Data model**, **Section model**, and **Hybrid** (data bindings + templates).

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **Builder.io SDK** (`@builder.io/sdk-react`) and Dev Tools
- **Tailwind CSS 4**

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Builder.io

Copy the example env file and add your Builder.io public API key:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_public_api_key
```

Get your key from [Builder.io → Account → Space](https://builder.io/account/space).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the **Blog** link to try the three blog patterns.

## Blog patterns

| Route | Pattern | Description |
|-------|---------|-------------|
| `/blog-article` | **Data model** | Fixed template in code; content fields (title, slug, body, etc.) come from Builder data. |
| `/blog-article-section` | **Section model** | Hero/header in code; article body is drag-and-drop sections in the Builder.io visual editor. |
| `/blog-article-template` | **Hybrid** | Data bindings and templates inside a Section model; content driven by data with flexible layouts. |

Details and Gen 1 → Gen 2 API mapping are in [`docs/BUILDER_BLOG_PATTERNS_GEN2.md`](docs/BUILDER_BLOG_PATTERNS_GEN2.md).

## Project structure

- **`app/`** – App Router pages: home, blog index, and blog pattern routes (`blog-article`, `blog-article-section`, `blog-article-template`).
- **`components/`** – Reusable UI (Header, Footer, blog hero/card/body/list) and Builder.io wrapper (`components/builder.tsx`).
- **`config.ts`** – Builder API key and model names (`page`, `blog-article`, etc.).
- **`builder-registry.ts`** – Builder block registration for visual editing.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Next.js with webpack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Learn more

- [Builder.io Documentation](https://www.builder.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Builder drag-and-drop blog guide](https://www.builder.io/blog/builder-drag-drop-blog)
