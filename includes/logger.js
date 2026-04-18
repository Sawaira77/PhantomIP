const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../ip_history.log");

function logIP(ip, geo, latency) {
  const time = new Date().toISOString();
  const flag = getFlagEmoji(geo.countryCode);
  const entry = `[${time}] IP: ${ip} | ${flag} ${geo.country}, ${geo.city} | ISP: ${geo.isp} | Latency: ${latency ? latency + "ms" : "N/A"}\n`;
  fs.appendFileSync(logFile, entry);
}

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode === "??") return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join("");
}

module.exports = { logIP, getFlagEmoji };
