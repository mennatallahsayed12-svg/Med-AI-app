/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Language } from "./types";
import { translations } from "./utils/translations";
import Header from "./components/Header";
import PatientPortal from "./components/PatientPortal";
import DoctorPortal from "./components/DoctorPortal";
import ClinicPortal from "./components/ClinicPortal";
import { HeartPulse, ShieldCheck, Sparkles, Building, ChevronRight, GraduationCap } from "lucide-react";

export default function App() {
  // Global States
  const [language, setLanguage] = useState<Language>("en");
  const [elderlyMode, setElderlyMode] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"patient" | "doctor" | "clinic">("patient");

  const t = translations[language];

  // Speech Helper
  const handleSpeak = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "ar" ? "ar-EG" : "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div 
      id="med-ai-root"
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen bg-slate-50 text-slate-900 font-sans transition-all duration-300 ${
        elderlyMode ? "text-xl selection:bg-blue-600 selection:text-white" : "text-sm"
      }`}
    >
      {/* Header element */}
      <Header
        language={language}
        setLanguage={setLanguage}
        elderlyMode={elderlyMode}
        setElderlyMode={setElderlyMode}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="pb-16 animate-fade-in">
        
        {/* Welcome Hero Section with quick details */}
        <section 
          id="hero-banner"
          className="bg-white border-b border-slate-200 py-12 px-4 shadow-sm"
        >
          <div className="max-w-7xl mx-auto text-center space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Interactive Healthcare Suite" : "باقة الرعاية الصحية التفاعلية"}</span>
            </div>

            <h2 className={`font-black text-slate-900 tracking-tight ${elderlyMode ? "text-4xl" : "text-3xl md:text-5xl"}`}>
              {language === "en" ? "Modern Integrated Healthcare Platform" : "المنصة التكنولوجية المتكاملة للرعاية الطبية"}
            </h2>

            <p className={`max-w-3xl mx-auto text-slate-500 leading-relaxed font-medium ${elderlyMode ? "text-2xl" : "text-base md:text-lg"}`}>
              {language === "en" 
                ? "Connecting patients, young medical graduates, and clinic managers. Experience bilingual AI diagnostics, certified academic courses, live consultations, and green medical waste recycling management."
                : "برنامج حاد لربط كبار السن والمرضى بالأطباء الاستشاريين، والعيادات بمراكز إعادة تدوير البلاستيك بمصر، بالإضافة لأكاديمية خريجي الكليات الطبية."
              }
            </p>

            {/* Quick feature stats list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
              <div 
                onClick={() => {
                  setActiveTab("patient");
                  handleSpeak(t.patientPortal);
                }}
                className={`p-5 bg-white border rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group hover:scale-102 flex flex-col items-center text-center ${
                  activeTab === "patient" ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200"
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner">👤</div>
                <h4 className="font-bold text-slate-800 text-sm">{t.patientPortal}</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">AI doctor assessment, EGP-priced clinic locations & direct consultations</p>
              </div>

              <div 
                onClick={() => {
                  setActiveTab("doctor");
                  handleSpeak(t.doctorPortal);
                }}
                className={`p-5 bg-white border rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group hover:scale-102 flex flex-col items-center text-center ${
                  activeTab === "doctor" ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200"
                }`}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner">🩺</div>
                <h4 className="font-bold text-slate-800 text-sm">{t.doctorPortal}</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">Audio/video lectures, discoveries, & accredited certifications quiz</p>
              </div>

              <div 
                onClick={() => {
                  setActiveTab("clinic");
                  handleSpeak(t.clinicPortal);
                }}
                className={`p-5 bg-white border rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group hover:scale-102 flex flex-col items-center text-center ${
                  activeTab === "clinic" ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200"
                }`}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner">🏥</div>
                <h4 className="font-bold text-slate-800 text-sm">{t.clinicPortal}</h4>
                <p className="text-slate-500 text-xs mt-1 leading-normal">Operational registry logs, EGP cashflows & certified recycling planners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic portal display */}
        <section id="portal-render-segment" className="relative">
          {activeTab === "patient" && (
            <PatientPortal 
              language={language} 
              elderlyMode={elderlyMode} 
              speechEnabled={speechEnabled} 
            />
          )}

          {activeTab === "doctor" && (
            <DoctorPortal 
              language={language} 
              elderlyMode={elderlyMode} 
              speechEnabled={speechEnabled} 
            />
          )}

          {activeTab === "clinic" && (
            <ClinicPortal 
              language={language} 
              elderlyMode={elderlyMode} 
              speechEnabled={speechEnabled} 
            />
          )}
        </section>

      </main>

      {/* Tidy human-literal Footer */}
      <footer 
        id="med-ai-footer"
        className="bg-white border-t border-slate-200 py-8 text-center"
      >
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-500 font-bold">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Med AI • HIPAA Compliant Secure Server • Republic of Egypt Health Network</span>
          </div>
          <p className="text-slate-400 text-xs">
            © 2026 Med AI Inc. All rights reserved. Supporting green clinics and local sustainability.
          </p>
        </div>
      </footer>
    </div>
  );
}
