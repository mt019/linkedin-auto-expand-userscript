# Social Auto Expand Userscript

A Tampermonkey-compatible userscript that automatically expands collapsed social feed text and preloads additional feed items.

The project is operations-oriented: one userscript, one release stream, and per-site profiles inside `SITE_PROFILES`.

The install asset uses the same project name as the repository: `social-auto-expand.user.js`.

## Supported Sites

- LinkedIn
- Facebook

## Behavior

- Expands visible collapsed text controls inside supported feed/post content areas.
- Supports common English, Simplified Chinese, and Traditional Chinese expand labels.
- Uses site-specific component selectors when available, then short visible text labels as fallback.
- Preloads more feed items on sites where background loading does not cause visible viewport jitter.
- Pauses background preloading during recent user activity and modal/dialog states.

Facebook background preloading is disabled because Facebook visibly reacts to programmatic scroll jumps. Facebook still auto-expands collapsed post text.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Open the raw userscript file:
   `https://github.com/mt019/social-auto-expand-userscript/releases/latest/download/social-auto-expand.user.js`
3. Confirm installation in the userscript manager.
4. Open or refresh LinkedIn or Facebook.

## Supported URLs

- `https://www.linkedin.com/*`
- `https://linkedin.com/*`
- `https://www.facebook.com/*`
- `https://web.facebook.com/*`
- `https://m.facebook.com/*`

## Adding Another Site

Add one object to `SITE_PROFILES` with:

- `hostPattern`
- `clickableSelectors`
- `componentSelectors`
- `contentAncestorSelectors`
- `excludedAncestorSelectors`
- `extraExpandTextPatterns`
- `blockingDialogSelector`

Keep all site-specific logic in the profile. The shared scan, click, and preload engine should remain generic.

## Development

Run the metadata check:

```sh
npm test
```

## Release

Releases attach `social-auto-expand.user.js` so userscript managers can install the latest version directly.

## License

MIT
