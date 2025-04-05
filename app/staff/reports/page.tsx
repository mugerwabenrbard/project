import React from 'react';
import { 
  Users, 
  CreditCard, 
  BarChart2, 
  FileText, 
  Package, 
  Globe, 
  Award, 
  Clipboard, 
  Paperclip, 
  Plane, 
  Train, 
  FileCheck, 
  PenTool 
} from 'lucide-react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

// Assuming you have an AuthenticatedLayout component

// Define report card types
type ReportCardProps = {
  title: string;
  icon: React.ElementType;
  count?: number | string;
};

const ReportCard: React.FC<ReportCardProps> = ({ title, icon: Icon, count }) => {
  return (
    <div 
      className="
        bg-gradient-to-br from-gray-50 to-gray-100 
        dark:from-gray-900 dark:to-gray-800
        rounded-3xl 
        p-6 
        shadow-2xl 
        transform 
        transition-all 
        duration-500 
        ease-in-out 
        hover:-translate-y-2 
        hover:shadow-xl 
        backdrop-blur-lg
        border 
        border-opacity-10 
        dark:border-opacity-20
      "
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Icon 
            className="
              text-[#004225] 
              dark:text-[#FDB913] 
              opacity-70 
              mb-2
            " 
            size={36} 
          />
          <h3 
            className="
              uppercase 
              tracking-wider 
              font-light 
              text-sm 
              text-gray-600 
              dark:text-gray-300
            "
          >
            {title}
          </h3>
          <p 
            className="
              text-2xl 
              font-extralight 
              bg-clip-text 
              text-transparent 
              bg-gradient-to-r 
              from-[#004225] 
              to-[#FDB913]
            "
          >
            {count || 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReportsDashboard: React.FC = () => {
  // You would typically fetch these values from your backend
  const reportData = [
    { 
      title: 'Clients List', 
      icon: Users, 
      count: 142 
    },
    { 
      title: 'Expenditures', 
      icon: CreditCard, 
      count: '$52,340' 
    },
    { 
      title: 'Revenues', 
      icon: BarChart2, 
      count: '$128,750' 
    },
    { 
      title: 'Invoices', 
      icon: FileText, 
      count: 87 
    },
    { 
      title: 'Inventory', 
      icon: Package, 
      count: 256 
    },
    { 
      title: 'App Registration', 
      icon: Globe, 
      count: 53 
    },
    { 
      title: 'Medical Checkup', 
      icon: Award, 
      count: 'In Progress' 
    },
    { 
      title: 'IELTS Status', 
      icon: Clipboard, 
      count: 'Pending' 
    },
    { 
      title: 'Contract Application', 
      icon: Paperclip, 
      count: 12 
    },
    { 
      title: 'Contract Commitment', 
      icon: FileCheck, 
      count: 8 
    },
    { 
      title: 'Air Tickets', 
      icon: Plane, 
      count: 3 
    },
    { 
      title: 'Train Tickets', 
      icon: Train, 
      count: 2 
    },
    { 
      title: 'Contracts Received', 
      icon: PenTool, 
      count: 6 
    },
    { 
      title: 'Work Permit', 
      icon: FileCheck, 
      count: 'Processing' 
    },
    { 
      title: 'Partner Invoices', 
      icon: FileText, 
      count: 15 
    }
  ];

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
        "
      >
        <h1 
          className="
            text-4xl 
            font-extralight 
            tracking-wider 
            text-center 
            mb-12 
            bg-clip-text 
            text-transparent 
            bg-gradient-to-r 
            from-[#004225] 
            to-[#FDB913]
          "
        >
          REPORTS DASHBOARD
        </h1>
        
        <div 
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-5 
            gap-6
          "
        >
          {reportData.map((report, index) => (
            <ReportCard 
              key={index}
              title={report.title}
              icon={report.icon}
              count={report.count}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ReportsDashboard;