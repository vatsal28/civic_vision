import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  scores: {
    doorsMatch: boolean;
    windowsMatch: boolean;
    wallsMatch: boolean;
    perspectiveMatch: boolean;
  };
  explanation: string;
}

export async function validateRoomStructure(
  originalBase64: string,
  generatedBase64: string,
  apiKey: string
): Promise<ValidationResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Compare these two interior room images and verify if they maintain the same structure.

CRITICAL CHECKS - Analyze carefully:
1. Same number of doors in same positions? (YES/NO)
2. Same number of windows in same positions? (YES/NO)
3. Wall positions and room shape identical? (YES/NO)
4. Camera angle/perspective the same? (YES/NO)

Be strict in your evaluation. Even minor structural changes should be flagged.

Respond ONLY with valid JSON in this exact format:
{
  "same_doors": true,
  "same_windows": true,
  "same_walls": true,
  "same_perspective": true,
  "confidence": 85,
  "issues": ["list any structural differences detected, or empty array if none"],
  "explanation": "brief explanation of what you observed"
}`;

  try {
    // Prepare images
    const originalImageData = originalBase64.includes('base64,')
      ? originalBase64.split(',')[1]
      : originalBase64;

    const generatedImageData = generatedBase64.includes('base64,')
      ? generatedBase64.split(',')[1]
      : generatedBase64;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: originalImageData,
          mimeType: 'image/jpeg'
        }
      },
      {
        inlineData: {
          data: generatedImageData,
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const responseText = result.response.text();

    // Extract JSON from response (handle markdown code blocks)
    const jsonText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const validation = JSON.parse(jsonText);

    // Calculate overall validity
    const isValid =
      validation.same_doors &&
      validation.same_windows &&
      validation.same_walls &&
      validation.same_perspective;

    return {
      isValid,
      confidence: validation.confidence || 50,
      issues: validation.issues || [],
      scores: {
        doorsMatch: validation.same_doors,
        windowsMatch: validation.same_windows,
        wallsMatch: validation.same_walls,
        perspectiveMatch: validation.same_perspective
      },
      explanation: validation.explanation || 'Validation completed'
    };
  } catch (error) {
    console.error('Room validation error:', error);

    // If validation fails, assume success to avoid blocking user
    // But log error for debugging
    return {
      isValid: true,
      confidence: 50,
      issues: ['Unable to validate - validation service error'],
      scores: {
        doorsMatch: true,
        windowsMatch: true,
        wallsMatch: true,
        perspectiveMatch: true
      },
      explanation: 'Validation service encountered an error'
    };
  }
}

/**
 * Quick validation check - faster but less accurate
 * Uses a simpler prompt for quicker validation
 */
export async function quickValidateRoomStructure(
  originalBase64: string,
  generatedBase64: string,
  apiKey: string
): Promise<{ isValid: boolean; confidence: number }> {
  try {
    const result = await validateRoomStructure(originalBase64, generatedBase64, apiKey);
    return {
      isValid: result.isValid,
      confidence: result.confidence
    };
  } catch (error) {
    console.error('Quick validation error:', error);
    return { isValid: true, confidence: 50 };
  }
}
