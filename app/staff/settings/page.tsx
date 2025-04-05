'use client'

import React, { useState } from 'react';
import { 
  Settings, 
  DollarSign, 
  Mail, 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Globe 
} from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

// Types for different settings sections
type ServicePrice = {
  id: number;
  name: string;
  price: number;
};

type CurrencySetting = {
  code: string;
  exchangeRate: number;
};

type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  body: string;
};

type DocumentType = {
  id: number;
  name: string;
  required: boolean;
};

type PaymentStatus = {
  id: number;
  name: string;
  color: string;
};

type UserRole = {
  id: number;
  name: string;
  permissions: string[];
};

const SettingsDashboard: React.FC = () => {
  // Initial state for different settings
  const [activeSection, setActiveSection] = useState<string>('services');
  
  const [services, setServices] = useState<ServicePrice[]>([
    { id: 1, name: 'IELTS', price: 1400000 },
    { id: 2, name: 'After Contract (Visa)', price: 4000000 },
    { id: 3, name: 'Work Permit Processing', price: 7100000 },
    { id: 4, name: 'Airport Transfer', price: 160000 },
    { id: 5, name: 'Medical Check', price: 150000 },
    { id: 6, name: 'Video CV', price: 200000 },
  ]);

  const [currencies, setCurrencies] = useState<CurrencySetting[]>([
    { code: 'UGX', exchangeRate: 1 },
    { code: 'USD', exchangeRate: 3800 },
  ]);

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    { 
      id: 1, 
      name: 'Contract Submission', 
      subject: 'Contract Submission Notification', 
      body: 'Dear Partner, Please find attached the contract for review.' 
    },
  ]);

  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    { id: 1, name: 'CV', required: true },
    { id: 2, name: 'Passport', required: true },
    { id: 3, name: 'Educational Certificates', required: false },
  ]);

  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([
    { id: 1, name: 'Pending', color: 'yellow' },
    { id: 2, name: 'Paid', color: 'green' },
    { id: 3, name: 'Partial', color: 'orange' },
    { id: 4, name: 'Overdue', color: 'red' },
  ]);

  const [userRoles, setUserRoles] = useState<UserRole[]>([
    { 
      id: 1, 
      name: 'Admin', 
      permissions: ['Edit Settings', 'Update Progress', 'Manage Users'] 
    },
    { 
      id: 2, 
      name: 'Staff', 
      permissions: ['Update Progress'] 
    },
  ]);

  // Render different sections based on active section
  const renderActiveSection = () => {
    switch(activeSection) {
      case 'services':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-extralight tracking-wider text-[#004225]">
              Service Prices (UGX)
            </h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-3 text-left uppercase tracking-wider font-light">Service</th>
                  <th className="p-3 text-left uppercase tracking-wider font-light">Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-3">{service.name}</td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={service.price}
                        onChange={(e) => {
                          const newServices = services.map(s => 
                            s.id === service.id 
                              ? {...s, price: Number(e.target.value)} 
                              : s
                          );
                          setServices(newServices);
                        }}
                        className="
                          w-full 
                          p-2 
                          bg-transparent 
                          border-b 
                          border-[#004225]/30 
                          focus:border-[#FDB913] 
                          transition-all 
                          ease-in-out 
                          duration-300
                        "
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'currencies':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-extralight tracking-wider text-[#004225]">
              Currency Settings
            </h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-3 text-left uppercase tracking-wider font-light">Currency</th>
                  <th className="p-3 text-left uppercase tracking-wider font-light">Exchange Rate</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency, index) => (
                  <tr key={currency.code} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-3">{currency.code}</td>
                    <td className="p-3">
                      <input 
                        type="number" 
                        value={currency.exchangeRate}
                        onChange={(e) => {
                          const newCurrencies = [...currencies];
                          newCurrencies[index].exchangeRate = Number(e.target.value);
                          setCurrencies(newCurrencies);
                        }}
                        className="
                          w-full 
                          p-2 
                          bg-transparent 
                          border-b 
                          border-[#004225]/30 
                          focus:border-[#FDB913] 
                          transition-all 
                          ease-in-out 
                          duration-300
                        "
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      // Add similar rendering for other sections
      default:
        return null;
    }
  };

  // Sidebar navigation
  const SideNavigation = () => {
    const navItems = [
      { 
        icon: DollarSign, 
        label: 'Service Prices', 
        section: 'services' 
      },
      { 
        icon: Globe, 
        label: 'Currency Settings', 
        section: 'currencies' 
      },
      { 
        icon: Mail, 
        label: 'Email Templates', 
        section: 'emails' 
      },
      { 
        icon: FileText, 
        label: 'Document Types', 
        section: 'documents' 
      },
      { 
        icon: CreditCard, 
        label: 'Payment Statuses', 
        section: 'payments' 
      },
      { 
        icon: Users, 
        label: 'User Roles', 
        section: 'roles' 
      },
    ];

    return (
      <div 
        className="
          w-64 
          bg-gradient-to-br 
          from-gray-50 
          to-gray-100 
          dark:from-gray-900 
          dark:to-gray-800 
          p-6 
          space-y-2 
          shadow-2xl 
          rounded-3xl
        "
      >
        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => setActiveSection(item.section)}
            className={`
              w-full 
              flex 
              items-center 
              p-3 
              rounded-xl 
              transition-all 
              duration-300 
              ease-in-out 
              ${activeSection === item.section 
                ? 'bg-[#004225] text-white' 
                : 'hover:bg-gray-200 text-gray-700'}
            `}
          >
            <item.icon className="mr-3" size={20} />
            <span className="font-light tracking-wider uppercase text-sm">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <div 
        className="
          min-h-screen 
          bg-gradient-to-br 
          from-gray-50 
          to-gray-100 
          dark:from-gray-900 
          dark:to-gray-800 
          p-8 
          flex
        "
      >
        {/* Sidebar Navigation */}
        <SideNavigation />

        {/* Main Content Area */}
        <div 
          className="
            flex-grow 
            ml-6 
            bg-white 
            rounded-3xl 
            p-8 
            shadow-2xl 
            backdrop-blur-lg 
            border 
            border-opacity-10
          "
        >
          <div className="flex items-center mb-8">
            <Settings 
              className="
                text-[#004225] 
                mr-4
              " 
              size={36} 
            />
            <h1 
              className="
                text-4xl 
                font-extralight 
                tracking-wider 
                bg-clip-text 
                text-transparent 
                bg-gradient-to-r 
                from-[#004225] 
                to-[#FDB913]
              "
            >
              SETTINGS DASHBOARD
            </h1>
          </div>

          {/* Dynamic Content Rendering */}
          {renderActiveSection()}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default SettingsDashboard;