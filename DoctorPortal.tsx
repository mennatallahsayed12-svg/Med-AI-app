/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Language, MedicalArticle, VoiceNote, MedicalLecture, MedicalCourse, Certificate } from "../types";
import { translations } from "../utils/translations";
import { 
  Award, 
  BookOpen, 
  Video, 
  FileText, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle, 
  ChevronRight, 
  User, 
  Printer, 
  BadgeCheck 
} from "lucide-react";

interface DoctorPortalProps {
  language: Language;
  elderlyMode: boolean;
  speechEnabled: boolean;
}

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

// Rich datasets representing all specialties
const ARTICLES: MedicalArticle[] = [
  {
    id: "a1",
    titleEn: "Novel Therapeutic Inhibitors of SGLT2 in Cardiomyopathy",
    titleAr: "مثبطات SGLT2 الحديثة وتأثيرها على عضلة القلب والقصور الاحتقاني",
    specialtyEn: "Cardiology",
    specialtyAr: "طب القلب والأوعية الدموية",
    publishedDate: "2026-05-12",
    contentEn: "Comprehensive randomized trials in 2026 confirm that Sodium-Glucose Cotransporter 2 (SGLT2) inhibitors significantly lower cardiac filling pressures, mitigate myocardial remodeling, and improve functional ejection fraction ratios in patients with heart failure with preserved ejection fraction (HFpEF).\n\nKey takeaways recommend incorporating SGLT2 therapy early alongside beta-blockers and MRA guidelines for optimal outcomes.",
    contentAr: "أكدت التجارب السريرية العشوائية لعام ٢٠٢٦ أن مثبطات ناقل البروتين الجلوكوزي المشترك ٢ (SGLT2) تساهم بشكل أساسي في خفض الضغط الشرياني لملء الغرف القلبية وتمنع إعادة تشكل العضلة القلبية الضارة، مما يعود بالفائدة القصوى لمعدلات البقاء للمرضى.\n\nتوصي الإرشادات الكندية والمصرية الحديثة ببدء العلاج في المراحل المبكرة بجانب حاصرات بيتا ومضادات هرمون الألدوستيرون.",
    authorEn: "Dr. Sherif El-Kafrawi, Cairo Cardiology Inst.",
    authorAr: "د. شريف الكفراوي، معهد القلب القومى بالقاهرة"
  },
  {
    id: "a2",
    titleEn: "Pediatric Prophylactic Guidelines for Infant Bronchiolitis",
    titleAr: "الإرشادات الوقائية الحديثة لالتهاب الشعيبات الهوائية للرُّضع",
    specialtyEn: "Pediatrics",
    specialtyAr: "طب الأطفال وحديثي الولادة",
    publishedDate: "2026-04-29",
    contentEn: "This clinical overview revisits RSV immunization protocols. Direct monoclonal antibody administration has shown a 78% decrease in infant hospitalization rates throughout the winter season in Nile Delta clinics.",
    contentAr: "يستعرض هذا الدليل الطبي بروتوكول الرعاية المانعة ضد فيروس الجهاز التنفسي المخلوي. وقد أثبتت الأجسام المضادة أحادية النسيلة الحديثة خفضاً حيوياً بمعدل ٧٨٪ لنسب احتجاز الرضع بغرف العناية بمراكز الدلتا.",
    authorEn: "Prof. Nadia Gomaa, Mansoura Pediatrics Hosp.",
    authorAr: "أ.د نادية جمعة، مستشفى الأطفال بجامعة المنصورة"
  },
  {
    id: "a3",
    titleEn: "Artificial Intelligence for Melanoma Surface Mapping",
    titleAr: "استخدام تقنيات الذكاء الاصطناعي لرسم خرائط الأورام الجلدية",
    specialtyEn: "Dermatology",
    specialtyAr: "الأمراض الجلدية والتناسلية",
    publishedDate: "2026-05-20",
    contentEn: "High-resolution convolutional neural networks (CNNs) outperform general clinical assessment in categorizing atypical melanocytic nevi. Early recognition is key to preventing deep dermal invasiveness.",
    contentAr: "أثبتت الشبكات العصبية الالتفافية المتطورة (CNN) قدرة فائقة تفوق الفحص السريري المعتاد في تشخيص وتصنيف الوحمات الصبغية غير المنتظمة، وتساهم دقة التصوير في سرعة استئصال الأورام مبكراً.",
    authorEn: "Dr. Sarah Mansour, Kasr Al-Ainy Skin Clinic",
    authorAr: "د. سارة منصور، كلية طب القصر العيني"
  },
  {
    id: "a4",
    titleEn: "Geriatric Sarcopenia: Resistance Training and Amino Acids",
    titleAr: "ضعف العضلات لدى كبار السن: تمارين المقاومة ودور الأحماض الأمينية",
    specialtyEn: "Orthopedics",
    specialtyAr: "طب وجراحة العظام والمفاصل",
    publishedDate: "2026-03-15",
    contentEn: "Sarcopenia in elderly patients is a primary contributor to osteoporotic hip fractures. Combining twice-weekly progressive resistance training with customized branched-chain amino acid (BCAA) supplementation optimizes recovery.",
    contentAr: "يعد ضمور الكتلة العضلية لدى المسنين سبباً رئيسياً لكسور عظام الفخذ وهشاشة الهيكل العظمي. وتوضح الدراسات أن تمارين المقاومة المتدرجة الخفيفة مرتين أسبوعياً مع تناول الأحماض الأمينية تحمي وتدعم قوة المفاصل.",
    authorEn: "Prof. Hisham Talaat, Ain Shams Orthopedics Department",
    authorAr: "أ.د هشام طلعت، قسم العظام والمفاصل بجامعة عين شمس"
  }
];

