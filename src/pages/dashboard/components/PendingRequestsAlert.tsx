import React from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiChevronRight } from 'react-icons/fi';

interface PendingRequestsAlertProps {
  count: number;
}

const PendingRequestsAlert: React.FC<PendingRequestsAlertProps> = ({ count }) => {
  if (count <= 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col gap-4 text-left group hover:border-zinc-350 transition-all duration-300">
      <div className="flex items-start gap-3.5">
        {/* Sleek Squircle Icon Block */}
        <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-zinc-150 group-hover:border-zinc-300">
          <FiBell className="w-4 h-4 animate-pulse text-zinc-800" />
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none block">
            Action Required
          </span>
          <p className="text-xs text-zinc-655 font-bold leading-relaxed">
            You have <span className="text-zinc-950 font-black underline decoration-zinc-950/20 underline-offset-2">{count} pending student requests</span> waiting for your approval.
          </p>
        </div>
      </div>
      {/* High-contrast CTA Button */}
      <Link
        to="/roadmaps?tab=workspace&filter=applications"
        className="w-full text-center py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-tight active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-zinc-950/10"
      >
        <span>Review Applications</span>
        <FiChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default PendingRequestsAlert;
