import React, { useState, useEffect } from 'react';

export default function AirportTransferStep() {
  // State for Payment Sub-Step
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const serviceType = 'Airport Transfer'; // Fixed service type
  const transferPrice = 160000; // 160,000 UGX
  const [balance, setBalance] = useState(transferPrice.toString()); // Auto-calculated

  // Update balance when payment amount changes
  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const newBalance = transferPrice - amount;
    setBalance(newBalance >= 0 ? newBalance.toString() : '0');
  }, [paymentAmount]);

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
              placeholder="e.g., 160000"
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
    </div>
  );
}