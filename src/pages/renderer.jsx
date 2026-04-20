import React from 'react';

export const StatCard = ({ icon: Icon, label, value, description }) => (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:bg-white/[0.04] transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Icon size={120} />
        </div>
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Icon size={20} />
        </div>
        <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{label}</h3>
            <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black tracking-tighter text-white">{value}</span>
            </div>
            <p className="text-zinc-600 text-xs font-medium leading-relaxed max-w-[180px]">
                {description}
            </p>
        </div>
    </div>
);

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};
