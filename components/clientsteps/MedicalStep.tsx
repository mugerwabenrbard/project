import React from 'react';

export default function MedicalStep() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Sub-Step 1: Payment (Completed by Default) */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Payment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Amount</label>
            <input
              type="number"
              value="150.00"
              disabled
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Date</label>
            <input
              type="date"
              value="2025-03-01"
              disabled
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Status</label>
            <select
              value="paid"
              disabled
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Step 2: Status & Report (Pending) */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Medical Status & Report</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Medical Status</label>
            <select
              value="not_started"
              disabled
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Attach Report</label>
            <input
              type="file"
              disabled
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-light text-gray-500 mb-1">Notes</label>
            <textarea
              value=""
              placeholder="Awaiting medical report..."
              disabled
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700"
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}