# Reyhaneh v4 — design and interaction QA

Date: 2026-10-19. Scope: approved redesign of the existing eight-chapter Persian story, prioritizing phone viewports. This is an intentional redesign, not a pixel-identical clone.

## Visual source and implementation evidence

- Source visual truth: original live site at https://hosiinabaszadeh84.github.io/reyhaneh/#ch1, directly inspected and captured in the preceding audit. Existing rose/plum/ivory palette, eight games, progress, finale and local memories are retained.
- Implementation: temporary GitHub Pages `preview-v4/index.html`, exercised through `preview-v4/qa.html` in the cloud browser. The managed local preview failed with `bwrap: Can't mount proc ... Operation not permitted`; no replacement local browser/server was used.
- Browser-rendered screenshots: captured and inspected in this conversation for invitation, hero, glass heart, letters, wheel, garden, lanterns, scratch, compass, rain, finale and desktop composition. The browser API did not provide local screenshot export paths; evidence remains in the session captures. No pixel-perfect comparison is claimed.
- Viewports: 320, 360, 390 and 430 CSS px wide by 844 CSS px high, plus 1140 × 844 desktop, all 1:1 unscaled iframe content. The desktop browser draws a scrollbar gutter; real mobile browsers may use overlay scrollbars. Physical Android/iOS testing remains a gap.
- Comparison: original and redesigned states were reviewed for preserved chapter meaning and interaction, rather than matching layout pixels. Focused checks covered letter controls, optical-glass asset, planted-flower baselines, lit lantern silhouettes, scratch path continuity, wheel landing and compass lettering.

## Required surfaces

- Typography: self-hosted Vazirmatn controls/body, Noto Naskh Arabic display/poetry. Persian shaping, RTL order, multiline verse wrapping and readable contrast checked. No generated text is embedded in images.
- Layout: one column on phones, two columns on desktop; safe-area bottom inset; 44–56 px controls; horizontal overflow observed as zero at all tested widths.
- Colors: existing rose, plum, ivory and scene-specific green/blue hues retained with restrained brass accents.
- Assets: original hero extracted and optimized; new envelope, glass heart, garden, rose, lantern and compass case inspected as actual rendered WebP. Precision controls and needle use the existing native system; standard icons come from Lucide.
- Content: all 27 supplied verses included, hashtags/channel label removed, orthography normalized without inventing attribution. Short original UI copy replaced generic instructions.

## Findings and fixes across iterations

1. P1: invitation horizontal/vertical decorative overflow. Removed oversized rotating pseudo-layer; constrained backdrop to fixed viewport. Phone screenshots show no extra horizontal scroll.
2. P1: initial anchor/restoration conflicts. Capture/remove incoming hash before parsing body; reveal the correct destination in one controlled transition. Invitation exists in first HTML; fonts settle before content is shown.
3. P1: skip left the timed game active. A single stop lifecycle now clears interval/heart timers and active heart nodes. Skip opens finale with a reassuring message; no later failure overwrites it.
4. P1: saved completion did not match restored game counters. Restore complete heart, 10 planted flowers, 7 lit lanterns, discovered scratch, chosen wheel name and final unlock consistently. Old progress/vault keys are preserved.
5. P2: letter content changed height and displaced controls. Fixed reader height, bounded scrollable text region, stable control footer. At 320 px, two-line and longer first poem had the same control Y coordinate and zero horizontal overflow.
6. P2: scratch reset on resize. Store normalized stroke paths in memory and repaint at new dimensions. A 19% stroke remained visibly present after 390→430 px change.
7. P2: native outline art lacked depth. Replaced flower/lantern/heart/case presentation with optimized photographic assets; removed unused vector flower/lantern builders.
8. P2: compass text overlapped metal rim. Moved north/south/east/west labels inward and shortened the pointer to keep a clear gap below the north label. Post-fix 390 px capture shows all four labels fully inside the dial, with a clear gap above the pointer.
9. P2: same-version preview resources could remain cached. Versioned stylesheet/script references and preview frame URL were advanced; DOM inspection confirmed the new glass image and correct stylesheet, rather than relying only on deployment success.

## Interaction verification

- Hold heart: completed using a real 3-second pointer hold through the browser, then persisted.
- Letters: open/close, next/previous, 27-item count, longest supplied verse wrapping, stable controls at 320 px.
- Wheel: busy button disabled; chosen name matches pointer landing; restored on reload.
- Garden: ten clicks produce ten grounded roses and reveal verse; after reload count remains 10/10.
- Lanterns: seven distinct buttons become pressed/lit, reveal verse and restore as 7/7.
- Scratch: real drag, continuous stroke, resize preservation and keyboard-friendly reveal alternative.
- Compass: exact whole-turn landing; computed final matrix was identity; repeated spin enabled afterwards.
- Rain: start, skip during play, timer cleanup, final unlock; a complete 30-second round reached zero, removed all active hearts, and showed the intended completion message.
- Navigation: native modal opens, lists eight completed states, link closes dialog and moves to selected chapter.
- Vault: saved a disposable test memory in isolated preview storage; reload retrieval verified by the saved title appearing exactly once. Production storage is never cleared by the QA harness.
- Console: page warning/error logs checked; no site errors observed. Extension-internal messages excluded.

## Performance and limits

- No always-running heart loop or global petal canvas. Hero ambient movement runs only while visible and pauses for hidden tabs. Game timers stop offscreen/when hidden. Images/fonts are local, reusable and cacheable.
- Main HTML reduced from about 623 kB to about 21 kB by removing the embedded image and inline game/style blocks. This is not a claim about total download size or measured speedup.
- The iframe diagnostic generated an initial root-HTML layout-shift entry of 1.0 with identical before/after rectangles, and counted deliberate viewport resizes. Therefore its aggregate CLS is not treated as a production Core Web Vitals measurement. Warm entry also showed approximately 0.001. No Lighthouse score or physical-device FPS is claimed.
- Reduced-motion behavior is implemented and source-reviewed; operating-system preference was not changed in this browser. Actual OS/device testing, file-picker audio playback and memory photo upload were not exercised.

## Follow-up polish

P3: generated transparent objects can show a faint edge at magnification; normal-size phone captures are acceptable. Cross-browser Safari and very small-height devices should be checked on hardware when available.

final result: passed

Post-fix gates passed: compass-label capture, complete timed round, and legacy-only progress restoration after clearing isolated preview state. The legacy test restored 10/10 flowers, 7/7 lanterns and the unlocked final letter. A final production smoke test follows deployment; hardware/OS-specific test gaps above remain explicit.
