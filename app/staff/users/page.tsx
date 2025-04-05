'use client';

import React, { useState } from 'react';
import { Users as UsersIcon, ArrowUpRight, X } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function UsersPage() {
  // Dummy data for frontend display
  const dummyUsers = [
    { id: 1, email: 'staff@example.com', role: 'staff', createdAt: '2025-03-28' },
    { id: 2, email: 'client@example.com', role: 'client', createdAt: '2025-03-27' },
    { id: 3, email: 'admin@example.com', role: 'admin', createdAt: '2025-03-26' },
  ];

  // State for managing the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Table headers
  const headers = [
    { label: 'ID', icon: UsersIcon },
    { label: 'Email', icon: null },
    { label: 'Role', icon: null },
    { label: 'Created At', icon: null },
    { label: 'Actions', icon: null },
  ];

  // Open the edit modal with the selected user's data
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Close the edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              USERS
            </h1>
            <Link
              href="/staff/users/adduser"
              className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1 bg-[#FDB913] rounded-lg py-2 px-4 shadow-corporate hover:bg-[#FDB913]/70"
            >
              Add User <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <UsersIcon className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                All Users
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
                  {dummyUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'staff'
                              ? 'bg-green-100 text-green-800'
                              : user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-orionte-green hover:text-orionte-green/80 mr-4"
                        >
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
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
          <div className="bg-white rounded-lg p-6 shadow-corporate max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-6 w-6 text-orionte-green" />
                <h2 className="text-xl font-light tracking-wider text-gray-800">
                  Edit User
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  readOnly // Making email read-only as it's typically not editable
                  className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none text-gray-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={selectedUser.role}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* Password (Optional Update) */}
              <div>
                <label className="block text-sm font-light text-gray-500 mb-2">
                  New Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green"
                  placeholder="Enter new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full p-3 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300"
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