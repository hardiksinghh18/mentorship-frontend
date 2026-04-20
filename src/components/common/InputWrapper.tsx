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
                    <label className="text-xs font-semibold text-muted uppercase tracking-widest opacity-80">
                        {label}
                    </label>
                )}
                {error && (
                    <span className="text-[10px] text-red-400 font-medium tracking-tight">
                        {error}
                    </span>
                )}
            </div>
            
            <div className="relative group/input flex items-center">
                {Icon && (
                    <div className={`absolute left-4 z-10 transition-colors ${
                        error ? 'text-red-500' : 'text-muted group-focus-within/input:text-white'
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
                        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-white/5 border ${
                            error 
                                ? 'border-red-500/50' 
                                : 'border-white/10 focus:border-white/30 focus:bg-white/[0.08]'
                        } text-white transition-all placeholder:text-muted/30 text-sm outline-none`}
                        placeholder={placeholder}
                    />
                )}
                
                {!children && (
                    <div className="absolute right-4 flex items-center gap-2">
                        {value && !error && (
                            <FaCheckCircle className="text-white/20" size={12} />
                        )}
                        {error && (
                            <FaExclamationCircle className="text-red-500/50" size={12} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export default InputWrapper;

