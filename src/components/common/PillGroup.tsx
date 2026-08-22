import React from 'react';

const PillGroup = ({ label, name, options, value, onChange }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 block">
            {label}
        </label>
        <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(name, opt.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        value === opt.value
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export default PillGroup;
