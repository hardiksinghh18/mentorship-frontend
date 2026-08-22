import React, { useState, useEffect } from 'react';
import { FiX, FiSliders } from 'react-icons/fi';
import PillGroup from '../common/PillGroup';
import SkillAutocomplete from '../common/SkillAutocomplete';
import {
    DEFAULT_FILTERS,
    ROLE_OPTIONS,
    EXPERIENCE_OPTIONS,
    CONNECTION_STATUS_OPTIONS,
} from '../../utils/filterConstants';

const FilterSidebar = ({
    isOpen,
    onClose,
    filters,
    onApplyFilters,
    onClearFilters
}) => {
    // Local draft state — changes here don't affect the parent until "Apply"
    const [draft, setDraft] = useState(filters);

    // Sync draft with parent filters whenever the sidebar opens
    useEffect(() => {
        if (isOpen) {
            setDraft(filters);
        }
    }, [isOpen]);

    const handleDraftChange = (name, value) => {
        setDraft(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApplyFilters(draft);
        onClose();
    };

    const handleClear = () => {
        const cleared = { ...DEFAULT_FILTERS, name: filters.name };
        setDraft(cleared);
        onApplyFilters(cleared);
    };

    const isDraftDirty = draft.role || draft.skills || draft.minExperience || draft.connectionStatus !== 'all';

    return (
        <>
            {/* Backdrop overlay */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar drawer panel */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-zinc-200 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <FiSliders className="text-zinc-900 w-5 h-5" />
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900">Filters</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-zinc-950 cursor-pointer"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Form fields */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <PillGroup
                        label="Member Role"
                        name="role"
                        value={draft.role}
                        options={ROLE_OPTIONS}
                        onChange={handleDraftChange}
                    />

                    <PillGroup
                        label="Experience Level"
                        name="minExperience"
                        value={draft.minExperience}
                        options={EXPERIENCE_OPTIONS}
                        onChange={handleDraftChange}
                    />

                    <PillGroup
                        label="Connection Status"
                        name="connectionStatus"
                        value={draft.connectionStatus}
                        options={CONNECTION_STATUS_OPTIONS}
                        onChange={handleDraftChange}
                    />

                    {/* Skills autocomplete */}
                    <SkillAutocomplete
                        value={draft.skills}
                        onChange={(skills) => handleDraftChange("skills", skills)}
                    />
                </div>

                {/* Footer buttons */}
                <div className="p-6 pb-32 md:pb-6 border-t border-zinc-200 bg-zinc-50 flex gap-4">
                    <button
                        onClick={handleClear}
                        disabled={!isDraftDirty}
                        className="flex-1 py-3 border border-zinc-300 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 hover:text-zinc-950 transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-700 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;
