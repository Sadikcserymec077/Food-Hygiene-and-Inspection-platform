const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const db = require('./src/config/dbConnect');

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt that locks the AI to be a Food Hygiene expert assistant
const SYSTEM_PROMPT = `You are an expert AI assistant for the Food Hygiene Inspection and Reporting Platform.
Your name is "HygieneBot".
You ONLY answer questions related to:
- Food safety, hygiene standards, and health inspections
- Hygiene scores and what they mean
- How to file complaints about restaurants
- FSSAI regulations and licensing
- Food contamination, safe temperatures, and cooking standards
- Understanding inspection reports
- Restaurant health ratings (green/yellow/red ratings)

You must REFUSE to answer any question that is not related to food hygiene, food safety, restaurant inspections, or the platform.
If asked an off-topic question, politely say: "I can only help with food hygiene and inspection-related queries. Please ask me something related to food safety!"

Always be professional, helpful, and concise. Use bullet points when listing items.`;

// GET /api/fssai-chatbot - initial welcome info (legacy support)
router.get('/fssai-chatbot', async (req, res) => {
  try {
    const [restaurants] = await db.query(`
      SELECT name, zone, region, hygiene_score
      FROM restaurants
      WHERE status = 'approved'
      LIMIT 5
    `);

    const restaurantSection = restaurants.map(r =>
      `🏢 <strong>${r.name}</strong> (Zone: ${r.zone}, Region: ${r.region}, Hygiene Score: ${r.hygiene_score})`
    ).join('<br><br>');

    const intro = `
🤖 <strong>Hello! I am HygieneBot</strong>, your AI assistant for food safety and hygiene inspections.<br><br>
🔒 I only answer questions about food safety, inspections, and hygiene standards.<br><br>
📊 <strong>Hygiene Score Guide:</strong><br>
🟢 4.1–5.0: Excellent | 🟡 3.0–4.0: Good | 🟠 2.0–2.9: Average | 🔴 Below 2.0: Poor<br><br>
📍 <strong>Top Approved Restaurants:</strong><br>
${restaurantSection}
    `;

    res.json({ prompt: intro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate chatbot intro' });
  }
});

// POST /api/chat - Main Gemini AI chat endpoint
router.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY not configured. Please add it to your .env file.'
    });
  }

  try {
    // Build the conversation history for context
    const contents = [
      // Add conversation history
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      // Current user message
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      contents: contents
    });

    const reply = response.text;
    res.json({ reply });

  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

module.exports = router;
