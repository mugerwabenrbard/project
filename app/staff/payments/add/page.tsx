'use client';

import React, { useState } from 'react';
import { CreditCard, ArrowUpRight } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function AddPaymentPage() {
  const paymentAmounts = {
    'registration_medical': 150.00,
    'document_assistance': 200.00,
    'ielts_video': 120.00,
    'commitment_fees': 300.00,
    'after_contract_fees': 500.00,
    'final_balance': 1000.00,
  };

  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Track payment method

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setAmount(type ? paymentAmounts[type].toFixed(2) : '');
  };

  const handleMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">ADD NEW PAYMENT</h1>
            <Link href="/staff/payments" className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1">
              <span>Back to Payments</span><ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-orionte-green mr-2" />
              <h2 className="text-lg font-light tracking-wider">Payment Details</h2>
            </div>
            <form className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Client ID</label>
                  <input type="number" name="clientId" className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Enter client ID" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Payment Type</label>
                  <select name="type" value={selectedType} onChange={handleTypeChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm">
                    <option value="">Select type</option>
                    <option value="registration_medical">Registration Medical</option>
                    <option value="document_assistance">Document Assistance</option>
                    <option value="ielts_video">IELTS Video</option>
                    <option value="commitment_fees">Commitment Fees</option>
                    <option value="after_contract_fees">After Contract Fees</option>
                    <option value="final_balance">Final Balance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Total Amount</label>
                  <input type="number" name="amount" value={amount} readOnly className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm" placeholder="Select a type to auto-fill" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Paid Amount</label>
                  <input type="number" name="paidAmount" step="0.01" className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Enter paid amount (e.g., 50.00)" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Status</label>
                  <select name="status" className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm">
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Payment Method</label>
                  <select name="method" value={paymentMethod} onChange={handleMethodChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm">
                    <option value="">Select method</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="visa">Visa</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                {(paymentMethod === 'visa' || paymentMethod === 'mobile_money') && (
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">Transaction ID <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="transactionId"
                      required
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm">Add Payment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}