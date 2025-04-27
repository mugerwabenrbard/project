'use client';

import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, ChevronDown } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import RegistrationForm from '@/components/clientsteps/RegistrationStep';
import MedicalStep from '@/components/clientsteps/MedicalStep';
import VideoCVStep from '@/components/clientsteps/VideoCVStep';
import DocumentAssistanceStep from '@/components/clientsteps/DocumentAssistanceStep';
import SubmitToPartnerStep from '@/components/clientsteps/SubmitToPartnerStep';
import IELTSStep from '@/components/clientsteps/IELTSStep';
import ContractStep from '@/components/clientsteps/ContractStep';
import VisaStep from '@/components/clientsteps/VisaStep';
import WorkPermitStep from '@/components/clientsteps/WorkPermitStep';
import AirTicketStep from '@/components/clientsteps/AirtcketStep';
import TrainTicketStep from '@/components/clientsteps/TrainTicketStep';
import AirportStep from '@/components/clientsteps/AirportStep';
import { Loading } from '@/components/loading';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  stages: any[];
}

export default function ClientProgressTrackerPage({ params }) {
  const [openStep, setOpenStep] = useState(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchClient() {
    try {
      const response = await fetch(`/api/tracker/${params.id}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch client');
      const data = await response.json();
      setClient(data);
    } catch (error) {
      setClient(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const isStageCompleted = (stepName: string) =>
    client?.stages?.some(
      (stage: any) =>
        stage.stageName.toLowerCase() === stepName.toLowerCase() && stage.completed
    );

  const registrationStage = client?.stages?.find(
    (stage: any) => stage.stageName.toLowerCase() === 'registration'
  );

  const trackingSteps = [
    {
      id: 1,
      name: 'Registration',
      description: 'Client registration and initial onboarding',
      content: <RegistrationForm 
        leadId={client?.id} 
        registrationStageId={registrationStage?.id} 
        onSuccess={fetchClient}
        completed={registrationStage?.completed}
        initialData={registrationStage?.data || {}}
      />,
    },
    {
      id: 2,
      name: 'Academic Documents',
      description: 'Completion of academic examination',
      content: <DocumentAssistanceStep 
        leadId={client?.id}
        stageId={client?.stages?.find(stage => stage.stageName.toLowerCase() === 'academic documents')?.id}
        onSuccess={fetchClient}
        initialData={client?.stages?.find(stage => stage.stageName.toLowerCase() === 'academic documents')?.data || {}}
        completed={client?.stages?.find(stage => stage.stageName.toLowerCase() === 'academic documents')?.completed}
      />,
    },
    {
      id: 3,
      name: 'Medical Check',
      description: 'Completion of medical examination',
      content: <MedicalStep />,
    },
    {
      id: 4,
      name: 'Video CV',
      description: 'Submission of video CV',
      content: <VideoCVStep />,
    },
    {
      id: 5,
      name: 'IELTS Test',
      description: 'Completion of English IELTS test',
      content: <IELTSStep />,
    },
    {
      id: 6,
      name: 'Partner Submission',
      description: 'Submission of documents to Bixter',
      content: <SubmitToPartnerStep />,
    },
    {
      id: 7,
      name: 'Contract Processing',
      description: 'Processing of employment contract',
      content: <ContractStep />,
    },
    {
      id: 8,
      name: 'Visa Processing',
      description: 'Processing of visa application',
      content: <VisaStep />,
    },
    {
      id: 9,
      name: 'Work Permit Processing',
      description: 'Processing of work permit application',
      content: <WorkPermitStep />,
    },
    {
      id: 10,
      name: 'Air Ticket',
      description: 'Booking of air ticket',
      content: <AirTicketStep />,
    },
    {
      id: 11,
      name: 'Train Ticket',
      description: 'Booking of train ticket',
      content: <TrainTicketStep />,
    },
    {
      id: 12,
      name: 'Airport Transfer',
      description: 'Arrangement of airport transfer',
      content: <AirportStep />,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!client) {
    return <div>No client found</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-corporate border border-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-extralight tracking-widest text-orionte-green uppercase">
                Client Progress Tracker
              </h1>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Client ID</p>
                  <p className="text-base font-medium text-gray-900 mt-1">{client.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {client.firstName} {client.lastName}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-xs font-light text-gray-500 uppercase tracking-wide">Nationality</p>
                  <p className="text-base font-medium text-gray-900 mt-1">{client.nationality}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-corporate border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 py-4 px-6 bg-gray-50">
              <h2 className="text-xl font-light tracking-wider text-gray-800">
                Client Progress
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {trackingSteps.map((step) => {
                const isCompleted = isStageCompleted(step.name);
                const isOpen = openStep === step.id;

                return (
                  <div key={step.id} className="transition-all duration-300 ease-in-out">
                    <button
                      onClick={() => setOpenStep(isOpen ? null : step.id as number)}
                      className={`flex items-center w-full text-left py-4 px-6 focus:outline-none transition-all duration-200 ${
                        isCompleted
                          ? 'bg-orionte-green/5 hover:bg-orionte-green/10'
                          : 'bg-white hover:bg-red-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? 'bg-orionte-green text-white shadow-md'
                              : 'bg-red-200 text-red-700'
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-lg font-medium">{step.id}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3
                          className={`text-lg font-medium tracking-wide ${
                            isCompleted ? 'text-orionte-green' : 'text-red-600'
                          }`}
                        >
                          {step.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </div>
                      <div className="ml-4">
                        <ChevronDown
                          className={`w-6 h-6 ${
                            isCompleted ? 'text-gray-400' : 'text-red-400'
                          } transition-transform duration-300`}
                        />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="bg-gray-50 px-6 py-6 border-t border-gray-200 transition-all duration-300 ease-in-out">
                        <div className="ml-16">{step.content}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}