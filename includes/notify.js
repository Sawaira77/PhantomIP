const axios = require("axios");

async function sendDiscordNotification(webhookUrl, ip, geo, latency) {
  if (!webhookUrl) return;
  try {
    await axios.post(webhookUrl, {
      content: `🔄 **IP Rotated** → \`${ip}\` | 📍 ${geo.city}, ${geo.country} | ⚡ ${latency ? latency + "ms" : "N/A"}`
    });
  } catch {
    // silent fail
  }
}

module.exports = { sendDiscordNotification };
