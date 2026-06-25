export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "POST only"
    });
  }

  try {
    const { image, text } = req.body || {};

    // =========================
    // TEXT SCAN (SAFE MOCK LOGIC)
    // =========================
    if (text) {
      return res.status(200).json({
        success: true,
        ai: {
          status: "success",
          label: "safe",
          confidence: 0.92,
          toxicity: 0.08
        }
      });
    }

    // =========================
    // IMAGE REQUIRED
    // =========================
    if (!image) {
      return res.status(400).json({
        success: false,
        error: "No image provided"
      });
    }

    // =========================
    // FORM DATA FOR SIGHTENGINE
    // =========================
    const formData = new URLSearchParams();

    formData.append("api_user", process.env.SIGHTENGINE_USER);
    formData.append("api_secret", process.env.SIGHTENGINE_SECRET);

    // IMPORTANT FIX:
    // DO NOT use deprecated "face"
    // Use modern safe model set
    formData.append(
      "models",
      "genai,nudity-2.1,gore-2.0,offensive"
    );

    formData.append("media", image);

    // =========================
    // REQUEST
    // =========================
    const response = await fetch(
      "https://api.sightengine.com/1.0/check.json",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    // =========================
    // ERROR HANDLING
    // =========================
    if (!response.ok || data.status === "failure") {
      return res.status(400).json({
        success: false,
        error: data.error?.message || "Sightengine failed",
        raw: data
      });
    }

    // =========================
    // SAFE NORMALIZED RESPONSE
    // =========================
    const ai = {
      status: "success",

      ai_generated: data?.type === "ai" ? 1 : data?.ai_generated || 0,

      confidence: data?.confidence || 0,

      nudity: data?.nudity || {},
      weapon: data?.weapon || 0,
      gore: data?.gore || 0,
      offensive: data?.offensive || 0
    };

    return res.status(200).json({
      success: true,
      ai
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
      }
