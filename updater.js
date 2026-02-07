import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";

// NASA source page (Watch the Skies)
const NASA_URL =
  "https://www.nasa.gov/blogs/watch-the-skies/2026/01/16/most-notable-2026-astronomical-events-a-year-of-watching-the-skies/";

const OUTPUT_FILE = path.join("public", "data", "events.json");

// Helper: ensure folder exists
function ensureFolder() {
  const dir = path.join("public", "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeDate(text) {
  // This is a simple helper.
  // NASA articles sometimes provide dates like "March 3" etc.
  // We'll store "rawDateText" for display; you can improve conversion later.
  return text.replace(/\s+/g, " ").trim();
}

async function fetchNasaEvents() {
  console.log("🔄 Fetching NASA events...");

  const res = await axios.get(NASA_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = res.data;
  const $ = cheerio.load(html);

  // Extract all paragraphs and list items for scanning
  const contentText = [];
  $("p, li").each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 30) contentText.push(t);
  });

  // Very practical rule:
  // Keep lines that look like events
  // Example patterns: "Feb. 28: ..." or "March 3 — ..."
  const eventLines = contentText.filter((line) => {
    return (
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(line) &&
      /:|—|-/.test(line) &&
      line.length < 220
    );
  });

  // Convert lines into structured events
  const events = eventLines.slice(0, 15).map((line, index) => {
    // Split by ":" or "—" or "-"
    let parts = line.split(":");
    if (parts.length < 2) parts = line.split("—");
    if (parts.length < 2) parts = line.split("-");

    const rawDate = parts[0] ? parts[0].trim() : "Unknown Date";
    const rest = parts.slice(1).join(" ").trim();

    // Title = first part of description (up to first period)
    let title = rest;
    if (rest.includes(".")) {
      title = rest.split(".")[0].trim();
    }

    // Keep short description
    const desc =
      rest.length > 180 ? rest.slice(0, 180).trim() + "..." : rest;

    return {
      id: index + 1,
      source: "NASA Watch the Skies",
      rawDateText: normalizeDate(rawDate),
      title: title || "Astronomy Event",
      description: desc,
      url: NASA_URL,
      updatedAt: new Date().toISOString()
    };
  });

  return events;
}

async function updateEventsJson() {
  ensureFolder();

  try {
    const events = await fetchNasaEvents();

    const payload = {
      lastUpdated: new Date().toISOString(),
      sourceUrl: NASA_URL,
      events
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf-8");

    console.log(`✅ Updated events.json with ${events.length} items`);
  } catch (err) {
    console.error("❌ Failed to update events:", err.message);
  }
}

// Run once when called
updateEventsJson();
