/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, PatientFile, FinancialEntry, InventoryItem, RecyclePartner } from "../types";
import { translations } from "../utils/translations";
import { 
  Building, 
  Trash2, 
  Search, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle, 
  Calculator, 
  Leaf, 
  Plus, 
  ArrowUpRight, 
  DollarSign 
} from "lucide-react";

interface ClinicPortalProps {
  language: Language;
  elderlyMode: boolean;
  speechEnabled: boolean;
}

// Initial clinical inventories seed
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    nameEn: "Sterile Diagnostic Surgical Gloves",
    nameAr: "قفازات جراحية معقمة للفحص السريري",
    currentStock: 18,
    minThreshold: 25, // Will trigger alert since current 18 < 25
    unit: "boxes",
    reorderQuantity: 30,
    lastRestocked: "2026-05-18",
    autoReplenish: true
  },
  {
    id: "inv-2",
    nameEn: "Single-use Insulin Syringes (3cc)",
    nameAr: "حقن جراحية ذات استخدام واحد عيار ٣ مل",
    currentStock: 48,
    minThreshold: 40,
    unit: "packs",
    reorderQuantity: 100,
    lastRestocked: "2026-05-10",
    autoReplenish: false
  },
  {
    id: "inv-3",
    nameEn: "Elastic Gauze Sterile Bandages (4in)",
    nameAr: "ضمادات طبية لاصقة ورباط شاش مطاط",
    currentStock: 12,
    minThreshold: 20, // Will trigger alert
    unit: "rolls",
    reorderQuantity: 50,
    lastRestocked: "2026-05-22",
    autoReplenish: true
  },
  {
    id: "inv-4",
    nameEn: "Sodium Chloride Saline Solution (500ml)",
    nameAr: "محلول ملحي معقم كلوريد الصوديوم تسريب وريدي",
    currentStock: 35,
    minThreshold: 15,
    unit: "bags",
    reorderQuantity: 40,
    lastRestocked: "2026-05-20",
    autoReplenish: false
  }
];

// Egyptian Certified Medical Waste Recycling Centers
const RECYCLE_PARTNERS: RecyclePartner[] = [
  {
    id: "rc-1",
    nameEn: "Cairo Eco-Recycle S.A.E",
    nameAr: "الشركة المصرية لتدوير النفايات الطبية ش.م.م",
    locationEn: "Helwan Industrial Area, Cairo",
    locationAr: "المنطقة الصناعية بحلوان، القاهرة",
    acceptedMaterialsEn: ["Medical Grade Plastics", "Polypropylene syringes", "Petri Dishes"],
    acceptedMaterialsAr: ["البلاستيك المخصص للمواد الطبية", "محقن البولي بروبيلين", "أطباق بتري المخبرية"],
    contact: "+20 2 245 8890",
    rateEgpPerKg: 35
  },
  {
    id: "rc-2",
    nameEn: "Giza Green Med Disposal",
    nameAr: "مؤسسة جيزة جرين لفرز وتدوير النفايات البلاستيكية",
    locationEn: "6th of October City, Giza",
    locationAr: "المنطقة الثانية بمدينة السادس من أكتوبر، الجيزة",
    acceptedMaterialsEn: ["Saline Bags", "Glass Medicine Amps"],
    acceptedMaterialsAr: ["أكياس المحاليل الطبية المستعملة", "أمبولات الأدوية الزجاجية الفارغة"],
    contact: "+20 100 445 9911",
    rateEgpPerKg: 28
  },
  {
    id: "rc-3",
    nameEn: "Alexandria Bio-Disposal & Clean Air Co.",
    nameAr: "شركة الإسكندرية لتدوير المخلفات وحماية البيئة",
    locationEn: "Borg El Arab, Alexandria",
    locationAr: "المنطقة الحرة ببرج العرب، الإسكندرية",
    acceptedMaterialsEn: ["Sterile Plastic Tubes", "Clean Packaging Cardboards"],
    acceptedMaterialsAr: ["أنابيب التحاليل البلاستيكية", "الكرتون وعبوات التغليف الطبية النظيفة"],
    contact: "+20 3 591 2288",
    rateEgpPerKg: 40
  }
];

