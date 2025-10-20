import { AIModelConfig, ClinicalDecision, Transcript } from '../types';

export class AIService {
  private config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await fetch(`${this.config.endpoint}/transcribe`, {
        method: 'POST',
        headers: this.config.apiKey ? {
          'Authorization': `Bearer ${this.config.apiKey}`
        } : {},
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Transcription error:', error);
      return '[Transcription pending - AI model connection needed]';
    }
  }

  async generateClinicalDecision(transcripts: Transcript[]): Promise<ClinicalDecision> {
    const conversationText = transcripts
      .map(t => `${t.speaker.toUpperCase()}: ${t.text}`)
      .join('\n');

    const prompt = `Analyze this doctor-patient conversation and provide clinical insights:

${conversationText}

Provide a comprehensive clinical analysis including:
1. List of symptoms mentioned
2. Potential diagnoses with confidence levels
3. Recommended diagnostic tests
4. Treatment suggestions
5. Any red flags or urgent concerns
6. Follow-up recommendations
7. A concise summary

Format the response as JSON with the following structure:
{
  "symptoms": ["symptom1", "symptom2"],
  "diagnosisSuggestions": [{"diagnosis": "...", "confidence": 0.85, "reasoning": "..."}],
  "recommendedTests": ["test1", "test2"],
  "treatmentSuggestions": ["treatment1", "treatment2"],
  "redFlags": ["flag1", "flag2"],
  "followUpRecommendations": "...",
  "summary": "..."
}`;

    try {
      const response = await fetch(`${this.config.endpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error('Clinical decision generation failed');
      }

      const data = await response.json();
      const resultText = data.response || data.text || '';

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Invalid response format');
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
