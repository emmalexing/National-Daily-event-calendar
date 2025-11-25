import { GoogleGenAI, Type } from "@google/genai";
import { HistoricalEvent } from "../types";
import { STATIC_EVENTS } from "../data/staticEvents";

const apiKey = process.env.API_KEY;

export const fetchHistoricalEvents = async (): Promise<HistoricalEvent[]> => {
  // Start with static events
  const allEvents = [...STATIC_EVENTS];

  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. Returning static data only.");
    return allEvents;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a list of 5 significant and distinct historical events in Nigeria's history that are NOT common holidays (e.g. obscure historical treaties, specific battles, cultural founding dates).
  Ensure the dates are accurate. Do not duplicate common holidays like Independence Day or Christmas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              originalDate: { type: Type.STRING, description: "Format YYYY-MM-DD" },
              description: { type: Type.STRING },
              category: { type: Type.STRING, description: "e.g., Politics, Culture, Military" },
            },
            required: ["id", "title", "originalDate", "description", "category"],
          },
        },
      },
    });

    if (response.text) {
        const aiEvents = JSON.parse(response.text) as HistoricalEvent[];
        return [...allEvents, ...aiEvents];
    }
    return allEvents;

  } catch (error) {
    console.error("Failed to fetch events from Gemini:", error);
    return allEvents;
  }
};

export const generateEditorialBrief = async (eventTitle: string, eventDate: string): Promise<string> => {
    if (!apiKey) {
        return "AI Service Unavailable: Please check your API Key configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert editorial consultant for a Nigerian History magazine. 
    Create a concise but comprehensive editorial brief for a writer assigned to cover the event: "${eventTitle}" which occurred on ${eventDate}.
    
    The brief must include:
    1. Historical Context (What led to this?)
    2. Key Figures (Who were the main players?)
    3. Significance (Why does it matter today?)
    4. Suggested Angle (How should a modern article approach this?)
    
    Keep it under 300 words. Format with clear headings.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text || "No brief generated.";
    } catch (error) {
        console.error("Error generating brief:", error);
        return "Failed to generate brief. Please try again later.";
    }
}

export const generateStrategicPlan = async (eventTitle: string, eventDescription: string): Promise<string> => {
  if (!apiKey) return "AI Service Unavailable.";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Develop a comprehensive, high-level multi-platform content strategy for the historical event: "${eventTitle}".
  Context: ${eventDescription}

  The strategy should include:
  1. A Long-form Article Angle (investigative or narrative style).
  2. Three engaging Social Media hooks (Twitter/X threads, Instagram visual ideas).
  3. A Podcast/Audio discussion theme.
  4. Target Audience analysis for modern Nigeria.

  Think deeply about cultural nuances, modern relevance, and how to capture the attention of Gen Z and Millennials.`;

  try {
      const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: prompt,
          config: {
              thinkingConfig: { thinkingBudget: 32768 } // High budget for complex reasoning
          }
      });
      return response.text || "No strategy generated.";
  } catch (error) {
      console.error("Strategy generation failed", error);
      return "Failed to generate strategic plan.";
  }
}

export const draftEditorEmail = async (editorName: string, eventTitle: string, taskDescription: string): Promise<{subject: string, body: string}> => {
  if (!apiKey) return { subject: `Assignment: ${eventTitle}`, body: `Please check the dashboard for details regarding ${eventTitle}.` };

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Write a professional, encouraging email from an Editor-in-Chief to an editor named ${editorName}.
  Topic: Assignment regarding "${eventTitle}".
  Context: ${taskDescription}
  
  The email should be concise, professional, and motivating. 
  Return the output as a JSON object with 'subject' and 'body' fields.`;

  try {
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      subject: { type: Type.STRING },
                      body: { type: Type.STRING }
                  },
                  required: ["subject", "body"]
              }
          }
      });
      
      if (response.text) {
          return JSON.parse(response.text);
      }
      throw new Error("Empty response");
  } catch (error) {
      console.error("Email draft failed", error);
      return { 
          subject: `Update: ${eventTitle}`, 
          body: `Hi ${editorName},\n\nPlease review the details for the upcoming event: ${eventTitle}.\n\nBest,\nEditorial Team`
      };
  }
}