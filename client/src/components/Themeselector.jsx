import React, { useState } from 'react';
import { FaPalette } from 'react-icons/fa';

function ThemeSelector({ themes, changeTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-2 right-4 z-50">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white p-2 rounded-full cursor-pointer text-2xl shadow-lg hover:scale-110 transition-transform"
      >
        <FaPalette />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-blue-500 rounded-md shadow-lg max-h-72 overflow-y-auto w-52 z-50">
          {Object.entries(themes).map(([themeName, themeColors]) => (
            <div
              key={themeName}
              className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleThemeChange(themeName)}
            >
              <span className="text-gray-800 font-medium">{themeName}</span>
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: themeColors.bgColor }}
                ></div>
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: themeColors.fontColor }}
                ></div>
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: themeColors.hlColor }}
                ></div>
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: themeColors.fgColor }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;
