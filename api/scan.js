import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Initialize Firebase kwa Usalama
let app;
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = !getApps().length ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

const db = getFirestore();

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const { imageUrl, type } = req.body;
        if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

        // 2. Scan na Sightengine (kwa kutumia URL)
        const sightengineApi = `https://api.sightengine.com/1.0/check.json?models=genai,nudity-2.1,gore-2.0,faces&media=${encodeURIComponent(imageUrl)}&api_user=${process.env.SIGHTENGINE_USER}&api_secret=${process.env.SIGHTENGINE_SECRET}`;
        
        const response = await fetch(sightengineApi);
        const aiData = await response.json();

        if (aiData.status !== "success") {
            throw new Error(aiData.error || "Sightengine scan failed");
        }

        // 3. Hifadhi kwenye Firebase Firestore
        if (app) {
            await db.collection('scans').add({
                imageUrl: imageUrl,
                aiScore: aiData.type?.ai_generated || 0,
                timestamp: new Date().toISOString(),
                faces: aiData.faces ? aiData.faces.length : 0,
                isSafe: aiData.nudity?.none > 0.9,
                scanType: type || "image"
            });
        }

        // 4. Rudisha matokeo
        return res.status(200).json({ success: true, ai: aiData });

    } catch (err) {
        console.error("Scan API Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}
