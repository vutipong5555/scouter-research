const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware: parse JSON ก่อนถึง route
app.use(express.json());

// ✅ Route หลักสำหรับ Scouter Agent
app.post("/", (req, res) => {
  console.log("🔹 [DEBUG] Raw Request Body:", req.body);

  const { jobID, taskID, requestedAction, payload } = req.body;

  // ✅ Validation: ตรวจสอบ field ที่จำเป็น
  if (!jobID || !taskID || !requestedAction) {
    console.error("❌ [ERROR] Missing required fields");
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: jobID, taskID, requestedAction",
      receivedBody: req.body,
    });
  }

  // ✅ Mock Response (ยังไม่เรียก API จริง)
  const response = {
    jobID,
    taskID,
    requestedAction,
    status: "success",
    timestamp: new Date().toISOString(),
    agentName: "Scouter Agent (Beta)",
    researchData: {
      insights: [
        "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
        "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
        "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์",
      ],
      keywords: ["lycopene supplement", "skin health", "antioxidant"],
      competitorBrands: ["Brand A", "Brand B", "Brand C"],
      sourceLinks: [
        {
          title: "Market Growth Report 2025",
          url: "https://example.com/market-growth-2025",
        },
        {
          title: "Consumer Trends in Supplements",
          url: "https://example.com/consumer-trends",
        },
      ],
    },
  };

  console.log("✅ [DEBUG] Response to Node 5:", response);
  return res.status(200).json(response);
});

// ✅ Health Check (สำหรับทดสอบ GET)
app.get("/", (req, res) => {
  res.send("Scouter Agent Beta v1.1 is running ✅");
});

app.listen(PORT, () => {
  console.log(`🚀 Scouter Agent Beta v1.1 running on port ${PORT}`);
});
