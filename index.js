export default async function handler(req, res) {
  console.log("📥 [Scouter] API Hit at:", new Date().toISOString());
  console.log("📥 [Scouter] HTTP Method:", req.method);

  try {
    // ✅ อนุญาตเฉพาะ POST
    if (req.method !== "POST") {
      console.warn("⚠️ [Scouter] Method Not Allowed:", req.method);
      return res.status(405).json({
        error: true,
        message: "Method Not Allowed. Use POST only.",
      });
    }

    // ✅ อ่าน body (ต้องใช้ await req.json())
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("❌ [Scouter] Failed to parse JSON body:", err.message);
      return res.status(400).json({
        error: true,
        message: "Invalid JSON format in request body.",
      });
    }

    console.log("📦 [Scouter] Incoming Payload:", JSON.stringify(body, null, 2));

    // ✅ ตรวจสอบ field ที่ต้องมี
    const { jobID, taskID, requestedAction, payload } = body;

    if (!jobID || !taskID || !requestedAction || !payload) {
      console.warn("⚠️ [Scouter] Missing required fields");
      return res.status(400).json({
        error: true,
        message: "Missing required fields (jobID, taskID, requestedAction, payload).",
      });
    }

    // ✅ ตรวจสอบว่า payload มี researchData หรือ productName อย่างน้อย 1 อย่าง
    if (!payload.productName && !payload.researchData) {
      console.warn("⚠️ [Scouter] Missing researchData or productName");
      return res.status(400).json({
        error: true,
        message: "Payload must include 'researchData' or 'productName'.",
      });
    }

    // ✅ Logic หลัก (ตอนนี้ยังเป็น mock data – รอเชื่อม SerpAPI/Perplexity)
    const researchData = {
      insights: [
        "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
        "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
        "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์",
      ],
      keywords: ["lycopene supplement", "skin health", "antioxidant"],
      competitorBrands: ["Brand A", "Brand B", "Brand C"],
      sourceLinks: [
        { title: "Supplement Market Report 2024", url: "https://example.com/report" },
        { title: "Consumer Behavior Study", url: "https://example.com/behavior" },
      ],
    };

    console.log("✅ [Scouter] Research Completed Successfully");

    // ✅ ส่ง Response
    return res.status(200).json({
      success: true,
      agentName: "Scouter",
      timestamp: new Date().toISOString(),
      jobID,
      taskID,
      requestedAction,
      researchData,
    });
  } catch (error) {
    console.error("❌ [Scouter] Fatal Error:", error);
    return res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
}
