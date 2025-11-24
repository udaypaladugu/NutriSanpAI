import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the food image using Gemini 2.5 Flash.
 */
export const analyzeImage = async (file: File): Promise<NutritionData> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const imagePart = await fileToGenerativePart(file);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        imagePart,
        {
          text: `Analyze this image. If it is food, provide the approximate nutritional information for the entire meal shown. 
                 If it is NOT food, set 'isFood' to false and leave other fields as 0 or empty strings.
                 Be realistic with the estimates based on standard portion sizes visible.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: {
            type: Type.STRING,
            description: "A short, descriptive name of the dish or meal.",
          },
          calories: {
            type: Type.NUMBER,
            description: "Total estimated calories (kcal).",
          },
          fat: {
            type: Type.NUMBER,
            description: "Total fat in grams.",
          },
          carbs: {
            type: Type.NUMBER,
            description: "Total carbohydrates in grams.",
          },
          protein: {
            type: Type.NUMBER,
            description: "Total protein in grams.",
          },
          description: {
            type: Type.STRING,
            description: "A brief, one-sentence summary of the meal's nutritional profile.",
          },
          isFood: {
            type: Type.BOOLEAN,
            description: "True if the image contains food, false otherwise.",
          },
        },
        required: ["foodName", "calories", "fat", "carbs", "protein", "description", "isFood"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response received from Gemini.");
  }

  try {
    return JSON.parse(text) as NutritionData;
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("Failed to parse nutritional data.");
  }
};