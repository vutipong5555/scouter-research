// index.js - Scouter Agent Beta v1.9 (Production Ready)

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🔧 Middleware: Validate incoming payload
function validatePayload(req, res, next) {
  const { jobID, taskID, requestedAction, payload } = req.body;

  if (!jobID || !taskID || !requestedAction || !payload) {
    console.error("❌ Missing required fields in payload:", req.body);
    return res.status(400).json({ 
      status: "error",
      message: "Missing required fields: jobID, taskID, requestedAction, or payload"
    });
  }

  if (!payload.topic || !payload.audience || !payload.region) {
    console.error("❌ Missing required payload fields:", payload);
    return res.status(400).json({ 
      status: "error",
      message: "Missing fields in payload: topic, audience, or region"
    });
  }

  next();
}

// 🧠 Mock function to simulate research insight (replace with SerpAPI call later)
function generateMockInsight(payload) {
  return {
    jobID: req.body.jobID,
    taskID: req.body.taskID,
    requestedAction: req.body.requestedAction,
    agentName: "Scouter Agent",
    timestamp: new Date().toISOString(),
    researchData: {
      insights: [
        `ตลาด ${payload.topic} เติบโตขึ้นในกลุ่ม ${payload.audience}`,
        `กลุ่มเป้าหมายในภูมิภาค ${payload.region} ให้ความสำคัญกับความน่าเชื่อถือของแบรนด์`,
        `พฤติกรรมการค้นหาเกี่ยวกับ '${payload.topic}' เพิ่มขึ้นในไตรมาสที่ผ่านมา`
      ],
      keywords: [payload.topic, payload.audience, payload.region],
      competitorBrands: ["Brand A", "Brand B", "Brand C"],
      sourceLinks: [
        {
          title: "Google Trends - Supplement in Thailand",
          url: "https://trends.google.com"
        },
        {
          title: "Pantip - คนพูดถึงอาหารเสริมอะไรบ้าง",
          url: "https://pantip.com"
        }
      ],
      priorityScore: 8.5
    }
  };
}

// 📥 POST Endpoint
app.post('/', validatePayload, (req, res) => {
  try {
    console.log("✅ Received payload:", JSON.stringify(req.body, null, 2));

    const { payload } = req.body;
    const mockResponse = generateMockInsight(payload);

    console.log("📤 Sending response:", JSON.stringify(mockResponse, null, 2));
    return res.status(200).json(mockResponse);

  } catch (err) {
    console.error("🔥 Internal Server Error:", err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message
    });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Scouter Agent Beta v1.9 is running on port ${PORT}`);
});
