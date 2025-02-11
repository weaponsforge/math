import { addition } from "./utils";
import { test, expect } from "vitest";

test("add", () => {
  expect(addition(1, 2)).toBe(3);
});
