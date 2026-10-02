import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("invalidates pending routes before an empty map view returns", async () => {
  const application = await readFile("index.html", "utf8");

  assert.match(
    application,
    /function updateOverview\(refit=false\)\{[\s\S]*?const token=\+\+ui\.routeToken;[\s\S]*?if\(!items\.length\)\{mapState\.routes=\[\];renderMap\(\);return;\}/,
  );
  assert.match(
    application,
    /if\(token!==ui\.routeToken\)return;mapState\.routes=routes/,
  );
});

test("normalizes imported identifiers before HTML attribute interpolation", async () => {
  const application = await readFile("index.html", "utf8");

  assert.match(
    application,
    /const normalizeId = \(value,prefix\) => \{[\s\S]*?\^\[A-Za-z0-9_-\]\{1,128\}\$/,
  );
  assert.match(application, /id:normalizeId\(trip\.id,'trip'\)/);
  assert.match(application, /id:normalizeId\(f\.id,'flight'\)/);
  assert.match(application, /id:normalizeId\(item\.id,'item'\)/);
});
