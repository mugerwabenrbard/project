'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowUpRight } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';
import { Loading } from '@/components/loading';
import { toast } from 'sonner';

export default function AddLeadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    highestEducationLevel: '',
    programPlacement: [] as string[],
    countryInterest: [] as string[],
    university: '',
    ieltsCertificate: false,
  });

  if (status === 'loading') return <Loading />;
  if (!session || !['admin', 'staff'].includes(session.user.role)) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleProgramPlacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.programPlacement || [];
      return {
        ...prev,
        programPlacement: checked
          ? [...current, value]
          : current.filter((p) => p !== value),
      };
    });
  };

  const handleCountryInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const current = prev.countryInterest || [];
      return {
        ...prev,
        countryInterest: checked
          ? [...current, value]
          : current.filter((c) => c !== value),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'nationality',
      'highestEducationLevel',
      'programPlacement',
      'countryInterest',
      'university',
    ];
    if (requiredFields.some((field) => !formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0))) {
      toast.error('All required fields must be filled');
      return;
    }
    if (formData.ieltsCertificate === undefined) {
      toast.error('IELTS Certificate must be specified');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create lead');
      }
      toast.success('Lead created successfully');
      router.push('/staff/leads');
    } catch (error) {
      toast.error(error.message || 'Failed to create lead');
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">ADD NEW LEAD</h1>
            <Link href="/staff/leads" className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1">
              <span>Back to Leads</span>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <UserPlus className="h-6 w-6 text-orionte-green mr-2" />
              <h2 className="text-lg font-light tracking-wider">Lead Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="First" />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">Middle Name</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Middle" />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Last" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Phone" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Nationality <span className="text-red-500">*</span></label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="Nationality" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Education Level <span className="text-red-500">*</span></label>
                  <select name="highestEducationLevel" value={formData.highestEducationLevel} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm">
                    <option value="">Select</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor">Bachelor’s</option>
                    <option value="Master">Master’s</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Program Placement <span className="text-red-500">*</span></label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {['Crop Production', 'Livestock Management', 'Agribusiness', 'Horticulture', 'Agricultural Engineering'].map((program) => (
                      <label key={program} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="programPlacement"
                          value={program}
                          checked={formData.programPlacement.includes(program)}
                          onChange={handleProgramPlacementChange}
                          className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">{program}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">Country of Interest <span className="text-red-500">*</span></label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {['Canada', 'Australia', 'Germany', 'USA', 'UK'].map((country) => (
                      <label key={country} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="countryInterest"
                          value={country}
                          checked={formData.countryInterest.includes(country)}
                          onChange={handleCountryInterestChange}
                          className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">University/College <span className="text-red-500">*</span></label>
                  <input type="text" name="university" value={formData.university} onChange={handleChange} className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm" placeholder="University" />
                </div>
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">IELTS Certificate <span className="text-red-500">*</span></label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ieltsCertificate"
                        value="true"
                        checked={formData.ieltsCertificate === true}
                        onChange={() => setFormData((prev) => ({ ...prev, ieltsCertificate: true }))}
                        className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300"
                      />
                      <span className="font-light text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ieltsCertificate"
                        value="false"
                        checked={formData.ieltsCertificate === false}
                        onChange={() => setFormData((prev) => ({ ...prev, ieltsCertificate: false }))}
                        className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300"
                      />
                      <span className="font-light text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}