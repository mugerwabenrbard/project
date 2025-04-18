'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function AddUserPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'staff' | 'client' | 'admin'>('staff');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add user');
      }

      console.log('[AddUser] User created:', email);
      router.push('/staff/dashboard');
    } catch (err: any) {
      console.error('[AddUser] Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-3xl font-extralight tracking-wider text-center mb-6">
            Add New User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-light text-gray-500 dark:text-gray-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary/50 focus:ring-0"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-light text-gray-500 dark:text-gray-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary/50 focus:ring-0"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-light text-gray-500 dark:text-gray-400">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'staff' | 'client' | 'admin')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:border-primary/50 focus:ring-0"
              >
                <option value="staff">Staff</option>
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && (
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-light tracking-wider uppercase text-sm hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto h-5 w-5" /> : 'Add User'}
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}