import React from 'react';

const ApplicationsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="p-6 rounded-[24px] border border-zinc-200 bg-white flex flex-col justify-between text-left gap-4 h-[240px] shadow-[0_1px_3px_rgba(0,0,0,0.015)]">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-zinc-200"></div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-zinc-200 rounded"></div>
                <div className="h-2.5 w-12 bg-zinc-200/75 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-16 bg-zinc-200/60 rounded-full"></div>
          </div>
          <div className="h-10 w-full bg-zinc-200/60 rounded-xl"></div>
          <div className="h-3 w-40 bg-zinc-200/50 rounded"></div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-zinc-50">
          <div className="h-9 w-full bg-zinc-200/70 rounded-xl"></div>
          <div className="h-9 w-full bg-zinc-200/70 rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ApplicationsLoader;
