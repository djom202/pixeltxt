# Pixeltxt documentation site (Jekyll)

Build locally:

```bash
cd docs
bundle install
bundle exec jekyll serve --livereload
```

Open `http://127.0.0.1:4000/pixeltxt/` (path matches `baseurl` in `_config.yml`).

Production build matches GitHub Actions: `bundle exec jekyll build -d _site`.

## GitHub Pages (repository settings)

1. **Settings → Pages → Build and deployment**: set **Source** to **GitHub Actions** (not “Deploy from a branch”).
2. Push to `main` (or run the workflow manually) so `.github/workflows/pages.yml` builds and deploys.
3. If the repository name is not `pixeltxt`, update `baseurl` in [`_config.yml`](./_config.yml) to match `/<repo-name>/`.
