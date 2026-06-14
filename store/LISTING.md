# QuietFlix — Chrome Web Store submission kit

Everything needed to publish. Upload `quietflix-1.0.0.zip`, then copy each field below into the
Developer Dashboard (https://chrome.google.com/webstore/devconsole). One-time $5 developer
registration fee applies to the account.

---

## 1. Package to upload

- **File:** `store/quietflix-1.0.0.zip` (manifest.json at the zip root — store-ready)
- **Manifest version:** 3 · **Version:** 1.0.0

---

## 2. Store listing

**Item name** (≤45 chars)
```
QuietFlix — Tame Netflix Preview Volume
```

**Summary / short description** (≤132 chars)
```
Mirrors your real Netflix player volume onto autoplay previews, so trailers stop blasting at full volume while you browse.
```

**Category:** `Tools`
**Language:** English

**Detailed description**
```
Netflix remembers the volume you set in the player during a binge — but it ignores it completely for the autoplay previews on the browse, title, and search pages. Those previews fire at full volume unless you disable previews entirely. The result: you're calmly browsing late at night and a trailer suddenly blasts at 100%, and you scramble for the mute key.

QuietFlix fixes exactly that. It silently reads the volume you last set in the real Netflix player and applies it to every preview in real time, so previews match the level you already chose. No more jump-scares — and you don't have to turn previews off to get peace and quiet.

WHAT IT DOES
• Mirrors your real player volume onto every Netflix autoplay preview
• Keeps previews working — you just lose the volume spike, not the discovery
• Optional preview offset: play previews a touch quieter than your shows (e.g. 70% of player volume)
• Optional "mute previews entirely" mode if you want silence while you browse
• Re-applies automatically as you navigate and as new previews load

TRULY SET-AND-FORGET
There's no dashboard to manage and nothing to configure. Install it, watch Netflix once so it learns your volume, and forget it's there. A tiny popup is available if you ever want to tweak the offset or toggle it off.

PRIVACY-FIRST BY DESIGN
• No account, no sign-up
• No tracking, no analytics, no telemetry
• No network requests and no remote code — all logic runs locally
• Runs only on netflix.com; the only permission it stores is your local settings

LIGHTWEIGHT
QuietFlix is a single small content script that only touches video elements on Netflix. No noticeable performance impact.

Note: QuietFlix is an independent project and is not affiliated with, endorsed by, or sponsored by Netflix. "Netflix" is a trademark of its respective owner and is used here only to describe what the extension works with.
```

---

## 3. Privacy tab (required)

**Single purpose description**
```
QuietFlix sets the volume of Netflix's autoplay preview videos to match the volume the user chose in the Netflix player, so previews don't play louder than the rest of Netflix.
```

**Permission justifications**

- `storage`
```
Used only to save the user's local settings (on/off state, preview-volume offset, mute toggle) and the most recent player volume detected, so the chosen level persists between page loads. This data stays on the user's device and is never transmitted.
```

- Host permission `*://*.netflix.com/*`
```
QuietFlix only works on Netflix. It needs access to netflix.com pages to read the volume of the player's video element and to set the volume of the autoplay preview video elements on the browse, title, and search pages. It runs on no other sites.
```

**Remote code:** No, I am not using remote code. (All code is included in the package.)

**Data usage — disclosures (check these):**
- Does your item collect or use user data? → **No**
- Personally identifiable information: **No**
- Health information: **No**
- Financial / payment information: **No**
- Authentication information: **No**
- Personal communications: **No**
- Location: **No**
- Web history: **No**
- User activity: **No**
- Website content: **No**

**Privacy policy URL**
```
https://quietflix.zlef.fr/privacy
```

**Certifications (check all three):**
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## 4. Graphic assets (in store/assets/)

| Asset | File | Size | Required |
|-------|------|------|----------|
| Store icon | `store-icon-128.png` | 128×128 | ✅ required |
| Screenshot 1 (hero) | `screenshot-1-hero.png` | 1280×800 | ✅ at least 1 |
| Screenshot 2 (problem) | `screenshot-2-problem.png` | 1280×800 | optional |
| Screenshot 3 (popup) | `screenshot-3-popup.png` | 1280×800 | optional |
| Screenshot 4 (privacy) | `screenshot-4-privacy.png` | 1280×800 | optional |
| Screenshot 5 (how it works) | `screenshot-5-how.png` | 1280×800 | optional |
| Small promo tile | `promo-small-440x280.png` | 440×280 | optional (recommended) |
| Marquee promo tile | `promo-marquee-1440x560.png` | 1440×560 | optional |

(Up to 5 screenshots allowed — all 5 included.)

---

## 5. Distribution

- **Visibility:** Public
- **Regions:** All regions
- **Pricing:** Free
- **Mature content:** No

---

## 6. Support / homepage

- **Homepage / website:** https://quietflix.zlef.fr
- **Support email:** claude@ghr.lt

---

## 7. Notes before publishing

- Bump `version` in `manifest.json` and re-zip for every future update (the store rejects re-uploads with the same version).
- To re-build the upload zip after code changes:
  `cd extension && zip -rq ../store/quietflix-1.0.0.zip . -x ".*"`
- To re-generate assets: `NODE_PATH=/usr/lib/node_modules node store/gen-assets.js`
- Review typically takes a few hours to a few days for a single-purpose extension with minimal permissions.
