// index.js - Scouter Agent v2.2 with Live SerpAPI Integration

const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

app.use(express.json());

app.post("/", async (req, res) => {
  const { method } = req;
  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("🔍 [Scouter] Incoming Request:", JSON.stringify(req.body, null, 2));

  const { jobID, taskID, requestedAction, payload } = req.body;

  // ✅ Validate required fields
  if (!jobID || !taskID || !requestedAction || !payload || !payload.researchData) {
    console.error("❌ Missing required fields in payload");
    return res.status(400).json({ error: "Missing required fields in payload" });
  }

  const { researchData } = payload;
  const { topic, targetAudience, objective, scope } = researchData;

  if (!topic || !targetAudience || !objective || !scope) {
    console.error("❌ Incomplete researchData structure");
    return res.status(400).json({ error: "Incomplete researchData in payload" });
  }

  // ✅ Process the research request
  if (requestedAction === "performResearch") {
    try {
      const query = `${topic} ${targetAudience} ${objective} ${scope}`;
      console.log("🔎 Searching on SerpAPI with query:", query);

      const serpResponse = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "google",
          q: query,
          api_key: process.env.SERPAPI_KEY,
          num: 5
        }
      });

      const organicResults = serpResponse.data.organic_results || [];
      const insights = organicResults.slice(0, 3).map(result => result.snippet || "");
      const sourceLinks = organicResults.map(result => ({
        title: result.title,
        url: result.link
      }));

      const responseData = {
        jobID,
        taskID,
        requestedAction,
        status: "success",
        timestamp: new Date().toISOString(),
        agentName: "Scouter Agent",
        insightData: {
          insights,
          sourceLinks
        }
      };

      console.log("✅ [Scouter] Response Ready:", JSON.stringify(responseData, null, 2));
      return res.status(200).json(responseData);

    } catch (error) {
      console.error("❌ SerpAPI Error:", error.message);
      return res.status(500).json({
        error: "Failed to fetch data from SerpAPI",
        detail: error.message
      });
    }
  } else {
    return res.status(400).json({ error: "Unsupported requestedAction" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Scouter Agent v2.2 running on port ${PORT}`);
});
