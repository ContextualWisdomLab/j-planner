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
