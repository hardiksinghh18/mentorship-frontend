import React from 'react';
import { FiVideo, FiCheckCircle } from 'react-icons/fi';

interface LiveSession {
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  orderIndex?: number;
  meetingTime: Date;
  meetingLink: string;
  role?: 'learning' | 'teaching';
}

interface UpcomingSessionsProps {
  sessions: LiveSession[];
}

const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
  return (
    <div className="p-6 rounded-[24px] bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015),0_10px_30px_-10px_rgba(0,0,0,0.02)] text-left">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-sm">
          <FiVideo className="w-3.5 h-3.5" />
        </span>
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-none">
          Live Check-ins
        </h3>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const dateStr = session.meetingTime.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const isTeaching = session.role === 'teaching';
            return (
              <div
                key={index}
                className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150 flex flex-col gap-3 group hover:border-zinc-250 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider font-mono">
                      {dateStr}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest uppercase border font-mono ${
                      isTeaching
                        ? 'bg-violet-50 text-violet-700 border-violet-200/50'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                    }`}>
                      {isTeaching ? 'Host' : 'Join'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-accent transition-colors line-clamp-1 leading-tight">
                    {session.courseTitle}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold line-clamp-1 mt-0.5">
                    Lesson {session.orderIndex}: {session.moduleTitle}
                  </p>
                </div>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold tracking-tight shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <FiVideo /> Join Google Meet
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-zinc-200 rounded-2xl px-4">
          <FiCheckCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            No Live Sessions
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block max-w-[160px] mx-auto leading-relaxed">
            Check-ins show up here when you join roadmaps.
          </span>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
