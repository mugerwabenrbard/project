'use client';

import React, { useState, useEffect } from "react";
import { Users as UsersIcon } from "lucide-react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch('/api/converted-clients', { credentials: 'include' });
        const data = await response.json();
        setClients(data);
      } catch (error) {
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClients();
  }, []);

  const headers = [
    { label: "ID", icon: UsersIcon },
    { label: "Name", icon: null },
    { label: "Email", icon: null },
    { label: "Phone", icon: null },
    { label: "Nationality", icon: null },
    { label: "Registration Date", icon: null },
  ];

  // Sort by registrationPaidAt, newest first
  const sortedClients = clients
    .filter(client => client.registrationPaidAt)
    .sort((a, b) => new Date(b.registrationPaidAt) - new Date(a.registrationPaidAt));

  // Helper for formatting date as d-MMM-yyyy, HH:mm
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              Clients
            </h1>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <UsersIcon className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                Clients
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={headers.length} className="text-center py-6 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : sortedClients.length === 0 ? (
                    <tr>
                      <td colSpan={headers.length} className="text-center py-6 text-gray-500">
                        No converted clients found.
                      </td>
                    </tr>
                  ) : (
                    sortedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Link
                            href={`/staff/clients/tracker/${client.id}`}
                            className="text-orionte-green hover:text-orionte-green/80 underline"
                          >
                            {client.firstName} {client.lastName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.nationality}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(client.registrationPaidAt)}
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
    </AuthenticatedLayout>
  );
}