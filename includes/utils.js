const { execSync } = require("child_process");
const open = require("open");

function ensureTorRunning() {
  try {
    execSync("pgrep tor", { stdio: "ignore" });
    console.log("✅ Tor is already running.");
  } catch {
    console.log("🔄 Starting Tor...");
    try {
      execSync("sudo systemctl start tor");
      console.log("✅ Tor started.");
    } catch (e) {
      console.log("❌ Could not start Tor. Run: sudo systemctl start tor");
    }
  }
}

function launchBrowser() {
  try {
    console.log("🌐 Launching Chromium with Tor proxy...");
    open("http://www.google.com", {
      app: { name: "chromium", arguments: ["--proxy-server=socks5://127.0.0.1:9050"] }
    });
  } catch {
    console.log("⚠️  Run manually:\nchromium --proxy-server='socks5://127.0.0.1:9050'");
  }
}

module.exports = { ensureTorRunning, launchBrowser };
