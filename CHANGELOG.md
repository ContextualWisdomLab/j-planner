# Changelog

All notable J플래너 changes are recorded here. An entry under **Unreleased** is Proposed writer-branch evidence, not proof of merge, deployment, or release.

## Unreleased

### Changed

- Removed implicit public Nominatim geocoding so browser-local item persistence makes no geocoding request.
- Kept manual latitude and longitude entry available while public geocoding remains disabled.
- Required a configurable provider port, site-wide traffic governance, and provider-switch contract before geocoding can return.

### Documentation

- Added ADR-0001 and updated the product/technical Gap baseline for the disabled public-geocoding boundary and commercial provider-port Gap.
