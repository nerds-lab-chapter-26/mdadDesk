# Demo video (2 minutes): script and shot list

Goal: a judge understands the problem, sees the full help loop live, and remembers 3 things:
**one-tap SOS, humans verify (AI never dispatches), works without internet**.

## Before recording (10 minutes)
- **Laptop:** Chrome normal window = Coordinator **Desk**; Incognito (Ctrl+Shift+N) = Fire **Inbox**.
  Click once on the Inbox page (browsers only play the siren after one click). Zoom both to 110%.
- **Phone:** installed app, signed out, location allowed, Do Not Disturb on, battery/clock tidy.
- Close old incidents on the Desk so the list is clean. Turn sound on (the siren is part of the story).
- Record: laptop with **Win + Alt + R** (Xbox Game Bar) or OBS; phone with its built-in screen recorder.
  Edit both together in **Clipchamp** (free in Windows): phone clip small in a corner, or side by side.
- Voice: record the voiceover separately afterwards; it is easier than talking while clicking.

## Script (about 2:00)
| Time | On screen | Voiceover |
|---|---|---|
| 0:00–0:15 | Title card (social preview image), then a busy building photo | "When a fire starts in a market building, people send scattered messages: calls, WhatsApps, half sentences. Nobody knows who is verified or who is coming." |
| 0:15–0:30 | Phone: report page, location banner already off, tap **Fire** card, it flips, **Send** | "MadadDesk turns that into one clear picture. Anyone can send an SOS in one tap, no login. The location goes with it." |
| 0:30–0:40 | Phone: "SOS delivered" + live steps | "The reporter immediately sees it was delivered, and every step after that." |
| 0:40–1:00 | Laptop Desk: red screen + siren, open incident, map, fields | "The coordinator gets an alert with the location on the map. AI reads the message in English, Urdu or Roman Urdu. What wasn't said stays Unknown: it never guesses." |
| 1:00–1:15 | Tap **Verify**, then **Send help → Fire**; point at Ambulance "busy" | "A human verifies. AI never sends anyone. Then one tap sends the right agency; busy ones are greyed out." |
| 1:15–1:30 | Incognito Inbox: siren, globe arc, **On the way** | "The fire station sees the request with a route on the globe, and taps On the way." |
| 1:30–1:40 | Phone: green "Help is coming" screen | "And the person in danger sees help is coming. That's the whole loop, live." |
| 1:40–1:52 | Phone with Wi-Fi off: SOS → "Send by SMS" / "Call 1122 (free)" | "No internet? After five seconds it offers an SMS with the location already written, or a free call to 1122." |
| 1:52–2:00 | Desk: **Hold to confirm resolved**, timeline; end card with live link + GitHub | "Every step is on the timeline. Built free on Firebase and Gemini. MadadDesk: from a scattered SOS to help on the way." |

## Tips
- Show, don't explain menus. Cut every wait (loading, typing) in editing.
- Use a realistic message for the reporter, e.g. `2nd floor shop 24 ke paas dhuaan hai, hum 3 log hain`.
- If AI fields still show Unknown on the day, use an SOS card without text and say:
  "fields stay Unknown until someone says them". Don't fake filled fields.
- End card: https://mdaddeskv1-6af42.web.app and https://github.com/nerds-lab-chapter-26/mdadDesk.
- Never show a password or the `.env` files on screen.
