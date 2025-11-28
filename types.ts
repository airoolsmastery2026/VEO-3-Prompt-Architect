export enum AspectRatio {
  Ratio_16_9 = "16:9",
  Ratio_9_16 = "9:16"
}

export enum CinematicStyle {
  Cinematic = "Cinematic",
  Anime = "Anime",
  Realistic = "Realistic",
  Cyberpunk = "Cyberpunk",
  Vintage = "Vintage Film",
  Documentary = "Documentary"
}

export interface CharacterBible {
  english: string;
  vietnamese: string;
}

export interface ProjectSettings {
  context: string;
  videoIdea: string;
  style: CinematicStyle;
  ratio: AspectRatio;
  sceneCount: number;
}

export interface SceneData {
  id: string;
  number: number;
  descriptionEn: string;
  descriptionVi: string;
  camera: string;
  action: string;
  lighting: string;
  dialogue?: string; // Optional, < 8s
}

export interface FullProjectData {
  settings: ProjectSettings;
  characterBible: CharacterBible;
  scenes: SceneData[];
}