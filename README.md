# Humanoid

An English-language discovery marketplace for humanoid robots, components, and development kits.

## Run locally

Node.js 18 or newer is sufficient. No dependencies or build step are required.

```sh
npm run dev
```

Open http://127.0.0.1:4173. The server binds to localhost by default; use the `PORT` environment variable to select another port.

## Pages and data

- `dist/index.html`: marketplace, product filters, favorites, comparison, and browser-local draft listings.
- `dist/manufacturers.html`: searchable directory of 200 manufacturer entries, with CSV export.
- `dist/blog.html` and `dist/blog/`: journal and 15 standalone English articles.
- `dist/catalog.js`: shared manufacturer directory and 115 product/platform records.
- `dist/manufacturers.json`: source-linked directory, including review dates and evidence notes.
- `dist/blog-index.json`: article index and editorial archive dates.
- `dist/assets/assets.json`: imagery provenance and manufacturer source links.

The manufacturer directory includes bipedal, wheeled, stationary, tabletop, educational, research, and specialist humanoid platforms. An entry does not imply a partnership, current stock, or a retail offer. Prices retain their original currencies and configuration notes. Confirm current terms with each manufacturer.

Favorites and listing drafts stay in the browser. The project does not implement checkout, seller messaging, accounts, or payment processing. The Skyline Hub announcement links to its external website; it is not a payment integration.

## Hosting

GitHub Pages deployment is configured in `.github/workflows/pages.yml`. Once Pages is enabled with GitHub Actions as its source, pushes to `main` publish the contents of `dist/`. The workflow also supports manual runs.

Deploy `dist/` to a static web host. `.openai/hosting.json` identifies the existing private Sites deployment. No hosting credentials are committed. Preserve this identity for updates to that Site; use your own hosting configuration for an independent deployment.

## Editorial and image notes

Journal articles were prepared on October 24, 2026. Displayed April–October dates organize the editorial archive and do not claim historical publication or availability.

Manufacturer photos and trademarks belong to their respective owners. Source URLs are recorded in the asset manifest. No license to redistribute third-party imagery is implied by this repository.

Directory expansion: 100 robot makers + 100 component / kit suppliers. Catalog: 51 robot platforms, 49 components, 15 kits and development platforms. New sources reviewed 2026-10-25.

Journal expansion (25 October 2026): all 15 articles expanded to 677–718 words, with two original AI-generated photographic editorial illustrations per article. Rebuild with node scripts/build-blog.cjs from content/blog-posts.json. Illustration provenance is recorded in dist/assets/journal/premium-manifest.json.



Premium imagery: 30 unique built-in imagegen assets, 1672 x 941 source resolution, optimized WebP delivery. Captions distinguish fictional concept scenes from manufacturer photography. Images within stories support click / keyboard enlargement.

