# J플래너 Product Requirements Document

Status: **Proposed**

This PRD records only behavior implemented by the stacked writer branch. It is not proof of merge, publication, or an immutable release.

## Product outcome

J플래너 is a browser-local travel planner for a traveller who needs one place to organise trips, dated activities, map context, reservation material, and calendar hand-off without operating an application backend.

The product succeeds when a traveller can prepare and retain a usable itinerary in one browser, recover or move it through a JSON backup, and export selected activities to a calendar through ICS export.

## User and jobs

The primary user is an individual traveller. They need to:

- create, select, edit, and remove trips;
- manage dated activities, flights, notes, attachments, and optional manual latitude and longitude values;
- inspect coordinate-based map and route views;
- open an explicit Google Maps search or directions action when desired;
- download JSON backup and ICS export files before browser data is cleared or a device is changed.

## Product boundary

- No J플래너 account or server database is part of the current product.
- Travel data and attachment data are stored in the current browser origin.
- Saving or editing an activity does not invoke public geocoding. The user may enter manual latitude and longitude values.
- OpenStreetMap tiles, OSRM routes, and user-triggered Google Maps navigation are external capabilities, not J플래너-owned records or release artifacts.
- Airlines, accommodation providers, payment services, and map providers remain outside the product boundary.

## Invariants

1. An activity save completes locally without disclosing its place or name to a geocoder.
2. JSON import replaces the current state only after explicit confirmation; malformed JSON syntax is rejected. Structural validation beyond the current normalisation boundary remains an open Gap.
3. A browser storage write failure is surfaced to the traveller; it is not represented as durable server persistence. Read and removal failure UX remains an open Gap.
4. Documentation cannot claim current publication or release without separately observed evidence.

## Acceptance scenes

| Scene | Expected result |
| --- | --- |
| A traveller creates an activity without coordinates | The activity is stored locally and no geocoding request is made. |
| A traveller enters valid coordinates | The activity remains editable and can participate in coordinate-based map and route views. |
| A traveller opens map search or directions | A stored custom map URL opens when present; otherwise a new Google Maps URL receives the activity place or name only after that action. |
| A traveller prepares for browser cleanup or device change | JSON backup and ICS export are available as user-controlled hand-off paths. |
| An external map service is unavailable | Local itinerary editing remains available; the external map or route action may fail independently. |

## Non-goals for this revision

Account synchronisation, collaborative editing, bookings, payments, governed public geocoding, a product database, and guaranteed offline maps are not implemented requirements.

## Evidence and acceptance gate

The executable behavior source is `index.html`. Documentation contracts live in `tests/*.test.mjs`. This PRD remains Proposed until ordinary merge after exact-head Checks and required review; merge alone does not prove Pages publication or create a release.
