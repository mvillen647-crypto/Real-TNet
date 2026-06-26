import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fetch from "node-fetch";

// Initialize Firebase Admin (inabidi uweke KEY ya JSON kwenye Vercel Env)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = !getApps().length ? initializeApp({
  credential: cert(serviceAccount)
}) : getApp();

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { imageUrl, type } = req.body; // Sasa tunapokea URL kutoka kwa Cloudinary
    if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

    // 1. Scan na Sightengine kwa kutumia URL (Ni haraka sana!)
    const sightengineUrl = `https://api.sightengine.com/1.0/check.json?models=genai,nudity-2.1,gore-2.0,faces&media=${encodeURIComponent(imageUrl)}&api_user=${process.env.SIGHTENGINE_USER}&api_secret=${process.env.SIGHTENGINE_SECRET}`;
    
    const response = await fetch(sightengineUrl);
    const aiData = await response.json();

    if (aiData.status !== "success") throw new Error("Sightengine scan failed");

    // 2. Hifadhi kwenye Firebase Firestore
    const scanRef = await db.collection('scans').add({
      imageUrl: imageUrl,
      aiScore: aiData.type?.ai_generated || 0,
      timestamp: new Date().toISOString(),
      faces: aiData.faces ? aiData.faces.length : 0,
      safe: aiData.nudity?.none > 0.9,
      type: type
    });

    return res.status(200).json({ 
      success: true, 
      ai: aiData,
      scanId: scanRef.id 
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
