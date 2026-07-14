# Changelog

## 2.0.2 - 2026-07-15

- Rename the userscript file and release asset to `social-auto-expand.user.js`.
- Align repository name, package name, userscript metadata, documentation, and release asset naming.

## 2.0.1 - 2026-07-15

- Rename the GitHub-facing project metadata to `social-auto-expand-userscript`.
- Superseded by 2.0.2 for full asset-name alignment.

## 2.0.0 - 2026-07-15

- Convert the existing LinkedIn userscript into a unified social auto-expand userscript.
- Add Facebook support for post text expand controls and bounded feed preloading.
- Introduce `SITE_PROFILES` so future site support can be added without changing the shared engine.
- Added unified release support; asset naming was later aligned in 2.0.2.

## 1.2.0 - 2026-07-11

- Add bounded background preloading for additional LinkedIn feed items.
- Restore the previous viewport position after triggering LinkedIn infinite-scroll loading.
- Pause preloading during recent user activity and modal/dialog states.

## 1.1.0 - 2026-07-11

- Prefer language-independent LinkedIn expander selectors and `aria-expanded="false"` checks.
- Keep text matching only as a fallback for visible expand labels.
- Support collapsed LinkedIn text controls across UI languages when LinkedIn uses its standard expand components.

## 1.0.1 - 2026-07-11

- Match LinkedIn Traditional Chinese post expand controls such as `⋯⋯展開`.
- Stop matching generic `More` / `更多` controls that can open footer or navigation menus.
- Limit automatic clicks to LinkedIn content areas such as posts, comments, profile sections, and job descriptions.

## 1.0.0 - 2026-07-11

- Initial release.
- Automatically expands common LinkedIn collapsed text controls.
- Supports English, Simplified Chinese, and Traditional Chinese expand labels.
- Uses MutationObserver plus interval rescans for LinkedIn's dynamic navigation.
