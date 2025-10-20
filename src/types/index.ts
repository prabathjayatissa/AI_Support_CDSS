export interface Transcript {
  id: string;
  speaker: 'doctor' | 'patient';
  text: string;
  timestamp: Date;
}

export interface ClinicalDecision {
  symptoms: string[];
  diagnosisSuggestions: DiagnosisSuggestion[];
  recommendedTests: string[];
  treatmentSuggestions: string[];
  redFlags: string[];
  followUpRecommendations: string;
  summary: string;
}

export interface DiagnosisSuggestion {
  diagnosis: string;
  confidence: number;
  reasoning: string;
}

export interface Conversation {
  id: string;
  patientName: string;
  patientId: string;
  startedAt: Date;
  endedAt?: Date;
  status: 'recording' | 'processing' | 'completed';
  transcripts: Transcript[];
  clinicalDecision?: ClinicalDecision;
}

export interface AIModelConfig {
  endpoint: string;
  apiKey?: string;
  model: string;
}
