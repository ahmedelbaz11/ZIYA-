import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Stethoscope, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Brain, 
  ChevronRight, 
  Sparkles,
  MessageSquare,
  Wand2,
  ListFilter,
  Microscope,
  Cross,
  Dna,
  Heart,
  Thermometer,
  ClipboardCheck,
  Zap,
  User,
  History as HistoryIcon,
  FileText,
  ShieldAlert,
  ArrowRightCircle,
  Clock,
  Printer,
  Info,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { getSmartTreatment, fullAiConsultation, getDrugDetail } from "../services/geminiService";

interface SymptomEntry {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export default function ClinicalSupport({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const t = {
    en: {
      diagIntel: "Diagnostic Intelligence",
      describe: "Describe the Case",
      aiAnalyze: "AI ANALYZE & TREAT",
      species: "Species",
      chooseDisease: "-- Or Choose Known Disease --",
      selectDisease: "Select Disease Directly",
      clinicalSigns: "Clinical Signs",
      diagnose: "DIAGNOSE CASE",
      scannerOffline: "Neural Scanner Offline",
      provideData: "Please provide clinical data via Deep Scan or Manual Entry to begin pathogen mapping.",
      deepScan: "Deep Scan",
      manualEntry: "Manual Entry",
      neuralAssessment: "Neural Case Assessment",
      confidence: "Confidence",
      differential: "Differential Diagnosis",
      biosecurity: "Biosecurity Alert",
      labTests: "Lab Confirmation Tests",
      immediateMgmt: "Immediate Management",
      pathogens: "Likely Pathogens",
      riskFactors: "Risk Factors",
      synthesize: "SYNTHESIZE CLINICAL PROTOCOL",
      synthesizing: "Synthesizing Pharmacology",
      optimizing: "Optimizing dosage...",
      protocol: "Clinical Protocol",
      rationale: "Expert Rationale",
      counterAgent: "Primary Counter-Agent",
      admin: "Administration",
      dosage: "Dosage Matrix",
      techSpec: "Technical Specification",
      targetSpec: "Target Specificity",
      warnings: "Safety Warnings",
      alternatives: "Alternatives",
      recovery: "Recovery Chart",
      monitoring: "Monitoring Telemetry",
      escalation: "Escalation Triggers",
      outcome: "Expected Outcome",
      highConf: "High Confidence",
      bio: "Biosecurity",
      env: "Environment",
      reset: "Reset Diagnostic Core",
      archive: "Consult Archive",
      caseHistory: "Case History",
      zoonotic: "Zoonotic Threat Agent",
      neuralVerify: "Neural Verification Complete",
      incomingTelemetry: "Incoming Case Telemetry",
      recalculate: "Recalculate Assessment",
      differentialAssessment: "Differential Assessment",
      alternativeProtocol: "Alternative Protocol",
      rationaleHeading: "Medical Rationale",
      relationshipHeading: "Mechanism Correlation",
      expandInsights: "Expand Details",
      collapseInsights: "Collapse Insights",
    },
    ar: {
      diagIntel: "ذكاء التشخيص",
      describe: "وصف الحالة",
      aiAnalyze: "تحليل وعلاج بالذكاء الاصطناعي",
      species: "الفصيلة",
      chooseDisease: "-- أو اختر مرضًا معروفًا --",
      selectDisease: "اختر المرض مباشرة",
      clinicalSigns: "العلامات السريرية",
      diagnose: "تشخيص الحالة",
      scannerOffline: "الماسح العصبي غير متصل",
      provideData: "يرجى تقديم البيانات السريرية عبر المسح العميق أو الإدخال اليدوي لبدء تخطيط مسببات الأمراض.",
      deepScan: "مسح عميق",
      manualEntry: "إدخال يدوي",
      neuralAssessment: "تقييم الحالة العصبي",
      confidence: "اليقين",
      differential: "التشخيص التفريقي",
      biosecurity: "تنبيه الأمن الحيوي",
      labTests: "اختبارات تأكيد المختبر",
      immediateMgmt: "الإدارة الفورية",
      pathogens: "مسببات الأمراض المحتملة",
      riskFactors: "عوامل الخطر",
      synthesize: "تخليق البروتوكول السريري",
      synthesizing: "تخليق الصيدلة",
      optimizing: "تحسين الجرعة...",
      protocol: "البروتوكول السريري",
      rationale: "المنطق الخبير",
      counterAgent: "العامل المضاد الرئيسي",
      admin: "الإعطاء",
      dosage: "مصفوفة الجرعات",
      techSpec: "المواصفات الفنية",
      targetSpec: "خصوصية الهدف",
      warnings: "تحذيرات السلامة",
      alternatives: "البدائل",
      recovery: "مخطط التعافي",
      monitoring: "قياس المراقبة عن بعد",
      escalation: "محفزات التصعيد",
      outcome: "النتيجة المتوقعة",
      highConf: "ثقة عالية",
      bio: "الأمن الحيوي",
      env: "البيئة",
      reset: "إعادة ضبط جوهر التشخيص",
      archive: "استشارة الأرشيف",
      caseHistory: "تاريخ الحالات",
      zoonotic: "عامل تهديد مشترك (Zoonotic)",
      neuralVerify: "اكتمل التحقق العصبي",
      incomingTelemetry: "قياسات الحالة الواردة",
      recalculate: "إعادة التحليل لهذا الكيان",
      differentialAssessment: "التقييم التفريقي",
      alternativeProtocol: "بروتوكول بديل",
      rationaleHeading: "المنطق السريري والتفاصيل",
      relationshipHeading: "العلاقة السياقية",
      expandInsights: "توسيع التفاصيل",
      collapseInsights: "طي الرؤى",
    }
  };

  const [metadata, setMetadata] = useState<any[]>([]);
  const [inputMode, setInputMode] = useState<'ai' | 'manual'>('ai');
  const [aiDescription, setAiDescription] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("cow");
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomEntry[]>([]);
  const [selectedDirectDisease, setSelectedDirectDisease] = useState("");
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [aiTreatment, setAiTreatment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<any>(null);
  
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('clinical_history');
    if (saved) setDiagnosticHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (data: any) => {
    const newEntry = { ...data, timestamp: new Date().toISOString() };
    const updated = [newEntry, ...diagnosticHistory].slice(0, 10);
    setDiagnosticHistory(updated);
    localStorage.setItem('clinical_history', JSON.stringify(updated));
  };

  useEffect(() => {
    fetch(`/api/metadata?lang=${lang}`).then(r => r.json()).then(setMetadata);
  }, [lang]);

  const currentSpeciesData = metadata.find(m => m.species === selectedSpecies);

  const expandAllSections = () => {
    setExpandedSections({
      diagnosis: true,
      protocol: true,
      tech: true,
      warnings: true,
      alternatives: true,
      recovery: true,
      monitoring: true,
      bio: true,
      env: true
    });
  };

  const performAiConsultation = async () => {
    if (!aiDescription) return;
    setLoading(true);
    setDiagnosis(null);
    setAiTreatment(null);
    setAiError(null);
    try {
      const data = await fullAiConsultation(aiDescription, lang);
      if (data) {
        expandAllSections();
        setDiagnosis({
          diagnosis: data.diagnosis,
          confidence: data.confidence,
          severity: data.severity,
          pathogens: data.pathogens || [],
          riskFactors: data.riskFactors || [],
          differentialDiagnosis: data.differentialDiagnosis,
          biosecurityRisk: data.biosecurityRisk,
          labRecommendations: data.labRecommendations,
          instructions: data.instructions
        });
        setAiTreatment(data.treatment);
        // Map species name back to English key for selectedSpecies state if needed, or rely on labels
        // For simplicity, we assume AI returns species correctly
        setSelectedSpecies(data.species.toLowerCase());
        saveToHistory({ 
          diagnosis: data.diagnosis, 
          species: data.species,
          isZoonotic: data.isZoonotic
        });
      } else {
        setAiError(lang === 'ar' ? "فشل تحليل الحالة. يرجى تقديم وصف أكثر تفصيلاً." : "Case analysis failed. Please provide a more detailed description.");
      }
    } catch (e) {
      console.error(e);
      setAiError(lang === 'ar' ? "خطأ في الاتصال بنواة الذكاء الاصطناعي السريرية." : "Error connecting to Clinical AI core.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (name: string) => {
    setSelectedDirectDisease("");
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.name === name);
      if (exists) {
        return prev.filter(s => s.name !== name);
      } else {
        return [...prev, { name, severity: 'mild' }];
      }
    });
  };

  const updateSeverity = (name: string, severity: 'mild' | 'moderate' | 'severe') => {
    setSelectedSymptoms(prev => 
      prev.map(s => s.name === name ? { ...s, severity } : s)
    );
  };

  const runDiagnosis = async (diseaseOverride?: string) => {
    setLoading(true);
    setDiagnosis(null);
    setAiTreatment(null);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: selectedSpecies,
          symptoms: selectedSymptoms,
          diseaseName: diseaseOverride || selectedDirectDisease,
          lang
        })
      });
      const data = await res.json();
      expandAllSections();
      setDiagnosis(data);
      saveToHistory({
        diagnosis: data.diagnosis,
        species: selectedSpecies,
        isZoonotic: data.isZoonotic
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiTreatment = async () => {
    if (!diagnosis) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const data = await getSmartTreatment(selectedSpecies, diagnosis.diagnosis, selectedSymptoms, lang);
      if (data) {
        setAiTreatment(data);
      } else {
        setAiError(lang === 'ar' ? "فشل تخليق العلاج. يرجى المحاولة مرة أخرى." : "Treatment synthesis failed. Please try again.");
      }
    } catch (error) {
      console.error("AI Treatment synthesis failed:", error);
      setAiError(lang === 'ar' ? "خطأ في الاتصال بنواة الذكاء الاصطناعي." : "Error connecting to AI Medical Core.");
    } finally {
      setAiLoading(false);
    }
  };

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    diagnosis: true,
    protocol: true,
    tech: true,
    warnings: true,
    alternatives: true,
    recovery: true,
    monitoring: true,
    bio: true,
    env: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const ExpandableHeader = ({ id, title, icon: Icon, colorClass = "text-indigo-400", isExpanded }: any) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between group/header cursor-pointer select-none"
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-2.5 rounded-2xl transition-all duration-300", isExpanded ? "bg-white/10 border border-white/20" : "pharma-card p-2.5")}>
           {Icon && <Icon className={cn("w-5 h-5", isExpanded ? "text-white" : colorClass)} />}
        </div>
        <div className="text-left">
          <h3 className={cn("font-black text-sm tracking-tighter uppercase transition-colors", isExpanded ? "text-white" : "text-slate-400")}>{title}</h3>
          <p className="text-[8px] font-black opacity-40 uppercase tracking-widest font-sans">{isExpanded ? t[lang].collapseInsights : t[lang].expandInsights}</p>
        </div>
      </div>
      <div className={cn(
        "bg-slate-950 p-2 rounded-xl border border-slate-800 transition-all duration-500",
        isExpanded ? "rotate-180 border-indigo-600/50" : ""
      )}>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover/header:text-indigo-400" />
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Step 1: Input */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <section className="pharma-card p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group">
             {/* Scanner Pattern overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0ea5e9_0.5px,transparent_0.5px)] [background-size:16px_16px]" />
             
             <div className="absolute top-0 right-0 p-6">
                <Dna className="w-6 h-6 text-indigo-600/10 animate-spin-slow" />
             </div>
             
             <div className="flex items-center justify-between mb-8 relative">
               <div className="flex items-center gap-4">
                 <div className="bg-indigo-600/20 p-2.5 rounded-2xl border border-indigo-600/30">
                   <Brain className="w-6 h-6 text-indigo-400" />
                 </div>
                 <div>
                   <h2 className="font-black text-lg tracking-tighter text-white uppercase">{t[lang].diagIntel}</h2>
                 </div>
               </div>
               
               <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  {['ai', 'manual'].map(m => (
                    <button 
                      key={m}
                      onClick={() => setInputMode(m as any)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all duration-300",
                        inputMode === m ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-slate-400"
                      )}
                    >
                      {m === 'ai' ? t[lang].deepScan : t[lang].manualEntry}
                    </button>
                  ))}
               </div>
             </div>

              <AnimatePresence mode="wait">
               {inputMode === 'ai' ? (
                 <motion.div 
                   key="ai-input"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-6"
                 >
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> {t[lang].describe}
                      </label>
                      <textarea
                        value={aiDescription}
                        onChange={(e) => setAiDescription(e.target.value)}
                        placeholder="e.g. My 3-year-old cow has significant udder swelling, fever, and her milk looks clotted..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm min-h-[180px] focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all text-slate-300 leading-relaxed placeholder:text-slate-700"
                      />
                    </div>
                    
                    <button
                      onClick={performAiConsultation}
                      disabled={loading || !aiDescription}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 fill-white" />
                          AI ANALYZE & TREAT
                        </>
                      )}
                    </button>
                 </motion.div>
               ) : (
                 <motion.div 
                   key="manual-input"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="space-y-8"
                 >
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t[lang].species}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {metadata.map((m) => (
                          <button
                            key={m.species}
                            onClick={() => {
                              setSelectedSpecies(m.species); 
                              setSelectedSymptoms([]);
                              setSelectedDirectDisease("");
                              setDiagnosis(null);
                              setAiTreatment(null);
                            }}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-[10px] font-black border transition-all capitalize truncate",
                              selectedSpecies === m.species 
                                ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20" 
                                : "bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-700"
                            )}
                          >
                            {m.label || m.species}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ListFilter className="w-3 h-3" /> {t[lang].selectDisease}
                      </label>
                      <select
                        value={selectedDirectDisease}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDirectDisease(val);
                          if (val) {
                            setSelectedSymptoms([]);
                            runDiagnosis(val);
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs font-black text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all cursor-pointer font-sans"
                      >
                        <option value="">{t[lang].chooseDisease}</option>
                        {currentSpeciesData?.diseases.map((d: any) => (
                          <option key={d.name} value={d.name}>
                            {d.label || String(d.name || '').replace(/_/g, ' ').toUpperCase()} {d.isZoonotic ? `(${t[lang].zoonotic})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t[lang].clinicalSigns}</label>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {currentSpeciesData?.symptoms.map((s: any) => {
                          const selected = selectedSymptoms.find(entry => entry.name === s.name);
                          return (
                            <div key={s.name} className={cn(
                               "p-3 rounded-2xl border transition-all",
                               selected ? "bg-slate-900 border-indigo-600/30" : "bg-slate-950/30 border-slate-800"
                            )}>
                              <div className="flex items-center justify-between mb-2">
                                 <button 
                                   onClick={() => toggleSymptom(s.name)}
                                   className={cn(
                                     "text-[10px] font-bold transition-colors uppercase tracking-tight",
                                     selected ? "text-indigo-400" : "text-slate-500 hover:text-slate-400"
                                   )}
                                 >
                                   {s.label || s.name}
                                 </button>
                                 {selected && (
                                   <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                                     {(['mild', 'moderate', 'severe'] as const).map((lvl) => (
                                       <button
                                         key={lvl}
                                         onClick={() => updateSeverity(s.name, lvl)}
                                         className={cn(
                                           "px-2 py-0.5 rounded text-[8px] font-black uppercase transition-all",
                                           s.severity === lvl 
                                             ? (lvl === 'severe' ? "bg-rose-500 text-white" : lvl === 'moderate' ? "bg-amber-500 text-white" : "bg-indigo-600 text-white")
                                             : "text-slate-600 hover:text-slate-400"
                                         )}
                                       >
                                         {lvl}
                                       </button>
                                     ))}
                                   </div>
                                 )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => runDiagnosis()}
                      disabled={loading || (selectedSymptoms.length === 0 && !selectedDirectDisease)}
                      className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all disabled:opacity-30 border border-slate-200"
                    >
                       {t[lang].diagnose}
                    </button>
                  </motion.div>
               )}
             </AnimatePresence>
          </section>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            {aiError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-rose-950/30 border border-rose-500/30 rounded-[2rem] flex items-center gap-4 text-rose-400 text-xs font-black uppercase tracking-widest"
              >
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <span>{aiError}</span>
              </motion.div>
            )}

            {!diagnosis ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-[3rem] min-h-[600px] relative overflow-hidden group/empty"
               >
                  <div className="absolute inset-0 opacity-5 group-hover/empty:opacity-10 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full" />
                    <Brain className="w-24 h-24 text-indigo-600/40 mb-8 animate-pulse relative z-10" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{t[lang].scannerOffline}</h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-bold uppercase tracking-widest px-8">
                    {t[lang].provideData}
                  </p>
                  
                  <div className="mt-12 flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                       <Microscope className="w-5 h-5 text-slate-700" />
                       <div className="h-1 w-8 bg-slate-800 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <Activity className="w-5 h-5 text-slate-700 font-bold" />
                       <div className="h-1 w-8 bg-slate-800 rounded-full" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <Stethoscope className="w-5 h-5 text-slate-700" />
                       <div className="h-1 w-8 bg-slate-800 rounded-full" />
                    </div>
                  </div>
               </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="space-y-8 pb-32"
              >
                {/* Case Summary Panel */}
                {inputMode === 'ai' && aiDescription && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                       <ClipboardCheck className="w-4 h-4 text-indigo-400" />
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t[lang].incomingTelemetry}</h4>
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-2">
                      "{aiDescription}"
                    </p>
                  </motion.div>
                )}

                {/* Diagnosis Header - The "Hero" Card */}
                <div className="bg-slate-900 border border-slate-700 border-t-[12px] border-t-indigo-600 rounded-[3rem] p-4 relative shadow-2xl overflow-hidden group">
                  <div className="px-8 py-6">
                    <ExpandableHeader 
                      id="diagnosis" 
                      title={t[lang].neuralAssessment} 
                      icon={Brain} 
                      isExpanded={expandedSections.diagnosis} 
                    />
                  </div>

                  <AnimatePresence>
                    {expandedSections.diagnosis && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-12 pt-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                 <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{t[lang].neuralVerify}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <h2 className="text-6xl xl:text-7xl font-black capitalize text-white tracking-tighter leading-none mb-2">
                                  {String(diagnosis.diagnosis || '').replace(/_/g, ' ')}
                                </h2>
                                {diagnosis.isZoonotic && (
                                  <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="px-6 py-2.5 bg-rose-500 text-white rounded-full flex items-center gap-3 h-fit shadow-lg shadow-rose-500/20"
                                  >
                                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">{t[lang].zoonotic}</span>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-slate-950 p-8 rounded-[3rem] border-2 border-indigo-600/30 shadow-2xl flex flex-col items-center justify-center min-w-[160px] relative overflow-hidden group/conf">
                               <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover/conf:opacity-100 transition-opacity" />
                               <span className="text-4xl font-black text-indigo-400 relative z-10">{(diagnosis.confidence * 100).toFixed(0)}%</span>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 relative z-10">{t[lang].confidence}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 pt-10 border-t border-slate-800/50">
                            {/* ... Content ... */}
                            <div className="space-y-6">
                               <div>
                                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ListFilter className="w-3 h-3 text-indigo-400" /> Differential Diagnosis
                                  </h4>
                                  <div className="space-y-2">
                                     {diagnosis.differentialDiagnosis?.map((dd: any) => (
                                       <button 
                                         key={dd.condition} 
                                         onClick={() => setSelectedAlt({
                                           name: dd.condition,
                                           detail: dd.exclusionRationale || "Differential diagnosis clinical profile.",
                                           relationshipToDiagnosis: `Probability: ${(dd.probability * 100).toFixed(0)}%. ${dd.exclusionRationale ? 'Why it was secondary: ' + dd.exclusionRationale : ''}`,
                                           isDiagnosis: true,
                                           isZoonotic: dd.isZoonotic
                                         })}
                                         className="w-full text-left bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 space-y-2 hover:border-indigo-600/50 transition-all group/dd"
                                       >
                                          <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-300 group-hover/dd:text-indigo-400 transition-colors">{dd.condition}</span>
                                                {dd.isZoonotic && <span className="text-[7px] font-black bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Zoonotic</span>}
                                             </div>
                                             <div className="flex items-center gap-3">
                                                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                   <div className="h-full bg-indigo-600" style={{ width: `${dd.probability * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500">{(dd.probability * 100).toFixed(0)}%</span>
                                                <ChevronRight className="w-3 h-3 text-slate-700 group-hover/dd:text-indigo-400 transition-all" />
                                             </div>
                                          </div>
                                          {dd.exclusionRationale && (
                                            <p className="text-[9px] font-medium text-slate-500 italic font-sans leading-tight">
                                               Note: {dd.exclusionRationale}
                                            </p>
                                          )}
                                       </button>
                                     ))}
                                  </div>
                               </div>

                               {diagnosis.biosecurityRisk && (
                                 <div className="p-6 bg-rose-500/10 border-2 border-rose-500/30 rounded-[2rem] space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                       <ShieldAlert className="w-16 h-16 text-rose-500" />
                                    </div>
                                    <h4 className="text-[11px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-3">
                                       <ShieldAlert className="w-4 h-4" /> {t[lang].biosecurity}
                                    </h4>
                                    <p className="text-sm font-bold text-rose-200/90 leading-relaxed uppercase tracking-tight">
                                       {diagnosis.biosecurityRisk}
                                    </p>
                                 </div>
                               )}
                            </div>

                            <div className="space-y-6">
                               <div>
                                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Microscope className="w-3 h-3 text-indigo-400" /> {t[lang].labTests}
                                  </h4>
                                  <div className="grid grid-cols-1 gap-3">
                                     {diagnosis.labRecommendations?.map((test: string) => (
                                       <div key={test} className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-600/40 transition-all cursor-default">
                                          <div className="h-8 w-8 bg-indigo-600/10 rounded-xl flex items-center justify-center shrink-0">
                                             <Thermometer className="w-4 h-4 text-indigo-400" />
                                          </div>
                                          <span className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{test}</span>
                                       </div>
                                     ))}
                                  </div>
                               </div>

                               {diagnosis.instructions && (
                                 <div className="p-6 bg-indigo-700/10 border-2 border-indigo-600/30 rounded-[2rem] space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                       <AlertCircle className="w-16 h-16 text-indigo-600" />
                                    </div>
                                    <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                                       <AlertCircle className="w-4 h-4" /> {t[lang].immediateMgmt}
                                    </h4>
                                    <p className="text-sm font-bold text-sky-200/90 leading-relaxed uppercase tracking-tight">
                                       {diagnosis.instructions}
                                    </p>
                                 </div>
                               )}

                               {diagnosis.pathogens?.length > 0 && (
                                 <div className="p-5 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl space-y-3">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                       <Dna className="w-3 h-3" /> Likely Pathogens
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                       {diagnosis.pathogens.map((p: string) => (
                                          <span key={p} className="px-3 py-1 bg-indigo-600/10 rounded-full text-[9px] font-bold text-sky-200 border border-indigo-600/20 italic">
                                             {p}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                               )}

                               {diagnosis.riskFactors?.length > 0 && (
                                 <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-3">
                                    <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                       <AlertCircle className="w-3 h-3" /> Risk Factors
                                    </h4>
                                    <ul className="space-y-1">
                                       {diagnosis.riskFactors.map((rf: string) => (
                                          <li key={rf} className="text-[10px] font-bold text-amber-200/70 flex items-center gap-2 font-sans">
                                             <div className="h-1 w-1 rounded-full bg-amber-500" />
                                             {rf}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="px-12 pb-12">
                    {!aiTreatment && !aiLoading && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={fetchAiTreatment}
                        className="w-full py-6 bg-white text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-sky-50 transition-all shadow-2xl relative group/btn"
                      >
                        <Sparkles className="w-5 h-5 text-indigo-700 group-hover/btn:animate-spin-slow" />
                        {t[lang].synthesize}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    )}

                    {aiError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        <p className="text-xs font-black text-rose-400 uppercase tracking-tight">{aiError}</p>
                      </motion.div>
                    )}

                    {aiLoading && (
                      <div className="w-full p-8 bg-slate-950/50 rounded-[2rem] border border-slate-800 border-dashed flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 border-3 border-indigo-600/20 rounded-full" />
                          <div className="absolute inset-0 w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] animate-pulse mb-1">Synthesizing Pharmacology</span>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Optimizing dosage for {selectedSpecies}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Treatment Results - Visual Split */}
                {aiTreatment && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Main Protocol */}
                      <div className="md:col-span-12 lg:col-span-7 bg-indigo-700 rounded-[3rem] p-4 text-white shadow-2xl relative overflow-hidden group/card flex flex-col">
                        <div className="px-8 py-6">
                           <ExpandableHeader 
                             id="protocol" 
                             title="Clinical Protocol" 
                             icon={ShieldCheck} 
                             colorClass="text-indigo-400" 
                             isExpanded={expandedSections.protocol} 
                           />
                        </div>

                        <AnimatePresence>
                          {expandedSections.protocol && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="p-10 pt-0 min-h-[300px] flex flex-col">
                                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-50" />
                                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:rotate-12 transition-transform duration-700">
                                   <ShieldCheck className="w-32 h-32" />
                                 </div>

                                 <div className="space-y-10 relative z-10 mt-auto">
                                    <div>
                                      <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mb-3">{t[lang].counterAgent}</p>
                                      <p className="text-xl xl:text-2xl font-black leading-none tracking-tighter drop-shadow-lg">{aiTreatment.bestDrug}</p>
                                    </div>
                                    
                                    <div className="bg-white/10 border border-white/20 p-6 rounded-[2rem] backdrop-blur-sm">
                                      <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Stethoscope className="w-3 h-3" /> {t[lang].rationale}
                                      </p>
                                      <p className="text-sm leading-relaxed font-bold italic font-sans opacity-95">
                                        "{aiTreatment.rationale}"
                                      </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                       <div className="space-y-2">
                                         <p className="text-[9px] font-black opacity-50 uppercase tracking-widest">{t[lang].admin}</p>
                                         <div className="text-sm font-black uppercase flex items-center gap-2">
                                           <div className="h-1.5 w-1.5 bg-white rounded-full" /> {aiTreatment.administrationRoute}
                                         </div>
                                       </div>
                                       <div className="space-y-2">
                                         <p className="text-[9px] font-black opacity-50 uppercase tracking-widest">{t[lang].dosage}</p>
                                         <div className="text-sm font-black uppercase flex items-center gap-2">
                                           <div className="h-1.5 w-1.5 bg-white rounded-full" /> {aiTreatment.dosageGuidelines}
                                         </div>
                                       </div>
                                    </div>
                                 </div>
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Right: Technical Details */}
                      <div className="md:col-span-12 lg:col-span-5 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 shadow-xl flex flex-col h-full group/tech overflow-hidden relative">
                           <div className="px-6 py-6 border-b border-slate-800/50 mb-4">
                              <ExpandableHeader 
                                id="tech" 
                                title={t[lang].techSpec} 
                                icon={Zap} 
                                colorClass="text-indigo-400" 
                                isExpanded={expandedSections.tech} 
                              />
                           </div>
                           
                           <AnimatePresence>
                              {expandedSections.tech && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden h-full flex flex-col"
                                >
                                  <div className="p-6 pt-0 flex flex-col h-full">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/tech:scale-110 transition-transform duration-700">
                                       <Dna className="w-24 h-24" />
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-bold font-mono uppercase bg-slate-950 p-6 rounded-2xl border border-slate-800/50 flex-1 mb-6">
                                      {aiTreatment.mechanismOfAction}
                                    </p>
                                    
                                    <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                       <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Target Specificity</div>
                                       <div className="flex gap-1">
                                          {[1,2,3,4,5].map(i => <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= 4 ? "bg-indigo-600" : "bg-slate-800")} />)}
                                       </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Warnings card */}
                      <div className="md:col-span-12 lg:col-span-4 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] p-4 shadow-xl group/warn">
                         <div className="px-6 py-4">
                            <ExpandableHeader 
                              id="warnings" 
                              title={t[lang].warnings} 
                              icon={AlertCircle} 
                              colorClass="text-rose-400" 
                              isExpanded={expandedSections.warnings} 
                            />
                         </div>
                         <AnimatePresence>
                            {expandedSections.warnings && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                   <p className="text-sm text-rose-300 leading-relaxed font-black uppercase tracking-tight bg-rose-500/10 p-6 rounded-2xl border border-rose-500/10">
                                     {aiTreatment.importantWarnings}
                                   </p>
                                </div>
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </div>

                      {/* Alternatives card */}
                      <div className="md:col-span-12 lg:col-span-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden text-slate-200">
                         <div className="px-8 py-6">
                            <ExpandableHeader 
                              id="alternatives" 
                              title={t[lang].alternatives} 
                              icon={Microscope} 
                              colorClass="text-slate-400" 
                              isExpanded={expandedSections.alternatives} 
                            />
                         </div>

                         <AnimatePresence>
                            {expandedSections.alternatives && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-10 pt-0">
                                   <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-indigo-600/5 blur-[100px] pointer-events-none" />
                                   
                                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 relative z-10">
                                      {aiTreatment.alternatives.map((alt: any) => (
                                        <button 
                                          key={alt.name || alt} 
                                          onClick={async () => {
                                             const altName = typeof alt === 'string' ? alt : alt.name;
                                             setSelectedAlt({ 
                                               name: altName, 
                                               detail: "Fetching exhaustive clinical data...", 
                                               relationshipToDiagnosis: `Analyzing role in ${diagnosis.diagnosis} treatment...` 
                                             });
                                             
                                             const details = await getDrugDetail(altName, diagnosis.diagnosis, lang);
                                             if (details) {
                                               setSelectedAlt({
                                                 name: details.name,
                                                 detail: details.detail,
                                                 relationshipToDiagnosis: details.relationshipToDiagnosis,
                                                 isZoonotic: details.isZoonoticAlert
                                               });
                                             } else {
                                               setSelectedAlt(typeof alt === 'string' ? { name: alt, detail: "Deep neural lookup failed.", relationshipToDiagnosis: "Standard alternative." } : alt);
                                             }
                                           }}
                                          className="px-6 py-5 bg-slate-900 border border-slate-800/50 rounded-2xl text-xs font-black text-slate-400 hover:border-indigo-600/50 hover:text-white transition-all cursor-pointer flex items-center justify-between group/alt hover:bg-slate-800 shadow-sm w-full text-left"
                                        >
                                           {alt.name || alt}
                                           <ChevronRight className="w-4 h-4 text-slate-700 group-hover/alt:text-indigo-400 group-hover/alt:translate-x-1 transition-all" />
                                        </button>
                                      ))}
                                   </div>
                                </div>
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
                      {/* Recovery Timeline */}
                      <div className="md:col-span-12 lg:col-span-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 overflow-hidden relative">
                        <div className="px-10 py-6">
                           <ExpandableHeader 
                             id="recovery" 
                             title={t[lang].recovery} 
                             icon={Clock} 
                             colorClass="text-indigo-400" 
                             isExpanded={expandedSections.recovery} 
                           />
                        </div>
                        <AnimatePresence>
                          {expandedSections.recovery && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-10 pb-10">
                                 <div className="space-y-6 relative">
                                    {aiTreatment.followUpSchedule && (
                                      <>
                                        <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-slate-800" />
                                        {aiTreatment.followUpSchedule.map((step: any, idx: number) => (
                                           <div key={idx} className="flex gap-6 relative group">
                                              <div className="w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-600/50 flex items-center justify-center z-10 shrink-0 group-hover:border-indigo-400 transition-colors">
                                                 <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                              </div>
                                              <div className="space-y-1">
                                                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{step.day}</p>
                                                 <p className="text-xs text-slate-400 font-bold leading-relaxed font-sans">{step.action}</p>
                                              </div>
                                           </div>
                                        ))}
                                      </>
                                    )}
                                 </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Monitoring & Escalation */}
                      <div className="md:col-span-12 lg:col-span-6 space-y-6">
                         <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-4">
                           <div className="px-8 py-4">
                              <ExpandableHeader 
                                id="monitoring" 
                                title={t[lang].monitoring} 
                                icon={Activity} 
                                colorClass="text-slate-400" 
                                isExpanded={expandedSections.monitoring} 
                              />
                           </div>
                           <AnimatePresence>
                              {expandedSections.monitoring && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-8 pb-8 space-y-6">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {aiTreatment.monitoringParameters?.map((param: string) => (
                                           <div key={param} className="flex items-center gap-3 py-3 px-4 bg-slate-950 rounded-xl border border-slate-800/50">
                                              <ClipboardCheck className="w-3 h-3 text-indigo-600" />
                                              <span className="text-[10px] font-bold text-slate-300 uppercase letter-tight">{param}</span>
                                           </div>
                                        ))}
                                     </div>

                                     <div className="bg-orange-500/5 border border-orange-500/20 rounded-[2.5rem] p-8">
                                        <h4 className="text-[10px] font-black mb-4 flex items-center gap-3 text-orange-400 uppercase tracking-widest">
                                          <ShieldAlert className="w-4 h-4" /> Escalation Triggers
                                        </h4>
                                        <ul className="space-y-2">
                                           {aiTreatment.emergencyTriggers?.map((trigger: string) => (
                                              <li key={trigger} className="text-[10px] font-bold text-orange-200/70 flex items-start gap-2 font-sans">
                                                 <span className="mt-1 w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                                                 {trigger}
                                              </li>
                                           ))}
                                        </ul>
                                     </div>

                                     <div className="bg-indigo-600/10 border border-emerald-500/20 rounded-[2.5rem] p-8">
                                        <div className="flex items-center justify-between mb-2">
                                           <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Expected Outcome</h4>
                                           <div className="px-2 py-0.5 bg-indigo-600 text-slate-950 text-[8px] font-black rounded-md uppercase">High Confidence</div>
                                        </div>
                                        <p className="text-xs text-sky-100/80 leading-relaxed font-bold italic font-sans">
                                           {aiTreatment.expectedPrognosis}
                                        </p>
                                     </div>
                                  </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                       <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 group/bio">
                          <div className="px-8 py-4">
                             <ExpandableHeader 
                               id="bio" 
                               title={t[lang].bio} 
                               icon={ShieldCheck} 
                               colorClass="text-emerald-400" 
                               isExpanded={expandedSections.bio} 
                             />
                          </div>
                          <AnimatePresence>
                             {expandedSections.bio && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                  <div className="px-8 pb-8">
                                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/50">
                                        <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans">
                                          {aiTreatment.biosecurityProtocol}
                                        </p>
                                     </div>
                                  </div>
                               </motion.div>
                             )}
                          </AnimatePresence>
                       </div>

                       <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 group/env">
                          <div className="px-8 py-4">
                             <ExpandableHeader 
                               id="env" 
                               title={t[lang].env} 
                               icon={Thermometer} 
                               colorClass="text-indigo-400" 
                               isExpanded={expandedSections.env} 
                             />
                          </div>
                          <AnimatePresence>
                             {expandedSections.env && (
                               <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 className="overflow-hidden"
                               >
                                  <div className="px-8 pb-8">
                                     <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/50">
                                        <p className="text-xs text-slate-300 leading-relaxed font-medium font-sans">
                                          {aiTreatment.environmentalManagement}
                                        </p>
                                     </div>
                                  </div>
                               </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    </div>

                    {/* Final Bottom Action */}
                    <div className="flex items-center justify-between pt-12">
                       <button 
                         onClick={() => {
                            setDiagnosis(null);
                            setAiTreatment(null);
                            setAiDescription("");
                         }}
                         className="flex items-center gap-3 px-8 py-3 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-800 hover:text-slate-300 transition-all border-dashed"
                       >
                          <Activity className="w-4 h-4" /> Reset Diagnostic Core
                       </button>

                       <div className="flex gap-4">
                         <button className="p-3 bg-slate-900 border border-slate-800 rounded-full text-slate-500 hover:text-indigo-400 transition-all" title="Print Medical Report">
                           <Printer className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => setShowHistory(!showHistory)}
                           className="flex items-center gap-3 px-8 py-3 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600/20 transition-all"
                         >
                           <HistoryIcon className="w-4 h-4" /> {t[lang].archive}
                         </button>
                       </div>
                    </div>

                    {/* History Sidebar/Overlay */}
                    <AnimatePresence>
                      {showHistory && (
                        <motion.div 
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 100 }}
                          className="fixed right-0 top-0 bottom-0 w-80 bg-slate-950 border-l border-slate-800 p-8 z-[100] shadow-2xl backdrop-blur-3xl bg-slate-950/90"
                        >
                           <div className="flex items-center justify-between mb-10">
                              <h4 className="text-sm font-black text-white uppercase tracking-tighter">Case History</h4>
                              <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white">
                                 <Zap className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="space-y-6">
                              {diagnosticHistory.map((entry, i) => (
                                <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-2 group hover:border-indigo-600/30 transition-all cursor-pointer">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[8px] font-black text-indigo-400 uppercase">{entry.species}</span>
                                      {entry.isZoonotic && (
                                        <span className="text-[7px] font-black bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Zoonotic</span>
                                      )}
                                      <span className="text-[8px] font-black text-slate-600 font-mono tracking-tighter">
                                         {new Date(entry.timestamp).toLocaleDateString()}
                                      </span>
                                   </div>
                                   <h5 className="text-xs font-black text-white leading-tight">{String(entry.diagnosis || '').replace(/_/g, ' ')}</h5>
                                </div>
                              ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                     {/* Alternative Detail Modal */}
                     <AnimatePresence>
                        {selectedAlt && (
                          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setSelectedAlt(null)}
                              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                            />
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0, y: 20 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.9, opacity: 0, y: 20 }}
                              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden"
                            >
                               <div className="absolute top-0 right-0 p-8">
                                  <button onClick={() => setSelectedAlt(null)} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                                     <X className="w-5 h-5" />
                                  </button>
                               </div>

                               <div className="space-y-8">
                                  <div className="space-y-4">
                                     <div className="flex items-center gap-3">
                                        <div className={cn("p-2.5 rounded-2xl border", selectedAlt.isDiagnosis ? "bg-indigo-600/20 border-indigo-600/30 text-indigo-400" : "bg-indigo-600/20 border-indigo-600/30 text-indigo-400")}>
                                           {selectedAlt.isDiagnosis ? <Brain className="w-6 h-6" /> : <Microscope className="w-6 h-6" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                           {selectedAlt.isDiagnosis ? t[lang].differentialAssessment : t[lang].alternativeProtocol}
                                        </span>
                                     </div>
                                     <div className="flex items-center gap-4 flex-wrap">
                                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                           {String(selectedAlt.name || '').replace(/_/g, ' ')}
                                        </h2>
                                        {selectedAlt.isZoonotic && (
                                          <div className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{t[lang].zoonotic}</span>
                                          </div>
                                        )}
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-6">
                                     <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                           <Info className="w-3 h-3 text-indigo-400" /> {t[lang].rationaleHeading}
                                        </h4>
                                        <p className="text-lg font-bold text-slate-200 leading-relaxed italic font-sans">
                                           "{selectedAlt.detail}"
                                        </p>
                                     </div>

                                     <div className="bg-slate-950/40 p-8 rounded-[2.5rem] border border-slate-800/30 space-y-3">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                           <Zap className="w-3 h-3 text-indigo-400" /> {t[lang].relationshipHeading}
                                        </h4>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-tight leading-relaxed">
                                           {selectedAlt.relationshipToDiagnosis}
                                        </p>
                                     </div>
                                  </div>

                                  {selectedAlt.isDiagnosis && (
                                    <button 
                                      onClick={() => {
                                        setSelectedDirectDisease(selectedAlt.name);
                                        runDiagnosis(selectedAlt.name);
                                        setSelectedAlt(null);
                                      }}
                                      className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-sky-50 transition-all shadow-xl flex items-center justify-center gap-3"
                                    >
                                       <Activity className="w-4 h-4" /> {t[lang].recalculate}
                                    </button>
                                  )}
                               </div>
                            </motion.div>
                          </div>
                        )}
                     </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
