# J플래너 Technical Requirements Document

Status: **Proposed**

## Runtime shape

J플래너 is delivered as a single static `index.html`. Application HTML, CSS, JavaScript, and the vendored Leaflet 1.9.4 runtime are contained in that source. There is no product server process, server API, or server database in the current boundary.

## State and files

- Application state containing Trip records and the active-trip identity is serialised as JSON in browser `localStorage` under the application origin.
- Runtime input is normalised before it becomes active state; absent or unusable state falls back to the built-in starter trip.
- JSON backup is the user-controlled portability path.
- ICS files are generated for calendar hand-off.
- User attachments are represented inside browser-local state and therefore share browser quota and loss risks.

## External capability ACLs

| Capability | Boundary and data | Required behavior |
| --- | --- | --- |
| OpenStreetMap tile rendering | Browser requests map tiles for the visible map area. | Failure must not prevent local itinerary editing. |
| OSRM route rendering | Browser requests route geometry for activities with coordinates. | Requests time out after eight seconds; a current-view token rejects late results, including after the view becomes empty. Failure currently falls back to a straight line without a visible warning. |
| Google Maps navigation | When no custom map URL is stored, an explicit user action encodes the activity place or name in a search or directions URL. A stored custom URL is otherwise opened. | Open with `noopener`; blocked pop-ups are reported to the user. |
| Public geocoding | No provider is configured. | Public geocoding remains disabled during save and edit. |

A future geocoding capability requires a configurable product-owned port, permitted caching and attribution, site-wide traffic governance, provider-switch behavior, contract tests, and an immutable owner release before consumer integration.

## Security and privacy requirements

1. Saving and editing must make no implicit geocoding request.
2. External navigation must be initiated by the traveller and use a new window without an opener reference.
3. Imported trip, flight, and activity identifiers are constrained to safe attribute characters or regenerated. Full imported-field schema validation and safe attribute construction remain open security work.
4. A failed local storage write and a blocked navigation pop-up are visible. Storage read/removal, attachment-read, tile, and route-fallback visibility remain open operability work.
5. Source, documentation, third-party notices, and provenance must agree before a versioned release.

## Operability and performance

The static runtime has no server connection pool to close. OSRM requests have an eight-second abort boundary, and current-view tokens prevent late route results from replacing the selected or empty view. Tile loading and external navigation remain browser/provider operations. Browser interaction, storage quota, attachment size, and external provider latency are the principal operational constraints.

## Verification

- `node --test tests/*.test.mjs` verifies the local persistence, disabled-geocoding, manual-coordinate, and documentation contracts.
- Browser verification remains a Gap for trip and activity changes, JSON backup and restore, ICS export, coordinate map behavior, external navigation, storage failure, hostile import, and external-provider failure states.
- Exact-head hosted Checks and independent review remain merge gates. A source tree or open PR is not publication evidence.
