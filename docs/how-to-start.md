# How to start (and how to give the demo)

For anyone new to MadadDesk, human or AI agent. Read this first, then the other docs as needed.

**Live app:** https://mdaddeskv1-6af42.web.app · **Code:** https://github.com/Maryam593/mdadDesk

## 1. What it is, in one minute
Someone in a building emergency taps a card (🔥 Fire, 🚑 Medical…), it flips, they tap Send SOS. Their SOS + phone location
reach the building's **coordinator**, who checks it, taps **Verify**, then **sends** Fire / Ambulance /
Police. The **agency** gets a red alert and taps **On the way**. The reporter sees every step on a green screen.
Gemini (AI) only reads the message (floor, shop, people); **humans decide and dispatch**.

| Role | Login? | Sees |
|---|---|---|
| Reporter (public) | No | 🆘 Report SOS |
| Coordinator | Yes | 🧭 Coordinator desk (list, map, Verify, Send help, Resolve) |
| Agency (fire / police / ambulance) | Yes | 🚒 Its own inbox only |

## 2. Run it on your PC
```
git clone https://github.com/Maryam593/mdadDesk.git
cd mdadDesk
npm install
```
Get from the project owner (never commit them): `web/.env` (Firebase web config + reCAPTCHA site key)
and, only for scripts, `api/.env` + `api/service-account.json`. Templates: `web/.env.example`, `api/.env.example`.
```
npm run dev        → http://localhost:5173
```
The Firebase project (`mdaddeskv1-6af42`) already exists. To build a new one: `docs/firebase-setup.md`.

## 3. Demo accounts
| Who | Email |
|---|---|
| Coordinator | `coordinator@madaddesk.demo` |
| Fire | `fire-saddar@madaddesk.demo` |
| Police | `police-saddar@madaddesk.demo` |
| Ambulance (busy on purpose) | `ambulance-1@madaddesk.demo` |

One password for all: `DEMO_PASSWORD` in `api/.env` (ask the owner; never post it publicly).
Change it: edit `api/.env`, run `npm run seed -w api`.

## 4. Give the demo (about 3 minutes)
Use **two windows**: one browser window logs in as ONE person for all its tabs.

| Window | Signed in as |
|---|---|
| Normal (+ a phone for the reporter, if you have one) | coordinator |
| Incognito (Ctrl+Shift+N) | fire-saddar |

1. **Before you start:** open the Agency inbox (Incognito) and click once anywhere on it
   (browsers only play the siren after one click). Open the Coordinator desk (normal window).
2. **Reporter** (phone or a new normal tab, signed out view): type details, e.g.
   `TEST 2nd floor shop 24 ke paas dhuaan hai, hum 3 log hain` → tap the **Smoke** card → it flips →
   **Send 💨 SOS** → allow location.
   Show: "SOS delivered", "📍 Location shared", "What we understood" (Unknown = not said, never guessed).
3. **Coordinator:** red screen + siren "NEW SOS" → **Open incident** → **Verify**.
   Reporter gets a green "✅ Seen and confirmed".
4. In the red box "👇 Next: send help" → **Send Saddar Fire Station**. Point out Ambulance is "(busy)".
5. **Agency (Incognito):** red screen + siren "HELP REQUESTED" → **On the way**.
   Reporter gets "🚒🧯💧 Fire service on the way".
6. **Coordinator:** press and **hold** "Hold to confirm resolved" → reporter sees "💚 Closed". Show the timeline.
7. Talking points: one-tap SOS works offline (sends when back online); AI never dispatches; each role
   sees only its own job; free stack (Firebase Spark + Gemini via Firebase AI Logic + OpenStreetMap).

## 5. Things that trip people up
| You see | Why / fix |
|---|---|
| "This window is signed in as …" | Wrong account in this window. **Switch account**, or use Incognito for the second person. |
| Agency inbox empty | Normal: requests arrive only after the coordinator Verifies **and** taps Send. |
| No siren | Click once on the page first; check the volume. Alerts only for things that arrive after the page opened. |
| "Automatic reading unavailable" | AI busy / App Check. The SOS is still delivered; see `docs/bug-fix.md`. |
| Location ±100 m on a laptop | Laptops guess from Wi-Fi; phones are much more precise. |
| Tour keeps showing / want to see it again | Green **?** button bottom-right. |

## 6. Install on a phone (it's a PWA)
**Android (Chrome):** open the live link and **wait 15–20 seconds** on the first visit (the app sets itself up),
then the "Install app" popup, or menu ⋮ → **Install app / Add to Home screen**.
**iPhone:** open the link in **Safari** → Share (⬆️ box) → **Add to Home Screen** → Add.
(iOS 16.4+ also allows it from Chrome's Share menu; Safari works on every iPhone.) Always open it from the icon.

**Realme / Oppo / Xiaomi:** if "Install" does nothing, the phone is blocking home-screen icons for Chrome:
Settings → Apps → Chrome → Permissions / Other permissions → **Create desktop shortcuts** (or "Home screen
shortcuts") → Allow. Also update Chrome. Developer mode is not needed. (Tested 14 Oct: Samsung ✅, Realme ✅ after the short wait.)

After installing: red MadadDesk icon, opens without the address bar, opens offline, an SOS sent offline
is sent automatically when back online, and updates arrive by themselves on the next launch.

| On iPhone | Works? |
|---|---|
| SOS tiles, location, green "help on the way" screens | ✅ |
| Opening without internet | ✅ |
| Notifications ("Allow notifications?") | ⚠️ only when opened from the **home-screen icon**, not in a Safari tab |
| Siren / chime sound | ⚠️ muted if the side **silent switch** is on; also needs one tap on the screen |
| Alerts while the app is closed or in the background | ❌ iPhone pauses web apps in the background (true push is on the roadmap) |

**Demo tip:** use an iPhone as the **reporter**. Keep coordinator and agency (the siren screens) on a laptop
or Android, with the silent switch off. These limits come from Apple's rules for web apps; not yet tested
on a real iPhone (14 Oct).

**No internet on the reporter's phone:** a red box offers **Send by SMS** (goes to `VITE_SOS_SMS_NUMBER`
in `web/.env`, the coordinator's phone; set for the demo on 14 Oct) and **Call 1122**. After changing the
number: build + deploy again. The SMS does **not** appear on the Desk; the coordinator reads it on that
phone and can create the case by hand. If the number is empty, the SMS app opens with the message
written and the reporter chooses who to send it to.

## 7. Change and deploy
- Code rules (≤60 lines per file, no repetition, beginner-readable): `docs/core-structure.md`.
- Deploy: `npm run build -w web` then `firebase deploy --only hosting` (details `docs/deployment.md`).
- After every change: log bugs in `docs/bug-fix.md`, progress in `docs/progress.md`, then commit + push.

## 8. Where everything is
| Doc | For |
|---|---|
| `docs/prd.md` | What we build and why, trust rules |
| `docs/core-structure.md` | Folders, data model, code rules, who sees what |
| `docs/firebase-setup.md` | New Firebase project from zero |
| `docs/deployment.md` | Going live, test links |
| `docs/testing-e2e.md` / `docs/testing-user.md` | Test checklists |
| `docs/bug-fix.md` / `docs/progress.md` | What broke and how it was fixed / daily log |
| `AGENTS.md` | Instructions for AI coding agents (Claude reads `CLAUDE.md`, Gemini/Antigravity `GEMINI.md`, both point here) |
