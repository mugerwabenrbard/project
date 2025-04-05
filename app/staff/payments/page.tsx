'use client';

import React from 'react';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function PaymentsPage() {
  // Dummy data for 10 payments
  const dummyPayments = [
    { id: 1, clientId: 101, type: 'registration_medical', amount: 150.00, paidAmount: 150.00, status: 'completed', method: 'visa', transactionId: 'VISA12345', createdAt: '2025-03-20', completedAt: '2025-03-20' },
    { id: 2, clientId: 102, type: 'document_assistance', amount: 200.00, paidAmount: 100.00, status: 'partial', method: 'mobile_money', transactionId: 'MM67890', createdAt: '2025-03-21', completedAt: null },
    { id: 3, clientId: 103, type: 'ielts_video', amount: 120.00, paidAmount: 0.00, status: 'pending', method: null, transactionId: null, createdAt: '2025-03-22', completedAt: null },
    { id: 4, clientId: 104, type: 'commitment_fees', amount: 300.00, paidAmount: 300.00, status: 'completed', method: 'visa', transactionId: 'VISA54321', createdAt: '2025-03-23', completedAt: '2025-03-23' },
    { id: 5, clientId: 105, type: 'after_contract_fees', amount: 500.00, paidAmount: 250.00, status: 'partial', method: 'mobile_money', transactionId: 'MM98765', createdAt: '2025-03-24', completedAt: null },
    { id: 6, clientId: 106, type: 'final_balance', amount: 1000.00, paidAmount: 1000.00, status: 'completed', method: 'visa', transactionId: 'VISA78901', createdAt: '2025-03-25', completedAt: '2025-03-25' },
    { id: 7, clientId: 107, type: 'registration_medical', amount: 150.00, paidAmount: 0.00, status: 'pending', method: null, transactionId: null, createdAt: '2025-03-26', completedAt: null },
    { id: 8, clientId: 108, type: 'document_assistance', amount: 200.00, paidAmount: 200.00, status: 'completed', method: 'mobile_money', transactionId: 'MM45678', createdAt: '2025-03-27', completedAt: '2025-03-27' },
    { id: 9, clientId: 109, type: 'ielts_video', amount: 120.00, paidAmount: 60.00, status: 'partial', method: 'visa', transactionId: 'VISA23456', createdAt: '2025-03-28', completedAt: null },
    { id: 10, clientId: 110, type: 'commitment_fees', amount: 300.00, paidAmount: 0.00, status: 'pending', method: null, transactionId: null, createdAt: '2025-03-28', completedAt: null },
  ];

  // Table headers based on Payments table fields
  const headers = [
    { label: 'ID', icon: CreditCard },
    { label: 'Client ID', icon: null },
    { label: 'Type', icon: null },
    { label: 'Amount', icon: null },
    { label: 'Paid', icon: null },
    { label: 'Status', icon: null },
    { label: 'Method', icon: null },
    { label: 'Created', icon: null },
  ];

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              PAYMENTS
            </h1>
            <Link
              href="/staff/payments/add"
              className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1 bg-[#FDB913] rounded-lg py-2 px-4 shadow-corporate hover:bg-[#FDB913]/70"
            >
              Add Payment <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                All Payments
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
                  {dummyPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.clientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.paidAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.method ? payment.method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.createdAt}
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