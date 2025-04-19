import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import UserRoleDisplay from '../UserRoleDisplay';

export function Topbar() {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orionte-green w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-orionte-green focus:ring-1 focus:ring-orionte-green font-light"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-orionte-green hover:bg-green-50 rounded-lg transition-colors duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 p-2 text-orionte-green hover:bg-green-50 rounded-lg transition-colors duration-300">
          <div className="w-8 h-8 bg-orionte-green rounded-full flex items-center justify-center text-white">
            <User className="w-5 h-5" />
          </div>
          <span className="font-light"><UserRoleDisplay /></span>
        </div>
      </div>
    </div>
  );
}