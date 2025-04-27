'use client';
import React, { useEffect, useState } from 'react';

interface RegistrationDataTableProps {
  leadId: string;
  refreshKey?: number;
}

const RegistrationDataTable: React.FC<RegistrationDataTableProps> = ({ leadId, refreshKey }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lead, setLead] = useState<any>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    setError('');
    fetch(`/api/tracker/${leadId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch lead');
        const data = await res.json();
        setLead(data);
        // Find registration stage
        const regStage = data.stages?.find((s: any) => s.stageName?.toLowerCase() === 'registration');
        setShowTable(!!regStage?.completed);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [leadId, refreshKey]);

  if (loading) return <div>Loading registration data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!showTable) return null;

  // List the relevant registration fields from lead
  const fields = [
    'nextOfKin',
    'kinAddress',
    'kinPhoneNumber',
    'passportNumber',
    'passportIssueDate',
    'passportExpiryDate',
    'nin',
    'dob',
    'address',
    'chosenProgram',
  ];
  const data = lead || {};

  if (!data) return null;
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">Current Registration Data</h3>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <tbody>
          {
            fields.filter((key) => data[key]).length > 0 ?
              fields.filter((key) => data[key]).map((key) => (
                <tr key={key} className="border-b">
                  <td className="px-4 py-2 font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td className="px-4 py-2 text-gray-600">{data[key]}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-gray-500 text-center">No registration data available.</td>
                </tr>
              )
          }
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationDataTable;
