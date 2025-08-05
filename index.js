// index.js — Scouter Agent v2.2 (Live SerpAPI + based on v2.1)

const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const AGENT_NAME = "Scouter";
const SERP_API_KEY = process.env.SERP_API_KEY; // ต้องใส่ใน .env บน Vercel
const SERP_API_URL = "https://serpapi.com/search.json";

function generateTimestamp() {
  return new Date().toISOString();
}

function validatePayload(body) {
  const { jobID, taskID, requestedAction, payload } = body;
  return jobID && taskID && requestedAction && payload;
}

async function fetchFromSerpAPI(query) {
  try {
    const { data } = await axios.get(SERP_API_URL, {
      params: {
        q: query,
        api_key: SERP_API_KEY,
        engine: "google",
        num: 5
      }
    });

    return data.organic_results?.map((item, index) => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      rank: index + 1
    })) || [];

  } catch (error) {
    console.warn("[WARN] SerpAPI failed:", error.message);
    return [];
  }
}

app.post("/", async (req, res) => {
  console.log("[DEBUG] Incoming request:", JSON.stringify(req.body, null, 2));

  if (!validatePayload(req.body)) {
    return res.status(400).json({ error: "Invalid payload structure." });
  }

  const { jobID, taskID, requestedAction, payload } = req.body;
  const { researchData = [] } = payload;

  let insightData = [];
  let sourceLinks = [];

  for (const item of researchData) {
    const results = await fetchFromSerpAPI(item);

    insightData.push({
      topic: item,
      insights: results.map((r) => r.snippet),
      priorityScore: results.length > 0 ? 10 : 0
    });

    sourceLinks.push(
      ...results.map(({ title, url }) => ({ title, url }))
    );
  }

  const response = {
    status: "success",
    agentName: AGENT_NAME,
    timestamp: generateTimestamp(),
    insightData,
    sourceLinks
  };

  console.log("[DEBUG] Sending response:", JSON.stringify(response, null, 2));
  res.status(200).json(response);
});

app.use((req, res) => {
  res.status(405).json({ error: "Method Not Allowed" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Scouter Agent v2.2 is running on port ${PORT}`);
});
