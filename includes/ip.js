const axios = require("axios");
const net = require("net");
const { SocksProxyAgent } = require("socks-proxy-agent");

async function getPublicIP() {
  const agent = new SocksProxyAgent("socks5://127.0.0.1:9050");
  const res = await axios.get("https://api.ipify.org?format=json", {
    httpAgent: agent,
    httpsAgent: agent,
    timeout: 10000
  });
  return res.data.ip;
}

async function getGeoInfo(ip) {
  try {
    const agent = new SocksProxyAgent("socks5://127.0.0.1:9050");
    const res = await axios.get(`http://ip-api.com/json/${ip}`, {
      httpAgent: agent,
      httpsAgent: agent,
      timeout: 10000
    });
    return {
      country: res.data.country || "Unknown",
      countryCode: res.data.countryCode || "??",
      city: res.data.city || "Unknown",
      isp: res.data.isp || "Unknown",
      lat: res.data.lat || 0,
      lon: res.data.lon || 0
    };
  } catch {
    return { country: "Unknown", countryCode: "??", city: "Unknown", isp: "Unknown", lat: 0, lon: 0 };
  }
}

function rotateTorCircuit() {
  return new Promise((resolve, reject) => {
    const client = net.connect(9051, "127.0.0.1", () => {
      client.write('AUTHENTICATE ""\r\nSIGNAL NEWNYM\r\nQUIT\r\n');
    });
    client.on("data", () => { client.destroy(); resolve(); });
    client.on("error", reject);
  });
}

async function pingLatency() {
  const agent = new SocksProxyAgent("socks5://127.0.0.1:9050");
  const start = Date.now();
  try {
    await axios.get("https://www.google.com", {
      httpAgent: agent,
      httpsAgent: agent,
      timeout: 8000
    });
    return Date.now() - start;
  } catch {
    return null;
  }
}

module.exports = { getPublicIP, getGeoInfo, rotateTorCircuit, pingLatency };
