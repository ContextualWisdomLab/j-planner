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
