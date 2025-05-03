import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MakePayment from '../MakePayment';

interface VideoCVStepProps {
  leadId: number | string;
  stageId?: number | string;
  onSuccess?: () => void;
  completed?: boolean;
  initialData?: any;
  /**
   * Called when the payment modal is closed (user closes or after successful payment).
   * Use this to close the accordion from the parent.
   */
  onCloseAccordion?: () => void;
}

export default function VideoCVStep(props: VideoCVStepProps) {
  const {
    leadId,
    stageId,
    initialData,
    completed,
    onSuccess,
    onCloseAccordion
  } = props;
  const [uploadedVideoDoc, setUploadedVideoDoc] = React.useState<any>(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  // Fetch the uploaded Video CV document
  const fetchUploadedVideoCV = React.useCallback(async () => {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/documents/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        const videoDoc = (data.documents || []).find((doc: any) => doc.type === 'Video CV');
        setUploadedVideoDoc(videoDoc || null);
      }
    } catch {
      setUploadedVideoDoc(null);
    }
  }, [leadId]);

  React.useEffect(() => {
    fetchUploadedVideoCV();
  }, [fetchUploadedVideoCV]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  // State for Video Upload & Status Sub-Step
  const [videoStatus, setVideoStatus] = useState('not_started');
  const [comments, setComments] = useState('');

  // Step state
  const [step, setStep] = useState<number>(1);
  const [outstandingBalance, setOutstandingBalance] = useState<number>(0);

  // Payment price state
  const [videoCVPrice, setVideoCVPrice] = React.useState<number>(0);
  const [paymentStepOpen, setPaymentStepOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Fetch Video CV price from backend
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/service-prices', { credentials: 'include' });
        if (res.ok) {
          const services = await res.json();
          const videoCV = services.find((s: any) => s.name === 'Video CV');
          if (videoCV) setVideoCVPrice(Number(videoCV.price));
        }
      } catch {
        setVideoCVPrice(null);
      }
    };
    fetchPrice();
  }, []);

  // Check if full payment for Video CV has been made; if not, force open the payment modal
  const checkPayment = React.useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/payments/total-paid?leadId=${leadId}&type=Video CV`);
      if (!res.ok) {
        toast.error('Failed to check payment status');
        return;
      }
      const data = await res.json();
      const totalPaid = data.totalPaid || 0;
      const priceRes = await fetch('/api/service-prices');
      const priceData = await priceRes.json();
      const videoCVPrice = priceData.find((p: any) => p.type === 'Video CV')?.price || 0;
      
      // Ensure full payment is made before advancing
      if (totalPaid >= videoCVPrice) {
        setStep(2);
        setOutstandingBalance(0);
      } else {
        setStep(1);
        const remainingBalance = videoCVPrice - totalPaid;
        setOutstandingBalance(remainingBalance);
        toast.warning(`Please complete the payment. Remaining balance: UGX ${remainingBalance.toLocaleString()}`);
      }
    } catch (err) {
      toast.error('Error checking payment status');
      // Ensure we stay on payment step if there's an error
      setStep(1);
    }
  }, [leadId, setStep, videoCVPrice]);

  useEffect(() => {
    checkPayment();
    // Only run on mount or when leadId or price changes
  }, [checkPayment]);



  if (videoCVPrice == null) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <span className="text-gray-500">Loading payment information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Payment */}
      {step === 1 && (
        <div className="space-y-4">
          <MakePayment
            leadId={leadId}
            stageId={stageId}
            initialData={initialData}
            completed={completed}
            onCloseAccordion={() => (null)}
            onSuccess={() => {
              // Only move to step 2 if full payment is confirmed
              checkPayment();
            }}
            onPaymentUpdate={checkPayment}
          />
        </div>
      )}

      {/* Step 2: Video Upload */}
      {step === 2 && !uploadedVideoDoc && (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!videoFile) {
              toast.error('Please select a video file to upload.');
              return;
            }
            try {
              setUploading(true);
              const formData = new FormData();
              formData.append('file', videoFile);
              const res = await fetch(`/api/videocv/${leadId}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
              });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || 'Failed to upload video');
                setUploading(false);
                return;
              }
              toast.success('Video uploaded successfully!');
              setVideoFile(null);
              setComments('');
              setUploading(false);
              if (onSuccess) onSuccess();
              if (onCloseAccordion) onCloseAccordion();
            } catch (err) {
              toast.error('Failed to upload video');
              setUploading(false);
            }
          }}
        >
          <h4 className="text-sm font-medium text-gray-800">Video CV Upload</h4>
          {outstandingBalance > 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-2">
              Outstanding Balance: UGX {outstandingBalance.toLocaleString()}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-light text-gray-500 mb-1">Type</label>
              <input
                type="text"
                value="Video CV"
                readOnly
                className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500"
              />
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
          </div>
          <div className="flex space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-orionte-green text-white rounded font-light tracking-wider hover:bg-orionte-green/90 transition-colors duration-300 text-sm"
              disabled={outstandingBalance > 0 || uploading}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Uploaded File Listing */}
      {uploadedVideoDoc && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between mb-4">
          <div>
            <span className="font-medium text-green-800">Uploaded:</span> <span className="text-green-700">{uploadedVideoDoc.fileUrl.split('/').pop()}</span>
          </div>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>
          {/* Edit Modal */}
          {showEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowEdit(false)}>&times;</button>
                <h4 className="text-lg font-semibold mb-4">Replace Video CV</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!videoFile) {
                      toast.error('Please select a video file to upload.');
                      return;
                    }
                    try {
                      setUploading(true);
                      const formData = new FormData();
                      formData.append('file', videoFile);
                      const res = await fetch(`/api/videocv/${leadId}`, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                      });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        toast.error(err.error || 'Failed to upload video');
                        setUploading(false);
                        return;
                      }
                      toast.success('Video replaced successfully!');
                      setVideoFile(null);
                      setShowEdit(false);
                      await fetchUploadedVideoCV();
                    } catch (err) {
                      toast.error('Failed to upload video');
                    } finally {
                      setUploading(false);
                    }
                  }}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="video/*"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 mb-4"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orionte-green text-white rounded font-light tracking-wider hover:bg-orionte-green/90 transition-colors duration-300 text-sm"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Replace'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}