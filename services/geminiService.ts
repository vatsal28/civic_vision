import { GoogleGenAI } from "@google/genai";
import { FilterOption, AppMode, FurnitureItem } from "../types";

export const generateIdealImage = async (
  base64Image: string,
  activeFilters: FilterOption[],
  apiKey: string,
  mode: AppMode = AppMode.CITY
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the prompt based on active filters
  const changesList = activeFilters.map(f => `- ${f.promptFragment}`).join('\n');

  // Mode-specific prompts
  const prompt = mode === AppMode.HOME
    ? `
    You are an expert interior designer and home staging specialist.

    ⚠️ CRITICALLY IMPORTANT - ABSOLUTE REQUIREMENTS ⚠️
    You MUST edit the EXACT room from the uploaded image. DO NOT create a new room or change the space layout.

    🚫 NEVER REMOVE OR CHANGE THESE ELEMENTS - PRESERVE EXACTLY AS THEY ARE:
    - ALL DOORS - Every single door must remain in its exact position. Do NOT remove doors, hide doors, or replace doors with walls.
    - ALL WINDOWS - Every window must stay in its exact location with the same size and shape.
    - WALLS - All wall positions and room boundaries must remain identical.
    - CEILING height and features must stay the same.
    - FLOOR LAYOUT - Room dimensions and proportions must not change.
    - ARCHITECTURAL FEATURES - Moldings, built-ins, structural elements must be preserved.
    - CAMERA ANGLE and perspective must be identical.
    - TIME OF DAY and lighting direction must not change.

    ✅ YOU MAY ONLY MODIFY:
    - Paint colors on walls and ceilings
    - Furniture pieces and their arrangement
    - Decorative items (artwork, plants, pillows, throws, rugs)
    - Light fixtures and lamps (but not windows or natural light)
    - Flooring material appearance (but same layout)
    - Curtains and window treatments
    - Small decor accessories

    🔍 VERIFICATION CHECK:
    Before generating, mentally verify:
    - Does my output have the SAME number of doors in the SAME positions?
    - Does my output have the SAME number of windows in the SAME positions?
    - Are the walls in the SAME locations creating the SAME room shape?

    Apply these design changes to the EXISTING room structure:
    ${changesList}

    The result MUST be recognizable as the EXACT SAME ROOM from the uploaded image, just beautifully redesigned with new furniture and decor. A person familiar with the original room should immediately recognize it as the same space.
  `
    : `
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
    // Use gemini-3-pro-image-preview for high-quality image editing
    // Requires Tier 1 access with billing enabled
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
      // Enable image output - required for image generation/editing
      config: {
        responseModalities: ['Text', 'Image'],
      },
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
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Parse error message for better user feedback
    const errorMessage = error?.message || error?.toString() || '';
    const status = error?.status || error?.httpStatus || '';

    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API key not valid')) {
      throw new Error('INVALID_API_KEY: Your API key is invalid. Please check and try again.');
    }

    if (errorMessage.includes('PERMISSION_DENIED') || status === 403) {
      throw new Error('PERMISSION_DENIED: Your API key does not have access to this model. Try enabling billing in Google AI Studio.');
    }

    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota') || status === 429) {
      throw new Error('QUOTA_EXCEEDED: Daily quota exceeded. Free tier allows ~2 images/day. Try again tomorrow or enable billing.');
    }

    if (errorMessage.includes('model') && errorMessage.includes('not found')) {
      throw new Error('MODEL_NOT_AVAILABLE: The image generation model is not available for your account. Enable billing in Google AI Studio.');
    }

    if (errorMessage.includes('SAFETY') || errorMessage.includes('blocked')) {
      throw new Error('CONTENT_BLOCKED: The image was blocked by safety filters. Try a different image.');
    }

    throw error;
  }
};

/**
 * Detects furniture items in a room photo using Gemini.
 * Returns array of FurnitureItem with estimated bounding boxes as percentages.
 */
export const detectFurniture = async (
  base64Image: string,
  apiKey: string
): Promise<FurnitureItem[]> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analyze this room photo and identify all distinct furniture and large decor items visible.

For each item, provide:
1. A short label (e.g., "Sofa", "Coffee Table", "Armchair")
2. An appropriate emoji
3. Estimated bounding box as percentages of the image (x, y = top-left corner, width, height)

Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{
  "items": [
    { "id": "1", "label": "Sofa", "emoji": "🛋️", "x": 10, "y": 50, "width": 40, "height": 25 },
    { "id": "2", "label": "Coffee Table", "emoji": "🪑", "x": 20, "y": 65, "width": 20, "height": 12 }
  ]
}

Focus on moveable furniture. Include: sofas, chairs, tables, beds, dressers, shelves, lamps, rugs. 
Provide accurate bounding boxes. x and y are the top-left corner percentages. Width and height are size percentages.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response (handle possible markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in furniture detection response");
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.items || [];
  } catch (error: any) {
    console.error("Furniture detection error:", error);
    throw error;
  }
};

/**
 * Generates a rearranged room image based on new furniture positions.
 */
export const generateRearrangedRoom = async (
  base64Image: string,
  originalItems: FurnitureItem[],
  rearrangedItems: FurnitureItem[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  // Describe the rearrangement
  const moves = rearrangedItems.map((item, i) => {
    const orig = originalItems.find(o => o.id === item.id);
    if (!orig) return `- ${item.label}: moved to new position`;
    const moved = Math.abs(item.x - orig.x) > 3 || Math.abs(item.y - orig.y) > 3;
    if (!moved) return null;
    const xDir = item.x > orig.x ? 'right' : 'left';
    const yDir = item.y > orig.y ? 'down' : 'up';
    return `- ${item.label}: moved ${xDir} and ${yDir}`;
  }).filter(Boolean).join('\n');

  const prompt = `You are an expert interior designer and 3D room visualization specialist.

You are given a photo of a room. Rearrange the furniture in the room as described below.

FURNITURE REARRANGEMENTS:
${moves || 'Keep furniture in their natural rearranged positions for a fresh look.'}

CRITICAL REQUIREMENTS:
- Keep ALL walls, windows, doors, and architectural features EXACTLY as they are
- Keep the same camera angle and perspective
- Keep the same lighting and time of day
- Maintain photorealistic quality
- Show furniture in their new positions naturally and realistically
- The room should look lived-in and well-composed

Generate a photorealistic image of the room with the furniture rearranged as described.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated");

    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image data found in rearrangement response");
  } catch (error: any) {
    console.error("Rearrangement generation error:", error);
    
    const errorMessage = error?.message || error?.toString() || '';
    if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('403')) {
      throw new Error('PERMISSION_DENIED: Model access denied for rearrangement generation.');
    }
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
      throw new Error('QUOTA_EXCEEDED: Daily quota exceeded.');
    }
    throw error;
  }
};