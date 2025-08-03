import fetch from "node-fetch"; // ใช้ fetch เพื่อเรียก API ภายนอก

export default async function handler(req, res) {
  const startTime = Date.now();

  // ✅ รองรับเฉพาะ POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    // ✅ Parse Body (ตรวจสอบว่ามี JSON จริง)
    const { jobID, taskID, requestedAction, payload } = req.body || {};
    if (!jobID || !taskID || !requestedAction || !payload?.researchData) {
      return res.status(400).json({
        status: "error",
        message: "Invalid payload format. Expected jobID, taskID, requestedAction, and payload.researchData",
      });
    }

    console.log("✅ Incoming Payload:", JSON.stringify(payload, null, 2));

    // ✅ ดึง researchData จาก payload
    const { researchData } = payload;

    // 🟡 ตัวอย่างการค้นหา (ใน Production จะเชื่อม SerpAPI / Perplexity)
    const mockInsights = [
      "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
      "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
      "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์",
    ];

    const mockKeywords = ["lycopene supplement", "skin health", "antioxidant"];
    const mockCompetitors = ["Brand A", "Brand B", "Brand C"];
    const mockSources = [
      { title: "Global Supplement Market 2025", url: "https://example.com/report2025" },
      { title: "Consumer Trends 2025", url: "https://example.com/consumer2025" },
    ];

    // ✅ สร้าง priority score (mock)
    const priorityScores = mockInsights.map((insight, index) => ({
      insight,
      score: (10 - index).toFixed(1),
    }));

    // ✅ Response Object
    const responsePayload = {
      jobID,
      taskID,
      requestedAction,
      agentName: "Scouter",
      status: "success",
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      researchData: {
        insights: mockInsights,
        keywords: mockKeywords,
        competitorBrands: mockCompetitors,
        sourceLinks: mockSources,
        priorityScores,
      },
    };

    console.log("✅ Scouter Response:", JSON.stringify(responsePayload, null, 2));
    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error("❌ Scouter Agent Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Scouter Agent Failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