const VOICE_NOTES: VoiceNote[] = [
  {
    id: "v1",
    titleEn: "Diagnostic Auscultation of Holosystolic Murmurs",
    titleAr: "مهارات الاستماع السريري وصوت النفخة الانقباضية الكاملة ميرمر",
    speakerEn: "Prof. Mourad Adly, Ain Shams Cardiology",
    speakerAr: "أ.د مراد عدلي، كلية طب عين شمس",
    specialtyEn: "Cardiology",
    specialtyAr: "طب القلب والأوعية الدموية",
    duration: "4:15",
    audioUrlPlaceholder: "audio_murmurs_auscultation"
  },
  {
    id: "v2",
    titleEn: "Managing Acute Childhood Asthma & Nebulizer Titration",
    titleAr: "إدارة أزمات الربو الحادة للأطفال وتعديل نسب جلسات الاستنشاق",
    speakerEn: "Dr. Reem El-Baroudy, Cairo Pediatric Center",
    speakerAr: "د. ريم البارودي، مستشفى الأطفال التخصصي بمصر القديمة",
    specialtyEn: "Pediatrics",
    specialtyAr: "طب الأطفال وحديثي الولادة",
    duration: "5:30",
    audioUrlPlaceholder: "audio_asthma_nebulizer"
  }
];

const LECTURES: MedicalLecture[] = [
  {
    id: "l1",
    titleEn: "Neurological Localization of Acute Ischemic Strokes",
    titleAr: "التحديد الجغرافي للجهاز العصبي في حالات السكتات الدماغية الحادة",
    specialtyEn: "Neurology",
    specialtyAr: "طب المخ والأعصاب وسكتات الدماغ",
    duration: "12:40",
    videoUrlPlaceholder: "video_neurological_localization",
    slides: [
      { time: 0, textEn: "Welcome. We will localize the vascular territory of stroke.", textAr: "أهلاً ومرحباً بكم. سنتعرف اليوم على تحديد مجالات الأوعية الدموية للسكتة الدماغية." },
      { time: 45, textEn: "MCA occlusion displays contralateral hemiplegia and face drop.", textAr: "انسداد الشريان المخي الأوسط MCA يظهر بضعف كامل للوجه واليد والقدم الجانبية المعاكسة." },
      { time: 120, textEn: "Thrombolysis window is maximum 4.5 hours from symptoms onset.", textAr: "النافذة الزمنية لحقن مذيب الجلطات التيبلاز هي ٤.٥ ساعات كحد أقصى من بدء الأعراض." }
    ]
  },
  {
    id: "l2",
    titleEn: "Clinical Management of High-Risk Obstetric Hemorrhage",
    titleAr: "الإدارة السريرية لحالات نزيف ما بعد الولادة ذي الخطورة العالية",
    specialtyEn: "Gynecology",
    specialtyAr: "طب النساء والولادة والصحة الإنجابية",
    duration: "15:20",
    videoUrlPlaceholder: "video_obstetric_hemorrhage",
    slides: [
      { time: 0, textEn: "Obstetric hemorrhage remains a primary cause of maternal mortality.", textAr: "يعتبر نزيف التوليد والولادة سبباً رئيسياً لوفيات الأمهات عالمياً." },
      { time: 60, textEn: "Immediate uterine massage and administration of oxytocin are crucial steps.", textAr: "التدليك المباشر للرحم وإعطاء حقن الأوكسيتوسين هما الخطوتان الأكثر أهمية لإنقاذ المريضة." }
    ]
  }
];

