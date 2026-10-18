# Bug-fix log

Add newest entries at the top. Format:

```
## YYYY-MM-DD — short title
**Symptom:** what went wrong (exact error if any)
**Cause:** root cause
**Fix:** what changed (files)
**Check:** how it was verified
```

---
## 2026-10-18 — Follow-up question not shown on the report page
**Symptom:** after a Japanese SOS with no building name, "What we understood" showed the fields but no follow-up question.
**Cause:** the question came from a second Gemini call (clarify). In the browser it failed quietly (likely free-tier quota or timeout right after the first call), and the failure was not shown or logged.
**Fix:** the extract call now also returns `question` (prompt rule + schema + `Extraction.question`), so one Gemini answer carries fields and follow-up. Removed the separate web clarify call (`web/src/lib/ai.ts`, `hooks/submitSteps.ts`).
**Check:** direct test: Japanese report without building -> 「どこのビルですか？」, Roman Urdu -> "Konsi building mein aag lagi hai?", full English report -> null. `npm run eval`: 92.7% (139/150), 0 invented, 0/30 failures.


## 2026-10-14 — Location banner flashed and vanished
**Symptom:** on a phone where location was already allowed, the "Turn on location" banner appeared for a
moment and disappeared.
**Cause:** the hook started as "unknown" (banner shown) and only then learned from the browser that location
was "granted" (banner hidden).
**Fix:** new "checking" state in `useLocationPermission.ts`; `LocationPrompt` shows nothing until the answer
is known, so the banner only appears when location really is off.
**Check:** typecheck + build + deployed; phone check by user.
**Follow-up:** still flashed on the phone. Most likely the installed app first shows the OLD saved version
(with the flash), then the auto-update reloads into the new one. Added the build time to the footer
("Version 2026-10-14 18:xx UTC") so we can see which version a phone is running.

## 2026-10-14 — Phone with Wi-Fi off: "SOS was not sent"
**What happened:** with no internet the SOS cannot reach the server (no app can). The app did what it was
built for: saved it on the phone ("SOS pending") to send automatically when internet returns. But in an
emergency waiting is not enough, and the screen didn't offer anything else.
**Fix:** `OfflineFallback.tsx` (shown when offline, or after 5 s without delivery = Wi-Fi without internet):
**Send by SMS** (opens the SMS app with the SOS + Google Maps link already written; needs only mobile
signal; number = `VITE_SOS_SMS_NUMBER`, optional) and **Call 1122**. Text built in `lib/sms.ts`.
**Check:** typecheck + build + deployed; phone test by user (testing-e2e E11b).
**Follow-up:** "what if there is no balance?" → SMS needs balance, but 1122 / 15 / 16 are toll-free and work
without balance. The call button now says "Call 1122 (free)" and the note explains it.

## 2026-10-14 — Header showed "Coordinator" twice (tab + account pill)
**Symptom:** signed in as coordinator, the header had a "Coordinator" tab and a "coordinator" pill side by side.
**Cause:** the account was shown as a second nav link (to /login) labelled with the role/email, next to a tab
named after the same role.
**Fix:** tabs renamed to **Desk** (coordinator) and **Inbox** (agency) in `lib/nav.ts`; the account link was
replaced by `SignOutButton.tsx`: small grey role name ("Fire staff") + a **Sign out** button that signs out
directly and goes to the report page. Signed out, the header shows "Staff login" instead.
**Check:** typecheck + build + deployed; browser check by user (testing-e2e E17).

## 2026-10-14 — Every report shows Building / Floor / Landmark "Unknown" (AI never ran) — FIX DEPLOYED, phone check pending
**Symptom:** "Fire at first floor of alfatah, sargodha" → all fields Unknown. Not related to the map.
**Found (Firestore):** every report since the move to Firebase AI Logic has `aiStatus: "failed"`, `extraction: null`.
**Likely cause:** App Check gives no valid token, so AI Logic answers 401 "App Check token is invalid". The
reCAPTCHA key in use was created on the classic reCAPTCHA (v3) site, while the app uses the Enterprise
provider; App Check accepted the key in the console, but tokens may not be issued for it.
**Tried from the terminal:** minting an App Check token with firebase-admin needs the IAM Credentials API
(disabled); listing reCAPTCHA Enterprise keys → PERMISSION_DENIED for the service account. So the exact
browser error is still needed.
**Next:** F12 → Console → "[ai] failed: …" message (logging added in `submitSteps.ts`). If it is App Check:
create a real reCAPTCHA Enterprise key in Google Cloud console (Security → reCAPTCHA) and register that.
The SOS itself is always delivered; only the automatic reading is missing.
**Real cause (15 Oct):** read the App Check config with the service account: the key saved in App Check
(reCAPTCHA Enterprise provider) is NOT a site key. Google's reCAPTCHA answers "Invalid site key" for it,
so it is almost surely the **secret key** of the classic pair (site and secret keys start with the same
letters). The app sends tokens made with the real site key, App Check checks them against the wrong key,
and rejects every AI call. App Check is ENFORCED only for AI Logic (`firebaseml`), not Firestore/Auth,
which is why only AI broke.
**Mistake on the way:** `web/.env` was briefly switched to that key and deployed (~1 h), then switched back
to the real site key and redeployed. The key was never committed. Treat it as exposed: replace it.
**Fix (owner, console):** Google Cloud console → Security → reCAPTCHA → Create key (Website, score-based,
domains `mdaddeskv1-6af42.web.app`, `mdaddeskv1-6af42.firebaseapp.com`, `localhost`) → copy its **key ID**
→ Firebase App Check → Apps → reCAPTCHA Enterprise → paste → Save; put the same ID in `web/.env`, rebuild,
deploy. Changing App Check from the terminal was blocked (security setting), so the owner does it.
**Done (18 Oct):** at the owner's request the App Check Enterprise site key was set back to the real public
site key (the one in `web/.env`) via the App Check API. **Check:** send an SOS on the live site → Firestore
`aiStatus: "ok"` and filled fields.
**Tip:** App Check needs the SITE key (key ID), never the secret key. Compare the whole key.

