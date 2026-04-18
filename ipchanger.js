#!/usr/bin/env node
const { showBanner, showInfoTable } = require("./includes/banner");
const { getPublicIP, getGeoInfo, rotateTorCircuit, pingLatency } = require("./includes/ip");
const { ensureTorRunning, launchBrowser } = require("./includes/utils");
const { logIP, getFlagEmoji } = require("./includes/logger");
const { sendDiscordNotification } = require("./includes/notify");
const { startDashboard, emitUpdate } = require("./includes/dashboard");
const readline = require("readline");
const chalk = require("chalk");

// ── Config ─────────────────────────────────────────
const DISCORD_WEBHOOK = "";  // optional: paste Discord webhook URL
const TARGET_COUNTRY = "";   // optional: e.g. "US" for US exit nodes only
// ───────────────────────────────────────────────────

const args = process.argv.slice(2);
let interval = 10;

showBanner();

if (args.includes("-h")) {
  console.log("Usage:\n  node ipchanger.js -s <seconds>\n  node ipchanger.js -h");
  process.exit(0);
}

const sIndex = args.indexOf("-s");
if (sIndex !== -1 && args[sIndex + 1]) {
  interval = parseInt(args[sIndex + 1]);
}

ensureTorRunning();
startDashboard(3000);
showInfoTable(interval, TARGET_COUNTRY);
launchBrowser();

async function rotate() {
  try {
    await rotateTorCircuit();

    let ip, geo;
    let attempts = 0;

    do {
      ip = await getPublicIP();
      geo = await getGeoInfo(ip);
      attempts++;
      if (TARGET_COUNTRY && geo.countryCode !== TARGET_COUNTRY && attempts < 5) {
        await rotateTorCircuit();
        await new Promise(r => setTimeout(r, 2000));
      } else break;
    } while (true);

    const latency = await pingLatency();
    const flag = getFlagEmoji(geo.countryCode);
    const time = new Date().toLocaleTimeString();

    console.log(
      chalk.gray(`[${time}]`) +
      chalk.cyan(` Current IP → `) +
      chalk.green(ip) +
      chalk.yellow(` | ${flag} ${geo.country}, ${geo.city}`) +
      chalk.magenta(` | ⚡ ${latency ? latency + "ms" : "N/A"}`)
    );

    logIP(ip, geo, latency);
    emitUpdate({ ip, time, country: geo.country, countryCode: geo.countryCode, city: geo.city, isp: geo.isp, latency, flag });
    await sendDiscordNotification(DISCORD_WEBHOOK, ip, geo, latency);

  } catch (err) {
    console.log(chalk.red("⚠️  warning: " + err.message));
  }
}

let timer = setInterval(rotate, interval * 1000);
rotate();

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", (input) => {
  const trimmed = input.trim();
  if (trimmed.toLowerCase() === "x") {
    console.log(chalk.red("👋 Exiting..."));
    clearInterval(timer);
    process.exit(0);
  } else if (!isNaN(trimmed) && trimmed !== "") {
    interval = parseInt(trimmed);
    clearInterval(timer);
    timer = setInterval(rotate, interval * 1000);
    console.log(chalk.yellow(`⏱  Interval changed to ${interval} seconds`));
  }
});
