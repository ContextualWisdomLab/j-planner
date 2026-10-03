import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("documents the Nominatim geocoding boundary", async () => {
  const [baseline, application] = await Promise.all([
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);
  const compactApplication = application.replace(/\s+/g, "");

  assert.match(application, /nominatim\.openstreetmap\.org\/search/);
  assert.match(
    compactApplication,
    /if\(\(value\.lat===null\|\|value\.lng===null\)&&\(value\.place\|\|value\.name\)\)\{constfound=awaitgeocode\(value\.place\|\|value\.name\)/,
  );
  assert.match(
    baseline,
    /external Nominatim geocoding \(place\/name query\), OpenStreetMap tiles and OSRM routes/,
  );
  assert.match(
    baseline,
    /When coordinates are missing, Nominatim receives the item's `place` or `name` value as the geocoding query\./,
  );
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
