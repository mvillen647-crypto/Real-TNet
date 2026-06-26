import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase kwa usalama zaidi
let db;
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const app = !getApps().length ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
    db = getFirestore();
} catch (e) {
    console.error("Firebase Init Failed:", e.message);
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { imageUrl, type } = req.body;
        if (!imageUrl) return res.status(400).json({ error: "No image provided" });

        // 1. Sightengine API Call yenye Error Logging
        const apiUrl = `https://api.sightengine.com/1.0/check.json`;
        const params = new URLSearchParams({
            models: "genai,nudity-2.1,gore-2.0,faces,text-content",
            media: imageUrl,
            api_user: process.env.SIGHTENGINE_USER,
            api_secret: process.env.SIGHTENGINE_SECRET
        });

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const aiData = await response.json();

        // Angalia kama kuna error kutoka Sightengine
        if (aiData.status !== "success") {
            console.error("Sightengine API Error:", JSON.stringify(aiData));
            throw new Error(aiData.message || "Sightengine service error");
        }

        // 2. Firebase Database Operation
        let scanId = null;
        if (db) {
            try {
                const docRef = await db.collection('scans').add({
                    imageUrl,
                    scanType: type || "image",
                    aiGeneratedScore: aiData.type?.ai_generated || 0,
                    isSafe: aiData.nudity?.none > 0.9,
                    faceCount: aiData.faces?.length || 0,
                    timestamp: new Date().toISOString(),
                    rawData: aiData // Hifadhi kila kitu kwa uchambuzi wa baadaye
                });
                scanId = docRef.id;
            } catch (dbErr) {
                console.error("Database Save Error:", dbErr.message);
            }
        }

        // 3. Mafanikio
        return res.status(200).json({ 
            success: true, 
            ai: aiData,
            scanId: scanId 
        });

    } catch (err) {
        console.error("Global API Error:", err);
        return res.status(500).json({ 
            success: false, 
            error: err.message || "Unknown server error" 
        });
    }
}
// ... (sehemu ya juu inabaki vilevile)
        
        // Debug: Log Keys na URL (Zitakusaidia kuona kwenye Logs kama keys zipo)
        console.log("Debug: API_USER exists:", !!process.env.SIGHTENGINE_USER);
        console.log("Debug: API_SECRET exists:", !!process.env.SIGHTENGINE_SECRET);
        console.log("Debug: Image URL:", imageUrl);

        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const aiData = await response.json();

        // Debug: Log majibu kamili ya Sightengine
        console.log("Sightengine Full Response:", JSON.stringify(aiData));

        if (aiData.status !== "success") {
            // Badala ya "Sightengine service error", tutatoa ujumbe kamili wa kosa
            throw new Error(aiData.error?.message || JSON.stringify(aiData.error) || "Service error");
        }
// ...
