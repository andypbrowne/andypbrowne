# Andypbrowne Site - Copilot Instructions

## Project Overview
Personal blog of Andrew Garber-Browne (UX professional specializing in DesignOps) built with Eleventy (11ty) static site generator, deployed on Netlify.

## Design Philosophy

**Keep it simple.** This site prioritizes maintainability over cleverness.

- **Follow existing patterns** - Don't introduce new approaches when established patterns already work
- **Avoid dependencies** - Only add npm packages if absolutely necessary; vanilla solutions preferred
- **No complex abstractions** - Keep templates, filters, and configs straightforward
- **Consistent structure** - New content should match existing structure (see blog post examples)
- **Static over dynamic** - This is a static site; don't add client-side complexity unless essential
- **Test locally first** - Always run `npm start` to verify changes before committing
- **One clear way** - If there are multiple ways to do something, document and use only one

When in doubt, choose the simpler, more obvious solution that won't break easily.

## Architecture

### Content Structure
- **Content source**: `content/` directory with Nunjucks (`.njk`) and Markdown (`.md`) files
- **Built output**: `_site/` directory (git-ignored)
- **Blog posts**: Each post is a folder under `content/blog/` containing `index.md` + assets
- **Data files**: `_data/` for global data (metadata, book lists organized by year)
- **Templates**: `_includes/` for Nunjucks layouts and components
- **Static assets**: `public/` folder copied to root of build output

### Folder Mapping (Critical for Navigation)
```
content/          → input directory (configured in eleventy.config.js)
_includes/        → templates (accessed as ..//_includes from content)
_data/            → global data (accessed as ..//_data from content)
public/           → static files (copied to / in output)
_site/            → build output directory
```

## Development Workflow

### Commands (from package.json)
```bash
npm start          # Dev server on http://localhost:8080 with watch mode
npm run build      # Production build
npm run debug      # Run with Eleventy debug output
npm run debugstart # Dev server with debug output
```

### Drafts System
- Add `draft: true` to post frontmatter to exclude from production builds
- Drafts **are shown** in dev mode (`npm start`)
- Drafts **are hidden** in production builds unless `BUILD_DRAFTS` env var is set
- Logic in [eleventy.config.drafts.js](eleventy.config.drafts.js)

## Content Patterns

### Blog Posts
- Location: `content/blog/[post-slug]/index.md`
- Auto-tagged with "posts" via [content/blog/blog.11tydata.js](content/blog/blog.11tydata.js)
- Default layout: `layouts/post.njk`
- Frontmatter structure:
  ```yaml
  ---
  title: Post Title
  description: SEO description
  thumbnail: assets/images/thumb-image.jpg
  thumbnailAlt: Alt text
  date: 2025-12-04
  tags: [recipe, post]
  draft: false
  ---
  ```

### Recipe Posts
- Include `ingredients:` array in frontmatter
- Use `{% include "_includes/components/ingredient-list.njk" %}` to render ingredients
- Example: [content/blog/breakfast-burrito/index.md](content/blog/breakfast-burrito/index.md)

### Case Studies
- Use `{% include "_includes/components/case-study-metadata.njk" %}` for metadata display
- Examples: [content/blog/ya-author/index.md](content/blog/ya-author/index.md), [content/blog/simonas-site/index.md](content/blog/simonas-site/index.md)

### Bookshelf Feature
- Book data stored as JSON in `_data/books/[YEAR]bookList.json`
- Each book has: cover, coverAlt, link, title, subTitle, author, type, tags, status, description
- Custom filters in [eleventy.config.js](eleventy.config.js):
  - `mergeBookLists` - combines all year arrays
  - `titlesForTag` - filters books by tag
  - `allTagsSorted` - extracts unique tags with counts
- Template: `_includes/bookcard.njk` renders individual book cards with filter attributes

## Custom Eleventy Features

### Shortcodes
- `{% youtube "URL", "title" %}` - embeds YouTube video (no-cookie domain)
- `{% image "src", "alt", widths, sizes %}` - responsive images with avif/webp (see [eleventy.config.images.js](eleventy.config.images.js))

### Filters
- `readableDate` - formats dates with Luxon (default: "dd LLLL yyyy")
- `htmlDateString` - ISO date strings for `<time>` elements
- `getRelatedPosts(collection, currentUrl, currentTags, limit)` - finds posts with shared tags
- `getAllTags` - extracts all unique tags from collection
- `filterTagList` - removes nav tags ("all", "nav", "post", "posts")

### Collections
- `favoriteThings` - custom collection for favorite-thing tagged posts

### Pass-through Copy
Watch for these patterns when adding static assets:
- `public/` → root
- `content/assets` → `/assets`
- `public/fonts` → `/fonts`
- `assets/js` → `/assets/js`
- Individual post assets like `content/blog/coffee` → `/blog/coffee`

## Deployment
- **Platform**: Netlify (auto-deploys from git)
- **Build command**: `npm run build` (configured in [netlify.toml](netlify.toml))
- **Output directory**: `_site`
- **Deploy status**: Badge in README shows live status

## Common Tasks

### Adding a Blog Post
1. Create folder: `content/blog/[post-slug]/`
2. Add `index.md` with required frontmatter (title, description, date, tags)
3. Add images to same folder or `content/assets/images/`
4. Use relative paths for images within post content
5. Set `draft: true` to preview without publishing

### Adding a Book
1. Open appropriate year file in `_data/books/[YEAR]bookList.json`
2. Add object with all required fields (cover, title, author, etc.)
3. Tag appropriately - tags drive filtering on bookshelf page

### Modifying Layout/Components
- Layouts: `_includes/layouts/` (base.njk, home.njk, post.njk)
- Components: `_includes/components/` (reusable partials)
- All templates use Nunjucks syntax

## Conventions
- Use Nunjucks (`.njk`) for templating, not Liquid
- Markdown files are pre-processed with Nunjucks (configured in eleventy.config.js)
- Date format follows ISO 8601: `YYYY-MM-DD`
- Tags are lowercase, hyphenated (e.g., "favorite-thing", not "Favorite Thing")
