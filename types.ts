export enum TonePreset {
  Direct = "direct",
  Empathique = "empathique",
  Creatif = "creatif",
  Corporate = "corporate",
  Neutre = "neutre",
  Humour = "humour",
  Enthousiaste = "enthousiaste",
  Pedagogue = "pedagogue",
  Persuasif = "persuasif"
}

export enum MessagePurpose {
  PitchScenario = "pitch_scenario",
  BriefTravail = "brief_travail",
  MessageDifficile = "message_difficile",
  Email = "email",
  SMS = "sms",
  SocialPost = "social_post",
  Relance = "relance",
  Invitation = "invitation",
  Excuse = "excuse",
  Autre = "autre"
}

export interface PromptInputs {
  recipient_name: string;
  recipient_role: string;
  relationship: string;
  traits: string;
  tone_preset: TonePreset;
  message_purpose: MessagePurpose;
  raw_message: string;
}

export interface GeneratedPrompts {
  code_content: string;
  code_style: string;
  merged_prompt: string;
}
