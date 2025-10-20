import { ClinicalDecision } from '../types';
import { AlertTriangle, FileText, TestTube, Pill, Calendar, ClipboardList } from 'lucide-react';

interface ClinicalDecisionViewProps {
  decision: ClinicalDecision;
}

export const ClinicalDecisionView = ({ decision }: ClinicalDecisionViewProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-6 h-6" />
          <h3 className="text-xl font-bold">Clinical Summary</h3>
        </div>
        <p className="text-blue-50 leading-relaxed">{decision.summary}</p>
      </div>

      {decision.redFlags.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Red Flags - Immediate Attention Required</h3>
          </div>
          <ul className="space-y-2">
            {decision.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 font-bold">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Symptoms Identified</h3>
          </div>
          <ul className="space-y-2">
            {decision.symptoms.map((symptom, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-600">•</span>
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TestTube className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Recommended Tests</h3>
          </div>
          <ul className="space-y-2">
            {decision.recommendedTests.map((test, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-blue-600">•</span>
                <span>{test}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Potential Diagnoses</h3>
        </div>
        <div className="space-y-4">
          {decision.diagnosisSuggestions.map((suggestion, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{suggestion.diagnosis}</span>
                <span className="text-sm font-medium text-blue-600">
                  {suggestion.confidence > 0 ? `${(suggestion.confidence * 100).toFixed(0)}% confidence` : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Treatment Suggestions</h3>
        </div>
        <ul className="space-y-2">
          {decision.treatmentSuggestions.map((treatment, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-blue-600">•</span>
              <span>{treatment}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-700" />
          <h3 className="text-lg font-semibold text-blue-900">Follow-up Recommendations</h3>
        </div>
        <p className="text-blue-800 leading-relaxed">{decision.followUpRecommendations}</p>
      </div>
    </div>
  );
};
