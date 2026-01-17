/**
 * @lowcode-platform/i18n
 * Language switcher component
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../hooks";
import { getLanguageInfo } from "../utils";
import type { Language } from "../types";

export interface LanguageSwitcherProps {
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for the button
   */
  buttonClassName?: string;
  /**
   * Custom class name for the dropdown
   */
  dropdownClassName?: string;
  /**
   * Custom class name for the item
   */
  itemClassName?: string;
  /**
   * Display format: 'full' | 'short' | 'native'
   * - 'full': Full language name (e.g., "Chinese")
   * - 'short': Language code (e.g., "zh")
   * - 'native': Native name (e.g., "简体中文")
   */
  displayFormat?: "full" | "short" | "native";
  /**
   * Show flag emoji (if available)
   */
  showFlag?: boolean;
  /**
   * Custom render function for button
   */
  renderButton?: (language: Language, info?: ReturnType<typeof getLanguageInfo>) => React.ReactNode;
  /**
   * Custom render function for item
   */
  renderItem?: (
    language: Language,
    isSelected: boolean,
    info?: ReturnType<typeof getLanguageInfo>
  ) => React.ReactNode;
}

/**
 * Language switcher component
 */
export function LanguageSwitcher({
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  itemClassName = "",
  displayFormat = "native",
  showFlag = false,
  renderButton,
  renderItem,
}: LanguageSwitcherProps) {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguageInfo = getLanguageInfo(language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = async (lang: Language) => {
    await changeLanguage(lang);
    setIsOpen(false);
  };

  const getDisplayText = (lang: Language) => {
    const info = getLanguageInfo(lang);
    if (!info) return lang;

    switch (displayFormat) {
      case "full":
        return info.name;
      case "short":
        return lang;
      case "native":
      default:
        return info.nativeName;
    }
  };

  const defaultButtonContent = (
    <>
      {showFlag && currentLanguageInfo?.flag && (
        <span className="mr-2">{currentLanguageInfo.flag}</span>
      )}
      <span>{getDisplayText(language)}</span>
      <svg
        className="ml-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </>
  );

  const defaultItemContent = (lang: Language, isSelected: boolean) => (
    <>
      {showFlag && getLanguageInfo(lang)?.flag && (
        <span className="mr-2">{getLanguageInfo(lang)?.flag}</span>
      )}
      <span>{getDisplayText(lang)}</span>
      {isSelected && (
        <svg
          className="ml-auto h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between px-3 py-2 text-sm font-medium
          bg-white border border-gray-300 rounded-md shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${buttonClassName}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {renderButton ? renderButton(language, currentLanguageInfo) : defaultButtonContent}
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1 w-full min-w-[160px] bg-white border border-gray-300 rounded-md shadow-lg
            ${dropdownClassName}
          `}
          role="listbox"
        >
          <div className="py-1">
            {availableLanguages.map((lang) => {
              const isSelected = lang === language;
              const info = getLanguageInfo(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm text-left
                    hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                    ${isSelected ? "bg-gray-50 font-medium" : ""}
                    ${itemClassName}
                  `}
                  role="option"
                  aria-selected={isSelected}
                >
                  {renderItem
                    ? renderItem(lang, isSelected, info)
                    : defaultItemContent(lang, isSelected)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}