## 2026-10-14 — Install option missing on a Realme phone (Samsung fine) → just needed a short wait
**Symptom:** on Android Chrome (Realme) no install popup / install did nothing; on Samsung it installed.
**Checked:** live site has manifest, PNG icons 192/512 + maskable, service worker registered, HTTPS → installable.
**Likely cause:** Realme/Oppo/Xiaomi block "create home-screen shortcuts" for Chrome by default; Chrome also
shows install only in the ⋮ menu, not always as a popup.
**Real cause:** nothing was broken: Chrome shows "Install" only after the page has loaded for a little while
(service worker has to finish installing on the first visit).
**Fix:** none needed in code. Docs say: open the link, wait ~15–20 s, then ⋮ → Install app.
**Check:** ✅ installed on Realme after waiting (user, 14 Oct).

## 2026-10-14 — Clicking Verify closed the case ("Close: no help needed")
**Symptom:** after tapping Verify, the case ended up resolved without anyone being sent.
**Cause (from the timeline):** collapse case verified 8:33:28, resolved 8:33:35. After Verify, the
"Close: no help needed" button appeared in exactly the same spot as Verify, so the next click / double
click closed the case. (The earlier fix only renamed and greyed that button.)
**Fix:** no top button while `verified` (`IncidentActions.tsx`); new `CloseFalseAlarm.tsx`: a small link
at the bottom, "Not an emergency? Close without sending help", that asks "Yes, close it / Cancel" first,
and disappears once help was sent.
**Check:** typecheck + build + deployed; browser check by user (testing-e2e E20).

## 2026-10-14 — RBAC: every user saw every tab (Report, Coordinator, Agency)
**Symptom:** the public saw Coordinator and Agency tabs; the coordinator saw the Agency tab; agencies saw
the Coordinator tab. Confusing, and it suggested people could do jobs that aren't theirs.
**Cause:** the header had one fixed list of tabs for everyone; roles were only checked inside the pages
(`RoleGate`) and in `firestore.rules`.
**Fix:** `web/src/lib/nav.ts` → `tabsFor(role)`: public = Report SOS + Staff login, coordinator = Coordinator,
agency = Agency inbox. `AppShell.tsx` uses it. `LoginPage.tsx` sends each role to its own page after
sign-in (`homeFor`). Tour step 1 rewritten (TOUR_VERSION 3).
**Note:** hiding tabs is convenience only; data stays protected by `firestore.rules` + `RoleGate`.
**Check:** typecheck + build + deployed; browser check by user (testing-e2e E17–E19).

## 2026-10-14 — Agency inbox empty after Verify: incident was closed instead of sent
**Symptom:** coordinator verified a fire SOS, fire-saddar's inbox stayed empty.
**Cause (from Firestore):** the incident went verified → resolved with `notifiedAgencyIds: []` and 0 assignments.
After Verify, the same top-right spot showed "Close as resolved", which looked like the next step; the real
next step ("Send help") sat lower in the card.
**Fix:** `IncidentActions.tsx`: after Verify the top button is grey "Close: no help needed".
`DispatchPanel.tsx`: red box "👇 Next: send help" with red buttons until help is sent, placed right under
the summary (`IncidentDetail.tsx`).
**Check:** typecheck + build; browser check by user.

## 2026-10-14 — Coordinator tab: "Missing or insufficient permissions"
**Symptom:** after signing in as fire-saddar in a second tab, the coordinator tab showed the raw Firebase error.
**Cause:** not a bug in the rules: all tabs of one browser share one login, so the coordinator tab became
fire-saddar, which may not list all incidents.
**Fix:** `components/layout/RoleGate.tsx` on the coordinator and agency pages: shows who is signed in, which
account the page needs, and the Incognito tip. Page bodies moved to `CoordinatorDesk` / `AgencyInbox`.
The agency alert now waits for `agencyId` before arming (else old requests would ring on load).
**Follow-up (same day):** the user still saw the message because the *normal* window kept the earlier
fire-saddar login (header showed "👤 fire-saddar"). Added a **Switch account** button to RoleGate
(signs out and opens /login) and the message now says "This window is signed in as…".
**Check:** typecheck + build; browser check by user.

