"use client";
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * PaymentModal Props
 * - open: whether modal is visible
 * - onClose: close handler
 * - onSubmit: submit handler (receives payment data)
 * - defaultValues: { clientId, type, amount, paidAmount, status, method, transactionId }
 * - fieldConfig: controls which fields are shown, readOnly, required, etc
 * - prices: any extra prices to display (optional)
 * - title: modal title (string or ReactNode)
 * - uploadProof: whether to show file upload field
 * - onFileChange: file upload handler (optional)
 * - isLoading: disables submit button if true
 */

export interface PaymentModalProps {
  onClose?: () => void;
  onSubmit: (data: any) => void;
  defaultValues?: {
    clientId?: string | number;
    type?: string;
    amount?: string | number;
    status?: string;
    method?: string;
    transactionId?: string;
  };
  fieldConfig?: {
    clientId?: { readOnly?: boolean; label?: string; show?: boolean };
    type?: { readOnly?: boolean; label?: string; show?: boolean; options?: { value: string; label: string }[] };
    amount?: { readOnly?: boolean; label?: string; show?: boolean };
    status?: { label?: string; show?: boolean };
    method?: { label?: string; show?: boolean; options?: { value: string; label: string }[] };
    transactionId?: { label?: string; show?: boolean; autoGenerate?: boolean };
    file?: { label?: string; show?: boolean; required?: boolean };
  };
  prices?: Record<string, number>;
  title?: React.ReactNode;
  uploadProof?: boolean;
  onFileChange?: (file: File | null) => void;
  isLoading?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onSubmit,
  defaultValues = {},
  fieldConfig = {},
  prices = {},
  title = 'Make Payment',
  uploadProof = false,
  onFileChange,
  isLoading = false,
}) => {
  interface PaymentForm {
  clientId: string | number;
  type: string;
  amount: string | number;
  paidAmount: string | number;
  balance: string;
  status: string;
  method: string;
  transactionId: string;
  file: File | null;
}

const [form, setForm] = useState<PaymentForm>({
  clientId: defaultValues.clientId || '',
  type: defaultValues.type || '',
  amount: defaultValues.amount || '',
  paidAmount: defaultValues.paidAmount || '',
  balance: '', // Will be set dynamically
  status: defaultValues.status || 'pending',
  method: defaultValues.method || '',
  transactionId: '',
  file: null,
});

  interface ServicePrice {
  name: string;
  price: number | string;
}

const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const [error, setError] = useState<string>('');

  // Update balance whenever amount or totalPaid changes
  useEffect(() => {
    const amountNum = Number(form.amount) || 0;
    const balance = amountNum - totalPaid;
    setForm((prev) => ({ ...prev, balance: balance.toString() }));
  }, [form.amount, totalPaid]);

  const generatedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    setLoadingPrice(true);
    fetch('/api/service-prices')
      .then(res => res.json())
      .then(data => {
        setServicePrices(data);
        setLoadingPrice(false);
      })
      .catch(() => setLoadingPrice(false));
  }, []);

  useEffect(() => {
    (async () => {
      const id = await generateTransactionId();
      let price = '';
      const typeToMatch = (defaultValues.type || '').toLowerCase();
      if (typeToMatch && servicePrices.length > 0) {
        const matched = servicePrices.find((s) => s.name.toLowerCase() === typeToMatch);
        if (matched) price = String(matched.price);
      }
      setForm({
        clientId: defaultValues.clientId || '',
        type: defaultValues.type || '',
        amount: price || defaultValues.amount || '',
        paidAmount: 0,
        balance: '',
        status: '',
        method: defaultValues.method || '',
        transactionId: id,
        file: null as File | null,
      });
    })();
  }, [servicePrices, defaultValues.type]);

  useEffect(() => {
    async function fetchTotalPaid() {
      if (defaultValues.clientId && defaultValues.type) {
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        const headers: Record<string, string> = {};
        if ((session as any)?.accessToken) {
          headers['Authorization'] = `Bearer ${(session as any).accessToken}`;
        }
        fetch(`/api/payments?leadId=${defaultValues.clientId}&type=${encodeURIComponent(defaultValues.type)}`,
          { headers, credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            type Payment = { status: string; paidAmount?: string | number; amount?: string | number };
            const paidSum = (Array.isArray(data) ? data as Payment[] : []).filter((p) => p.status === 'paid').reduce((sum, p) => sum + Number(p.paidAmount || p.amount || 0), 0);
            setTotalPaid(paidSum);
          })
          .catch(() => setTotalPaid(0));
      }
    }
    fetchTotalPaid();
  }, [defaultValues.clientId, defaultValues.type]);

  const reconciledBalance = Number(form.amount) - Number(totalPaid);

  useEffect(() => {
    const balanceStr = (form.amount === '' || isNaN(Number(form.amount))) ? '' : (Number(form.amount) - Number(totalPaid)).toFixed(2);
    if (form.balance !== balanceStr) {
      setForm((prev) => ({ ...prev, balance: balanceStr }));
    }
  }, [form.amount, totalPaid]);

  const handleAutoGenerateTransactionId = async () => {
    const id = await generateTransactionId();
    setForm((prev) => ({ ...prev, transactionId: id }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
    if (onFileChange) onFileChange(file);
  };

  const generateTransactionId = async (): Promise<string> => {
    let transactionId: string = '';
    let isUnique = false;
    let retries = 3;
    while (!isUnique && retries > 0) {
      transactionId = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      if (generatedIds.current.has(transactionId)) {
        continue;
      }
      try {
        const response = await fetch(`/api/payments?id=${transactionId}`, { credentials: 'include' });
        if (response.ok) {
          isUnique = true;
        }
      } catch (error) {
        retries--;
        if (retries === 0) {
          isUnique = !generatedIds.current.has(transactionId);
        }
      }
    }
    if (!isUnique) {
      transactionId = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
    }
    generatedIds.current.add(transactionId);
    return transactionId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if ((form.method === 'mobile_money' || form.method === 'visa') && uploadProof && !form.file) {
      setError('Proof of payment is required');
      return;
    }
    if (!form.transactionId) {
      setError('Transaction ID is required');
      return;
    }
    let fileUrl = '';
    if (form.method === 'cash') {
      fileUrl = 'Not Applicable';
    } else if ((form.method === 'mobile_money' || form.method === 'visa') && form.file) {
      const data = new FormData();
      data.append('file', form.file);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: data,
          credentials: 'include',
        });
        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadJson = await uploadRes.json();
        fileUrl = uploadJson.fileUrl || uploadJson.url || '';
      } catch (err) {
        setError('Failed to upload proof of payment');
        toast.error('Failed to upload proof of payment');
        return;
      }
    } else {
      fileUrl = 'Not Applicable';
    }
    // Compute status and paymentPayload before API call
    let status = form.status;
    if (Number(form.balance) <= 0) status = 'paid';
    else if (Number(form.paidAmount) > 0 && Number(form.balance) > 0) status = 'partial';
    else status = 'pending';
    const paymentPayload = {
      ...form,
      leadId: form.clientId,
      fileUrl,
      status,
    };

    try {
      const paymentRes = await fetch('/api/payments/total-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
        credentials: 'include',
      });
      if (!paymentRes.ok) {
        const errorJson = await paymentRes.json().catch(() => ({}));
        console.error('[handleSubmit] Payment API error:', errorJson);
        throw new Error(errorJson.error || 'Payment failed');
      }
      toast.success('Payment submitted successfully');
    } catch (err) {
      setError('Failed to upload proof of payment');
      toast.error('Failed to upload proof of payment');
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 payment-modal-form">
      <h2 className="col-span-2 text-lg font-semibold mb-4">{title}</h2>
      {/* Paid/Error messages */}
      {error && (
        <div className="col-span-2">
          <div className="error-message text-red-500 mb-2">{error}</div>
        </div>
      )}
      {/* Client ID */}
      {fieldConfig.clientId?.show !== false && (
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.clientId?.label || 'Client ID'}</label>
          <input
            type="text"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
            placeholder="Enter client ID"
          />
        </div>
      )}
      {/* Paid Amount */}
      {fieldConfig.paidAmount?.show && (
        <div>
          <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.paidAmount?.label || 'Paid Amount'}</label>
          <input
            type="number"
            name="paidAmount"
            value={form.paidAmount}
            onChange={handleChange}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
            placeholder="Enter paid amount"
          />
        </div>
      )}
      {/* Balance (read-only, always shown) */}
    {error && (
      <div className="col-span-2">
        <div className="error-message text-red-500 mb-2">{error}</div>
      </div>
    )}
    {/* Client ID */}
    {fieldConfig.clientId?.show !== false && (
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.clientId?.label || 'Client ID'}</label>
        <input
          type="text"
          name="clientId"
          value={form.clientId}
          onChange={handleChange}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
          placeholder="Enter client ID"
        />
      </div>
    )}
    {/* Type of Service */}
    {fieldConfig.type?.show !== false && (
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.type?.label || 'Type of Service'}</label>
        <input
          type="text"
          name="type"
          value={form.type}
          readOnly
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
          placeholder="Type of Service"
        />
      </div>
    )}
    {/* Total Amount */}
    {fieldConfig.amount?.show !== false && (
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.amount?.label || 'Total Amount'}</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
          placeholder="Enter total amount"
        />
      </div>
    )}
    {/* Transaction ID */}
    {fieldConfig.transactionId?.show !== false && (
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.transactionId?.label || 'Transaction ID'}</label>
        <input
          type="text"
          name="transactionId"
          value={form.transactionId}
          onChange={handleChange}
          readOnly={fieldConfig.transactionId?.autoGenerate}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
          placeholder="Enter transaction ID"
        />
      </div>
    )}
    {/* Balance (read-only, always shown) */}
    <div>
      <label className="block text-xs font-light text-gray-500 mb-1">Balance</label>
      <input
        type="text"
        name="balance"
        value={form.balance}
        readOnly
        className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-500"
        placeholder="Auto-calculated balance"
      />
    </div>
    {/* Payment Method */}
    {fieldConfig.method?.show && (
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.method?.label || 'Payment Method'}</label>
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
        >
          <option value="">Select method</option>
          {(fieldConfig.method?.options || [
            { value: 'mobile_money', label: 'Mobile Money' },
            { value: 'visa', label: 'Visa' },
            { value: 'cash', label: 'Cash' },
          ]).map((opt: { value: string; label: string }) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    )}
    {/* File Upload: Only show for mobile money or visa */}
    {uploadProof && fieldConfig.file?.show !== false && (form.method === 'mobile_money' || form.method === 'visa') && (
      <div className="col-span-2">
        <label className="block text-xs font-light text-gray-500 mb-1">{fieldConfig.file?.label || 'Proof of Payment'}{fieldConfig.file?.required && <span className="text-red-500">*</span>}</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#004225] file:text-white hover:file:bg-[#004225]/80"
        />
        {form.file && (
          <p className="mt-2 text-xs text-gray-600">Selected: {form.file.name}</p>
        )}
      </div>
    )}
    {/* Extra prices info (optional) */}
    {prices && Object.keys(prices).length > 0 && (
      <div className="col-span-2 grid grid-cols-2 gap-2">
        {Object.entries(prices).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xs font-light text-gray-500 mb-1">{key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</label>
            <input
              type="number"
              value={value}
              readOnly
              className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
            />
          </div>
        ))}
      </div>
    )}
    {/* Error Message */}
    {error && (
      <div className="col-span-2">
        <p className="text-red-500 text-sm mt-2">{error}</p>
      </div>
    )}
    {/* Actions */}
    <div className="col-span-2 flex justify-end space-x-4 mt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 font-light text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 rounded-lg text-white font-light tracking-wider bg-[#004225] hover:bg-[#004225]/90 transition-colors duration-300 text-sm disabled:opacity-60"
      >
        Save
      </button>
    </div>
  </form>
);
}
export default PaymentModal;
