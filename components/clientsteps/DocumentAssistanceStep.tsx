import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

interface DocumentStepProps {
  leadId: number | string;
  stageId?: number | string;
  onSuccess?: () => void;
}

export default function DocumentStep({ leadId, stageId, onSuccess }: DocumentStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDocument, setSelectedDocument] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch docs and payments for this lead
  useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    fetch(`/api/documents/${leadId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch lead data');
        const data = await res.json();
        setUploadedDocs(data.documents || []);
      })
      .catch((err) => {
        setError(err.message);
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  }, [leadId]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!selectedDocument) {
      setError('Please select a document type before uploading.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('leadId', String(leadId));
      formData.append('type', selectedDocument);
      // Add notes/paymentId if needed

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload document');
      }
      toast.success('Document uploaded successfully!');
      // Refetch documents
      const docsRes = await fetch(`/api/documents/${leadId}`);
      const docsData = await docsRes.json();
      setUploadedDocs(docsData.documents || []);
      setError('');
      setSelectedFile(null); // Reset file after upload
      setSelectedDocument(''); // Reset document type after upload
      // Optionally, reset the file input if you have a ref to it
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      const message = err.message || 'Failed to upload document';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle document deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete document');
      }
      toast.success('Document deleted successfully!');
      // Refetch documents
      const docsRes = await fetch(`/api/documents/${leadId}`);
      const docsData = await docsRes.json();
      setUploadedDocs(docsData.documents || []);
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting document');
    } finally {
      setLoading(false);
    }
  };


  // Simulate opening a document (placeholder)
  const handleOpen = (docName: string) => {
    alert(`Opening ${docName} (simulated)`);
  };



  return (
    <div className="space-y-6">
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
                    onClick={() => handleOpen(doc.name || doc.fileUrl)}
                    className="text-sm text-orionte-green hover:underline focus:outline-none"
                  >
                    {doc.name || doc.fileUrl}
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Document Upload Form */}
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (selectedFile) {
            await handleFileUpload(selectedFile);
          }
        }}
      >
        <h4 className="text-sm font-medium text-gray-800">Upload New Document</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Document Type</label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orionte-green"
              required
            >
              <option value="" disabled>
                Select a document type
              </option>
              {[
                'Recommendation',
                'Progress Report/Transcript',
                'IELTS Certificate',
                'Passport',
                'Driver’s License',
                'CV',
              ].map((docType) => {
                const isUploaded = uploadedDocs.some((doc) => doc.type === docType);
                return (
                  <option key={docType} value={docType} disabled={isUploaded} style={isUploaded ? { color: '#aaa' } : {}}>
                    {docType} {isUploaded ? '(uploaded)' : ''}
                  </option>
                );
              })}
            </select>

          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Upload Document</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const files = e.target.files;
                if (!files || files.length === 0) {
                  setSelectedFile(null);
                  return;
                }
                setSelectedFile(files[0]);
              }}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            !selectedDocument ||
            !selectedFile
          }
          className="px-4 py-2 bg-orionte-green text-white rounded disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      {/* Step Complete Button */}
      <div className="mt-6">
        {/* Debug: show missing required docs if button is disabled */}
        {(() => {
          const requiredTypes = [
            'Recommendation',
            'Progress Report/Transcript',
            'IELTS Certificate',
            'Passport',
            'Driver’s License',
            'CV',
          ];
          const uploadedTypes = uploadedDocs.map((doc) => doc.type);
          const missingTypes = requiredTypes.filter((type) => !uploadedTypes.includes(type));
          const shouldShow = !loading && missingTypes.length > 0;
          if (shouldShow) {
            return (
              <div className="text-xs text-red-500 mb-2">
                <span>Missing: {missingTypes.join(', ')}</span>
              </div>
            );
          }
          return null;
        })()} 
        <button
          type="button"
          disabled={
            loading ||
            !uploadedDocs.length ||
            ![
              'Recommendation',
              'Progress Report/Transcript',
              'IELTS Certificate',
              'Passport',
              'Driver’s License',
              'CV',
            ].every((docType) => uploadedDocs.some((doc) => doc.type === docType))
          }
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          onClick={async () => {
            if (!uploadedDocs.length) return;
            if (!stageId) {
              toast.error('Cannot mark step complete: no stage ID found for this step.');
              return;
            }
            setLoading(true);
            try {
              const res = await fetch(`/api/stages/${stageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: true }),
                credentials: 'include',
              });
              if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to mark step complete');
              }
              toast.success('Step marked as complete!');
              if (typeof onSuccess === 'function') onSuccess();
            } catch (err: any) {
              toast.error(err.message || 'Error completing step');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Processing...' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}