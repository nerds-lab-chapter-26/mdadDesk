# MadadDesk

![MadadDesk: from a scattered SOS to help on the way](docs/assets/social-preview.png)

From scattered distress messages to a verified emergency picture.
A building-emergency SOS app: a person in trouble sends an SOS, a coordinator verifies it and sends
Fire / Ambulance / Police, the agency taps "On the way", and the reporter sees every step live.

> Prototype for drills and demos only — not a deployed emergency service. In a real emergency call **1122**.
**Live demo:** https://mdaddeskv1-6af42.web.app (installable as an app on Android and iPhone).  
**Demo video:** https://youtu.be/pCWMN7QPfQo  
Staff demo logins are shared privately with judges and testers.

**New here?** Start with [docs/how-to-start.md](docs/how-to-start.md) (setup, accounts, demo script).
Want to help? Read [CONTRIBUTING.md](CONTRIBUTING.md). AI agents: see [AGENTS.md](AGENTS.md).

## How it works
1. **Reporter** (no login): opens the app, taps an SOS card (Fire, Medical, Trapped, …), flips it and
   sends. Location is asked for when the page opens, so the SOS carries GPS at once.
2. **AI** (Gemini) reads the free-text message (English / Urdu / Roman Urdu) and fills the incident
   card. Anything not said stays "Unknown"; AI never invents details and never dispatches.
3. **Coordinator** (Desk): sees new incidents on a map, verifies (or holds to close a false alarm),
   then sends the right agencies.
4. **Agency** (Inbox): a siren and a request appear next to a live globe; staff tap "On the way".
5. **Reporter** sees each step (Received → Verified → Help sent → On the way) and a green
   "Help is coming" screen.

## Features
- Role-based pages: public sees "Report SOS", coordinator sees "Desk", agency sees "Inbox"
  (enforced in the app and in `firestore.rules`).
- **No internet?** After 5 seconds without delivery the reporter gets "Send by SMS" (pre-written
  with location) and "Call 1122 (free)". The SMS goes to the coordinator's phone (`VITE_SOS_SMS_NUMBER`),
  not to the Desk: the coordinator reads it on that phone.
- Installable PWA, works on phones, guided tours on first visit, calm UI with lucide icons.
- If AI fails, the SOS is still delivered; fields simply show "Unknown" for the coordinator to confirm.
- Accuracy check: `npm run eval` scores the AI on 20 labeled reports (last run 92.6%, 0 invented values).

## Quick start (local)
```bash
npm install
cp web/.env.example web/.env     # Firebase web config (see docs/firebase-setup.md)
npm run dev                      # web on http://localhost:5173
```
Gemini runs through **Firebase AI Logic** (free Spark plan, protected by App Check), so no server is needed.
`api/` only holds scripts (eval, seed, checks): they read `api/.env` (see `api/.env.example`).

## Deploy
```bash
npm run build -w web && firebase deploy --only hosting,firestore:rules
```
The footer shows the build time (`Version … UTC`) so you can see which version a phone runs.
Test links, rollback and checks: **[docs/deployment.md](docs/deployment.md)**.

## Scripts
| Command | What |
|---|---|
| `npm run dev` | web app with reload |
| `npm run typecheck` | both workspaces |
| `npm run build -w web` | production build into `web/dist` |
| `npm run eval` | AI extraction accuracy on `data/synthetic-reports.json` |
| `npm run seed -w api` | demo accounts + agencies (needs `DEMO_PASSWORD` in `api/.env`) |
| `npm run check-firebase-ai -w api` | does Gemini answer through Firebase? |

## Project layout
```
web/      React PWA (pages, components, hooks, services = all Firestore writes)
shared/   types + AI prompts, schemas and fallback, used by web and api
api/      scripts only: eval, seed, checks
data/     labeled synthetic reports for the eval
docs/     product, structure, progress, bugs, testing, deployment
```
Details: [docs/core-structure.md](docs/core-structure.md).

## Docs
- [docs/how-to-start.md](docs/how-to-start.md) — run it, accounts, demo script, phone install
- [docs/prd.md](docs/prd.md) — scope, users, trust rules, no-internet roadmap
- [docs/core-structure.md](docs/core-structure.md) — folders, data model, code rules
- [docs/progress.md](docs/progress.md) — daily log
- [docs/bug-fix.md](docs/bug-fix.md) — bugs and fixes (newest on top)
- [docs/firebase-setup.md](docs/firebase-setup.md) — create the Firebase project
- [docs/deployment.md](docs/deployment.md) — put it online, test links
- [docs/testing-e2e.md](docs/testing-e2e.md) — step-by-step test checklist
- [docs/testing-user.md](docs/testing-user.md) — testing with real people
- [docs/demo-video.md](docs/demo-video.md) — 2-minute demo video script and shot list

## Stack
React 19 + TypeScript + Vite + Tailwind v4 (PWA) · Firebase Hosting, Firestore, Auth, App Check ·
Gemini via Firebase AI Logic · Leaflet + OpenStreetMap · cobe globe · lucide-react icons

## Known issues
- The `api/` service (Express, for Cloud Run) is ready but not deployed: the app runs on the free
  Spark plan, and Gemini is called through Firebase AI Logic instead. Cloud Run is the scale-up path.
- The coordinator cannot yet edit AI-filled fields by hand ([#1](https://github.com/Maryam593/mdadDesk/issues/1)).
- Tested by the team only; not yet with a real rescue service or building staff.

## Contributing
Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
[MIT](LICENSE) © 2026 Maryam Saba

<!-- taggie -->
Crafted with ❤ by Maryam Saba for secure life
<!-- /taggie -->
