'use client';

import StoryList from '@/components/Story/StoryList';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header fijo */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stories</h1>
        </div>
      </header>

      {/* Contenedor principal */}
      <main className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm mt-4">
        {/* Contenedor de historias */}
        <StoryList />

        {/* Mensaje informativo */}
        <div className="p-6 text-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tus historias aparecerán aquí y desaparecerán después de 24 horas
          </p>
        </div>
      </main>
    </div>
  );
}
