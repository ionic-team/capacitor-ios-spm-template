import utilsFSPkg from "@ionic/utils-fs";
import { join, resolve } from "node:path";

const { readFile, writeFile } = utilsFSPkg;

const platformDir = process.env["INIT_CWD"];
const config = JSON.parse(process.env["CAPACITOR_CONFIG"]);

const xcodeProjectDir = join(platformDir, "ios", "App", "App.xcodeproj");
const targetDir = join(platformDir, "ios", "App", "App");

const appId = config.appId;
const appName = config.appName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const pbxPath = join(xcodeProjectDir, "project.pbxproj");
const plistPath = resolve(targetDir, "Info.plist");

let plistContent = await readFile(plistPath, { encoding: "utf-8" });

plistContent = plistContent.replace(
    /<key>CFBundleDisplayName<\/key>[\s\S]?\s+<string>([^<]*)<\/string>/,
    `<key>CFBundleDisplayName</key>\n        <string>${appName}</string>`,
);

let pbxContent = await readFile(pbxPath, { encoding: "utf-8" });
pbxContent = pbxContent.replace(
    /PRODUCT_BUNDLE_IDENTIFIER = ([^;]+)/g,
    `PRODUCT_BUNDLE_IDENTIFIER = ${appId}`,
);

await writeFile(plistPath, plistContent, { encoding: "utf-8" });
await writeFile(pbxPath, pbxContent, { encoding: "utf-8" });
