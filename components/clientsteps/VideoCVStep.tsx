import React, { useState } from 'react';

export default function VideoCVStep() {
  // State for Payment Sub-Step
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // State for Video Upload & Status Sub-Step
  const [videoStatus, setVideoStatus] = useState('not_started');
  const [videoFile, setVideoFile] = useState(null);
  const [comments, setComments] = useState('');

  // Handlers for file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Sub-Step 1: Payment */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Payment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Payment Amount</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="e.g., 200.00"
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
        </div>
      </div>

      {/* Sub-Step 2: Video Upload & Status */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Video CV Upload & Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Video Status</label>
            <select
              value={videoStatus}
              onChange={(e) => setVideoStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Upload Video</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/*"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
            />
            {videoFile && (
              <p className="mt-2 text-xs text-gray-600">Selected: {videoFile.name}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-light text-gray-500 mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments about the video CV..."
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}