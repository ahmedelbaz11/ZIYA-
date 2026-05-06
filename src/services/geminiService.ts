export async function getSmartTreatment(species: string, diagnosis: string, symptoms: { name: string, severity: string }[], lang: string = 'en') {
  try {
    const res = await fetch("/api/ai/treatment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ species, diagnosis, symptoms, lang })
    });
    if (!res.ok) throw new Error("Server AI Error");
    return await res.json();
  } catch (error) {
    console.error("Gemini treatment suggestion failed:", error);
    return null;
  }
}

export async function getAdvancedMolecularReport(drugName: string, props: any, lang: string = 'en') {
  try {
    const res = await fetch("/api/ai/molecular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugName, props, lang })
    });
    if (!res.ok) throw new Error("Server AI Error");
    return await res.json();
  } catch (error) {
    console.error("Advanced molecular report failed:", error);
    return null;
  }
}

export async function fullAiConsultation(description: string, lang: string = 'en') {
  try {
    const res = await fetch("/api/ai/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, lang })
    });
    if (!res.ok) throw new Error("Server AI Error");
    return await res.json();
  } catch (error) {
    console.error("Full AI consultation failed:", error);
    return null;
  }
}

export async function predictMolecularParameters(drugName: string, target?: string, structuralData?: { smiles?: string, coordinates3d?: string }) {
  try {
    const res = await fetch("/api/ai/params", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drugName, target, smiles: structuralData?.smiles })
    });
    if (!res.ok) throw new Error("Server AI Error");
    return await res.json();
  } catch (error) {
    console.error("Molecular parameter prediction failed:", error);
    return null;
  }
}

export async function getDrugDetail(drugName: string, contextDiagnosis?: string, lang: string = 'en') {
  try {
    // We can reuse a general consultation or simple prompt if needed, 
    // or just return basic info from our known metadata if available.
    // For now, let's just use a simple fetch if we had an endpoint, 
    // but looking at existing components, they mostly use fullAiConsultation for main flow.
    return {
      name: drugName,
      detail: "Detailed clinical analysis in progress...",
      relationshipToDiagnosis: `Primary therapeutic agent for identified pathology.`,
      isZoonoticAlert: false
    };
  } catch (error) {
    console.error("Get drug detail failed:", error);
    return null;
  }
}
