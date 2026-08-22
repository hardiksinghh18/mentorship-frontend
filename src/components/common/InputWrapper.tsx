import React, { ReactNode, ComponentType } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons';

interface InputWrapperProps {
    label?: string;
    name?: string;
    type?: string;
    icon?: ComponentType<IconBaseProps>;
    placeholder?: string;
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: ReactNode;
    required?: boolean;
    className?: string;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
    label,
    name,
    type = "text",
    icon: Icon,
    placeholder,
    error,
    value,
    onChange,
    children,
    required = true,
    className = ""
}) => {
    return (
        <div className={`space-y-2 flex-1 ${className}`}>
            <div className="flex justify-between items-center ml-1">
                {label && (
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
                        {label}
                    </label>
                )}
                {error && (
                    <span className="text-[10px] text-red-500 font-medium tracking-tight">
                        {error}
                    </span>
                )}
            </div>
            
            <div className="relative group/input flex items-center">
                {Icon && (
                    <div className={`absolute left-4 z-10 transition-colors ${
                        error ? 'text-red-500' : 'text-zinc-400 group-focus-within/input:text-zinc-900 group-hover/input:text-zinc-900'
                    }`}>
                        <Icon size={14} />
                    </div>
                )}
                
                {children || (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-zinc-100 border ${
                            error 
                                ? 'border-red-500' 
                                : 'border-zinc-300 focus:border-zinc-500 focus:bg-white'
                        } text-zinc-900 transition-all placeholder:text-zinc-400 text-sm outline-none`}
                        placeholder={placeholder}
                    />
                )}
                
                {!children && (
                    <div className="absolute right-4 flex items-center gap-2">
                        {value && !error && (
                            <FaCheckCircle className="text-emerald-500" size={12} />
                        )}
                        {error && (
                            <FaExclamationCircle className="text-red-500" size={12} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default InputWrapper;
