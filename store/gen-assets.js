/* Generates Chrome Web Store assets for QuietFlix at exact required sizes.
   Run: NODE_PATH=/usr/lib/node_modules node store/gen-assets.js  (from project root) */
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'assets');

const FONT = `system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`;
const C = {
  bg:'#06060a', s1:'#0e0e13', s2:'#15151c', line:'rgba(255,255,255,.08)',
  text:'#e9eae2', soft:'#b6b7ad', muted:'#7d7e76',
  olive:'#3e4618', oliveMid:'#59642a', oliveSoft:'#9dae50', oliveBright:'#bdce74',
};

// Reusable extension-popup mockup
function popup(scale = 1, synced = '42%', syncedW = 42, offset = '70% of player', offsetW = 70) {
  return `
  <div style="transform:scale(${scale});transform-origin:center;width:340px;background:${C.s1};color:${C.text};border:1px solid #1f1f29;border-radius:16px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.6);font-family:${FONT}">
    <div style="display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #1f1f29">
      <div style="width:32px;height:32px;border-radius:8px;background:${C.olive};color:${C.oliveBright};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700">QF</div>
      <div><div style="font-size:15px;font-weight:600">QuietFlix</div><div style="font-size:11px;color:${C.muted}">Preview volume, fixed</div></div>
      <div style="margin-left:auto;display:flex;align-items:center;gap:7px;font-size:11px;color:${C.oliveBright}"><span style="width:8px;height:8px;border-radius:50%;background:${C.oliveBright}"></span>Active</div>
    </div>
    <div style="padding:16px 18px">
      <div style="background:${C.s2};border:1px solid #1f1f29;border-radius:10px;padding:14px 15px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:12px;color:${C.muted}"><span>Synced from player</span><b style="color:${C.text};font-size:13px">${synced}</b></div>
        <div style="height:6px;border-radius:3px;background:#23232e;overflow:hidden"><div style="width:${syncedW}%;height:100%;background:${C.oliveBright}"></div></div>
        <div style="font-size:11px;color:${C.muted};margin-top:9px">Previews on browse &amp; title pages now match this level.</div>
      </div>
      <div style="background:${C.s2};border:1px solid #1f1f29;border-radius:10px;padding:14px 15px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:12px"><span style="color:${C.text}">Preview offset</span><span style="color:${C.oliveBright}">${offset}</span></div>
        <div style="height:6px;border-radius:3px;background:#23232e;position:relative"><div style="width:${offsetW}%;height:100%;border-radius:3px;background:${C.olive}"></div><div style="position:absolute;left:${offsetW-2}%;top:-4px;width:14px;height:14px;border-radius:50%;background:${C.oliveBright};border:2px solid ${C.s1}"></div></div>
        <div style="font-size:11px;color:${C.muted};margin-top:9px">Keep previews a touch quieter than your shows.</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 2px 2px;font-size:12px;color:${C.muted}"><span>Mute previews entirely</span><div style="width:38px;height:21px;border-radius:11px;background:#23232e;position:relative"><i style="position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:50%;background:${C.muted}"></i></div></div>
    </div>
    <div style="padding:0 18px 18px"><div style="width:100%;padding:11px;border-radius:9px;background:${C.olive};color:${C.oliveBright};font-size:13px;font-weight:600;text-align:center">Re-sync now</div><div style="text-align:center;font-size:10px;color:${C.muted};margin-top:11px">Works silently on netflix.com — no account, no tracking</div></div>
  </div>`;
}

// faint background grid of "preview tiles"
function tileField() {
  let cells = '';
  const reds = ['#3a1418','#2a1014','#341216','#241015'];
  for (let i=0;i<24;i++){ const r=reds[i%reds.length];
    cells += `<div style="aspect-ratio:16/10;border-radius:8px;background:linear-gradient(135deg,${r},#120a0c);border:1px solid rgba(255,255,255,.04)"></div>`; }
  return `<div style="position:absolute;inset:0;opacity:.20;display:grid;grid-template-columns:repeat(6,1fr);gap:14px;padding:40px;filter:blur(.5px)">${cells}</div>`;
}

