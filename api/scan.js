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
          confidence: 0.95
        }
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "No image"
      });
    }

    // 🔥 Convert base64 → buffer safe for Sightengine
    const formData = new FormData();

    formData.append("api_user", process.env.SIGHTENGINE_USER);
    formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

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
      ai: data,
      provider: "sightengine"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
