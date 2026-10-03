# Changelog

All notable J플래너 changes are recorded here. An entry under **Unreleased** is Proposed writer-branch evidence, not proof of merge, deployment, or release.

## Unreleased

### Changed

- Rejected imported custom-map URLs unless they are credential-free HTTPS URLs; unsafe values now use the existing user-triggered Google Maps fallback.
- Removed implicit public Nominatim geocoding so browser-local item persistence makes no geocoding request.
- Kept manual latitude and longitude entry available while public geocoding remains disabled.
- Required a configurable provider port, site-wide traffic governance, and provider-switch contract before geocoding can return.
- Invalidated pending OSRM results when the selected map view becomes empty.
- Regenerated unsafe imported trip, flight, and activity identifiers before HTML attribute use.

### Documentation

- Added ADR-0001 and updated the product/technical Gap baseline for the disabled public-geocoding boundary and commercial provider-port Gap.
- Added Proposed PRD, TRD, and architecture evidence bound to the implemented static/browser-local product boundary.
