import { Transcript } from '../types';
import { User, Stethoscope } from 'lucide-react';

interface TranscriptViewProps {
  transcripts: Transcript[];
}

export const TranscriptView = ({ transcripts }: TranscriptViewProps) => {
  if (transcripts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No conversation recorded yet. Start recording to see the transcript.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transcripts.map((transcript) => (
        <div
          key={transcript.id}
          className={`flex gap-3 p-4 rounded-lg ${
            transcript.speaker === 'doctor'
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'bg-green-50 border-l-4 border-green-500'
          }`}
        >
          <div className="flex-shrink-0">
            {transcript.speaker === 'doctor' ? (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-700">
                {transcript.speaker === 'doctor' ? 'Doctor' : 'Patient'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(transcript.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-800">{transcript.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
