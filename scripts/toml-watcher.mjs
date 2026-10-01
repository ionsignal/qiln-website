import fs from "fs";
import path from "path";
import * as toml from "toml";
import { validateSiteConfig } from "./config-schema.mjs";

const configFilePath = path.resolve("./src/config/config.toml");
const outputDirectoryPath = path.resolve("./");
const outputFilePath = path.join(outputDirectoryPath, "site-config.json");
const temporaryOutputFilePath = `${outputFilePath}.tmp`;
const isWatchMode = process.argv.includes("--watch");

/**
 * Parse and validate TOML before replacing the application configuration.
 */
function generateSiteConfig() {
  try {
    const sourceContent = fs.readFileSync(configFilePath, "utf8");
    const configuration = validateSiteConfig(toml.parse(sourceContent));
    const generatedContent = JSON.stringify(configuration, null, 2);
    if (
      fs.existsSync(outputFilePath) &&
      fs.readFileSync(outputFilePath, "utf8") === generatedContent
    ) {
      return;
    }
    fs.mkdirSync(outputDirectoryPath, { recursive: true });
    try {
      fs.writeFileSync(temporaryOutputFilePath, generatedContent, "utf8");
      fs.renameSync(temporaryOutputFilePath, outputFilePath);
    } finally {
      fs.rmSync(temporaryOutputFilePath, { force: true });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[toml-watcher] Configuration generation failed: ${message}`);
    if (!isWatchMode) {
      process.exitCode = 1;
    }
  }
}

// Always run once on startup to ensure configuration is in sync with TOML.
generateSiteConfig();

/**
 * Watch the directory because editors may replace the file when saving.
 */
if (isWatchMode) {
  const configFileName = path.basename(configFilePath);
  fs.watch(path.dirname(configFilePath), (_eventType, changedFileName) => {
    if (
      changedFileName === null ||
      changedFileName.toString() === configFileName
    ) {
      generateSiteConfig();
    }
  });
}
