import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Génération de votre scénario..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-900">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <h2 className="text-2xl text-white font-semibold mt-6">{message}</h2>
      <p className="text-gray-400 mt-2">L'IA tisse les fils de votre histoire. Cela peut prendre un moment.</p>
    </div>
  );
};

export default LoadingIndicator;