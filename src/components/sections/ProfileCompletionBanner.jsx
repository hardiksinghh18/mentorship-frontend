import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUserCheck, FiEyeOff, FiZap, FiArrowRight } from 'react-icons/fi';

const ProfileCompletionBanner = ({ variant = 'dashboard' }) => {
    const { user } = useSelector((state) => state.auth);

    const calculateProgress = () => {
        const fields = [
            { key: 'role', label: 'Role' },
            { key: 'skills', label: 'Skills', isArray: true },
            { key: 'bio', label: 'Bio' },
            { key: 'education', label: 'Education', isArray: true },
            { key: 'experience', label: 'Work Experience', isArray: true }
        ];

        let completedCount = 0;
        let missingField = "";

        fields.forEach(field => {
            const value = user?.[field.key];
            const isFilled = field.isArray 
                ? (Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value.length > 2)
                : !!value;
            
            if (isFilled) {
                completedCount++;
            } else if (!missingField) {
                missingField = field.label;
            }
        });

        const percentage = Math.round((completedCount / fields.length) * 100);
        return { percentage, missingField };
    };

    const { percentage, missingField } = calculateProgress();

    if (percentage === 100) return null;

    const isExplore = variant === 'explore';

    return (
        <div className={`relative group animate-in fade-in slide-in-from-top-4 duration-1000 ${isExplore ? 'mb-8' : 'mb-0'}`}>
            <div className={`relative border p-4 md:p-5 rounded-2xl overflow-hidden shadow-sm ${isExplore ? 'bg-amber-50/60 border-amber-200' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex flex-col space-y-4">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                                isExplore 
                                ? 'bg-amber-100 border-amber-300 text-amber-800' 
                                : 'bg-zinc-200 border-zinc-300 text-zinc-700'
                            }`}>
                                {isExplore ? <FiEyeOff size={14} /> : <FiUserCheck size={14} />}
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${isExplore ? 'text-amber-900' : 'text-zinc-900'}`}>
                                    {isExplore ? 'Ghost Mode Active' : 'Profile Status'}
                                </h3>
                                {isExplore && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>}
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{percentage}% COMPLETE</span>
                    </div>

                    {/* Progress Bar Row */}
                    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${isExplore ? 'bg-amber-500' : 'bg-zinc-900'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Footer Row: Content & CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                        <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium text-zinc-700 tracking-tight">
                                {isExplore 
                                    ? 'You are currently invisible to others. Finish your profile setup to go live and start connecting with others.' 
                                    : `Next: Add your ${missingField} to unlock connection credits.`
                                }
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium italic flex items-center gap-1.5">
                                {isExplore ? (
                                    <>
                                        <FiZap size={10} className="text-amber-600" />
                                        Unlock <span className="text-zinc-900 font-bold italic">AI Match Scores</span> for every profile upon completion.
                                    </>
                                ) : (
                                    'Note: Your profile is currently hidden from the community until it is 100% complete.'
                                )}
                            </p>
                        </div>
                        
                        <Link 
                            to="/profile/setup" 
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 active:scale-95 group/btn shrink-0 shadow-md bg-zinc-900 text-white hover:bg-zinc-800"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest">{isExplore ? 'Go Live' : 'Complete Now'}</span>
                            <FiArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;
