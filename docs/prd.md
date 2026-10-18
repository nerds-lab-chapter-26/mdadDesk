# MadadDesk — Product Requirements (hackathon MVP)

**Theme:** Sustainability & Social Impact
**Deadline:** 18 Oct 2026 · **Source proposal:** `MadadDesk_Initial_Proposal.pdf`

## Problem
During a building emergency, a coordinator gets overlapping, incomplete, multilingual messages
(English / Urdu / Roman Urdu, and other Asia-Pacific languages since 18 Oct). Floor, shop and people counts are often missing, duplicates and
contradictions pile up, and nobody has a shared view of who owns which task.

## Users
| User | Needs |
|---|---|
| Occupant / reporter | Send an SOS fast, in any language, and know whether it was delivered |
| Building coordinator | One verified incident picture; assign agencies; full history |
| Agency (fire / ambulance / police) | See verified incidents, accept / decline / mark busy |

## MVP: the help loop (build this first, nothing else until it works)
The one thing the MVP must prove: **someone reports, and help reaches them — and they can see it coming.**

| # | Who | What happens | Reporter sees |
|---|---|---|---|
| 0 | Reporter, no internet | SOS waits on the phone and sends itself later; meanwhile **Send by SMS** / **Call 1122** (need only mobile signal) | "No internet: send it another way" |
| 1 | Reporter | Taps a card (🔥 Fire, 🚑 Medical, 🆘 Trapped…), it flips, then **Send SOS** (two taps so pockets/children can't send by accident), optionally after typing details. Phone GPS is attached automatically if allowed | "Sent — waiting for coordinator" + "📍 Location shared" |
| 2 | Coordinator | Sees it instantly on the list and map; taps **Verify** | "Seen and confirmed" |
| 3 | Coordinator | Taps **Send Fire / Ambulance / Police** | "Help requested" |
| 4 | Agency | Sees it in their inbox; taps **On the way** | "Fire service on the way" |
| 5 | Coordinator | Taps **Resolved** after the team confirms | "Closed" |

The reporter keeps a live status page for their report (link stays on their phone, works after reload).
AI extraction stays in (already working) but is not required for the loop: a report without AI still flows.

**After the loop works**, in this order: follow-up question reply, field editing, related-report flag,
busy/decline + escalation, lead vs support agencies.

**Reporter good news (14 Oct):** each step shows a green splash with a chime and an emoji of who is coming
plus the "opposite" of the danger (fire → 🚒🧯💧). **Tour:** first-visit guide on every page.

**Alerts (added 14 Oct):** a new SOS (coordinator) or help request (agency) turns the screen red
with a siren, plus a phone/PC notification when the tab is in the background. Only while the app is
open; real push notifications (app closed) stay on the roadmap.

## Full scope (from the proposal)
1. Text SOS intake with a stable report ID; delivery state is shown honestly (pending / sent / failed).
2. Gemini extraction: incident type, building, floor, landmark, people, help requested. **Unstated = Unknown.**
3. Clarification question drafted for missing fields.
4. Coordinator dashboard (realtime), editable fields, verify → map marker.
5. "Possibly related" flag (rule: same building + floor/landmark within 15 min). Coordinator decides.
6. Three seeded agencies: accept / decline / busy; coordinator picks lead + support.
7. Timeline of every status change.
8. AI failure → manual fields still work.
9. **PWA**: installable; app opens offline; reports queue offline and sync when online.

## Out of scope (roadmap slide)
Push notifications (FCM), geohash agency matching, nearby public alerts,
history/analytics layers, volunteers, hardware SOS buttons, real agency integration.

## Reaching help with no internet / no balance
**Today (built):**
| Situation | What works |
|---|---|
| Internet | SOS + GPS in the app, instantly |
| Signal, no internet | **Call 1122 / 15 / 16** (toll-free, no balance needed); **Send by SMS** (pre-written SOS + location; needs balance) |
| Nothing | SOS waits on the phone and sends itself as soon as any internet appears |

**Roadmap (needs a native app or a mobile-operator partner):**
1. **Bluetooth mesh** (native Android/iOS app, like Bridgefy): the SOS hops phone-to-phone over Bluetooth until
   one phone has internet. Web apps can't do this (Web Bluetooth can't link two phones, isn't on iPhone,
   and can't run in the background).
2. **Free SOS short code** with operators (Jazz, Zong, Telenor, Ufone) / PTA: an SMS to e.g. `1122x` that
   costs nothing, so it works with zero balance.
3. **USSD menu** (e.g. dial `*1122#`): works on any phone, even without data or a smartphone; operator integration.
4. **Zero-rated app**: operators let MadadDesk work without data balance (like "free Facebook").
5. **Satellite SOS** on phones that support it, for when there is no network at all.

## Trust rules (non-negotiable)
- AI never invents facts and never dispatches. Humans verify, assign and close.
- Every incident links back to its original report text.
- Offline ≠ delivered. The UI never shows "sent" before the backend acknowledges.
- Reporter identity is visible only to coordinators.

## Success targets (on 20 synthetic reports, `npm run eval`)
- ≥ 90% correct extraction of stated fields
- 0 invented locations or people counts

## Demo script (3 min)
Roman Urdu report → extracted card with unknowns → clarification → related-report flag →
verify → marker on map → agencies notified, one busy → lead + support assigned → update →
show AI failure falling back to manual entry.
