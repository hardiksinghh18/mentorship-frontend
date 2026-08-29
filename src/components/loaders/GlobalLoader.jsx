import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative animate-in fade-in duration-300">
            <style>{`
                @keyframes progressMove {
                    0% {
                        left: -40%;
                        width: 30%;
                    }
                    50% {
                        width: 40%;
                    }
                    100% {
                        left: 110%;
                        width: 30%;
                    }
                }
                @keyframes logoPulse {
                    0%, 100% {
                        transform: scale(1);
                        filter: drop-shadow(0 4px 6px rgba(124, 58, 237, 0.08));
                    }
                    50% {
                        transform: scale(1.05);
                        filter: drop-shadow(0 8px 16px rgba(124, 58, 237, 0.15));
                    }
                }
            `}</style>
            <div className="flex flex-col items-center max-w-sm w-full text-center">
                <div 
                    className="relative mb-6"
                    style={{ animation: 'logoPulse 2.5s infinite ease-in-out' }}
                >
                    <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-2xl opacity-60 scale-125"></div>
                    <img 
                        src={require('../../assets/synckroIcon.png')} 
                        alt="SyncKro Logo" 
                        className="w-16 h-16 relative z-10 select-none object-contain filter invert"
                    />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 select-none">
                    SyncKro
                </h1>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 select-none">
                    Collaborative Learning
                </p>
                
                {/* Beautiful Progress Bar */}
                <div className="w-36 h-[3px] bg-zinc-100 rounded-full overflow-hidden mt-6 relative border border-zinc-200/20">
                    <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full absolute top-0"
                        style={{ 
                            animation: 'progressMove 1.5s infinite ease-in-out'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
