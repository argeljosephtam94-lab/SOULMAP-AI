import { GoogleGenAI, Type } from "@google/genai";
import { BirthData, SoulMapInsights, DailyGuidance } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSoulMap(data: BirthData): Promise<SoulMapInsights> {
  const prompt = `Generate a deeply personalized "SoulMap" life blueprint based on the following birth data:
    Date: ${data.birthDate}
    Time: ${data.birthTime || "Unknown"}
    Location: ${data.birthLocation}
    Focus Area: ${data.focusArea}

    The SoulMap should feel data-driven and technical, not generic astrology. 
    Use terms like "behavioral patterns", "strategic alignment", "growth phases".`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          personalityTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
          relationshipDynamics: { type: Type.STRING },
          careerAlignment: { type: Type.STRING },
          growthPhase: { type: Type.STRING },
          radarData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                A: { type: Type.NUMBER },
                fullMark: { type: Type.NUMBER }
              }
            }
          },
          futureOpportunities: { type: Type.STRING },
          blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "personalityTraits", "relationshipDynamics", "careerAlignment", "growthPhase", "radarData", "futureOpportunities", "blindSpots"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateDailyGuidance(soulMapData: BirthData): Promise<DailyGuidance> {
  const prompt = `Based on this user's birth data (${soulMapData.birthDate}, ${soulMapData.birthLocation}), generate a daily guidance report including:
    1. A daily horoscope for their zodiac sign.
    2. A "What to focus on today" and "What to avoid today" section.
    3. A 1-card tarot draw with its meaning and personalized AI advice.
    
    Style: Analytical, data-backed, empowering.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zodiacSign: { type: Type.STRING },
          horoscope: { type: Type.STRING },
          focusToday: { type: Type.STRING },
          avoidToday: { type: Type.STRING },
          tarot: {
            type: Type.OBJECT,
            properties: {
              card: { type: Type.STRING },
              meaning: { type: Type.STRING },
              aiAdvice: { type: Type.STRING }
            }
          }
        },
        required: ["zodiacSign", "horoscope", "focusToday", "avoidToday", "tarot"]
      }
    }
  });

  return JSON.parse(response.text);
}
