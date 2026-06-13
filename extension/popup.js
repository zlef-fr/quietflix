/* QuietFlix popup logic */
'use strict';
const KEY = 'quietflix';
const DEFAULTS = { enabled: true, offset: 0.7, muteAll: false, targetVolume: 0.15, targetMuted: false, seenPlayer: false };

const $ = (id) => document.getElementById(id);
let cfg = Object.assign({}, DEFAULTS);

function render() {
  // power / active state
  const power = $('power');
  power.classList.toggle('off', !cfg.enabled);
  $('statusText').textContent = cfg.enabled ? 'Active' : 'Off';
  document.querySelector('main').classList.toggle('disabled', !cfg.enabled);

  // synced-from-player readout
  const pct = Math.round((cfg.targetMuted ? 0 : cfg.targetVolume) * 100);
  $('syncVal').textContent = cfg.seenPlayer ? pct + '%' : '— (default ' + pct + '%)';
  $('syncFill').style.width = pct + '%';
  $('syncNote').textContent = cfg.seenPlayer
    ? 'Previews on browse & title pages now match this level.'
    : 'Press play once in the Netflix player to capture your real volume.';

  // offset
  const off = Math.round(cfg.offset * 100);
  $('offset').value = off;
  $('offsetVal').textContent = cfg.muteAll ? 'muted' : off + '% of player';

  // mute toggle
  $('muteAll').checked = cfg.muteAll;
}

function save(patch) {
  cfg = Object.assign({}, cfg, patch);
  chrome.storage.local.set({ [KEY]: cfg }, render);
}

$('power').addEventListener('click', () => save({ enabled: !cfg.enabled }));
$('offset').addEventListener('input', (e) => save({ offset: Number(e.target.value) / 100 }));
$('muteAll').addEventListener('change', (e) => save({ muteAll: e.target.checked }));
$('resync').addEventListener('click', () => {
  // Nudge content scripts to re-apply by re-writing config unchanged.
  chrome.storage.local.set({ [KEY]: cfg });
  const btn = $('resync'); const t = btn.textContent;
  btn.textContent = 'Synced ✓';
  setTimeout(() => { btn.textContent = t; }, 1100);
});

chrome.storage.onChanged.addListener((ch, area) => {
  if (area === 'local' && ch[KEY]) { cfg = Object.assign({}, DEFAULTS, ch[KEY].newValue || {}); render(); }
});

chrome.storage.local.get(KEY, (r) => {
  cfg = Object.assign({}, DEFAULTS, (r && r[KEY]) || {});
  render();
});
