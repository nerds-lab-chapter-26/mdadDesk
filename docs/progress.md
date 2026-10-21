# Progress log

| Day | Target | Status |
|---|---|---|
| 13 Oct | Skeleton + GCP setup + Gemini test | Skeleton ✅ · Gemini ✅ (93%, 0 invented) · GCP billing ❌ card declined → plan B |
| 14 Oct | Intake → extract → editable card → clarification loop | Help loop ✅ · Firebase live ✅ · alerts ✅ · editable card / clarification reply ⏳ |
| 15 Oct | Coordinator realtime, verify, map marker, timeline | |
| 16 Oct | Agencies, accept/decline/busy, lead/support, rules | |
| 17 Oct | Fallback, related flag, eval, deploy, **freeze** | |
| 18 Oct | Video, deck, README, submit by midday | |

## 2026-10-13
**Done**
- Repo skeleton: npm workspaces (`web`, `api`) + `shared` types.
- API: `/health`, `/extract`, `/clarify` with Gemini structured output + zod validation, 15 s timeout, never-throw envelope.
- Web: PWA (installable, offline shell), Firestore offline cache, report page (delivery-first submit),
  coordinator page (realtime list + detail + verify/resolve + timeline), login, agency stub.
- `firestore.rules` (role claims), `api/scripts/seed.ts`, `api/scripts/eval.ts`, 20 synthetic reports.
- `Dockerfile` for Cloud Run, `firebase.json` for Hosting.
- Verified: both workspaces typecheck, production build + service worker generated,
  `/health` OK, `/extract` without key returns `{ok:false}`.

**Later the same day**
- Gemini key works (new `AQ.` format). Models: `gemini-3.5-flash-lite` + backup `gemini-3.1-flash-lite`.
- Eval on 20 synthetic reports: **93% field accuracy, 0 invented values, 0 failures.**
- GCP billing failed (`OR_BACR2_31`, SadaPay card). Without billing there is no Cloud Run or Google Maps.
  Plan B: Firebase Spark (Hosting + Firestore + Auth) + Gemini without a server; the map comes from elsewhere.

- Map added early (planned for 15 Oct): Leaflet + OpenStreetMap on the coordinator page. Shows the demo
  building and one coloured dot per incident (amber reported, red verified, blue response, green resolved; open ones drawn on top, resolved small and faded);
  clicking a dot opens the incident. Shows a notice when offline.

**Not yet verified:** Firestore writes (no Firebase project yet), so no incident dots appear yet; deployment.

**Next (14 Oct)**
- Add the Gemini key → `npm run eval`; tune prompts until ≥90% / 0 invented.
- Clarification answer input on the report page; editable fields on the coordinator card.

## 2026-10-14
**Done**
- MVP help loop (docs/prd.md) built end to end:
  - Reporter: "Your reports" links on the report page (saved on the phone) → live `/track/<id>` page
    with 5 steps: sent → seen → help requested → "<agency> on the way" → closed.
  - Coordinator: "Send help" buttons per agency after Verify (busy agencies disabled); Resolve button.
  - Agency: inbox of requests for the signed-in agency with **On the way**.
  - Rules: open `get` of one incident by id; agencies can only set `response`/`respondingKinds` on
    incidents they were asked to help; agencies read only their own assignments.
- Shared `ActionButton` (busy + error message) replaces repeated try/catch in buttons.
- Verified: typecheck + production build. **Not yet verified against a real Firebase project**
  (user is creating it now); test steps in `docs/firebase-setup.md` step 8.

**Later the same day**
- Firebase project `mdaddeskv1-6af42` created (Spark, Firestore in Mumbai). `web/.env`, `.firebaserc`,
  `api/.env` filled; `api/service-account.json` in place (gitignored).
  Rules deployed ("Deploy complete"); seed created 3 agencies + 4 demo accounts.
- "Movie-style" alerts: full red flashing screen + siren (Web Audio, no file) + system notification when
  the tab is hidden. Coordinator: new SOS. Agency: new help request. Closes itself once handled.
