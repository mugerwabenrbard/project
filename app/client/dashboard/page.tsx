'use client';

import { useState, useEffect } from 'react';
import {
  FileCheck,
  CreditCard,
  Bell,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function ClientDashboard() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const [clientProgress] = useState({
    currentStage: 'Document Collection',
    progress: 35,
    stages: [
      { name: 'Registration', completed: true },
      { name: 'Document Collection', completed: false, current: true },
      { name: 'Bixter Review', completed: false },
      { name: 'Placement Search', completed: false },
      { name: 'Visa Processing', completed: false },
      { name: 'Travel Preparation', completed: false },
    ],
  });

  const [payments] = useState({
    completed: [
      { name: 'Registration Fee', amount: 100, date: '2024-03-20' },
    ],
    pending: [
      { name: 'Processing Fee', amount: 200, dueDate: '2024-04-15' },
      { name: 'IELTS Fee', amount: 250, dueDate: '2024-04-30' },
    ],
    totalPaid: 100,
    totalDue: 450,
  });

  const [documents] = useState([
    { name: 'Passport Copy', status: 'verified', uploadDate: '2024-03-15' },
    { name: 'Academic Transcripts', status: 'pending', uploadDate: '2024-03-20' },
    { name: 'Medical Report', status: 'rejected', uploadDate: '2024-03-18', reason: 'Expired document' },
    { name: 'IELTS Results', status: 'required' },
  ]);

  const [notifications] = useState([
    {
      type: 'success',
      message: 'Your passport copy has been verified',
      time: '2 hours ago',
    },
    {
      type: 'warning',
      message: 'Medical report was rejected. Please upload a new copy',
      time: '5 hours ago',
    },
    {
      type: 'info',
      message: 'Registration payment received',
      time: '1 day ago',
    },
  ]);

  const [timeline] = useState({
    currentPhase: 'Document Collection',
    estimatedCompletion: '2024-04-30',
    daysRemaining: 14,
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extralight tracking-wider bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            MY JOURNEY
          </h1>
          <div className="text-sm font-light text-gray-500">
            Last updated: {currentTime}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl backdrop-blur-lg">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-light">Current Stage: {clientProgress.currentStage}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {timeline.daysRemaining} days remaining in this phase
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light">{clientProgress.progress}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${clientProgress.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-6 gap-4">
                {clientProgress.stages.map((stage, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${
                      stage.completed
                        ? 'text-primary'
                        : stage.current
                        ? 'text-primary/80'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mb-2">
                      {stage.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : stage.current ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="text-xs text-center font-light">{stage.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl backdrop-blur-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Payment Status</h2>
                <button className="text-primary hover:text-primary/80 transition-colors duration-300">
                  <CreditCard className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl">
                  <div>
                    <p className="font-light">Total Paid</p>
                    <p className="text-2xl font-light text-primary">${payments.totalPaid}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-light">Amount Due</p>
                    <p className="text-2xl font-light text-destructive">${payments.totalDue}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {payments.pending.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl"
                    >
                      <div>
                        <p className="font-light">{payment.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {payment.dueDate}
                        </p>
                      </div>
                      <span className="text-lg font-light text-destructive">
                        ${payment.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Document Status */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl backdrop-blur-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Document Status</h2>
                <button className="text-primary hover:text-primary/80 transition-colors duration-300">
                  <FileCheck className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl"
                  >
                    <div>
                      <p className="font-light">{doc.name}</p>
                      {doc.uploadDate && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded: {doc.uploadDate}
                        </p>
                      )}
                      {doc.reason && (
                        <p className="text-sm text-destructive">{doc.reason}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        doc.status === 'verified'
                          ? 'bg-green-500/10 text-green-500'
                          : doc.status === 'rejected'
                          ? 'bg-red-500/10 text-red-500'
                          : doc.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative group lg:col-span-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl backdrop-blur-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Recent Updates</h2>
                <button className="text-primary hover:text-primary/80 transition-colors duration-300">
                  <Bell className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl"
                  >
                    <div className="flex items-start space-x-3">
                      {notification.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : notification.type === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                      ) : (
                        <Bell className="w-5 h-5 text-primary mt-0.5" />
                      )}
                      <div>
                        <p className="font-light">{notification.message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="relative group lg:col-span-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl backdrop-blur-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light tracking-wider">Next Steps</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated completion: {timeline.estimatedCompletion}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="group relative p-6 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-primary/50 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <FileCheck className="w-6 h-6 text-primary" />
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-light mb-2">Upload Documents</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete your document submission
                  </p>
                </button>

                <button className="group relative p-6 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-primary/50 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-light mb-2">Make Payment</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Process your pending payments
                  </p>
                </button>

                <button className="group relative p-6 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-primary/50 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <Bell className="w-6 h-6 text-primary" />
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-light mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View detailed timeline
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}