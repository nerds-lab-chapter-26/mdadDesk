# Core structure

## Code rules
- **Beginner-readable.** A new teammate should understand any file in one read. Plain `for` loops
  and `if`s over clever one-liners, one property per line, short comments that explain *why*.
- **Every code file ≤ 60 lines.** Split before it grows.
- **No repetition.** Reuse a component, hook or service; never copy one.
- UI primitives live in `web/src/components/ui/`. Feature components never restyle raw HTML
  for things a primitive already does (buttons, cards, notices, badges, fields).
- One write path per entity (`services/*`). Pages never call Firestore directly.
- Shared types live only in `shared/src/` and are imported by both web (`@shared`) and api.

## Layout
```
shared/src/        types used by web + api (extraction, report, incident, agency, api)
  ai/              Gemini prompts, model list, JSON schemas, zod checks, model fallback + timeout
                   (one copy, used by web/src/lib/ai.ts and api/src/ai/gemini.ts)
api/               Express + Gemini key — now only for eval / local checks (web calls Gemini via Firebase)
  src/ai/          gemini.ts (Gemini with the secret key, for eval)
  src/routes/      aiRoute.ts (error → {ok:false} wrapper), extract.ts, clarify.ts
  src/auth.ts      Firebase ID-token check (REQUIRE_AUTH=true)
  scripts/         eval.ts (accuracy on data/), seed.ts (demo users + agencies),
                   check-ai.ts (models for the key), check-firebase-ai.ts (Gemini via Firebase AI Logic)
web/               React + Vite + Tailwind v4 + PWA (vite-plugin-pwa)
  src/lib/         firebase.ts (offline cache), ai.ts (Gemini via Firebase AI Logic, never throws), labels.ts
  src/services/    reports.ts, incidents.ts, events.ts, assignments.ts — all Firestore writes
                   newRecords.ts — starting data for a new report/incident
  src/hooks/       useCollection / useDoc (realtime), useIncidents, useReportSubmit, useOnline,
                   useAuthUser, useClaims (role + agencyId), useArrivals (new items since page load),
                   useStepChange (reporter step went up), useTour (seen once per device),
                   usePages (split any list into pages), useAccountLabel ("Coordinator", "Fire staff"),
                   useLocationPermission (granted / prompt / denied, live)
                   submitSteps.ts (deliver + readWithAi, used by useReportSubmit)
  src/lib/         helpSteps.ts (reporter status steps), myReports.ts (reports sent from this phone),
                   siren.ts / chime.ts (sounds made in code), systemNotify.ts (phone/PC notifications),
                   tours.ts (tour text; bump TOUR_VERSION in hooks/useTour.ts after editing),
                   geo.ts (phone GPS + Google Maps link), nav.ts (tabs per role + where each role lands)
  src/components/
    ui/            Button, ActionButton (busy + error), Card, Badge, Notice, TextField,
                   HoldButton (press-and-hold to confirm), ParticleButton (spark burst), Pager (Prev/Next),
                   Loader (rings + waving label), WaveText (rippling letters),
                   Overlay (full-screen layer: danger / good / neutral), tone.ts
    layout/        AppShell (frame), SiteHeader (row of tabs on wide screens, ☰ menu on phones),
                   NavItems (the tab pills, shared by both), SignOutButton (role name + Sign out), Logo (uses public/icon.svg), StatusBanners,
                   Backdrop (calm gradient + soft glows + faint dot grid, no movement),
                   RoleGate (right account or a clear message)
    coordinator/   CoordinatorDesk (alerts + map + list + detail)
    incident/      FieldGrid, EditFields (coordinator fixes AI fields; lib/fieldDraft.ts), StatusBadge, IncidentList, IncidentDetail, IncidentActions, DispatchPanel, CloseFalseAlarm (confirmed close), Timeline,
                   LocationLine (GPS ± metres + "Open in Google Maps")
    track/         LiveStatus (live card, on report page + /track), HelpProgress (checklist),
                   HelpSplash (green good-news screen + chime), MyReports (links on the report page)
    login/         LoginHero (navy brand panel), LoginForm (demo-account chips, show password)
    tour/          Tour (first-visit guide per page + "How it works" button; text in lib/tours.ts)
    agency/        AgencyInbox (requests for the signed-in agency), AssignmentCard (one request + "On the way"),
                   GlobePanel + RequestGlobe (grey cobe globe: red dot + arc from the agency's own station (agencies/{id}.location) per live request;
                   settings in lib/globe.ts)
    alert/         EmergencyAlert (red flashing screen + siren), NewSosAlert (coordinator),
                   NewRequestAlert (agency)
    report/        ReportForm (numbered steps), QuickTypeButtons + FlipTile (SOS cards), SubmitStatus,
                   OfflineFallback (no internet → Send by SMS / Call 1122; text from lib/sms.ts),
                   LocationPrompt (asks for location when the page opens, before any emergency)
    map/           IncidentMap (Leaflet + OpenStreetMap, no key), IncidentMarker (dot per incident),
                   MapFocus (flies to the selected incident)
  src/pages/       ReportPage, TrackPage (/track/:reportId), CoordinatorPage, AgencyPage, LoginPage
                   (pages stay thin: tour + RoleGate + the feature component)
data/              synthetic-reports.json (labelled test set)
firestore.rules    role-based access via custom claims {role, agencyId}
```