const COURSES: MedicalCourse[] = [
  {
    id: "co1",
    titleEn: "Advanced Electrocardiogram (ECG) Interpretation & Dysrhythmias",
    titleAr: "الدورة المتقدمة لتفسير تخطيط القلب الكهربائي ECG واضطراب النظم",
    descriptionEn: "Master the visual keys of ventricular tachycardia, STEMI localization, block patterns, and long QT syndromes. Perfect for young doctors.",
    descriptionAr: "تعلم المهارات السريرية لقراءة وتحليل تسارع ضربات القلب البطيني، وتحديد جلطات القلب STEMI، وحصار القلب والضفائر الكهربائية الجانبية بالتفصيل.",
    modulesEn: [
      "ECG Basics, Voltages, and Axis Calibration",
      "Coronary Ischemia, STEMI Pathways, & T-wave inversions",
      "Ventricular Arrhythmias versus SVT with Aberrancy",
      "Atrioventricular Heart Blocks (1st, 2nd & 3rd Degree)"
    ],
    modulesAr: [
      "أساسيات تخطيط القلب ورسم المحور الكهربائي وعيار الفولتية",
      "نقص تروية الشرايين التاجية، وتحديد الجلطات الحادة STEMI",
      "اضطراب النظم البطيني مقابل فوق البطيني وتشويه المسار",
      "حصارات القلب الأذينية البطينية (الدرجة الأولى، الثانية، والثالثة)"
    ],
    quizQuestions: [
      {
        questionEn: "Which lead pattern represents an acute inferior wall myocardial infarction (STEMI)?",
        questionAr: "أي من اتجاهات تخطيط القلب ECG يظهر بوضوح حدوث جلطة قلبية حادة بالجدار السفلي (STEMI)؟",
        optionsEn: [
          "ST elevation in leads V1 to V4",
          "ST elevation in leads II, III, and aVF",
          "ST depression in lead I and aVL",
          "Prolonged PR interval over 0.20s"
        ],
        optionsAr: [
          "ارتفاع قطاع ST في خطوط V1 إلى V4",
          "ارتفاع قطاع ST في الاتجاهات II, III, و aVF",
          "انخفاض قطاع ST في الاتجاهين I و aVL",
          "تطاول مسافة PR لأكثر من 0.20 ثانية"
        ],
        correctIndex: 1
      },
      {
        questionEn: "What is the primary medication class used to manage Mobitz Type I second-degree AV block in stable patients?",
        questionAr: "ما هو الإجراء أو الدواء الأولي الموصى به لحصار القلب من الدرجة الثانية (Mobitz Type I) لدى مريض مستقر؟",
        optionsEn: [
          "Emergency external transcutaneous pacing",
          "Observation and monitoring (most stable patients require no immediate medication)",
          "Immediate intravenous epinephrine infusion",
          "Oral amiodarone tablets"
        ],
        optionsAr: [
          "منظم ضربات القلب الخارجي الطارئ",
          "الملاحظة والمراقبة فقط (معظم الحالات المستقرة لا تتطلب أدوية فورية)",
          "الحقن الوريدي الفوري بالأدرينالين",
          "حبوب الإميويدارون بالفم"
        ],
        correctIndex: 1
      }
    ]
  }
];

