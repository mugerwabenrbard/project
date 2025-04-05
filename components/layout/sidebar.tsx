import React from 'react';
import Link from 'next/link';
import {
  Home,
  Users,
  FileText,
  CreditCard,
  Plane,
  Building2,
  Package,
  BarChart2,
  Settings,
  LogOut,
  User,
  User2,
} from 'lucide-react';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/staff/dashboard' },
    { icon: User2, label: 'Users', href: '/staff/users' },
    { icon: Users, label: 'Leads', href: '/staff/leads' },
    { icon: Users, label: 'Clients', href: '/staff/clients' }, // Added Clients
    { icon: FileText, label: 'Documents', href: '/staff/documents' },
    { icon: CreditCard, label: 'Payments', href: '/staff/payments' },
    { icon: Plane, label: 'Travel', href: '/staff/travel' }, // Added Travel (using Plane icon)
    { icon: Building2, label: 'Partners', href: '/staff/partners' }, // Renamed Placements to Partners
    { icon: Package, label: 'Inventory', href: '/staff/inventory' }, // Added Inventory
    { icon: BarChart2, label: 'Reports', href: '/staff/reports' }, // Added Reports
    { icon: Settings, label: 'Settings', href: '/staff/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-extralight tracking-wider text-orionte-green">
            ORIONTE AFRICA
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-orionte-green hover:text-white transition-all duration-300"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-light">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 mt-auto">
          <LogOut className="w-5 h-5" />
          <span className="font-light">Logout</span>
        </button>
      </div>
    </div>
  );
}