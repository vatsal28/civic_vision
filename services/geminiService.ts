import { GoogleGenAI } from "@google/genai";
import { FilterOption } from "../types";

export const generateIdealImage = async (
  base64Image: string,
  activeFilters: FilterOption[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt based on active filters
  const changesList = activeFilters.map(f => `- ${f.promptFragment}`).join('\n');

  const prompt = `
    You are an expert image editor specialized in urban renewal and civic planning visualization.
    
    Edit the attached image to show how it would look if it were perfectly maintained, clean, and upgraded. 
    Strictly maintain the original perspective, lighting direction, and main building structures. 
    Do not change the time of day. 
    
    CRITICAL: Treat any weathered, stained, peeling, or moldy wall surfaces as defects that must be repaired and painted.
    
    Apply the following specific modifications:
    ${changesList}
    
    Ensure the result looks photorealistic, natural, and inviting.
  `;

  try {
    // Use gemini-3-pro-image-preview for high-quality 4K image editing
    // Free tier: 2 images/day | Paid: ~$0.13-$0.24 per image depending on resolution
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',

      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    });

    // Extract image from response
    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts) {
      throw new Error("No content generated");
    }

    let generatedBase64 = '';

    // Find the image part
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedBase64) {
      throw new Error("No image data found in response");
    }

    return generatedBase64;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};