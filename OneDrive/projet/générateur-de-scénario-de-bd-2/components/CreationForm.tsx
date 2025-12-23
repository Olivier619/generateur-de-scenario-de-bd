import React, { useState, useEffect } from 'react';
import type { StoryFormData, Character, ChapterSetting } from '../types';
import { GENRES, TONES, TARGET_AUDIENCES, THEMES, ART_STYLES, VISUAL_MOODS, PAGE_OPTIONS } from '../constants';

interface CreationFormProps {
  onSubmit: (formData: StoryFormData) => void;
  isLoading: boolean;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-2xl font-bold text-indigo-400 mb-4">{title}</h2>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string;}> = ({ label, id, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input id={id} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" {...props} />
  </div>
);

const SelectField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, id, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select id={id} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" {...props} />
  </div>
);

const TextAreaField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; rows?: number }> = ({ label, id, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea id={id} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" {...props} />
  </div>
);

const CreationForm: React.FC<CreationFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    chapterSettings: [{ id: crypto.randomUUID(), pages: '10' }],
    genre: Object.keys(GENRES)[0],
    subGenre: GENRES[Object.keys(GENRES)[0]][0],
    tone: TONES[0],
    targetAudience: TARGET_AUDIENCES[1],
    baseIdea: '',
    plotKeywords: [],
    mainThemes: [],
    characters: [{ id: crypto.randomUUID(), name: '', description: '' }],
    artStyle: ART_STYLES[0],
    visualMood: VISUAL_MOODS[0],
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    setFormData(prev => ({ ...prev, subGenre: GENRES[prev.genre][0] }));
  }, [formData.genre]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      mainThemes: prev.mainThemes.includes(theme) 
        ? prev.mainThemes.filter(t => t !== theme) 
        : [...prev.mainThemes, theme]
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = keywordInput.trim().replace(/,$/, '');
      if (!formData.plotKeywords.includes(newKeyword) && newKeyword) {
        setFormData(prev => ({ ...prev, plotKeywords: [...prev.plotKeywords, newKeyword] }));
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({ ...prev, plotKeywords: prev.plotKeywords.filter(k => k !== keywordToRemove) }));
  };

  const handleChapterSettingChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      chapterSettings: prev.chapterSettings.map(chap => 
        chap.id === id ? { ...chap, pages: value } : chap
      )
    }));
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapterSettings: [
        ...prev.chapterSettings,
        { id: crypto.randomUUID(), pages: '10' }
      ]
    }));
  };

  const removeChapter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      chapterSettings: prev.chapterSettings.filter(chap => chap.id !== id)
    }));
  };
  
  const handleCharacterChange = (id: string, field: 'name' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.map(char => char.id === id ? { ...char, [field]: value } : char)
    }));
  };

  const addCharacter = () => {
    setFormData(prev => ({ ...prev, characters: [...prev.characters, { id: crypto.randomUUID(), name: '', description: '' }] }));
  };

  const removeCharacter = (id: string) => {
    setFormData(prev => ({ ...prev, characters: prev.characters.filter(char => char.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">Créez Votre Histoire</h1>
        <form onSubmit={handleSubmit}>
            <SectionCard title="Paramètres Généraux de l'Histoire">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Titre de la BD" id="title" value={formData.title} onChange={handleChange} placeholder="Ex: Les Chroniques de Néon" />
                    <SelectField label="Genre principal" id="genre" value={formData.genre} onChange={handleChange}>
                        {Object.keys(GENRES).map(genre => <option key={genre} value={genre}>{genre}</option>)}
                    </SelectField>
                    <SelectField label="Sous-genre" id="subGenre" value={formData.subGenre} onChange={handleChange}>
                        {GENRES[formData.genre].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </SelectField>
                    <SelectField label="Ton de l'histoire" id="tone" value={formData.tone} onChange={handleChange}>
                        {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                    </SelectField>
                    <SelectField label="Public Cible" id="targetAudience" value={formData.targetAudience} onChange={handleChange}>
                        {TARGET_AUDIENCES.map(audience => <option key={audience} value={audience}>{audience}</option>)}
                    </SelectField>
                </div>
            </SectionCard>
            
            <SectionCard title="Structure de l'Histoire">
                {formData.chapterSettings.map((chap, index) => (
                    <div key={chap.id} className="grid grid-cols-1 md:grid-cols-2 items-end gap-4 mb-4 p-4 border border-gray-700 rounded-md relative">
                        <div className="font-semibold text-gray-200">
                            Chapitre {index + 1}
                        </div>
                        <SelectField label="Nombre de pages" id={`chap-pages-${chap.id}`} value={chap.pages} onChange={(e) => handleChapterSettingChange(chap.id, e.target.value)}>
                            {PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </SelectField>
                        {formData.chapterSettings.length > 1 && (
                        <button type="button" onClick={() => removeChapter(chap.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addChapter} className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium">+ Ajouter un chapitre</button>
            </SectionCard>

            <SectionCard title="Le Scénario">
                <TextAreaField label="Description de l'idée de base" id="baseIdea" value={formData.baseIdea} onChange={handleChange} placeholder="Un détective du futur doit résoudre le meurtre d'un robot doté d'une conscience..." rows={4} />
                <div>
                    <label htmlFor="plotKeywords" className="block text-sm font-medium text-gray-300 mb-1">Éléments clés de l'intrigue (tags)</label>
                    <div className="flex flex-wrap items-center bg-gray-700 border border-gray-600 rounded-md p-2">
                        {formData.plotKeywords.map(keyword => (
                            <span key={keyword} className="flex items-center bg-indigo-500 text-white text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                                {keyword}
                                <button type="button" onClick={() => removeKeyword(keyword)} className="ml-1.5 text-indigo-200 hover:text-white">&times;</button>
                            </span>
                        ))}
                        <input id="plotKeywords" value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyDown={handleKeywordKeyDown} placeholder="Ajouter un tag et appuyer sur Entrée" className="flex-grow bg-transparent focus:outline-none text-white p-1 mb-2" />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Thèmes principaux</label>
                    <div className="flex flex-wrap gap-2">
                        {THEMES.map(theme => (
                            <button type="button" key={theme} onClick={() => handleThemeChange(theme)} className={`px-3 py-1 text-sm rounded-full ${formData.mainThemes.includes(theme) ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
            </SectionCard>
            
            <SectionCard title="Personnages">
              {formData.characters.map((char, index) => (
                <div key={char.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-700 rounded-md relative">
                  <InputField label={`Nom du personnage ${index + 1}`} id={`char-name-${char.id}`} value={char.name} onChange={(e) => handleCharacterChange(char.id, 'name', e.target.value)} placeholder="Ex: Kael" />
                  <div className="md:col-span-2">
                    <InputField label="Description du personnage" id={`char-desc-${char.id}`} value={char.description} onChange={(e) => handleCharacterChange(char.id, 'description', e.target.value)} placeholder="Ex: Homme, détective cynique au grand coeur" />
                  </div>
                  {formData.characters.length > 1 && (
                    <button type="button" onClick={() => removeCharacter(char.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addCharacter} className="mt-2 text-indigo-400 hover:text-indigo-300 font-medium">+ Ajouter un personnage</button>
            </SectionCard>
            
            <SectionCard title="Style Visuel">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Style artistique" id="artStyle" value={formData.artStyle} onChange={handleChange}>
                        {ART_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                    </SelectField>
                    <SelectField label="Ambiance visuelle" id="visualMood" value={formData.visualMood} onChange={handleChange}>
                        {VISUAL_MOODS.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                    </SelectField>
                </div>
            </SectionCard>

            <div className="text-center mt-8">
                <button type="submit" disabled={isLoading} className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 duration-300 ease-in-out disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-green-500/50">
                    {isLoading ? 'Génération en cours...' : 'Générer un résumé'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default CreationForm;