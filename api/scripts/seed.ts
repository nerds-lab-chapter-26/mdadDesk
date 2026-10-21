// Creates demo accounts (with role claims) and the three simulated agencies.
// Needs in api/.env: GOOGLE_APPLICATION_CREDENTIALS=service-account.json and GOOGLE_CLOUD_PROJECT=<id>.
// See docs/firebase-setup.md step 7.
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import type { Agency } from "../../shared/src";

initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT });
// The password lives only in api/.env (never in the repo, which is public).
const PASSWORD = process.env.DEMO_PASSWORD;
if (!PASSWORD) throw new Error("Set DEMO_PASSWORD in api/.env first");

// Station locations are made up, a short drive from the demo building (web/src/lib/building.ts).
const AGENCIES: Array<Omit<Agency, "availabilityUpdatedAt">> = [
  { id: "fire-saddar", name: "Saddar Fire Station", kind: "fire", available: true, location: { lat: 24.8611, lng: 67.0219 } },
  { id: "ambulance-1", name: "City Ambulance Service", kind: "ambulance", available: false, location: { lat: 24.848, lng: 67.033 } },
  { id: "police-saddar", name: "Saddar Police", kind: "police", available: true, location: { lat: 24.8627, lng: 67.035 } },
];

const USERS = [
  { email: "coordinator@madaddesk.demo", claims: { role: "coordinator" } },
  ...AGENCIES.map((a) => ({ email: `${a.id}@madaddesk.demo`, claims: { role: "agency", agencyId: a.id } })),
];

async function upsertUser(email: string, claims: object) {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email).catch(() => auth.createUser({ email, password: PASSWORD }));
  await auth.updateUser(user.uid, { password: PASSWORD }); // existing accounts get the current password too
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`user  ${email}  ${JSON.stringify(claims)}`);
}

const db = getFirestore();
for (const a of AGENCIES) {
  const agency: Agency = { ...a, availabilityUpdatedAt: Date.now() };
  await db.doc(`agencies/${a.id}`).set(agency);
  console.log(`agency ${a.id}`);
}
for (const u of USERS) await upsertUser(u.email, u.claims);
console.log(`\nAll demo passwords: ${PASSWORD}`);
