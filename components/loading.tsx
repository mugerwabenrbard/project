'use client';

import React from 'react';

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 backdrop-blur-lg z-50">
      <div
        className="flex flex-col items-center p-8 bg-[#004225]/90 rounded-3xl shadow-2xl transform transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,66,37,0.5)] dark:hover:shadow-[0_25px_50px_-12px_rgba(253,185,19,0.3)]"
      >
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-[#FDB913] border-l-[#004225] border-b-[#FDB913] border-r-[#004225] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-[#004225] border-l-[#FDB913] border-b-[#004225] border-r-[#FDB913] rounded-full animate-spin-reverse"></div>
        </div>
        {/* Text */}
        <span
          className="mt-4 text-xl font-extralight tracking-wider uppercase bg-clip-text text-transparent text-white animate-pulse"
        >
          Loading
        </span>
      </div>
    </div>
  );
}