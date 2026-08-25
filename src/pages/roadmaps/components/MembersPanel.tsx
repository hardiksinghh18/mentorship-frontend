import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Member {
  id: string;
  fullName: string;
  username: string;
  bio?: string;
  isCreator?: boolean;
}

interface MembersPanelProps {
  members: Member[];
}

const INITIAL_SHOW = 4;

const MembersPanel: React.FC<MembersPanelProps> = ({ members }) => {
  const [expanded, setExpanded] = useState(false);

  if (!members || members.length === 0) return null;

  const visibleMembers = expanded ? members : members.slice(0, INITIAL_SHOW);
  const remaining = members.length - INITIAL_SHOW;

  return (
    <div className="p-5 rounded-[24px] bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015),0_10px_30px_-10px_rgba(0,0,0,0.02)] text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-sm">
            <FiUsers className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-none">
            Members
          </h3>
        </div>
        <span className="text-[10px] font-black text-zinc-400 tabular-nums">
          {members.length}
        </span>
      </div>

      {/* Members List */}
      <div className={`space-y-1 ${expanded && remaining > 0 ? "max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent" : ""}`}>
        {visibleMembers.map((member) => (
          <Link
            key={member.id}
            to={`/profile/${member.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-black shrink-0 group-hover:border-zinc-300 transition-colors">
              {member.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900 truncate leading-tight group-hover:text-violet-700 transition-colors">
                  {member.fullName}
                </span>
                {member.isCreator && (
                  <span className="px-1.5 py-px rounded text-[7px] font-black tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/50 shrink-0">
                    Mentor
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold leading-tight block truncate">
                @{member.username}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Expand / Collapse Toggle */}
      {remaining > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 text-[10px] font-bold tracking-tight transition-all active:scale-[0.98]"
        >
          {expanded ? (
            <>
              Show less <FiChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              +{remaining} more <FiChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default MembersPanel;