// Initial Seed Patient Registry Files
const INITIAL_PATIENT_FILES: PatientFile[] = [
  {
    id: "pf-1",
    patientName: "Mohamed Abdel-Rahman Ali",
    age: 68,
    phone: "+20 100 112 3344",
    diagnosis: "Arterial Hypertension Grade II with mild hypertrophy of left ventricle.",
    treatmentPlan: "Amlodipine 5mg once daily + Salt restrictions.",
    notes: "Review blood pressure log card in nearest clinic after 2 weeks.",
    date: "2026-05-26",
    specialty: "Cardiology"
  },
  {
    id: "pf-2",
    patientName: "Fatma Salem El-Shamy",
    age: 59,
    phone: "+20 122 454 8899",
    diagnosis: "Acute Bronchial Allergy secondary to seasonal Cairo pollen.",
    treatmentPlan: "Montelukast 10mg once daily at sleep, Salbutamol inhaler as needed.",
    notes: "Avoid direct dust storms & high humidity gardens this month.",
    date: "2026-05-25",
    specialty: "General Medicine"
  }
];

// Seed Clinic Income Logs
const INITIAL_FINANCIALS: FinancialEntry[] = [
  { id: "f-1", date: "2026-05-27", patientName: "Mohamed Abdel-Rahman Ali", amountEgp: 450, paymentMethod: "Cash", category: "Consultation" },
  { id: "f-2", date: "2026-05-27", patientName: "Fatma Salem El-Shamy", amountEgp: 200, paymentMethod: "Card", category: "Consultation" },
  { id: "f-3", date: "2026-05-26", patientName: "Youssef Ibrahim Gomaa", amountEgp: 1200, paymentMethod: "Insurance", category: "Lab Tests" },
  { id: "f-4", date: "2026-05-25", patientName: "Noha Mahmoud El-Ghandour", amountEgp: 350, paymentMethod: "Cash", category: "Procedure" }
];

