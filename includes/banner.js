const figlet = require("figlet");
const chalk = require("chalk");
const Table = require("cli-table3");

function showBanner() {
  console.log(chalk.cyan(figlet.textSync("IP Changer", { horizontalLayout: "full" })));
  console.log(chalk.gray("                          Built by BIGBOSS| Privacy Tool\n"));
}

function showInfoTable(interval, country) {
  const table = new Table({
    head: [chalk.cyan("Service"), chalk.cyan("Information")]
  });
  table.push(
    ["Tor Status", chalk.green("Tor service started")],
    ["IP Rotation", `Every ${interval} sec`],
    ["Target Country", country ? chalk.yellow(country) : chalk.gray("Any")],
    ["Dashboard", chalk.blue("http://localhost:3000")],
    ["Terminate", "Press X + Enter"]
  );
  console.log(table.toString());
}

module.exports = { showBanner, showInfoTable };
