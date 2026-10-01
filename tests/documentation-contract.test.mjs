import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("documents the Nominatim geocoding boundary", async () => {
  const [readme, baseline, application] = await Promise.all([
    readFile("README.md", "utf8"),
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  assert.match(application, /nominatim\.openstreetmap\.org\/search/);
  assert.match(
    application,
    /OpenStreetMap Nominatim[\s\S]+id="itemGeocodeBtn"[^>]+type="button">위치 조회/,
  );
  assert.match(readme, /일정 저장 자체는 외부 지오코딩 요청을 만들지 않습니다/);
  assert.match(
    baseline,
    /external Nominatim geocoding \(explicit place\/name lookup\), OpenStreetMap tiles and OSRM routes/,
  );
  assert.match(
    baseline,
    /Saving an item never invokes geocoding\./,
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
