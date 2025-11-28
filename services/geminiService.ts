import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectSettings, CharacterBible, SceneData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCENE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      number: { type: Type.NUMBER },
      descriptionEn: { type: Type.STRING, description: "Detailed visual description of the scene in English. Do not include character definitions here. Focus on environment and character interaction." },
      descriptionVi: { type: Type.STRING, description: "Detailed visual description of the scene in Vietnamese. Do not include character definitions here." },
      camera: { type: Type.STRING, description: "Camera angle, movement instructions, and shot type (e.g. Close-up, Wide shot, Dolly Zoom)" },
      lighting: { type: Type.STRING, description: "Lighting setup instructions (e.g. Cinematic, Volumetric, Natural, Chiaroscuro)" },
      action: { type: Type.STRING, description: "Specific character actions and movement relevant for an 8-second clip." },
      transition: { type: Type.STRING, description: "Transition type from previous scene (e.g. Cut To, Fade In, Dissolve)." },
      dialogue: { type: Type.STRING, description: "Short dialogue if applicable, kept under 8 seconds. Can be empty." },
    },
    required: ["number", "descriptionEn", "descriptionVi", "camera", "lighting", "action", "transition"]
  }
};

export const generateScript = async (
  settings: ProjectSettings,
  bible: CharacterBible
): Promise<string> => {
  const prompt = `
    Role: Master Cinematic Storyteller.
    Task: Write a vivid, high-quality film treatment (long-form story) based on the user's concept.
    
    PROJECT SETTINGS:
    - Context/World: ${settings.context}
    - Core Concept: ${settings.videoIdea}
    - Genre/Style: ${settings.style}
    
    CHARACTER BIBLE:
    ${bible.english}
    
    INSTRUCTIONS:
    1. Narrative Flow: Write a linear, engaging story that connects the concept into a sequence of events.
    2. Visual Focus: Focus intensely on atmosphere, lighting, physical actions, and expressions. Show, don't tell.
    3. Pacing: The story must be paced to be split into exactly ${settings.sceneCount} distinct scenes (approx 8 seconds each).
    4. Character Integration: Weave the specific visual details from the Character Bible (outfits, features) into the action naturally.
    5. Output Language: English.
    
    FORMAT:
    Return a cohesive story text (paragraphs) suitable for a director to read. Do not use "Scene 1" headers yet; just the narrative.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a creative AI screenwriter assistant (like ChatGPT) specializing in visual storytelling for video generation.",
        temperature: 0.9, // Higher creativity for story writing
      },
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Script Generation Error:", error);
    throw error;
  }
};

export const generateStoryboard = async (
  settings: ProjectSettings,
  bible: CharacterBible
): Promise<SceneData[]> => {
  // Use the script if available, otherwise use the idea
  const sourceMaterial = settings.script && settings.script.length > 50 
    ? `FULL NARRATIVE SCRIPT: ${settings.script}` 
    : `CORE IDEA: ${settings.videoIdea}`;

  const prompt = `
    Role: VEO 3 Prompt Architect & Director.
    Task: Deconstruct the provided SOURCE MATERIAL into a precise ${settings.sceneCount}-scene storyboard.
    
    SOURCE MATERIAL:
    ${sourceMaterial}
    
    CONTEXT & STYLE:
    Context: ${settings.context}
    Style: ${settings.style}
    
    CONSTRAINTS:
    1. Output exactly ${settings.sceneCount} scenes.
    2. DURATION: Each scene represents an 8-second video clip. Actions must be concise but vivid.
    3. CONTINUITY: Ensure logical flow between Scene N and Scene N+1 based on the script.
    4. NO TEXT: No overlays, subtitles, or speech bubbles.
    5. FORMAT: Return JSON matching the schema.
    
    FIELD INSTRUCTIONS:
    - descriptionEn: Cinematic visual description (English). Focus on what is seen.
    - descriptionVi: Cinematic visual description (Vietnamese). High quality translation.
    - camera: Technical camera movement (e.g., "Slow push-in," "Handheld tracking," "Drone shot").
    - lighting: Mood and lighting setup (e.g., "Bioluminescent glow," "Harsh shadows").
    - action: Specific movement occurring within the 8s timeframe.
    - transition: Edit transition from previous shot (e.g., "Cut to", "Dissolve", "Wipe", "Fade In").
    - dialogue: OPTIONAL. Must be spoken within 3-4 seconds max.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SCENE_SCHEMA,
        systemInstruction: "You are an expert AI Video Prompt Engineer. You create precise, high-fidelity prompts for Google VEO 3.",
        temperature: 0.7, // Lower temperature for structured JSON output
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
    
    Context: ${settings.context}
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
      transition: { type: Type.STRING },
      dialogue: { type: Type.STRING },
    },
    required: ["number", "descriptionEn", "descriptionVi", "camera", "lighting", "action", "transition"]
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
