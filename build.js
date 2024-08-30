const { GasPlugin } = require("esbuild-gas-plugin");

require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    target: "es2019",
    outfile: "build/index.js",
    plugins: [GasPlugin],
  })
  .catch(() => process.exit(1));