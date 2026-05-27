/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Language, MedicineEntry, Clinic, DoctorChat } from "../types";
import { translations } from "../utils/translations";
import { 
  Bot, 
  MapPin, 
  Search, 
  Clock, 
  Activity, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Bell, 
  Trash2, 
  UserPlus, 
  HeartHandshake, 
  Stethoscope, 
  DollarSign 
} from "lucide-react";

interface PatientPortalProps {
  language: Language;
  elderlyMode: boolean;
  speechEnabled: boolean;
}

// Full medical specialties array as requested: "all specialities of medicine"
const SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Gynecology",
  "Psychiatry",
  "Ophthalmology",
  "Dentistry"
];

// Seed list of Egypt clinics with locations and session prices in EGP
const INITIAL_CLINICS: Clinic[] = [
  {
    id: "c1",
    nameEn: "El Nile Cardiology Care & Diagnostics",
    nameAr: "بوابة النيل للأوعية الدموية ورعاية القلب",
    specialtyEn: "Cardiology",
    specialtyAr: "طب القلب والأوعية الدموية",
    doctorEn: "Dr. Ahmed El-Shennawy",
    doctorAr: "د. أحمد الشناوي",
    priceEgp: 450,
    rating: 4.9,
    phone: "+20 100 234 5678",
    locationEn: "Dokki, Giza - 12 El-Ansar St.",
    locationAr: "الدقي، الجيزة - ١٢ شارع الأنصار",
    lat: 30.040,
    lng: 31.215
  },
  {
    id: "c2",
    nameEn: "Cairo Pediatric Advanced Center",
    nameAr: "مركز القاهرة التخصصي المتطور لطب الأطفال",
    specialtyEn: "Pediatrics",
    specialtyAr: "طب الأطفال وحديثي الولادة",
    doctorEn: "Dr. Mennatallah Kamal",
    doctorAr: "د. منة الله كمال",
    priceEgp: 300,
    rating: 4.8,
    phone: "+20 122 876 5432",
    locationEn: "Zamalek, Cairo - 24 Shagaret El Dor St.",
    locationAr: "الزمالك، القاهرة - ٢٤ شارع شجرة الدر",
    lat: 30.063,
    lng: 31.220
  },
  {
    id: "c3",
    nameEn: "Alexandria Laser & Dermatology Clinic",
    nameAr: "عيادة الإسكندرية التجميلية وطب الجلدية",
    specialtyEn: "Dermatology",
    specialtyAr: "الأمراض الجلدية والتناسلية",
    doctorEn: "Dr. Khaled Abdel-Ghaffar",
    doctorAr: "د. خالد عبد الغفار",
    priceEgp: 350,
    rating: 4.7,
    phone: "+20 3 543 2100",
    locationEn: "Smouha, Alexandria - Albert Al-Awal St.",
    locationAr: "سموحة، الإسكندرية - شارع ألبرت الأول",
    lat: 31.205,
    lng: 29.955
  },
  {
    id: "c4",
    nameEn: "Al Ahly Bone & Joint Orthopedics",
    nameAr: "مركز الأهلي لتقويم العظام والمفاصل السريرية",
    specialtyEn: "Orthopedics",
    specialtyAr: "طب وجراحة العظام والمفاصل",
    doctorEn: "Dr. Hossam El-Badry",
    doctorAr: "د. حسام البدري",
    priceEgp: 400,
    rating: 4.9,
    phone: "+20 111 445 5667",
    locationEn: "Heliopolis, Cairo - 88 Merghany St.",
    locationAr: "مصر الجديدة، القاهرة - ٨٨ شارع المرغني",
    lat: 30.091,
    lng: 31.332
  },
  {
    id: "c5",
    nameEn: "NerveCare Neurology & Brain EEG Clinic",
    nameAr: "عيادة نيرف كير لطب المخ والأعصاب والسكتات الدماغية",
    specialtyEn: "Neurology",
    specialtyAr: "طب المخ والأعصاب وسكتات الدماغ",
    doctorEn: "Dr. Farida Osman",
    doctorAr: "د. فريدة عثمان",
    priceEgp: 600,
    rating: 5.0,
    phone: "+20 102 991 8827",
    locationEn: "Maadi, Cairo - Rd 9, Landmark Plaza Building",
    locationAr: "المعادي، القاهرة - شارع ٩، مبنى لاند مارك",
    lat: 29.960,
    lng: 31.261
  },
  {
    id: "c6",
    nameEn: "Cleopatra Gynecology & Maternity Center",
    nameAr: "مستشفى كليوباترا لطب النساء والتوليد المتكامل",
    specialtyEn: "Gynecology",
    specialtyAr: "طب النساء والولادة والصحة الإنجابية",
    doctorEn: "Dr. Yasmin Sabri",
    doctorAr: "د. ياسمين صبري",
    priceEgp: 500,
    rating: 4.8,
    phone: "+20 100 882 1199",
    locationEn: "Tagamoa, New Cairo - Soun Street Hospital",
    locationAr: "التجمع الخامس، القاهرة الجديدة - مستشفى شارع التسعين",
    lat: 30.015,
    lng: 31.439
  },
  {
    id: "c7",
    nameEn: "Cairo Mental Well Psychiatry & Therapy",
    nameAr: "مركز العافية النفسية للطب النفسي والسلوكي",
    specialtyEn: "Psychiatry",
    specialtyAr: "الطب النفسي والصحة النفسية",
    doctorEn: "Dr. Tarek Lotfy",
    doctorAr: "د. طارق لطفي",
    priceEgp: 700,
    rating: 4.6,
    phone: "+20 120 445 1122",
    locationEn: "Mohandessin, Giza - 40 Gameat El-Dowal St.",
    locationAr: "المهندسين، الجيزة - ٤٠ شارع جامعة الدول العربية",
    lat: 30.053,
    lng: 31.200
  },
  {
    id: "c8",
    nameEn: "Nile Eye Surgery & Lasik Center",
    nameAr: "مركز عيون النيل لجراحات الرمد والليزك",
    specialtyEn: "Ophthalmology",
    specialtyAr: "طب وجراحة العيون والرمد",
    doctorEn: "Dr. Mahmoud El-Leithy",
    doctorAr: "د. محمود الليثي",
    priceEgp: 380,
    rating: 4.9,
    phone: "+20 155 776 2200",
    locationEn: "Mansoura, Dakahlia - Geishe St.",
    locationAr: "المنصورة، الدقهلية - شارع الجيش أمام المحافظة",
    lat: 31.040,
    lng: 31.380
  },
  {
    id: "c9",
    nameEn: "Elite Clinical General Healthcare",
    nameAr: "المركز الطبي المتكامل لطب باطنة الأسرة",
    specialtyEn: "General Medicine",
    specialtyAr: "الطب الباطني العام والوقائي",
    doctorEn: "Dr. Heba Magdy",
    doctorAr: "د. هبة مجدي",
    priceEgp: 200,
    rating: 4.5,
    phone: "+20 128 334 1100",
    locationEn: "Luxor City Center - Television St.",
    locationAr: "وسط مدينة الأقصر - شارع التلفزيون",
    lat: 25.687,
    lng: 32.640
  },
  {
    id: "c10",
    nameEn: "Pharaonic Advanced Dental Clinic",
    nameAr: "المركز الفرعوني المتخصص لطب وجراحة الأسنان",
    specialtyEn: "Dentistry",
    specialtyAr: "طب وجراحة الفم والأسنان",
    doctorEn: "Dr. Karim Sherif",
    doctorAr: "د. كريم شريف",
    priceEgp: 320,
    rating: 4.9,
    phone: "+20 97 231 4455",
    locationEn: "Aswan Corniche Road - Pharaonic Center",
    locationAr: "كورنيش أسوان - عمارة فرعون بوسط البلد",
    lat: 24.088,
    lng: 32.899
  }
];

