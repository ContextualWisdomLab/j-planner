import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("documents the Nominatim geocoding boundary", async () => {
  const [baseline, application] = await Promise.all([
    readFile("docs/product-technical-gap-baseline.md", "utf8"),
    readFile("index.html", "utf8"),
  ]);

  assert.match(application, /nominatim\.openstreetmap\.org\/search/);
  assert.match(application, /geocode\(value\.place\|\|value\.name\)/);
  assert.match(
    baseline,
    /external Nominatim geocoding \(place\/name query\), OpenStreetMap tiles and OSRM routes/,
  );
  assert.match(
    baseline,
    /When coordinates are missing, Nominatim receives the item's `place` or `name` value as the geocoding query\./,
  );
});
