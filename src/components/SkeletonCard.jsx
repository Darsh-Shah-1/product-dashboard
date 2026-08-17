import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 animate-pulse">
      <div className="h-44 bg-slate-800/60 rounded-lg mb-4"></div>
      <div className="h-4 bg-slate-800/60 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-slate-800/40 rounded w-full mb-1"></div>
      <div className="h-3 bg-slate-800/40 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-800/60 rounded w-1/4"></div>
        <div className="h-4 bg-slate-800/60 rounded w-1/6"></div>
      </div>
    </div>
  );
}