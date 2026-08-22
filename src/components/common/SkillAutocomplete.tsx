import React from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FiX, FiCornerDownLeft } from 'react-icons/fi';
import { PREDEFINED_SKILLS } from '../../utils/filterConstants';

const filter = createFilterOptions();

const SkillAutocomplete = ({ value, onChange }) => {
    // Parse comma-separated skills string into array
    const selectedSkills = value
        ? value.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const handleChange = (_event, newValue) => {
        // Extract actual skill strings (handle both plain strings and custom objects)
        const cleaned = newValue.map(item =>
            typeof item === 'string' ? item : item.inputValue || item
        );
        onChange(cleaned.join(', '));
    };

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1 block">
                Skills
            </label>
            <Autocomplete
                multiple
                freeSolo
                selectOnFocus
                handleHomeEndKeys
                options={PREDEFINED_SKILLS}
                value={selectedSkills}
                onChange={handleChange}
                filterOptions={(options, params) => {
                    // Filter out already-selected skills
                    const available = options.filter(
                        opt => !selectedSkills.some(s => s.toLowerCase() === opt.toLowerCase())
                    );
                    const filtered = filter(available, params);

                    const { inputValue } = params;
                    // If the typed value doesn't match any option, add a "create" entry
                    const isExisting = options.some(
                        opt => opt.toLowerCase() === inputValue.trim().toLowerCase()
                    );
                    const isAlreadySelected = selectedSkills.some(
                        s => s.toLowerCase() === inputValue.trim().toLowerCase()
                    );

                    if (inputValue.trim() !== '' && !isExisting && !isAlreadySelected) {
                        filtered.push({
                            inputValue: inputValue.trim(),
                            label: inputValue.trim(),
                            isCustom: true,
                        });
                    }

                    return filtered;
                }}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    if (option.inputValue) return option.inputValue;
                    return option.label || '';
                }}
                renderOption={(props, option) => {
                    const { key, ...restProps } = props;
                    if (typeof option === 'object' && option.isCustom) {
                        return (
                            <li key={key} {...restProps} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontWeight: 700 }}>"{option.label}"</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#a1a1aa', fontSize: '11px', fontWeight: 600 }}>
                                    Enter <FiCornerDownLeft size={12} />
                                </span>
                            </li>
                        );
                    }
                    return <li key={key} {...restProps}>{option}</li>;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={selectedSkills.length > 0 ? "Add more skills..." : "Search skills..."}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#f4f4f5',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#18181b',
                                padding: '6px 12px !important',
                                '& fieldset': {
                                    borderColor: '#d4d4d8',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#a1a1aa',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#71717a',
                                    borderWidth: '1px',
                                },
                                '&.Mui-focused': {
                                    bgcolor: '#ffffff',
                                },
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: '#a1a1aa',
                                opacity: 1,
                                fontWeight: 700,
                            },
                        }}
                    />
                )}
                slotProps={{
                    chip: {
                        deleteIcon: <FiX size={12} />,
                        sx: {
                            bgcolor: '#18181b',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '12px',
                            borderRadius: '8px',
                            height: '28px',
                            '& .MuiChip-deleteIcon': {
                                color: '#a1a1aa',
                                '&:hover': { color: '#ffffff' },
                            },
                        },
                    },
                    paper: {
                        sx: {
                            bgcolor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            mt: 0.5,
                            '& .MuiAutocomplete-option': {
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#3f3f46',
                                py: 1.5,
                                px: 2,
                                '&:hover': {
                                    bgcolor: '#f4f4f5',
                                    color: '#18181b',
                                },
                                '&[aria-selected="true"]': {
                                    bgcolor: '#f4f4f5',
                                    color: '#18181b',
                                },
                                '&.Mui-focused': {
                                    bgcolor: '#f4f4f5',
                                    color: '#18181b',
                                },
                            },
                            '& .MuiAutocomplete-noOptions': {
                                fontSize: '12px',
                                color: '#71717a',
                                fontWeight: 600,
                            },
                        },
                    },
                }}
                noOptionsText="No matching skills"
            />
        </div>
    );
};

export default SkillAutocomplete;
