# Changelog

All notable J플래너 changes are recorded here. An entry under **Unreleased** is Proposed writer-branch evidence, not proof of merge, deployment, or release.

## Unreleased

### Changed

- Decoupled item saving from Nominatim so browser-local persistence makes no implicit geocoding request.
- Added an explicit, disclosed `위치 조회` action with accessible loading, success, no-match, offline, and network-error feedback.
- Limited client-side public Nominatim requests to one per second and retained successful coordinates only through the user's later save action.

### Documentation

- Added ADR-0001 and updated the product/technical Gap baseline for the external geocoding ACL and commercial provider-port Gap.
