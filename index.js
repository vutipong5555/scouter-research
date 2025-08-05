// ✅ Scouter Agent Beta v2.1 – Mock Success

export default async function handler(req, res) {
  try {
    // ✅ Allow only POST method
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed. Use POST instead." });
    }

    // ✅ Validate Content-Type
    if (req.headers["content-type"] !== "application/json") {
      return res.status(400).json({ error: "Invalid Content-Type. Use application/json" });
    }

    // ✅ Parse JSON body (if string)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    console.log("📥 Incoming Request Body:", JSON.stringify(body, null, 2));

    const { jobID, taskID, requestedAction, payload } = body;

    // ✅ Validate required fields
    if (!jobID || !taskID || !requestedAction) {
      return res.status(400).json({ error: "Missing required fields (jobID, taskID, requestedAction)" });
    }

    // ✅ Build mock researchData response (for test only)
    const response = {
      jobID,
      taskID,
      requestedAction,
      status: "success",
      timestamp: new Date().toISOString(),
      agentName: "Scouter",
      researchData: {
        insights: [
          "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
          "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
          "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์"
        ],
        keywords: ["lycopene supplement", "skin health", "antioxidant"],
        competitorBrands: ["Brand A", "Brand B", "Brand C"],
        sourceLinks: [
          {
            title: "รายงานตลาดอาหารเสริม 2024",
            url: "https://example.com/supplement-market-2024"
          },
          {
            title: "งานวิจัยเกี่ยวกับไลโคปีน",
            url: "https://example.com/lycopene-study"
          }
        ]
      }
    };

    // ✅ Return success
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
