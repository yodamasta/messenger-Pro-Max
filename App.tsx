import React, { useState } from "react";
import { TonePreset, MessagePurpose, PromptInputs, GeneratedPrompts } from "./types";
import { generatePrompts } from "./services/geminiService";
import { TextInput, TextArea, Select } from "./components/InputFields";
import { OutputBlock } from "./components/OutputBlock";

const App: React.FC = () => {
  // --- State ---
  const [formData, setFormData] = useState<PromptInputs>({
    recipient_name: "",
    recipient_role: "",
    relationship: "",
    traits: "",
    tone_preset: TonePreset.Direct,
    message_purpose: MessagePurpose.Email,
    raw_message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedPrompts | null>(null);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuggestionClick = (field: keyof PromptInputs, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.raw_message.trim() || !formData.recipient_name.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const generated = await generatePrompts(formData);
      setResults(generated);
    } catch (err) {
      setError("Une erreur est survenue lors de la génération. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // --- Configuration options ---
  const toneOptions = [
    { value: TonePreset.Neutre, label: "Neutre (Naturel, respectueux)" },
    { value: TonePreset.Direct, label: "Direct (Efficace, structuré)" },
    { value: TonePreset.Corporate, label: "Corporate (Pro, orienté résultats)" },
    { value: TonePreset.Empathique, label: "Empathique (Doux, rassurant)" },
    { value: TonePreset.Humour, label: "Humoristique (Drôle, détendu)" },
    { value: TonePreset.Enthousiaste, label: "Enthousiaste (Dynamique, positif)" },
    { value: TonePreset.Persuasif, label: "Persuasif (Vendeur, convaincant)" },
    { value: TonePreset.Pedagogue, label: "Pédagogue (Clair, explicatif)" },
    { value: TonePreset.Creatif, label: "Créatif (Imagé, métaphorique)" },
  ];

  const purposeOptions = [
    { value: MessagePurpose.Email, label: "📧 Email (Avec objet et structure)" },
    { value: MessagePurpose.SMS, label: "💬 SMS / Chat (Court et rapide)" },
    { value: MessagePurpose.SocialPost, label: "📱 Post Réseaux Sociaux (Emojis, hashtags)" },
    { value: MessagePurpose.PitchScenario, label: "🎬 Pitcher une idée / projet" },
    { value: MessagePurpose.BriefTravail, label: "📋 Briefer un travail / tâche" },
    { value: MessagePurpose.Relance, label: "⏰ Relance / Follow-up" },
    { value: MessagePurpose.Invitation, label: "📅 Invitation" },
    { value: MessagePurpose.Excuse, label: "🙏 Excuses / Mea Culpa" },
    { value: MessagePurpose.MessageDifficile, label: "⚠️ Message sensible / difficile" },
    { value: MessagePurpose.Autre, label: "📝 Autre / Message libre" },
  ];

  // --- Suggestions Data ---
  const nameSuggestions = ["Les amis", "La mif", "La fafa", "Mon Boss", "Mon Ex", "Moi-même", "Le recruteur", "Team"];
  const roleSuggestions = ["Producteur", "Pote", "Développeur", "Commercial", "Manager", "Client", "Influenceur", "Inconnu"];
  const relationSuggestions = ["Strictement pro", "Compliqué", "On se connait bien", "Jamais vu", "Pote de soirée", "Je veux le pécho", "En froid"];
  const traitsSuggestions = ["Pressé", "Susceptible", "Drôle", "Formel", "Bienveillant", "A besoin de détails", "Jeune", "Boomer"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">PromptMessenger</span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Générateur de prompts LLM personnalisés
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Form */}
          <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">1</span>
                Configuration
              </h2>
              
              <form onSubmit={handleSubmit}>
                <TextInput
                  id="recipient_name"
                  name="recipient_name"
                  label="Prénom / Groupe"
                  placeholder="Ex: Nico, La team..."
                  value={formData.recipient_name}
                  onChange={handleChange}
                  required
                  suggestions={nameSuggestions}
                  onSuggestionClick={(val) => handleSuggestionClick("recipient_name", val)}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <TextInput
                    id="recipient_role"
                    name="recipient_role"
                    label="Rôle (Optionnel)"
                    placeholder="Ex: Producteur"
                    value={formData.recipient_role}
                    onChange={handleChange}
                    suggestions={roleSuggestions}
                    onSuggestionClick={(val) => handleSuggestionClick("recipient_role", val)}
                  />
                  <TextInput
                    id="relationship"
                    name="relationship"
                    label="Relation (Optionnel)"
                    placeholder="Ex: Pote, Boss..."
                    value={formData.relationship}
                    onChange={handleChange}
                    suggestions={relationSuggestions}
                    onSuggestionClick={(val) => handleSuggestionClick("relationship", val)}
                  />
                </div>

                <TextInput
                  id="traits"
                  name="traits"
                  label="Traits de personnalité (Optionnel)"
                  placeholder="Ex: Stressé, cool..."
                  value={formData.traits}
                  onChange={handleChange}
                  suggestions={traitsSuggestions}
                  onSuggestionClick={(val) => handleSuggestionClick("traits", val)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                   <Select
                    id="tone_preset"
                    name="tone_preset"
                    label="Ton"
                    value={formData.tone_preset}
                    onChange={handleChange}
                    options={toneOptions}
                    required
                  />
                  <Select
                    id="message_purpose"
                    name="message_purpose"
                    label="Format / Objectif"
                    value={formData.message_purpose}
                    onChange={handleChange}
                    options={purposeOptions}
                    required
                  />
                </div>

                <div className="mt-2">
                  <TextArea
                    id="raw_message"
                    name="raw_message"
                    label="Votre message brut"
                    placeholder="Collez ici votre idée, brouillon ou points clés..."
                    value={formData.raw_message}
                    onChange={handleChange}
                    required
                    className="h-32"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.recipient_name || !formData.raw_message}
                  className={`mt-4 w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md
                    ${loading || !formData.recipient_name || !formData.raw_message
                      ? "bg-slate-300 cursor-not-allowed shadow-none" 
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Génération en cours...
                    </>
                  ) : (
                    "Générer les prompts"
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* RIGHT COLUMN: Results */}
          <section className="lg:col-span-7 xl:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {!results && !loading && !error && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium">En attente de votre message...</p>
                <p className="text-sm">Remplissez le formulaire à gauche pour générer vos prompts.</p>
              </div>
            )}

            {results && (
              <div className="animate-fade-in space-y-8">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">2</span>
                      Résultats
                    </h2>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                      Généré avec succès
                    </span>
                 </div>
                
                {/* MERGED PROMPT (The Hero) */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative">
                     <OutputBlock 
                      title="🚀 Prompt Prêt à l'emploi (Fusionné)" 
                      content={results.merged_prompt} 
                      colorClass="border-indigo-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Content Component */}
                  <OutputBlock 
                    title="📝 Partie 1 : Contexte & Contenu" 
                    content={results.code_content} 
                    colorClass="border-blue-400" 
                  />
                  
                  {/* Style Component */}
                  <OutputBlock 
                    title="🎨 Partie 2 : Style & Ton" 
                    content={results.code_style} 
                    colorClass="border-purple-400" 
                  />
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800 flex gap-3 items-start">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>
                      <strong>Astuce :</strong> Copiez le bloc "Prompt Fusionné" et collez-le dans ChatGPT, Claude ou Gemini. 
                      L'IA comprendra exactement comment parler à {formData.recipient_name}.
                    </p>
                </div>

              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
