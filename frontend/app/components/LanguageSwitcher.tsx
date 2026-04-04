"use client";

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-zinc-700">
      <Globe size={16} className="text-orange-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
        className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
      >
        <option value="en" className="bg-zinc-900">English</option>
        <option value="fr" className="bg-zinc-900">Français</option>
      </select>
    </div>
  );
}
