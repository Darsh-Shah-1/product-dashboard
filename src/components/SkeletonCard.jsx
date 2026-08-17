import React from 'react';

export default function SkeletonCard({ theme }) {
  const isDark = theme !== 'solar';

  return (
    <div className={`border-2 rounded-2xl overflow-hidden p-4 animate-pulse ${
      isDark ? 'bg-black border-slate-800' : 'bg-white border-slate-300'
    }`}>
      <div className={`h-48 rounded-xl mb-4 border-2 border-black ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      <div className={`h-4 rounded-lg w-3/4 mb-2 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      <div className={`h-3 rounded-lg w-full mb-1 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}></div>
      <div className={`h-3 rounded-lg w-2/3 mb-4 ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}></div>
      <div className="flex justify-between items-center pt-2">
        <div className={`h-6 rounded-lg w-1/4 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
        <div className={`h-8 rounded-lg w-1/3 ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      </div>
    </div>
  );
}
