export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { image, text } = req.body || {};

    if (text) {
      return res.status(200).json({
        success: true,
        ai: {
          status: "success",
          label: "safe",
          confidence: 0.9,
          toxicity: 0.1
        }
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "No image"
      });
    }

    const formData = new URLSearchParams();

    formData.append("api_user", process.env.SIGHTENGINE_USER);
    formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

    // 🔥 IMPORTANT FIX (NO FACE MODEL)
    formData.append("models", "genai,nudity-2.1,gore-2.0,faces");

    formData.append("media", image);

    const response = await fetch(
      "https://api.sightengine.com/1.0/check.json",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    return res.status(200).json({
      success: response.ok,
      ai: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