- Docs: `deployment.md` (Hosting + preview link for testers + Render option for the AI API),
  `testing-e2e.md` (15 cases E1–E15 for teammates), `testing-user.md` (sessions with real people).
- Verified: typecheck + build. **Not yet verified by a person in the browser:** help loop on real
  Firebase, siren, notifications.

**Next**
- User runs `docs/testing-e2e.md` E1–E10 locally; fix what fails.
- Deploy Part A and send the preview link to the team.
- Editable fields on the coordinator card; clarification reply on the report page.

**Later the same day (2)**
- One-tap SOS: 6 big buttons (fire, smoke, medical, trapped, collapse, other). Typing is optional.
- Phone GPS sent with the SOS (after delivery, never blocking it). Coordinator + agency see
  "± metres" and an "Open in Google Maps" link; the map flies to the selected incident.
  Rules updated (reporter may add `location` while `reported`) and deployed.
- Verified: typecheck + build + rules deploy. Browser test pending (testing-e2e E1, E1b, E1c).

**Later the same day (3): AI without a server**
- Firebase AI Logic enabled (Gemini Developer API, Spark). Web now calls Gemini directly via
  `firebase/ai` (`web/src/lib/ai.ts`); prompts/schemas/fallback moved to `shared/src/ai/`.
  Removed `web/src/lib/api.ts`, `VITE_API_URL`, `VITE_MAPS_API_KEY`.
- Eval with the shared JSON Schema: 90.6%, 0 invented, 3/20 timeouts (see bug-fix).
- Blocked: App Check enforcement returns 401 → user to unenforce in console.
- App Check: reCAPTCHA key registered in Firebase App Check (Fraud Defense); site key in `web/.env`.
  Build includes it. Browser check by the user pending.
- Eval rerun: 92.6%, 0 invented, 1/20 timeout.

**Later the same day (4): feedback from the first browser test**
- Header showed "Login" after signing in → now shows "👤 coordinator" (opens sign-out page).
- Reporter good-news splash: each time their SOS moves forward (verified, help requested, on the way,
  closed) a green full-screen splash with a chime and a phone notification. Emojis = who is coming +
  the "opposite" of the danger (fire → 🚒🧯💧, medical → 🚑🩺, trapped → 🪜…). The live status card now
  also shows on the report page right after sending (no need to open /track).
- First-visit tour on report, coordinator and agency pages (+ "❓ How it works" button).
- Refactors: `Overlay` shared by alert / splash / tour; `submitSteps.ts` split out of useReportSubmit (≤60 lines).
- User confirmed: login, coordinator page and map work.
- Tours rewritten after user feedback: every tour starts with what each tab is for; coordinator and
  report tours explain the flow (SOS → Verify → Send → On the way); agency tour says an empty inbox is
  normal until the coordinator sends a request, and shows before sign-in. `TOUR_VERSION` in
  `useTour.ts` makes changed tours show again once.
- **Deployed** to https://mdaddeskv1-6af42.web.app (Firebase Hosting). Checked: `/`, `/coordinator` and
  `sw.js` return 200. Phone test (GPS, App Check on the live domain, siren) pending.
- **New look** (user: "UI nhi acha, logo bhe nhi acha"): new logo (red tile, white pin, help cross, signal
  waves), navy header with logo + pill nav + footer with emergency numbers, Plus Jakarta Sans, rounder
  cards/buttons, big gradient SOS tiles with numbered steps and a "Need help?" hero, login page with logo.
- SOS tiles now flip (front: name, then turn over one by one to show the emoji; mouse hover turns them
  back; no animation with "reduce motion"). `FlipTile.tsx` + `.flip` CSS in index.css. Tour button is a
  green round "?".
- **Role-based tabs** (user: "coordinator ko agencies tab nhi dikhna chahiye, user ko sirf help tab"):
  public sees only Report SOS + Staff login; coordinator only Coordinator; agency only its inbox. After
  sign-in each role lands on its own page (`lib/nav.ts`). Tour step 1 explains this (TOUR_VERSION 3).
