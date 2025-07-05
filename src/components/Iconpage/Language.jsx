import React, { useState } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'gu', label: 'Gujarati', flag: '🇮🇳' }
];

function Language() {
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Select Language</h2>
      <ul>
        {languages.map((lang) => (
          <li
            key={lang.code}
            onClick={() => setSelectedLang(lang)}
            className={`cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-blue-100 ${selectedLang.code === lang.code ? 'bg-blue-200 font-semibold' : ''
              }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-center">
        Selected Language: <span>{selectedLang.flag} {selectedLang.label}</span>
      </div>
    </div>
  );
}

export default Language;


