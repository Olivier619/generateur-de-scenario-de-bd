
import React, { useRef } from 'react';
import type { Script, Chapter } from '../types';

interface ResultPageProps {
  script: Script;
  onRegenerate: () => void;
  onRegenerateFrom: (chapterIndex: number) => void;
  onBack: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const formatScriptToText = (script: Script): string => {
  let text = `Titre de la BD: ${script.title}\n\n`;
  script.chapters.forEach((chapter, chapIndex) => {
    text += `--------------------------------------\n`;
    text += `Chapitre ${chapIndex + 1}: ${chapter.chapterTitle}\n`;
    text += `--------------------------------------\n\n`;
    chapter.pages.forEach(page => {
      text += `Page ${page.pageNumber}\n\n`;
      page.panels.forEach(panel => {
        text += `Case ${panel.panelNumber}\n`;
        text += `Description: ${panel.description}\n`;
        if (panel.narration) {
          text += `Narrateur (cartouche): "${panel.narration}"\n`;
        }
        panel.dialogues.forEach(dialogue => {
          text += `${dialogue.character} (dialogue): "${dialogue.dialogue}"\n`;
        });
        if (panel.onomatopoeia) {
          text += `Onomatopée: ${panel.onomatopoeia}\n`;
        }
        text += `\n`;
      });
    });
  });
  return text;
};

const ResultPage: React.FC<ResultPageProps> = ({ script, onRegenerate, onRegenerateFrom, onBack, onSave, isLoading }) => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  const handleExportTxt = () => {
    const textContent = formatScriptToText(script);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, '_')}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportNotImplemented = () => {
    alert("L'exportation en PDF/DOCX n'est pas encore implémentée.");
  };

  const ChapterView: React.FC<{ chapter: Chapter; index: number }> = ({ chapter, index }) => (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg">
      <h3 className="text-3xl font-bold text-indigo-400 mb-4 border-b-2 border-gray-700 pb-2">
        Chapitre {index + 1}: {chapter.chapterTitle}
      </h3>
      {chapter.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="mb-6">
          <h4 className="text-xl font-semibold text-gray-300 mb-3">Page {page.pageNumber}</h4>
          {page.panels.map((panel, panelIndex) => (
            <div key={panelIndex} className="mb-4 pl-4 border-l-4 border-gray-600">
              <p className="font-bold text-indigo-300">Case {panel.panelNumber}</p>
              <p><span className="font-semibold text-gray-400">Description:</span> {panel.description}</p>
              {panel.narration && <p><span className="font-semibold text-gray-400">Narrateur:</span> <em>"{panel.narration}"</em></p>}
              {panel.dialogues.map((d, i) => (
                <p key={i}><span className="font-semibold text-gray-400">{d.character}:</span> "{d.dialogue}"</p>
              ))}
              {panel.onomatopoeia && <p className="font-bold text-yellow-400">{panel.onomatopoeia}</p>}
            </div>
          ))}
        </div>
      ))}
      <button 
        onClick={() => onRegenerateFrom(index)}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-500">
        Régénérer la fin de l'histoire à partir d'ici
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 self-start md:self-auto">&larr; Retour au formulaire</button>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={onSave} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Sauvegarder
          </button>
          <button onClick={handleExportTxt} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Exporter TXT</button>
          <button onClick={handleExportNotImplemented} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">PDF</button>
          <button onClick={onRegenerate} disabled={isLoading} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500">Régénérer tout</button>
        </div>
      </div>

      <div ref={scriptContainerRef} className="bg-gray-900 p-6 rounded-lg shadow-inner">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">{script.title}</h2>
        {script.chapters.map((chapter, index) => (
          <ChapterView key={index} chapter={chapter} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