- Onboarding: `docs/how-to-start.md` (setup, accounts, 3-minute demo script, pitfalls), `AGENTS.md`
  (rules for any AI agent), `CLAUDE.md` / `GEMINI.md` pointing to it, Claude skill `madaddesk-demo`.
- Install on phones: PNG icons (192, 512, maskable 512, apple-touch-icon 180) made from `icon.svg`
  (Android/iPhone don't use SVG icons for installing). Manifest + iPhone meta tags updated.
- Docs: phone install steps for Android + iPhone and the iPhone limits (notifications only from the
  home-screen app, silent switch mutes sound, no alerts in the background) → `docs/how-to-start.md` §6,
  test cases E21–E22. Demo tip: iPhone as reporter, siren screens on laptop/Android.
- Attribution via **taggie CLI** (`npm i -g taggie-cli`): "Crafted with ❤ by Maryam Saba for safer
  buildings", **only at the end of README.md** (owner didn't want it inside the app). It is a
  `<!-- taggie -->` block: change it with taggie, not by hand.
- SOS cards redone in the style of kokonutui's "Card Flip" (user's reference): white card with depth
  shadow → tap → springy 3D flip with a light sweep → red back with **Send SOS** / Cancel; small tilt
  toward the mouse. Built without shadcn/motion (60-line rule, bundle size). Trade-off: SOS is now two
  taps (prevents accidental sends). Tour + docs + tests updated (TOUR_VERSION 4).
- **Kokonut-style UI** (owner picked "own small versions"): reusable `HoldButton`, `ParticleButton`,
  `Loader`, `WaveText`, `Backdrop` (all ≤60 lines, CSS in `styles/effects.css`). Close/resolve now need
  press-and-hold (replaces the Yes/Cancel step); "On the way" bursts sparks; loading states use the
  rings; AI reading shows waving text; soft flowing-line background on every page.
- **Login page redone** ("bht dumb hy"): navy brand panel (what the control room is, each role's job,
  "In danger? Report an SOS →") + form card with demo-account chips (fill email only), show password,
  friendly error messages, busy state; signed-in view has "Open my desk". Logic in `useStaffLogin`.
- Phone-first header: ☰ hamburger on small screens (menu opens under the bar, closes after a pick),
  tab row on wide screens (`SiteHeader` + shared `NavItems`).
- Background lines: 14 lines instead of 4, stronger colour and longer dashes (were nearly invisible).
- GitHub social preview made (`docs/assets/social-preview.png`, 1280×640) and used as the README banner.
  Must be uploaded by hand in repo Settings → Social preview.
- Owner feedback "bg bht distracting, emojis too much AI": background is now calm and still (soft gradient,
  two blurred glows, faint dot grid). **All emojis replaced by lucide-react icons** (SOS cards, tabs, menu,
  tour, alerts, reporter splash, login, location, notices); data icons centralised in `lib/icons.ts`.
  Scan confirms 0 emojis left in `web/src`. TOUR_VERSION 5.
