import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getSmartTreatment(species: string, diagnosis: string, symptoms: { name: string, severity: string }[], lang: string = 'en') {
  try {
    const symptomsString = symptoms.map((s: any) => `${s.name} (${s.severity})`).join(", ");
    const prompt = `You are a professional veterinary pharmacologist. 
    Analyze the following case: 
    Species: ${species}
    Diagnosis: ${diagnosis}
    Observed Symptoms & Their Severity: ${symptomsString}
    
    Language requested for responses: ${lang === 'ar' ? 'Arabic' : 'English'}.
    CRITICAL: Every single text value in the resulting JSON object MUST be translated to the requested language. Do not leave English terms unless they are universal scientific abbreviations (like mg/kg).
    
    Provide a detailed treatment plan in JSON format with the following keys:
    - bestDrug: string
    - activeCompound: string
    - mechanismOfAction: string
    - administrationRoute: string
    - dosageGuidelines: string
    - alternatives: Array of { name: string, detail: string, relationshipToDiagnosis: string }
    - monitoringParameters: string[] (What to monitor during recovery)
    - followUpSchedule: Array of { day: string, action: string }
    - emergencyTriggers: string[] (When to stop treatment/escalate)
    - expectedPrognosis: string
    - biosecurityProtocol: string (Prevention of spread/zoonotic advice)
    - environmentalManagement: string (Ventilation, temperature, hygiene advice)
    - importantWarnings: string
    - rationale: string (Why this drug is the best choice for this specific case)`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
            monitoringParameters: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencyTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            expectedPrognosis: { type: Type.STRING },
            biosecurityProtocol: { type: Type.STRING },
            environmentalManagement: { type: Type.STRING },
            importantWarnings: { type: Type.STRING },
            rationale: { type: Type.STRING },
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
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini treatment suggestion failed:", error);
    return null;
  }
}

export async function getAdvancedMolecularReport(drugName: string, props: any, lang: string = 'en') {
  try {
    const prompt = `You are a world-class medicinal chemist and pharmacologist. 
    Analyze the following compound: ${drugName}.
    Molecular Properties: ${JSON.stringify(props)}
    
    Language requested for responses: ${lang === 'ar' ? 'Arabic' : 'English'}.
    CRITICAL: Every single text value in the resulting JSON object MUST be translated to the requested language.
    
    Provide a comprehensive "World-Class Scientific Discovery Report" in JSON format:
    {
      "synthesisRoute": "string describing the synthetic pathway (step-by-step)",
      "targetSpecificity": "analysis of binding to specific protein pockets",
      "comparativeAnalysis": "compare with a gold-standard drug in the same class",
      "globalRegulatorySafety": "FDA/EMA safety outlook and clinical trial feasibility",
      "noveltyScore": "0-100 indicating innovation level",
      "isomericDesign": "recommendations for stereochemical optimization",
      "drugInteractions": "detailed analysis of potential drug-drug interactions",
      "sideEffects": "detailed pharmacological summary of potential adverse reactions",
      "metabolicPathways": "description of hepatic/renal metabolism and phase I/II transformations"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Advanced molecular report failed:", error);
    return null;
  }
}

export async function fullAiConsultation(description: string, lang: string = 'en') {
  try {
    const prompt = `You are an elite veterinary consultant. Analyze this clinical case described by the user: "${description}".
    
    Language requested for responses: ${lang === 'ar' ? 'Arabic' : 'English'}.
    CRITICAL: Every single text value in the resulting JSON object MUST be translated to the requested language.
    
    Perform these steps and return a JSON object with:
    - species: (string like "Cat", "Dog", "Poultry")
    - diagnosis: (string)
    - confidence: (number 0-100)
    - severity: ("Low" | "Moderate" | "High")
    - pathogens: (string[])
    - riskFactors: (string[])
    - differentialDiagnosis: (string)
    - biosecurityRisk: ("Low" | "Medium" | "High")
    - labRecommendations: (string)
    - instructions: (string)
    - isZoonotic: (boolean)
    - treatment: {
        bestDrug: string,
        activeCompound: string,
        mechanismOfAction: string,
        administrationRoute: string,
        dosageGuidelines: string,
        rationale: string,
        importantWarnings: string,
        expectedPrognosis: string,
        biosecurityProtocol: string,
        environmentalManagement: string,
        monitoringParameters: string[],
        alternatives: Array<{ name: string, detail: string, relationshipToDiagnosis: string }>,
        followUpSchedule: Array<{ day: string, action: string }>,
        emergencyTriggers: string[]
      }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            species: { type: Type.STRING },
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            severity: { type: Type.STRING },
            pathogens: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            differentialDiagnosis: { type: Type.STRING },
            biosecurityRisk: { type: Type.STRING },
            labRecommendations: { type: Type.STRING },
            instructions: { type: Type.STRING },
            isZoonotic: { type: Type.BOOLEAN },
            treatment: {
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
              required: ["bestDrug", "activeCompound", "mechanismOfAction", "administrationRoute", "dosageGuidelines", "rationale", "importantWarnings", "expectedPrognosis", "biosecurityProtocol", "environmentalManagement", "monitoringParameters", "alternatives", "followUpSchedule", "emergencyTriggers"]
            }
          },
          required: ["species", "diagnosis", "confidence", "severity", "pathogens", "riskFactors", "differentialDiagnosis", "biosecurityRisk", "labRecommendations", "instructions", "isZoonotic", "treatment"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Full AI consultation failed:", error);
    return null;
  }
}

export async function predictMolecularParameters(drugName: string, target?: string, structuralData?: { smiles?: string, coordinates3d?: string }) {
  try {
    const prompt = `You are a computational pharmacologist and medicinal chemist. Predict the molecular interaction and chemical parameters for the compound "${drugName || "specified structure"}" against the biological target "${target || "general receptors"}".
    
    ${structuralData?.smiles ? `SMILES Structure: ${structuralData.smiles}` : ''}
    ${structuralData?.coordinates3d ? `3D Coordinates: ${structuralData.coordinates3d}` : ''}

    Predict based on pharmacological data and the provided structure.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Molecular parameter prediction failed:", error);
    return null;
  }
}

export async function getDrugDetail(drugName: string, contextDiagnosis?: string, lang: string = 'en') {
  try {
    const prompt = `You are an expert veterinary pharmacologist. Provide a detailed summary for the drug "${drugName}"${contextDiagnosis ? ` specifically in the context of treating ${contextDiagnosis}` : ''}.
    
    Language requested for responses: ${lang === 'ar' ? 'Arabic' : 'English'}.

    Return in JSON format:
    {
      "name": "string",
      "detail": "short clinical description and mechanism (max 2 sentences)",
      "relationshipToDiagnosis": "relationship to ${contextDiagnosis || 'general veterinary medicine'} (max 2 sentences)",
      "isZoonoticAlert": boolean
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            detail: { type: Type.STRING },
            relationshipToDiagnosis: { type: Type.STRING },
            isZoonoticAlert: { type: Type.BOOLEAN }
          },
          required: ["name", "detail", "relationshipToDiagnosis", "isZoonoticAlert"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Get drug detail failed:", error);
    return null;
  }
}
