'use client';

import React from 'react';
import { UserPlus, ArrowUpRight } from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import Link from 'next/link';

export default function AddLeadPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-extralight tracking-wider text-orionte-green">
              ADD NEW LEAD
            </h1>
            <Link
              href="/staff/leads"
              className="text-orionte-green hover:text-orionte-green/80 transition-colors duration-300 flex items-center space-x-1"
            >
              <span>Back to Leads</span>
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg p-4 shadow-corporate max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <UserPlus className="h-6 w-6 text-orionte-green mr-2" />
              <h2 className="text-lg font-light tracking-wider">Lead Details</h2>
            </div>

            <form className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                      placeholder="First"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                      placeholder="Middle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-500 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                      placeholder="Last"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                    placeholder="Email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                    placeholder="Phone"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                    placeholder="Nationality"
                  />
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Education Level
                  </label>
                  <select
                    name="educationLevel"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                  >
                    <option value="">Select</option>
                    <option value="highSchool">High School</option>
                    <option value="diploma">Diploma</option>
                    <option value="bachelor">Bachelor’s</option>
                    <option value="master">Master’s</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Program Placement */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Program Placement
                  </label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {[
                      'Crop Production',
                      'Livestock Management',
                      'Agribusiness',
                      'Horticulture',
                      'Agricultural Engineering',
                    ].map((program) => (
                      <label key={program} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="programPlacement"
                          value={program.toLowerCase().replace(' ', '-')}
                          className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">
                          {program}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country of Interest */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    Country of Interest
                  </label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {['Canada', 'Australia', 'Germany', 'USA', 'UK'].map((country) => (
                      <label key={country} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="countryInterest"
                          value={country.toLowerCase()}
                          className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300 rounded"
                        />
                        <span className="font-light text-gray-700 text-sm">
                          {country}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* University */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    University/College
                  </label>
                  <input
                    type="text"
                    name="university"
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green text-sm"
                    placeholder="University"
                  />
                </div>

                {/* IELTS Certificate */}
                <div>
                  <label className="block text-xs font-light text-gray-500 mb-1">
                    IELTS Certificate
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ielts"
                        value="yes"
                        className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300"
                      />
                      <span className="font-light text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-1 text-sm">
                      <input
                        type="radio"
                        name="ielts"
                        value="no"
                        className="h-4 w-4 text-orionte-green focus:ring-orionte-green border-gray-300"
                      />
                      <span className="font-light text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button (Spanning Both Columns) */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full p-2 rounded-lg text-white font-light tracking-wider bg-orionte-green hover:bg-orionte-green/90 transition-colors duration-300 text-sm"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}