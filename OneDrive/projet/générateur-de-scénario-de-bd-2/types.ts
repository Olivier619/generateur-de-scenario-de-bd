
export interface Character {
  id: string;
  name: string;
  description: string;
}

export interface ChapterSetting {
  id: string;
  pages: string;
}

export interface StoryFormData {
  title: string;
  chapterSettings: ChapterSetting[];
  genre: string;
  subGenre: string;
  tone: string;
  targetAudience: string;
  baseIdea: string;
  plotKeywords: string[];
  mainThemes: string[];
  characters: Character[];
  artStyle: string;
  visualMood: string;
}

export interface Dialogue {
  character: string;
  dialogue: string;
}

export interface Panel {
  panelNumber: number;
  description: string;
  dialogues: Dialogue[];
  narration: string;
  onomatopoeia: string;
}

export interface Page {
  pageNumber: number;
  panels: Panel[];
}

export interface Chapter {
  chapterTitle: string;
  pages: Page[];
}

export interface Script {
  title: string;
  chapters: Chapter[];
}

export interface SavedStory {
  id: string;
  createdAt: number;
  formData: StoryFormData;
  summary: string;
  script: Script;
}
