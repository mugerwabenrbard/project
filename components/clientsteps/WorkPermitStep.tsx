import React, { useState, useEffect } from 'react';

export default function WorkPermitStep() {
  // State for work permit upload
  const [workPermitFile, setWorkPermitFile] = useState(null);

  // State for Payment Sub-Step
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const serviceType = 'Work Permit Processing'; // Fixed service type
  const permitPrice = 7100000; // 7.1M UGX
  const [balance, setBalance] = useState(permitPrice.toString()); // Auto-calculated

  // Update balance when payment amount changes
  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const newBalance = permitPrice - amount;
    setBalance(newBalance >= 0 ? newBalance.toString() : '0');
  }, [paymentAmount]);

  // Handle file upload for work permit
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setWorkPermitFile(file);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Payment Sub-Step */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Payment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Service Type</label>
            <input
              type="text"
              value={serviceType}
              disabled
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Amount (UGX)</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g., 7100000"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Balance (UGX)</label>
            <input
              type="text"
              value={balance}
              disabled
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Work Permit Upload */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Work Permit Receipt</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Upload Work Permit</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
            />
            {workPermitFile && (
              <p className="mt-2 text-xs text-gray-600">Selected: {workPermitFile.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}