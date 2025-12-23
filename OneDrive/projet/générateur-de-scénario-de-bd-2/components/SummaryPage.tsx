import React from 'react';

interface SummaryPageProps {
  summary: string;
  onApprove: () => void;
  onRegenerate: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ summary, onApprove, onRegenerate, onBack, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center text-white mb-6">Résumé de l'Histoire</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full mb-8">
        <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
      </div>
      <p className="text-lg text-gray-400 mb-6 text-center">Ce résumé vous convient-il ? Vous pouvez l'approuver pour générer le script complet ou demander une nouvelle version.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={onApprove}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 duration-300 ease-in-out disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-green-500/50 flex-1"
        >
          {isLoading ? 'Génération du script...' : 'Approuver et Générer le Script'}
        </button>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-yellow-600 text-white font-bold text-lg rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-transform transform hover:scale-105 duration-300 ease-in-out disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/50 flex-1"
        >
          Régénérer le résumé
        </button>
      </div>
       <button onClick={onBack} disabled={isLoading} className="mt-6 text-indigo-400 hover:text-indigo-300 disabled:text-gray-500">
        &larr; Revenir au formulaire pour modifier
      </button>
    </div>
  );
};

export default SummaryPage;