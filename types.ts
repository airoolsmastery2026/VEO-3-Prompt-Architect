
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
  Documentary = "Documentary",
  SciFi = "Sci-Fi Adventure",
  Fantasy = "Fantasy",
  Horror = "Horror",
  Noir = "Film Noir",
  Western = "Western"
}

export interface CharacterBible {
  english: string;
  vietnamese: string;
}

export interface ProjectSettings {
  context: string;
  videoIdea: string;
  script: string; // New field for the full story
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
  transition?: string; // New field for transition type
  dialogue?: string; // Optional, < 8s
}

export interface FullProjectData {
  settings: ProjectSettings;
  characterBible: CharacterBible;
  scenes: SceneData[];
}
