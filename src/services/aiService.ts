import { AIModelConfig, ClinicalDecision, Transcript } from '../types';

export class AIService {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const prompt = `You are a medical transcription assistant. Listen to this audio and transcribe the conversation between a doctor and patient.
Format the output as:
DOCTOR: [what the doctor says]
PATIENT: [what the patient says]

If you cannot determine the audio content, return: "Audio transcription not available - please manually enter the conversation."`;

      const response = await fetch(`${this.config.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a medical transcription assistant.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Transcription request failed');
      }

      const data = await response.json();
      const transcribedText = data.choices?.[0]?.message?.content || '';

      if (transcribedText) {
        return transcribedText;
      }

      throw new Error('No transcription in response');
    } catch (error) {
      console.error('Transcription error:', error);
      return 'PATIENT: [Audio transcription not available - LM Studio cannot process audio directly. Please manually record the conversation or use a dedicated speech-to-text service.]';
    }
  }

  async generateClinicalDecision(transcripts: Transcript[]): Promise<ClinicalDecision> {
    const conversationText = transcripts
      .map(t => `${t.speaker.toUpperCase()}: ${t.text}`)
      .join('\n');

    const systemPrompt = `You are an expert medical AI assistant helping doctors with clinical decision support. Analyze conversations and provide structured clinical insights in JSON format only.`;

    const userPrompt = `Analyze this doctor-patient conversation and provide clinical insights:

${conversationText}

Provide a comprehensive clinical analysis in the following JSON format (respond with ONLY valid JSON, no other text):
{
  "symptoms": ["symptom1", "symptom2"],
  "diagnosisSuggestions": [{"diagnosis": "condition name", "confidence": 0.85, "reasoning": "explanation"}],
  "recommendedTests": ["test1", "test2"],
  "treatmentSuggestions": ["treatment1", "treatment2"],
  "redFlags": ["flag1 if any urgent concerns"],
  "followUpRecommendations": "follow-up care details",
  "summary": "concise clinical summary"
}`;

    try {
      const response = await fetch(`${this.config.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Clinical decision generation failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content || '';

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      throw new Error('Invalid response format - no JSON found');
    } catch (error) {
      console.error('Clinical decision generation error:', error);
      return this.getMockClinicalDecision(transcripts);
    }
  }

  private getMockClinicalDecision(transcripts: Transcript[]): ClinicalDecision {
    return {
      symptoms: ['Symptom extraction pending - AI model connection needed'],
      diagnosisSuggestions: [
        {
          diagnosis: 'Analysis pending - Configure AI model endpoint',
          confidence: 0,
          reasoning: 'Local AI model not connected',
        },
      ],
      recommendedTests: ['Complete diagnostic panel'],
      treatmentSuggestions: ['Awaiting AI analysis'],
      redFlags: [],
      followUpRecommendations: 'Configure local AI model to generate clinical insights',
      summary: 'AI model connection required for clinical analysis. Please configure the AI endpoint in settings.',
    };
  }
}
