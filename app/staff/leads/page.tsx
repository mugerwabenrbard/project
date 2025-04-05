'use client';

import React, { useState } from 'react';
import { Users as UsersIcon, ArrowUpRight, X, CreditCard } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function LeadsPage() {
  const dummyLeads = [
    { id: 1, firstName: 'John', middleName: '', lastName: 'Doe', email: 'john.doe@example.com', phoneNumber: '+1234567890', nationality: 'USA', educationLevel: 'Bachelor', programPlacement: ['Crop Production'], countryInterest: ['Canada'], university: 'Texas A&M', ielts: 'Yes' },
    { id: 2, firstName: 'Sarah', middleName: 'Jane', lastName: 'Smith', email: 'sarah.smith@example.com', phoneNumber: '+2345678901', nationality: 'UK', educationLevel: 'Master', programPlacement: ['Livestock Management', 'Agribusiness'], countryInterest: ['Australia', 'UK'], university: 'Oxford', ielts: 'No' },
    { id: 3, firstName: 'Mike', middleName: '', lastName: 'Johnson', email: 'mike.j@example.com', phoneNumber: '+3456789012', nationality: 'Canada', educationLevel: 'Diploma', programPlacement: ['Horticulture'], countryInterest: ['Germany'], university: 'Toronto College', ielts: 'Yes' },
    { id: 4, firstName: 'Aisha', middleName: 'Fatima', lastName: 'Khan', email: 'aisha.khan@example.com', phoneNumber: '+4567890123', nationality: 'Pakistan', educationLevel: 'Bachelor', programPlacement: ['Agricultural Engineering'], countryInterest: ['USA'], university: 'Lahore Uni', ielts: 'No' },
    { id: 5, firstName: 'Liam', middleName: '', lastName: 'Brown', email: 'liam.brown@example.com', phoneNumber: '+5678901234', nationality: 'Australia', educationLevel: 'PhD', programPlacement: ['Crop Production', 'Horticulture'], countryInterest: ['Canada', 'UK'], university: 'Sydney Uni', ielts: 'Yes' },
    { id: 6, firstName: 'Emma', middleName: 'Rose', lastName: 'Wilson', email: 'emma.wilson@example.com', phoneNumber: '+6789012345', nationality: 'Germany', educationLevel: 'Master', programPlacement: ['Agribusiness'], countryInterest: ['Australia'], university: 'Berlin Tech', ielts: 'Yes' },
    { id: 7, firstName: 'Noah', middleName: '', lastName: 'Davis', email: 'noah.davis@example.com', phoneNumber: '+7890123456', nationality: 'USA', educationLevel: 'High School', programPlacement: ['Livestock Management'], countryInterest: ['USA'], university: 'N/A', ielts: 'No' },
    { id: 8, firstName: 'Olivia', middleName: 'Grace', lastName: 'Taylor', email: 'olivia.taylor@example.com', phoneNumber: '+8901234567', nationality: 'UK', educationLevel: 'Bachelor', programPlacement: ['Horticulture', 'Agribusiness'], countryInterest: ['Germany', 'UK'], university: 'Cambridge', ielts: 'Yes' },
    { id: 9, firstName: 'Ethan', middleName: '', lastName: 'Martinez', email: 'ethan.m@example.com', phoneNumber: '+9012345678', nationality: 'Mexico', educationLevel: 'Diploma', programPlacement: ['Crop Production'], countryInterest: ['Canada'], university: 'Mexico City College', ielts: 'No' },
    { id: 10, firstName: 'Sophia', middleName: 'Marie', lastName: 'Lee', email: 'sophia.lee@example.com', phoneNumber: '+0123456789', nationality: 'South Korea', educationLevel: 'Master', programPlacement: ['Agricultural Engineering', 'Horticulture'], countryInterest: ['USA', 'Australia'], university: 'Seoul National', ielts: 'Yes' },
  ];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(''); // Track payment method

  const headers = [
    { label: 'ID', icon: UsersIcon },
    { label: 'Name', icon: null },
    { label: 'Email', icon: null },
    { label: 'Phone', icon: null },
    { label: 'Nationality', icon: null },
    { label: 'Actions', icon: null },
  ];

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const handlePaymentClick = (lead) => {
    setSelectedLeadForPayment(lead);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedLeadForPayment(null);
    setPaymentMethod(''); // Reset payment method
  };

  const handleMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">LEADS</h1>
            <Link href="/staff/leads/add" className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1 bg-[#FDB913] rounded-lg py-2 px-4 shadow-corporate hover:bg-[#FDB913]/70">
              Add Lead <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-corporate">
            <div className="flex items-center space-x-2 mb-6">
              <UsersIcon className="w-6 h-6 text-orionte-green" />
              <h2 className="text-xl font-light tracking-wider text-gray-800">All Leads</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">{header.icon && <header.icon className="w-4 h-4" />}<span>{header.label}</span></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.firstName} {lead.middleName} {lead.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.nationality}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEditClick(lead)} className="text-orionte-green hover:text-orionte-green/80 mr-4">Edit</button>
                        <button onClick={() => handlePaymentClick(lead)} className="text-blue-600 hover:text-blue-800 mr-4">Make Payment</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lead Modal (Unchanged) */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-6 w-6 text-orionte-green" />
                <h2 className="text-lg font-light tracking-wider text-gray-800">Edit Lead</h2>
              </div>
              <button onClick={handleCloseEditModal} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="block text-xs font-light text-gray-500 mb-1">First Name</label><input type="text" name="firstName" value={selectedLead.firstName} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                  <div><label className="block text-xs font-light text-gray-500 mb-1">Middle Name</label><input type="text" name="middleName" value={selectedLead.middleName} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                  <div><label className="block text-xs font-light text-gray-500 mb-1">Last Name</label><input type="text" name="lastName" value={selectedLead.lastName} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                </div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">Email</label><input type="email" name="email" value={selectedLead.email} readOnly className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm" /></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">Phone</label><input type="tel" name="phoneNumber" value={selectedLead.phoneNumber} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">Nationality</label><input type="text" name="nationality" value={selectedLead.nationality} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">Education Level</label><select name="educationLevel" value={selectedLead.educationLevel} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"><option value="highSchool">High School</option><option value="diploma">Diploma</option><option value="bachelor">Bachelor’s</option><option value="master">Master’s</option><option value="phd">PhD</option></select></div>
              </div>
              <div className="space-y-4">
                <div><label className="block text-xs font-light text-gray-500 mb-1">Program Placement</label><div className="space-y-1 max-h-24 overflow-y-auto">{['Crop Production', 'Livestock Management', 'Agribusiness', 'Horticulture', 'Agricultural Engineering'].map((program) => (<label key={program} className="flex items-center space-x-2"><input type="checkbox" name="programPlacement" value={program.toLowerCase().replace(' ', '-')} checked={selectedLead.programPlacement.includes(program)} className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded" /><span className="font-light text-gray-700 text-sm">{program}</span></label>))}</div></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">Country of Interest</label><div className="space-y-1 max-h-24 overflow-y-auto">{['Canada', 'Australia', 'Germany', 'USA', 'UK'].map((country) => (<label key={country} className="flex items-center space-x-2"><input type="checkbox" name="countryInterest" value={country.toLowerCase()} checked={selectedLead.countryInterest.includes(country)} className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded" /><span className="font-light text-gray-700 text-sm">{country}</span></label>))}</div></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">University/College</label><input type="text" name="university" value={selectedLead.university} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" /></div>
                <div><label className="block text-xs font-light text-gray-500 mb-1">IELTS Certificate</label><div className="flex space-x-4"><label className="flex items-center space-x-1 text-sm"><input type="radio" name="ielts" value="yes" checked={selectedLead.ielts === 'Yes'} className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300" /><span className="font-light text-gray-700">Yes</span></label><label className="flex items-center space-x-1 text-sm"><input type="radio" name="ielts" value="no" checked={selectedLead.ielts === 'No'} className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300" /><span className="font-light text-gray-700">No</span></label></div></div>
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedLeadForPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-orionte-green" />
                <h2 className="text-lg font-light tracking-wider text-gray-800">Registration Payment</h2>
              </div>
              <button onClick={handleClosePaymentModal} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Client ID</label>
                <input type="number" name="clientId" value={selectedLeadForPayment.id} readOnly className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Payment Type</label>
                <input type="text" value="Registration Medical" readOnly className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Total Amount</label>
                <input type="number" name="amount" value="150.00" readOnly className="w-full p-2 bg-gray-100 rounded-lg border border-gray-200 text-gray-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Paid Amount</label>
                <input type="number" name="paidAmount" step="0.01" className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="e.g., 150.00" />
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
              <div>
                <label className="block text-xs font-light text-gray-500 mb-1">Proof of Payment</label>
                <input type="file" name="proofOfPayment" accept="image/*,application/pdf" className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" />
              </div>
              <button type="submit" className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm">Submit Payment</button>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}