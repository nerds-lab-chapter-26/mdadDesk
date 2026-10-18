import {
  BadgeCheck, CircleCheck, Compass, Hourglass, LogIn, Map, MapPin, PenLine, Repeat, Siren, Truck,
  type LucideIcon,
} from "lucide-react";

// Short "how it works" guides shown the first time someone opens each page.
// Edit the text here; the Tour component shows it.

export interface TourStep {
  icon: LucideIcon;
  title: string;
  text: string;
}

export type TourId = "report" | "coordinator" | "agency";

// First step of every tour: what each tab at the top is for.
const TABS: TourStep = {
  icon: Compass,
  title: "Everyone sees only their own job",
  text: "Public: only Report SOS. The coordinator (building safety person) signs in and sees the Coordinator "
    + "desk. Fire, Ambulance and Police sign in and see only their inbox. Staff use Staff login at the top.",
};

// How one SOS travels, so everyone knows what happens next.
const FLOW: TourStep = {
  icon: Repeat,
  title: "How help reaches someone",
  text: "1. Someone sends an SOS. 2. The coordinator checks it and taps Verify. 3. The coordinator "
    + "sends Fire / Ambulance / Police. 4. The agency taps On the way. The reporter sees every step.",
};

export const TOURS: Record<TourId, TourStep[]> = {
  report: [
    TABS,
    { icon: Siren, title: "Need help? Two taps.", text: "Tap what is happening (Fire, Medical…). The card turns over: tap Send SOS." },
    { icon: PenLine, title: "Add details first if you can", text: "Floor, shop, how many people. Any language: English, اردو, Roman Urdu, हिन्दी, Bahasa, 日本語 and more." },
    { icon: MapPin, title: "Allow location", text: "Your phone's location helps rescuers find you faster." },
    FLOW,
    { icon: Truck, title: "Keep this page open", text: "A green screen tells you each time help moves closer." },
  ],
  coordinator: [
    TABS,
    { icon: LogIn, title: "Sign in first", text: "Staff login → coordinator account. You land on your desk automatically." },
    FLOW,
    { icon: Siren, title: "New SOS = red screen", text: "A siren plays when a report arrives. Tap Open incident." },
    { icon: BadgeCheck, title: "Verify", text: "Read the message. Unknown means nobody said it. Nothing goes to agencies until you verify." },
    { icon: Truck, title: "Send help", text: "After Verify, a Send help row appears. Busy agencies are greyed out." },
    { icon: Map, title: "Map colours", text: "Amber: new. Red: verified. Blue: help on the way. Small green: closed." },
    { icon: CircleCheck, title: "Close it", text: "When the team confirms everyone is safe, tap Confirm resolved." },
  ],
  agency: [
    TABS,
    { icon: LogIn, title: "Sign in as your agency", text: "Staff login → e.g. fire-saddar@madaddesk.demo. You land on your inbox." },
    { icon: Hourglass, title: "An empty inbox is normal", text: "A request comes only after the coordinator verifies an SOS and sends it to you." },
    { icon: Siren, title: "Request = red screen", text: "The screen turns red with a siren. Keep this tab open." },
    { icon: MapPin, title: "Where to go", text: "Floor, landmark and a Google Maps link to the reporter's location." },
    { icon: Truck, title: "Tap On the way", text: "The reporter and the coordinator see it immediately." },
  ],
};
