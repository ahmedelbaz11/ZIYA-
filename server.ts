import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Knowledge Base ---
const drugInteractions: Record<string, any> = {
  "Enrofloxacin": {
    "Sucralfate": "Chelation: Sucralfate interferes with fluoroquinolone absorption. Separate dosing by at least 2 hours.",
    "Theophylline": "Enrofloxacin reduces metabolism of theophylline, increasing risk of methylxanthine toxicity.",
    "Iron": "Reduced absorption due to chelation."
  },
  "Penicillin": {
    "Oxytetracycline": "Antagonism: Bacteriostatic drugs like tetracyclines inhibit the action of bactericidal penicillins.",
    "Gentamicin": "Synergy: Often used together, but avoid mixing in the same syringe (inactivation)."
  },
  "Flunixin": {
    "Dexamethasone": "Severe risk of gastrointestinal ulceration and perforation when NSAIDs are combined with corticosteroids.",
    "Prednisolone": "Severe risk of GI distress.",
    "Furosemide": "Decreased diuretic effect and potential for renal compromise."
  },
  "Gentamicin": {
    "Furosemide": "Increased risk of ototoxicity and nephrotoxicity.",
    "Carprofen": "Increased risk of renal failure."
  },
  "Meloxicam": {
    "Aspirin": "Synergistic GI toxicity; highly contraindicated.",
    "Ketoprofen": "NSAID stacking leads to acute renal failure."
  }
};

const translations: Record<string, Record<string, string>> = {
  ar: {
    "Bacterial infection": "عدوى بكتيرية",
    "Viral": "فيروسي",
    "Bacterial": "بكتيري",
    "Metabolic": "تمثيل غذائي",
    "Respiratory": "تنفسي",
    "Parasitic": "طفيلي",
    "Protozoal": "أولي (بروتوزوا)",
    "Fungal": "فطري",
    "Musculoskeletal": "عضلي هيكلي",
    "Digestive": "هضمي",
    "Endocrine": "غدد صماء",
    "Public Health": "صحة عامة",
    "Symptomatic": "علاجي عرضي",
    "Beta-lactam": "بيتا-لاكتام",
    "3rd generation cephalosporin": "سيفالوسبورين جيل ثالث",
    "Tetracycline": "تيتراسايكلين",
    "Macrolide": "ماكروليد",
    "NSAIDs": "مضادات التهاب غير ستيرويدية",
    "udder swelling": "تورم الضرع",
    "milk changes": "تغيرات في اللبن",
    "pain": "ألم",
    "fever": "حمى",
    "decreased milk yield": "نقص إنتاج اللبن",
    "clotted milk": "لبن متجبن",
    "Dermatological": "جلدي",
    "Cardiovascular": "قلبي وعائي",
    "Drug Interaction Engine": "محرك التفاعلات الدوائية",
    "Cross-Species Analytics": "تحليلات عبر الفصائل",
    "Transfer Learning Insight": "رؤى نقل التعلم",
    "Add drug to check...": "أضف دواء للتحقق...",
    "No critical interactions detected among selected compounds.": "لم يتم اكتشاف تفاعلات حرجة بين المركبات المختارة.",
    "hot udder": "ضرع ساخن",
    "dehydration in cow": "جفاف في البقرة",
    "cough": "سعال",
    "nasal discharge": "إفرازات أنفية",
    "lethargy": "خمول",
    "rapid breathing": "تنفس سريع",
    "anorexia": "فقدان شهية",
    "sudden death": "موت مفاجئ",
    "bloody discharge": "إفرازات دموية",
    "abortion": "إجهاض",
    "skin nodules": "عقد جلدية",
    "blisters on mouth": "بثور في الفم",
    "lameness": "عرج",
    "jaundice": "صفراء",
    "vomiting": "قيء",
    "diarrhea": "إسهال",
    "seizures": "تشنجات",
    "anemia": "أنيميا (فقر دم)",
    "blood transfusion": "نقل دم",
    "Vaccination": "تحصين",
    "Biosecurity": "أمن حيوي",
    "Supportive therapy": "علاج تدعيمي",
    "mastitis": "التهاب الضرع",
    "anthrax": "الجمرة الخبيثة",
    "brucellosis": "البروسيلا",
    "foot_and_mouth": "الحمى القلاعية",
    "rabies": "السعار",
    "distemper": "مرض ديستمبر",
    "parvovirus": "فيروس بارفو",
    "toxoplasmosis": "مرض التوكسوبلازما (داء القطط)",
    "strangles": "مرض الخناق",
    "glanders": "الرعام",
    "tetanus": "التيتانوس",
    "coccidiosis": "الكوكسيديا",
    "newcastle_disease": "مرض نيوكاسل",
    "avian_influenza": "إنفلونزا الطيور",
    "SMILES Construction": "بناء سمايلز (SMILES)",
    "Molecular Interaction": "التفاعل الجزيئي",
    "Cell wall inhibition": "تثبيط جدار الخلية",
    "Protein synthesis inhibition": "تثبيط بناء البروتين",
    "No effective cure": "لا يوجد علاج فعال",
    "Fluid management": "إدارة السوائل",
    "Antibiotics": "مضادات حيوية"
  }
};

const translate = (text: string, lang: string): string => {
  if (lang !== 'ar') return text;
  return translations.ar[text] || text;
};

