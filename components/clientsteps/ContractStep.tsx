import React, { useState, useEffect } from 'react';

export default function ContractStep() {
  // State for contract status
  const [contractStatus, setContractStatus] = useState('partner_preparing');

  // State for email fields
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Signed Contract Submission');
  const [body, setBody] = useState(
    `Dear [Partner Name],\n\nPlease find attached the signed contract for [Client Name]. Let us know if there are any further requirements.\n\nBest regards,\n[Your Name]\n[Your Company]`
  );
  const [signedContract, setSignedContract] = useState(null);

  // State for Payment Sub-Step
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const serviceType = 'Commitment fee'; // Fixed service type
  const commitmentFee = 2800000; // 2.8M UGX
  const [balance, setBalance] = useState(commitmentFee.toString()); // Auto-calculated

  // Update balance when payment amount changes
  useEffect(() => {
    const amount = parseFloat(paymentAmount) || 0;
    const newBalance = commitmentFee - amount;
    setBalance(newBalance >= 0 ? newBalance.toString() : '0');
  }, [paymentAmount]);

  // Handle file upload for signed contract
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSignedContract(file);
  };

  // Simulate sending email
  const handleSend = () => {
    if (!recipient || !signedContract) {
      alert('Please enter a recipient email and upload the signed contract.');
      return;
    }
    alert(
      `Email sent:\nFrom: staff@example.com\nTo: ${recipient}\nSubject: ${subject}\nBody: ${body}\nAttached: ${signedContract.name}`
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Contract Status */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Contract Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Status Update</label>
            <select
              value={contractStatus}
              onChange={(e) => setContractStatus(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              <option value="partner_preparing">Partner Preparing Contract</option>
              <option value="received">We Received Contract</option>
              <option value="sign">Sign Contract</option>
              <option value="send_back">Send Back After Signing</option>
            </select>
          </div>
        </div>

        {/* Email Interface for Send Back */}
        {contractStatus === 'send_back' && (
          <div className="space-y-4 mt-4">
            <h4 className="text-sm font-medium text-gray-800">Send Signed Contract</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Sender</label>
                <input
                  type="email"
                  value="staff@example.com"
                  disabled
                  className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Recipient</label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., partner@example.com"
                  required
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-light text-gray-500 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-light text-gray-500 mb-1">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
                  rows="6"
                />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Upload Signed Contract</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
                />
                {signedContract && (
                  <p className="mt-2 text-xs text-gray-600">Selected: {signedContract.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-orionte-green text-white rounded-lg hover:bg-orionte-green/80 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              Send Email
            </button>
          </div>
        )}
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
              placeholder="e.g., 1400000"
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