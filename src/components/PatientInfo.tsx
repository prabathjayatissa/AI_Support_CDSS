import { User } from 'lucide-react';

interface PatientInfoProps {
  patientName: string;
  patientId: string;
  onPatientNameChange: (name: string) => void;
  onPatientIdChange: (id: string) => void;
  disabled?: boolean;
}

export const PatientInfo = ({
  patientName,
  patientId,
  onPatientNameChange,
  onPatientIdChange,
  disabled = false,
}: PatientInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name
          </label>
          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(e) => onPatientNameChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter patient name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
            Patient ID
          </label>
          <input
            id="patientId"
            type="text"
            value={patientId}
            onChange={(e) => onPatientIdChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter patient ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
