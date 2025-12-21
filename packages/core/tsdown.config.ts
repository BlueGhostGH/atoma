import { defineConfig } from "tsdown";

export default defineConfig({
  format: ["esm", "cjs"],
  sourcemap: true,
  publint: true,
  attw: true,
  platform: "neutral",
});
