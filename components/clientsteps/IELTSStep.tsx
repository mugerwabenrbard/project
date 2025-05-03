import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MakePayment from '../MakePayment';

interface IELTSStepProps {
  leadId: number | string;
  stageId?: number | string;
  onSuccess?: () => void;
  completed?: boolean;
  initialData?: any;
  onCloseAccordion?: () => void;
}

export default function IELTSStep(props: IELTSStepProps) {
  const {
    leadId,
    stageId,
    initialData,
    completed,
    onSuccess,
    onCloseAccordion

  } = props;

  // State for Document Upload
  const [uploadedDoc, setUploadedDoc] = React.useState<any>(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);

  // Fetch the uploaded IELTS document
  const fetchUploadedIELTSDoc = React.useCallback(async () => {
    if (!leadId) return;
    try {
      const res = await fetch(`/api/documents/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        const ieltsDocs = (data.documents || []).find((doc: any) => doc.type === 'IELTS');
        setUploadedDoc(ieltsDocs || null);
      }
    } catch {
      setUploadedDoc(null);
    }
  }, [leadId]);

  React.useEffect(() => {
    fetchUploadedIELTSDoc();
  }, [fetchUploadedIELTSDoc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFile(file);
  };

  // Step state
  const [step, setStep] = useState<number>(1);
  const [outstandingBalance, setOutstandingBalance] = useState<number>(0);

  // Payment price state
  const [ieltsPrices, setIELTSPrices] = React.useState<number>(0);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Fetch IELTS price from backend
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/service-prices', { credentials: 'include' });
        if (res.ok) {
          const services = await res.json();
          const ielts = services.find((s: any) => s.name === 'IELTS Test');
          if (ielts) setIELTSPrices(Number(ielts.price));
        }
      } catch {
        setIELTSPrices(0);
      }
    };
    fetchPrice();
  });

  // Check if full payment for IELTS has been made
  const checkPayment = React.useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/payments/total-paid?leadId=${leadId}&type=IELTS Test`, { credentials: 'include' });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Payment status fetch error:', errorText);
        toast.error(`Failed to check payment status: ${errorText}`);
        return;
      }
      const data = await res.json();
      const totalPaid = data.totalPaid || 0;
      const priceRes = await fetch('/api/service-prices', { credentials: 'include' });
      const priceData = await priceRes.json();
      const ieltsPrices = priceData.find((p: any) => p.name === 'IELTS Test')?.price || 0;

      // Ensure full payment is made before advancing
      if (totalPaid === ieltsPrices) {
        setStep(2);
        setOutstandingBalance(0);
      } else {
        setStep(1);
        const remainingBalance = ieltsPrices - totalPaid;
        setOutstandingBalance(remainingBalance);
      }
    } catch (err) {
      console.error('Payment check error:', err);
      toast.error(`Error checking payment status: ${err instanceof Error ? err.message : 'Unknown error'}`);
      // Ensure we stay on payment step if there's an error
      setStep(1);
    }
  }, [leadId, setStep]);

  useEffect(() => {
    checkPayment();
  }, [checkPayment]);

  const handleUploadSuccess = async () => {
    if (!documentFile) {
      toast.error('Please select a document to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', documentFile);
      formData.append('type', initialData?.stageName);
      
      const res = await fetch(`/api/documents/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to upload document');
        setUploading(false);
        return;
      }

      toast.success('IELTS document uploaded successfully!');
      setDocumentFile(null);
      setUploading(false);
      await fetchUploadedIELTSDoc();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Failed to upload document');
      setUploading(false);
    }
  };

  if (ieltsPrices === 0) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <span className="text-gray-500">Loading payment information...</span>
      </div>
    );
  }

  if (ieltsPrices == null) {
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

      {/* Step 2: Document Upload */}
      {step === 2 && !uploadedDoc && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleUploadSuccess();
          }}
        >
          <h4 className="text-sm font-medium text-gray-800">IELTS Document Upload</h4>
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
                value={initialData?.stageName}
                readOnly
                className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-light text-gray-500 mb-1">Upload Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-orionte-green file:text-white hover:file:bg-orionte-green/80"
              />
              {documentFile && (
                <p className="mt-2 text-xs text-gray-600">Selected: {documentFile.name}</p>
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

      {/* Uploaded Document Listing */}
      {uploadedDoc && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between mb-4">
          <div>
            <span className="font-medium text-green-800">Uploaded:</span> <span className="text-green-700">{uploadedDoc.filename}</span>
          </div>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            onClick={() => setShowEdit(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}