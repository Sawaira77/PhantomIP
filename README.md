# 👻 PhantomIP — Tor-Based IP Rotation CLI Tool

A privacy CLI tool built in Node.js that rotates your public IP address using the Tor network. Built from scratch on Kali Linux.

## ✨ Features
- 🧅 Tor-based IP rotation
- 🌍 Real-time GeoIP tracking with country flags
- ⚡ Latency measurement per circuit
- 📊 Live web dashboard at localhost:3000
- 📁 IP history logging
- 🌐 Auto browser launch with Tor proxy
- 🎯 Target country filtering
- 💬 Discord notifications support

## 🛠️ Tech Stack
- Node.js · Tor Network · Express.js · Socket.io · Axios · cli-table3 · figlet · chalk

## 🔧 Installation

### 1. Install Tor
sudo apt install tor -y

### 2. Configure Tor
Add to /etc/tor/torrc:
ControlPort 9051
CookieAuthentication 0

Then restart Tor:
sudo systemctl restart tor

### 3. Clone the repo
git clone https://github.com/Sawaira77/PhantomIP.git
cd PhantomIP

### 4. Install dependencies
npm install
npm install chalk@4

## 🚀 Usage
node ipchanger.js -s 10

## ⚙️ Runtime Controls
| Action | Result |
|--------|--------|
| Type a number + Enter | Change rotation interval |
| Type x + Enter | Exit the tool |

## 🌐 Dashboard
Open browser at: http://localhost:3000

## 📁 View IP History
cat ip_history.log

## ⚠️ Disclaimer
This tool is for educational and privacy purposes only.
Use responsibly and legally.

## 👨‍💻 Built by bigboss
