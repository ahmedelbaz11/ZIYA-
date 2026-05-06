import { useState } from "react";
import { motion } from "motion/react";
import { Search, FlaskConical, AlertTriangle, CheckCircle2, Info, ChevronRight, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export default function DrugAnalysis() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    drugName: "",
    bindingAffinity: 0.5,
    toxicity: 0.2,
    species: "cow",
    disease: "mastitis"
  });

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-400" />
            Parameter Configuration
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Target Compound Name</label>
              <input 
                type="text" 
                placeholder="e.g. Cloxacillin, Halicin, Novel-A1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                value={formData.drugName}
                onChange={(e) => setFormData({...formData, drugName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Target Species</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                  >
                    <option value="cow">Bovine (Cow)</option>
                    <option value="dog">Canine (Dog)</option>
                    <option value="cat">Feline (Cat)</option>
                    <option value="horse">Equine (Horse)</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Model Focus</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                    <option>Antibacterial Efficacy</option>
                    <option>Antiviral Response</option>
                    <option>Anti-inflammatory</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-200">Binding Affinity Prediction</label>
                  <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">{formData.bindingAffinity.toFixed(2)} Ki</span>
               </div>
               <input 
                  type="range" min="0" max="1" step="0.01"
                  className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  value={formData.bindingAffinity}
                  onChange={(e) => setFormData({...formData, bindingAffinity: parseFloat(e.target.value)})}
               />
               
               <div className="flex justify-between items-center pt-2">
                  <label className="text-sm font-medium text-slate-200">Estimated Cytotoxicity</label>
                  <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">{formData.toxicity.toFixed(2)} LD50</span>
               </div>
               <input 
                  type="range" min="0" max="1" step="0.01"
                  className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  value={formData.toxicity}
                  onChange={(e) => setFormData({...formData, toxicity: parseFloat(e.target.value)})}
               />
            </div>

            <button 
              onClick={analyze}
              disabled={loading || !formData.drugName}
              className="w-full py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  Run Virtual Screening
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-6 flex gap-4">
           <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
           <div className="text-sm text-sky-300 leading-relaxed">
             <p className="font-semibold mb-1">Methodology Note:</p>
             Our models utilize deep transfer learning from human pharmacogenomics datasets, fine-tuned on species-specific metabolic pathways for higher accuracy.
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {results ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 relative overflow-hidden">
               {/* Gauge Mockup */}
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium">Predicted Efficacy</h3>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black text-white">{results.efficacy}%</span>
                       <span className="text-sky-400 text-sm font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Validated
                       </span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold border",
                    results.risk === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    results.risk === 'Moderate Risk' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  )}>
                    {results.risk}
                  </div>
               </div>

               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${results.efficacy}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-500"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                     <p className="text-xs text-slate-500 mb-1 font-medium">Molecular Weight</p>
                     <p className="text-lg font-bold">{results.compound.mw} g/mol</p>
                  </div>
                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
                     <p className="text-xs text-slate-500 mb-1 font-medium">LogP (Lipophilicity)</p>
                     <p className="text-lg font-bold">{results.compound.logp}</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-amber-500" />
                 AI Insights & Warnings
               </h3>
               <p className="text-slate-300 leading-relaxed italic border-l-2 border-sky-500/50 pl-4">
                 "{results.insight}"
               </p>
               
               <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                     <span className="text-sm font-medium">H-Bond Donors</span>
                     <span className="font-mono text-sky-400">{results.compound.hDonor}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                     <span className="text-sm font-medium">H-Bond Acceptors</span>
                     <span className="font-mono text-sky-400">{results.compound.hAcceptor}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
             <div className="p-4 bg-slate-900 rounded-full mb-4">
                <FlaskConical className="w-12 h-12 text-slate-700" />
             </div>
             <h3 className="text-lg font-bold text-slate-400">Awaiting Prediction</h3>
             <p className="text-sm text-slate-500 max-w-xs mt-2">
               Configure your compound and parameters on the left to start the deep learning analysis.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
