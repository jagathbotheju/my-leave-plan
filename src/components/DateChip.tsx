import { months } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LeaveStatus, LeaveType } from "@prisma/client";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

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

  if (leaveInfo.isOnLeave) {
    console.log("leave", month + 1, date, leaveInfo.type);
  }

  return (
    <div
      id={uuidv4()}
      className={cn(
        `p-2 px-4 w-5 flex items-center justify-center h-10 text-xs text-slate-500 rounded-md border`,
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
    </div>
  );
};

export default DateChip;
