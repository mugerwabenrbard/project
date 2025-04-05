import React, { useState } from 'react';

export default function DocumentStep() {
  // State for dropdown selection
  const [selectedDocument, setSelectedDocument] = useState('');

  // Dummy uploaded documents (predefined)
  const dummyDocs = [
    { id: 1, type: 'Recommendation', name: 'recommendation_letter.pdf' },
    { id: 2, type: 'Progress Report/Transcript', name: 'transcript_2025.pdf' },
    { id: 3, type: 'IELTS Certificate', name: 'ielts_cert_12345.pdf' },
    { id: 4, type: 'Passport', name: 'passport_a123456.pdf' },
  ];

  // State for uploaded documents, initialized with dummy data
  const [uploadedDocs, setUploadedDocs] = useState(dummyDocs);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedDocument) {
      const newDoc = {
        id: Date.now(), // Unique ID for deletion
        type: selectedDocument,
        name: file.name,
        file: file, // Store file object (for real apps, you'd upload to a server)
      };
      setUploadedDocs((prev) => [...prev, newDoc]);
      setSelectedDocument(''); // Reset dropdown after upload
      e.target.value = ''; // Clear file input
    }
  };

  // Handle document deletion
  const handleDelete = (id) => {
    setUploadedDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  // Simulate opening a document (placeholder)
  const handleOpen = (docName) => {
    alert(`Opening ${docName} (simulated - in a real app, this would link to the file)`);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Overall Status: Pending</p>

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800">Uploaded Documents</h4>
          <ul className="space-y-2">
            {uploadedDocs.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{doc.type}:</span>
                  <button
                    onClick={() => handleOpen(doc.name)}
                    className="text-sm text-orionte-green hover:underline focus:outline-none"
                  >
                    {doc.name}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Document Upload Form */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-800">Upload New Document</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Document Type</label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
            >
              <option value="" disabled>
                Select a document type
              </option>
              <option value="Recommendation">Recommendation</option>
              <option value="Progress Report/Transcript">Progress Report/Transcript</option>
              <option value="IELTS Certificate">IELTS Certificate</option>
              <option value="Passport">Passport</option>
              <option value="Driver’s License">Driver’s License</option>
              <option value="CV">CV</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Upload Document</label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={!selectedDocument} // Disable until a type is selected
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}