export default function ClinicPortal({ language, elderlyMode, speechEnabled }: ClinicPortalProps) {
  const t = translations[language];

  // Medical filing state
  const [patientRecords, setPatientRecords] = useState<PatientFile[]>(() => {
    const saved = localStorage.getItem("medai_patient_files");
    return saved ? JSON.parse(saved) : INITIAL_PATIENT_FILES;
  });
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState<number | "">("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newTreatmentPlan, setNewTreatmentPlan] = useState("");
  const [newClinicalNotes, setNewClinicalNotes] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  // Financial streams states
  const [financials, setFinancials] = useState<FinancialEntry[]>(() => {
    const saved = localStorage.getItem("medai_financials");
    return saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
  });
  const [newFinPatient, setNewFinPatient] = useState("");
  const [newFinAmount, setNewFinAmount] = useState<number | "">("");
  const [newFinCategory, setNewFinCategory] = useState<"Consultation" | "Procedure" | "Lab Tests" | "Pharmacy">("Consultation");
  const [newFinPayment, setNewFinPayment] = useState<"Cash" | "Card" | "Insurance">("Cash");

  // Inventory customized thresholds state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("medai_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  // Environmental waste optimization state
  const [currentSurplusWaste, setCurrentSurplusWaste] = useState<number>(45); // e.g. 45kg average plastics surplus
  const [optimalPurchaseResult, setOptimalPurchaseResult] = useState<string | null>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem("medai_patient_files", JSON.stringify(patientRecords));
  }, [patientRecords]);

  useEffect(() => {
    localStorage.setItem("medai_financials", JSON.stringify(financials));
  }, [financials]);

  useEffect(() => {
    localStorage.setItem("medai_inventory", JSON.stringify(inventory));
  }, [inventory]);

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

  // Add Patient File registry
  const handleSavePatientFile = () => {
    if (!newPatientName.trim() || !newDiagnosis.trim() || !newTreatmentPlan.trim()) {
      handleSpeak(language === "ar" ? "برجاء كتابة البيانات الطبية الأسياسية" : "Please insert foundational clinical fields");
      return;
    }
    const newFile: PatientFile = {
      id: "pf-" + Math.random().toString(36).substr(2, 9),
      patientName: newPatientName,
      age: Number(newPatientAge) || 45,
      phone: newPatientPhone || "+20 1XX XXX XXXX",
      diagnosis: newDiagnosis,
      treatmentPlan: newTreatmentPlan,
      notes: newClinicalNotes,
      date: new Date().toISOString().substring(0, 10),
      specialty: "General Medicine"
    };

    setPatientRecords([newFile, ...patientRecords]);
    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientPhone("");
    setNewDiagnosis("");
    setNewTreatmentPlan("");
    setNewClinicalNotes("");
    handleSpeak(language === "ar" ? "تم تسجيل الملف السريري للمريض بنجاح" : "Patient medical file saved securely");
  };

  // Add Income record
  const handleAddIncome = () => {
    if (!newFinPatient.trim() || !newFinAmount) return;
    const entry: FinancialEntry = {
      id: "f-" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().substring(0, 10),
      patientName: newFinPatient,
      amountEgp: Number(newFinAmount),
      paymentMethod: newFinPayment,
      category: newFinCategory
    };

    setFinancials([entry, ...financials]);
    setNewFinPatient("");
    setNewFinAmount("");
    handleSpeak(language === "ar" ? "تم تسجيل الإيراد المالي بالجنيه المصري" : "Financial income registered in Egyptian Pounds");
  };

  // Inventory replenishment logic
  const handleReplenishItem = (id: string, refillAmt: number) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentStock: item.currentStock + refillAmt,
          lastRestocked: new Date().toISOString().substring(0, 10)
        };
      }
      return item;
    });
    setInventory(updated);
    handleSpeak(language === "ar" ? "تم إرسال طلب تمويل الإمداد وبدء الشحن" : "Replenishing order processed instantly");
  };

  // Environment optimizer calculations to reduce waste burning
  const handleCalculateOptimalWasteReq = () => {
    // If clinic enters surplus waste (e.g. 45kg), we suggest reducing orders by approx 30% to prevent surplus accumulation
    const currentRequirements = currentSurplusWaste + 20; // Simulated current orders
    const optimalRecommendedOrders = Math.max(10, Math.round(currentRequirements * 0.65)); // reduction
    const savedCO2 = Math.round(currentSurplusWaste * 1.8); // 1.8kg carbon saved per kg plastic recycled

    const outputString = language === "en"
      ? `Optimal purchase requirement mapped: ${optimalRecommendedOrders} kg. By aligning your chemical order strictly to patient throughput, your surplus will drop of 34%, avoiding the incineration of ${currentSurplusWaste}kg plastics and saving ${savedCO2}kg of toxic CO2 in Egypt.`
      : `الكمية المثالية المقررة لتجنب الحرق: ${optimalRecommendedOrders} كجم. بمطابقة مشتريات عيادتك الطبية مع تدفق المرضى الفعلي، سيتقلص الفائض البلاستيكي المعرض للتلف والحرق بنسبة ٣٤٪، مما يمنع انبعاث ما يعادل ${savedCO2} كجم من ملوثات غاز ثاني أكسيد الكربون الضار بمصر.`;

    setOptimalPurchaseResult(outputString);
    handleSpeak(language === "ar" ? "تم حساب المخطط البيئي المثالي" : "Monthly green recycling plan computed");
  };

  // Financial aggregates
  const sumTotalIncome = financials.reduce((sum, entry) => sum + entry.amountEgp, 0);

  // Filter patients by search query
  const filteredPatients = patientRecords.filter(p => 
    p.patientName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className={`p-4 md:p-6 space-y-8 ${elderlyMode ? "text-xl leading-relaxed" : "text-sm"} max-w-7xl mx-auto`}>
      
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <h2 className={`font-extrabold text-slate-900 ${elderlyMode ? "text-3xl" : "text-xl"}`}>
              🏢 {t.clinicDashboard}
            </h2>
            <p className="text-slate-505 text-xs font-semibold">Environmentally responsible clinical operations & sustainable practice</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Patient Registry & Log files (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Daily Patient medical file registry */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              📋 {t.dailyPatientFiles}
            </h3>

            {/* Insertion Form layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-extrabold block uppercase tracking-wider">{t.patientName} *</label>
                <input
                  id="clinical-patient-name"
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g., Omar Sherif"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-extrabold block uppercase tracking-wider">{t.age} *</label>
                <input
                  id="clinical-patient-age"
                  type="number"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="65"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-655 font-extrabold block uppercase tracking-wider">{t.phone}</label>
                <input
                  id="clinical-patient-phone"
                  type="text"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="+20 102 345 6789"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-extrabold block uppercase tracking-wider">{t.diagnosis} *</label>
                <input
                  id="clinical-patient-diagnosis"
                  type="text"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  placeholder="e.g., Congestive cardiomyopathy, controlled on beta blockade"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-extrabold block uppercase tracking-wider">{t.treatmentPlan} *</label>
                <textarea
                  id="clinical-patient-treatment"
                  value={newTreatmentPlan}
                  onChange={(e) => setNewTreatmentPlan(e.target.value)}
                  placeholder="Incurred therapeutics & pill reminders schedules..."
                  className="w-full h-20 p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm resize-none font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-650 font-extrabold block uppercase tracking-wider">{t.clinicalNotes}</label>
                <input
                  id="clinical-patient-notes"
                  type="text"
                  value={newClinicalNotes}
                  onChange={(e) => setNewClinicalNotes(e.target.value)}
                  placeholder="Additional lifestyle, food restricts, or oxygen check benchmarks..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm font-medium"
                />
              </div>

              <button
                id="btn-save-patient-file"
                onClick={handleSavePatientFile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md cursor-pointer"
              >
                🔐 {t.savePatientBtn}
              </button>
            </div>
          </div>

          {/* Registered Patient Archives Log */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                📋 {t.patientRecordsLog}
              </h3>
              
              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="search-patient-records"
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder={language === "en" ? "Filter records..." : "البحث في السجلات..."}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {filteredPatients.map(p => (
                <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{p.patientName}</h4>
                      <p className="text-xs text-slate-500 font-semibold">Age: <span className="text-slate-700">{p.age}</span> • Phone: <span className="text-slate-700">{p.phone}</span></p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono font-bold">📅 {p.date}</span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-700">
                    🔍 <strong className="text-blue-600">Diagnosis:</strong> {p.diagnosis}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">
                    💊 <strong className="text-emerald-600">Treatment Plan:</strong> {p.treatmentPlan}
                  </p>
                  {p.notes && (
                    <p className="text-[11px] text-slate-500 mt-1 italic font-semibold">
                      📝 Recommendations: {p.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Income Manager (4 cols) & Stock replenish list */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Daily & Monthly Financial tracker */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">
                  💵 {t.financialTitle}
                </h2>
                <p className="text-slate-500 text-xs font-semibold">Total Earnings in Egypt Pounds EGP</p>
              </div>
            </div>

            {/* Income aggregate visual map bar */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-3">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{t.totalIncome}</p>
              <h3 className="text-3xl font-black text-emerald-600 tracking-tight">
                {sumTotalIncome.toLocaleString()} <span className="text-base font-bold">{t.egp}</span>
              </h3>

              {/* Graphical mini CSS Income Target Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>Target: 20,000 EGP</span>
                  <span>{Math.round((sumTotalIncome / 20000) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (sumTotalIncome / 20000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick entry income form */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase">{t.addIncome}</p>
              <div className="space-y-2">
                <input
                  id="fin-patient-input"
                  type="text"
                  value={newFinPatient}
                  onChange={(e) => setNewFinPatient(e.target.value)}
                  placeholder="Patient Name..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-450 focus:outline-none text-xs font-medium focus:border-blue-500"
                />
                <input
                  id="fin-amount-input"
                  type="number"
                  value={newFinAmount}
                  onChange={(e) => setNewFinAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Amount (EGP)..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-950 placeholder-slate-450 focus:outline-none text-xs font-medium focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5 font-bold">
                <select
                  id="fin-payment-select"
                  value={newFinPayment}
                  onChange={(e: any) => setNewFinPayment(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-slate-700 text-xs p-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Insurance">Insurance</option>
                </select>

                <select
                  id="fin-category-select"
                  value={newFinCategory}
                  onChange={(e: any) => setNewFinCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-slate-700 text-xs p-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Procedure">Procedure</option>
                  <option value="Lab Tests">Lab Tests</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
              </div>

              <button
                id="btn-add-income"
                onClick={handleAddIncome}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
              >
                📥 {language === "en" ? "Post Income Entry" : "تسجيل إيراد مالي"}
              </button>
            </div>
          </div>

          {/* Controlled Inventory Alert Systems */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg">
                📦 {language === "en" ? "Inventory Alarms" : "مستويات إعداد المخزن"}
              </h3>
            </div>

            <div className="space-y-4">
              {inventory.map(item => {
                const stockBreached = item.currentStock < item.minThreshold;
                return (
                  <div key={item.id} className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs leading-snug">
                          {language === "en" ? item.nameEn : item.nameAr}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold">Last Replenish: {item.lastRestocked}</p>
                      </div>
                      
                      <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-md ${
                        stockBreached ? "bg-rose-50 text-rose-500 border border-rose-200 animate-pulse animate-duration-1000" : "bg-white border border-slate-200 text-slate-600 animate-none"
                      }`}>
                        {item.currentStock} / {item.minThreshold} {item.unit}
                      </span>
                    </div>

                    {stockBreached && (
                      <div className="bg-rose-50/50 border border-rose-100 px-2 py-1.5 rounded-lg flex items-center justify-between gap-2">
                        <span className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-500 inline shrink-0 animate-bounce" />
                          <span>{t.replenishAlert}</span>
                        </span>
                        
                        <button
                          onClick={() => handleReplenishItem(item.id, item.reorderQuantity)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-black cursor-pointer"
                        >
                          {t.reorderQuantityAction} +{item.reorderQuantity}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental Responsibility & Recycling optimization planners */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-center gap-2.5">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                🍀 {t.cleanWasteTitle}
              </h3>
            </div>

            <p className="text-slate-500 text-xs font-semibold leading-normal">
              {t.carbonReductionMsg}
            </p>

            {/* Simulated recycler partners in Egypt */}
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Nile Approved Recycling Partners:</p>
              {RECYCLE_PARTNERS.map(rp => (
                <div key={rp.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-800 font-bold">{language === "en" ? rp.nameEn : rp.nameAr}</strong>
                    <span className="text-emerald-600 font-mono font-black animate-pulse">+{rp.rateEgpPerKg} EGP/kg</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">📍 {language === "en" ? rp.locationEn : rp.locationAr}</p>
                </div>
              ))}
            </div>

            {/* Optimal waste planner calculator */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                <Calculator className="w-4 h-4" />
                <span>{t.wasteCalculator}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-600 font-extrabold block">{t.averageClinicSurplus}</label>
                <input
                  id="calc-surplus-waste-input"
                  type="number"
                  value={currentSurplusWaste}
                  onChange={(e) => setCurrentSurplusWaste(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                id="btn-waste-optimize"
                onClick={handleCalculateOptimalWasteReq}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded-xl transition cursor-pointer"
              >
                ♻️ {t.optCommitBtn}
              </button>

              {optimalPurchaseResult && (
                <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-[11px] text-emerald-800 leading-normal font-semibold">
                  <p className="font-extrabold underline mb-1">{t.optimalRequirementText}</p>
                  <p>{optimalPurchaseResult}</p>
                  <p className="text-[10px] text-amber-600 mt-2 italic">💡 {t.reductionTip}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
