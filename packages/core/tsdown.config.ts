import { defineConfig } from "tsdown";

// oxlint-disable-next-line no-default-export
export default defineConfig({
    format: [
        "esm",
        "cjs",
    ],
    dts: {
        tsgo: true,
    },
    sourcemap: true,
    publint: true,
    attw: true,
    platform: "neutral",
});
