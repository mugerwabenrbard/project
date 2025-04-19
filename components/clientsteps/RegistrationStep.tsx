'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegistrationForm({ leadId, registrationStageId, onSuccess }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    nextOfKin: '',
    kinAddress: '',
    kinPhoneNumber: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    nin: '',
    dob: '',
    address: '',
    chosenProgram: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Wait for session to load
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const userId = session?.user?.id;
  if (!userId) {
    return <div>Error: User ID not found. Please log in again.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['passportIssueDate', 'passportExpiryDate', 'dob'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        [name]: value ? new Date(value).toISOString() : '',
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update lead');
      }

      const stageRes = await fetch(`/api/stages/${registrationStageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, userId }),
        credentials: 'include',
      });
      if (!stageRes.ok) {
        const errorData = await stageRes.json();
        throw new Error(errorData.message || 'Failed to update registration stage');
      }
      setSuccess('Registration info saved!');
      toast.success('Registration info saved!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Next of Kin Name</label>
            <input
              type="text"
              name="nextOfKin"
              value={form.nextOfKin}
              onChange={handleChange}
              placeholder="e.g., Jane Doe"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Kin Address</label>
            <textarea
              name="kinAddress"
              value={form.kinAddress}
              onChange={handleChange}
              placeholder="e.g., 123 Main St, City"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Kin Phone Number</label>
            <input
              type="tel"
              name="kinPhoneNumber"
              value={form.kinPhoneNumber}
              onChange={handleChange}
              placeholder="e.g., +1234567890"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Number</label>
            <input
              type="text"
              name="passportNumber"
              value={form.passportNumber}
              onChange={handleChange}
              placeholder="e.g., A12345678"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Issue Date</label>
            <input
              type="date"
              name="passportIssueDate"
              value={form.passportIssueDate ? form.passportIssueDate.split('T')[0] : ''}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Expiry Date</label>
            <input
              type="date"
              name="passportExpiryDate"
              value={form.passportExpiryDate ? form.passportExpiryDate.split('T')[0] : ''}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">NIN</label>
            <input
              type="text"
              name="nin"
              value={form.nin}
              onChange={handleChange}
              placeholder="e.g., CM1234567890"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob ? form.dob.split('T')[0] : ''}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g., 456 Elm St, Town"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              rows={2}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Choose Program</label>
            <select
              name="chosenProgram"
              value={form.chosenProgram}
              onChange={handleChange}
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              required
            >
              <option value="" disabled>Select a program</option>
              <option value="ja_recruit">JA Recruit</option>
              <option value="tsn_construction">TSN Construction</option>
              <option value="ab_farms_aps">AB-Farms APS</option>
              <option value="bixter">Bixter</option>
              <option value="workadvice">Workadvice</option>
            </select>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-6 py-2 bg-orionte-green text-white rounded-lg shadow hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Registration'}
      </button>
    </form>
  );
}