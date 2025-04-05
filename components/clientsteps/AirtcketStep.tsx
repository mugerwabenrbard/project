import React, { useState } from 'react';

export default function AirTicketStep() {
  // State for travel date and air ticket upload
  const [travelDate, setTravelDate] = useState('');
  const [airTicketFile, setAirTicketFile] = useState(null);

  // Handle file upload for air ticket
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAirTicketFile(file);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Air Ticket Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Air Ticket Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Date of Travel</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Upload Air Ticket (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
            />
            {airTicketFile && (
              <p className="mt-2 text-xs text-gray-600">Selected: {airTicketFile.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}