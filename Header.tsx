/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Language } from "../types";
import { translations } from "../utils/translations";
import { HeartPulse, Globe, Accessibility, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  elderlyMode: boolean;
  setElderlyMode: (mode: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (mode: boolean) => void;
  activeTab: "patient" | "doctor" | "clinic";
  setActiveTab: (tab: "patient" | "doctor" | "clinic") => void;
}

export default function Header({
  language,
  setLanguage,
  elderlyMode,
  setElderlyMode,
  speechEnabled,
  setSpeechEnabled,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const t = translations[language];

  // Helper to pronounce items out loud if speech is enabled
  const handleSpeak = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "ar" ? "ar-EG" : "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  return (
    <header 
      id="med-ai-header"
      className="bg-white text-slate-900 shadow-sm transition-all duration-300 sticky top-0 z-50 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            handleSpeak(t.title + ". " + t.subtitle);
          }}
          onMouseEnter={() => handleSpeak(t.title)}
        >
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md">
            <HeartPulse className={elderlyMode ? "w-8 h-8" : "w-6 h-6"} />
          </div>
          <div>
            <h1 className={`font-black tracking-tight text-blue-900 ${elderlyMode ? "text-3xl" : "text-xl"}`}>
              {t.title}
            </h1>
            <p className={`text-slate-500 font-medium ${elderlyMode ? "text-lg" : "text-xs"}`}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Accessibility Panel & Language */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {/* Elderly Mode Switcher */}
          <button
            id="toggle-elderly-mode"
            onClick={() => {
              const nextMode = !elderlyMode;
              setElderlyMode(nextMode);
              handleSpeak(nextMode ? t.elderlyMode : t.standardMode);
            }}
            onMouseEnter={() => handleSpeak(t.elderlyMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              elderlyMode 
                ? "bg-blue-600 text-white border-blue-700 scale-103 shadow-md" 
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            <Accessibility className={elderlyMode ? "w-4 h-4 animate-bounce" : "w-3.5 h-3.5"} />
            <span>{elderlyMode ? t.elderlyMode : t.elderlyMode}</span>
          </button>

          {/* Sound Synthesizer Speech Toggle */}
          <button
            id="toggle-speech-synthesis"
            onClick={() => {
              const nextSpeech = !speechEnabled;
              setSpeechEnabled(nextSpeech);
              if (nextSpeech) {
                setTimeout(() => handleSpeak(t.textToSpeech), 300);
              }
            }}
            onMouseEnter={() => handleSpeak(t.textToSpeech)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
              speechEnabled
                ? "bg-blue-600 text-white border-blue-700 shadow-md"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            {speechEnabled ? (
              <Volume2 className={elderlyMode ? "w-4 h-4 animate-spin" : "w-3.5 h-3.5"} />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{t.textToSpeech}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="toggle-lang"
            onClick={() => {
              const nextLang: Language = language === "en" ? "ar" : "en";
              setLanguage(nextLang);
              handleSpeak(nextLang === "ar" ? "اللغة العربية مفعلة" : "English is activated");
            }}
            onMouseEnter={() => handleSpeak(t.language)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-slate-100/60 border-t border-slate-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-center gap-2 sm:gap-4 md:gap-5 flex-wrap">
          <button
            id="nav-patient"
            onClick={() => {
              setActiveTab("patient");
              handleSpeak(t.patientPortal);
            }}
            onMouseEnter={() => handleSpeak(t.patientPortal)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "patient"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm scale-102"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            } ${elderlyMode ? "text-xl px-6 py-3" : "text-xs"}`}
          >
            👤 {t.patientPortal}
          </button>
          
          <button
            id="nav-doctor"
            onClick={() => {
              setActiveTab("doctor");
              handleSpeak(t.doctorPortal);
            }}
            onMouseEnter={() => handleSpeak(t.doctorPortal)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "doctor"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm scale-102"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            } ${elderlyMode ? "text-xl px-6 py-3" : "text-xs"}`}
          >
            🩺 {t.doctorPortal}
          </button>

          <button
            id="nav-clinic"
            onClick={() => {
              setActiveTab("clinic");
              handleSpeak(t.clinicPortal);
            }}
            onMouseEnter={() => handleSpeak(t.clinicPortal)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === "clinic"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm scale-102"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            } ${elderlyMode ? "text-xl px-6 py-3" : "text-xs"}`}
          >
            🏥 {t.clinicPortal}
          </button>
        </div>
      </div>
    </header>
  );
}
