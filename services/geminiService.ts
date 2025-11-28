import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectSettings, CharacterBible, SceneData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCENE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      number: { type: Type.NUMBER },
      descriptionEn: { type: Type.STRING, description: "Detailed visual description of the scene in English. Do not include character definitions here." },
      descriptionVi: { type: Type.STRING, description: "Detailed visual description of the scene in Vietnamese. Do not include character definitions here." },
      camera: { type: Type.STRING, description: "Camera angle, movement instructions, and shot type (e.g. Close-up, Wide shot)" },
      lighting: { type: Type.STRING, description: "Lighting setup instructions (e.g. Cinematic, Volumetric, Natural)" },
      action: { type: Type.STRING, description: "Specific character actions and movement" },
      dialogue: { type: Type.STRING, description: "Short dialogue if applicable, kept under 8 seconds. Can be empty." },
    },
    required: ["number", "descriptionEn", "descriptionVi", "camera", "lighting", "action"]
  }
};

export const generateStoryboard = async (
  settings: ProjectSettings,
  bible: CharacterBible
): Promise<SceneData[]> => {
  const prompt = `
    You are an expert film director and AI video prompt engineer specializing in Google's VEO 3 model.
    Create a ${settings.sceneCount}-scene storyboard based on the following inputs.
    
    CONTEXT / BỐI CẢNH: ${settings.context}
    IDEA / Ý TƯỞNG: ${settings.videoIdea}
    STYLE / THỂ LOẠI: ${settings.style}
    
    CHARACTER BIBLE (Reference only, do not repeat in scene descriptions):
    ${bible.english}

    Constraints:
    1. No text overlays, no subtitles, no speech bubbles.
    2. Dialogue must be very short (under 8s).
    3. Ensure visual consistency.
    4. Provide both English and Vietnamese descriptions.
    5. The 'camera' and 'lighting' fields should be technical and precise (e.g., "Low angle, dolly zoom", "Chiaroscuro lighting").
    6. For 'descriptionEn' and 'descriptionVi', write the scene narrative naturally as if describing a movie frame. Focus on the visual action.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SCENE_SCHEMA,
        systemInstruction: "You are a creative director generating structured JSON storyboards for AI video generation. Your output is optimized for VEO 3.",
        temperature: 0.7,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      // Add unique IDs
      return parsed.map((scene: any) => ({
        ...scene,
        id: crypto.randomUUID()
      }));
    }
    return [];
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const regenerateScene = async (
  sceneId: string,
  sceneNumber: number,
  settings: ProjectSettings,
  bible: CharacterBible,
  currentSceneData: SceneData
): Promise<SceneData> => {
   const prompt = `
    Regenerate a specific scene (Scene #${sceneNumber}) for a VEO 3 AI Video storyboard.
    
    Project Context: ${settings.context}
    Project Idea: ${settings.videoIdea}
    Style: ${settings.style}
    
    Character Bible: ${bible.english}
    
    Previous/Current Draft of Scene:
    ${currentSceneData.descriptionEn}
    
    Task: Improve the prompt for better visual fidelity, action clarity, and lighting. Keep it consistent with the Bible.
    Return a SINGLE scene object.
  `;

  const SINGLE_SCENE_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
      number: { type: Type.NUMBER },
      descriptionEn: { type: Type.STRING },
      descriptionVi: { type: Type.STRING },
      camera: { type: Type.STRING },
      lighting: { type: Type.STRING },
      action: { type: Type.STRING },
      dialogue: { type: Type.STRING },
    },
    required: ["number", "descriptionEn", "descriptionVi", "camera", "lighting", "action"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SINGLE_SCENE_SCHEMA,
        temperature: 0.8,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        ...parsed,
        id: sceneId, 
        number: sceneNumber // Ensure number stays consistent
      };
    }
    throw new Error("Failed to regenerate scene");
  } catch (error) {
    console.error("Gemini Regeneration Error:", error);
    throw error;
  }
};
