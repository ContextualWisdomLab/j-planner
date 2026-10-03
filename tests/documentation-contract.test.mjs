import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("documents the disabled public-geocoding boundary", async () => {
  const [readme, baseline, application] = await Promise.all([
    readFile("README.md", "utf8"),
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  assert.doesNotMatch(application, /nominatim\.openstreetmap\.org/i);
  assert.doesNotMatch(application, /function geocode\(/);
  assert.match(readme, /자동 좌표 조회는 제공하지 않으며/);
  assert.match(readme, /필요한 좌표는 일정 편집 화면에서 직접 입력/);
  assert.match(baseline, /Public geocoding is disabled/);
  assert.match(baseline, /external OpenStreetMap tiles and OSRM routes/);
});

test("documents Google Maps fallback navigation as an external boundary", async () => {
  const [readme, baseline, application] = await Promise.all([
    readFile("README.md", "utf8"),
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  assert.match(
    application,
    /function mapQuery\(item\)\{ return item\.place \|\| item\.name; \}/,
  );
  assert.match(
    application,
    /https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=\$\{q\}/,
  );
  assert.match(
    application,
    /https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=\$\{q\}/,
  );
  assert.match(readme, /Google Maps 검색·길찾기 URL의 질의/);
  assert.match(
    baseline,
    /external Google Maps search\/directions \(place\/name query on user action\)/,
  );
});

test("binds product and technical design to the implemented static boundary", async () => {
  const [prd, trd, architecture, baseline, application] = await Promise.all([
    readFile("docs/PRD.md", "utf8"),
    readFile("docs/TRD.md", "utf8"),
    readFile("docs/ARCHITECTURE.md", "utf8"),
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  for (const document of [prd, trd, architecture]) {
    assert.match(document, /Status: \*\*Proposed\*\*/);
    assert.doesNotMatch(document, /Status: \*\*(?:Accepted|Released)\*\*/);
  }

  assert.match(prd, /browser-local travel planner/i);
  assert.match(prd, /JSON backup/);
  assert.match(prd, /ICS export/);
  assert.match(prd, /manual latitude and longitude/i);
  assert.match(prd, /No J플래너 account or server database/i);

  assert.match(trd, /single static `index\.html`/i);
  assert.match(trd, /browser `localStorage`/i);
  assert.match(trd, /OpenStreetMap tile/i);
  assert.match(trd, /OSRM route/i);
  assert.match(trd, /Google Maps/i);
  assert.match(trd, /public geocoding remains disabled/i);
  assert.match(trd, /when no custom map URL is stored/i);

  assert.match(architecture, /Bounded Context/);
  assert.match(architecture, /Trip aggregate/);
  assert.match(architecture, /System context/);
  assert.match(architecture, /ERD status: not applicable/i);
  assert.match(architecture, /no server database/i);
  assert.match(architecture, /```mermaid/);
  assert.doesNotMatch(architecture, /Travel Plan (?:aggregate|functions)/);

  assert.match(application, /window\.localStorage\.setItem/);
  assert.match(application, /https:\/\/tile\.openstreetmap\.org/);
  assert.match(application, /https:\/\/router\.project-osrm\.org/);
  assert.match(application, /if\(item\.mapUrl\) return item\.mapUrl/);
  assert.doesNotMatch(application, /nominatim\.openstreetmap\.org/i);

  assert.doesNotMatch(trd, /k6-compatible/i);
  assert.doesNotMatch(architecture, /canonical owners/i);

  assert.match(baseline, /\| PRD \| `docs\/PRD\.md`/);
  assert.match(baseline, /\| TRD \| `docs\/TRD\.md`/);
  assert.match(baseline, /\| Architecture \/ UML \| `docs\/ARCHITECTURE\.md`/);
  assert.match(baseline, /\| JPL-DES-001 \|[^\n]+\|[^\n]+\| Proposed repair \|/);
  assert.match(baseline, /Context Map status/);
  assert.doesNotMatch(baseline, /k6 delivery evidence/i);
});

test("documents a bounded public support route", async () => {
  const [readme, baseline] = await Promise.all([
    readFile("README.md", "utf8"),
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
  ]);

  assert.match(readme, /## 지원/);
  assert.match(
    readme,
    /https:\/\/github\.com\/ContextualWisdomLab\/j-planner\/issues/,
  );
  assert.match(readme, /민감한 여행 정보나 보안 취약점은 공개 Issue에 올리지 마세요/);
  assert.match(readme, /지원 SLA와 비공개 보안 신고 경로는 아직 제공하지 않습니다/);
  assert.match(
    baseline,
    /\| JPL-OPS-001 \|[^\n]+\| Partially Addressed \|/,
  );
});
