# QuietFlix — Reddit launch drafts

The extension is live — store links below are the real listing
(https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok), ready to post.
Read the Reddit etiquette notes at the bottom — the posts get removed otherwise.

---

## Primary post — r/netflix (problem-first, soft mention)

**Title:**
> Made a tiny extension because the autoplay previews ignore the volume you set in the player

**Body:**
```
This has bugged me for years: Netflix remembers the volume I set in the player during a binge,
but the autoplay previews on the home/browse and title pages completely ignore it and play at
full volume. So I'd be browsing quietly at night and a trailer would suddenly blast at 100% and
wake up the whole room.

Netflix's only built-in fix is turning previews off entirely, which I didn't want — I actually
like the previews, I just don't want them louder than the show I was watching.

So I made a little Chrome extension that just mirrors your real player volume onto every preview.
You set your volume once, and the previews match it. There's also an optional slider to make
previews a bit quieter than your shows (e.g. 70%), or a full-mute toggle if you'd rather keep the
visuals but no sound.

It's free, has no account, doesn't track anything, and only runs on netflix.com.

Link: https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok

Curious if I'm the only one this drove crazy, or if it's a common annoyance. Open to feedback.
```

---

## Alt post — r/chrome_extensions / r/chrome (maker-friendly)

**Title:**
> I built a Manifest V3 extension that fixes Netflix's full-volume autoplay previews

**Body:**
```
Quick one I made to scratch my own itch: Netflix saves your in-player volume but plays the
browse/title-page autoplay previews at full volume regardless. QuietFlix reads your last player
volume and applies it to every preview in real time.

Tech notes for anyone curious:
- Manifest V3, single content script, no background service worker
- Treats the /watch player video as the source of truth, clamps every other <video> to it
- MutationObserver + a 1s watchdog + history hooks to survive Netflix's SPA navigation and
  lazy-loaded previews
- Permissions are just `storage` + host access to netflix.com — no remote code, no tracking,
  no network calls
- Optional offset slider + full-mute toggle in the popup

Free, no account: https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok

Happy to answer questions about the approach (targeting media-element semantics instead of CSS
classes so it survives Netflix UI changes was the interesting part).
```

---

## Alt post — r/SideProject / r/webdev (builder angle)

**Title:**
> Shipped a free Chrome extension that levels Netflix's too-loud autoplay previews

**Body:**
```
Tiny single-purpose project: Netflix ignores your player volume for autoplay previews and plays
them at 100%. QuietFlix mirrors your real player volume onto every preview so you stop getting
blasted while browsing.

No account, no tracking, no network calls — just a small content script that runs on netflix.com.
There's an optional "previews at X% of player" slider and a full-mute toggle.

Store: https://chromewebstore.google.com/detail/mbgdbocfhifgaahepbijkcedkleahpok
Landing page: https://quietflix.zlef.fr

Would love feedback, and I'm interested in whether people want the same thing for Prime Video /
Disney+ (they have the same problem).
```

---

## Ready-to-paste comment replies (for the inevitable questions)

**"Does it collect data / is it safe?"**
```
No data at all — no account, no analytics, no network requests. The only permission is `storage`
(to remember your settings) and access to netflix.com so it can adjust the video volume. Privacy
policy: https://quietflix.zlef.fr/privacy
```

**"Why not just disable previews?"**
```
You can, but that also kills the previews you might actually want for discovery. This keeps them
on and just fixes the volume so they match what you set in the player.

```

**"Can you add Prime Video / Disney+ / YouTube?"**
```
On my list — they have the same annoyance. Wanted to nail Netflix first. If there's demand I'll
expand it into a general 'streaming preview volume' tool.
```

**"Firefox version?"**
```
It's a standard MV3 content script so a Firefox port is realistic — I'll look into it if people
want it.
```

---

## Reddit etiquette (don't skip — these get posts removed)

- **Check each subreddit's rules first.** r/netflix and many subs restrict or ban self-promotion;
  the problem-first post above reads as a discussion, not an ad — keep it that way.
- **Post from an account with some history/karma.** Brand-new accounts dropping a link get
  auto-removed or shadow-flagged.
- **Don't blast all subs the same day.** Space them out (a few days apart), and tailor the title
  to each sub instead of copy-pasting.
- **Reply to comments quickly** in the first hour or two — engagement is what gets it seen, and
  it signals you're a person, not a drop-and-run marketer.
- **One link, in the body, once.** Don't repeat it; don't put it in the title.
- **Lead with the annoyance, not the product.** People upvote "ugh this finally got fixed,"
  not "check out my extension."
- If a sub requires it, flair the post correctly (e.g. "I made this" / "Project").
```
```
