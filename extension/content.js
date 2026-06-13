/* QuietFlix — content script
 * Goal: Netflix saves the *player* volume across a binge, but autoplay previews
 * on the browse / title / search pages ignore it and fire at full volume.
 *
 * Strategy (no reliance on Netflix CSS classes — only stable media semantics):
 *   - On a /watch page the large playing <video> IS the real player. We listen
 *     to its volumechange and persist that level as the "target" (source of truth).
 *   - Everywhere else, every <video> is a preview. We clamp it to
 *     target * offset (optionally muted), re-applying whenever Netflix resets it.
 *   - A MutationObserver catches lazy-loaded previews; a light interval is the
 *     watchdog against Netflix silently re-raising volume; SPA route changes are
 *     hooked via history patching.
 */
(function () {
  'use strict';

  const KEY = 'quietflix';
  const DEFAULTS = {
    enabled: true,
    offset: 0.7,          // previews play at 70% of player volume by default
    muteAll: false,       // hard-mute every preview
    targetVolume: 0.15,   // graceful fallback before any player volume is seen
    targetMuted: false,
    seenPlayer: false     // becomes true once we've read a real player volume
  };

  let cfg = Object.assign({}, DEFAULTS);
  const applying = new WeakSet();   // videos we're currently writing to (avoid feedback loops)
  const bound = new WeakSet();      // videos we've already wired up

  const isWatch = () => location.pathname.indexOf('/watch') === 0;
  const clamp01 = (n) => Math.max(0, Math.min(1, n));

  function previewTarget() {
    if (!cfg.enabled) return null;            // null = hands off entirely
    if (cfg.muteAll) return { vol: 0, muted: true };
    const base = cfg.targetMuted ? 0 : cfg.targetVolume;
    const vol = clamp01(base * cfg.offset);
    return { vol, muted: vol <= 0.0001 };
  }

  function applyPreview(video) {
    const t = previewTarget();
    if (!t) return;
    if (Math.abs(video.volume - t.vol) > 0.005 || video.muted !== t.muted) {
      applying.add(video);
      try { video.volume = t.vol; video.muted = t.muted; } catch (_) {}
      setTimeout(() => applying.delete(video), 60);
    }
  }

  function capturePlayer(video) {
    if (applying.has(video)) return;
    // Persist the real player level as the source of truth for all previews.
    if (Math.abs((cfg.targetVolume || 0) - video.volume) > 0.005 ||
        cfg.targetMuted !== video.muted || !cfg.seenPlayer) {
      save({ targetVolume: video.volume, targetMuted: video.muted, seenPlayer: true });
    }
  }

  function bind(video) {
    if (!video || bound.has(video)) return;
    bound.add(video);
    video.addEventListener('volumechange', () => {
      if (applying.has(video)) return;
      if (isWatch()) capturePlayer(video);
      else applyPreview(video);
    }, true);
    if (isWatch()) capturePlayer(video);
    else applyPreview(video);
  }

  function sweep() {
    const vids = document.querySelectorAll('video');
    for (let i = 0; i < vids.length; i++) {
      bind(vids[i]);
      if (!isWatch()) applyPreview(vids[i]);
    }
  }

  /* ---- storage plumbing ---- */
  function save(patch) {
    cfg = Object.assign({}, cfg, patch);
    try { chrome.storage.local.set({ [KEY]: cfg }); } catch (_) {}
  }
  function load(done) {
    try {
      chrome.storage.local.get(KEY, (r) => {
        cfg = Object.assign({}, DEFAULTS, (r && r[KEY]) || {});
        done && done();
      });
    } catch (_) { done && done(); }
  }
  try {
    chrome.storage.onChanged.addListener((ch, area) => {
      if (area === 'local' && ch[KEY]) {
        cfg = Object.assign({}, DEFAULTS, ch[KEY].newValue || {});
        sweep();
      }
    });
  } catch (_) {}

  /* ---- SPA navigation + watchdog ---- */
  function onRoute() { setTimeout(sweep, 80); }
  ['pushState', 'replaceState'].forEach((m) => {
    const orig = history[m];
    history[m] = function () { const r = orig.apply(this, arguments); onRoute(); return r; };
  });
  window.addEventListener('popstate', onRoute);

  function start() {
    sweep();
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.tagName === 'VIDEO') bind(n);
          if (n.querySelectorAll) n.querySelectorAll('video').forEach(bind);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    // Watchdog: Netflix periodically re-raises preview volume; re-clamp every second.
    setInterval(() => { if (!isWatch()) sweep(); }, 1000);
  }

  load(() => {
    if (document.documentElement) start();
    else document.addEventListener('DOMContentLoaded', start, { once: true });
  });
})();