const knowledgeBase: Record<string, any> = {
  cow: {
    mastitis: {
      category: "Bacterial infection",
      isZoonotic: false,
      symptoms: ["udder swelling", "milk changes", "pain", "fever", "decreased milk yield", "clotted milk", "hot udder", "dehydration in cow"],
      pathogens: ["Staphylococcus aureus", "E. coli", "Streptococcus agalactiae"],
      treatments: {
        mild: { drug: "Cloxacillin", class: "Beta-lactam", mechanism: "Cell wall synthesis inhibition", alternatives: ["Penicillin G", "Amoxicillin", "Cephapirin"] },
        severe: { drug: "Ceftiofur", class: "3rd generation cephalosporin", mechanism: "Inhibits bacterial cell wall synthesis", alternatives: ["Florfenicol", "Marbofloxacin"] }
      }
    },
    bovine_respiratory_disease: {
      category: "Respiratory",
      isZoonotic: false,
      symptoms: ["cough", "fever", "nasal discharge", "lethargy", "rapid breathing", "anorexia", "drooping ears", "head pressing", "open mouth breathing"],
      pathogens: ["Mannheimia haemolytica", "Pasteurella multocida", "Histophilus somni"],
      treatments: {
        mild: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Florfenicol", "Tilmicosin"] },
        severe: { drug: "Tulathromycin", class: "Macrolide", mechanism: "50S ribosome inhibition", alternatives: ["Enrofloxacin", "Danofloxacin"] }
      }
    },
    anthrax: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["sudden death", "bloody discharge from orifices", "bloated carcass", "high fever", "trembling", "convulsions", "severe depression", "dark blood"],
      pathogens: ["Bacillus anthracis"],
      treatments: {
        severe: { drug: "Penicillin G", class: "Beta-lactam", mechanism: "Cell wall inhibition", alternatives: ["Oxytetracycline"] }
      }
    },
    brucellosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["abortion", "retained placenta", "arthritis", "reduced fertility", "testicular swelling", "joint swelling", "weak calves", "low milk production"],
      pathogens: ["Brucella abortus"],
      treatments: {
        severe: { drug: "No effective cure", class: "Eradication/Vaccination", mechanism: "Zoonotic risk management", alternatives: ["Culling recommended"] }
      }
    },
    lumpy_skin_disease: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["skin nodules", "fever", "enlarged lymph nodes", "loss of appetite", "nasal discharge", "salivation", "lacrimation (tears)", "oedema of limbs"],
      pathogens: ["Capripoxvirus"],
      treatments: {
        severe: { drug: "Supportive therapy", class: "Symptomatic", mechanism: "Management of secondary infections", alternatives: ["Antibiotics for skin lesions"] }
      }
    },
    foot_and_mouth: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["blisters on mouth", "blisters on feet", "fever", "lameness", "drooling", "smacking lips", "blisters on teats", "shivering during grazing"],
      pathogens: ["FMD Virus"],
      treatments: {
        severe: { drug: "Antiseptics", class: "Topical", mechanism: "Prevent secondary infection", alternatives: ["Iodine", "Potassium Permanganate"] }
      }
    },
    rift_valley_fever: {
      category: "Viral",
      isZoonotic: true,
      symptoms: ["abortion storms", "sudden death in calves", "bloody diarrhea", "jaundice", "nasal discharge", "high fever", "vomiting in small ruminants"],
      pathogens: ["RVF Virus (Phlebovirus)"],
      treatments: {
        severe: { drug: "Supportive care", class: "Symptomatic", mechanism: "Fluid management + control of hemorrhages", alternatives: ["Vaccination in non-outbreak times"] }
      }
    },
    milk_fever: {
      category: "Metabolic",
      isZoonotic: false,
      symptoms: ["muscle tremors", "inability to stand", "cool extremities", "low body temperature", "S-shaped curve in neck", "constipation", "depression"],
      pathogens: ["Hypocalcemia"],
      treatments: {
        severe: { drug: "Calcium Borogluconate", class: "Mineral Supplement", mechanism: "Rapid restoration of serum calcium", alternatives: ["Oral calcium gels"] }
      }
    },
    bovine_viral_diarrhea: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["diarrhea", "fever", "mouth ulcers", "nasal discharge", "abortion", "stunting", "respiratory distress in cow"],
      pathogens: ["BVDV (Pestivirus)"],
      treatments: {
        severe: { drug: "Supportive therapy", class: "Symptomatic", mechanism: "Rehydration + prevention of secondary pneumonia", alternatives: ["Vaccination is primary control"] }
      }
    },
    blackleg: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["sudden death", "lameness", "swelling of muscles", "crepitus (gas in tissue)", "high fever", "prostration", "darkening of skin"],
      pathogens: ["Clostridium chauvoei"],
      treatments: {
        severe: { drug: "Penicillin G (Early stages)", class: "Beta-lactam", mechanism: "Bactericidal against clostridia", alternatives: ["Vaccination is critical"] }
      }
    },
    tuberculosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["chronic cough", "emaciation", "low-grade fever", "enlarged lymph nodes", "lethargy", "decreased milk yield", "dyspnea"],
      pathogens: ["Mycobacterium bovis"],
      treatments: {
        severe: { drug: "Eradication Policy", class: "Public Health", mechanism: "Control through testing and culling", alternatives: ["Biosecurity"] }
      }
    },
    leptospirosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["abortion", "milk drop (flabby bag)", "fever", "jaundice", "bloody urine", "anemia", "infertility"],
      pathogens: ["Leptospira Hardjo", "Leptospira Pomona"],
      treatments: {
        mild: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Procaine Penicillin"] }
      }
    },
    q_fever: {
      category: "Bacterial (Rickettsial)",
      isZoonotic: true,
      symptoms: ["abortion", "stillbirth", "weak calves", "mild respiratory signs", "anorexia"],
      pathogens: ["Coxiella burnetii"],
      treatments: {
        mild: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Inhibits bacterial growth", alternatives: ["Biosecurity priority"] }
      }
    },
    johne_disease: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["chronic diarrhea", "progressive weight loss", "bottle jaw (edema)", "normal appetite despite wasting", "decreased production"],
      pathogens: ["Mycobacterium avium subsp. paratuberculosis"],
      treatments: {
        severe: { drug: "No treatment", class: "Management", mechanism: "Culling and preventive hygiene", alternatives: ["Calf isolation"] }
      }
    },
    ketosis: {
      category: "Metabolic",
      isZoonotic: false,
      symptoms: ["acetone breath smell", "loss of appetite", "drop in milk", "lethargy", "nervous signs (licking, circling)", "weight loss"],
      pathogens: ["Negative energy balance"],
      treatments: {
        mild: { drug: "Propylene Glycol", class: "Glucogenic precursor", mechanism: "Provides energy source", alternatives: ["Dextrose IV"] }
      }
    },
    bloat: {
      category: "Digestive",
      isZoonotic: false,
      symptoms: ["distended left flank", "respiratory distress", "anxiety", "protruding tongue", "collapse", "frequent urination"],
      pathogens: ["Rumen fermentation gases"],
      treatments: {
        severe: { drug: "Poloxalene / Oil", class: "Anti-foaming agent", mechanism: "Breaks down froth in rumen", alternatives: ["Trocar and cannula"] }
      }
    },
    anaplasmosis: {
      category: "Rickettsial (Tick-borne)",
      isZoonotic: false,
      symptoms: ["anemia", "pale gums", "jaundice", "fever", "aggressive behavior (hypoxia)", "exhaustion", "dark yellow urine"],
      pathogens: ["Anaplasma marginale"],
      treatments: {
        severe: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Eliminates intracellular organisms", alternatives: ["Blood transfusion"] }
      }
    }
  },
  dog: {
    parvovirus: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["vomiting", "diarrhea", "dehydration", "bloody stool", "loss of appetite", "prostration", "severe lethargy", "foul-smelling stool", "hypothermia"],
      pathogens: ["Canine parvovirus"],
      treatments: {
        severe: { drug: "IV Fluids + Maropitant", class: "Supportive", mechanism: "Fluid balance + Antiemetic", alternatives: ["Amoxicillin-Clavulanate"] }
      }
    },
    kennel_cough: {
      category: "Respiratory",
      isZoonotic: false,
      symptoms: ["hacking cough", "sneezing", "runny nose", "eye discharge", "retching", "gagging", "honking cough", "nasal congestion"],
      pathogens: ["Bordetella bronchiseptica", "Parainfluenza"],
      treatments: {
        mild: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Amoxicillin-Clavulanate", "Azithromycin", "Cough suppressants"] }
      }
    },
    distemper: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["fever", "nasal discharge", "thickening of paw pads", "seizures", "muscle twitches", "pus-like eye discharge", "hyperkeratosis of nose", "diarrhea in dog", "lack of coordination"],
      pathogens: ["CDV (Paramyxovirus)"],
      treatments: {
        severe: { drug: "Supportive care", class: "Multifactorial", mechanism: "Neuro-protection + secondary infection control", alternatives: ["Phenobarbital for seizures"] }
      }
    },
    babesiosis: {
      category: "Parasitic (Tick-borne)",
      isZoonotic: false,
      symptoms: ["pale gums", "dark urine", "jaundice", "fever", "depression", "lymph node swelling", "splenomegaly", "anaemia (weakness)", "panting"],
      pathogens: ["Babesia canis", "Babesia gibsoni"],
      treatments: {
        severe: { drug: "Imidocarb dipropionate", class: "Protozoacide", mechanism: "Interferes with DNA synthesis of parasite", alternatives: ["Diminazene aceturate", "Atovaquone + Azithromycin"] }
      }
    },
    leptospirosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["muscle tenderness", "shivering", "increased thirst", "kidney failure", "jaundice", "vomiting", "stiff gait", "frequent urination", "abdominal pain"],
      pathogens: ["Leptospira interrogans"],
      treatments: {
        severe: { drug: "Penicillin G then Doxycycline", class: "Beta-lactam/Tetracycline", mechanism: "Elimination of leptospiraemia + carrier state", alternatives: ["Ampicillin"] }
      }
    },
    rabies: {
      category: "Viral",
      isZoonotic: true,
      symptoms: ["furious behavior", "hydrophobia", "excessive salivation", "paralysis", "change in bark", "unrestricted aggression", "difficulty swallowing", "seizures in dog"],
      pathogens: ["Lyssavirus"],
      treatments: {
        severe: { drug: "No treatment", class: "Fatality 100%", mechanism: "Zoonotic management", alternatives: ["Pre-exposure vaccination"] }
      }
    },
    heartworm_disease: {
      category: "Parasitic",
      isZoonotic: false,
      symptoms: ["mild persistent cough", "reluctance to exercise", "fatigue after moderate activity", "decreased appetite", "weight loss", "distended abdomen (late stage)", "heart failure signs"],
      pathogens: ["Dirofilaria immitis"],
      treatments: {
        severe: { drug: "Melarsomine dihydrochloride", class: "Arsenical", mechanism: "Adulticide (kills adult worms)", alternatives: ["Ivermectin for microfilaria"] }
      }
    },
    lyme_disease: {
      category: "Bacterial (Tick-borne)",
      isZoonotic: false,
      symptoms: ["shifting-leg lameness", "swollen joints", "fever", "anorexia", "lethargy", "lymph node swelling", "kidney issues in chronic cases"],
      pathogens: ["Borrelia burgdorferi"],
      treatments: {
        mild: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Amoxicillin", "Cefovecin"] }
      }
    },
    ehrlichiosis: {
      category: "Rickettsial (Tick-borne)",
      isZoonotic: false,
      symptoms: ["fever", "lethargy", "loss of appetite", "bleeding tendencies (nosebleeds)", "swollen lymph nodes", "stiff joints", "pale gums"],
      pathogens: ["Ehrlichia canis"],
      treatments: {
        mild: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Imidocarb"] }
      }
    },
    giardiasis: {
      category: "Protozoal",
      isZoonotic: true,
      symptoms: ["diarrhea (greasy, soft)", "dehydration", "weight loss", "vomiting", "flatulence", "poor coat"],
      pathogens: ["Giardia duodenalis"],
      treatments: {
        mild: { drug: "Fenbendazole", class: "Anthelmintic", mechanism: "Interferes with glucose uptake", alternatives: ["Metronidazole"] }
      }
    },
    campylobacteriosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["watery/bloody diarrhea", "abdominal cramping", "fever", "lethargy", "straining to defecate"],
      pathogens: ["Campylobacter jejuni"],
      treatments: {
        mild: { drug: "Erythromycin", class: "Macrolide", mechanism: "Protein synthesis inhibition", alternatives: ["Azithromycin"] }
      }
    },
    toxocariasis: {
      category: "Parasitic (Nematode)",
      isZoonotic: true,
      symptoms: ["pot-bellied appearance", "diarrhea", "vomiting", "dull coat", "worms in stool/vomitus", "stunted growth"],
      pathogens: ["Toxocara canis"],
      treatments: {
        mild: { drug: "Pyrantel Pamoate", class: "Anthelmintic", mechanism: "Neuromuscular blocker", alternatives: ["Milbemycin oxime", "Moxidectin"] }
      }
    },
    adenovirus_hepatitis: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["fever", "abdominal pain", "vomiting", "jaundice", "blue eye (corneal edema)", "bleeding disorders", "depression"],
      pathogens: ["Canine Adenovirus 1"],
      treatments: {
        severe: { drug: "Supportive care", class: "Multifactorial", mechanism: "Fluid support + Liver protection", alternatives: ["Broad-spectrum antibiotics"] }
      }
    },
    cryptosporidiosis: {
      category: "Protozoal",
      isZoonotic: true,
      symptoms: ["watery diarrhea", "weight loss", "abdominal pain", "anorexia", "lethargy"],
      pathogens: ["Cryptosporidium canis"],
      treatments: {
        mild: { drug: "Nitazoxanide", class: "Antiprotozoal", mechanism: "Interferes with metabolism", alternatives: ["Tylosin"] }
      }
    },
    pyometra: {
      category: "Reproductive / Bacterial",
      isZoonotic: false,
      symptoms: ["vaginal discharge", "excessive thirst (PU/PD)", "lethargy", "anorexia", "distended abdomen", "fever", "vomiting"],
      pathogens: ["E. coli (most common)"],
      treatments: {
        severe: { drug: "Ovariohysterectomy", class: "Surgical", mechanism: "Removal of infected uterus", alternatives: ["Prostaglandin + Antibiotics (non-recommended)"] }
      }
    }
  },
  cat: {
    panleukopenia: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["fever", "vomiting", "bloody diarrhea", "dehydration", "lethargy", "hiding", "hanging chin over water bowl", "tucked-up abdomen"],
      pathogens: ["Feline Parvovirus"],
      treatments: {
        severe: { drug: "Intravenous fluids", class: "Supportive", mechanism: "Hemodynamic stability", alternatives: ["Broad-spectrum antibiotics"] }
      }
    },
    feline_flu: {
      category: "Viral/Bacterial",
      isZoonotic: false,
      symptoms: ["sneezing", "mouth ulcers", "nasal discharge", "conjunctivitis", "drooling", "squinting", "hoarseness", "loss of smell"],
      pathogens: ["Calicivirus", "Herpesvirus"],
      treatments: {
        mild: { drug: "Lysine + Eye drops", class: "Viral support", mechanism: "Inhibit replication + topical relief", alternatives: ["Doxycycline"] }
      }
    },
    fip_feline_infectious_peritonitis: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["distended abdomen (wet)", "difficulty breathing", "weight loss", "fever", "neurological signs", "cloudy eyes", "stunted growth", "persistent fever"],
      pathogens: ["Feline Coronavirus (Mutated)"],
      treatments: {
        severe: { drug: "GS-441524 (Experimental)", class: "Antiviral", mechanism: "RNA polymerase inhibitor", alternatives: ["Prednisolone for palliation"] }
      }
    },
    feline_immunodeficiency_virus: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["poor coat condition", "persistent fever", "gingivitis", "stomatitis", "chronic skin infections", "recurrent respiratory infection", "weight loss in cat"],
      pathogens: ["FIV (Lentivirus)"],
      treatments: {
        severe: { drug: "Zidovudine (AZT)", class: "Antiviral", mechanism: "Reverse transcriptase inhibitor", alternatives: ["Supportive care + immune stimulants"] }
      }
    },
    feline_leukemia_virus: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["pale gums", "yellow color in mouth/eyes", "enlarged lymph nodes", "bladder/respiratory infections", "weight loss", "poor coat", "persistent diarrhea"],
      pathogens: ["FeLV (Retrovirus)"],
      treatments: {
        severe: { drug: "Interferon-omega", class: "Immunomodulator", mechanism: "Antiviral and immune stimulating", alternatives: ["Zidovudine", "Supportive care"] }
      }
    },
    toxoplasmosis: {
      category: "Protozoal",
      isZoonotic: true,
      symptoms: ["fever", "loss of appetite", "lethargy", "eye inflammation (uveitis)", "difficulty breathing", "jaundice", "neurological signs"],
      pathogens: ["Toxoplasma gondii"],
      treatments: {
        mild: { drug: "Clindamycin", class: "Lincosamide", mechanism: "Protein synthesis inhibition", alternatives: ["Pyrimethamine + Sulfadiazine"] }
      }
    },
    bartonellosis_cat_scratch: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["fever", "lymph node swelling", "gingivitis", "lethargy", "uveitis", "endocarditis signs"],
      pathogens: ["Bartonella henselae"],
      treatments: {
        mild: { drug: "Azithromycin", class: "Macrolide", mechanism: "Protein synthesis inhibition", alternatives: ["Doxycycline", "Rifampin"] }
      }
    },
    cryptococcosis: {
      category: "Fungal",
      isZoonotic: true,
      symptoms: ["roman nose (facial swelling)", "nasal discharge", "sneezing", "skin lesions", "eye disturbances", "seizures"],
      pathogens: ["Cryptococcus neoformans"],
      treatments: {
        severe: { drug: "Fluconazole", class: "Azole Antifungal", mechanism: "Inhibits ergosterol synthesis", alternatives: ["Itraconazole", "Amphotericin B"] }
      }
    },
    ringworm: {
      category: "Fungal",
      isZoonotic: true,
      symptoms: ["patchy hair loss", "crusty skin", "circular lesions", "broken hairs", "minimal itching"],
      pathogens: ["Microsporum canis"],
      treatments: {
        mild: { drug: "Itraconazole", class: "Azole Antifungal", mechanism: "Inhibits fungal cell membrane", alternatives: ["Griseofulvin", "Lime Sulfur dip"] }
      }
    },
    feline_chlamydiosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["conjunctivitis", "sneezing", "nasal discharge", "watery eyes", "chemosis (swollen eyelids)"],
      pathogens: ["Chlamydia felis"],
      treatments: {
        mild: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["Azithromycin"] }
      }
    },
    hemobartonellosis: {
      category: "Bacterial (Mycoplasmal)",
      isZoonotic: false,
      symptoms: ["lethargy", "pale gums", "fever", "jaundice", "accelerated heartbeat", "anorexia"],
      pathogens: ["Mycoplasma haemofelis"],
      treatments: {
        mild: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Combats bacterial blood parasites", alternatives: ["Prednisolone"] }
      }
    },
    hepatic_lipidosis: {
      category: "Metabolic (Fatty Liver)",
      isZoonotic: false,
      symptoms: ["jaundice", "rapid weight loss", "anorexia", "vomiting", "drooling", "lethargy"],
      pathogens: ["Fat accumulation in liver due to starvation"],
      treatments: {
        severe: { drug: "Aggressive feeding via tube", class: "Nutritional", mechanism: "Reverse lipid accumulation", alternatives: ["Anti-emetics", "Liver support"] }
      }
    },
    sporotrichosis: {
      category: "Fungal",
      isZoonotic: true,
      symptoms: ["skin ulcers that don't heal", "swollen lymph nodes", "nasal discharge", "respiratory distress in severe cases"],
      pathogens: ["Sporothrix schenckii"],
      treatments: {
        severe: { drug: "Itraconazole", class: "Azole Antifungal", mechanism: "Cell wall inhibitor", alternatives: ["Potassium Iodide"] }
      }
    },
    feline_calicivirus: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["mouth ulcers", "sneezing", "nasal discharge", "limping (shifting-leg lameness)", "fever", "conjunctivitis"],
      pathogens: ["FCV"],
      treatments: {
        mild: { drug: "Supportive care", class: "Symptomatic", mechanism: "Pain relief + hydration", alternatives: ["Antibiotics for secondary infection"] }
      }
    },
    feline_asthma: {
      category: "Respiratory",
      isZoonotic: false,
      symptoms: ["coughing (resembling hairball attempt)", "wheezing", "labored breathing", "open-mouth breathing", "lethargy"],
      pathogens: ["Allergens"],
      treatments: {
        severe: { drug: "Fluticasone / Prednisolone", class: "Corticosteroid", mechanism: "Reduces airway inflammation", alternatives: ["Albuterol inhaler"] }
      }
    }
  },
  horse: {
    strangles: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["nasal discharge", "swollen lymph nodes", "fever", "difficulty swallowing", "extended neck", "abscesses under jaw", "loss of condition", "reluctance to move head"],
      pathogens: ["Streptococcus equi"],
      treatments: {
        severe: { drug: "Penicillin G", class: "Beta-lactam", mechanism: "Cell wall inhibitor", alternatives: ["Ceftiofur", "Trimethoprim-Sulfamethoxazole"] }
      }
    },
    equine_influenza: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["dry cough", "fever", "muscle soreness", "loss of appetite", "weakness", "nasal discharge (watery)", "depression in horse"],
      pathogens: ["Equine Influenza Virus"],
      treatments: {
        mild: { drug: "NSAIDs (Phenylbutazone)", class: "Anti-inflammatory", mechanism: "COX inhibition", alternatives: ["Fluid support"] }
      }
    },
    glanders: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["nodules/ulcers on skin", "nasal nodules", "high fever", "swollen lymphatics", "weight loss", "star-shaped scars in nose", "chronic cough"],
      pathogens: ["Burkholderia mallei"],
      treatments: {
        severe: { drug: "No treatment", class: "Eradication", mechanism: "Highly contagious zoonosis", alternatives: ["Culling/Strict Quarantine"] }
      }
    },
    tetanus: {
      category: "Bacterial (Toxin)",
      isZoonotic: false,
      symptoms: ["stiff gait", "sawhorse stance", "lockjaw", "flared nostrils", "erect ears", "prolapse of third eyelid", "extreme sensitivity to sound"],
      pathogens: ["Clostridium tetani"],
      treatments: {
        severe: { drug: "Tetanus Antitoxin + Penicillin", class: "Antitoxin/Antibiotic", mechanism: "Neutralize unbound toxin + eliminate bacteria", alternatives: ["Sedatives for muscle spasms"] }
      }
    },
    west_nile_virus: {
      category: "Viral (Vectored)",
      isZoonotic: false,
      symptoms: ["muscle tremors", "facial twitching", "stumbling (ataxia)", "weakness in hind limbs", "fever", "partial paralysis", "inability to stand"],
      pathogens: ["WNV (Flavivirus)"],
      treatments: {
        severe: { drug: "Supportive IV fluids", class: "Symptomatic", mechanism: "Maintain hydration + reduce brain edema", alternatives: ["DMSO/Dexamethasone for swelling"] }
      }
    },
    equine_infectious_anemia: {
      category: "Viral (Vectored)",
      isZoonotic: false,
      symptoms: ["recurrent fever", "anemia", "weight loss", "edema (swelling) of chest/legs", "weakness", "pale gums"],
      pathogens: ["EIAV (Lentivirus)"],
      treatments: {
        severe: { drug: "No treatment", class: "Regulatory", mechanism: "Coggins test positive requires isolation/euthanasia", alternatives: ["Life-long quarantine"] }
      }
    },
    epm_equine_protozoal_myeloencephalitis: {
      category: "Protozoal",
      isZoonotic: false,
      symptoms: ["asymmetric muscle wasting", "ataxia (lack of coordination)", "tripping", "difficulty swallowing", "facial paralysis"],
      pathogens: ["Sarcocystis neurona"],
      treatments: {
        severe: { drug: "Ponazuril", class: "Antiprotozoal", mechanism: "Crosses BBB to kill parasites", alternatives: ["Diclazuril", "Sulfadiazine + Pyrimethamine"] }
      }
    },
    hendra_virus: {
      category: "Viral",
      isZoonotic: true,
      symptoms: ["sudden death", "high fever", "frothy nasal discharge", "rapid heart rate", "respiratory distress", "neurological twitching"],
      pathogens: ["Hendra Virus"],
      treatments: {
        severe: { drug: "Euthanasia", class: "Extreme Risk", mechanism: "High zoonotic fatality rate", alternatives: ["Bio-containment"] }
      }
    },
    rhodococcus_equi_pneumonia: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["cough", "fever", "labored breathing", "abscesses in lungs", "lethargy", "joint swelling (occasionally)"],
      pathogens: ["Rhodococcus equi"],
      treatments: {
        severe: { drug: "Clarithromycin + Rifampin", class: "Macrolide/Rifamycin", mechanism: "Intracellular bacterial killing", alternatives: ["Azithromycin"] }
      }
    },
    equine_herpesvirus: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["fever", "nasal discharge", "abortion in mares", "hind limb weakness", "inability to urinate", "leaning against walls"],
      pathogens: ["EHV-1 / EHV-4"],
      treatments: {
        severe: { drug: "Valacyclovir", class: "Antiviral", mechanism: "Inhibits viral DNA polymerase", alternatives: ["Supportive care"] }
      }
    },
    potomac_horse_fever: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["watery diarrhea", "fever", "laminitis (founder)", "anorexia", "colic signs"],
      pathogens: ["Neorickettsia risticii"],
      treatments: {
        severe: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Protein synthesis inhibition", alternatives: ["NSAIDs for laminitis"] }
      }
    },
    cushing_disease_ppid: {
      category: "Endocrine",
      isZoonotic: false,
      symptoms: ["long curly coat (hirsutism)", "sweating", "muscle wasting", "fat deposits over eyes", "laminitis", "frequent urination"],
      pathogens: ["Pituitary Pars Intermedia Dysfunction"],
      treatments: {
        mild: { drug: "Pergolide", class: "Dopamine agonist", mechanism: "Suppresses pituitary hormone release", alternatives: ["Dietary management"] }
      }
    },
    laminitis: {
      category: "Musculoskeletal",
      isZoonotic: false,
      symptoms: ["shifting weight constantly", "heat in hooves", "rocking back on heels", "reluctance to walk", "increased digital pulse"],
      pathogens: ["Multifactorial (Dietary/Metabolic/Toxic)"],
      treatments: {
        severe: { drug: "Flunixin Meglumine (Banamine)", class: "NSAID", mechanism: "Anti-inflammatory and pain relief", alternatives: ["Icing feet", "Specialized shoeing"] }
      }
    },
    colic: {
      category: "Digestive",
      isZoonotic: false,
      symptoms: ["pawing at ground", "looking at flanks", "rolling", "sweating", "absence of gut sounds", "lying down and getting up frequently"],
      pathogens: ["Gas / Impaction / Torsion"],
      treatments: {
        severe: { drug: "Surgery / Mineral Oil", class: "Emergency", mechanism: "Resolution of physical obstruction", alternatives: ["Banamine", "Buscopan"] }
      }
    },
    equine_encephalomyelitis: {
      category: "Viral (Vectored)",
      isZoonotic: true,
      symptoms: ["fever", "wandering", "blindness", "head pressing", "ataxia", "seizures", "death within days"],
      pathogens: ["EEE / WEE / VEE Viruses"],
      treatments: {
        severe: { drug: "Supportive care", class: "Symptomatic", mechanism: "Fluid balance + anti-inflammatories", alternatives: ["Vaccination (Prevention)"] }
      }
    }
  },
  sheep: {
    foot_rot: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["lameness", "foul smell from hooves", "tissue decay", "maggot risk", "grazing on knees", "separation of hoof horn", "moist skin between toes"],
      pathogens: ["Dichelobacter nodosus", "Fusobacterium necrophorum"],
      treatments: {
        mild: { drug: "Zinc Sulfate Bath", class: "Topical", mechanism: "Bactericidal + Tissue hardening", alternatives: ["Oxytetracycline spray"] }
      }
    },
    peste_des_petits_ruminants_ppr: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["nasal/eye discharge", "sores in mouth", "diarrhea", "difficulty breathing", "high fever", "pneumonia", "crusty nose", "fetid breath"],
      pathogens: ["PPR Virus"],
      treatments: {
        severe: { drug: "Supportive care", class: "Symptomatic", mechanism: "Prevention of secondary bacterial pneumonia", alternatives: ["Broad-spectrum antibiotics"] }
      }
    },
    bluetongue: {
      category: "Viral (Vectored)",
      isZoonotic: false,
      symptoms: ["swelling of lips/tongue", "bluish tongue", "lameness", "fever", "nasal discharge", "ulcers in mouth", "coronitis (foot redness)", "excessive salivation in sheep"],
      pathogens: ["Bluetongue Virus"],
      treatments: {
        severe: { drug: "Supportive + NSAIDs", class: "Symptomatic", mechanism: "Pain relief + reduce inflammation", alternatives: ["Protection from culicoides (vectors)"] }
      }
    },
    scrapie: {
      category: "Prion",
      isZoonotic: false,
      symptoms: ["compulsive scraping/itching", "walking with swaying motion", "weight loss despite good appetite", "biting at feet/legs", "trembling", "hyperexcitability"],
      pathogens: ["Prion"],
      treatments: {
        severe: { drug: "No treatment", class: "Fatal", mechanism: "Degenerative neurological disease", alternatives: ["Genetic selection for resistance"] }
      }
    },
    contagious_ecthyma_orf: {
      category: "Viral",
      isZoonotic: true,
      symptoms: ["scabs around mouth/nose", "sores on teats", "reluctance to eat", "lameness (if on feet)", "crusty lesions"],
      pathogens: ["Orf Virus (Parapoxvirus)"],
      treatments: {
        mild: { drug: "Topical Antiseptics", class: "Supportive", mechanism: "Prevent secondary infection", alternatives: ["Soft feed for mouth sores"] }
      }
    },
    listeriosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["circling", "facial paralysis (one-sided)", "drooling", "drooping ear", "fever", "abortion", "head tilt"],
      pathogens: ["Listeria monocytogenes"],
      treatments: {
        severe: { drug: "Penicillin G", class: "Beta-lactam", mechanism: "High-dose bactericidal effect", alternatives: ["Oxytetracycline"] }
      }
    },
    caseous_lymphadenitis: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["abscesses in lymph nodes", "thick cheesy pus", "weight loss (thin ewe syndrome)", "chronic cough (if lungs affected)"],
      pathogens: ["Corynebacterium pseudotuberculosis"],
      treatments: {
        mild: { drug: "Lancing + Iodine", class: "Surgical/Topical", mechanism: "Drainage + disinfection", alternatives: ["Tulathromycin injection"] }
      }
    },
    pregnancy_toxemia: {
      category: "Metabolic",
      isZoonotic: false,
      symptoms: ["separation from flock", "weakness", "blindness", "sweet-smelling breath", "tremors", "coma in late pregnancy"],
      pathogens: ["Negative energy balance"],
      treatments: {
        severe: { drug: "Propylene Glycol / Dextrose", class: "Glucogenic", mechanism: "Provides immediate glucose", alternatives: ["Emergency C-section"] }
      }
    },
    enterotoxemia_overeating: {
      category: "Bacterial (Toxin)",
      isZoonotic: false,
      symptoms: ["sudden death", "convulsions", "frothing at mouth", "abdominal pain", "diarrhea", "neurological twitching"],
      pathogens: ["Clostridium perfringens Type D"],
      treatments: {
        severe: { drug: "C&D Antitoxin", class: "Antitoxin", mechanism: "Neutralize circulating toxins", alternatives: ["Oral Penicillin"] }
      }
    },
    clove_rot_foot: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["lameness", "foul smell", "separation of hoof horn", "inflammation of interdigital skin"],
      pathogens: ["Dichelobacter nodosus"],
      treatments: {
        mild: { drug: "Foot bath (Zinc Sulfate)", class: "Antiseptic", mechanism: "Bactericidal", alternatives: ["Oxytetracycline spray"] }
      }
    },
    ovine_progressive_pneumonia: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["gradual weight loss", "labored breathing", "hard udder (no milk)", "arthritis (joint swelling)", "weakness"],
      pathogens: ["OPPV (Lentivirus)"],
      treatments: {
        severe: { drug: "No treatment", class: "Management", mechanism: "Test and cull program", alternatives: ["Good nutrition"] }
      }
    },
    white_muscle_disease: {
      category: "Nutritional",
      isZoonotic: false,
      symptoms: ["stiff gait", "inability to stand", "heart failure signs", "difficulty breathing", "weak muscles"],
      pathogens: ["Selenium / Vitamin E deficiency"],
      treatments: {
        mild: { drug: "Selenium + Vitamin E Injectable", class: "Supplement", mechanism: "Replenishes essential nutrients", alternatives: ["Oral supplements"] }
      }
    },
    salmonellosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["bloody diarrhea", "fever", "abortion storms", "dehydration", "lethargy", "sudden death"],
      pathogens: ["Salmonella Typhimurium / Dublin"],
      treatments: {
        severe: { drug: "Fluids + Antibiotics (Ceftiofur)", class: "Supportive/Antimicrobial", mechanism: "Combat septicemia + hydration", alternatives: ["Trimethoprim-Sulfa"] }
      }
    },
    ovine_chlamydiosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["abortion (late term)", "stillbirths", "weak lambs", "vaginal discharge"],
      pathogens: ["Chlamydia abortus"],
      treatments: {
        mild: { drug: "Oxytetracycline", class: "Tetracycline", mechanism: "Prevents further abortions in flock", alternatives: ["Vaccination (Enzootic Abortion)"] }
      }
    }
  },
  poultry: {
    newcastle_disease: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["gasping", "twisting neck", "greenish diarrhea", "drop in egg production", "sudden death", "paralysis of wings", "facial swelling", "soft-shell eggs"],
      pathogens: ["Newcastle Disease Virus"],
      treatments: {
        severe: { drug: "Immune support", class: "Supportive", mechanism: "No cure; focus on biosecurity", alternatives: ["Emergency vaccination"] }
      }
    },
    coccidiosis: {
      category: "Parasitic",
      isZoonotic: false,
      symptoms: ["bloody droppings", "weight loss", "ruffled feathers", "huddled posture", "anemia", "pale comb", "watery diarrhea", "sluggishness"],
      pathogens: ["Eimeria species"],
      treatments: {
        mild: { drug: "Amprolium", class: "Coccidiostat", mechanism: "Thiamine antagonist", alternatives: ["Toltrazuril"] }
      }
    },
    avian_influenza: {
      category: "Viral",
      isZoonotic: true,
      symptoms: ["facial swelling", "blue comb/wattles", "nasal discharge", "sudden death", "decreased egg production", "haemorrhages on legs", "neurological signs in birds"],
      pathogens: ["H5N1 / H7N9 Virus"],
      treatments: {
        severe: { drug: "Biosecurity Only", class: "Eradication", mechanism: "Public health risk management", alternatives: ["Mass culling required"] }
      }
    },
    marek_disease: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["leg paralysis", "floppy neck", "blindness (grey eye)", "tumors in organs", "weight loss despite eating", "enlarged feather follicles", "labored breathing"],
      pathogens: ["Marek's Disease Virus (Herpesvirus)"],
      treatments: {
        severe: { drug: "Prevention via vaccination", class: "Vaccination", mechanism: "Vaccinate in ovo or day 0", alternatives: ["No effective treatment once clinical"] }
      }
    },
    infectious_bursal_disease: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["watery diarrhea", "ruffled feathers", "vent picking", "trembling", "prostration", "depression", "high mortality in young birds"],
      pathogens: ["IBDV (Birnavirus)"],
      treatments: {
        severe: { drug: "Supportive + Electrolytes", class: "Symptomatic", mechanism: "Maintain hydration + manage immunosuppression", alternatives: ["Antibiotics for secondary infection"] }
      }
    },
    fowl_pox: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["scabs on comb/wattles (dry)", "yellow lesions in mouth (wet/diphtheritic)", "difficulty breathing", "drop in egg production"],
      pathogens: ["Avipoxvirus"],
      treatments: {
        mild: { drug: "Supportive care", class: "Symptomatic", mechanism: "Prevent secondary infection of scabs", alternatives: ["Cleaning lesions with iodine"] }
      }
    },
    infectious_bronchitis: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["sneezing", "coughing", "misshapen eggs", "watery egg whites", "facial swelling", "labored breathing"],
      pathogens: ["IBV (Coronavirus)"],
      treatments: {
        mild: { drug: "Heat + Electrolytes", class: "Supportive", mechanism: "Reduce stress on kidneys/respiratory tract", alternatives: ["Tylosin for secondary infection"] }
      }
    },
    mycoplasmosis_crv: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["swollen sinuses", "eye discharge", "sneezing", "rattling breath (rales)", "drop in egg production"],
      pathogens: ["Mycoplasma gallisepticum"],
      treatments: {
        mild: { drug: "Tylosin", class: "Macrolide", mechanism: "Protein synthesis inhibition", alternatives: ["Enrofloxacin", "Tetracycline"] }
      }
    },
    fowl_cholera: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["sudden death", "greenish diarrhea", "swollen wattles", "joint pain", "difficulty breathing", "nasal discharge"],
      pathogens: ["Pasteurella multocida"],
      treatments: {
        severe: { drug: "Sulfadimethoxine", class: "Sulfonamide", mechanism: "Inhibits folic acid synthesis", alternatives: ["Penicillin", "Tetracycline"] }
      }
    },
    psittacosis: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["shivering", "lethargy", "greenish-yellow droppings", "nasal/eye discharge", "weight loss", "labored breathing"],
      pathogens: ["Chlamydia psittaci"],
      treatments: {
        severe: { drug: "Doxycycline", class: "Tetracycline", mechanism: "Long-term treatment to clear bacteria", alternatives: ["Chlortetracycline"] }
      }
    },
    pullorum_disease: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["white diarrhea", "huddled chicks", "labored breathing", "blindness", "swollen joints", "high mortality in chicks"],
      pathogens: ["Salmonella Pullorum"],
      treatments: {
        severe: { drug: "Elimination of carriers", class: "Regulatory", mechanism: "Testing and culling", alternatives: ["Furaltadone (where legal)"] }
      }
    },
    coryza: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["foul-smelling nasal discharge", "swollen face/eyes", "sneezing", "sticky eyelids", "drop in feed intake"],
      pathogens: ["Avibacterium paragallinarum"],
      treatments: {
        mild: { drug: "Sulfathiazole", class: "Sulfonamide", mechanism: "Folic acid inhibitor", alternatives: ["Erythromycin"] }
      }
    },
    histomoniasis_blackhead: {
      category: "Protozoal",
      isZoonotic: false,
      symptoms: ["yellow diarrhea", "darkened head (cyanosis)", "droopy wings", "weight loss", "lethargy in turkeys"],
      pathogens: ["Histomonas meleagridis"],
      treatments: {
        severe: { drug: "Metronidazole (where legal)", class: "Nitroimidazole", mechanism: "DNA disruption", alternatives: ["Dimetridazole"] }
      }
    },
    colibacillosis_e_coli: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["respiratory distress", "swollen head", "diarrhea", "septicemia", "inflammation of internal organs"],
      pathogens: ["Escherichia coli"],
      treatments: {
        severe: { drug: "Amoxicillin", class: "Beta-lactam", mechanism: "Cell wall inhibitor", alternatives: ["Neomycin", "Gentamicin"] }
      }
    }
  },
  rabbit: {
    myxomatosis: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["swelling around eyes", "swollen ears", "nasal discharge", "high fever", "blindness", "listlessness", "difficulty eating", "secondary pneumonia"],
      pathogens: ["Myxoma Virus"],
      treatments: {
        severe: { drug: "Supportive care", class: "Symptomatic", mechanism: "Hydration + antibiotics for secondary infection", alternatives: ["Vaccination is critical"] }
      }
    },
    snuffles: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["sneezing", "white nasal discharge", "wet front paws", "eye discharge", "labored breathing", "head tilt (if middle ear affected)", "loss of appetite in rabbit"],
      pathogens: ["Pasteurella multocida"],
      treatments: {
        mild: { drug: "Enrofloxacin", class: "Fluoroquinolone", mechanism: "Inhibits DNA gyrase", alternatives: ["Trimethoprim-Sulfa", "Azithromycin"] }
      }
    },
    rabbit_hemorrhagic_disease: {
      category: "Viral",
      isZoonotic: false,
      symptoms: ["sudden death", "bloody discharge from nose/rectum", "fever", "cries of pain", "shortness of breath", "jaundice", "neurological tremors"],
      pathogens: ["RHDV1/RHDV2 (Calicivirus)"],
      treatments: {
        severe: { drug: "No effective cure", class: "Fatal / Zoonotic Risk", mechanism: "Fulminant viral hepatitis", alternatives: ["Mandatory vaccination"] }
      }
    },
    tularemia: {
      category: "Bacterial",
      isZoonotic: true,
      symptoms: ["sudden death", "high fever", "small white spots on liver/spleen", "lethargy", "ulcers on skin"],
      pathogens: ["Francisella tularensis"],
      treatments: {
        severe: { drug: "Enrofloxacin / Streptomycin", class: "Antibiotic", mechanism: "Protein synthesis inhibition", alternatives: ["Gentamicin"] }
      }
    },
    encephalitozoonosis: {
      category: "Microsporidial (Fungal)",
      isZoonotic: true,
      symptoms: ["head tilt (wry neck)", "rolling", "nystagmus (eye twitching)", "hind limb weakness", "increased thirst (kidney failure)"],
      pathogens: ["Encephalitozoon cuniculi"],
      treatments: {
        mild: { drug: "Fenbendazole", class: "Anthelmintic/Antifungal", mechanism: "Microtubule disruption", alternatives: ["Albendazole"] }
      }
    },
    cheyletiellosis: {
      category: "Parasitic (Mites)",
      isZoonotic: true,
      symptoms: ["walking dandruff (white flakes)", "scaling onto back", "itching", "red skin"],
      pathogens: ["Cheyletiella parasitovorax"],
      treatments: {
        mild: { drug: "Ivermectin / Selamectin", class: "Macrocyclic lactone", mechanism: "Paralysis of parasite nervous system", alternatives: ["Permethrin (careful with cats nearby)"] }
      }
    },
    gi_stasis: {
      category: "Digestive",
      isZoonotic: false,
      symptoms: ["absence of droppings", "lethargy", "hunched posture", "grinding teeth (pain)", "cold ears (low temperature)"],
      pathogens: ["Multifactorial (Dietary/Stress)"],
      treatments: {
        severe: { drug: "Cisapride + Fluids", class: "Prokinetic/Supportive", mechanism: "Stimulates gut motility + hydration", alternatives: ["Metoclopramide", "Pain relief (Meloxicam)"] }
      }
    },
    ear_mites_psoroptes: {
      category: "Parasitic",
      isZoonotic: false,
      symptoms: ["thick brown crusts in ears", "head shaking", "scratching at ears", "painful ears"],
      pathogens: ["Psoroptes cuniculi"],
      treatments: {
        mild: { drug: "Selamectin", class: "Macrocyclic lactone", mechanism: "Topical absorption killing mites", alternatives: ["Ivermectin injection"] }
      }
    },
    hepatic_coccidiosis: {
      category: "Protozoal",
      isZoonotic: false,
      symptoms: ["swollen belly", "jaundice", "diarrhea", "weight loss", "poor growth"],
      pathogens: ["Eimeria stiedae"],
      treatments: {
        mild: { drug: "Toltrazuril", class: "Antiprotozoal", mechanism: "Interferes with parasite division", alternatives: ["Sulfadimethoxine"] }
      }
    },
    urolithiasis_bladder_stones: {
      category: "Metabolic / Urinary",
      isZoonotic: false,
      symptoms: ["straining to urinate", "bloody urine", "hunched posture", "gritty sludge in urine", "anorexia"],
      pathogens: ["Calcium metabolism issues"],
      treatments: {
        severe: { drug: "Surgery / Fluids", class: "Emergency", mechanism: "Physical removal of stones", alternatives: ["Reduced calcium diet"] }
      }
    },
    pododermatitis_sore_hocks: {
      category: "Environmental / Bacterial",
      isZoonotic: false,
      symptoms: ["raw red patches on heels", "scabs on feet", "reluctance to move", "shifting weight"],
      pathogens: ["Staphylococcus aureus (secondary)"],
      treatments: {
        mild: { drug: "Soft bedding + Topical Silver Sulfadiazine", class: "Symptomatic", mechanism: "Pressure relief + antimicrobial", alternatives: ["Bandaging"] }
      }
    },
    dental_malocclusion: {
      category: "Physical / Genetic",
      isZoonotic: false,
      symptoms: ["overgrown teeth", "drooling (wet chin)", "dropping food", "weight loss", "facial swelling (abscesses)"],
      pathogens: ["Abnormal tooth wear"],
      treatments: {
        severe: { drug: "Dental trimming", class: "Surgical", mechanism: "Mechanical reduction of tooth length", alternatives: ["High fiber diet (Hay)"] }
      }
    },
    flystrike_myiasis: {
      category: "Parasitic",
      isZoonotic: false,
      symptoms: ["maggots on skin", "shock", "strong foul odor", "lethargy", "damp fur in vent area"],
      pathogens: ["Lucilia sericata (Blowfly)"],
      treatments: {
        severe: { drug: "Manual removal + Ivermectin", class: "Emergency", mechanism: "Physical removal + systemic parasite kill", alternatives: ["Antiseptic washing"] }
      }
    },
    rabbit_syphilis: {
      category: "Bacterial",
      isZoonotic: false,
      symptoms: ["ulcers around genitals", "scabs on nose/lips", "swollen genitals", "reluctance to mate"],
      pathogens: ["Treponema paraluiscuniculi"],
      treatments: {
        mild: { drug: "Penicillin G (Injectable ONLY)", class: "Beta-lactam", mechanism: "Cell wall inhibitor", alternatives: ["Azithromycin"] }
      }
    }
  }
};

