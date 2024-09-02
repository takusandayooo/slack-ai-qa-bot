import { build } from "esbuild";
import { GasPlugin } from "esbuild-gas-plugin";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  target: "es2019",
  outfile: "build/index.js",
  plugins: [GasPlugin],
})
.catch(() => process.exit(1));