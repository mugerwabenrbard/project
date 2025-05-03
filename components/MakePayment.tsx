import React from 'react';
import { toast } from 'sonner';

interface MakePaymentProps {
  leadId: string | number | undefined;
  stageId: string | number | undefined;
  onSuccess: () => void;
  initialData: any;
  completed: boolean | undefined;
  onCloseAccordion: () => void;
  onPaymentUpdate?: () => void;
}

const MakePayment: React.FC<MakePaymentProps> = ({
  leadId,
  stageId,
  onSuccess,
  initialData,
  completed,
  onCloseAccordion,
  onPaymentUpdate,
}) => {
  // Placeholder: implement your payment logic here
  const [error, setError] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    let fileUrl = '';
    try {
      // Only upload file if method is Mobile Money or Card and file is present
      if ((form.method === 'Mobile Money' || form.method === 'Card') && form.file) {
        const formData = new FormData();
        formData.append('file', form.file);
        const uploadRes = await fetch('/api/payments/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (!uploadRes.ok) {
          setError('Failed to upload proof of payment');
          toast.error('Failed to upload proof of payment');
          setSubmitting(false);
          return;
        }
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url || '';
      } else {
        fileUrl = 'Not Applicable';
      }
      // Compute status based on paidAmount and balance
      const paidAmountNum = Number(form.paidAmount) || 0;
      const balanceNum = Number(form.balance) || 0;
      let status: 'partial' | 'paid';
      if (paidAmountNum < balanceNum) {
        status = 'partial';
      } else {
        status = 'paid';
      }
      const paymentPayload = {
        ...form,
        leadId: form.clientId,
        fileUrl,
        status,
      };
      const paymentRes = await fetch('/api/payments/total-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
        credentials: 'include',
      });
      if (!paymentRes.ok) {
        const errorJson = await paymentRes.json().catch(() => ({}));
        setError(errorJson.error || 'Payment failed');
        toast.error(errorJson.error || 'Payment failed');
        setSubmitting(false);
        return;
      }
      // Success
      setSubmitting(false);
      toast.success('Payment submitted successfully');
      refreshPayments();
      if (onPaymentUpdate) onPaymentUpdate();
      if (onSuccess) onSuccess();
      setSubmitting(false);

      // Reset form editable fields and regenerate transaction ID
      const newTransactionId = await generateTransactionId();
      setForm(prevForm => ({
        ...prevForm,
        paidAmount: '',
        transactionId: newTransactionId,
        file: null,
        method: ''
      }));
    } catch (err) {
      setError('Failed to submit payment');
      toast.error('Failed to submit payment');
      setSubmitting(false);
    }
  };

  const [form, setForm] = React.useState({
    paidAmount: '',
    clientId: leadId || '',
    type: initialData?.stageName || '',
    amount: '', // will be set from DB
    transactionId: '',
    balance: '',
    method: '',
    file: null as File | null,
  });

  const [servicePrices, setServicePrices] = React.useState<{ name: string; price: number | string }[]>([]);
  const [loadingPrice, setLoadingPrice] = React.useState(false);
  const [totalPaid, setTotalPaid] = React.useState(0);


  // Fetch service prices and set amount from DB
  React.useEffect(() => {
    setLoadingPrice(true);
    fetch('/api/service-prices', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setServicePrices(data);
        setLoadingPrice(false);
        // Set amount if type is present
        const typeToMatch = (initialData?.stageName || '').toLowerCase();
        if (typeToMatch && Array.isArray(data)) {
          const matched = data.find((s: any) => s.name.toLowerCase() === typeToMatch);
          if (matched) {
            setForm((prev) => ({ ...prev, amount: String(matched.price) }));
          }
        }
      })
      .catch(() => setLoadingPrice(false));
  }, [initialData?.stageName]);

  // Utility to fetch previous payments and update totalPaid/balance
  const refreshPayments = React.useCallback(() => {
    if (leadId && initialData?.stageName) {
      fetch(`/api/payments/total-paid?leadId=${leadId}&type=${encodeURIComponent(initialData.stageName)}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setTotalPaid(Number(data.totalPaid) || 0);
        })
        .catch(() => setTotalPaid(0));
    }
  }, [leadId, initialData?.stageName]);

  // Fetch on mount and when leadId/type changes
  React.useEffect(() => {
    refreshPayments();
  }, [refreshPayments]);

  // Update balance whenever amount or totalPaid changes
  React.useEffect(() => {
    const amountNum = Number(form.amount) || 0;
    const balance = amountNum - totalPaid;
    setForm((prev) => ({ ...prev, balance: balance.toFixed(2) }));
  }, [form.amount, totalPaid]);

  // Generate a unique 14-digit transaction ID and set it on mount
  const generatedIds = React.useRef<Set<string>>(new Set());

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

  React.useEffect(() => {
    if (!form.transactionId) {
      generateTransactionId().then((id) => {
        setForm((prev) => ({ ...prev, transactionId: id }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI only, no logic
  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      {/* Paid Amount */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Payment Amount</label>
        <input
          type="number"
          name="paidAmount"
          value={form.paidAmount}
          onChange={e => setForm(prev => ({ ...prev, paidAmount: e.target.value }))}
          className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
          placeholder="Enter amount"
          readOnly={false}
        />
      </div>
      {/* Client ID */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Client ID</label>
        <input
          type="text"
          name="clientId"
          value={form.clientId}
          className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed text-sm"
          placeholder="Enter client ID"
          readOnly
        />
      </div>
      {/* Type of Service */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Type of Service</label>
        <input
          type="text"
          name="type"
          value={form.type}
          className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed text-sm"
          placeholder="Type of Service"
          readOnly
        />
      </div>
      {/* Service Fee */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Service Fee</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed text-sm"
          placeholder="Fetching from database..."
          readOnly
        />
      </div>
      {/* Transaction ID */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Transaction ID</label>
        <input
          type="text"
          name="transactionId"
          value={form.transactionId}
          className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed text-sm"
          placeholder="Enter transaction ID"
          readOnly
        />
      </div>

      {/* Balance (read-only) */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Balance</label>
        <input
          type="text"
          name="balance"
          value={form.balance}
          readOnly
          className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed text-sm"
          placeholder="Auto-calculated balance"
        />
      </div>
      {/* Payment Method */}
      <div>
        <label className="block text-xs font-light text-gray-500 mb-1">Payment Method</label>
        <select
          name="method"
          value={form.method}
          onChange={e => setForm(prev => ({ ...prev, method: e.target.value }))}
          className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>
      </div>
      {/* File Upload: Only show for Mobile Money or Card */}
      {(form.method === 'Mobile Money' || form.method === 'Card') && (
        <div className="col-span-2">
          <label className="block text-xs font-light text-gray-500 mb-1">Proof of Payment</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={e => setForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-[#004225] file:text-white hover:file:bg-[#004225]/80"
          />
        </div>
      )}
      {/* Buttons */}
      <div className="col-span-2 flex gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Payment
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onCloseAccordion}
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default MakePayment;
