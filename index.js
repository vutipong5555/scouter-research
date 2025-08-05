// ✅ Scouter Agent Beta v1.1 (Production Ready + SerpAPI)
// By Dr.Wise

const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// 🟡 ตั้งค่า SerpAPI Key (ใช้ process.env ใน Production จริง)
const SERP_API_KEY = "YOUR_SERPAPI_KEY_HERE";
const AGENT_NAME = "Scouter";

// ✅ Validation Function
function validatePayload(payload) {
  const requiredFields = ["jobID", "taskID", "requestedAction", "payload"];
  for (const field of requiredFields) {
    if (!payload[field]) return `Missing field: ${field}`;
  }
  return null;
}

// ✅ SerpAPI Search Function
async function searchWithSerpAPI(query) {
  try {
    const params = {
      api_key: SERP_API_KEY,
      engine: "google",
      q: query,
      hl: "en",
      gl: "us"
    };
    const response = await axios.get("https://serpapi.com/search", { params });
    const results = response.data.organic_results || [];

    return results.slice(0, 3).map((item, index) => ({
      rank: index + 1,
      title: item.title,
      link: item.link,
      snippet: item.snippet || ""
    }));
  } catch (error) {
    console.error("❌ SerpAPI Error:", error.message);
    return [];
  }
}

// ✅ Main POST Endpoint
app.post("/", async (req, res) => {
  const payload = req.body;
  const error = validatePayload(payload);

  console.log("🔍 Incoming Payload:", JSON.stringify(payload, null, 2));

  if (error) {
    console.warn("⚠️ Payload validation failed:", error);
    return res.status(400).json({ error });
  }

  const { jobID, taskID, requestedAction, payload: innerPayload } = payload;

  // 🟢 ใช้ query จาก researchData (mock) หรือ fallback keyword
  const query = innerPayload?.researchData?.keywords?.join(" ") || "AI market trend";
  const serpResults = await searchWithSerpAPI(query);

  // 🟢 Response Format
  const responseBody = {
    jobID,
    taskID,
    requestedAction,
    status: "success",
    timestamp: new Date().toISOString(),
    agentName: AGENT_NAME,
    researchData: {
      insights: serpResults.map(r => r.snippet),
      sources: serpResults.map(r => ({ title: r.title, url: r.link })),
      raw: serpResults
    }
  };

  console.log("✅ Response to Node 5:", JSON.stringify(responseBody, null, 2));
  res.status(200).json(responseBody);
});

// ✅ Start Server (for local test only)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Scouter Agent Beta v1.1 running on port ${PORT}`);
});
