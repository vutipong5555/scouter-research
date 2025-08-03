const express = require("express");
const app = express();
app.use(express.json()); // ✅ รองรับ JSON Body

const AGENT_NAME = "Scouter Agent (Beta)";

app.post("/api", (req, res) => {
  console.log("🔹 Incoming Request:", req.body);

  try {
    const { jobID, taskID, requestedAction, payload } = req.body;

    // ✅ Validate Payload
    if (!jobID || !taskID || !requestedAction || !payload) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: jobID, taskID, requestedAction, payload",
      });
    }

    // ✅ Mock Research Data (ตัวอย่าง)
    const researchData = {
      insights: [
        "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
        "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
        "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์",
      ],
      keywords: ["lycopene supplement", "skin health", "antioxidant"],
      competitorBrands: ["Brand A", "Brand B", "Brand C"],
      sourceLinks: [
        { title: "Supplement Market Growth Report", url: "https://example.com/report1" },
        { title: "Consumer Trends in Health Products", url: "https://example.com/report2" },
      ],
    };

    const response = {
      jobID,
      taskID,
      requestedAction,
      status: "success",
      agentName: AGENT_NAME,
      timestamp: new Date().toISOString(),
      researchData,
    };

    console.log("✅ Sending Response:", response);
    return res.status(200).json(response);
  } catch (err) {
    console.error("❌ Scouter Agent Error:", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// ✅ รองรับ GET สำหรับทดสอบ
app.get("/", (req, res) => {
  res.send("Scouter Agent (Beta) is running 🚀");
});

// ✅ ใช้พอร์ตที่ Vercel กำหนด
app.listen(3000, () => console.log(`✅ ${AGENT_NAME} Ready on port 3000`));

module.exports = app;
