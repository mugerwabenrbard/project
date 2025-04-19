'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users as UsersIcon, ArrowUpRight, X, UserPlus, CreditCard } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';
import { Loading } from '@/components/loading';
import { toast } from 'sonner';

interface Lead {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  highestEducationLevel: string;
  programPlacement: string[];
  countryInterest: string[];
  university: string;
  ieltsCertificate: boolean;
  nextOfKin: string | null;
  kinAddress: string | null;
  nin: string | null;
  kinPhoneNumber: string | null;
  passportNumber: string | null;
  passportIssueDate: string | null;
  passportExpiryDate: string | null;
  dob: string | null;
  address: string | null;
  chosenProgram: string | null;
  status: 'pending' | 'converted';
  submittedAt: string;
}

interface ServicePrice {
  id: number;
  name: string;
  price: number;
}

export default function LeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Pick<Lead, 'firstName' | 'middleName' | 'lastName' | 'email' | 'phoneNumber' | 'nationality' | 'highestEducationLevel' | 'programPlacement' | 'countryInterest' | 'university' | 'ieltsCertificate'>>>({});
  const [prices, setPrices] = useState<{ registration: number; medical: number }>({
    registration: 0,
    medical: 0,
  });
  const [paymentData, setPaymentData] = useState({
    transactionId: '',
    fileUrl: '',
    method: '',
  });
  const [generatedIds, setGeneratedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && ['admin', 'staff'].includes(session?.user.role)) {
      fetchLeads();
      fetchServicePrices();
    }
  }, [status, session]);

  useEffect(() => {
    if (isPaymentModalOpen) {
      generateTransactionId().then((id) => {
        setPaymentData((prev) => ({ ...prev, transactionId: id }));
        setGeneratedIds((prev) => new Set(prev).add(id));
      });
    }
  }, [isPaymentModalOpen]);

  const fetchLeads = async () => {
    try {
      console.log('[fetchLeads] Fetching leads...');
      const response = await fetch('/api/leads', { credentials: 'include' });
      console.log('[fetchLeads] Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[fetchLeads] Error data:', errorData);
        throw new Error(errorData.error || 'Failed to fetch leads');
      }
      const data = await response.json();
      // Sort leads so the most recently created is on top (by submittedAt descending)
      setLeads(data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    } catch (error) {
      console.error('[fetchLeads] Error:', error);
      toast.error(`Failed to load leads: ${error.message}`);
    }
  };

  const fetchServicePrices = async () => {
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`[fetchServicePrices] Attempt ${4 - retries}/3: Fetching service prices...`);
        const response = await fetch('/api/service-prices', { credentials: 'include' });
        console.log(
          `[fetchServicePrices] Response status: ${response.status}, Status Text: ${response.statusText}`
        );
        console.log('[fetchServicePrices] Headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: 'No response body' };
          }
          console.error('[fetchServicePrices] Error data:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const services: ServicePrice[] = await response.json();
        console.log('[fetchServicePrices] Services fetched:', services);
        
        const registration = services.find((s) => s.name === 'Registration');
        const medical = services.find((s) => s.name === 'Medical Check');
        
        if (!registration || !medical) {
          console.error('[fetchServicePrices] Missing services:', { registration, medical });
          throw new Error('Required service prices not found');
        }
        
        console.log('[fetchServicePrices] Setting prices:', {
          registration: registration.price,
          medical: medical.price,
        });
        setPrices({ registration: registration.price, medical: medical.price });
        return; // Success, exit function
      } catch (error) {
        console.error(`[fetchServicePrices] Attempt ${4 - retries}/3 failed:`, error);
        retries--;
        if (retries === 0) {
          console.warn('[fetchServicePrices] All retries failed. Using fallback prices.');
          toast.error(`Failed to fetch service prices: ${error.message}. Using fallback prices.`);
          setPrices({ registration: 50000, medical: 150000 });
        } else {
          console.log(`[fetchServicePrices] Retrying... (${retries} attempts left)`);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
        }
      }
    }
  };

  const generateTransactionId = async (): Promise<string> => {
    let transactionId: string;
    let isUnique = false;
    let retries = 3;

    while (!isUnique && retries > 0) {
      transactionId = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      if (generatedIds.has(transactionId)) {
        console.log('[generateTransactionId] Locally duplicated ID:', transactionId);
        continue;
      }

      try {
        console.log('[generateTransactionId] Checking ID:', transactionId);
        const response = await fetch(`/api/payments/check-transaction-id?id=${transactionId}`, {
          credentials: 'include',
        });
        console.log('[generateTransactionId] Response status:', response.status);
        if (response.ok) {
          isUnique = true;
        } else {
          const errorData = await response.json();
          console.error('[generateTransactionId] Error data:', errorData);
        }
      } catch (error) {
        console.error('[generateTransactionId] Error:', error);
        retries--;
        if (retries === 0) {
          console.warn('[generateTransactionId] API failed, using local uniqueness');
          isUnique = !generatedIds.has(transactionId);
        }
      }
    }

    if (!isUnique) {
      transactionId = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      console.warn('[generateTransactionId] Fallback ID:', transactionId);
    }

    return transactionId;
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      firstName: lead.firstName,
      middleName: lead.middleName || '',
      lastName: lead.lastName,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      nationality: lead.nationality,
      highestEducationLevel: lead.highestEducationLevel,
      programPlacement: lead.programPlacement,
      countryInterest: lead.countryInterest,
      university: lead.university,
      ieltsCertificate: lead.ieltsCertificate,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLead(null);
    setFormData({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleProgramPlacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.programPlacement || [];
      return {
        ...prev,
        programPlacement: checked
          ? [...current, value]
          : current.filter((p) => p !== value),
      };
    });
  };

  const handleCountryInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.countryInterest || [];
      return {
        ...prev,
        countryInterest: checked
          ? [...current, value]
          : current.filter((c) => c !== value),
      };
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'nationality',
      'highestEducationLevel',
      'programPlacement',
      'countryInterest',
      'university',
    ];
    if (
      requiredFields.some(
        (field) =>
          !formData[field] ||
          (Array.isArray(formData[field]) && formData[field].length === 0)
      ) ||
      formData.ieltsCertificate === undefined
    ) {
      toast.error('All required fields must be filled');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead?.id, ...formData }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update lead');
      }
      toast.success('Lead updated successfully');
      await fetchLeads();
      handleCloseEditModal();
    } catch (error) {
      toast.error(`Failed to update lead: ${error.message}`);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete lead');
      }
      toast.success('Lead deleted successfully');
      await fetchLeads();
    } catch (error) {
      toast.error(`Failed to delete lead: ${error.message}`);
    }
  };

  const handlePaymentClick = (lead: Lead) => {
    setSelectedLeadForPayment(lead);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedLeadForPayment(null);
    setPaymentData({ transactionId: '', fileUrl: '', method: '' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('[handleFileChange] No file selected');
      return;
    }

    console.log('[handleFileChange] File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append('proof', file);
    formData.append('leadId', selectedLeadForPayment?.id.toString() || '');
    formData.append('amount', (prices.registration + prices.medical).toString());
    formData.append('type', 'Registration and Medical');
    formData.append('method', paymentData.method);

    console.log('[handleFileChange] FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? value.name : value);
    }

    try {
      console.log('[handleFileChange] Sending request to /api/upload...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('[handleFileChange] Response status:', response.status);
      console.log('[handleFileChange] Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: 'No response body' };
        }
        console.error('[handleFileChange] Error data:', errorData);
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const responseData = await response.json();
      console.log('[handleFileChange] Response data:', responseData);

      const { url } = responseData;
      if (!url) {
        console.error('[handleFileChange] No URL in response:', responseData);
        throw new Error('No file URL returned');
      }

      console.log('[handleFileChange] File uploaded, URL:', url);
      setPaymentData((prev) => ({ ...prev, fileUrl: url }));
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('[handleFileChange] Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      toast.error(`Failed to upload file: ${error.message}`);
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPaymentData((prev) => ({ ...prev, method: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.fileUrl) {
      console.log('[handlePaymentSubmit] Missing fileUrl:', paymentData);
      toast.error('Proof of payment is required');
      return;
    }
    if (['mobile_money', 'visa'].includes(paymentData.method) && !paymentData.transactionId) {
      console.log('[handlePaymentSubmit] Missing transactionId for method:', paymentData.method);
      toast.error('Transaction ID is required for Mobile Money or Visa');
      return;
    }

    try {
      console.log('[handlePaymentSubmit] Submitting payment:', {
        leadId: selectedLeadForPayment?.id,
        ...paymentData,
      });
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLeadForPayment?.id,
          transactionId: paymentData.transactionId,
          fileUrl: paymentData.fileUrl,
          method: paymentData.method || 'mobile_money',
        }),
        credentials: 'include',
      });

      console.log('[handlePaymentSubmit] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[handlePaymentSubmit] Error data:', errorData);
        throw new Error(errorData.error || 'Failed to process payment');
      }

      toast.success('Payment processed successfully');
      await fetchLeads();
      handleClosePaymentModal();
    } catch (error) {
      console.error('[handlePaymentSubmit] Error:', error);
      toast.error(`Failed to process payment: ${error.message}`);
    }
  };

  const headers = [
    { label: 'ID', icon: UsersIcon },
    { label: 'Name', icon: null },
    { label: 'Email', icon: null },
    { label: 'Phone', icon: null },
    { label: 'Nationality', icon: null },
    { label: 'Actions', icon: null },
  ];

  if (status === 'loading') return <Loading />;
  if (!session || !['admin', 'staff'].includes(session.user.role)) return null;

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-[#004225]">
              LEADS
            </h1>
            <Link
              href="/staff/leads/add"
              className="text-[#004225] hover:text-[#004225]/80 transition-colors duration-300 flex items-center space-x-1 bg-[#FDB913] rounded-lg py-2 px-4 shadow-corporate hover:bg-[#FDB913]/70"
            >
              Add Lead <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center mb-6">
              <UsersIcon className="w-6 h-6 text-[#004225] mr-2" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                All Leads
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center space-x-1">
                          {header.icon && <header.icon className="w-4 h-4" />}
                          <span>{header.label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No leads available
                      </td>
                    </tr>
                  ) : (
                    leads.filter(lead => lead.status === "pending").map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.firstName} {lead.middleName} {lead.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.nationality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(lead)}
                            className="text-[#004225] hover:text-[#004225]/80 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePaymentClick(lead)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                          >
                            Make Payment
                          </button>
                          <button
                            onClick={() => handleDeleteClick(lead.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-corporate">
            <div className="flex items-center mb-4">
              <UserPlus className="h-6 w-6 text-[#004225] mr-2" />
              <h2 className="text-lg font-light tracking-wider text-[#004225]">
                Edit Lead
              </h2>
              <button onClick={handleCloseEditModal} className="ml-auto">
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                      placeholder="First"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                      placeholder="Middle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                      placeholder="Last"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                    placeholder="Phone"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                    placeholder="Nationality"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Education Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="highestEducationLevel"
                    value={formData.highestEducationLevel || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                    required
                  >
                    <option value="">Select</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor’s</option>
                    <option value="Master">Master’s</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Program Placement <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {['Crop Production', 'Livestock Management', 'Agribusiness', 'Horticulture', 'Agricultural Engineering'].map((program) => (
                      <label key={program} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="programPlacement"
                          value={program}
                          checked={formData.programPlacement?.includes(program) || false}
                          onChange={handleProgramPlacementChange}
                          className="h-4 w-4 text-[#004225] focus:ring-[#004225] border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">{program}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Country of Interest <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {['Canada', 'Australia', 'Germany', 'USA', 'UK'].map((country) => (
                      <label key={country} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="countryInterest"
                          value={country}
                          checked={formData.countryInterest?.includes(country) || false}
                          onChange={handleCountryInterestChange}
                          className="h-4 w-4 text-[#004225] focus:ring-[#004225] border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    University/College <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university || ''}
                    onChange={handleEditChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                    placeholder="University"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    IELTS Certificate <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ieltsCertificate"
                        value="true"
                        checked={formData.ieltsCertificate === true}
                        onChange={() => setFormData((prev) => ({ ...prev, ieltsCertificate: true }))}
                        className="h-4 w-4 text-[#004225] focus:ring-[#004225] border-gray-300"
                      />
                      <span className="font-light text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ieltsCertificate"
                        value="false"
                        checked={formData.ieltsCertificate === false}
                        onChange={() => setFormData((prev) => ({ ...prev, ieltsCertificate: false }))}
                        className="h-4 w-4 text-[#004225] focus:ring-[#004225] border-gray-300"
                      />
                      <span className="font-light text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 font-light text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white font-light tracking-wider bg-[#004225] hover:bg-[#004225]/90 transition-colors duration-300 text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedLeadForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full shadow-corporate">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-[#004225] mr-2" />
              <h2 className="text-lg font-light tracking-wider text-[#004225]">
                Make Payment for {selectedLeadForPayment.firstName} {selectedLeadForPayment.lastName}
              </h2>
              <button onClick={handleClosePaymentModal} className="ml-auto">
                <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Lead ID</label>
                  <input
                    type="number"
                    value={selectedLeadForPayment.id}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Payment Type</label>
                  <input
                    type="text"
                    value="Registration and Medical"
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Total Amount (UGX)</label>
                  <input
                    type="number"
                    value={prices.registration + prices.medical}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Registration Fee (UGX)</label>
                  <input
                    type="number"
                    value={prices.registration}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Medical Check Fee (UGX)</label>
                  <input
                    type="number"
                    value={prices.medical}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Payment Method</label>
                  <select
                    name="method"
                    value={paymentData.method}
                    onChange={handlePaymentMethodChange}
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                  >
                    <option value="">Select method</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Transaction ID {['mobile_money', 'visa'].includes(paymentData.method) && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={paymentData.transactionId}
                    readOnly
                    className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Proof of Payment <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    name="proof"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#004225] text-sm"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={!paymentData.fileUrl}
                  className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-[#004225] hover:bg-[#004225]/90 disabled:bg-gray-400 transition-colors duration-300 text-sm"
                >
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}