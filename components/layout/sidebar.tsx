import React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      console.log("[Sidebar] Logout successful");
      router.push("/");
    } catch (error) {
      console.error("[Sidebar] Logout error:", error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/staff/dashboard" },
    { icon: User2, label: "Users", href: "/staff/users" },
    { icon: Users, label: "Leads", href: "/staff/leads" },
    { icon: Users, label: "Clients", href: "/staff/clients" }, // Added Clients
    { icon: FileText, label: "Documents", href: "/staff/documents" },
    { icon: CreditCard, label: "Payments", href: "/staff/payments" },
    { icon: Plane, label: "Travel", href: "/staff/travel" }, // Added Travel (using Plane icon)
    { icon: Building2, label: "Partners", href: "/staff/partners" }, // Renamed Placements to Partners
    { icon: Package, label: "Inventory", href: "/staff/inventory" }, // Added Inventory
    { icon: BarChart2, label: "Reports", href: "/staff/reports" }, // Added Reports
    { icon: Settings, label: "Settings", href: "/staff/settings" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4">
      <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-2xl font-extralight tracking-wider text-orionte-green">
            ORIONTE AFRICA
          </h1>
        </div>

        {/* Scrollable menu area */}
        <div className="flex-1 overflow-y-auto pr-1">
          <nav className="space-y-1 pb-6">
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
        </div>

        {/* Logout stays pinned at the bottom and never gets cut off */}
        <div className="pt-4">
          <button
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 bg-[#FDB913] text-white shadow-corporate"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-light">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
