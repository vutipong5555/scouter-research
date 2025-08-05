// index.js - Scouter Agent v2.4 (Based on v2.1 success case + Live SerpAPI integration)
const express = require("express");
const app = express();
app.use(express.json());

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post("/", async (req, res) => {
  console.log("[Scouter Agent] Incoming Request:", JSON.stringify(req.body, null, 2));

  // Validate Method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Destructure Body
  const { jobID, taskID, requestedAction, payload } = req.body;
  if (!jobID || !taskID || !requestedAction || !payload || !payload.researchData) {
    console.error("[Scouter Agent] Invalid Payload");
    return res.status(400).json({ error: "Invalid payload structure" });
  }

  const agentName = "Scouter Agent";
  const timestamp = new Date().toISOString();

  const keywords = payload.researchData.keywords || [];
  const serpApiKey = process.env.SERPAPI_KEY;
  let serpResults = [];

  if (serpApiKey && keywords.length > 0) {
    try {
      const query = keywords.join(" ");
      const serpURL = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google&api_key=${serpApiKey}`;
      const serpResponse = await fetch(serpURL);
      const serpData = await serpResponse.json();

      const organicResults = serpData.organic_results || [];

      serpResults = organicResults.slice(0, 5).map((item, index) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet || "",
        rank: index + 1
      }));
    } catch (error) {
      console.error("[Scouter Agent] SerpAPI Fetch Error:", error.message);
    }
  }

  const response = {
    statusCode: 200,
    jobID,
    taskID,
    agent: agentName,
    timestamp,
    insights: serpResults.map(r => r.snippet),
    sourceLinks: serpResults.map(r => ({ title: r.title, url: r.url })),
    priorityScore: serpResults.map(r => 100 - r.rank * 10)
  };

  console.log("[Scouter Agent] Outgoing Response:", JSON.stringify(response, null, 2));
  res.status(200).json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[Scouter Agent] Listening on port ${PORT}`);
});