export default function DoctorPortal({ language, elderlyMode, speechEnabled }: DoctorPortalProps) {
  const t = translations[language];

  // Filters State
  const [activeSpecialty, setActiveSpecialty] = useState<string>("Cardiology");

  // Media Player states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeVideoSlideIdx, setActiveVideoSlideIdx] = useState<number>(0);
  const [videoTimer, setVideoTimer] = useState<number>(0);

  // Certification / Quiz States
  const [doctorName, setDoctorName] = useState("");
  const [enrolledCourse, setEnrolledCourse] = useState<MedicalCourse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

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

  // Start course quiz
  const handleEnroll = (course: MedicalCourse) => {
    if (!doctorName.trim()) {
      handleSpeak(language === "ar" ? "برجاء كتابة اسم الطبيب أولاً بالتناغم" : "Please enter your name first as a physician");
      return;
    }
    setEnrolledCourse(course);
    setSelectedAnswers(new Array(course.quizQuestions.length).fill(-1));
    setQuizSubmitted(false);
    setCertificate(null);
    handleSpeak(language === "ar" ? "تم التسجيل في الدورة بنجاح. تمنياتنا بالتوفيق" : "Successfully enrolled in the certification assessment");
  };

  const selectAnswer = (questionIdx: number, optionIdx: number) => {
    const nextAnswers = [...selectedAnswers];
    nextAnswers[questionIdx] = optionIdx;
    setSelectedAnswers(nextAnswers);
  };

  // Grade Quiz & Generate Certificate on success
  const handleSubmitQuiz = () => {
    if (!enrolledCourse) return;
    
    // Check if all questions are answered
    if (selectedAnswers.includes(-1)) {
      handleSpeak(language === "ar" ? "يرجى حل جميع الأسئلة أولاً" : "Please answer all exam questions first");
      return;
    }

    let score = 0;
    enrolledCourse.quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const percent = (score / enrolledCourse.quizQuestions.length) * 100;
    
    if (percent >= 50) {
      // Generate accredited certificate!
      const minHex = "CERT-" + Math.floor(100000 + Math.random() * 900000);
      const newCert: Certificate = {
        id: "cert-" + Math.random().toString(36).substr(2, 9),
        doctorName: doctorName,
        courseTitleEn: enrolledCourse.titleEn,
        courseTitleAr: enrolledCourse.titleAr,
        issueDate: new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
        certificateId: minHex
      };
      setCertificate(newCert);
      handleSpeak(language === "ar" ? "مبارك لقدر تم الحصول على شهادتك الطبية المعتمدة" : "Congratulations! You have received your accredited certificate!");
    } else {
      handleSpeak(language === "ar" ? "للأسف لم تتخطى النسبة بنجاح، جرب حل الامتحان مرة أخرى" : "You have not reached the passing grade. Try reviewing and retrying the exam.");
    }
  };

  const printCertificate = () => {
    window.print();
  };

  // Filter items matching the selected medical specialty
  const filteredArticles = ARTICLES.filter(art => art.specialtyEn === activeSpecialty);
  const filteredVoiceNotes = VOICE_NOTES.filter(vn => vn.specialtyEn === activeSpecialty);
  const filteredLectures = LECTURES.filter(lec => lec.specialtyEn === activeSpecialty);

  return (
    <div className={`p-4 md:p-6 space-y-8 ${elderlyMode ? "text-xl leading-relaxed" : "text-sm"} max-w-7xl mx-auto`}>
      
      {/* Search Filter Header */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className={`font-black text-slate-950 flex items-center gap-2 ${elderlyMode ? "text-3xl" : "text-xl"}`}>
            🧑‍⚕️ {t.doctorEducationTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Nile River Academy for fresh medical graduates & continuous development</p>
        </div>

        {/* Dynamic Specialty selection */}
        <div className="w-full md:w-auto">
          <label className="text-xs text-slate-400 block mb-1.5 font-extrabold uppercase tracking-wider">{t.selectSpecialty}</label>
          <div className="flex flex-wrap gap-1.5 max-w-xl">
            {SPECIALTIES.map(sp => (
              <button
                key={sp}
                onClick={() => {
                  setActiveSpecialty(sp);
                  handleSpeak(language === 'ar' ? t.specialties[sp as keyof typeof t.specialties] : sp);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  activeSpecialty === sp
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {language === "en" ? sp : t.specialties[sp as keyof typeof t.specialties]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Articles, Voice Notes & Video (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Scientific Medical Articles */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>{t.medicalArticles}</span>
            </h3>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium">
                {language === "en" ? "No scientific publications loaded for this specialty yet." : "لم يتم إدراج منشورات علمية بعد لهذا الاختصاص."}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArticles.map(art => (
                  <article key={art.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 shadow-none hover:border-blue-500/50 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="text-xs text-blue-600 font-black bg-blue-50 px-2 py-1 rounded-lg">
                        {language === "en" ? art.specialtyEn : art.specialtyAr}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">📅 {art.publishedDate}</span>
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-950">
                      {language === "en" ? art.titleEn : art.titleAr}
                    </h4>

                    <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm font-medium">
                      {language === "en" ? art.contentEn : art.contentAr}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-bold">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{language === "en" ? art.authorEn : art.authorAr}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Educational Voice Notes (Podcasts) & Video Lectures Synchronizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Direct Voice Notes play Waveform design */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Volume2 className="text-blue-600 w-5 h-5" />
                <span>{t.educationalVoiceNotes}</span>
              </h3>

              {filteredVoiceNotes.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  {language === "en" ? "No voice notes loaded for this specialty." : "لا تتوفر وسائط صوتية في هذا التخصص."}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVoiceNotes.map(vn => (
                    <div key={vn.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 shadow-sm">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                          {language === "en" ? vn.titleEn : vn.titleAr}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium">🎙️ {language === "en" ? vn.speakerEn : vn.speakerAr}</p>
                      </div>

                      {/* Waveform graphic simulator and player control */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (playingAudioId === vn.id) {
                              setPlayingAudioId(null);
                              handleSpeak(language === "ar" ? "توقف الصوت" : "Audio playback stopped");
                            } else {
                              setPlayingAudioId(vn.id);
                              handleSpeak(t.playAudio + ": " + (language === "ar" ? vn.titleAr : vn.titleEn));
                            }
                          }}
                          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                            playingAudioId === vn.id ? "bg-red-500 text-white animate-pulse" : "bg-blue-600 text-white"
                          }`}
                        >
                          {playingAudioId === vn.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        {/* Simulated Audio Waves in pure CSS to convey medical play audio activity */}
                        <div className="flex-1 flex items-end gap-1 h-8 px-2 bg-slate-100 rounded-lg">
                          {[...Array(12)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-full bg-blue-500 rounded-full transition-all duration-300`}
                              style={{ 
                                height: playingAudioId === vn.id 
                                  ? `${Math.floor(Math.random() * 80) + 20}%` 
                                  : "15%" 
                              }}
                            />
                          ))}
                        </div>

                        <span className="text-slate-500 text-xs font-mono">{vn.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Lectures with Synced Slides and text transcript display */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Video className="text-blue-600 w-5 h-5" />
                <span>{t.videoLectures}</span>
              </h3>

              {filteredLectures.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  {language === "en" ? "No video streams loaded for this specialty." : "لا تتوفر محاضرات مرئية في هذا التخصص حالياً."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLectures.map(lec => (
                    <div key={lec.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-sm leading-tight">
                          {language === "en" ? lec.titleEn : lec.titleAr}
                        </h4>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono font-bold block w-fit mt-1.5">
                          Duration: {lec.duration}
                        </span>
                      </div>

                      {/* Video Media Simulated Window */}
                      <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-indigo-950">
                        {playingVideoId === lec.id ? (
                          <div className="absolute inset-0 flex flex-col justify-between p-3 select-none">
                            <span className="self-end px-2 py-0.5 bg-rose-600 font-mono text-[9px] text-white rounded font-bold uppercase tracking-widest animate-pulse">
                              {t.videoPlaying}
                            </span>
                            
                            {/* Slide Content synced based on timeline */}
                            <div className="bg-slate-950/90 border border-indigo-500/30 p-2.5 rounded-lg text-center backdrop-blur-sm shadow-lg text-xs font-medium max-w-[90%] mx-auto">
                              <p className="text-emerald-400 font-bold uppercase text-[9px] mb-1">Slide Sync Frame</p>
                              <p className="text-slate-100">{language === "en" ? lec.slides[activeVideoSlideIdx].textEn : lec.slides[activeVideoSlideIdx].textAr}</p>
                            </div>

                            {/* Control footer inside video */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setActiveVideoSlideIdx((activeVideoSlideIdx + 1) % lec.slides.length);
                                  handleSpeak(language === "en" ? "Changed slide frame" : "تحديث الشريحة الطبية");
                                }}
                                className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-700 transition"
                              >
                                {language === "en" ? "Next Slide >>" : "الشريحة التالية >>"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setPlayingVideoId(lec.id);
                              setActiveVideoSlideIdx(0);
                              handleSpeak(language === "ar" ? "بدء بث المحاضرة" : "Starting clinical lecture visuals stream");
                            }}
                            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform active:scale-95 shadow-lg flex items-center justify-center cursor-pointer"
                          >
                            <Play className="w-5 h-5 fill-current" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: certified medical courses, quiz taking and visual accredited certificate printing */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">
                  🎓 {language === "en" ? "Certified Medical Courses" : "الكورسات والشهادات المعتمدة"}
                </h2>
                <p className="text-slate-500 text-xs font-semibold">Accredited certificates on graduation</p>
              </div>
            </div>

            {/* Print Doctor Name Setup */}
            <div className="space-y-2">
              <label className="text-xs text-slate-600 font-extrabold uppercase tracking-wider block">{language === "en" ? "Enter Doctor Full Name (for certificates):" : "اسم الطبيب رباعي بالكامل (لطباعة الشهادة المعتمدة):"}</label>
              <input
                id="doc-cert-name-input"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Ahmed Ali..."
                className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium text-sm"
              />
            </div>

            {/* Courses selector */}
            <div className="space-y-4">
              {COURSES.map(course => (
                <div key={course.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {language === "en" ? course.titleEn : course.titleAr}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal font-medium">
                    {language === "en" ? course.descriptionEn : course.descriptionAr}
                  </p>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Course Syllabus:</p>
                    {(language === "en" ? course.modulesEn : course.modulesAr).map((mod, i) => (
                      <div key={i} className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 py-0.5">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>

                  {enrolledCourse?.id !== course.id ? (
                    <button
                      id={`btn-enroll-${course.id}`}
                      onClick={() => handleEnroll(course)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      {t.startCertification}
                    </button>
                  ) : (
                    <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black">ACTIVE TEST</span>
                        <span className="text-xs text-slate-500 font-semibold">{t.courseStatus}</span>
                      </div>

                      {/* Quiz questions block */}
                      {course.quizQuestions.map((qq, qIdx) => (
                        <div key={qIdx} className="space-y-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                          <p className="text-xs font-bold text-slate-900 leading-normal">
                            Q{qIdx + 1}: {language === "en" ? qq.questionEn : qq.questionAr}
                          </p>
                          <div className="space-y-1.5">
                            {(language === "en" ? qq.optionsEn : qq.optionsAr).map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => selectAnswer(qIdx, oIdx)}
                                className={`w-full text-left p-2 rounded-lg text-xs leading-normal font-semibold border transition-all cursor-pointer ${
                                  selectedAnswers[qIdx] === oIdx
                                    ? "bg-blue-50 border-blue-500 text-blue-700 font-bold"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Submit Quiz btn */}
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                        >
                          {t.submitQuiz}
                        </button>
                      ) : (
                        <div className="text-center space-y-2 py-2">
                          <p className="text-xs font-bold text-slate-700">
                            Exam Grade: <span className="text-emerald-600 font-extrabold text-sm">{quizScore} / {course.quizQuestions.length}</span>
                          </p>
                          {certificate ? (
                            <p className="text-xs text-emerald-600 font-bold">✨ PASSING GRADE REACHED successfully!</p>
                          ) : (
                            <button
                              onClick={() => {
                                selectAnswer(0, -1);
                                setQuizSubmitted(false);
                              }}
                              className="text-xs text-rose-500 font-bold underline cursor-pointer"
                            >
                              Grade failed. Try re-answering the questions
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Visual Accredited Certificate Generator Box */}
            {certificate && (
              <div id="visual-accredited-certificate" className="border-4 border-double border-blue-600 bg-white p-6 rounded-2xl space-y-4 shadow-xl relative select-none">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] opacity-5 bg-[size:10px_10px] pointer-events-none" />
                
                <div className="text-center space-y-1">
                  <BadgeCheck className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">MED AI ROYAL ACADEMY</h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{t.certificationEarned}</p>
                </div>

                <div className="border-t border-b border-slate-200 py-3 text-center space-y-2">
                  <p className="text-slate-500 text-[10px] italic">This certificate is proudly awarded to:</p>
                  <h3 className="text-xl font-black text-slate-900 underline decoration-blue-500 tracking-tight">{certificate.doctorName}</h3>
                  <p className="text-xs text-slate-600 font-medium px-2 leading-relaxed">
                    {t.certBody}
                  </p>
                  <p className="text-xs font-bold text-blue-600 mt-2 bg-blue-50 py-1.5 rounded-lg">
                    🎓 Course: {language === "en" ? certificate.courseTitleEn : certificate.courseTitleAr}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                  <div>
                    <p>{t.issueDate}</p>
                    <p className="font-mono text-slate-800 mt-0.5">{certificate.issueDate}</p>
                  </div>
                  <div className="text-right">
                    <p>{t.verifyCode}</p>
                    <p className="font-mono text-blue-600 font-black mt-0.5">{certificate.certificateId}</p>
                  </div>
                </div>

                <button
                  onClick={printCertificate}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Print / Download Certificate" : "طباعة أو تحميل الشهادة المعتمدة"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
