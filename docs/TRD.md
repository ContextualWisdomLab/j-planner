# J플래너 Technical Requirements Document

Status: **Proposed**

## Runtime shape

J플래너 is delivered as a single static `index.html`. Application HTML, CSS, JavaScript, and the vendored Leaflet 1.9.4 runtime are contained in that source. There is no product server process, server API, or server database in the current boundary.

## State and files

- The Travel Plan aggregate is serialised as JSON in browser `localStorage` under the application origin.
- Runtime input is normalised before it becomes active state; absent or unusable state falls back to the built-in starter trip.
- JSON backup is the user-controlled portability path.
- ICS files are generated for calendar hand-off.
- User attachments are represented inside browser-local state and therefore share browser quota and loss risks.

## External capability ACLs

| Capability | Boundary and data | Required behavior |
| --- | --- | --- |
| OpenStreetMap tile rendering | Browser requests map tiles for the visible map area. | Failure must not prevent local itinerary editing. |
| OSRM route rendering | Browser requests route geometry for activities with coordinates. | Stale responses must not replace the current route view. |
| Google Maps navigation | On an explicit user action, the activity place or name is encoded in a search or directions URL. | Open with `noopener`; blocked pop-ups are reported to the user. |
| Public geocoding | No provider is configured. | Public geocoding remains disabled during save and edit. |

A future geocoding capability requires a configurable product-owned port, permitted caching and attribution, site-wide traffic governance, provider-switch behavior, contract tests, and an immutable owner release before consumer integration.

## Security and privacy requirements

1. Saving and editing must make no implicit geocoding request.
2. External navigation must be initiated by the traveller and use a new window without an opener reference.
3. Rendered user text must pass through the existing escaping boundary before HTML insertion.
4. Storage, import, file, map, and pop-up failures must be visible and must not be described as successful durable persistence.
5. Source, documentation, third-party notices, and provenance must agree before a versioned release.

## Operability and performance

The static runtime has no server connection pool to close. External network calls must remain independently cancellable or supersedable by current UI state. Browser interaction, storage quota, attachment size, and external provider latency are the principal operational constraints.

The target for a future published performance gate is p95 at or below 20 ms for product-owned page handling under a recorded browser and device profile. This document does not claim that target has been measured. A realistic browser test and k6-compatible delivery test must be added before treating it as release evidence.

## Verification

- `node --test tests/*.test.mjs` verifies the local persistence, disabled-geocoding, manual-coordinate, and documentation contracts.
- Browser verification must cover trip and activity changes, JSON backup and restore, ICS export, coordinate map behavior, external navigation, storage failure, and malformed import.
- Exact-head hosted Checks and independent review remain merge gates. A source tree or open PR is not publication evidence.
