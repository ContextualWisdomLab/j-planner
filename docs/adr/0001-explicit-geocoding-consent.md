# ADR-0001: Disable public geocoding until a governed provider port exists

- Status: Proposed
- Date: 2026-10-01
- Decision owner: J플래너 travel-planning context
- Evidence base: PR #2 foundation `f9f9fa2afc3d15f4cb24112fccefe0d150ecdb87`, `index.html`, `tests/geocoding-consent-contract.test.mjs`

## Problem

The item-save handler automatically sent `place`, or `name` as a fallback, to the public Nominatim endpoint whenever either coordinate was missing. A user choosing browser-local persistence therefore caused an external disclosure without a separate action or in-context notice. The save operation also waited on that external service and silently treated failures as missing coordinates.

A first repair separated lookup from save, but a client-side delay could not enforce the public service's site-wide request limit across users or provide an operator-controlled service switch. Keeping a hard-coded public endpoint would therefore misrepresent an unsupported integration as a reliable product capability.

## Constraints

- J플래너 is a static, browser-local application without a product backend or account.
- Place and itinerary names can contain personal or confidential material.
- Coordinates remain optional; saving an itinerary must not require a network service.
- The public Nominatim policy sets an absolute maximum of one request per second for the website or application, requires identification and attribution, and requires apps to be able to switch services without a software update.
- This open writer branch is Proposed evidence, not an Accepted decision or release.

## Decision

1. Item save and edit are local-only and never call a geocoder.
2. Public Nominatim lookup code, endpoint, controls, and request state are removed from the application.
3. Travellers can enter optional latitude and longitude values directly; existing coordinates remain editable.
4. Geocoding may return only behind a configurable product-owned provider port with site-wide traffic governance, caching where permitted, attribution, failure isolation, audit evidence, and an operator-controlled provider switch.
5. Any future provider remains an external ACL, not J플래너 domain truth, and requires test-first contract evidence on its canonical writer branch.

## Alternatives

- **Keep automatic save-time geocoding:** rejected because local save and external disclosure remain coupled, failures are hidden, and the call is not directly user-triggered.
- **Expose an explicit browser-side lookup with a one-second delay:** rejected because per-tab state cannot enforce a site-wide limit or coordinate concurrent and reopened forms, and a hard-coded endpoint cannot be switched operationally.
- **Build a product geocoding backend now:** deferred because no released shared owner or demonstrated demand justifies that operational surface yet.
- **Disable public geocoding and preserve manual coordinates:** selected as the smallest safe boundary for the current static product.

## User, operations, and failure scenes

- A traveller enters a private meeting name and presses Save: the itinerary is stored locally and no geocoding request occurs.
- A traveller already knows a location's coordinates: the values can be entered and saved without an external lookup.
- A traveller does not know coordinates: the rest of the itinerary remains usable; no unsupported network fallback runs silently.
- A future provider becomes unavailable or changes terms: operations can switch or disable it through the provider port without shipping application code.
- Concurrent users request coordinates after a governed integration exists: the shared traffic control, rather than independent browser timers, applies provider limits.

## Consequences and risks

The privacy and reliability boundary becomes small and testable, and save latency no longer depends on geocoding. Automatic coordinate discovery is unavailable until the operational contract exists, so some travellers must enter coordinates manually. OpenStreetMap tiles, OSRM routing, and user-triggered Google Maps navigation remain separate external boundaries documented in the product baseline.

## Verification and follow-up

- Run `node --test tests/*.test.mjs` against the exact writer head.
- Preserve PR #2 as the stacked documentation/licensing foundation.
- Keep source-contract tests proving save is local-only, the public endpoint and lookup control are absent, and manual coordinate fields remain.
- Before supported release, implement and release the configurable provider port with traffic, switching, privacy, localization, security, and production-load evidence.

## References

Nominatim. (2026). *Search queries (Nominatim 5.3.2 manual).* https://nominatim.org/release-docs/latest/api/Search/

OpenStreetMap Foundation. (n.d.). *Nominatim usage policy (aka geocoding policy).* Retrieved October 1, 2026, from https://operations.osmfoundation.org/policies/nominatim/
