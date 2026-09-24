PRD — Signal

Product: Signal
Tagline: Know what’s reported. Know what’s verified. Know what’s uncertain.

Challenge: Build Something That Helps
Prototype goal: Help people in unstable areas distinguish useful, corroborated information from conflicting reports and rumours during a developing incident.

1. Problem

During a developing incident, information spreads through WhatsApp, word of mouth, radio, community groups and eyewitnesses.

The problem isn't simply a lack of information.

It is information overload without reliable context.

A person like Amara may receive:

a firsthand observation
an old message being reshared
an unverified rumour
a report from someone in another location
a contradictory eyewitness account

These arrive simultaneously, making it difficult to answer:

What do we actually know right now?

Existing communication channels are good at distributing information, but poor at structuring and contextualizing conflicting reports.

2. Product hypothesis

If AI can extract claims from incoming reports, compare them across time, location and source, identify corroboration and contradictions, and expose the evidence behind its assessment, then people can understand a developing situation faster without treating an AI-generated answer as unquestionable truth.

3. Target users
Primary

Residents/community members

People who need to understand what is happening around them during a developing situation.

Secondary

Community responders

Local volunteers, neighbourhood groups, vigilantes, community organizations, etc., who receive multiple reports and need to make sense of them.

4. Core use case

A user receives several reports about an incident.

Instead of reading them individually, they submit/paste them into Signal.

Signal:

Extracts structured information.
Groups related reports.
Identifies corroboration.
Identifies contradictions.
Flags unverified claims.
Produces a concise situation summary.
Shows the evidence behind the summary.
5. Product principle
The AI is not the authority.

Signal should not say:

“This road is safe.”

or:

“There is definitely an attack.”

Instead:

“Three reports describe unusual movement around Oke Road between 6:10–6:25 PM. Two other reports describe normal traffic. No independent source currently confirms an attack.”

The product communicates evidence and uncertainty, rather than manufacturing certainty.

6. MVP

The prototype has four core components.

A. Report ingestion

Users can paste one or multiple reports.

Example:

“I saw people running near Oke Road around 6:10.”

“My brother drove through there at 6:15 and didn't see anything.”

“Someone said there was an attack.”

Each report is stored with:

Report
├── text
├── timestamp
├── location
├── source type
└── submission time

For the demo, reports can be manually entered or seeded.

7. AI extraction

The AI converts unstructured reports into structured claims.

Example:

{
  "location": "Oke Road",
  "event_time": "18:10",
  "observation": "people running",
  "incident_type": "unusual movement",
  "source_type": "eyewitness",
  "claim_status": "reported"
}

The AI should also identify:

people/organizations mentioned
locations
time references
incident types
direct observations
hearsay
uncertainty
claims requiring corroboration
8. Report correlation

Signal compares reports using:

Temporal similarity

Are reports describing events around the same time?

Spatial similarity

Are they referring to the same location?

Semantic similarity

Are they actually describing the same event?

Source independence

Are multiple people independently reporting the same thing, or is everyone repeating one original message?

This distinction is particularly important.

Five WhatsApp forwards are not five independent reports.

9. Evidence classification

Each claim is assigned one of four states:

🟢 Corroborated

Multiple reasonably independent reports support the same observation.

🟠 Conflicting

Reports disagree about the same event.

⚪ Unverified

A claim exists but there isn't enough supporting evidence.

🔵 Stale

The report may no longer represent the current situation because it is old.

The system should also support:

Insufficient evidence

When the available information simply isn't enough to make a meaningful determination.

10. Situation card

The primary output of the application.

Example:

┌──────────────────────────────────────┐
│ OKE ROAD                             │
│                                      │
│ 🟠 CONFLICTING INFORMATION            │
│                                      │
│ Last updated: 6:34 PM                │
│ 7 reports · 4 sources                │
│                                      │
│ CORROBORATED                          │
│ • Unusual movement reported           │
│ • Reports originate near Oke Road    │
│                                      │
│ CONFLICTING                           │
│ • 2 reports describe unusual activity│
│ • 2 reports describe normal traffic  │
│                                      │
│ UNVERIFIED                            │
│ • "There was an attack"              │
│                                      │
│ SUMMARY                               │
│ Multiple reports indicate unusual    │
│ activity, but available evidence     │
│ does not independently confirm an    │
│ incident.                            │
│                                      │
│ [ VIEW EVIDENCE ]                    │
└──────────────────────────────────────┘
11. Evidence view

