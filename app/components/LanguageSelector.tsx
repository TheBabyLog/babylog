import { useCallback, useState } from "react";
import { setLanguage, getCurrentLanguage } from "~/src/utils/translate";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value);
      setCurrentLanguage(e.target.value);
      window.location.reload();
    },
    []
  );

  return (
    <select
      id="language-selector"
      onChange={handleChange}
      value={currentLanguage}
      className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
    >
      {languages.map((lang) => (
        <option
          key={lang.code}
          value={lang.code}
          className="bg-gray-800 text-white"
        >
          {lang.name}
        </option>
      ))}
    </select>
  );
}
