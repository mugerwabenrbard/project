import React, { useState, useEffect } from 'react';

export default function VisaStep() {
  // State for visa status
  const [visaStatus, setVisaStatus] = useState('submitted');
  const [appointmentDate, setAppointmentDate] = useState('');

  // State for Payment Sub-Step
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const serviceType = 'After Contract'; // Fixed service type
  const visaPrice = 4000000; // 4M UGX
  const [balance, setBalance] = useState(visaPrice.toString()); // Auto-calculated

  // Update balance when payment amount changes
  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const newBalance = visaPrice - amount;
    setBalance(newBalance >= 0 ? newBalance.toString() : '0');
  }, [paymentAmount]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Visa Status */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Visa Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Status Update</label>
            <select
              value={visaStatus}
              onChange={(e) => setVisaStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              <option value="submitted">Application for Visa Submitted</option>
              <option value="appointment">Appointment Date Received</option>
            </select>
          </div>

          {/* Conditional Appointment Date Field */}
          {visaStatus === 'appointment' && (
            <div>
              <label className="block text-xs font-light text-gray-500 mb-1">Appointment Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
              />
            </div>
          )}
        </div>
      </div>

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
              placeholder="e.g., 4000000"
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