## Data model (Firestore)
| Collection | Key fields |
|---|---|
| `reports/{clientId}` | text, clientCreatedAt, receivedAt (server), aiStatus, extraction, incidentId |
| `incidents/{inc_<reportId>}` | status reported→verified→response→resolved, location fields, reportIds, notifiedAgencyIds, respondingKinds, lead/support agency |
| `incidents/{id}/events` | append-only timeline (kind, message, actorUid, at) |
| `agencies/{id}` | name, kind, available, availabilityUpdatedAt |
| `assignments/{incidentId_agencyId}` | agencyKind, agencyName, location (reporter GPS at send time), role lead/support, status notified/accepted/declined/busy |

## Key flows
- **Report:** tap a type button → save report + incident first (delivery), then in parallel: GPS
  (`attachLocation`, up to 10 s) and Gemini (enrichment). Neither can block delivery.
  GPS gives the street, not the floor: floor / shop still come from the message.
- **Offline:** Firestore persistent cache queues writes in IndexedDB; the service worker serves the app shell.
- **Help loop:** coordinator Verify → `sendAgency` (assignment + `notifiedAgencyIds`) → agency
  `markOnTheWay` (assignment accepted, incident `response` + `respondingKinds`) → coordinator Resolved.
  The reporter's `/track` page reads only the incident doc and turns it into a step (`lib/helpSteps.ts`).
- **Who can read an incident:** anyone with its id (`get`), since the id is a random code only the
  reporter's phone and assigned agencies have. Listing all incidents is coordinator-only.
- **Alerts:** `useArrivals` remembers what was on screen when the page loaded; anything newer that
  still needs action raises `EmergencyAlert` (red screen, siren, system notification if the tab is
  hidden). It closes by itself once handled (verified / "On the way"). Works only while the page is
  open (no push server on the free plan).
- **Status change:** `services/incidents.changeIncident` updates the incident and appends a timeline event in one batch.

## Who sees what (role-based)
| Signed in as | Tabs | After login |
|---|---|---|
| nobody (public) | Report SOS + Staff login | — |
| coordinator | Desk (+ role name + Sign out) | /coordinator |
| agency | Inbox (+ role name + Sign out) | /agency |
Tabs are only convenience: the real protection is `firestore.rules` + `RoleGate`.

## Look and feel
- **Icons, not emojis:** lucide-react. Data icons (incident types, agencies, "answer" icons, reporter
  steps) live only in `web/src/lib/icons.ts`; UI icons are imported where used. `Notice` takes an `icon`.
- Colours in `web/src/index.css` (`@theme`): brand teal (normal actions), danger red (SOS), ink navy (header).
- Font: Plus Jakarta Sans (Google Fonts; falls back to the system font offline).
- GitHub social preview + README banner: `docs/assets/social-preview.svg` → `.png` (1280×640). Upload the
  PNG in GitHub → Settings → General → Social preview (GitHub has no API for it).
- Logo = `web/public/icon.svg` (pin + help cross + signal waves). Phone install icons are PNG copies
  (`icon-192/512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`): re-make them if the logo changes.
- SOS cards (FlipTile + `.flip` CSS, `useTilt`, `useFlip` for keyboard focus): tap → springy flip with a light sweep → "Send SOS" / Cancel
  on the back (style of kokonutui "card flip", rebuilt small without extra libraries).

- Credit line is only in README.md (`<!-- taggie -->` block, managed by the taggie CLI), not in the app.

- Animations live in `web/src/styles/effects.css` (wave, rings, hold fill, sparks; dot grid);
  all switch off with "reduce motion". Inspired by Kokonut UI but rebuilt small (owner chose this over
  installing the 150–230-line originals + motion/shadcn).
- Where they are used: HoldButton → "Hold to confirm resolved", "Hold to close without sending help";
  ParticleButton → agency "On the way"; Loader → every loading state; WaveText → "Reading your report…".

- Footer shows "Version <build time UTC>" (`__BUILD_TIME__` from vite.config.ts) to check which version a phone runs.

## Decisions
- Map: Leaflet + OpenStreetMap instead of Google Maps (no billing). One demo building in
  `web/src/lib/building.ts`; incidents without their own location show there, nudged ~3 m apart.
  Coloured circles instead of image pins (Leaflet's default pin images break with Vite).
- shadcn/ui dropped: its generated files break the 60-line rule; own primitives instead.
- Web writes Firestore directly (realtime + offline).
- AI moved from our API to **Firebase AI Logic** (Gemini Developer API, free on Spark, 14 Oct): GCP billing
  failed, so no Cloud Run / Cloud Functions. Firebase holds the Gemini key; the whole app is just Hosting.
  Prompts and schemas moved to `shared/src/ai/` so the eval (api) and the app use the same ones.
