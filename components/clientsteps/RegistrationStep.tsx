import React from 'react';

export default function RegistrationForm() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Status: Pending</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Next of Kin Name</label>
            <input
              type="text"
              value=""
              placeholder="e.g., Jane Doe"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Kin Address</label>
            <textarea
              value=""
              placeholder="e.g., 123 Main St, City"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Kin Phone Number</label>
            <input
              type="tel"
              value=""
              placeholder="e.g., +1234567890"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Number</label>
            <input
              type="text"
              value=""
              placeholder="e.g., A12345678"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Issue Date</label>
            <input
              type="date"
              value=""
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Passport Expiry Date</label>
            <input
              type="date"
              value=""
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">NIN</label>
            <input
              type="text"
              value=""
              placeholder="e.g., CM1234567890"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Date of Birth</label>
            <input
              type="date"
              value=""
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Address</label>
            <textarea
              value=""
              placeholder="e.g., 456 Elm St, Town"
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
              rows="2"
            />
          </div>
          <div>
            <label className="block text-xs font-light text-gray-500 mb-1">Choose Program</label>
            <select
              value=""
              className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            >
              <option value="" disabled>Select a program</option>
              <option value="ja_recruit">JA Recruit</option>
              <option value="tsn_construction">TSN Construction</option>
              <option value="ab_farms_aps">AB-Farms APS</option>
              <option value="bixter">Bixter</option>
              <option value="workadvice">Workadvice</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}