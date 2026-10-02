# J플래너 product and technical gap baseline

Status: **Proposed**
Evidence snapshot: protected `gh-pages@ec030872a0762af8af54d359c88e4c90239e05e4`, [PR #2](https://github.com/ContextualWisdomLab/j-planner/pull/2) foundation head `f9f9fa2afc3d15f4cb24112fccefe0d150ecdb87`, repository metadata, and this stacked writer branch, observed 2026-10-02.

This baseline distinguishes protected-source evidence from proposed PR content and live publication. An open PR is not a release or deployment.

## Product truth

J플래너 is a browser-local travel planner delivered as a single static `index.html`. It manages trips, dated activities, coordinates, reservation attachments, JSON backups, and ICS exports without a J플래너 account or product database.

Repository metadata reports GitHub Pages enabled for the `gh-pages` repository and the source contains a root `index.html`. Current HTTP delivery has not been independently verified in this evidence snapshot, and the repository has no GitHub Release.

## Context Map status and System context

Only the J플래너 Planning Bounded Context is implemented, so there is no inter-context DDD relationship to claim. The following System context records the external capability boundaries instead.

```text
Traveller
  -> J플래너 browser application
       -> browser localStorage (trip data)
       -> JSON / ICS files (user-controlled export)
       -> embedded Leaflet 1.9.4 (map rendering)
       -> external OpenStreetMap tiles and OSRM routes (network ACL)
       -> external Google Maps search/directions (place/name query on user action)
```

J플래너 owns travel-plan interaction and browser-local persistence. Leaflet remains a third-party library under its own BSD 2-Clause terms. Public geocoding is disabled: saving and editing never invoke a geocoder, and travellers may enter optional coordinates manually. OpenStreetMap tile, OSRM route, and Google Maps navigation services remain external systems governed by their own availability and terms. When no custom map URL exists and the user opens map search or directions, Google Maps receives the item's `place` or `name` value in the destination or search query. These services are not J플래너 release artifacts.

## Product and technical evidence

| Artifact | Current evidence | Status |
| --- | --- | --- |
| README | Customer purpose, use, data-loss warning, boundaries, architecture, support expectations, and license are documented in PR #2. | Proposed |
| PRD | `docs/PRD.md` binds users, outcomes, invariants, acceptance scenes, and non-goals to implemented behavior. It exists only on this writer branch. | Proposed |
| TRD | `docs/TRD.md` records the static runtime, browser state, external ACLs, failure handling, and verification boundary. It exists only on this writer branch. | Proposed |
| Architecture / UML | `docs/ARCHITECTURE.md` records the Bounded Context, Trip aggregate, Context Map status, System context, logical components, state transitions, and failure boundaries. It exists only on this writer branch. | Proposed |
| ERD | No server database exists in the documented product boundary; browser-local JSON state is not represented as a relational ERD. | Not applicable until a database is introduced |
| ADR | ADR-0001 proposes disabling public geocoding until a governed provider port exists. It is not Accepted before merge. | Proposed |
| Release | Repository metadata reports zero GitHub Releases. Source or version strings must not be treated as an immutable release. | Open |
| Pages | Repository settings and root source support Pages, but live HTTP publication was not independently verified in this evidence snapshot. | Unverified |
| License | PR #2 proposes Apache-2.0 for J플래너 original source and a separate Leaflet BSD 2-Clause notice. External services are excluded from that grant. | Proposed |

## Gap / Action / Status

| ID | Gap | Action and acceptance evidence | Status |
| --- | --- | --- | --- |
| JPL-DOC-001 | Protected source has no repository landing, root license, or third-party notice. | Merge PR #2 only after exact-head Checks and qualifying independent review; confirm README, `LICENSE`, and `THIRD_PARTY_NOTICES.md` blobs on protected `gh-pages`. | Proposed |
| JPL-DOC-002 | PR #2's Nominatim contract bound documentation to implicit save-time geocoding, which this privacy repair intentionally removes. | Replace the obsolete guard with contracts proving save is local-only, no public endpoint or lookup control exists, and manual coordinates remain; keep PR #2 alive as the foundation. | Proposed repair |
| JPL-DOC-003 | The Google Maps fallback navigation present in the UI was absent from the external-service and privacy boundary. | Document the user-triggered `place`/`name` query flow in README and the System context, and bind both Google Maps URL paths to the documentation contract. | Proposed |
| JPL-PRI-001 | Saving an item with missing coordinates automatically disclosed its place or name to Nominatim without an explicit user action. | `tests/geocoding-consent-contract.test.mjs` must prove local-only save, absence of the public endpoint and lookup control, and retained manual coordinates; ADR-0001 remains Proposed until ordinary merge. | Proposed repair |
| JPL-EXT-001 | A static client cannot govern public geocoding site-wide or switch a hard-coded provider without a software update. | Keep geocoding disabled until a configurable product-owned port, shared limiter, permitted cache, attribution, provider switch, contract tests, and immutable owner release exist. | Open |
| JPL-PUB-001 | Pages source/settings do not prove current HTTP delivery. | Verify the configured public URL after ordinary merge and record the observed revision and timestamp before claiming publication. | Open |
| JPL-REL-001 | No immutable GitHub Release binds source, license, and provenance. | Produce a versioned release only after release acceptance confirms source revision, SBOM/provenance, and third-party notices. | Open |
| JPL-SEC-001 | Historical dependency review could not query the dependency graph (HTTP 403). | Repair the central workflow owner; retain fail-closed behavior for dependency-changing PRs and verify a fresh exact-head run when applicable. | Open upstream |
| JPL-SEC-002 | Imported identifiers were interpolated into HTML attributes without a constrained character set; other imported date/text fields still lack a complete hostile-input schema and browser regression suite. | Regenerate unsafe trip/flight/activity identifiers in this stack; then add schema validation, safe attribute construction, and hostile-import browser tests before release. | Proposed repair |
| JPL-RTE-001 | A late OSRM response could repopulate routes after the selected view became empty because the route token was not invalidated on the early return. | Increment the current-view token before every empty-view return and bind both the invalidation and late-result guard in `tests/runtime-boundary-contract.test.mjs`. | Proposed repair |
| JPL-DES-001 | Protected source lacks dedicated PRD, TRD, and maintained architecture/UML evidence; this writer branch proposes all three without inventing a database or service boundary. | Keep their contracts aligned with `index.html`; integrate only through the PR #2 → PR #3 stack after exact-head Checks and required independent review. | Proposed repair |
| JPL-OPS-001 | No product-owned support or incident route is documented. | Define a public support and vulnerability-reporting route before a supported release claim. | Open |
| JPL-OPS-002 | Storage read/removal, attachment-read, tile, and route-fallback failures are logged, ignored, or degraded without consistent traveller-visible recovery. | Add explicit error states and browser tests without claiming server durability; preserve local editing and export recovery. | Open |
| JPL-DAT-001 | Structurally invalid but parseable imported JSON normalises to starter data and can replace current state after confirmation. | Validate a versioned backup schema before confirmation, fail closed without mutating state, and test malformed and hostile fixtures. | Open |
| JPL-PERF-001 | No workload, measurement boundary, or baseline exists for the governing all-pages p95 ≤20 ms objective. | First define representative browser and published-delivery workloads, environment, sample design, and failure denominator; then select measurement tools and report all results without claiming the objective has been met. | Open |

## Merge and release gate

Documentation may merge only through ordinary repository governance after the current head is mergeable, required current-head Checks are terminal green, substantive review threads are resolved, and required independent approval exists. Merge does not itself prove Pages publication or create a release.
