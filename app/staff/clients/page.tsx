"use client";

import React, { useState } from "react";
import { Users as UsersIcon, ArrowUpRight, X } from "lucide-react";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import Link from "next/link";

export default function ClientsPage() {
  // Dummy data for 10 clients
  const dummyClients = [
    {
      id: 101,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1234567890",
      nationality: "USA",
      createdAt: "2025-03-01",
    },
    {
      id: 102,
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com",
      phoneNumber: "+2345678901",
      nationality: "UK",
      createdAt: "2025-03-02",
    },
    {
      id: 103,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.j@example.com",
      phoneNumber: "+3456789012",
      nationality: "Canada",
      createdAt: "2025-03-03",
    },
    {
      id: 104,
      firstName: "Aisha",
      lastName: "Khan",
      email: "aisha.khan@example.com",
      phoneNumber: "+4567890123",
      nationality: "Pakistan",
      createdAt: "2025-03-04",
    },
    {
      id: 105,
      firstName: "Liam",
      lastName: "Brown",
      email: "liam.brown@example.com",
      phoneNumber: "+5678901234",
      nationality: "Australia",
      createdAt: "2025-03-05",
    },
    {
      id: 106,
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.wilson@example.com",
      phoneNumber: "+6789012345",
      nationality: "Germany",
      createdAt: "2025-03-06",
    },
    {
      id: 107,
      firstName: "Noah",
      lastName: "Davis",
      email: "noah.davis@example.com",
      phoneNumber: "+7890123456",
      nationality: "USA",
      createdAt: "2025-03-07",
    },
    {
      id: 108,
      firstName: "Olivia",
      lastName: "Taylor",
      email: "olivia.taylor@example.com",
      phoneNumber: "+8901234567",
      nationality: "UK",
      createdAt: "2025-03-08",
    },
    {
      id: 109,
      firstName: "Ethan",
      lastName: "Martinez",
      email: "ethan.m@example.com",
      phoneNumber: "+9012345678",
      nationality: "Mexico",
      createdAt: "2025-03-09",
    },
    {
      id: 110,
      firstName: "Sophia",
      lastName: "Lee",
      email: "sophia.lee@example.com",
      phoneNumber: "+0123456789",
      nationality: "South Korea",
      createdAt: "2025-03-10",
    },
  ];

  // State for managing the progress tracker modal
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Dummy progress data (editable in the modal)
  const [clientProgress, setClientProgress] = useState(
    dummyClients.map((client) => ({
      id: client.id,
      registration: "Pending",
      documentSubmission: "Not Started",
      paymentStatus: "Pending",
      notes: "",
    }))
  );

  // Table headers
  const headers = [
    { label: "ID", icon: UsersIcon },
    { label: "Name", icon: null },
    { label: "Email", icon: null },
    { label: "Phone", icon: null },
    { label: "Nationality", icon: null },
    { label: "Created At", icon: null },
  ];

  // Open the progress tracker modal
  const handleNameClick = (client) => {
    setSelectedClient(client);
    setIsTrackerModalOpen(true);
  };

  // Close the progress tracker modal
  const handleCloseTrackerModal = () => {
    setIsTrackerModalOpen(false);
    setSelectedClient(null);
  };

  // Update progress for a specific client
  const handleProgressChange = (clientId, field, value) => {
    setClientProgress((prev) =>
      prev.map((progress) =>
        progress.id === clientId ? { ...progress, [field]: value } : progress
      )
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              CLIENTS
            </h1>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <UsersIcon className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                All Clients
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
                  {dummyClients.map((client) => (
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
                        {client.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