// Initial Seed Online Doctors list for Live Chat simulation representing all specialties
const INITIAL_CHATS: DoctorChat[] = [
  {
    id: "d1",
    doctorNameEn: "Dr. Ahmed El-Shennawy",
    doctorNameAr: "د. أحمد الشناوي",
    specialtyEn: "Cardiology",
    specialtyAr: "طب القلب والأوعية الدموية",
    online: true,
    avatarSeed: "doctor-1",
    messages: [
      { id: "m1", sender: "doctor", text: "Hello! I am Dr. Ahmed. I specialize in adult cardiology. How represents your arterial pressure or breath today?", timestamp: "02:40 AM" }
    ]
  },
  {
    id: "d2",
    doctorNameEn: "Dr. Mennatallah Kamal",
    doctorNameAr: "د. منة الله كمال",
    specialtyEn: "Pediatrics",
    specialtyAr: "طب الأطفال وحديثي الولادة",
    online: true,
    avatarSeed: "doctor-2",
    messages: [
      { id: "m2", sender: "doctor", text: "أهلاً بك! أنا الدكتورة منة الله مخصصة لطب الأطفال. كيف يمكنني مساعدة طفلك اليوم؟", timestamp: "02:48 AM" }
    ]
  },
  {
    id: "d3",
    doctorNameEn: "Dr. Khaled Abdel-Ghaffar",
    doctorNameAr: "د. خالد عبد الغفار",
    specialtyEn: "Dermatology",
    specialtyAr: "الأمراض الجلدية والتناسلية",
    online: false,
    avatarSeed: "doctor-3",
    messages: [
      { id: "m3", sender: "doctor", text: "Welcome. Please upload a clear photo of any rashes or lesions for assessment.", timestamp: "Yesterday" }
    ]
  },
  {
    id: "d4",
    doctorNameEn: "Dr. Heba Magdy",
    doctorNameAr: "د. هبة مجدي",
    specialtyEn: "General Medicine",
    specialtyAr: "الطب الباطني العام والوقائي",
    online: true,
    avatarSeed: "doctor-4",
    messages: [
      { id: "m4", sender: "doctor", text: "مرحباً بك، أنا د. هبة طبيبة الباطنة العامة. يسعدني الإجابة عن استشاراتك الدوائية والأعراض اليومية.", timestamp: "02:15 AM" }
    ]
  }
];

