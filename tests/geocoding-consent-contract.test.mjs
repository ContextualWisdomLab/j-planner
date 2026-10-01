import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

/** Read the single-file application source used by the contract tests. */
async function applicationSource() {
  return readFile("index.html", "utf8");
}

/** Extract the item form implementation without evaluating browser globals. */
function itemFormSource(application) {
  const match = application.match(
    /function openItemForm\(itemId=''\)\{(?<source>[\s\S]+?)\n  function bindChoiceChips/,
  );
  assert.ok(match?.groups?.source, "openItemForm source must remain inspectable");
  return match.groups.source;
}

test("saving an item remains browser-local", async () => {
  const form = itemFormSource(await applicationSource());
  const submit = form.match(
    /dom\('itemForm'\)\.addEventListener\('submit',[\s\S]+?(?=\n    dom\('itemDeleteBtn'\))/,
  );

  assert.ok(submit, "item submit handler must remain inspectable");
  assert.doesNotMatch(submit[0], /fetch\(/);
  assert.doesNotMatch(submit[0], /geocode\(/);
  assert.match(submit[0], /saveState\(/);
});

test("public Nominatim geocoding stays disabled without a governed provider port", async () => {
  const application = await applicationSource();
  const form = itemFormSource(application);

  assert.doesNotMatch(application, /nominatim\.openstreetmap\.org/i);
  assert.doesNotMatch(application, /function geocode\(/);
  assert.doesNotMatch(form, /itemGeocodeBtn/);
});

test("manual coordinates remain available without an external request", async () => {
  const form = itemFormSource(await applicationSource());

  assert.match(form, /좌표 직접 입력\(선택\)/);
  assert.match(form, /id="itemLat"[^>]*type="number"/);
  assert.match(form, /id="itemLng"[^>]*type="number"/);
});
