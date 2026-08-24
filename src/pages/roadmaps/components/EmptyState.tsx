import React from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  message: string;
  showCreateCTA?: boolean;
}

const EmptyState = ({ message, showCreateCTA = false }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 rounded-[24px] text-zinc-400 text-sm font-medium bg-zinc-50/50 animate-in fade-in duration-300">
      <p className="text-zinc-500 font-medium text-center px-6">{message}</p>
      {showCreateCTA && (
        <Link
          to="/roadmaps/create"
          className="text-accent font-bold mt-3 hover:underline text-xs tracking-tight transition-all"
        >
          Create one now!
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
