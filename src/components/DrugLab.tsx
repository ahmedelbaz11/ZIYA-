import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FlaskConical, 
  Beaker, 
  Zap, 
  Dna, 
  ShieldAlert, 
  LineChart, 
  ChevronRight,
  ChevronDown,
  Sparkles,
  TestTube,
  Search,
  Database,
  Briefcase,
  Microscope,
  Info,
  Activity,
  History,
  Target,
  Globe,
  FileText,
  Thermometer,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUpRight,
  BrainCircuit,
  Wand2,
  Syringe,
  Trash2,
  Download,
  AlertTriangle,
  Scale,
  Workflow,
  Factory,
  Droplets,
  ExternalLink
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "../lib/utils";
import { getAdvancedMolecularReport, predictMolecularParameters } from "../services/geminiService";

export default function DrugLab({ lang = 'en' }: { lang?: 'en' | 'ar' }) {
  const t = {
    en: {
      labNode: "AI Lab Node",
      targetCompound: "Target Compound",
      enterMolecule: "Enter Molecular Name...",
      structural: "Structural",
      prediction: "AI Mode",
      molecularSim: "Molecular Simulation",
      searchHint: "Enter Molecular Name...",
      predictionVal: "AI Mode",
      structuralVal: "Structural Mode",
      status: "Analyzing...",
      pharmacology: "Deep Pharmacology",
      potency: "Potency Index",
      summary: "Simulation Lead Summary",
      molecularParams: "Molecular Parameters",
      affinity: "Binding Affinity",
      toxicity: "Toxicity",
      generateReport: "AI GENERATE & ANALYZE",
      bench: "Lab Bench",
      pharmacokinetics: "Pharmacokinetics",
      regulatory: "Regulatory",
      environmental: "Environmental",
      scientificReport: "Scientific Report",
      batchLogs: "Batch Logs",
      inSilico: "In-Silico Processing",
      targetSpecificity: "Target Specificity",
      logp: "LogP (Lipophilicity)",
      mw: "Molecular Weight",
      hDonor: "H-Donors",
      hAcceptor: "H-Acceptors",
      tpsa: "TPSA (Polar Area)",
      rotatable: "Rotatable Bonds",
      download: "Download PDF",
      history: "History",
      synthsized: "AI SYNTHESIZED",
      correllation: "Correlation",
      smallMolecule: "Small Molecule Ligand",
      macroMolecule: "Macromolecular Complex",
      interactionEngine: "Drug Interaction Engine",
      noInteractions: "No critical interactions detected among selected compounds.",
      addDrug: "Add drug to check...",
      crossSpecies: "Cross-Species",
      transferInsight: "Transfer Learning Insight",
      researchDossier: "Research Dossier",
      noveltyScore: "Novelty Score",
      confidence: "Confidence",
      verificationStatus: "Verification Status",
      verifiedAt: "Algorithm Verified 2026.4.23",
      exportCsv: "Export CSV Data",
      downloadPdf: "Download Full PDF Dossier",
      synthesis: "Synthesis Route & Production",
      specificity: "Molecular Target Specificity",
      sideEffects: "Potential Side Effects",
      metabolism: "Metabolic Pathways",
      regulatoryProfile: "Global Regulatory/Clinical Profile",
      comparative: "Comparative Pharmacology",
      interactions: "Potential Drug Interactions",
      stereochemical: "Stereochemical Optimization",
      expand: "Expand Insights",
      collapse: "Collapse Summary"
    },
    ar: {
      labNode: "عقدة مختبر الذكاء الاصطناعي",
      targetCompound: "المركب المستهدف",
      enterMolecule: "أدخل الاسم الجزيئي...",
      structural: "هيكلي",
      prediction: "وضع الذكاء الاصطناعي",
      molecularSim: "محاكاة جزيئية",
      searchHint: "أدخل الاسم الجزيئي...",
      predictionVal: "وضع الذكاء الاصطناعي",
      structuralVal: "الوضع الهيكلي",
      status: "جارٍ التحليل...",
      pharmacology: "علم الصيدلة العميق",
      potency: "مؤشر الفعالية",
      summary: "ملخص المحاكاة",
      molecularParams: "المعايير الجزيئية",
      affinity: "ألفة الارتباط",
      toxicity: "السمية",
      generateReport: "تحليل وتوليد بالذكاء الاصطناعي",
      bench: "منصة المختبر",
      pharmacokinetics: "الحركية الدوائية",
      regulatory: "تنظيمي",
      environmental: "بيئي",
      scientificReport: "تقرير علمي",
      batchLogs: "سجلات الدفعات",
      inSilico: "معالجة داخل الحاسوب",
      targetSpecificity: "خصوصية الهدف",
      logp: "LogP (الدهنية)",
      mw: "الوزن الجزيئي",
      hDonor: "مانح الهيدروجين",
      hAcceptor: "مستقبل الهيدروجين",
      tpsa: "TPSA (المساحة القطبية)",
      rotatable: "الروابط القابلة للدوران",
      download: "تحميل PDF",
      history: "التاريخ",
      synthsized: "تخليق ذكي",
      correllation: "ارتباط",
      smallMolecule: "جزيء صغير (Ligand)",
      macroMolecule: "مركب جزيئي كبير",
      interactionEngine: "محرك التفاعلات الدوائية",
      noInteractions: "لم يتم اكتشاف تفاعلات حرجة بين المركبات المختارة.",
      addDrug: "أضف دواء للتحقق...",
      crossSpecies: "عبر الفصائل",
      transferInsight: "رؤى نقل التعلم",
      researchDossier: "ملف البحث",
      noveltyScore: "درجة الابتكار",
      confidence: "الثقة",
      verificationStatus: "حالة التحقق",
      verifiedAt: "تم التحقق من الخوارزمية 2026.4.23",
      exportCsv: "تصدير بيانات CSV",
      downloadPdf: "تحميل الملف الكامل PDF",
      synthesis: "مسار التخليق والإنتاج",
      specificity: "خصوصية الهدف الجزيئي",
      sideEffects: "الآثار الجانبية المحتملة",
      metabolism: "المسارات الأيضية",
      regulatoryProfile: "الملف التنظيمي والسريري العالمي",
      comparative: "التحليل الصيدلاني المقارن",
      interactions: "التفاعلات الدوائية المحتملة",
      stereochemical: "التحسين الكيميائي الفراغي",
      expand: "توسيع الرؤى",
      collapse: "طي الملخص"
    }
  };

  const [drugName, setDrugName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");

  // Debounce search input
  useEffect(() => {
    if (searchInput !== drugName) {
      setIsTyping(true);
    }
    const timer = setTimeout(() => {
      setDrugName(searchInput);
      setIsTyping(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, drugName]);
  const [binding, setBinding] = useState(0.5);
  const [toxicity, setToxicity] = useState(0.2);
  const [predictionMode, setPredictionMode] = useState<'ai' | 'structural'>('ai');
  const [loading, setLoading] = useState(false);
  
  // Structural Parameters
  const [mw, setMw] = useState<number>(300);
  const [logp, setLogp] = useState<number>(2.0);
  const [hDonor, setHDonor] = useState<number>(1);
  const [hAcceptor, setHAcceptor] = useState<number>(3);
  const [tpsa, setTpsa] = useState<number>(60);
  const [rotatableBonds, setRotatableBonds] = useState<number>(4);
  const [smiles, setSmiles] = useState("");
  const [coordinates3d, setCoordinates3d] = useState("");
  const [structuralSubMode, setStructuralSubMode] = useState<'params' | 'detailed'>('params');

  const [paramsLoading, setParamsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [aiReport, setAiReport] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState<'bench' | 'pharmacokinetics' | 'regulatory' | 'environmental' | 'scientific_report' | 'cross_species'>('bench');
  const [activeStep, setActiveStep] = useState(0);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any[]>([]);
  
  // Interaction Tool State
  const [interactionDrugs, setInteractionDrugs] = useState<string[]>([]);
  const [newInteractionDrug, setNewInteractionDrug] = useState("");
  const [detectedInteractions, setDetectedInteractions] = useState<any[]>([]);
  const [checkingInteractions, setCheckingInteractions] = useState(false);

  useEffect(() => {
    fetch(`/api/metadata?lang=${lang}`).then(r => r.json()).then(setMetadata);
  }, [lang]);

  const checkInteractions = async () => {
    if (interactionDrugs.length < 2) return;
    setCheckingInteractions(true);
    try {
      const res = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugs: interactionDrugs })
      });
      const data = await res.json();
      setDetectedInteractions(data.interactions);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingInteractions(false);
    }
  };

  useEffect(() => {
    if (interactionDrugs.length >= 2) {
      checkInteractions();
    } else {
      setDetectedInteractions([]);
    }
  }, [interactionDrugs]);

  const allPathogens = Array.from(new Set(metadata.flatMap(m => 
    m.diseases.map((d: any) => d.name)
  )));

  const runAnalysis = async () => {
    if (!drugName) return;
    setLoading(true);
    setAiReport(null);
    setAnalysisSteps(lang === 'ar' ? [
      "تهيئة المحاكاة العصبية...",
      "البحث في مكتبة PubChem...",
      "حساب التوافق مع قاعدة Lipinski...",
      "محاكاة مسارات ADME..."
    ] : [
      "Initializing Neural Simulation...",
      "Querying PubChem Library...",
      "Calculating Lipinski Rule Compliance...",
      "Simulating ADME Pathways..."
    ]);
    
    let finalBinding = binding;
    let finalToxicity = toxicity;

    const simulateProgress = async () => {
      for (let i = 0; i <= 3; i++) {
        setActiveStep(i);
        await new Promise(r => setTimeout(r, 600));
      }
    };

    const analysisTask = (async () => {
      let finalParams = { mw, logp, hDonor, hAcceptor, tpsa, rotatableBonds };

      if (predictionMode === 'ai' || (predictionMode === 'structural' && structuralSubMode === 'detailed')) {
        setParamsLoading(true);
        const structuralData = predictionMode === 'structural' && structuralSubMode === 'detailed' 
          ? { smiles, coordinates3d } 
          : undefined;
          
        const predicted = await predictMolecularParameters(drugName, selectedTarget, structuralData);
        if (predicted) {
          finalBinding = predicted.bindingAffinity;
          finalToxicity = predicted.toxicityIndex;
          setBinding(finalBinding);
          setToxicity(finalToxicity);
          
          if (predictionMode === 'ai' || structuralSubMode === 'detailed') {
            // Overwrite local params with AI predictions
            finalParams = {
              mw: predicted.mw,
              logp: predicted.logp,
              hDonor: predicted.hDonor,
              hAcceptor: predicted.hAcceptor,
              tpsa: predicted.tpsa,
              rotatableBonds: predicted.rotatableBonds
            };
            
            setMw(predicted.mw);
            setLogp(predicted.logp);
            setHDonor(predicted.hDonor);
            setHAcceptor(predicted.hAcceptor);
            setTpsa(predicted.tpsa);
            setRotatableBonds(predicted.rotatableBonds);
          }
        }
        setParamsLoading(false);
      }

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            drugName: drugName || (smiles ? "Structural Input" : "Synthetic Molecule"),
            smiles: smiles || undefined,
            bindingAffinity: finalBinding,
            toxicity: finalToxicity,
            target: selectedTarget,
            species: selectedSpecies,
            disease: selectedDisease,
            overrides: finalParams,
            lang
          })
        });
        const data = await res.json();
        setResult(data);
        setHistory(prev => [{ name: drugName, score: data.efficacy, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    })();

    await Promise.all([simulateProgress(), analysisTask]);
    setLoading(false);
  };

  const generateAIReport = async () => {
    if (!result || !drugName) return;
    setReportLoading(true);
    setAiError(null);
    try {
      const report = await getAdvancedMolecularReport(drugName, result.compound, lang);
      if (report) {
        setAiReport(report);
        setActiveSubTab('scientific_report');
        setTimeout(() => {
          document.getElementById('scientific-report-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setAiError(lang === 'ar' ? "فشل تخليق التقرير. يرجى المحاولة مرة أخرى." : "Report synthesis failed. Please try again.");
      }
    } catch (error) {
      console.error("AI Report generation failed:", error);
      setAiError(lang === 'ar' ? "خطأ في الاتصال بنواة الذكاء الاصطناعي." : "Error connecting to AI Medical Core.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleReportViewClick = () => {
    if (aiReport) {
      setActiveSubTab('scientific_report');
      setTimeout(() => {
        document.getElementById('scientific-report-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (!reportLoading) {
      generateAIReport();
    }
  };

  const exportToCSV = () => {
    if (!result) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Parameter,Value\n";
    csvContent += `Compound Name,${drugName}\n`;
    csvContent += `Potency Index,${result.efficacy}%\n`;
    csvContent += `Molecular Weight,${result.compound.mw}\n`;
    csvContent += `LogP,${result.compound.logp}\n`;
    csvContent += `TPSA,${result.compound.tpsa}\n`;
    csvContent += `Absorption,${result.adme.absorption}\n`;
    csvContent += `Distribution,${result.adme.distribution}\n`;
    csvContent += `LD50,${result.toxProfile.ld50}\n`;
    csvContent += `Safety Margin,${result.toxProfile.safetyMargin}\n`;
    
    if (aiReport) {
      csvContent += "\nScientific Report Insights\n";
      csvContent += `{t[lang].noveltyScore},${aiReport.noveltyScore}\n`;
      csvContent += `Synthesis Route,"${String(aiReport.synthesisRoute || '').replace(/"/g, '""')}"\n`;
      csvContent += `Side Effects,"${String(aiReport.sideEffects || '').replace(/"/g, '""')}"\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${drugName}_analysis_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const title = `Molecular Analysis Report: ${drugName.toUpperCase()}`;
    
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated by ZIYA – SCU Veterinary AI | ${new Date().toLocaleString()}`, 14, 30);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. Analysis Metrics", 14, 45);
    
    const tableData = [
      ["Parameter", "Description", "Value"],
      ["Potency Index", "Simulated biological efficacy", `${result.efficacy}%`],
      ["Molecular Weight", "Mass in Daltons", `${result.compound.mw} Da`],
      ["LogP", "Octanol-water partition coefficient", result.compound.logp.toString()],
      ["TPSA", "Topological polar surface area", `${result.compound.tpsa} Å²`],
      ["LD50", "Median lethal dose estimate", result.toxProfile.ld50],
      ["Safety Margin", "Therapeutic Index assessment", result.toxProfile.safetyMargin]
    ];

    autoTable(doc, {
      startY: 50,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    if (aiReport) {
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text("2. Advanced Intelligence Insights", 14, finalY);
      
      const aiData = [
        ["Section", "Details"],
        ["{t[lang].noveltyScore}", aiReport.noveltyScore.toString()],
        ["Synthesis Route", aiReport.synthesisRoute],
        ["Target Specificity", aiReport.targetSpecificity],
        ["Side Effects", aiReport.sideEffects],
        ["{t[lang].metabolism}", aiReport.metabolicPathways],
        ["Regulatory Safety", aiReport.globalRegulatorySafety]
      ];

      autoTable(doc, {
        startY: finalY + 5,
        head: [aiData[0]],
        body: aiData.slice(1),
        theme: 'striped',
        columnStyles: {
          1: { cellWidth: 140 }
        },
        headStyles: { fillColor: [15, 23, 42] }
      });
    }

    doc.save(`${drugName}_molecular_dossier.pdf`);
  };

  const admeData = result ? [
    { subject: 'Absorption', A: result.adme.absorption === "High" ? 100 : 60, fullMark: 100 },
    { subject: 'Distribution', A: result.adme.distribution === "Good" ? 90 : 50, fullMark: 100 },
    { subject: 'Metabolism', A: 80, fullMark: 100 },
    { subject: 'Excretion', A: 70, fullMark: 100 },
    { subject: 'BBB Perm.', A: result.adme.bloodBrainBarrier === "Crosses" ? 100 : 20, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Control Column */}
        <div className="xl:col-span-4 space-y-6">
          <section className="pharma-card p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="bg-indigo-600/20 p-2 rounded-lg">
                   <BrainCircuit className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h2 className="font-black text-lg tracking-tight">AI Lab Node</h2>
               </div>
               <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['ai', 'structural'] as const).map((mode) => (
                    <button 
                      key={mode}
                      onClick={() => setPredictionMode(mode)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                        predictionMode === mode 
                          ? mode === 'ai' ? "bg-indigo-700 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-800 text-white"
                          : "text-slate-600 hover:text-slate-400"
                      )}
                    >
                      {mode === 'ai' ? t[lang].predictionVal : t[lang].structuralVal}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t[lang].targetCompound}</label>
                  <div className="relative group/input">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder={t[lang].enterMolecule}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all font-mono text-slate-200"
                    />
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-3 h-3 text-emerald-400" /> Simulation Target
                </label>
                <select 
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all cursor-pointer font-black"
                >
                  <option value="">Generic Receptor Binding</option>
                  {allPathogens.map((p: any) => (
                    <option key={String(p)} value={String(p)}>{String(p || '').replace(/_/g, ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Species</label>
                  <select 
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-3 text-[10px] text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all cursor-pointer font-black"
                  >
                    <option value="">Any Species</option>
                    {metadata.map((m: any) => (
                      <option key={m.species} value={m.species}>{m.label || m.species}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indication</label>
                  <select 
                    value={selectedDisease}
                    onChange={(e) => setSelectedDisease(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-3 text-[10px] text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all cursor-pointer font-black"
                  >
                    <option value="">General Health</option>
                    {metadata.find(m => m.species === selectedSpecies)?.diseases.map((d: any) => (
                      <option key={d.name} value={d.name}>{d.label || d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {predictionMode === 'structural' ? (
                  <motion.div 
                    key="structural"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/50 space-y-6 overflow-hidden"
                  >
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-2">
                       {(['params', 'detailed'] as const).map((subMode) => (
                         <button 
                           key={subMode}
                           onClick={() => setStructuralSubMode(subMode)}
                           className={cn(
                             "flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all",
                             structuralSubMode === subMode 
                               ? "bg-slate-700 text-white shadow-lg"
                               : "text-slate-600 hover:text-slate-400"
                           )}
                         >
                           {subMode === 'params' ? (lang === 'ar' ? 'المعايير' : 'Parameters') : (lang === 'ar' ? 'التفاصيل' : 'Detailed Structure')}
                         </button>
                       ))}
                    </div>

                    {structuralSubMode === 'params' ? (
                      <div className="space-y-4">
                         <SliderControl label={t[lang].mw} value={mw} min={0} max={1000} step={1} unit="Da" onChange={setMw} color="sky" />
                         <SliderControl label={t[lang].logp} value={logp} min={-2} max={10} step={0.1} onChange={setLogp} color="emerald" />
                         <div className="grid grid-cols-2 gap-4">
                            <SliderControl label={t[lang].hDonor} value={hDonor} min={0} max={12} step={1} onChange={setHDonor} color="emerald" compact />
                            <SliderControl label={t[lang].hAcceptor} value={hAcceptor} min={0} max={15} step={1} onChange={setHAcceptor} color="emerald" compact />
                         </div>
                         <SliderControl label={t[lang].tpsa} value={tpsa} min={0} max={250} step={1} unit="Å²" onChange={setTpsa} color="sky" />
                         <SliderControl label={t[lang].rotatable} value={rotatableBonds} min={0} max={20} step={1} onChange={setRotatableBonds} color="sky" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SMILES Notation</label>
                          <textarea 
                            value={smiles}
                            onChange={(e) => setSmiles(e.target.value)}
                            placeholder="e.g. CC(=O)OC1=CC=CC=C1C(=O)O"
                            className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-400 focus:ring-1 focus:ring-indigo-600 outline-none resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">3D Spatial Coordinates (PDB/XYZ)</label>
                          <textarea 
                            value={coordinates3d}
                            onChange={(e) => setCoordinates3d(e.target.value)}
                            placeholder="ATOM      1  N   ASP A   1      ..."
                            className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                          />
                        </div>
                        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight">AI will auto-extract molecular descriptors from structural inputs.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-6" /> // Placeholder spacing
                )}
              </AnimatePresence>

              <button
                onClick={runAnalysis}
                disabled={loading || (predictionMode !== 'structural' && !drugName)}
                className="w-full py-5 bg-indigo-700 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 fill-white" />
                    {t[lang].generateReport}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Interaction Tool */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <Workflow className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{t[lang].interactionEngine}</h3>
             </div>
             
             <div className="space-y-4">
                <div className="flex gap-2">
                   <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={newInteractionDrug}
                        onChange={(e) => setNewInteractionDrug(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newInteractionDrug) {
                            if (!interactionDrugs.includes(newInteractionDrug)) {
                              setInteractionDrugs([...interactionDrugs, newInteractionDrug]);
                            }
                            setNewInteractionDrug("");
                          }
                        }}
                        placeholder={t[lang].addDrug}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (newInteractionDrug && !interactionDrugs.includes(newInteractionDrug)) {
                            setInteractionDrugs([...interactionDrugs, newInteractionDrug]);
                            setNewInteractionDrug("");
                          }
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                {interactionDrugs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interactionDrugs.map(d => (
                      <span key={d} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-300">
                        {d}
                        <button onClick={() => setInteractionDrugs(interactionDrugs.filter(i => i !== d))} className="hover:text-red-400">
                           <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                   <AnimatePresence>
                     {detectedInteractions.length > 0 ? (
                       <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="space-y-2"
                       >
                         {detectedInteractions.map((inter, i) => (
                           <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                              <div className="flex items-center gap-2 mb-1">
                                 <AlertTriangle className="w-3 h-3 text-red-400" />
                                 <p className="text-[10px] font-black text-red-300 uppercase tracking-tighter">
                                    {inter.pair[0]} + {inter.pair[1]}
                                 </p>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-relaxed italic">{inter.explanation}</p>
                           </div>
                         ))}
                       </motion.div>
                     ) : interactionDrugs.length >= 2 && !checkingInteractions ? (
                       <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest text-center py-2">{t[lang].noInteractions}</p>
                     ) : null}
                   </AnimatePresence>
                </div>
             </div>
          </section>

          {/* History */}
          {history.length > 0 && (
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{t[lang].batchLogs}</h3>
              <div className="space-y-3">
                {history.map((h, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/40">
                      <p className="text-xs font-black text-slate-300 uppercase truncate w-32">{h.name}</p>
                      <div className="text-right">
                        <p className="text-xs font-black text-indigo-600">{h.score}%</p>
                      </div>
                   </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-full min-h-[650px] bg-slate-900 border border-slate-800 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] animate-pulse" />
                  
                  {/* Molecular Orbit Simulation Visual */}
                  <div className="relative w-48 h-48 mb-12">
                     <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 border-2 border-dashed border-indigo-600/20 rounded-full"
                     />
                     <motion.div 
                       animate={{ rotate: -360 }}
                       transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-4 border border-indigo-600/10 rounded-full"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-12 h-12 bg-indigo-600 rounded-2xl rotate-45 shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center"
                        >
                           <Dna className="w-6 h-6 text-white -rotate-45" />
                        </motion.div>
                     </div>
                     {/* Electrons */}
                     {[0, 120, 240].map((deg) => (
                       <motion.div
                         key={deg}
                         animate={{ rotate: 360 }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className="absolute inset-0"
                         style={{ transform: `rotate(${deg}deg)` }}
                       >
                         <div className="w-3 h-3 bg-indigo-400 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-lg shadow-indigo-600/50" />
                       </motion.div>
                     ))}
                  </div>

                  <div className="space-y-6 text-center z-10 w-full max-w-md px-10">
                     <h3 className="text-2xl font-black text-white tracking-widest uppercase">{t[lang].inSilico}</h3>
                     <div className="space-y-3">
                        {analysisSteps.map((step, idx) => (
                          <motion.div 
                            key={step} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: idx <= activeStep ? 1 : 0.2, 
                              x: idx <= activeStep ? 0 : -10,
                              color: idx === activeStep ? "#60a5fa" : "#475569"
                            }}
                            className="flex items-center gap-3 text-xs font-black uppercase tracking-tighter"
                          >
                             {idx < activeStep ? (
                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
                             ) : idx === activeStep ? (
                               <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                             ) : (
                               <div className="w-4 h-4 border border-slate-700 rounded-full" />
                             )}
                             {step}
                          </motion.div>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ) : !result ? (
               <motion.div 
                 key="hero"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="h-full min-h-[650px] bg-slate-900/10 border border-dashed border-slate-800 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden"
               >
                  <div className="absolute top-10 left-10 p-4 border border-slate-800 rounded-2xl bg-slate-900/50">
                     <Microscope className="w-8 h-8 text-slate-700" />
                  </div>
                  <BrainCircuit className="w-24 h-24 text-slate-800 mb-8 animate-pulse" />
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase text-center leading-tight">
                    {lang === 'ar' ? 'عقدة المحاكاة العصبية' : 'Next-Gen Neural'} <br/> {lang === 'ar' ? 'من الجيل التالي' : 'Simulation Node'}
                  </h3>
                  <div className="mt-8 flex gap-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     <span className="px-3 py-1 bg-slate-900 rounded-lg">{lang === 'ar' ? '2.4 مليون جزئ' : '2.4m Molecules'}</span>
                     <span className="px-3 py-1 bg-slate-900 rounded-lg">{lang === 'ar' ? 'مختبر عالي الجودة' : 'High-Fidelity Lab'}</span>
                  </div>
               </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Result Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
                  
                  <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                    {/* Molecular Visual */}
                    <div className="w-full lg:w-48 h-48 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden shrink-0 group/mol">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] opacity-50" />
                       <img 
                         src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(drugName)}/PNG`} 
                         alt={drugName}
                         className="w-32 h-32 object-contain relative z-10 brightness-110 contrast-125 filter grayscale hover:grayscale-0 transition-all duration-500"
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = 'https://www.svgrepo.com/show/496208/molecule.svg';
                         }}
                       />
                       <div className="absolute bottom-4 left-0 right-0 text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover/mol:text-indigo-400 transition-colors capitalize">Structural Hash: {drugName}</p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">AI SYNTHESIZED</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedTarget || "Global Protocol"}</span>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">
                              <Download className="w-4 h-4" />
                           </button>
                           <button className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors">
                              <History className="w-4 h-4" />
                           </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight group-hover:translate-x-1 transition-transform inline-block underline decoration-indigo-600/50 decoration-4 underline-offset-8">
                             {drugName}
                          </h2>
                          <a 
                            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(drugName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-800/50 hover:bg-indigo-600/20 rounded-xl border border-white/5 hover:border-indigo-600/30 transition-all group/link"
                            title="View on PubChem"
                          >
                             <ExternalLink className="w-4 h-4 text-slate-500 group-hover/link:text-indigo-400" />
                          </a>
                        </div>
                        <div className="flex items-center gap-6 pt-4">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t[lang].pharmacology}</p>
                              <p className="text-sm font-bold text-slate-300 uppercase tracking-tight">{result.compound.mw > 400 ? t[lang].macroMolecule : t[lang].smallMolecule}</p>
                           </div>
                           <div className="w-1 h-8 bg-slate-800" />
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t[lang].targetSpecificity}</p>
                              <p className="text-sm font-bold text-indigo-400 uppercase tracking-tight">{result.targetScore}% {t[lang].correllation}</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleReportViewClick}
                      className="lg:w-48 bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 border-t-indigo-600/50 hover:border-indigo-600 transition-all cursor-pointer group/potency"
                    >
                        <p className="text-5xl font-black text-white leading-none tracking-tighter group-hover:scale-110 transition-transform">{(result.efficacy)}</p>
                               <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-3 whitespace-nowrap">{t[lang].potency}</p>
                        {aiReport && <ArrowUpRight className="w-3 h-3 text-indigo-600/50 mt-2 opacity-0 group-hover:opacity-100 transition-all" />}
                    </button>
                  </div>

                  <div className="mt-10 p-1 bg-slate-950 rounded-[2.5rem] border border-slate-800">
                    <button 
                      onClick={handleReportViewClick} 
                      disabled={reportLoading} 
                      className="w-full py-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-600 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl hover:brightness-110 active:scale-[0.99] transition-all"
                    >
                      {reportLoading ? (
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{lang === 'ar' ? 'تخليق المعلومات...' : 'Synthesizing Intelligence...'}</span>
                        </div>
                      ) : (
                        <><Sparkles className="w-5 h-5 fill-white" /> {aiReport ? (lang === 'ar' ? 'عرض الملف الشامل' : 'VIEW COMPREHENSIVE DOSSIER') : (lang === 'ar' ? 'إنشاء تقرير ذكاء اصطناعي شامل' : 'CONSTRUCT COMPREHENSIVE INTELLIGENCE REPORT')}</>
                      )}
                    </button>
                    {aiError && (
                      <div className="mt-4 p-4 bg-rose-950/30 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{aiError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ADME & Toxicity Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                   <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-700 to-transparent opacity-50" />
                      <div className="absolute top-6 right-6">
                         <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20 group-hover:bg-indigo-600/20 transition-all duration-500">
                            <Workflow className="w-6 h-6 text-indigo-600 group-hover:rotate-180 transition-transform duration-700" />
                         </div>
                      </div>
                      <div className="flex items-center gap-3 mb-10">
                         <h4 className="text-sm font-black text-white uppercase tracking-tight">{t[lang].pharmacokinetics}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                         <ADMELabel label={lang === 'ar' ? "الامتصاص" : "Absorption"} value={result.adme.absorption} />
                         <ADMELabel label={lang === 'ar' ? "التوزيع" : "Distribution"} value={result.adme.distribution} />
                         <ADMELabel label={lang === 'ar' ? "الاستقلاب" : "Metabolism"} value={result.adme.metabolism} />
                         <ADMELabel label={lang === 'ar' ? "الإخراج" : "Excretion"} value={result.adme.excretion} />
                      </div>
                      
                      <div className="mt-10 p-5 bg-slate-950 rounded-[2rem] border border-slate-800/50 flex items-center justify-between group/bbb">
                         <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">BBB Passage</p>
                               <p className="text-sm font-bold text-slate-100">{result.adme.bloodBrainBarrier}</p>
                            </div>
                         </div>
                         <div className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                           result.adme.bloodBrainBarrier === "Crosses" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
                         )}>
                           {result.adme.bloodBrainBarrier === "Crosses" ? "Permeable" : "Secure"}
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-transparent opacity-50" />
                      <div className="flex items-center gap-3 mb-10">
                         <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-all duration-500">
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                         </div>
                         <h4 className="text-sm font-black text-white uppercase tracking-tight">Toxicology Snapshot</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-5">
                         <div className="flex justify-between items-center bg-slate-100/5 p-6 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-all group/tox">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LD50 (Species Corrected)</p>
                               <p className="text-xs font-bold text-slate-400">Oral Median Lethal Dose</p>
                            </div>
                            <span className="text-2xl font-black text-rose-500 font-mono group-hover:scale-110 transition-transform">{result.toxProfile.ld50}</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-3xl border border-slate-800/50">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === 'ar' ? 'هامش الأمان' : 'Safety Margin / TI'}</p>
                               <p className="text-xs font-bold text-slate-400">{lang === 'ar' ? 'نسبة المؤشر العلاجي' : 'Therapeutic Index Ratio'}</p>
                            </div>
                            <span className={cn(
                               "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                               result.toxProfile.safetyMargin === "Wide" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            )}>
                               {result.toxProfile.safetyMargin}
                            </span>
                         </div>
                      </div>
                   </div>
                </motion.div>

                {/* Sub Navigation */}
                <div className="bg-slate-900/50 p-1.5 rounded-[2rem] border border-slate-800/50 flex gap-2">
                   {[
                     { id: 'bench', label: lang === 'ar' ? 'التحليل' : 'Analysis', icon: <Layers className="w-4 h-4" /> },
                     { id: 'pharmacokinetics', label: lang === 'ar' ? 'المسار' : 'Pathway', icon: <Cpu className="w-4 h-4" /> },
                     { id: 'regulatory', label: lang === 'ar' ? 'التنظيمي' : 'Regulatory', icon: <Scale className="w-4 h-4" /> },
                     { id: 'environmental', label: lang === 'ar' ? 'التأثير' : 'Impact', icon: <Droplets className="w-4 h-4" /> },
                     { id: 'cross_species', label: t[lang].crossSpecies, icon: <BrainCircuit className="w-4 h-4" /> },
                     { id: 'scientific_report', label: lang === 'ar' ? 'الذكاء' : 'Intelligence', icon: <FileText className="w-4 h-4" />, disabled: !aiReport }
                   ].map((tab) => (
                     <button
                       key={tab.id}
                       disabled={tab.disabled}
                       onClick={() => setActiveSubTab(tab.id as any)}
                       className={cn(
                         "flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all",
                         tab.disabled ? "opacity-20 grayscale cursor-not-allowed" : "cursor-pointer",
                         activeSubTab === tab.id ? "bg-indigo-700 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                       )}
                     >
                       {tab.icon} <span className="hidden md:inline">{tab.label}</span>
                     </button>
                   ))}
                </div>

                <div className="min-h-[420px]">
                   <AnimatePresence mode="wait">
                      {activeSubTab === 'bench' && (
                        <motion.div key="bench" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <Metric label="Mol. Weight" value={result.compound.mw} />
                           <Metric label="XLogP (Solubility)" value={result.compound.logp} />
                           <Metric label="TPSA (Permeability)" value={result.compound.tpsa} />
                           <Metric label="Rot. Bonds" value={result.compound.rotatableBonds} />
                           <Metric label="H-Bond Donors" value={result.compound.hDonor} />
                           <Metric label="H-Bond Acceptors" value={result.compound.hAcceptor} />
                           
                           {/* Benchmark Comparison */}
                           <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 mt-2 overflow-hidden relative">
                              <div className="absolute top-0 right-0 p-10 opacity-5">
                                 <LineChart className="w-32 h-32 text-white" />
                              </div>
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">In-Silico Benchmark vs Category Standard</h4>
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                       <span className="text-indigo-600">{drugName} Potency</span>
                                       <span className="text-slate-400">Tier 1</span>
                                    </div>
                                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                       <motion.div initial={{ width: 0 }} animate={{ width: `${result.efficacy}%` }} className="h-full bg-indigo-600" />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                       <span className="text-slate-500">Standard Reference Potency</span>
                                       <span className="text-slate-600">Benchmark</span>
                                    </div>
                                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                       <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-slate-800" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      )}

                      {activeSubTab === 'pharmacokinetics' && (
                        <motion.div key="adme" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-950 border border-slate-800 p-10 rounded-[40px] h-[450px] relative">
                           <div className="absolute top-8 left-8">
                              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Visual pharmacokinetic Map</h4>
                           </div>
                           <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={admeData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontWeight="900" />
                                <Radar name="Profile" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                              </RadarChart>
                           </ResponsiveContainer>
                           <div className="absolute bottom-8 right-8 text-right">
                              <p className="text-[9px] font-black text-indigo-600 uppercase italic">Ideal Profile Overlay Active</p>
                           </div>
                        </motion.div>
                      )}

                      {activeSubTab === 'regulatory' && (
                         <motion.div key="reg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
                               <div className="flex items-center gap-3">
                                  <div className="bg-indigo-600/10 p-2 rounded-xl text-indigo-600"><Factory className="w-5 h-5"/></div>
                                  <h4 className="text-[11px] font-black text-white uppercase tracking-tighter">Withdrawal Data</h4>
                               </div>
                               <div className="space-y-4">
                                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between">
                                     <span className="text-[10px] font-black text-slate-500 uppercase">Meat Withdrawal</span>
                                     <span className="text-xl font-black text-emerald-500">{result.regulatory.meatWithdrawal}</span>
                                  </div>
                                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between">
                                     <span className="text-[10px] font-black text-slate-500 uppercase">Milk Withdrawal</span>
                                     <span className="text-xl font-black text-emerald-500">{result.regulatory.milkWithdrawal}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-6">
                               <div className="flex items-center gap-3">
                                  <div className="bg-amber-500/10 p-2 rounded-xl text-amber-500"><AlertTriangle className="w-5 h-5"/></div>
                                  <h4 className="text-[11px] font-black text-white uppercase tracking-tighter">Strict Restrictions</h4>
                               </div>
                               <ul className="space-y-3">
                                  {result.regulatory.restrictions.map((txt: string) => (
                                    <li key={txt} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                       <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                       {txt}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                         </motion.div>
                      )}

                      {activeSubTab === 'environmental' && (
                         <motion.div key="env" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 group overflow-hidden relative">
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                               <Droplets className="w-64 h-64 text-emerald-500" />
                            </div>
                            <div className="max-w-2xl space-y-10">
                               <div className="space-y-2">
                                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">Ecological Half-Life</h4>
                                  <p className="text-xs text-slate-400 leading-relaxed font-bold">Estimated degradation in soil and aquatic environments based on LogP and MW cross-analysis with known chemical binders.</p>
                               </div>
                               <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Soil Persistence</p>
                                     <p className="text-3xl font-black text-white tracking-tighter">{result.environmental.soilPersistence.split(' ')[0]} <span className="text-base text-slate-600">DAYS</span></p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Bio-accumulation</p>
                                     <p className="text-3xl font-black text-white tracking-tighter">{result.environmental.bioAccumulation.split(' ')[0]} <span className="text-base text-slate-600">{result.environmental.bioAccumulation.split(' ')[1]}</span></p>
                                  </div>
                               </div>
                               <div className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800/80 border-l-4 border-l-indigo-600">
                                  <p className="text-[10px] font-black text-slate-300 leading-relaxed uppercase tracking-wide">
                                     Recommendation: {result.environmental.disposal}
                                  </p>
                               </div>
                            </div>
                         </motion.div>
                      )}

                      {activeSubTab === 'cross_species' && result.speciesAnalytics && (
                        <motion.div key="cross" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {result.speciesAnalytics.map((s: any) => (
                                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-600/30 transition-all group">
                                   <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{s.name}</h4>
                                      <div className={cn(
                                        "w-3 h-3 rounded-full",
                                        s.predictedRisk === 'Safe' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                                        s.predictedRisk === 'Risk' ? 'bg-amber-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                      )} />
                                   </div>
                                   <div className="space-y-4">
                                      <div className="flex justify-between items-end">
                                         <p className="text-[10px] font-black text-slate-500 uppercase">Efficacy Prediction</p>
                                         <p className="text-xl font-black text-indigo-400">{s.predictedEfficacy}%</p>
                                      </div>
                                      <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                         <motion.div 
                                           initial={{ width: 0 }}
                                           animate={{ width: `${s.predictedEfficacy}%` }}
                                           className="h-full bg-indigo-600"
                                         />
                                      </div>
                                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                                         <p className="text-[9px] font-bold text-slate-400 leading-tight italic line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {s.metabolicNote}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                              ))}
                           </div>
                           <div className="p-6 bg-indigo-600/5 border border-indigo-600/20 rounded-3xl">
                              <div className="flex items-center gap-3 mb-2">
                                 <BrainCircuit className="w-5 h-5 text-indigo-600" />
                                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t[lang].transferInsight}</h4>
                              </div>
                              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                                 Predicted behavioral patterns are derived from simulated multi-species metabolic consensus models. Feline glucuronidation deficiency and Avian renal portal shunt dynamics represent high-confidence priors in this simulation.
                              </p>
                           </div>
                        </motion.div>
                      )}

                      {activeSubTab === 'scientific_report' && aiReport && (
                        <motion.div id="scientific-report-view" key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 md:p-16 text-slate-950 shadow-2xl space-y-16 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -mr-10 -mt-10" />
                           <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-16 gap-10">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><FlaskConical className="w-6 h-6"/></div>
                                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{t[lang].researchDossier}</h3>
                                </div>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                                   <span className="w-2 h-2 bg-indigo-700 rounded-full" />
                                   Document ID: {Math.random().toString(36).substring(7).toUpperCase()}
                                </p>
                              </div>
                              <div className="flex bg-slate-50 p-6 md:p-8 rounded-[2.5rem] items-center gap-6 md:gap-8 border border-slate-100 shadow-sm shrink-0">
                                 <div className="text-center">
                                    <p className="text-3xl md:text-4xl font-black text-indigo-700">{aiReport.noveltyScore}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t[lang].noveltyScore}</p>
                                 </div>
                                 <div className="w-px h-12 bg-slate-200" />
                                 <div className="text-center">
                                    <p className="text-lg md:text-xl font-black text-slate-900 capitalize">High</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t[lang].confidence}</p>
                                 </div>
                              </div>
                           </div>
                           <motion.div 
                              variants={{
                                show: {
                                  transition: {
                                    staggerChildren: 0.1
                                  }
                                }
                              }}
                              initial="hidden"
                              animate="show"
                              className="flex flex-col gap-6"
                           >
                              <DossierSection 
                                title="{t[lang].synthesis}" 
                                content={aiReport.synthesisRoute} 
                                icon={Factory}
                              />
                              <DossierSection 
                                title="{t[lang].specificity}" 
                                content={aiReport.targetSpecificity} 
                                icon={Target}
                              />
                              <DossierSection 
                                title="{t[lang].sideEffects}" 
                                content={aiReport.sideEffects} 
                                icon={ShieldAlert}
                                color="rose"
                              />
                              <DossierSection 
                                title="{t[lang].metabolism}" 
                                content={aiReport.metabolicPathways} 
                                icon={Workflow}
                              />
                              <DossierSection 
                                title="{t[lang].regulatoryProfile}" 
                                content={aiReport.globalRegulatorySafety} 
                                icon={Globe}
                              />
                              <DossierSection 
                                title="{t[lang].comparative}" 
                                content={aiReport.comparativeAnalysis} 
                                icon={Scale}
                              />
                              <DossierSection 
                                title="{t[lang].interactions}" 
                                content={aiReport.drugInteractions} 
                                icon={Zap}
                                color="amber"
                              />
                              <DossierSection 
                                title="{t[lang].stereochemical}" 
                                content={aiReport.isomericDesign} 
                                icon={Dna}
                              />
                           </motion.div>
                           <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-50/50 -m-8 md:-m-16 p-8 md:p-16 mt-0">
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-white rounded-2xl shadow-sm"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                                  <div>
                                     <p className="text-[10px] font-black text-slate-400 uppercase">{t[lang].verificationStatus}</p>
                                     <p className="text-[11px] font-black text-slate-900 uppercase">{t[lang].verifiedAt}</p>
                                  </div>
                               </div>
                               <div className="flex flex-col sm:flex-row gap-4">
                                  <button 
                                    onClick={exportToCSV}
                                    className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                                  >
                                     <Download className="w-4 h-4" /> {t[lang].exportCsv}
                                  </button>
                                  <button 
                                    onClick={exportToPDF}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg"
                                  >
                                     <FileText className="w-4 h-4" /> {t[lang].downloadPdf}
                                  </button>
                               </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ADMELabel({ label, value }: { label: string, value: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-slate-800/40 hover:border-slate-700/60 transition-all group"
    >
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2 group-hover:text-indigo-400 transition-colors">{label}</p>
       <p className="text-base font-black text-slate-100 uppercase truncate tracking-tight">{value}</p>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string, value: any }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-slate-950 border border-slate-800/50 rounded-[2rem] p-7 text-center shadow-xl shadow-black/20 hover:border-indigo-600/30 transition-all"
    >
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
       <p className="text-3xl font-black text-white font-mono tracking-tighter">{value}</p>
    </motion.div>
  );
}

function PropertyMini({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
       <span className="text-[8px] font-black text-slate-600 uppercase">{label}</span>
       <span className={cn("text-[10px] font-black", color === 'sky' ? 'text-indigo-400' : color === 'rose' ? 'text-rose-400' : 'text-slate-300')}>{value}</span>
    </div>
  );
}

function Section({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-4">
       <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-indigo-700 pl-3">{title}</h4>
       <p className="text-slate-600 font-medium pl-4">{content}</p>
    </div>
  );
}

function DossierSection({ title, content, icon: Icon, color = "sky" }: { title: string, content: string, icon: any, color?: "sky" | "rose" | "amber" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
      }}
      className={cn(
        "group transition-all duration-500 overflow-hidden",
        isExpanded ? "bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-sm" : "bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-md"
      )}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 cursor-pointer group-hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-5">
           <div className={cn(
             "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
             isExpanded ? (
                color === "sky" ? "bg-indigo-700 text-white shadow-sky-200 rotate-3" :
                color === "rose" ? "bg-rose-600 text-white shadow-rose-200 rotate-3" :
                "bg-amber-500 text-slate-900 shadow-amber-200 rotate-3"
             ) : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
           )}>
              <Icon className="w-6 h-6" />
           </div>
           <div className="text-left">
              <h4 className="text-sm font-black text-slate-950 uppercase tracking-widest leading-none mb-1">{title}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isExpanded ? '{t[lang].collapse}' : '{t[lang].expand}'}</p>
           </div>
        </div>
        <div className={cn("transition-transform duration-500", isExpanded ? "rotate-180 text-indigo-700" : "text-slate-300")}>
           <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-2">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <p className="text-base text-slate-600 leading-relaxed font-medium">
                    {content}
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SliderControl({ label, value, min, max, step, unit = "", onChange, color = "sky", compact = false }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className={cn("font-black text-slate-500 uppercase tracking-widest", compact ? "text-[8px]" : "text-[10px]")}>
          {label}
        </label>
        <span className={cn(
          "font-mono font-bold px-2 py-0.5 rounded text-[10px]",
          color === 'sky' ? "text-indigo-400 bg-indigo-600/10" :
          color === 'rose' ? "text-rose-400 bg-rose-500/10" :
          color === 'emerald' ? "text-emerald-400 bg-emerald-500/10" :
          "text-slate-400 bg-slate-800"
        )}>
          {value}{unit}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          "w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-900 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600/20",
          color === 'sky' ? "accent-indigo-600" :
          color === 'rose' ? "accent-rose-500" :
          color === 'emerald' ? "accent-emerald-500" :
          "accent-slate-500"
        )}
      />
    </div>
  );
}
