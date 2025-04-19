"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import { Loading } from "../loading";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [status, session]);

  if (!isMounted || status === "loading") return <Loading />;
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar with independent scroll */}
      <aside className="w-64 min-w-[16rem] h-screen overflow-y-auto bg-white border-r border-gray-200 p-4">
        <Sidebar />
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="h-16 border-b border-gray-200 bg-white">
          <Topbar />
        </div>

        {/* Page content area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
