
import React, { useEffect, useState } from 'react';
import type { SavedStory } from '../types';
import { getSavedStories, deleteStory } from '../services/storageService';

interface SavedStoriesPageProps {
  onLoad: (story: SavedStory) => void;
  onBack: () => void;
}

const SavedStoriesPage: React.FC<SavedStoriesPageProps> = ({ onLoad, onBack }) => {
  const [stories, setStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    setStories(getSavedStories().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ? Cette action est irréversible.')) {
      deleteStory(id);
      setStories(prev => prev.filter(s => s.id !== id));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 mr-4 text-xl font-bold">
          &larr;
        </button>
        <h1 className="text-4xl font-extrabold text-white">Mes Histoires</h1>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
          <p className="text-xl text-gray-400 mb-4">Vous n'avez pas encore d'histoires sauvegardées.</p>
          <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Créer ma première histoire
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map(story => (
            <div 
              key={story.id} 
              onClick={() => onLoad(story)}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-750 border border-transparent hover:border-indigo-500 transition-all duration-200 group relative shadow-md"
            >
              <h2 className="text-2xl font-bold text-white mb-2 truncate pr-8">{story.script.title}</h2>
              <p className="text-indigo-400 text-sm mb-4 font-medium">{story.formData.genre} - {story.formData.subGenre}</p>
              
              <div className="text-gray-400 text-sm line-clamp-3 mb-4">
                {story.summary}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-700">
                <span>{formatDate(story.createdAt)}</span>
                <span className="text-indigo-400 group-hover:text-indigo-300 font-semibold">Ouvrir &rarr;</span>
              </div>

              <button 
                onClick={(e) => handleDelete(story.id, e)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStoriesPage;
