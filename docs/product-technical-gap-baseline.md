# J플래너 product and technical gap baseline

Status: **Proposed**
Evidence snapshot: protected `gh-pages@ec030872a0762af8af54d359c88e4c90239e05e4`, repository metadata and [PR #2](https://github.com/ContextualWisdomLab/j-planner/pull/2), observed 2026-10-01.

This baseline distinguishes protected-source evidence from proposed PR content and live publication. An open PR is not a release or deployment.

## Product truth

J플래너 is a browser-local travel planner delivered as a single static `index.html`. It manages trips, dated activities, coordinates, reservation attachments, JSON backups, and ICS exports without a J플래너 account or product database.

Repository metadata reports GitHub Pages enabled for the `gh-pages` repository and the source contains a root `index.html`. Current HTTP delivery has not been independently verified in this evidence snapshot, and the repository has no GitHub Release.

## Context Map

```text
Traveller
  -> J플래너 browser application
       -> browser localStorage (trip data)
       -> JSON / ICS files (user-controlled export)
       -> embedded Leaflet 1.9.4 (map rendering)
       -> external Nominatim geocoding (place/name query), OpenStreetMap tiles and OSRM routes (network ACL)
       -> external Google Maps search/directions (place/name query on user action)
```

J플래너 owns travel-plan interaction and browser-local persistence. Leaflet remains a third-party library under its own BSD 2-Clause terms. Nominatim geocoding, OpenStreetMap tile, OSRM route, and Google Maps navigation services remain external systems governed by their own availability and terms. When coordinates are missing, Nominatim receives the item's `place` or `name` value as the geocoding query. When no custom map URL exists and the user opens map search or directions, Google Maps receives the item's `place` or `name` value in the destination or search query. These services are not J플래너 release artifacts.

## Product and technical evidence

| Artifact | Current evidence | Status |
| --- | --- | --- |
| README | Customer purpose, use, data-loss warning, boundaries, architecture, support expectations, and license are documented in PR #2. | Proposed |
| PRD | No dedicated PRD is present on the protected base or this writer branch. Product behavior is currently evidenced by `index.html` and README. | Gap |
| TRD | No dedicated TRD is present. The single-file runtime and external network calls are visible in `index.html`. | Gap |
| UML | No maintained UML artifact is present. The Context Map above is the bounded architecture view for this documentation change. | Gap |
| ERD | No server database exists in the documented product boundary; browser-local JSON state is not represented as a relational ERD. | Not applicable until a database is introduced |
| ADR | No dedicated ADR is present for local-only persistence, Pages publication, or external map-service boundaries. | Gap |
| Release | Repository metadata reports zero GitHub Releases. Source or version strings must not be treated as an immutable release. | Open |
| Pages | Repository settings and root source support Pages, but live HTTP publication was not independently verified in this evidence snapshot. | Unverified |
| License | PR #2 proposes Apache-2.0 for J플래너 original source and a separate Leaflet BSD 2-Clause notice. External services are excluded from that grant. | Proposed |

## Gap / Action / Status

| ID | Gap | Action and acceptance evidence | Status |
| --- | --- | --- | --- |
| JPL-DOC-001 | Protected source has no repository landing, root license, or third-party notice. | Merge PR #2 only after exact-head Checks and qualifying independent review; confirm README, `LICENSE`, and `THIRD_PARTY_NOTICES.md` blobs on protected `gh-pages`. | Proposed |
| JPL-DOC-002 | The Nominatim documentation contract did not bind the missing-coordinate and `place`/`name` fallback guard to the `geocode` call. | Review-repair commit `7b3c64e84d2cc5f1fcd3f11fce06ba6b02f135b2` makes a `place`-only guard fail while the unchanged application passes; require exact-head hosted evidence before merge. | Proposed |
| JPL-DOC-003 | The Google Maps fallback navigation present in the UI was absent from the external-service and privacy boundary. | Document the user-triggered `place`/`name` query flow in README and the Context Map, and bind both Google Maps URL paths to the documentation contract. | Proposed |
| JPL-PUB-001 | Pages source/settings do not prove current HTTP delivery. | Verify the configured public URL after ordinary merge and record the observed revision and timestamp before claiming publication. | Open |
| JPL-REL-001 | No immutable GitHub Release binds source, license, and provenance. | Produce a versioned release only after release acceptance confirms source revision, SBOM/provenance, and third-party notices. | Open |
| JPL-SEC-001 | Historical dependency review could not query the dependency graph (HTTP 403). | Repair the central workflow owner; retain fail-closed behavior for dependency-changing PRs and verify a fresh exact-head run when applicable. | Open upstream |
| JPL-DES-001 | PRD, TRD, and ADR evidence are absent. | Add bounded decisions only when product or operational behavior changes; do not manufacture documents for the current static implementation. | Open |
| JPL-OPS-001 | No product-owned support or incident route is documented. | Define a public support and vulnerability-reporting route before a supported release claim. | Open |

## Merge and release gate

Documentation may merge only through ordinary repository governance after the current head is mergeable, required current-head Checks are terminal green, substantive review threads are resolved, and required independent approval exists. Merge does not itself prove Pages publication or create a release.
