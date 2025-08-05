export default async function handler(req, res) {
  try {
    // ✅ อนุญาตเฉพาะ POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed. Use POST instead." });
    }

    // ✅ ตรวจว่า Content-Type เป็น application/json
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({ error: "Invalid Content-Type. Use application/json" });
    }

    // ✅ รองรับทั้งกรณี Vercel parse ให้ และกรณี req.body เป็น string
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    const { jobID, taskID, requestedAction, payload } = body;

    // ✅ Validate fields
    if (!jobID || !taskID || !requestedAction) {
      return res.status(400).json({ error: "Missing required fields (jobID, taskID, requestedAction)" });
    }

    // ✅ ตอบกลับ Mock Data (Scouter Agent)
    const response = {
      jobID,
      taskID,
      requestedAction,
      status: "success",
      timestamp: new Date().toISOString(),
      researchData: {
        insights: [
          "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
          "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
          "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์"
        ],
        keywords: ["lycopene supplement", "skin health", "antioxidant"],
        competitorBrands: ["Brand A", "Brand B", "Brand C"]
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}