Clicking View Evidence exposes the reasoning.

WHY IS THIS CONFLICTING?

REPORT #12
6:21 PM · Eyewitness

"I saw people running near Oke Road."

────────────

REPORT #14
6:25 PM · Resident

"My brother just drove through Oke Road."

────────────

REPORT #18
6:28 PM · WhatsApp forward

"There was an attack on Oke Road."

⚠ The attack claim has no independent
confirmation in the current reports.

This is critical to the product.

Users should be able to challenge the AI's interpretation.

12. AI architecture
                REPORTS
                   │
                   ▼
        ┌────────────────────┐
        │ AI CLAIM EXTRACTION │
        └──────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ NORMALIZATION       │
        │ Time / Location /   │
        │ Source / Claim      │
        └──────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ CORRELATION ENGINE  │
        │                    │
        │ Time               │
        │ Location           │
        │ Semantic similarity│
        │ Source independence│
        └──────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ EVIDENCE ENGINE     │
        │                    │
        │ Corroborated       │
        │ Conflicting        │
        │ Unverified         │
        │ Stale              │
        └──────────┬─────────┘
                   │
                   ▼
        ┌────────────────────┐
        │ SITUATION SUMMARY   │
        └────────────────────┘
13. Evidence-quality heuristic

Rather than claiming that an LLM's confidence represents truth, use an explicit heuristic.

For example:

$$ E = 0.25F + 0.20I + 0.20C + 0.20S + 0.15T $$

Where:

F = freshness
I = independence of source
C = corroboration
S = source specificity
T = temporal/location consistency

All are scored 0–10.

This is an evidence-quality heuristic, not a probability of truth.

14. Tech stack

For a 48-hour challenge, keep it lean.

Frontend
Next.js
TypeScript
Tailwind CSS
Backend/database
Supabase
AI

Any accessible LLM API capable of structured JSON output.

Optional
Embeddings for semantic similarity
Map visualization if time remains

Do not make the map essential to the MVP.

15. Demo data

The prototype should ship with a Load Scenario button.

Example scenario:

6:21 PM
"I saw several people running near Oke Road."
— Local shop owner

6:24 PM
"My brother just drove through Oke Road."
— Resident

6:26 PM
"Someone said there was an attack."
— WhatsApp forward

6:27 PM
"We heard movement on the radio."
— Community volunteer

6:29 PM
"My sister is at the pharmacy there and she's okay."
— Resident

6:31 PM
"Don't use Oke Road!!!"
— Unverified forward

The reviewer shouldn't have to invent test data.

16. Success criteria

The MVP succeeds if a reviewer can:

Load or submit reports.
Run AI analysis.
See extracted claims.
See reports grouped into a situation.
See conflicting/corroborated/unverified information.
Understand why the system reached its conclusion.
Trace the summary back to individual reports.
17. Non-goals

For this challenge, explicitly do not build:

Emergency dispatch
Police coordination
Automated evacuation
Crime prediction
Facial recognition
Weapon detection
Autonomous safety recommendations
Full WhatsApp integration
User authentication
Complex real-time infrastructure
A claim that Signal can determine whether a road is objectively safe

These can be future possibilities, not MVP features.

18. Future roadmap
Phase 2
SMS ingestion
WhatsApp/community integrations
Trusted responder accounts
Report verification workflow
Geospatial visualization
Event timelines
Phase 3
Community reputation
Verified responder network
Offline/low-connectivity reporting
USSD/voice reporting
Multilingual/local-language support
Persistent incident tracking
19. Core product metric

The most meaningful future metric isn't:

“How many AI responses did we generate?”

It's:

Time-to-understanding

How long does it take a user to understand the current evidence landscape after receiving multiple conflicting reports?

That directly maps to the problem.

20. One-line pitch

Signal turns scattered community reports into a live evidence map of what is corroborated, what conflicts, and what remains unverified.