'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  FileCheck,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function StaffDashboard() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [metrics] = useState({
    totalLeads: 156,
    activeClients: 42,
    completedPlacements: 89,
    revenueCollected: '$128,450',
  });

  const [clientStages] = useState([
    { name: 'Document Collection', count: 5 },
    { name: 'Awaiting Bixter', count: 3 },
    { name: 'Payment Pending', count: 2 },
    { name: 'Ready for Placement', count: 4 },
  ]);

  const [pendingLeads] = useState([
    { name: 'John Doe', submitted: 'March 25, 2025', status: 'New' },
    { name: 'Sarah Smith', submitted: 'March 24, 2025', status: 'Contacted' },
    { name: 'Mike Johnson', submitted: 'March 24, 2025', status: 'New' },
  ]);

  const [pendingDocuments] = useState([
    { client: 'Jane Smith', document: 'Medical Report', uploaded: '2 hours ago' },
    { client: 'Robert Brown', document: 'Passport Copy', uploaded: '5 hours ago' },
  ]);

  const [paymentAlerts] = useState([
    { client: 'Tom Lee', paid: 50, total: 100, type: 'Registration' },
    { client: 'Alice Wong', paid: 150, total: 300, type: 'Processing' },
  ]);

  const [bixterUpdates] = useState([
    { clientId: '123', status: 'Placement Found', updated: '1 hour ago' },
    { clientId: '124', status: 'Interview Scheduled', updated: '3 hours ago' },
  ]);

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              STAFF DASHBOARD
            </h1>
            <div className="text-sm font-light text-gray-500">
              Last updated: {currentTime}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Leads', value: metrics.totalLeads, icon: Users },
              { label: 'Active Clients', value: metrics.activeClients, icon: CheckCircle },
              { label: 'Completed Placements', value: metrics.completedPlacements, icon: Building2 },
              { label: 'Revenue Collected', value: metrics.revenueCollected, icon: CreditCard },
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-corporate">
                <div className="flex items-center justify-between">
                  <metric.icon className="h-8 w-8 text-orionte-green" />
                  <span className="text-2xl font-light">{metric.value}</span>
                </div>
                <p className="mt-2 text-sm font-light text-gray-500">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-corporate">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Client Progress</h2>
                <button className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300">
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {clientStages.map((stage, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-light">{stage.name}</span>
                      <span className="text-lg font-light">{stage.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-corporate">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Pending Leads</h2>
                <button className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300">
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {pendingLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-light">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.submitted}</p>
                    </div>
                    <span className="px-3 py-1 bg-orionte-green text-white rounded-full text-sm">
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-corporate">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Document Verifications</h2>
                <button className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300">
                  <FileCheck className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {pendingDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-light">{doc.client}</p>
                      <p className="text-sm text-gray-500">{doc.document}</p>
                    </div>
                    <span className="text-sm text-orionte-green">{doc.uploaded}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-corporate">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Payment Alerts</h2>
                <button className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300">
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {paymentAlerts.map((alert, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-light">{alert.client}</p>
                      <span className="text-sm text-gray-500">{alert.type}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orionte-green rounded-full h-2"
                        style={{ width: `${(alert.paid / alert.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-orionte-green">
                      ${alert.paid} of ${alert.total} Paid
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-corporate lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Bixter Updates</h2>
                <button className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300">
                  <Clock className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bixterUpdates.map((update, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-light">Client ID: {update.clientId}</p>
                      <span className="text-sm text-gray-500">{update.updated}</span>
                    </div>
                    <p className="text-orionte-green">{update.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}