## 2026-10-14 — Demo password was in the code before making the repo public
**Risk:** `seed.ts` had the default password; a public repo would let anyone log in as coordinator and see
reports, including testers' GPS locations.
**Fix:** password only in `api/.env` (`DEMO_PASSWORD`, gitignored); seed now refuses to run without it and
resets existing accounts to it. Rotated the password, so the old one in git history no longer works.

## 2026-10-14 — Map showed only the resolved dot; other reports from the same house were hidden
**Symptom:** 3 incidents in the list, but on the map only one green (resolved) dot.
**Cause:** all 3 came from the same house, so the same GPS point; real-GPS dots were not nudged, and the
resolved one was drawn last, on top.
**Fix:** `IncidentMap.tsx` draws resolved first and reported last (open ones on top); `IncidentMarker.tsx`
nudges every dot ~6 m apart and makes resolved dots smaller and faded.
**Check:** typecheck; user to confirm in the browser.

## 2026-10-14 — Firebase AI Logic: "401 Firebase App Check token is invalid"
**Symptom:** `npm run check-firebase-ai -w api` → 401 for every model.
**Cause:** App Check enforcement got turned on for Firebase AI Logic during setup; our app sends no App Check token.
**Cause (corrected):** AI Logic shows "Basic - Enforced" with no Unenforce option; App Check becomes mandatory
for AI Logic on 2 Nov 2026 anyway.
**Fix:** App Check with reCAPTCHA Enterprise ("Fraud Defense"): `web/src/lib/appCheck.ts`,
`VITE_RECAPTCHA_SITE_KEY`, setup in `docs/firebase-setup.md` step 9. First tried classic reCAPTCHA v3:
the console now marks it deprecated and points to Fraud Defense.
**Check:** pending, browser test after step 9.

## 2026-10-14 — Eval after moving to JSON Schema: 3/20 timeouts
**Symptom:** `npm run eval`: 90.6% accuracy, 0 invented, but 3 "AI timeout" (before: 0 failures).
**Cause:** not known yet; likely Gemini load at that moment (both models timed out on the same reports).
**Check:** rerun later; if it repeats, raise the 15 s timeout or compare with the old `responseSchema`.
**Rerun (same day):** 92.6% (88/95), 0 invented, 1/20 timeout → it was Gemini load, not the schema.

## 2026-10-14 — Old requests would set off the alarm when a page opens (caught before release)
**Symptom (found in review):** the agency page first asks "who am I?", then loads the inbox. In between,
`useCollection` said "done loading, 0 items", so every existing request looked *new* a moment later → siren.
**Cause:** `loading` was only true on the very first load, not when the path/query changed.
**Fix:** `web/src/hooks/useCollection.ts` remembers which query its data belongs to; `loading` stays
true until data for the current query arrives. `useArrivals` only starts watching after that.
**Check:** typecheck + build. Browser check pending (testing-e2e E3, E7).

## 2026-10-14 — `npm install firebase` in the root folder
**Symptom:** root `package.json` got a `firebase` dependency (copied from the Firebase console's SDK step).
**Cause:** the console tells you to install the SDK; this project already has it in `web/`.
**Fix:** reverted root `package.json` / lock. Skip the console's "npm install" step.

## 2026-10-13 — Gemini: model 404, then 503/429 on every report
**Symptom:** `gemini-2.5-flash` → 404 "no longer available to new users". After switching to
`gemini-3.8-flash`: eval 20/20 failed with 503 "high demand", 429 "free tier limit: 5 per minute", and timeouts.
**Cause:** 2.5 models are closed to new accounts. 3.8-flash is overloaded, has a tiny free quota, and "thinks" slowly.
**Fix:** default models `gemini-3.5-flash-lite,gemini-3.1-flash-lite` (second one is a backup, tried
automatically in `api/src/ai/gemini.ts`); `thinkingLevel: LOW`; eval waits 5 s between reports.
Added `npm run check-ai -w api` to list the models a key can use.
**Check:** eval 0/20 failures, 93% field accuracy, 0 invented values.
**Note:** AI Studio keys now start with `AQ.` — they work with the `@google/genai` SDK.

## 2026-10-13 — Eval invented "Plaza" as a building and "trapped" from a worried message
**Fix:** prompt rules in `api/src/ai/prompts.ts`: generic words are not building names; type only when stated;
landmarks in short English; basement = "B". Invented values 2 → 0.

## 2026-10-13 — API looked dead right after start
**Symptom:** `Invoke-RestMethod http://localhost:8080/health` → "Unable to connect" 2 s after `node dist/index.js`.
**Cause:** not a bug. Cold start (loading firebase-admin + @google/genai) takes more than 2 s on this machine.
**Fix:** none; wait for the `[api] listening on :8080` log before testing.
**Check:** `/health` → `{"ok":true,...}` once the log line appears.
