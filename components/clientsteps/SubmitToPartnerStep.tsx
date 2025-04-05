import React, { useState } from 'react';

export default function SubmitToPartnerStep() {
  // State for email recipient
  const [email, setEmail] = useState('');

  // Dummy documents (same as DocumentStep for consistency)
  const attachedDocs = [
    { id: 1, type: 'Recommendation', name: 'recommendation_letter.pdf' },
    { id: 2, type: 'Progress Report/Transcript', name: 'transcript_2025.pdf' },
    { id: 3, type: 'IELTS Certificate', name: 'ielts_cert_12345.pdf' },
    { id: 4, type: 'Passport', name: 'passport_a123456.pdf' },
  ];

  // Pre-written email body
  const [emailBody, setEmailBody] = useState(
    `Subject: Client Document Submission for Placement\n\nDear [Partner Name],\n\nI hope this email finds you well. Attached are the required documents for the placement of our client:\n\n- Recommendation: recommendation_letter.pdf\n- Progress Report/Transcript: transcript_2025.pdf\n- IELTS Certificate: ielts_cert_12345.pdf\n- Passport: passport_a123456.pdf\n\nPlease review the documents at your convenience and let us know if any additional information is required. Thank you for your partnership!\n\nBest regards,\n[Your Name]\n[Your Company]`
  );

  // Simulate sending email
  const handleSend = () => {
    if (!email) {
      alert('Please enter a recipient email address.');
      return;
    }
    alert(`Email sent to ${email} with attached documents:\n${attachedDocs.map(doc => doc.name).join(', ')}\n\nBody:\n${emailBody}`);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Email Form */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Submit Documents to Partner</h4>

        {/* Email Recipient */}
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">Recipient Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., partner@example.com"
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
          />
        </div>

        {/* Attached Documents */}
        <div className="space-y-2">
          <label className="block text-xs font-light text-gray-500 mb-1">Attached Documents</label>
          <ul className="space-y-1">
            {attachedDocs.map((doc) => (
              <li key={doc.id} className="text-sm text-gray-700">
                {doc.type}: <span className="text-orionte-green">{doc.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Body */}
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">Email Body</label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            rows="10"
          />
        </div>

        {/* Send Button */}
        <div>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-orionte-green text-white rounded-lg hover:bg-orionte-green/80 focus:outline-none focus:ring-2 focus:ring-orionte-green"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}