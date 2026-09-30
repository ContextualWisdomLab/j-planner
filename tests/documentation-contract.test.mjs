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
