import React, { createContext, useState, useContext } from "react";

//  language object
const defaultLanguage = {
  code: "en",
  label: "English",
  flag: "🇬🇧",
};

const LanguageContext = createContext({
  language: defaultLanguage,
  changeLanguage: () => {},
});

// Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