function frame(w, h, inner) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box;font-family:${FONT}}
    html,body{width:${w}px;height:${h}px;overflow:hidden}
    body{background:radial-gradient(120% 90% at 80% 10%, #0c0c12 0%, ${C.bg} 60%);color:${C.text};position:relative}
    .eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:14px;font-weight:600;color:${C.oliveSoft}}
    .vbar{height:12px;border-radius:6px;background:#23232e;overflow:hidden}
    .vbar>div{height:100%}
  </style></head><body>${inner}</body></html>`;
}

const W=1280, H=800;

// Screenshot 1 — hero
const s1 = frame(W,H, `${tileField()}
  <div style="position:relative;display:grid;grid-template-columns:1.05fr .95fr;height:100%;align-items:center;padding:0 80px;gap:48px">
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:26px">
        <div style="width:44px;height:44px;border-radius:10px;background:${C.olive};color:${C.oliveBright};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700">QF</div>
        <div style="font-size:26px;font-weight:700;letter-spacing:-.02em">Quiet<span style="color:${C.oliveSoft}">Flix</span></div>
      </div>
      <div class="eyebrow" style="margin-bottom:16px">Chrome extension · Free</div>
      <div style="font-size:58px;line-height:1.04;letter-spacing:-.03em;font-weight:700">Set your volume once.<br><span style="color:${C.oliveBright}">Every preview obeys it.</span></div>
      <div style="font-size:21px;color:${C.soft};margin-top:24px;max-width:30ch">Netflix blasts autoplay previews at full volume. QuietFlix mirrors your real player level onto every one.</div>
    </div>
    <div style="display:flex;justify-content:center">${popup(1.18)}</div>
  </div>`);

// Screenshot 2 — the problem / before-after
const s2 = frame(W,H, `
  <div style="height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 90px">
    <div class="eyebrow">The daily 2 a.m. jump-scare</div>
    <div style="font-size:46px;font-weight:700;letter-spacing:-.02em;margin:14px 0 50px">Previews ignore the volume you set</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
      <div style="background:${C.s1};border:1px solid ${C.line};border-radius:14px;padding:30px 32px">
        <div style="font-size:15px;color:${C.muted};text-transform:uppercase;letter-spacing:.12em;margin-bottom:18px">Without QuietFlix</div>
        <div style="font-size:20px;color:${C.soft};margin-bottom:8px">Preview volume</div>
        <div class="vbar"><div style="width:100%;background:#c2566a"></div></div>
        <div style="font-size:40px;font-weight:700;margin-top:14px;color:#e3829a">100%</div>
        <div style="font-size:16px;color:${C.muted};margin-top:6px">Full blast, every time you browse.</div>
      </div>
      <div style="background:${C.s1};border:1px solid rgba(157,174,80,.35);border-radius:14px;padding:30px 32px">
        <div style="font-size:15px;color:${C.oliveSoft};text-transform:uppercase;letter-spacing:.12em;margin-bottom:18px">With QuietFlix</div>
        <div style="font-size:20px;color:${C.soft};margin-bottom:8px">Preview volume</div>
        <div class="vbar"><div style="width:30%;background:${C.oliveBright}"></div></div>
        <div style="font-size:40px;font-weight:700;margin-top:14px;color:${C.oliveBright}">= your player</div>
        <div style="font-size:16px;color:${C.muted};margin-top:6px">Matched to the level you chose. No surprises.</div>
      </div>
    </div>
  </div>`);

// Screenshot 3 — popup features close-up
const s3 = frame(W,H, `
  <div style="height:100%;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 90px;gap:40px">
    <div>
      <div class="eyebrow">One tiny popup</div>
      <div style="font-size:46px;font-weight:700;letter-spacing:-.02em;margin:14px 0 28px">Everything in a click</div>
      ${[['On / off','Pause QuietFlix anytime — it instantly hands volume back to Netflix.'],
         ['Preview offset','Keep previews a touch quieter than your shows, e.g. 70% of player.'],
         ['Mute previews entirely','Total silence while you browse, visuals still play.'],
         ['Synced from player','Shows the exact level it captured — set-and-forget.']]
        .map(([t,d])=>`<div style="display:flex;gap:14px;margin-bottom:20px"><div style="width:10px;height:10px;border-radius:50%;background:${C.oliveBright};margin-top:9px;flex:0 0 auto"></div><div><div style="font-size:20px;font-weight:600">${t}</div><div style="font-size:16px;color:${C.muted};margin-top:2px">${d}</div></div></div>`).join('')}
    </div>
    <div style="display:flex;justify-content:center">${popup(1.25)}</div>
  </div>`);

// Screenshot 4 — trust / privacy
const s4 = frame(W,H, `
  <div style="height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 90px">
    <div class="eyebrow" style="text-align:center">Quietly respectful</div>
    <div style="font-size:46px;font-weight:700;letter-spacing:-.02em;margin:14px 0 48px;text-align:center">No account. No tracking. No slowdown.</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px">
      ${[['🔒','Zero data','No accounts, no analytics, no network calls. Ever.'],
         ['🎯','Netflix only','Runs solely on netflix.com — nowhere else.'],
         ['🪶','Featherweight','A single small content script. No lag.'],
         ['🧩','Manifest V3','Modern, minimal permissions: storage only.']]
        .map(([i,t,d])=>`<div style="background:${C.s1};border:1px solid ${C.line};border-radius:14px;padding:28px 24px;text-align:center"><div style="font-size:34px;margin-bottom:14px">${i}</div><div style="font-size:21px;font-weight:600;margin-bottom:8px">${t}</div><div style="font-size:15px;color:${C.muted};line-height:1.5">${d}</div></div>`).join('')}
    </div>
  </div>`);

// Screenshot 5 — how it works
const s5 = frame(W,H, `
  <div style="height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 90px">
    <div class="eyebrow">Set-and-forget</div>
    <div style="font-size:46px;font-weight:700;letter-spacing:-.02em;margin:14px 0 50px">How it works</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px">
      ${[['1','Reads your player','When you set volume in the real Netflix player, QuietFlix captures it.'],
         ['2','Levels every preview','Browse, title and search previews are clamped to match — instantly.'],
         ['3','Stays in sync','Survives Netflix navigation and new previews with a built-in watchdog.']]
        .map(([n,t,d])=>`<div style="background:${C.s1};border:1px solid ${C.line};border-radius:14px;padding:32px 30px"><div style="width:42px;height:42px;border-radius:8px;background:${C.olive};color:${C.oliveBright};font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:18px">${n}</div><div style="font-size:23px;font-weight:600;margin-bottom:10px">${t}</div><div style="font-size:17px;color:${C.muted};line-height:1.55">${d}</div></div>`).join('')}
    </div>
  </div>`);

// Small promo tile 440x280
const promoSmall = frame(440,280, `
  <div style="height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 34px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
      <div style="width:46px;height:46px;border-radius:11px;background:${C.olive};color:${C.oliveBright};display:flex;align-items:center;justify-content:center;font-size:23px;font-weight:700">QF</div>
      <div style="font-size:28px;font-weight:700;letter-spacing:-.02em">Quiet<span style="color:${C.oliveSoft}">Flix</span></div>
    </div>
    <div style="font-size:22px;font-weight:600;line-height:1.2">Tame Netflix<br>preview volume</div>
    <div style="font-size:14px;color:${C.muted};margin-top:12px">No more full-volume trailers while you browse.</div>
  </div>`);

// Marquee promo tile 1400x560
const promoMarquee = frame(1400,560, `${tileField()}
  <div style="position:relative;height:100%;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;padding:0 90px;gap:40px">
    <div>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px">
        <div style="width:50px;height:50px;border-radius:12px;background:${C.olive};color:${C.oliveBright};display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:700">QF</div>
        <div style="font-size:30px;font-weight:700;letter-spacing:-.02em">Quiet<span style="color:${C.oliveSoft}">Flix</span></div>
      </div>
      <div style="font-size:54px;line-height:1.05;letter-spacing:-.03em;font-weight:700">Set your volume once.<br><span style="color:${C.oliveBright}">Every Netflix preview obeys it.</span></div>
      <div style="font-size:20px;color:${C.soft};margin-top:22px;max-width:42ch">A tiny, set-and-forget extension that mirrors your real player volume onto autoplay previews.</div>
    </div>
    <div style="display:flex;justify-content:center">${popup(1.1)}</div>
  </div>`);

(async () => {
  const b = await chromium.launch();
  const jobs = [
    ['screenshot-1-hero.png', W, H, s1],
    ['screenshot-2-problem.png', W, H, s2],
    ['screenshot-3-popup.png', W, H, s3],
    ['screenshot-4-privacy.png', W, H, s4],
    ['screenshot-5-how.png', W, H, s5],
    ['promo-small-440x280.png', 440, 280, promoSmall],
    ['promo-marquee-1400x560.png', 1400, 560, promoMarquee],
  ];
  for (const [name, w, h, html] of jobs) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(OUT, name) });
    await p.close();
    console.log('wrote', name, `${w}x${h}`);
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