- **Agency globe** (owner's idea): navy banner at the top of the agency inbox with a grey dotted globe
  (cobe, WebGL, ~5 KB) and a red dot wherever a live request came from; it sways around that area.
  "Live" = waiting, or accepted in the last 3 hours (assignments stay "accepted" after a case closes).
  Assignments now store the reporter's GPS when sent (`location`), so the globe needs no extra reads.
  Stops moving with "reduce motion". Not yet seen in a browser (WebGL can't be checked from the terminal).
- Header shows a role name ("Coordinator", "Fire staff", "Police staff") instead of the email name.
- Pagination: coordinator incident list (6 per page) and agency requests (5 per page), via reusable
  `usePages` + `Pager`.
- Found: AI has failed on every report since the move to Firebase AI Logic (App Check). Logged in
  bug-fix (OPEN); console logging added to find the exact cause.
- Agency page now two columns like Aceternity's "GitHub globe" (owner's reference): left = globe panel
  (sticky on wide screens), right = requests; phones stack them. Built with cobe v2 **arcs** instead of
  three.js (~600 KB): a red arc flies from the agency's station (teal dot, demo building for now) to every
  live request, plus a legend. Globe settings moved to `lib/globe.ts`.
- **Offline SOS** (owner tested with Wi-Fi off): besides waiting on the phone and sending itself later,
  the report page now offers **Send by SMS** (pre-written SOS + location link, only mobile signal needed)
  and **Call 1122** when offline or after 5 s without delivery. SMS number via `VITE_SOS_SMS_NUMBER`.
- **Location prompt on open** (owner: "jb app open ho to prompt aye map enable kro"): report page shows
  "Turn on location so rescuers can find you" until location is allowed; the button triggers the phone's
  permission question and warms up GPS. If blocked, it explains how to allow it. Hidden once granted.
- README refreshed with the current app (how it works, features, offline fallback, layout, known AI
  issue) and a new `CONTRIBUTING.md` (setup, 60-line/DRY rules, trust rules, checks, docs, secrets).
- Opened 6 "good first issue" tickets on GitHub (#1–#6): manual field edit, more eval reports,
  remember "Not now" on the location banner, per-agency stations, offline SMS docs, accessibility pass.
- **AI cause found (15 Oct):** App Check holds the reCAPTCHA *secret* key instead of the site key, so every
  AI call is rejected. Owner replaces it with a new site key in the console (steps in bug-fix.md).
- Demo video script + shot list (2 min) in `docs/demo-video.md`.
- Demo video assembled with ffmpeg from the owner's recordings (1:42, 1080p, captions per step); file kept outside the repo (Downloads/mdadDesk-Demo/MadadDesk-demo.mp4).
- Submission deck filled from the AI Builder Cup template (14 slides; eval rerun 17 Oct: 92%, 0 invented, 0/20 failures). File kept outside the repo (Downloads).
- Demo video v2 (3:10): adds problem card, Google Cloud stack card and Firebase console tour (Hosting, Auth, Firestore collections; deploy email blurred). Rules need 3-4 min.
- README Known issues refreshed after the project review: AI works live now; listed what is still open (Cloud Run not deployed, no manual field edit (#1), no real-user test).
- Issue #5 closed: README, how-to-start and .env.example now say where the offline SMS goes (coordinator's phone, not the Desk) and what an empty number does.
- AI now reads any Asia-Pacific language (prompt, language field = ISO code; UI hint says Any language). Eval set grown to 30 (10 new: Hindi, Bengali, Bahasa x2, Tagalog, Thai, Vietnamese, Chinese, Japanese, Korean). Eval 18 Oct: 93.3% (140/150), 0 invented, 0/30 failures. Closes #2.
- Follow-up question now comes from the same Gemini call as the fields (one call instead of two); shown under What we understood on the report page. Eval 92.7%, 0 invented.

- 18 Oct (evening): GPS retry (rough position fallback) + "Try again" button after a tester's new phone sent an SOS without GPS. Rules allow a late GPS after verify.

## 2026-10-21
- #1 Coordinator can edit AI fields: "Edit details" on the incident (EditFields + lib/fieldDraft.ts), saves only changed fields, timeline shows "Edited: ...".
- #3 "Not now" on the location banner is remembered for 7 days (lib/snooze.ts, localStorage in try/catch).
- #4 Each agency has its own station (Agency.location, seed + live agency docs); the globe draws arcs from it, demo building as fallback.
- #6 Accessibility: dialogs named (Overlay label), contrast fixes (footer, tour counter, "?" button), SOS card keyboard flow (inert hidden face, focus to Send / back on Cancel, useFlip), pulse/bounce only for motion-safe. Lighthouse Accessibility: / 92 -> 100, /login 96 -> 100.
