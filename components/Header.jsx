'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { useTheme } from '../context/themeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-full flex justify-between items-center py-4 bg-white dark:bg-black transition-colors duration-300 border-b-2 border-b-gray-300 dark:border-b-gray-600 mb-6 sm:mb-12">
      <h1 className="text-xl sm:text-5xl font-bold text-black dark:text-white">MindBytes</h1>
      <button
        className="p-2 rounded-lg bg-white text-gray-950 border border-gray-300
                   dark:bg-black dark:text-white dark:border-gray-700
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
