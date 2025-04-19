'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users as UsersIcon, X } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Loading } from '@/components/loading';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{ email: string; role: string; password: string }>({
    email: '',
    role: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    console.log('[UsersPage] Session status:', status, 'Session:', session);
    if (status === 'unauthenticated') {
      console.log('[UsersPage] Redirecting to /');
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'admin') {
      fetchUsers();
    }
  }, [status, session]);

  const fetchUsers = async () => {
    try {
      console.log('[UsersPage] Fetching users');
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('[UsersPage] Users fetched:', data);
      setUsers(data);
    } catch (error) {
      console.error('[UsersPage] Fetch error:', error);
      setErrorMessage('Failed to load users');
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({ email: user.email, role: user.role, password: '' });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({ email: '', role: '', password: '' });
    setErrorMessage('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      console.log('[UsersPage] Updating user:', selectedUser.id, editFormData);
      const body = { id: selectedUser.id, email: editFormData.email, role: editFormData.role };
      if (editFormData.password) {
        body.password = editFormData.password;
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      console.log('[UsersPage] User updated:', data.user);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, email: data.user.email, role: data.user.role } : u))
      );
      handleCloseEditModal();
    } catch (error: any) {
      console.error('[UsersPage] Update error:', error);
      setErrorMessage(error.message || 'Failed to update user');
    }
  };

  const handleDeleteClick = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    try {
      console.log('[UsersPage] Deleting user:', user.id);
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      console.log('[UsersPage] User deleted:', user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error: any) {
      console.error('[UsersPage] Delete error:', error);
      setErrorMessage(error.message || 'Failed to delete user');
    }
  };

  const headers = [
    { label: 'ID', icon: UsersIcon },
    { label: 'Email', icon: null },
    { label: 'Role', icon: null },
    { label: 'Actions', icon: null },
  ];

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">USERS</h1>
            <Link
              href="/staff/users/adduser"
              className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1 bg-[#FDB913] rounded-lg py-2 px-4 shadow-corporate hover:bg-[#FDB913]/70"
            >
              Add User
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <UsersIcon className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">All Users</h2>
            </div>
            {errorMessage && (
              <div className="flex items-center p-4 bg-red-50 rounded-lg text-red-600 mb-4">
                <span>{errorMessage}</span>
              </div>
            )}
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
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-orionte-green hover:text-orionte-green/80 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-6 w-6 text-orionte-green" />
                <h2 className="text-lg font-light tracking-wider text-gray-800">Edit User</h2>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                >
                  <option value="staff">Staff</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">
                  Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditChange}
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                  placeholder="Enter new password"
                />
              </div>
              {errorMessage && (
                <div className="flex items-center p-2 bg-red-50 rounded-lg text-red-600 text-sm">
                  <span>{errorMessage}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}