import { useState } from 'react';
import { Plus } from 'lucide-react';

interface ManualTranscriptEntryProps {
  onAddTranscript: (speaker: 'doctor' | 'patient', text: string) => void;
}

export const ManualTranscriptEntry = ({ onAddTranscript }: ManualTranscriptEntryProps) => {
  const [speaker, setSpeaker] = useState<'doctor' | 'patient'>('patient');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTranscript(speaker, text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Add Conversation Entry</h4>
      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => setSpeaker('doctor')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            speaker === 'doctor'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Doctor
        </button>
        <button
          type="button"
          onClick={() => setSpeaker('patient')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            speaker === 'patient'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Patient
        </button>
      </div>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Enter what the ${speaker} said...`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={2}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </form>
  );
};
