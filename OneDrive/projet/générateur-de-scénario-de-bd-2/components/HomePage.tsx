
import React from 'react';

interface HomePageProps {
  onStart: () => void;
  onOpenSaved: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart, onOpenSaved }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-900">
      <header className="flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4">
          Générateur de Scénario de BD
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
          Donnez vie à vos histoires en quelques clics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-4">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg shadow-indigo-500/50 flex-1 max-w-xs"
          >
            Nouvelle histoire
          </button>
          
          <button
            onClick={onOpenSaved}
            className="px-8 py-4 bg-gray-700 text-white font-bold text-lg rounded-full hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg flex-1 max-w-xs border border-gray-600"
          >
            Mes Histoires
          </button>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
