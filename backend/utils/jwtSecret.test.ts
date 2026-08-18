import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveJwtSecret } from "./jwtSecret.js";

describe("resolveJwtSecret", () => {
  it("rejects missing, short, and known placeholders", () => {
    assert.throws(() => resolveJwtSecret(undefined), /JWT_SECRET/);
    assert.throws(() => resolveJwtSecret(""), /JWT_SECRET/);
    assert.throws(() => resolveJwtSecret("change-me"), /JWT_SECRET/);
    assert.throws(() => resolveJwtSecret("change-me-long-random"), /JWT_SECRET/);
    assert.throws(() => resolveJwtSecret("short"), /JWT_SECRET/);
  });

  it("accepts a random secret of at least 32 characters", () => {
    const secret = "a".repeat(32);
    assert.equal(resolveJwtSecret(secret), secret);
    assert.equal(resolveJwtSecret(`  ${secret}  `), secret);
  });
});
