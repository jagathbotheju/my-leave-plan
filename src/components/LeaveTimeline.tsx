"use client";
import _ from "lodash";
import moment from "moment";
import useDraggableScroll from "use-draggable-scroll";
import { useEffect, useRef } from "react";
import DateChip from "./DateChip";
import { LeaveStatus } from "@prisma/client";
import MonthLabel from "./MonthLabel";
import { UserExt } from "@/lib/types";
import { END_DATE, START_DATE } from "@/lib/constants";

interface Props {
  users: UserExt[];
}

const LeaveTimeLine = ({ users }: Props) => {
  const ref = useRef(null);
  const { onMouseDown } = useDraggableScroll(ref, { direction: "horizontal" });

  const getDateRange = (startDate: Date, endDate: Date, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  };

  const newCal = () => {
    const cal: {
      date: string;
      isOnLeave: boolean;
      status: LeaveStatus;
    }[] = [];

    for (
      let m = moment(START_DATE);
      m.diff(moment(END_DATE), "days") <= 0;
      m.add(1, "days")
    ) {
      cal.push({
        date: m.format("YYYY-MM-DD"),
        isOnLeave: false,
        status: LeaveStatus.PENDING,
      });
    }
    return cal;
  };

  const getUserLeaves = (user: UserExt) => {
    const userLeaves: { date: string; status: LeaveStatus }[] = [];
    user.leave.map((item) => {
      const range = getDateRange(item.startDate, item.endDate);
      range.map((date) =>
        userLeaves.push({
          date: moment(date).format("YYYY-MM-DD"),
          status: item.leaveStatus,
        })
      );
    });
    return userLeaves;
  };

  const getUserLeaveCalendar = (
    calendar: {
      date: string;
      isOnLeave: boolean;
      status: LeaveStatus;
    }[],
    userLeaves: { date: string; status: LeaveStatus }[]
  ) => {
    const userLeaveCalendar = calendar.map((calendarItem) => {
      const includes = userLeaves.find(
        (userLeave) => userLeave.date === calendarItem.date
      );
      if (includes) {
        return {
          date: calendarItem.date,
          isOnLeave: true,
          status: includes.status,
        };
      }
      return calendarItem;
    });
    return userLeaveCalendar;
  };

  useEffect(() => {
    const currentMonth = moment().month();
    const currentDate = moment().date();
    const scrollTo = `${currentMonth + 1}-${currentDate}`;
    const timeLine = document.getElementById(`${scrollTo}`);
    timeLine?.scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-full gap-1">
        {/* user names */}
        <div className="flex flex-col w-[10%] gap-4 mt-[48px]">
          {users.map((user) => (
            <p
              key={user.id}
              className="p-2 h-10 text-end font-semibold rounded-md bg-slate-200 text-slate-800"
            >
              {user.name}
            </p>
          ))}
        </div>

        {/* scrolling calendar view */}
        <div
          className="flex flex-col w-full gap-1 overflow-x-hidden cursor-grab"
          ref={ref}
          id="time-line"
          onMouseDown={onMouseDown}
        >
          <div className="flex flex-col w-full gap-2">
            {/* month label */}
            <MonthLabel />

            {/* user leaves */}
            <div className="flex flex-col gap-4">
              {users.map((user, index) => {
                const userLeaves = getUserLeaves(user);
                const userLeaveCalendar = getUserLeaveCalendar(
                  newCal(),
                  userLeaves
                );

                const row = userLeaveCalendar.map((leaveInfo) => (
                  <DateChip key={leaveInfo.date} leaveInfo={leaveInfo} />
                ));

                return (
                  <div key={index} className="flex gap-1">
                    {row}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeLine;
