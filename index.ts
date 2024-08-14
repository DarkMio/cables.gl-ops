// biome-ignore lint/style/useNodejsImportProtocol: is bun, baka
import { existsSync, readdir, watch } from "fs";

const build = async (file: string) => {
  // prevent deletions
  if (!existsSync(file)) {
    return;
  }
  const start = performance.now();
  await Bun.build({
    entrypoints: [file],
    target: "browser",
    format: "esm",
    outdir: ".\\build",
    // keep it false, without debugger attachment this is a better idea
    minify: false,
  });
  const end = performance.now();
  console.log(
    `+ '${file}' @ ${new Date().toLocaleString("en-GB")} - in ${(end - start).toPrecision(3)}ms`,
  );
};

const sourceFolder = `${import.meta.dir}\\src`;
const ignores = ["build", "node_modules"] as const;
// no recursion, only top level folder entries get buil
const watcher = watch(`${import.meta.dir}\\src`, async (event, filename) => {
  console.debug(`Detected ${event} in ${filename}`);
  if (!filename) {
    return;
  }
  if (ignores.some((x) => filename?.startsWith(x))) {
    return;
  }
  await build(`${sourceFolder}\\${filename}`);
});

readdir(sourceFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  for (const file of files) {
    build(`${sourceFolder}\\${file}`);
  }
});
