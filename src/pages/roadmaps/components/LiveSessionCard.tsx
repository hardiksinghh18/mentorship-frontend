import React from "react";
import { HiCalendar, HiCheckCircle } from "react-icons/hi";
import dayjs from "dayjs";
import { LiveSessionCardProps } from "../../../types/roadmap";

const LiveSessionCard = ({
  meetingLink,
  meetingTime,
  isCompleted,
  onToggleComplete,
}: LiveSessionCardProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xs font-semibold text-zinc-400 mb-4">Workspace Sessions</h2>

      {meetingLink ? (
        <div className="p-6 rounded-[24px] border border-accent/20 bg-zinc-50 text-center space-y-4">
          <HiCalendar className="text-3xl text-accent mx-auto" />
          <div>
            <h4 className="text-xs font-bold text-zinc-900">Module Check-in</h4>
            {meetingTime ? (
              <p className="text-[10px] text-accent font-semibold mt-1">
                Starts at: {dayjs(meetingTime).format("MMM D, YYYY [at] h:mm A")}
              </p>
            ) : (
              <p className="text-[10px] text-zinc-400 font-medium mt-1">
                Connect live with your partners
              </p>
            )}
          </div>
          <a
            href={meetingLink}
            target="_blank"
            rel="noreferrer"
            className="block w-full py-2.5 rounded-full bg-accent text-white text-xs font-bold tracking-tight hover:bg-accent/90 active:scale-[0.98] transition-all"
          >
            Join Call
          </a>
        </div>
      ) : (
        <div className="p-6 rounded-[24px] border border-zinc-200 bg-zinc-50 text-center text-zinc-400 text-xs font-medium">
          No live calls scheduled for this module.
        </div>
      )}

      <button
        onClick={onToggleComplete}
        className={`w-full py-3 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-2
          ${isCompleted
            ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
            : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"}`}
      >
        {isCompleted ? (
          <>
            <HiCheckCircle className="text-emerald-500 text-sm" /> Completed
          </>
        ) : (
          "Mark Complete"
        )}
      </button>
    </div>
  );
};

export default LiveSessionCard;
