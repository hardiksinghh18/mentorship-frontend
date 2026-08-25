import React from 'react';
import { getGreeting } from '../../renderer';

interface WelcomeHeaderProps {
  fullName?: string;
  username?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ fullName, username }) => {
  const displayName = fullName ? fullName.split(' ')[0] : username || '';
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-12 select-none">
      <div className="space-y-2 text-left">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-zinc-900 leading-tight">
          {getGreeting()}, <span className="font-semibold text-zinc-950">{displayName}</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-normal max-w-2xl tracking-normal leading-relaxed mt-2">
          Manage your mentorships, chat with connections, and explore new opportunities.
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
