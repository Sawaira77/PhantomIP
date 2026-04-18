const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

let io;
const history = [];

function startDashboard(port = 3000) {
  const app = express();
  const server = http.createServer(app);
  io = new Server(server);

  app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>IP Changer Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #00ff88; font-family: monospace; padding: 20px; }
    h1 { color: #00ffcc; font-size: 2em; margin-bottom: 20px; text-align: center; }
    #current { background: #111; border: 1px solid #00ff88; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center; }
    #current .ip { font-size: 2.5em; color: #00ffcc; }
    #current .meta { color: #aaa; margin-top: 8px; }
    #current .latency { color: #ffcc00; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #111; color: #00ffcc; padding: 10px; border: 1px solid #333; }
    td { padding: 8px 10px; border: 1px solid #222; color: #ccc; }
    tr:hover td { background: #111; }
    #count { color: #ffcc00; text-align: center; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>🔄 IP Changer Dashboard</h1>
  <div id="current">
    <div class="ip" id="ip">Loading...</div>
    <div class="meta" id="meta">Waiting for first rotation...</div>
    <div class="latency" id="latency"></div>
  </div>
  <div id="count">Total Rotations: <span id="rotations">0</span></div>
  <table>
    <thead><tr><th>#</th><th>Time</th><th>IP</th><th>Country</th><th>City</th><th>ISP</th><th>Latency</th></tr></thead>
    <tbody id="history"></tbody>
  </table>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    let count = 0;
    socket.on("ipUpdate", (data) => {
      count++;
      document.getElementById("ip").textContent = data.ip;
      document.getElementById("meta").textContent = data.flag + " " + data.country + ", " + data.city + " | ISP: " + data.isp;
      document.getElementById("latency").textContent = "⚡ Latency: " + (data.latency ? data.latency + "ms" : "N/A");
      document.getElementById("rotations").textContent = count;
      const tbody = document.getElementById("history");
      const row = document.createElement("tr");
      row.innerHTML = "<td>" + count + "</td><td>" + data.time + "</td><td>" + data.ip + "</td><td>" + data.flag + " " + data.country + "</td><td>" + data.city + "</td><td>" + data.isp + "</td><td>" + (data.latency ? data.latency + "ms" : "N/A") + "</td>";
      tbody.insertBefore(row, tbody.firstChild);
    });
  </script>
</body>
</html>`);
  });

  io.on("connection", () => {
    history.forEach(h => io.emit("ipUpdate", h));
  });

  server.listen(port, () => {
    console.log(`🌐 Dashboard running at http://localhost:${port}`);
  });
}

function emitUpdate(data) {
  history.push(data);
  if (io) io.emit("ipUpdate", data);
}

module.exports = { startDashboard, emitUpdate };
