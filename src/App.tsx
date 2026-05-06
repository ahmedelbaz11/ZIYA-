/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Globe, Database, HelpCircle, FlaskConical, Stethoscope } from "lucide-react";
import { useState } from "react";
import ClinicalSupport from "./components/ClinicalSupport";
import DrugLab from "./components/DrugLab";
import { cn } from "./lib/utils";

export default function App() {
  const [activeTab, setActiveTab] = useState<'clinical' | 'lab'>('clinical');
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const t = {
    en: {
      clinical: "Clinical Analysis",
      lab: "Molecular Lab",
      clinicalDesc: "Neural-driven veterinary diagnostics and treatment protocol synthesis.",
      labDesc: "Real-time chemical simulation and pharmacopeia cross-referencing.",
      developer: "Developer",
      status: "System Status: Optimal",
      version: "v3.2.1 Hybrid Core",
      university: "Faculty of Veterinary Medicine",
      universityAr: "Suez Canal University",
    },
    ar: {
      clinical: "التحليل السريري",
      lab: "المختبر الجزيئي",
      clinicalDesc: "تشخيصات بيطرية وتركيب بروتوكولات علاج مدفوعة بالذكاء الاصطناعي.",
      labDesc: "محاكاة كيميائية حية ومرجعية متقاطعة لدساتير الأدوية.",
      developer: "المطور",
      status: "حالة النظام: مثالية",
      version: "v3.2.1 هجين أساسي",
      university: "كلية الطب البيطري",
      universityAr: "جامعة قناة السويس",
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-medical-slate text-slate-100 font-sans selection:bg-medical-blue/30 overflow-x-hidden",
      lang === 'ar' ? "font-serif" : ""
    )} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Immersive Wallpaper Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Gradient Orbs - Pharma Edition */}
        <div className="absolute top-[-20%] right-[-10%] w-[120vw] h-[120vw] lg:w-[800px] lg:h-[800px] bg-indigo-500/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[120vw] h-[120vw] lg:w-[800px] lg:h-[800px] bg-emerald-500/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-medical-slate opacity-95" />
        
        {/* Subtle Pill Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--color-medical-indigo) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo Watermark Blend */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] mix-blend-screen scale-150 grayscale contrast-200 pointer-events-none">
           <img src="/attachments/logo.png" alt="" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto min-h-screen bg-medical-slate/60 backdrop-blur-3xl shadow-[0_0_150px_rgba(0,0,0,0.8)] border-x border-white/5 flex flex-col">
        {/* Header */}
        <header className="h-24 glass-header sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-1 rounded-2xl shadow-xl shadow-indigo-500/10 w-12 h-12 flex items-center justify-center overflow-hidden border border-white/10 relative group">
              <img 
                src="/attachments/logo.png" 
                alt="ZIYA Logo" 
                className="w-full h-full object-cover rounded-xl transition-opacity duration-300" 
                onError={(e) => {
                  e.currentTarget.style.opacity = '0';
                  e.currentTarget.parentElement?.querySelector('.logo-fallback')?.classList.remove('hidden');
                }}
              />
              <div className="logo-fallback hidden absolute inset-0 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tighter bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase leading-none">
                ZIYA
              </h1>
              <p className="text-[7px] uppercase tracking-[0.3em] font-black text-slate-500 mt-1">FOVMSCU PHARMA CORE</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="flex bg-slate-900/40 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  className="p-2 rounded-lg text-sky-400 hover:bg-white/5 transition-all flex items-center justify-center"
                  title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                >
                  <Globe className={cn("w-4 h-4", lang === 'ar' ? "text-emerald-400" : "text-sky-400")} />
                  <span className="text-[9px] font-black ml-1 uppercase">{lang === 'en' ? 'AR' : 'EN'}</span>
                </button>
                <div className="w-[1px] h-4 bg-white/5 mx-1 self-center" />
                <button 
                  onClick={() => setActiveTab('clinical')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    activeTab === 'clinical' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Stethoscope className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('lab')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    activeTab === 'lab' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <FlaskConical className="w-4 h-4" />
                </button>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 py-8 px-5">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter leading-tight">
              {activeTab === 'clinical' ? t[lang].clinical : t[lang].lab}
            </h2>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wide leading-relaxed max-w-[280px]">
              {activeTab === 'clinical' ? t[lang].clinicalDesc : t[lang].labDesc}
            </p>
          </div>

          <div className="space-y-6">
            {activeTab === 'clinical' ? <ClinicalSupport lang={lang} /> : <DrugLab lang={lang} />}
          </div>
        </main>

        {/* Device Footer */}
        <footer className="py-12 px-6 border-t border-white/5 space-y-8 bg-slate-950/20">
          <div className="flex flex-col items-center gap-6">
            {/* Footer Logo */}
            <div className="bg-slate-900/80 p-2 rounded-2xl border border-white/5 w-16 h-16 flex items-center justify-center overflow-hidden shadow-2xl relative group">
               <img 
                 src="/attachments/logo.png" 
                 alt="ZIYA Logo" 
                 className="w-full h-full object-cover rounded-xl transition-opacity duration-300" 
                 onError={(e) => {
                   e.currentTarget.style.opacity = '0';
                   e.currentTarget.parentElement?.querySelector('.footer-logo-fallback')?.classList.remove('hidden');
                 }}
               />
               <div className="footer-logo-fallback hidden absolute inset-0 flex items-center justify-center">
                 <Activity className="w-8 h-8 text-sky-500/50" />
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">
                  {t[lang].developer}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-base font-black text-white uppercase tracking-tighter">Ahmed Elbaz</p>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <p className="text-sm font-bold text-sky-400 font-sans tracking-tight">أحمد الباز</p>
                </div>
              </div>

              <div className="w-12 h-[1px] bg-white/5" />

              <div className="flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 text-center">
                  {lang === 'ar' ? 'الكلية' : 'Faculty'}
                </p>
                <div className="flex flex-col items-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    {t[lang].university}
                  </p>
                  <p className="text-[8px] font-medium text-slate-500 uppercase tracking-[0.2em] text-center">
                    {t[lang].universityAr}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">
             <Activity className="w-3 h-3 text-sky-500/30" />
             <span className="flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-sky-500/20" />
               {t[lang].status}
             </span>
             <span className="mx-1 opacity-20">•</span>
             <span>{t[lang].version}</span>
          </div>
          <div className="mt-4 mx-auto w-24 h-1 bg-white/5 rounded-full" />
        </footer>
      </div>
    </div>
  );
}


