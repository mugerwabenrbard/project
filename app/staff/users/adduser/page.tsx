'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Loading } from '@/components/loading';

interface FormData {
  email: string;
  role: string;
  password: string;
}

export default function AddUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    role: 'staff',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    console.log('[AddUser] Session status:', status, 'Session:', session);
    if (status === 'unauthenticated') {
      console.log('[AddUser] Redirecting to /');
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session || session.user.role !== 'admin') {
    return null; // Redirect handled in useEffect
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      console.log('[AddUser] Sending request to /api/users/add:', formData);
      const response = await fetch('/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log('[AddUser] Response status:', response.status);

      const text = await response.text();
      let data: { message?: string; error?: string };
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error('[AddUser] Response is not JSON:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        console.log('[AddUser] Error response:', data);
        throw new Error(data.error || `Server responded with ${response.status}`);
      }

      setSubmitStatus('success');
      setFormData({
        email: '',
        role: 'staff',
        password: '',
      });
    } catch (error: any) {
      console.error('[AddUser] Client error:', error.message);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              ADD NEW USER
            </h1>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-corporate max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-orionte-green mr-2" />
              <h2 className="text-xl font-light tracking-wider">User Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green"
                >
                  <option value="staff">Staff</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 rounded-lg text-white font-light tracking-wider ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300'
                }`}
              >
                {isSubmitting ? 'Adding User...' : 'Add User'}
              </button>
              {submitStatus === 'success' && (
                <div className="flex items-center p-4 bg-green-50 rounded-lg text-orionte-green">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p>User added successfully!</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{errorMessage || 'Failed to add user. Please try again.'}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}