export default function PatientPortal({ language, elderlyMode, speechEnabled }: PatientPortalProps) {
  const t = translations[language];

  // AI virtual doctor state
  const [symptoms, setSymptoms] = useState("");
  const [historyInput, setHistoryInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Medicine alarm state
  const [medicines, setMedicines] = useState<MedicineEntry[]>(() => {
    const saved = localStorage.getItem("medai_medicines");
    return saved ? JSON.parse(saved) : [];
  });
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedTime, setNewMedTime] = useState("09:00");

  // Alarms trigger states
  const [activeAlarm, setActiveAlarm] = useState<MedicineEntry | null>(null);

  // Clinic directory search & filter
  const [searchSpecialty, setSearchSpecialty] = useState("All");
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(INITIAL_CLINICS[0]);

  // Doctor Direct consultation state
  const [chats, setChats] = useState<DoctorChat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("d1");
  const [chatInput, setChatInput] = useState("");
  const [isTypingDoctor, setIsTypingDoctor] = useState(false);

  // Persist medicines
  useEffect(() => {
    localStorage.setItem("medai_medicines", JSON.stringify(medicines));
  }, [medicines]);

  // Check Alarms periodically (Simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHourMin = now.toTimeString().substring(0, 5); // "HH:MM"
      
      // Look for a medicine that matches this exact time, is active, and hasn't been trigger alerted yet
      const triggered = medicines.find(med => med.active && med.timeSlot === currentHourMin);
      if (triggered && activeAlarm?.id !== triggered.id) {
        setActiveAlarm(triggered);
        // Synthesise an alarm ring
        handleSpeak(t.alarmAlert + ": " + triggered.name + " " + triggered.dosage);
      }
    }, 10000); // check every 10 seconds

    return () => clearInterval(interval);
  }, [medicines]);

  // Text-to-speech helper
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

  // Drag and drop or manual file selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Consult AI Doctor via server-side endpoint
  const queryAiDoctor = async () => {
    if (!symptoms.trim()) {
      handleSpeak(language === "ar" ? "برجاء كتابة الأعراض أولاً" : "Please describe symptoms first");
      return;
    }

    setLoadingAi(true);
    setAiReport(null);
    handleSpeak(t.aiAnalyzing);

    const systemInstruction = `You are Med AI Virtual Doctor. Analyze the user's symptoms and personal medical conditions. Provide an elegant diagnostic possibility breakdown, suggest non-prescription medications (e.g., standard paracetamol, hydration limits, rest), lifestyle modifications, and highlight warning signs that demand urgent professional consultation in Egypt. Make sure your response formatting is beautifully organized with bullet points, brief paragraphs, and localized references (like consulting Egyptian medical consultants). Output in ${language === "en" ? "English language with spacing suitable for elderly users." : "Arabic language with clear high-contrast terms and friendly voice."}`;

    const contents = [
      {
        role: "user",
        parts: [
          { text: `Symptoms described: ${symptoms}` },
          { text: `Prior medical history: ${historyInput || "None recorded"}` },
          ...(selectedFile ? [{ inlineData: { mimeType: "image/png", data: selectedFile.split(",")[1] } }] : [])
        ]
      }
    ];

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, systemInstruction }),
      });

      const data = await res.json();
      if (data.text) {
        setAiReport(data.text);
        handleSpeak(language === "ar" ? "حصلت على تقييم طبي أولي بنجاح" : "Successfully generated preliminary medical assessment");
      } else {
        setAiReport(data.error || "Could not retrieve doctor advice.");
      }
    } catch (error: any) {
      console.error(error);
      setAiReport("Unable to contact the virtual doctor server. Please configure your secrets or try again later.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Medicine tracker logic
  const handleAddMedicine = () => {
    if (!newMedName.trim() || !newMedDosage.trim()) return;
    const newEntry: MedicineEntry = {
      id: "med-" + Math.random().toString(36).substr(2, 9),
      name: newMedName,
      dosage: newMedDosage,
      timeSlot: newMedTime,
      takenDays: ["Everyday"],
      active: true,
      history: []
    };
    setMedicines([...medicines, newEntry]);
    setNewMedName("");
    setNewMedDosage("");
    handleSpeak(language === "ar" ? "تم جدولة الدواء بنجاح" : "Medicine scheduled successfully");
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
    handleSpeak(language === "ar" ? "تم إزالة الدواء" : "Medicine removed");
  };

  const toggleMedActive = (id: string) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  // Online Doctor chat simulation response
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMessageId = "msg-" + Math.random().toString(36).substr(2, 9);
    
    // Update chat locally with user message
    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [
            ...c.messages,
            { id: userMessageId, sender: "patient", text: chatInput, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        };
      }
      return c;
    });

    setChats(updatedChats);
    const sentInput = chatInput;
    setChatInput("");
    setIsTypingDoctor(true);

    // Simulate direct doctor response using Gemini after a small delay
    setTimeout(async () => {
      try {
        const activeDoc = chats.find(c => c.id === activeChatId);
        const doctorTopicHistory = activeDoc?.messages.map(m => `${m.sender}: ${m.text}`).join("\n") || "";
        
        // Let's call the server endpoint to generate a personalized direct doctor response
        const systemInstruction = `You are playing the role of ${activeDoc?.doctorNameEn}, a certified specialist in ${activeDoc?.specialtyEn} operating in Cairo, Egypt. Send a direct chat response to the patient based on their query: "${sentInput}". Maintain professional composure, be empathetic, outline brief practical guidelines, and speak in ${language === "en" ? "English" : "Arabic"}. Keep it concise (2-4 sentences max) as it is in a fast chat box.`;
        
        const contents = [{ role: 'user', parts: [{ text: `Clinical chat context:\n${doctorTopicHistory}\nPatient's new query: ${sentInput}` }] }];
        
        const res = await fetch("/api/gemini/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents, systemInstruction }),
        });
        const data = await res.json();
        const docReply = data.text || (language === "ar" ? "أنا هنا لمساعدتك. هل تود حجز كشف طبي قريب بالعيادة؟" : "I understand. Would you like to schedule an physical consultation at our clinic to examine this closer?");
        
        setChats(prevChats => prevChats.map(c => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                { 
                  id: "doc-reply-" + Math.random(), 
                  sender: "doctor", 
                  text: docReply, 
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }
              ]
            };
          }
          return c;
        }));
        handleSpeak(language === "ar" ? "لديك رد جديد من الطبيب" : "New message from doctor received");
      } catch (err) {
        console.warn("Simulated chat fallback", err);
      } finally {
        setIsTypingDoctor(false);
      }
    }, 2500);
  };

  const filteredClinics = searchSpecialty === "All" 
    ? INITIAL_CLINICS 
    : INITIAL_CLINICS.filter(c => c.specialtyEn === searchSpecialty);

  return (
    <div className={`p-4 md:p-6 space-y-8 ${elderlyMode ? "text-xl leading-relaxed" : "text-sm"} max-w-7xl mx-auto`}>
      
      {/* Full Screen Medicine Alarm Dialogue Modal */}
      {activeAlarm && (
        <div id="medicine-alarm-dialog" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 animate-fade-in transition-all">
          <div className="bg-white border-2 border-blue-500 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="p-4 bg-orange-100 rounded-full text-orange-600 animate-bounce">
                <Bell className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.alarmAlert}</h2>
            
            <div className="space-y-2 py-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{t.medName}</p>
              <h3 className="text-2xl font-bold text-slate-800">{activeAlarm.name}</h3>
              <p className="text-lg text-blue-600 font-bold">{t.dosage}: {activeAlarm.dosage}</p>
              <p className="text-sm text-slate-500 font-mono flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-slate-400" /> {activeAlarm.timeSlot}
              </p>
            </div>

            <button
              onClick={() => {
                setActiveAlarm(null);
                handleSpeak(language === "ar" ? "تم إيقاف المنبه بنجاح" : "Alarm turned off successfully");
              }}
              className="w-full bg-blue-600 text-white font-extrabold text-lg py-4 px-6 rounded-2xl hover:scale-102 active:scale-98 transition-all shadow-md hover:bg-blue-700"
            >
              ✅ {t.dismiss}
            </button>
          </div>
        </div>
      )}

      {/* Grid layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: AI virtual doctor (8 cols) & Alarms (4 cols) or similar hierarchy */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Virtual Doctor segment */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h2 className={`font-black text-slate-900 ${elderlyMode ? "text-3xl" : "text-xl"}`}>
                  ✨ {t.virtualDoctor}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Powered by modern Gemini-3.5-Flash Diagnostics</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Symptom Input */}
              <div className="space-y-2">
                <label className="text-slate-800 font-bold text-base flex items-center gap-2">
                  <span>🩺 {language === "en" ? "Describe Your Symptoms:" : "اكتب الأعراض التي تعاني منها:"}</span>
                </label>
                <textarea
                  id="ai-symptom-input"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.sympPlaceholder}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none text-base font-medium"
                />
              </div>

              {/* Patient History Inputs */}
              <div className="space-y-2">
                <label className="text-slate-800 font-bold text-base block">
                  {t.historyLabel}
                </label>
                <input
                  id="ai-history-input"
                  type="text"
                  value={historyInput}
                  onChange={(e) => setHistoryInput(e.target.value)}
                  placeholder={t.historyPlaceholder}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Supporting Materials File Upload */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 focus:outline-none transition-all relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Activity className="w-10 h-10 text-slate-400 mb-2 animate-pulse" />
                <p className="text-slate-700 font-bold text-sm">
                  {fileName ? `📎 ${fileName}` : (language === "ar" ? "اضغط لرفع صور الأشعة / التحاليل / الجروح" : "Click / Drag clinical image reports, X-rays, or wound files")}
                </p>
                <p className="text-xs text-slate-400 mt-1">Accepts images & reports (PNG/JPG)</p>
              </div>

              {/* Consult Button & Loader */}
              <button
                id="btn-ai-consult"
                onClick={queryAiDoctor}
                disabled={loadingAi}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-4 px-6 rounded-2xl hover:scale-101 active:scale-99 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer"
              >
                {loadingAi ? (
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.aiAnalyzing}</span>
                  </div>
                ) : (
                  <>
                    <Bot className="w-5 h-5" />
                    <span>{t.sendSymptomBtn}</span>
                  </>
                )}
              </button>

              {/* AI Diagnostic Report Result Box */}
              {aiReport && (
                <div id="ai-doctor-report" className="mt-6 bg-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <h3 className="text-blue-700 font-bold text-lg flex items-center gap-2">
                      📋 {t.aiAdviceTitle}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">UTC Model Engine</span>
                  </div>
                  
                  {/* Styled text to format medical markdown advice beautifully */}
                  <div className="text-slate-800 mt-2 space-y-3 whitespace-pre-line text-base max-h-96 overflow-y-auto pr-2">
                    {aiReport}
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-normal font-medium">
                      {t.aiAdviceDisclaimer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Street Locator, Clinic Finder & Simulated Egypt Google Map option */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <h2 className={`font-black text-slate-900 ${elderlyMode ? "text-3xl" : "text-xl"}`}>
                    📍 {t.nearestClinicsTitle}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">Direct connections & Session prices (Egyptian Pounds EGP)</p>
                </div>
              </div>

              {/* Interactive Specialty Filter representing all specialties */}
              <div className="w-full sm:w-auto">
                <label className="text-xs text-slate-500 block mb-1 font-bold">{t.searchSpecialtyEn}</label>
                <select
                  id="select-specialty-filter"
                  value={searchSpecialty}
                  onChange={(e) => {
                    setSearchSpecialty(e.target.value);
                    const matched = INITIAL_CLINICS.find(c => e.target.value === "All" || c.specialtyEn === e.target.value);
                    if (matched) setSelectedClinic(matched);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-slate-800 px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="All">{t.allSpecialties}</option>
                  {SPECIALTIES.map(sp => (
                    <option key={sp} value={sp}>
                      {language === "en" ? sp : t.specialties[sp as keyof typeof t.specialties]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Clinics list (5 cols) */}
              <div className="md:col-span-5 space-y-3 max-h-96 overflow-y-auto pr-2">
                {filteredClinics.map(clinic => (
                  <div
                    key={clinic.id}
                    onClick={() => {
                      setSelectedClinic(clinic);
                      handleSpeak((language === 'ar' ? clinic.nameAr : clinic.nameEn) + ", " + t.sessionPrice + " " + clinic.priceEgp + " " + t.egp);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                      selectedClinic.id === clinic.id 
                        ? "bg-blue-50/60 border-blue-400 shadow-sm" 
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                        {language === "en" ? clinic.specialtyEn : clinic.specialtyAr}
                      </span>
                      <span className="text-blue-600 font-extrabold text-sm">
                        {clinic.priceEgp} {t.egp}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 mt-2 leading-tight text-sm">
                      {language === "en" ? clinic.nameEn : clinic.nameAr}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">👨‍⚕️ {language === "en" ? clinic.doctorEn : clinic.doctorAr}</p>
                    <div className="flex items-center justify-between text-slate-400 text-xs mt-3">
                      <span className="font-bold text-yellow-600">⭐ {clinic.rating} {t.rating}</span>
                      <span className="text-slate-500 font-bold">📍 {language === "en" ? clinic.locationEn.split(",")[0] : clinic.locationAr.split("،")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Simulator Canvas (7 cols) */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-4 flex flex-col relative overflow-hidden min-h-[300px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    🗺️ {t.simulatedGoogleMap}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">Lat: {selectedClinic.lat.toFixed(3)} | Lng: {selectedClinic.lng.toFixed(3)}</span>
                </div>

                {/* Simulated Map Visual Drawing incorporating coordinate markers */}
                <div className="flex-1 rounded-2xl relative bg-slate-50 border border-slate-100 overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Grid Lines indicating simulated maps */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-75" />
                  
                  {/* Egypt Delta Nile Flow illustration */}
                  <svg className="absolute inset-0 w-full h-full text-blue-200/50 pointer-events-none stroke-current" viewBox="0 0 100 100" fill="none">
                    <path d="M50,100 C50,80 40,60 42,40 C44,20 60,10 65,0" strokeWidth="4" />
                    <path d="M42,40 C30,30 20,20 10,10" strokeWidth="2" />
                    <path d="M42,40 C55,30 75,25 90,15" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  {/* Dynamic Marker of Selected Clinic */}
                  <div 
                    className="absolute z-10 transition-all duration-700 flex flex-col items-center"
                    style={{
                      left: `${((selectedClinic.lng - 29.5) / 4.5) * 80 + 10}%`,
                      top: `${(1 - (selectedClinic.lat - 23.5) / 8.5) * 80 + 10}%`
                    }}
                  >
                    {/* Ring Pulse anim */}
                    <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-500 opacity-20 animate-ping" />
                    <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg border-2 border-white relative cursor-pointer group">
                      <Stethoscope className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>

                  {/* Info Overlay Box inside the Map */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white border border-slate-200 p-3 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 text-sm leading-tight">{language === "en" ? selectedClinic.nameEn : selectedClinic.nameAr}</p>
                      <p className="text-slate-500 font-bold mt-0.5">📍 {language === "en" ? selectedClinic.locationEn : selectedClinic.locationAr}</p>
                      <p className="text-slate-400 font-mono mt-0.5">{selectedClinic.phone}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-400 font-bold">{t.sessionPrice}</p>
                      <p className="text-sm font-black text-blue-600">{selectedClinic.priceEgp} {t.egp}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold text-[10px]">
                        {language === "en" ? "Directions Ready" : "الاتجاهات جاهزة"}
                      </span>
                    </div>
                  </div>

                  <p className="absolute top-3 right-3 text-slate-500 font-bold text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {t.mapInstruction}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Medicine Scheduler (4 cols) & Direct Consult Messenger */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Medicine Alarms and Tracker Scheduler */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  ⏰ {t.medicineTrackerTitle}
                </h2>
                <p className="text-slate-500 text-xs font-semibold">Hourly sound/text alerts for elderly</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-slate-700 font-bold text-xs uppercase tracking-wider">{t.addMedicine}</p>
              
              <div className="space-y-1">
                <input
                  id="med-name-input"
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder={t.medName}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  id="med-dosage-input"
                  type="text"
                  value={newMedDosage}
                  onChange={(e) => setNewMedDosage(e.target.value)}
                  placeholder={t.dosage}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
                <input
                  id="med-time-input"
                  type="time"
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:border-blue-500 text-sm font-medium cursor-pointer"
                />
              </div>

              <button
                id="btn-add-med"
                onClick={handleAddMedicine}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                🔔 {t.remindMe}
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700">{t.activeAlarms}</h3>
              {medicines.length === 0 ? (
                <div className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
                  {t.noMedicinesYet}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {medicines.map(med => (
                    <div key={med.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={med.active}
                          onChange={() => toggleMedActive(med.id)}
                          className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <div className={`${!med.active ? "opacity-40 line-through" : ""}`}>
                          <p className="font-bold text-slate-800 text-sm">{med.name}</p>
                          <p className="text-xs text-slate-500">{med.dosage} • <span className="font-bold text-blue-600">{med.timeSlot}</span></p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMedicine(med.id)}
                        className="p-1.5 bg-white text-slate-400 hover:text-rose-500 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Patient-Doctor Direct consultation Messenger */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  💬 {t.doctorChatTitle}
                </h2>
                <p className="text-slate-500 text-xs font-medium">{t.doctorChatSub}</p>
              </div>
            </div>

            {/* Doctors slider/selector */}
            <div className="flex gap-2 pb-2 overflow-x-auto">
              {chats.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveChatId(item.id);
                    handleSpeak(t.chatWith + " " + (language === 'ar' ? item.doctorNameAr : item.doctorNameEn));
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shrink-0 border text-xs font-bold transition-all cursor-pointer ${
                    activeChatId === item.id 
                      ? "bg-blue-600 text-white border-blue-700 shadow-sm" 
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <img 
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.avatarSeed}`} 
                    alt="avatar" 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full bg-slate-200"
                  />
                  <span>{language === "en" ? item.doctorNameEn.split(". ")[1] : item.doctorNameAr.split(". ")[1]}</span>
                  {item.online && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 h-64 flex flex-col justify-between">
              
              {/* Messages logging */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chats.find(c => c.id === activeChatId)?.messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === "patient" ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`p-2.5 rounded-2xl text-xs font-semibold ${
                      msg.sender === "patient" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{msg.timestamp}</span>
                  </div>
                ))}

                {isTypingDoctor && (
                  <div className="mr-auto text-slate-500 text-xs font-bold flex items-center gap-1.5 italic">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <span>{t.doctorReplying}</span>
                  </div>
                )}
              </div>

              {/* Chat Send Form */}
              <div className="mt-2 flex items-center gap-1.5 border-t border-slate-200 pt-2">
                <input
                  id="chat-message-input"
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  placeholder={t.typeMessage}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
                <button
                  id="btn-chat-send"
                  onClick={handleSendChatMessage}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
