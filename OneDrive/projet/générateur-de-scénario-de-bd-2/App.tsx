
import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import CreationForm from './components/CreationForm';
import ResultPage from './components/ResultPage';
import LoadingIndicator from './components/LoadingIndicator';
import SummaryPage from './components/SummaryPage';
import SavedStoriesPage from './components/SavedStoriesPage';
import { generateScript, generateSummary } from './services/perplexityService';
import { saveStory } from './services/storageService';
import type { StoryFormData, Script, SavedStory } from './types';

type View = 'home' | 'form' | 'summary' | 'loading' | 'results' | 'saved-stories';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [formData, setFormData] = useState<StoryFormData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  const handleStart = () => {
    setCurrentStoryId(null);
    setFormData(null);
    setSummary(null);
    setScript(null);
    setView('form');
  };

  const handleOpenSaved = () => setView('saved-stories');

  const handleLoadStory = (story: SavedStory) => {
    setFormData(story.formData);
    setSummary(story.summary);
    setScript(story.script);
    setCurrentStoryId(story.id);
    setView('results');
  };

  const handleFormSubmit = useCallback(async (data: StoryFormData) => {
    setFormData(data);
    setError(null);
    setLoadingMessage('Génération du résumé...');
    setView('loading');
    setIsLoading(true);
    try {
      const result = await generateSummary(data);
      setSummary(result);
      setView('summary');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setView('form');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerateSummary = useCallback(async () => {
    if (formData) {
      setError(null);
      setLoadingMessage('Génération d\'un nouveau résumé...');
      setView('loading');
      setIsLoading(true);
      try {
        const result = await generateSummary(formData);
        setSummary(result);
        setView('summary');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setView('form');
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData]);

  const handleSummaryApproval = useCallback(async () => {
    if (formData && summary) {
      setError(null);
      setLoadingMessage('Génération du script complet...');
      setView('loading');
      setIsLoading(true);
      try {
        const result = await generateScript(formData, summary);
        setScript(result);
        setView('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setView('summary');
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData, summary]);

  const handleRegenerate = useCallback(async () => {
    if (formData && summary) {
      setError(null);
      setLoadingMessage('Régénération du script complet...');
      setView('loading');
      setIsLoading(true);
      try {
        const result = await generateScript(formData, summary);
        setScript(result);
        setView('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setView('results');
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData, summary]);

  const handleRegenerateFrom = useCallback(async (chapterIndex: number) => {
    if (formData && script && summary) {
      const scriptSoFar: Script = {
        ...script,
        chapters: script.chapters.slice(0, chapterIndex + 1),
      };
      setScript(scriptSoFar);
      setError(null);
      setLoadingMessage('Génération de la suite du script...');
      setView('loading');
      setIsLoading(true);
      try {
        const result = await generateScript(formData, summary, scriptSoFar);
        setScript(result);
        setView('results');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setScript(script);
        setView('results');
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData, script, summary]);

  const handleSave = () => {
    if (formData && summary && script) {
      const id = currentStoryId || crypto.randomUUID();
      const story: SavedStory = {
        id,
        createdAt: Date.now(),
        formData,
        summary,
        script
      };
      saveStory(story);
      setCurrentStoryId(id);
      alert('Histoire sauvegardée avec succès ! Retrouvez-la dans "Mes Histoires".');
    }
  };

  const handleBackToForm = () => {
    setError(null);
    setSummary(null);
    setView('form');
  };

  const handleBackHome = () => {
    setView('home');
  }

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <HomePage onStart={handleStart} onOpenSaved={handleOpenSaved} />;
      case 'saved-stories':
        return <SavedStoriesPage onLoad={handleLoadStory} onBack={handleBackHome} />;
      case 'form':
        return (
          <>
            {error && (
              <div className="bg-red-900 text-white p-4 mb-4 rounded-md text-center max-w-4xl mx-auto">
                <strong>Erreur :</strong> {error}
              </div>
            )}
            <CreationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </>
        );
      case 'summary':
        return summary ? (
          <SummaryPage
            summary={summary}
            onApprove={handleSummaryApproval}
            onRegenerate={handleRegenerateSummary}
            onBack={handleBackToForm}
            isLoading={isLoading}
          />
        ) : null;
      case 'loading':
        return <LoadingIndicator message={loadingMessage} />;
      case 'results':
        return script ? (
          <ResultPage
            script={script}
            onRegenerate={handleRegenerate}
            onRegenerateFrom={handleRegenerateFrom}
            onBack={handleBackToForm}
            onSave={handleSave}
            isLoading={isLoading}
          />
        ) : null;
      default:
        return <HomePage onStart={handleStart} onOpenSaved={handleOpenSaved} />;
    }
  };

  return <div className="min-h-screen bg-gray-900 text-gray-200">{renderContent()}</div>;
};

export default App;
