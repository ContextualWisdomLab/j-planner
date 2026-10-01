# ADR-0001: Require an explicit action before geocoding

- Status: Proposed
- Date: 2026-10-01
- Decision owner: J플래너 travel-planning context
- Evidence base: PR #2 foundation `f9f9fa2afc3d15f4cb24112fccefe0d150ecdb87`, `index.html`, `tests/geocoding-consent-contract.test.mjs`

## Problem

The item-save handler automatically sent `place`, or `name` as a fallback, to the public Nominatim endpoint whenever either coordinate was missing. A user choosing browser-local persistence therefore caused an external disclosure without a separate action or in-context notice. The save operation also waited on that external service and silently treated failures as missing coordinates.

## Constraints

- J플래너 is a static, browser-local application without a product backend or account.
- Place and itinerary names can contain personal or confidential material.
- Coordinates remain optional; saving an itinerary must not require a network service.
- The public Nominatim service permits moderate end-user-triggered search, limits traffic to at most one request per second, requires application identification and attribution, and can change or withdraw access.
- This open writer branch is Proposed evidence, not an Accepted decision or release.

## Decision

1. Item save is local-only and never calls geocoding.
2. The form exposes a separate `위치 조회` button beside a visible notice naming OpenStreetMap Nominatim, the transmitted value, and the no-transmission default.
3. One button activation performs at most one lookup. The button is disabled and marked busy while the request is active, and client requests are spaced by at least one second.
4. A successful result fills the latitude and longitude fields; the result is persisted only if the user subsequently saves the item.
5. Empty input, offline state, no match, and service/network failure produce recoverable inline status through a polite live region. No error falls through to an implicit save-time request.
6. Nominatim remains an external ACL, not J플래너 domain truth. A supported commercial release must replace the hard-coded public endpoint with a configurable provider port and an appropriate provider contract.

## Alternatives

- **Keep automatic save-time geocoding:** rejected because local save and external disclosure remain coupled, failures are hidden, and the call is not directly user-triggered.
- **Remove geocoding entirely:** rejected for now because optional coordinate discovery materially supports the map experience and can be bounded safely.
- **Build a product geocoding backend now:** deferred because no released shared owner or demonstrated traffic requires that operational surface yet. The current public endpoint is not accepted as a commercial SLA.

## User, operations, and failure scenes

- A traveller enters a private meeting name and presses Save: the itinerary is stored locally and no Nominatim request occurs.
- A traveller enters a public landmark and presses `위치 조회`: the disclosed query is sent once, coordinates fill the form, and the traveller decides whether to save them.
- The device is offline: the form keeps all input and tells the traveller to reconnect and retry or enter coordinates directly.
- Nominatim returns no result or an error: the form distinguishes no match from service failure and preserves a retry path.
- Usage outgrows the public endpoint: operations can only claim commercial support after a provider port, switch/caching plan, attribution, and immutable release evidence exist.

## Consequences and risks

The privacy boundary becomes visible and testable, and save latency no longer depends on geocoding. The single-file runtime gains a small stateful request path. Users can still choose to disclose sensitive text after reading the warning, and GitHub Pages origin identification does not create a provider SLA. Public-endpoint dependence therefore remains an open commercialization Gap.

## Verification and follow-up

- Run `node --test tests/*.test.mjs` against the exact writer head.
- Preserve PR #2 as the stacked documentation/licensing foundation.
- Add a browser-driven interaction suite when a reproducible browser runtime is owned by the repository.
- Before supported release, implement the configurable geocoding port, provider switch/caching policy, localization for supported locales, and production traffic validation.

## References

Nominatim. (2026). *Search queries (Nominatim 5.3.2 manual).* https://nominatim.org/release-docs/latest/api/Search/

OpenStreetMap Foundation. (n.d.). *Nominatim usage policy (aka geocoding policy).* Retrieved October 1, 2026, from https://operations.osmfoundation.org/policies/nominatim/
