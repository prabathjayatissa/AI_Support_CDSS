import { X, Settings as SettingsIcon } from 'lucide-react';
import { AIModelConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIModelConfig;
  onConfigChange: (config: AIModelConfig) => void;
}

export const SettingsModal = ({ isOpen, onClose, config, onConfigChange }: SettingsModalProps) => {
  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">AI Model Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
            <p className="text-sm text-blue-800 mb-2">
              This application requires a local AI model for transcription and clinical analysis.
            </p>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Recommended setup:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• Install Ollama or LM Studio locally</li>
              <li>• Download a medical-focused model (e.g., llama3, mistral)</li>
              <li>• Start the local server (default: http://localhost:11434)</li>
              <li>• Configure the endpoint below</li>
            </ul>
          </div>

          <div>
            <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint URL
            </label>
            <input
              id="endpoint"
              type="url"
              value={config.endpoint}
              onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
              placeholder="http://localhost:11434"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: http://localhost:11434 (Ollama) or http://localhost:1234 (LM Studio)
            </p>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model Name
            </label>
            <input
              id="model"
              type="text"
              value={config.model}
              onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
              placeholder="llama3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              The name of the model installed on your local server
            </p>
          </div>

          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key (Optional)
            </label>
            <input
              id="apiKey"
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
              placeholder="Leave empty for local models"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only required if your AI service requires authentication
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
