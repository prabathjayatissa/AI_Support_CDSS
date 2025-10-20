import { useState } from 'react';
import { Settings, FileText, Activity } from 'lucide-react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { AIService } from './services/aiService';
import { RecordingControls } from './components/RecordingControls';
import { PatientInfo } from './components/PatientInfo';
import { TranscriptView } from './components/TranscriptView';
import { ClinicalDecisionView } from './components/ClinicalDecisionView';
import { SettingsModal } from './components/SettingsModal';
import { AIModelConfig, Transcript, ClinicalDecision } from './types';

function App() {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [clinicalDecision, setClinicalDecision] = useState<ClinicalDecision | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'analysis'>('transcript');
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);

  const [aiConfig, setAiConfig] = useState<AIModelConfig>({
    endpoint: 'http://localhost:11434',
    model: 'llama3',
    apiKey: '',
  });

  const {
    isRecording,
    isPaused,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    if (!patientName.trim() || !patientId.trim()) {
      alert('Please enter patient name and ID before starting the recording.');
      return;
    }

    try {
      await startRecording();
      setRecordingStartTime(new Date());
      setTranscripts([]);
      setClinicalDecision(null);
    } catch (error) {
      alert('Failed to start recording. Please check microphone permissions.');
      console.error(error);
    }
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);

    try {
      const audioBlob = await stopRecording();
      const aiService = new AIService(aiConfig);

      const transcribedText = await aiService.transcribeAudio(audioBlob);

      const speakerMatch = transcribedText.toLowerCase().includes('doctor') ||
                          transcribedText.toLowerCase().includes('patient');

      const newTranscripts: Transcript[] = [];

      if (speakerMatch) {
        const lines = transcribedText.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const isDoctor = line.toLowerCase().includes('doctor:');
          const text = line.replace(/^(doctor:|patient:)/i, '').trim();
          if (text) {
            newTranscripts.push({
              id: crypto.randomUUID(),
              speaker: isDoctor ? 'doctor' : 'patient',
              text,
              timestamp: new Date(),
            });
          }
        });
      } else {
        newTranscripts.push({
          id: crypto.randomUUID(),
          speaker: 'patient',
          text: transcribedText,
          timestamp: new Date(),
        });
      }

      setTranscripts(prev => [...prev, ...newTranscripts]);

      const allTranscripts = [...transcripts, ...newTranscripts];
      if (allTranscripts.length > 0) {
        const decision = await aiService.generateClinicalDecision(allTranscripts);
        setClinicalDecision(decision);
        setActiveTab('analysis');
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Failed to process recording. Please check your AI model configuration.');
    } finally {
      setIsProcessing(false);
      setRecordingStartTime(null);
    }
  };

  const handleNewConversation = () => {
    setTranscripts([]);
    setClinicalDecision(null);
    setPatientName('');
    setPatientId('');
    setActiveTab('transcript');
  };

  const formatDuration = () => {
    if (!recordingStartTime) return '00:00';
    const now = new Date();
    const diff = Math.floor((now.getTime() - recordingStartTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Decision Support</h1>
                <p className="text-sm text-gray-600">AI-Powered Medical Documentation & Analysis</p>
              </div>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <PatientInfo
            patientName={patientName}
            patientId={patientId}
            onPatientNameChange={setPatientName}
            onPatientIdChange={setPatientId}
            disabled={isRecording || isProcessing}
          />

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isRecording ? (isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse') : 'bg-gray-300'
                }`} />
                <span className="font-semibold text-gray-900">
                  {isRecording ? (isPaused ? 'Recording Paused' : 'Recording in Progress') : 'Ready to Record'}
                </span>
                {isRecording && (
                  <span className="text-sm text-gray-600 ml-2">
                    {formatDuration()}
                  </span>
                )}
              </div>
              {transcripts.length > 0 && !isRecording && !isProcessing && (
                <button
                  onClick={handleNewConversation}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  New Conversation
                </button>
              )}
            </div>

            <div className="flex justify-center">
              <RecordingControls
                isRecording={isRecording}
                isPaused={isPaused}
                onStart={handleStartRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                onStop={handleStopRecording}
              />
            </div>

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Processing conversation and generating clinical insights...</p>
              </div>
            )}
          </div>

          {(transcripts.length > 0 || clinicalDecision) && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'transcript'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    Conversation Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === 'analysis'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    Clinical Analysis
                    {clinicalDecision && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        Ready
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'transcript' ? (
                  <TranscriptView transcripts={transcripts} />
                ) : clinicalDecision ? (
                  <ClinicalDecisionView decision={clinicalDecision} />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Complete a recording to see clinical analysis
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={aiConfig}
        onConfigChange={setAiConfig}
      />
    </div>
  );
}

export default App;
