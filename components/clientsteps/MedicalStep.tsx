import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

interface MedicalStepProps {
  leadId: number | string;
  stageId?: number | string;
  onSuccess?: () => void;
  completed?: boolean;
}

export default function MedicalStep({ leadId, stageId, onSuccess, completed }: MedicalStepProps) {
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch medical documents for this lead
  React.useEffect(() => {
    if (!leadId) return;
    setLoading(true);
    fetch(`/api/documents/${leadId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        // Only show medical reports
        setUploadedDocs((data.documents || []).filter((d: any) => d.type === 'Medical Report'));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [leadId]);

  // Upload handler
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('leadId', String(leadId));
      formData.append('type', 'Medical Report');
      
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload document');
      }
      toast.success('Medical report uploaded successfully!');
      // Refetch docs
      const docsRes = await fetch(`/api/documents/${leadId}`);
      const docsData = await docsRes.json();
      setUploadedDocs((docsData.documents || []).filter((d: any) => d.type === 'Medical Report'));
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this medical report?')) return;
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
      toast.success('Medical report deleted successfully!');
      // Refetch docs
      const docsRes = await fetch(`/api/documents/${leadId}`);
      const docsData = await docsRes.json();
      setUploadedDocs((docsData.documents || []).filter((d: any) => d.type === 'Medical Report'));
      if (typeof onSuccess === 'function') onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }
    await handleFileUpload(file);
  };


  return (
    <div className="space-y-8">
      {/* Medical Payment Card */}
      <div className="bg-white rounded-lg p-4 shadow-corporate max-w-2xl mx-auto mb-6">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-orionte-green mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z" />
          </svg>
          <h2 className="text-lg font-light tracking-wider">Payment Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Medical Fee Status</label>
            <input
              type="text"
              value="Paid"
              disabled
              className="w-full p-2 bg-green-100 rounded-lg border border-green-300 text-green-800 font-semibold text-base cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Amount</label>
            <input
              type="text"
              value="150.00"
              disabled
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-base cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Uploaded Medical Reports Preview */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading medical reports...</div>
      ) : uploadedDocs.length === 0 ? (
        <div className="text-gray-400 text-sm italic">No medical reports uploaded yet.</div>
      ) : (
        <ul className="space-y-2 mb-6">
          {uploadedDocs.map((doc: any) => (
            <li key={doc.id} className="flex items-center justify-between bg-gray-50 rounded p-2 border border-gray-200">
              <div className="flex items-center space-x-3">
                {doc.fileUrl && /\.(jpg|jpeg|png)$/i.test(doc.fileUrl) ? (
                  <img src={doc.fileUrl} alt={doc.name || 'Medical Report'} className="w-12 h-12 object-cover rounded border" />
                ) : doc.fileUrl && /\.pdf$/i.test(doc.fileUrl) ? (
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center space-x-1">
                    <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>View PDF</span>
                  </a>
                ) : (
                  <span className="text-gray-500">Unknown file</span>
                )}
                <span className="text-gray-700 text-sm">{doc.name || doc.fileUrl.split('/').pop()}</span>
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
      )}

      {/* Medical Report Upload Form */}
      <form className="space-y-6 bg-white rounded-xl shadow p-6 border border-gray-100 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">Type of Document</label>
          <input
            type="text"
            value="Medical Report"
            disabled
            className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">Upload File</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-orionte-green text-white rounded hover:bg-orionte-green/80 focus:outline-none focus:ring-2 focus:ring-orionte-green w-full font-semibold text-base"
          disabled={submitting}
        >
          {submitting ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {/* Mark Complete Button */}
      <div className="mt-4">
        {completed ? (
          <div className="flex items-center space-x-2 text-green-700 font-semibold">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Medical Completed</span>
          </div>
        ) : (
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded mt-2 font-semibold disabled:opacity-60"
            onClick={async () => {
              if (!uploadedDocs.length) {
                toast.error('Upload at least one medical report before completing the step.');
                return;
              }
              if (!stageId) {
                toast.error('No stage ID found for this step.');
                return;
              }
              setSubmitting(true);
              try {
                const res = await fetch(`/api/stages/${stageId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ completed: true }),
                  credentials: 'include',
                });
                if (!res.ok) {
                  const errData = await res.json();
                  throw new Error(errData.message || 'Failed to mark stage complete');
                }
                toast.success('Medical check marked as complete!');
                if (typeof onSuccess === 'function') onSuccess();
              } catch (err: any) {
                toast.error(err.message || 'Error marking stage complete');
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting || !uploadedDocs.length}
          >
            {submitting ? 'Processing...' : 'Mark Medical Check Complete'}
          </button>
        )}
      </div>
    </div>
  );
}