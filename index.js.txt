// index.js - Production-ready Scouter Agent API

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST instead." });
  }

  try {
    // ✅ อ่าน payload จาก Node 5
    const { jobID, taskID, requestedAction, payload } = req.body;

    if (!jobID || !taskID || !requestedAction) {
      return res.status(400).json({ error: "Missing required fields (jobID, taskID, requestedAction)" });
    }

    // ✅ เริ่มทำงาน Scouter (ตัวอย่างคือ mock research)
    const researchResult = {
      insights: [
        "ตลาดอาหารเสริมเติบโต 12% ต่อปี",
        "ลูกค้าเป้าหมายสนใจส่วนผสมจากธรรมชาติ",
        "การแข่งขันสูง แต่โอกาสอยู่ในช่องทางออนไลน์"
      ],
      keywords: ["lycopene supplement", "skin health", "antioxidant"],
      competitorBrands: ["Brand A", "Brand B", "Brand C"]
    };

    // ✅ เตรียม response กลับไปให้ Node 5
    const response = {
      jobID,
      taskID,
      requestedAction,
      status: "success",
      timestamp: new Date().toISOString(),
      researchData: researchResult
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Scouter Agent Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