// --- Models Logic ---
function calculateRiskScore(toxicity: number, logp: number) {
  const score = (toxicity * 0.7) + (logp * 0.3);
  if (score < 0.3) return "Low Risk";
  if (score < 0.6) return "Moderate Risk";
  return "High Risk";
}

function generateInsights(binding: number, toxicity: number, logp: number) {
  const insights = [];
  if (binding > 0.7) insights.push("Strong drug-target interaction detected.");
  if (toxicity > 0.7) insights.push("High toxicity risk; evaluate physiological impact.");
  if (logp > 3) insights.push("High lipophilicity may affect tissue absorption.");
  return insights.length ? insights.join(" ") : "Properties within normal range.";
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // --- API Routes ---

  // Drug Interactions Check
  app.post("/api/interactions", (req, res) => {
    const { drugs } = req.body; // array of drug names
    if (!Array.isArray(drugs) || drugs.length < 2) {
      return res.json({ interactions: [] });
    }

    const interactions: any[] = [];
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const drugA = drugs[i];
        const drugB = drugs[j];

        const match = drugInteractions[drugA]?.[drugB] || drugInteractions[drugB]?.[drugA];
        if (match) {
          interactions.push({
            pair: [drugA, drugB],
            explanation: match,
            severity: match.toLowerCase().includes("severe") || match.toLowerCase().includes("fatal") || match.toLowerCase().includes("contraindicated") ? "high" : "moderate"
          });
        }
      }
    }
    res.json({ interactions });
  });

  // Analyze Drug (Enhanced Lab Model)
  app.post("/api/analyze", async (req, res) => {
    const { drugName, smiles, bindingAffinity, toxicity, species, disease, overrides, lang } = req.body;
    
    // Default properties
    let mw = 300, logp = 2.0, hDonor = 1, hAcceptor = 3, tpsa = 60, rotatableBonds = 4;
    
    // PubChem Integration
    if (!overrides && (smiles || drugName)) {
      try {
        const queryType = smiles ? `smiles/${encodeURIComponent(smiles)}` : `name/${encodeURIComponent(drugName)}`;
        const pubChemRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/${queryType}/property/MolecularWeight,XLogP,HBondDonorCount,HBondAcceptorCount,TPSA,RotatableBondCount/JSON`);
        if (pubChemRes.ok) {
          const data: any = await pubChemRes.json();
          if (data.PropertyTable?.Properties?.[0]) {
            const p = data.PropertyTable.Properties[0];
            mw = p.MolecularWeight || mw;
            logp = p.XLogP || logp;
            hDonor = p.HBondDonorCount || hDonor;
            hAcceptor = p.HBondAcceptorCount || hAcceptor;
            tpsa = p.TPSA || tpsa;
            rotatableBonds = p.RotatableBondCount || rotatableBonds;
          }
        }
      } catch (e) {
        console.error("PubChem fetch failed, using fallbacks");
      }
    }

    if (overrides) {
      mw = overrides.mw ?? mw;
      logp = overrides.logp ?? logp;
      hDonor = overrides.hDonor ?? hDonor;
      hAcceptor = overrides.hAcceptor ?? hAcceptor;
      tpsa = overrides.tpsa ?? tpsa;
      rotatableBonds = overrides.rotatableBonds ?? rotatableBonds;
    }

    // Species and Disease Categorical Encoding Logic
    // We simulate a weighting system based on species/disease interactions
    let riskWeight = 1.0;
    let efficacyWeight = 1.0;

    if (species) {
      const s = species.toLowerCase();
      if (s === 'cat') riskWeight *= 1.25; // Cats have specific metabolic pathways (e.g., glucuronidation deficiency)
      if (s === 'poultry') efficacyWeight *= 0.85; // Faster metabolism in birds
      if (s === 'dog') riskWeight *= 1.05;
    }

    if (disease) {
      const d = disease.toLowerCase();
      if (d.includes('renal') || d.includes('kidney')) riskWeight *= 1.4;
      if (d.includes('hepatic') || d.includes('liver')) riskWeight *= 1.5;
      if (d.includes('inflammation')) efficacyWeight *= 1.1;
    }

    // Cross-Species Transfer Learning Simulation
    const speciesAnalytics = [
      { id: 'cat', name: 'Feline', risk: 1.25, metabolicNote: 'Deficient in glucuronidation; high toxicity risk for phenols/NSAIDs.' },
      { id: 'dog', name: 'Canine', risk: 1.05, metabolicNote: 'Highly sensitive to certain cardiac drugs and specific genotypes (MDR1).' },
      { id: 'horse', name: 'Equine', risk: 0.95, metabolicNote: 'Rapid hepatic clearance; sensitive to GI microbial disruption.' },
      { id: 'cattle', name: 'Bovine', risk: 1.0, metabolicNote: 'Ruminant metabolism; significant ruminal degradation of oral compounds.' },
      { id: 'poultry', name: 'Avian', risk: 0.85, metabolicNote: 'Extremely high metabolic rate; renal portal system affects drug distribution.' }
    ].map(s => {
      const speciesRisk = calculateRiskScore(toxicity * s.risk, logp);
      const speciesEfficacy = Math.min(100, Math.max(0, ((bindingAffinity * 60) + (1 - toxicity) * 20 + (logp % 5) * 4) * (1 / s.risk)));
      return { ...s, predictedRisk: speciesRisk, predictedEfficacy: Math.round(speciesEfficacy) };
    });

    // Predictive model simulation
    const efficacy = Math.min(100, Math.max(0, ((bindingAffinity * 60) + (1 - toxicity) * 20 + (logp % 5) * 4) * efficacyWeight));
    
    // ADME Predictions
    const adme = {
      absorption: logp > 0 && logp < 5 ? "High" : "Moderate",
      distribution: tpsa < 140 ? "Good" : "Poor",
      metabolism: "Hepatic (CYP450)",
      excretion: mw < 500 ? "Renal" : "Biliary",
      bloodBrainBarrier: tpsa < 90 && logp > 1 ? "Crosses" : "Restricted"
    };

    // Toxicity Profile
    const toxProfile = {
      hepatotoxicity: (toxicity * riskWeight) > 0.6 ? "Warning" : "Safe",
      nephrotoxicity: (mw > 600 && (toxicity * riskWeight) > 0.4) ? "Risk" : "Safe",
      ld50: `${Math.round(500 + (1 - toxicity) * 2000)} mg/kg`,
      safetyMargin: (toxicity * riskWeight) < 0.2 ? "Wide" : (toxicity * riskWeight) < 0.5 ? "Narrow" : "Critical"
    };

    // Regulatory & Environmental Simulation
    const regulatory = {
      meatWithdrawal: mw < 300 ? "14 Days" : mw < 600 ? "28 Days" : "45 Days",
      milkWithdrawal: logp < 2 ? "48 Hours" : "72 Hours",
      status: (toxicity * riskWeight) > 0.5 ? "Category C High-Alert" : "Category B Standard",
      restrictions: (toxicity * riskWeight) > 0.7 ? ["Professional Admin Only", "Not for Lactating Animals"] : ["Standard Veterinary Use"]
    };

    const environmental = {
      soilPersistence: logp > 3 ? "90-120 Days" : "45-60 Days",
      bioAccumulation: logp > 4 ? "High Risk" : "Low Risk",
      aquaticToxicity: toxicity > 0.5 ? "Toxic to Fish" : "Neutral",
      disposal: "Hazardous waste incineration recommended."
    };
    
    const finalResponse = {
      efficacy: Math.round(efficacy * 100) / 100,
      risk: calculateRiskScore(toxicity * riskWeight, logp),
      insight: generateInsights(bindingAffinity, toxicity * riskWeight, logp),
      compound: { mw, logp, hDonor, hAcceptor, tpsa, rotatableBonds },
      adme,
      toxProfile,
      regulatory,
      environmental,
      speciesAnalytics,
      targetScore: Math.round(bindingAffinity * 100)
    };

    if (lang === 'ar') {
      const localizeADME = (obj: any) => Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, translate(v as string, 'ar')])
      );
      
      res.json({
        ...finalResponse,
        adme: localizeADME(adme),
        toxProfile: localizeADME(toxProfile),
        regulatory: {
          ...regulatory,
          restrictions: regulatory.restrictions.map(r => translate(r, 'ar'))
        },
        environmental: localizeADME(environmental)
      });
    } else {
      res.json(finalResponse);
    }
  });

  // Diagnosis Engine
  app.post("/api/diagnose", (req, res) => {
    const { species, symptoms, diseaseName, lang } = req.body; // symptoms: { name: string, severity: 'mild' | 'moderate' | 'severe' }[]
    const speciesData = knowledgeBase[species.toLowerCase()];
    
    if (!speciesData) {
      return res.status(404).json({ error: "Species not supported yet." });
    }

    let bestMatch = null;
    let maxWeightedScore = 0;

    // Direct disease lookup if provided
    if (diseaseName) {
      const diseaseKey = diseaseName.toLowerCase().replace(/ /g, '_');
      if (speciesData[diseaseKey]) {
        bestMatch = { disease: diseaseKey, ...speciesData[diseaseKey] };
      }
    }

    // Symptom-based diagnosis if no direct disease or not found
    if (!bestMatch) {
      for (const [diseaseKey, data] of Object.entries(speciesData)) {
        const disease = data as any;
        let weightedScore = 0;
        
        const matchingSymptoms = symptoms?.filter((s: any) => 
          disease.symptoms.includes(s.name.toLowerCase())
        ) || [];

        matchingSymptoms.forEach((s: any) => {
          const severityWeight = s.severity === 'severe' ? 3 : s.severity === 'moderate' ? 2 : 1;
          weightedScore += severityWeight;
        });

        if (weightedScore > maxWeightedScore) {
          maxWeightedScore = weightedScore;
          bestMatch = { disease: diseaseKey, ...disease };
        }
      }
    }

    if (!bestMatch || (maxWeightedScore === 0 && !diseaseName)) {
      return res.status(404).json({ error: "No matching disease found for these symptoms." });
    }

    // Determine overall severity based on the highest symptom severity or symptom count
    const hasSevereSymptom = symptoms?.some((s: any) => s.severity === 'severe');
    const overallSeverity = (hasSevereSymptom || symptoms?.length > 3) ? "severe" : "mild";
    
    const treatment = bestMatch.treatments[overallSeverity] || Object.values(bestMatch.treatments)[0];

    const response = {
      diagnosis: bestMatch.disease,
      confidence: diseaseName ? "1.00" : (matchingSymptomsCount(bestMatch, symptoms || []) / bestMatch.symptoms.length).toFixed(2),
      severity: overallSeverity,
      pathogens: bestMatch.pathogens,
      isZoonotic: bestMatch.isZoonotic,
      treatment
    };

    if (lang === 'ar') {
      return res.json({
        ...response,
        diagnosis: translate(response.diagnosis, 'ar'),
        pathogens: response.pathogens.map((p: string) => translate(p, 'ar')),
        treatment: {
          ...treatment,
          drug: translate(treatment.drug, 'ar'),
          class: translate(treatment.class, 'ar'),
          mechanism: translate(treatment.mechanism, 'ar'),
          alternatives: (treatment.alternatives || []).map((alt: string) => translate(alt, 'ar'))
        }
      });
    }

    res.json(response);
  });

  function matchingSymptomsCount(disease: any, inputSymptoms: any[]) {
    return inputSymptoms.filter((s: any) => disease.symptoms.includes(s.name.toLowerCase())).length;
  }

  // Get Species/Diseases for dropdowns
  app.get("/api/metadata", (req, res) => {
    const { lang } = req.query;
    const metadata = Object.keys(knowledgeBase).map(species => ({
      species: species, // stable key
      label: lang === 'ar' ? translate(species, 'ar') : species,
      diseases: Object.keys(knowledgeBase[species]).map(diseaseKey => ({
        name: diseaseKey, // stable key
        label: lang === 'ar' ? translate(diseaseKey, 'ar') : diseaseKey,
        isZoonotic: knowledgeBase[species][diseaseKey].isZoonotic
      })),
      symptoms: Array.from(new Set(Object.values(knowledgeBase[species]).flatMap((d: any) => d.symptoms))).map(s => ({
        name: s, // stable key
        label: lang === 'ar' ? translate(s as string, 'ar') : s
      }))
    }));
    res.json(metadata);
  });

  // --- AI Clinical & Molecular Routes ---
  app.post("/api/ai/treatment", async (req, res) => {
    try {
      const { species, diagnosis, symptoms, lang } = req.body;
      const symptomsString = symptoms.map((s: any) => `${s.name} (${s.severity})`).join(", ");
      const prompt = `You are a professional veterinary pharmacologist. 
      Analyze the following case: 
      Species: ${species}
      Diagnosis: ${diagnosis}
      Observed Symptoms & Their Severity: ${symptomsString}
      
      Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      CRITICAL: All text values MUST be in the requested language.
      
      Provide a detailed treatment plan in JSON format.`;

      const modelName = "gemini-1.5-flash";
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bestDrug: { type: Type.STRING },
              activeCompound: { type: Type.STRING },
              mechanismOfAction: { type: Type.STRING },
              administrationRoute: { type: Type.STRING },
              dosageGuidelines: { type: Type.STRING },
              rationale: { type: Type.STRING },
              importantWarnings: { type: Type.STRING },
              expectedPrognosis: { type: Type.STRING },
              biosecurityProtocol: { type: Type.STRING },
              environmentalManagement: { type: Type.STRING },
              monitoringParameters: { type: Type.ARRAY, items: { type: Type.STRING } },
              emergencyTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
              alternatives: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    detail: { type: Type.STRING },
                    relationshipToDiagnosis: { type: Type.STRING }
                  },
                  required: ["name", "detail", "relationshipToDiagnosis"]
                } 
              },
              followUpSchedule: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    action: { type: Type.STRING }
                  },
                  required: ["day", "action"]
                } 
              }
            },
            required: ["bestDrug", "activeCompound", "mechanismOfAction", "administrationRoute", "dosageGuidelines", "alternatives", "monitoringParameters", "followUpSchedule", "emergencyTriggers", "expectedPrognosis", "biosecurityProtocol", "environmentalManagement", "importantWarnings", "rationale"],
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("AI Treatment Error:", error);
      res.status(500).json({ error: "Failed to generate treatment plan" });
    }
  });

  app.post("/api/ai/molecular", async (req, res) => {
    try {
      const { drugName, props, lang } = req.body;
      const prompt = `Analyze compound: ${drugName}. Molecular Properties: ${JSON.stringify(props)}. Provide a scientific report in JSON. Language: ${lang === 'ar' ? 'Arabic' : 'English'}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesisRoute: { type: Type.STRING },
              targetSpecificity: { type: Type.STRING },
              comparativeAnalysis: { type: Type.STRING },
              globalRegulatorySafety: { type: Type.STRING },
              noveltyScore: { type: Type.NUMBER },
              isomericDesign: { type: Type.STRING },
              drugInteractions: { type: Type.STRING },
              sideEffects: { type: Type.STRING },
              metabolicPathways: { type: Type.STRING }
            },
            required: ["synthesisRoute", "targetSpecificity", "comparativeAnalysis", "globalRegulatorySafety", "noveltyScore", "isomericDesign", "drugInteractions", "sideEffects", "metabolicPathways"]
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("AI Molecular Error:", error);
      res.status(500).json({ error: "Failed to generate molecular report" });
    }
  });

  app.post("/api/ai/consultation", async (req, res) => {
    try {
      const { description, lang } = req.body;
      const prompt = `Analyze clinical case: ${description}. Provide full consultation in JSON. Language: ${lang === 'ar' ? 'Arabic' : 'English'}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("AI Consultation Error:", error);
      res.status(500).json({ error: "Failed to perform AI consultation" });
    }
  });

  app.post("/api/ai/params", async (req, res) => {
    try {
      const { drugName, target, smiles } = req.body;
      const prompt = `Predict molecular params for ${drugName} against ${target}. SMILES: ${smiles}. JSON format.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bindingAffinity: { type: Type.NUMBER },
              toxicityIndex: { type: Type.NUMBER },
              mw: { type: Type.NUMBER },
              logp: { type: Type.NUMBER },
              hDonor: { type: Type.NUMBER },
              hAcceptor: { type: Type.NUMBER },
              tpsa: { type: Type.NUMBER },
              rotatableBonds: { type: Type.NUMBER }
            },
            required: ["bindingAffinity", "toxicityIndex", "mw", "logp", "hDonor", "hAcceptor", "tpsa", "rotatableBonds"]
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("AI Params Error:", error);
      res.status(500).json({ error: "Failed to predict parameters" });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
