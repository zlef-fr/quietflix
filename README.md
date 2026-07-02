<div align="center">

![views](https://assets.zlef.fr/badge/views/zlef-fr/quietflix.svg)

# QuietFlix

**Tame Netflix's full-volume autoplay previews.**

Netflix remembers the volume you set in the player during a binge — but it ignores it
completely for the autoplay previews on the browse, title, and search pages, which fire at
**100%**. QuietFlix silently mirrors your real player volume onto every preview, so trailers
stop blasting while you browse.

[**Add to Chrome →**](https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok) · [Website](https://quietflix.zlef.fr) · [Privacy](https://quietflix.zlef.fr/privacy)

![Manifest V3](https://img.shields.io/badge/Manifest-V3-3e4618) ![No tracking](https://img.shields.io/badge/tracking-none-6f9a3a) ![Price](https://img.shields.io/badge/price-free-bdce74)

</div>

---

## What it does

- **Mirrors your real player volume** onto every Netflix autoplay preview, in real time.
- **Keeps previews on** — you don't have to disable them to stop the volume spike.
- **Optional preview offset** — play previews a touch quieter than your shows (e.g. 70% of player volume).
- **Optional full-mute mode** — keep the visuals, drop the sound entirely.
- **Set-and-forget** — no dashboard, no account. Watch once so it learns your volume, then forget it's there.

## Install

### From the Chrome Web Store (recommended)
[**Add to Chrome**](https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok) — one click, free. Works in Chrome, Edge, Brave, and any Chromium browser.

### Manually (load unpacked)
1. Download [`extension/`](extension) as a ZIP (or `git clone` this repo).
2. Open `chrome://extensions` and enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `extension/` folder.
4. Play something on Netflix once to capture your volume — previews now match.

## How it works

A single Manifest V3 content script, with no background service worker:

- On a `/watch` page the large playing `<video>` **is** the real player. QuietFlix listens for
  `volumechange` and persists that level as the source of truth.
- Everywhere else (browse / title / search), every `<video>` is a preview. It clamps each one to
  `playerVolume × offset` (or mutes it), re-applying whenever Netflix resets it.
- A `MutationObserver` catches lazy-loaded previews, a 1-second watchdog re-clamps anything Netflix
  re-raises, and `history` hooks handle SPA navigation.

Crucially it targets **stable media-element semantics** (the `<video>` tags themselves), not
Netflix CSS classes, so it survives Netflix UI changes.

## Permissions

QuietFlix requests the bare minimum:

| Permission | Why |
|------------|-----|
| `storage` | Save your local settings (on/off, offset, mute) and the last detected player volume. |
| `*://*.netflix.com/*` | Read and set the volume of `<video>` elements on Netflix. It runs on no other site. |

No remote code, no network requests, no analytics, no accounts. See the [privacy policy](https://quietflix.zlef.fr/privacy).

## Repository layout

```
extension/              The extension itself (this is the product)
  manifest.json         MV3 manifest
  content.js            volume capture + preview clamping logic
  popup.html/.css/.js   the toolbar popup (on/off, offset slider, mute toggle)
  icons/                16 / 48 / 128 px icons
public/                 Landing page served at quietflix.zlef.fr
  index.html            marketing + install guide
  privacy.html          privacy policy (/privacy)
  quietflix.zip         load-unpacked download bundle
store/                  Chrome Web Store submission kit
  quietflix-1.0.0.zip   upload-ready package (manifest at zip root)
  LISTING.md            all dashboard copy + permission justifications
  REDDIT.md             launch post drafts
  gen-assets.js         regenerates store screenshots / promo tiles
  assets/               store icon, screenshots, promo tiles
server.js               tiny static server for the landing page
Dockerfile · docker-compose.yml
```

## Development

The extension is plain JS — no build step. Edit files in `extension/` and reload it from
`chrome://extensions`.

```bash
# rebuild the load-unpacked download bundle (public/quietflix.zip)
cd extension && zip -r ../public/quietflix.zip . -x ".*"

# rebuild the Chrome Web Store upload package (manifest at zip root)
cd extension && zip -r ../store/quietflix-1.0.0.zip . -x ".*"

# regenerate store screenshots & promo tiles (needs playwright)
NODE_PATH=/usr/lib/node_modules node store/gen-assets.js

# run the landing page locally
node server.js   # serves public/ on :10040
```

> Publishing an update: bump `version` in `extension/manifest.json`, re-zip, and upload — the
> Web Store rejects re-uploads that reuse a version number.

## License

[MIT](LICENSE) — do what you like, no warranty.

---

<div align="center">
A <a href="https://zlef.fr">ZLEF</a> project · not affiliated with Netflix
</div>
