"use client";
import { months } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LeaveStatus, LeaveType } from "@prisma/client";
import moment from "moment";

interface Props {
  leaveInfo: {
    date: string;
    isOnLeave: boolean;
    status: LeaveStatus;
    type?: LeaveType;
  };
}

const DateChip = ({ leaveInfo }: Props) => {
  const date = moment(leaveInfo.date).date();
  const month = moment(leaveInfo.date).month();

  return (
    <div
      id={`${month + 1}-${date}`}
      className={cn(
        `p-2 px-4 w-5 flex items-center justify-center h-10 text-xs text-slate-500 rounded-md border relative`,
        leaveInfo.isOnLeave && "text-slate-700 font-semibold",
        {
          // "bg-orange-300":
          //   leaveInfo.status === LeaveStatus.PENDING && leaveInfo.isOnLeave,
          "bg-red-300":
            leaveInfo.isOnLeave && leaveInfo.status === LeaveStatus.REJECTED,
          "bg-orange-200":
            leaveInfo.isOnLeave && leaveInfo.type === LeaveType.ANNUAL,
          "bg-yellow-200":
            leaveInfo.isOnLeave && leaveInfo.type === LeaveType.CASUAL,
          "text-blue-600 ring-1":
            leaveInfo.status === LeaveStatus.APPROVED && leaveInfo.isOnLeave,
        }
      )}
    >
      <div className="flex items-center justify-between flex-col">
        <p
          className={cn("text-[8px] text-slate-400", {
            "text-slate-700 font-semibold": leaveInfo.isOnLeave,
            "text-blue-600":
              leaveInfo.status === LeaveStatus.APPROVED && leaveInfo.isOnLeave,
          })}
        >
          {months[month].slice(0, 3)}
        </p>
        <p>{date}</p>
      </div>

      {leaveInfo.status === LeaveStatus.APPROVED && (
        <div className="border-blue-400 border-2 w-auto h-auto absolute bottom-[2px] top-[2px] right-[2px] left-[2px] rounded-md"></div>
      )}
    </div>
  );
};

export default DateChip;
