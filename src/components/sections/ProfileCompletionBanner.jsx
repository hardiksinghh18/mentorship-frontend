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
            {/* Contextual Glow */}
            <div className={`absolute -inset-0.5 rounded-[.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500 ${isExplore ? 'bg-orange-500/5' : 'bg-white/5'}`}></div>
            
            <div className={`relative border p-4 md:p-5 rounded-[.5rem] backdrop-blur-3xl overflow-hidden ${isExplore ? 'bg-[#09090b] border-orange-500/10' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="flex flex-col space-y-4">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                                isExplore 
                                ? 'bg-orange-500/10 border-orange-500/20 text-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                                : 'bg-white/5 border-white/10 text-white/60'
                            }`}>
                                {isExplore ? <FiEyeOff size={14} /> : <FiUserCheck size={14} />}
                            </div>
                            <div className="flex items-center gap-2">
                                <h3 className={`text-xs font-bold uppercase tracking-widest ${isExplore ? 'text-orange-500/80' : 'text-white/90'}`}>
                                    {isExplore ? 'Ghost Mode Active' : 'Profile Status'}
                                </h3>
                                {isExplore && <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse"></div>}
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{percentage}% COMPLETE</span>
                    </div>

                    {/* Progress Bar Row */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${isExplore ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Footer Row: Content & CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                        <div className="space-y-1">
                            <p className="text-xs md:text-sm font-medium text-zinc-400 tracking-tight">
                                {isExplore 
                                    ? 'You are currently invisible to others. Finish your profile setup to go live and start connecting with others.' 
                                    : `Next: Add your ${missingField} to unlock connection credits.`
                                }
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium italic flex items-center gap-1.5">
                                {isExplore ? (
                                    <>
                                        <FiZap size={10} className="text-orange-500" />
                                        Unlock <span className="text-zinc-300 font-bold italic">AI Match Scores</span> for every profile upon completion.
                                    </>
                                ) : (
                                    'Note: Your profile is currently hidden from the community until it is 100% complete.'
                                )}
                            </p>
                        </div>
                        
                        <Link 
                            to="/profile/setup" 
                            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 active:scale-95 group/btn shrink-0 shadow-xl ${
                                isExplore ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white text-black hover:bg-zinc-200'
                            }`}
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
