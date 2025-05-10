import { getProgressPercent } from "../utils/progress.js";
// const { getProgressPercent } = require("../utils/progress");

test("progress calculation", () => {
  expect(getProgressPercent(50, 100)).toBe(50);
  expect(getProgressPercent(0, 100)).toBe(0);
  expect(getProgressPercent(10, 0)).toBe(0); // avoid NaN
});
