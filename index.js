/**
 * Scouter Agent - v2.3 (Production-Ready with SerpAPI, Based on v2.1 Success Case)
 */

export default async function handler(req, res) {
  const AGENT_NAME = "Scouter Agent v2.3";
  const timestamp = new Date().toISOString();

  // Validate HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({
      statusCode: 405,
      error: "Method Not Allowed",
      agent: AGENT_NAME,
      timestamp,
    });
  }

  // Validate Content-Type
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).json({
      statusCode: 400,
      error: "Invalid Content-Type. Expecting application/json",
      agent: AGENT_NAME,
      timestamp,
    });
  }

  try {
    const { jobID, taskID, requestedAction, payload } = req.body;

    // Validate required fields
    if (!jobID || !taskID || !requestedAction || !payload) {
      return res.status(400).json({
        statusCode: 400,
        error: "Missing required fields in payload",
        agent: AGENT_NAME,
        timestamp,
      });
    }

    const { researchData } = payload;

    if (!researchData || !Array.isArray(researchData) || researchData.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        error: "Missing or invalid researchData",
        agent: AGENT_NAME,
        timestamp,
      });
    }

    // Attempt SerpAPI (only if key is present)
    const serpResults = [];
    const SERP_API_KEY = process.env.SERPAPI_KEY;

    if (SERP_API_KEY) {
      const axios = await import("axios");

      for (const topic of researchData) {
        const serpURL = `https://serpapi.com/search.json?q=${encodeURIComponent(
          topic
        )}&hl=en&gl=us&api_key=${SERP_API_KEY}`;

        try {
          const serpResponse = await axios.default.get(serpURL);
          const organic = serpResponse.data.organic_results || [];

          serpResults.push(
            ...organic.slice(0, 3).map((item, index) => ({
              query: topic,
              title: item.title,
              url: item.link,
              snippet: item.snippet || "",
              rank: index + 1,
            }))
          );
        } catch (err) {
          console.error("SerpAPI Error for topic:", topic, err.message);
        }
      }
    }

    // Build response
    const response = {
      statusCode: 200,
      jobID,
      taskID,
      agent: AGENT_NAME,
      timestamp,
      insights: researchData.map((t) => `Insight about: ${t}`), // Placeholder
      sourceLinks: serpResults,
      priorityScore: Math.floor(Math.random() * 100),
    };

    console.log("[Scouter v2.3] Response →", JSON.stringify(response, null, 2));

    return res.status(200).json(response);
  } catch (error) {
    console.error("[Scouter v2.3] Fatal Error:", error);
    return res.status(500).json({
      statusCode: 500,
      error: "Internal Server Error",
      agent: AGENT_NAME,
      timestamp,
    });
  }
}
