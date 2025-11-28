
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectSettings, CharacterBible, SceneData, CinematicStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCENE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      number: { type: Type.NUMBER },
      descriptionEn: { type: Type.STRING, description: "Visual description. If style is Stop Motion, MUST include headers: 'Objects:', 'Atmosphere:', 'SFX:'." },
      descriptionVi: { type: Type.STRING, description: "Vietnamese visual description." },
      camera: { type: Type.STRING, description: "Camera angle, movement instructions, and shot type." },
      lighting: { type: Type.STRING, description: "Lighting setup instructions or Style description." },
      action: { type: Type.STRING, description: "Specific character actions." },
      transition: { type: Type.STRING, description: "Transition type." },
      dialogue: { type: Type.STRING, description: "Short dialogue if applicable." },
    },
    required: ["number", "descriptionEn", "descriptionVi", "camera", "lighting", "action", "transition"]
  }
};

// --- Suggestion Helpers ---

export const suggestTitle = async (settings: ProjectSettings): Promise<string> => {
  const prompt = `Create a short, catchy, cinematic title (English) for a ${settings.style} video.
  Context: ${settings.context}
  Idea: ${settings.videoIdea}
  Return ONLY the title, no quotes.`;
  
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return response.text?.trim() || "Untitled Project";
};

export const suggestContext = async (style: CinematicStyle): Promise<string> => {
  const prompt = `Write a detailed, atmospheric visual context setting description (Vietnamese) for a ${style} video. 
  Focus on environment, lighting, and textures. Max 2 sentences.`;
  
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return response.text?.trim() || "";
};

export const suggestIdea = async (settings: ProjectSettings): Promise<string> => {
  const prompt = `Write a compelling, short video concept/plot summary (Vietnamese) for a ${settings.style} video set in: ${settings.context}. 
  Focus on conflict or mystery. Max 2 sentences.`;
  
  const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
  return response.text?.trim() || "";
};

// --- Main Generation Functions ---

export const generateScript = async (
  settings: ProjectSettings,
  bible: CharacterBible
): Promise<string> => {
  const prompt = `
    Role: Master Cinematic Storyteller.
    Task: Write a vivid, high-quality film treatment (long-form story) based on the user's concept.
    
    PROJECT SETTINGS:
    - Title: ${settings.title}
    - Context/World: ${settings.context}
    - Core Concept: ${settings.videoIdea}
    - Genre/Style: ${settings.style}
    
    CHARACTER BIBLE (STRICT ADHERENCE REQUIRED):
    ${bible.english}
    
    CRITICAL INSTRUCTION ON CHARACTERS:
    You must maintain strict consistency with the provided Character Bible from the beginning to the very end of the story. 
    - Do not change their physical appearance, age, or defined personality traits.
    - Do not add random characters unless necessary for background.
    - Every action they take must align with the "Character Bible" provided.
    
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
        systemInstruction: "You are a creative AI screenwriter assistant specializing in visual storytelling. You prioritize character consistency above all else.",
        temperature: 0.8,
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

  let formattingInstructions = `
    FIELD INSTRUCTIONS:
    - descriptionEn: Cinematic visual description (English). Focus on what is seen.
    - descriptionVi: Cinematic visual description (Vietnamese). High quality translation.
    - camera: Technical camera movement (e.g., "Slow push-in," "Handheld tracking").
    - lighting: Mood and lighting setup.
    - action: Specific movement occurring within the 8s timeframe.
  `;

  if (settings.style === CinematicStyle.StopMotion) {
    formattingInstructions = `
    SPECIAL FORMATTING FOR STOP MOTION / TOY STYLE:
    For 'descriptionEn', you MUST structure the text EXACTLY like this (with line breaks):
    Objects: [List main objects in scene]
    Atmosphere: [Mood/Atmosphere]
    SFX: [Sound Effects]

    For 'lighting', describe the visual Style (e.g. Playful, whimsical, warm lighting).
    For 'action', describe the animation movement.
    `;
  }

  const prompt = `
    Role: VEO 3 Prompt Architect & Director.
    Task: Deconstruct the provided SOURCE MATERIAL into a precise ${settings.sceneCount}-scene storyboard.
    
    SOURCE MATERIAL:
    ${sourceMaterial}
    
    CONTEXT & STYLE:
    Title: ${settings.title}
    Context: ${settings.context}
    Style: ${settings.style}
    
    CHARACTER BIBLE (REFERENCE):
    ${bible.english}
    
    CONSTRAINTS:
    1. Output exactly ${settings.sceneCount} scenes.
    2. DURATION: Each scene represents an 8-second video clip. Actions must be concise but vivid.
    3. CONTINUITY: Ensure logical flow between Scene N and Scene N+1 based on the script.
    4. CHARACTER CONSISTENCY: Ensure characters look and act exactly as described in the Bible.
    5. NO TEXT: No overlays, subtitles, or speech bubbles.
    6. FORMAT: Return JSON matching the schema.
    
    ${formattingInstructions}
    
    - transition: Edit transition from previous shot (e.g., "Cut to", "Dissolve").
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
    
    Title: ${settings.title}
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
