export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    // ✅ อ่าน body แบบ CommonJS
    let body = "";
    await new Promise(resolve => {
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", resolve);
    });

    const data = JSON.parse(body || "{}");
    console.log("📥 Incoming Request:", data);

    const { jobID, taskID, requestedAction, payload } = data;

    if (!jobID || !taskID || !requestedAction) {
      return res.status(400).json({
        error: "Missing required fields (jobID, taskID, requestedAction)",
      });
    }

    if (!payload?.researchData) {
      return res.status(400).json({ error: "Missing researchData in payload" });
    }

    // ✅ Mock Response
    return res.status(200).json({
      jobID,
      taskID,
      requestedAction,
      status: "success",
      timestamp: new Date().toISOString(),
      agentName: "Scouter Agent",
      researchData: {
        insights: ["ตลาดอาหารเสริมเติบโต 12% ต่อปี", "ลูกค้าสนใจส่วนผสมธรรมชาติ"],
        keywords: ["lycopene supplement", "skin health"],
        competitorBrands: ["Brand A", "Brand B"],
        sourceLinks: [{ title: "Example Source", url: "https://example.com" }]
      }
    });

  } catch (err) {
    console.error("❌ Scouter Agent Error:", err);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      details: err.message
    });
  }
}
