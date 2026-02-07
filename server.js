import express from "express";
import cron from "cron";
import { exec } from "child_process";

const app = express();
const PORT = 3000;

// Serve the website from /public
app.use(express.static("public"));

// Run updater at server startup
function runUpdater() {
  console.log("⚡ Running updater...");
  exec("node updater.js", (err, stdout, stderr) => {
    if (err) console.error("Updater error:", err.message);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
}

runUpdater();

// Cron Job: update EVERY DAY at 8:00 AM
const job = new cron.CronJob("0 8 * * *", () => {
  console.log("🕗 Daily update started...");
  runUpdater();
});

job.start();

// Start server
app.listen(PORT, () => {
  console.log(`✅ Website running at http://localhost:${PORT}`);
});
