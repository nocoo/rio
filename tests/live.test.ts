import { describe, expect, it } from "vitest";
import { createLivePayload } from "../src/lib/live";

describe("createLivePayload", () => {
  it("returns the production health contract", () => {
    expect(createLivePayload("0.1.0")).toEqual({
      status: "ok",
      name: "rio",
      version: "0.1.0",
    });
  });
});
