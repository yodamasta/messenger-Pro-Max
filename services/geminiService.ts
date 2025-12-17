import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptInputs, GeneratedPrompts } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    code_content: {
      type: Type.STRING,
      description: "Bloc de prompt décrivant le contexte et le contenu à transmettre."
    },
    code_style: {
      type: Type.STRING,
      description: "Bloc de prompt décrivant le style, le ton et les règles de communication."
    },
    merged_prompt: {
      type: Type.STRING,
      description: "Prompt fusionné tout-en-un prêt à être utilisé."
    }
  },
  required: ["code_content", "code_style", "merged_prompt"]
};

const SYSTEM_INSTRUCTION = `
Tu es le moteur interne d'une application appelée PromptMessenger. Ton rôle est de générer des blocs de prompt pour qu'un autre LLM puisse parler à une personne humaine précise de manière parfaitement adaptée. 
Tu ne dois PAS répondre à la personne finale, mais construire des prompts que l'utilisateur pourra lui envoyer.

Règles de génération basées sur le 'tone_preset' (Ton):
- direct: Parle de manière directe, structurée, sans tourner autour du pot, mais sans agressivité.
- empathique: Parle avec beaucoup d'empathie, de douceur et de validation émotionnelle. Utilise un ton rassurant.
- creatif: Parle de manière imagée et créative, avec des métaphores, tout en restant clair sur les points importants.
- corporate: Parle de manière professionnelle, synthétique et orientée résultats, comme dans un contexte business.
- neutre: Parle de manière naturelle, claire et respectueuse, sans style particulier.
- humour: Utilise de l'humour, de la légèreté et des traits d'esprit pour rendre le message agréable et fun.
- enthousiaste: Utilise un ton très dynamique, positif, avec des points d'exclamation et des mots motivants.
- pedagogue: Explique les choses calmement, étape par étape, comme pour enseigner quelque chose de complexe simplement.
- persuasif: Utilise des techniques rhétoriques pour convaincre, séduire ou vendre une idée avec assurance.

Règles de génération basées sur le 'message_purpose' (But/Format):
- pitch_scenario: Présente un scénario ou une idée de projet de façon engageante mais structurée (début, milieu, fin, appel à l'action).
- brief_travail: Explique une tâche très clairement avec étapes concrètes, priorités et délais.
- message_difficile: Transmets un message sensible en choisissant les mots avec soin, sans accusation, en gérant l'émotion.
- email: Structure le message strictement comme un EMAIL. Tu DOIS inclure une ligne "Objet :" pertinente, une formule de politesse d'ouverture et de fermeture, et une mise en forme aérée.
- sms: Le message doit être très court, concis, sans fioritures ni formules de politesse trop longues. Style messagerie instantanée.
- social_post: Structure le message pour les RESEAUX SOCIAUX (LinkedIn/Twitter/Insta). Utilise des emojis 🚀, des listes à puces, un style "hook" (accroche) au début, et des hashtags à la fin.
- relance: Rappelle poliment mais fermement qu'une réponse ou une action est attendue, en remettant du contexte sans être harcelant.
- invitation: Donne clairement le Quoi, Quand, Où, et demande une confirmation (RSVP). Ton chaleureux.
- excuse: Présente des excuses sincères, prends la responsabilité de l'erreur et propose une solution ou une réparation.
- autre: Adapte le message au contexte fourni sans format imposé.

Templates à respecter pour la sortie :

1. code_content (Contexte):
"Tu es un assistant IA chargé de raconter ou d'expliquer un message à une personne humaine précise.\n\nLa personne s'appelle {{recipient_name}}. Elle est {{recipient_role}}. Relation: {{relationship}}. Traits: {{traits}}\n\nVoici le contenu brut à transformer pour {{recipient_name}} :\n\n\"\"\"\n{{raw_message}}\n\"\"\"\n\n{{Instructions spécifiques au But/Format (purpose)}}"

2. code_style (Style):
"Voici comment adapter ton style pour parler à {{recipient_name}} :\n- Adapte le ton à sa personnalité décrite ci-dessus.\n- {{Instructions spécifiques au Ton (tone_preset)}}\n- Parle-lui directement en utilisant son prénom ({{recipient_name}}) dans la réponse.\n- Format attendu : {{message_purpose}}.\n- Termine par ce qui est attendu (question, action, etc.)."

3. merged_prompt (Fusion):
"Tu es un assistant IA. Ta mission est de parler à une personne réelle de façon personnalisée.\n\nPARTIE 1 – CONTEXTE ET CONTENU\n{{code_content_generated}}\n\nPARTIE 2 – STYLE ET TON A ADOPTER\n{{code_style_generated}}\n\nConsigne finale : Réponds maintenant comme si tu parlais directement à {{recipient_name}}, en respectant toutes les instructions ci-dessus."
`;

export const generatePrompts = async (inputs: PromptInputs): Promise<GeneratedPrompts> => {
  try {
    const prompt = `
      Génère les 3 blocs de prompts pour les entrées suivantes :
      
      Nom du destinataire: ${inputs.recipient_name}
      Rôle: ${inputs.recipient_role || "Non spécifié"}
      Relation: ${inputs.relationship || "Non spécifié"}
      Traits de personnalité: ${inputs.traits || "Non spécifié"}
      Ton (Preset): ${inputs.tone_preset}
      But du message (Format): ${inputs.message_purpose}
      Message brut: 
      """
      ${inputs.raw_message}
      """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.75, // Increased slightly for better creativity on humor/social posts
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(jsonText) as GeneratedPrompts;
    return data;
  } catch (error) {
    console.error("Error generating prompts:", error);
    throw error;
  }
};
