
import type { SavedStory } from '../types';

const STORAGE_KEY = 'bd_gen_saved_stories';

export const getSavedStories = (): SavedStory[] => {
  try {
    const stories = localStorage.getItem(STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
  } catch (error) {
    console.error("Erreur lors de la lecture du localStorage", error);
    return [];
  }
};

export const saveStory = (story: SavedStory): void => {
  try {
    const stories = getSavedStories();
    const index = stories.findIndex(s => s.id === story.id);
    
    if (index >= 0) {
      stories[index] = story;
    } else {
      stories.push(story);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans le localStorage", error);
    alert("Impossible de sauvegarder : l'espace de stockage local est peut-être plein.");
  }
};

export const deleteStory = (id: string): void => {
  try {
    const stories = getSavedStories();
    const newStories = stories.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStories));
  } catch (error) {
    console.error("Erreur lors de la suppression dans le localStorage", error);
  }
};
