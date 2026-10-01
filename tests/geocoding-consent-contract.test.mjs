import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function applicationSource() {
  return readFile("index.html", "utf8");
}

function itemFormSource(application) {
  const match = application.match(
    /function openItemForm\(itemId=''\)\{(?<source>[\s\S]+?)\n  function bindChoiceChips/,
  );
  assert.ok(match?.groups?.source, "openItemForm source must remain inspectable");
  return match.groups.source;
}

test("saving an item never sends its place or name to geocoding", async () => {
  const form = itemFormSource(await applicationSource());
  const submit = form.match(
    /dom\('itemForm'\)\.addEventListener\('submit',[\s\S]+?(?=\n    dom\('itemGeocodeBtn'\))/,
  );

  assert.ok(submit, "item submit handler must precede the explicit lookup handler");
  assert.doesNotMatch(submit[0], /geocode\(/);
  assert.doesNotMatch(submit[0], /nominatim\.openstreetmap\.org/);
});

test("geocoding requires a disclosed, explicit user action", async () => {
  const application = await applicationSource();
  const form = itemFormSource(application);

  assert.match(
    form,
    /<button id="itemGeocodeBtn"[^>]*type="button"[^>]*>위치 조회<\/button>/,
  );
  assert.match(
    form,
    /입력한 장소 또는 일정 이름을 [\s\S]+OpenStreetMap Nominatim[\s\S]+으로 전송/,
  );
  assert.match(form, /https:\/\/operations\.osmfoundation\.org\/policies\/nominatim\//);
  assert.match(form, /id="itemGeocodeStatus"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(
    form,
    /dom\('itemGeocodeBtn'\)\.addEventListener\('click',async \(\)=>\{[\s\S]+await geocode\(query\)/,
  );
});

test("explicit lookup exposes recoverable status without duplicate requests", async () => {
  const application = await applicationSource();
  const form = itemFormSource(application);

  assert.match(form, /button\.disabled=true/);
  assert.match(form, /button\.setAttribute\('aria-busy','true'\)/);
  assert.match(form, /button\.removeAttribute\('aria-busy'\)/);
  assert.match(form, /result\.status==='success'/);
  assert.match(form, /result\.status==='not_found'/);
  assert.match(form, /navigator\.onLine===false/);
  assert.match(form, /다시 시도/);
  assert.match(application, /1000-\(Date\.now\(\)-lastGeocodeAt\)/);
  assert.match(application, /format=json&limit=1&accept-language=ko/);
  assert.match(application, /referrerPolicy:'strict-origin-when-cross-origin'/);
  assert.match(
    application,
    /return \{status:'success',lat:Number\(rows\[0\]\.lat\),lng:Number\(rows\[0\]\.lon\)\}/,
  );
  assert.match(application, /return \{status:'not_found'\}/);
  assert.match(application, /return \{status:'error'\}/);
});

test("lookup results cannot update a closed or changed form", async () => {
  const form = itemFormSource(await applicationSource());
  const lookup = form.match(
    /dom\('itemGeocodeBtn'\)\.addEventListener\('click',async \(\)=>\{[\s\S]+?\n    \}\);/,
  );

  assert.ok(lookup, "explicit lookup handler must remain inspectable");
  assert.match(lookup[0], /await geocode\(query\)[\s\S]+if\(!button\.isConnected\) return/);
  assert.match(lookup[0], /currentQuery!==query/);
  assert.match(lookup[0], /검색어가 바뀌었어요[\s\S]+다시 조회/);
});
