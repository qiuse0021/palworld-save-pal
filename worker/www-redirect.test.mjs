import assert from "node:assert/strict";
import test from "node:test";
import worker from "./www-redirect.mjs";

test("redirects the www homepage to the canonical origin", async () => {
  const response = await worker.fetch(
    new Request("https://www.palworldsaveeditor.org/"),
  );

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://palworldsaveeditor.org/",
  );
});

test("preserves the path and query string", async () => {
  const response = await worker.fetch(
    new Request(
      "https://www.palworldsaveeditor.org/wiki/pals?sort=name&page=2",
    ),
  );

  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get("location"),
    "https://palworldsaveeditor.org/wiki/pals?sort=name&page=2",
  );
});

test("rejects requests for an unexpected hostname", async () => {
  const response = await worker.fetch(
    new Request("https://palworldsaveeditor.org/"),
  );

  assert.equal(response.status, 404);
});
