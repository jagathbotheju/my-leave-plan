"use client";
import _ from "lodash";
import moment from "moment";
import useDraggableScroll from "use-draggable-scroll";
import { useEffect, useMemo, useRef } from "react";
import DateChip from "./DateChip";
import { LeaveStatus, LeaveType } from "@prisma/client";
import MonthLabel from "./MonthLabel";
import { UserExt } from "@/lib/types";
import { END_DATE, START_DATE } from "@/lib/constants";
import { date } from "zod";

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
    const userLeaves: { date: string; status: LeaveStatus; type: LeaveType }[] =
      [];
    user.leave.map((item) => {
      const range = getDateRange(item.startDate, item.endDate);
      range.map((date) =>
        userLeaves.push({
          date: moment(date).format("YYYY-MM-DD"),
          status: item.leaveStatus,
          type: item.leaveType,
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
    userLeaves: { date: string; status: LeaveStatus; type: LeaveType }[]
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
          type: includes.type,
        };
      }
      return calendarItem;
    });
    return userLeaveCalendar;
  };

  const usersLeaveCalendarRows = users.map((user, index) => {
    const userLeaves = getUserLeaves(user);
    const userLeaveCalendar = getUserLeaveCalendar(newCal(), userLeaves);

    const row = userLeaveCalendar.map((leaveInfo) => (
      <DateChip key={leaveInfo.date} leaveInfo={leaveInfo} />
    ));

    return (
      <div key={index} className="flex gap-1">
        {row}
      </div>
    );
  });

  const memUsersLeaveCalendarRows = useMemo(
    () => usersLeaveCalendarRows,
    [usersLeaveCalendarRows]
  );

  useEffect(() => {
    const currentMonth = moment().month();
    const currentDate = moment().date();
    const scrollTo = `${currentMonth + 1}-${currentDate}`;
    const timeLine = document.getElementById(`${scrollTo}`);
    timeLine?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full h-full gap-1">
        {/* user names */}
        <div className="flex flex-col w-[10%] gap-4 mt-[48px] py-4">
          {users.map((user) => {
            const userName = user.name ? user.name.split(" ") : "";
            const formatUserName =
              userName &&
              userName.filter((name) => !name.startsWith("MOH" || "MUH"));
            return (
              <p
                key={user.id}
                className="p-2 h-10 text-end font-semibold rounded-md bg-slate-200 dark:text-slate-100 dark:bg-slate-500 text-sm whitespace-nowrap text-ellipsis overflow-hidden"
              >
                {formatUserName[0]}
              </p>
            );
          })}
        </div>

        {/* scrolling calendar view */}
        <div
          className="flex flex-col w-full gap-1 overflow-x-hidden cursor-grab py-4"
          ref={ref}
          id="time-line"
          onMouseDown={onMouseDown}
        >
          <div className="flex flex-col w-full gap-2">
            {/* month label */}
            <MonthLabel />

            {/* user leaves */}
            <div className="flex flex-col gap-4">
              {/* {users.map((user, index) => {
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
              })} */}
              {...memUsersLeaveCalendarRows}
            </div>
          </div>
        </div>
      </div>

      {/* legend */}
      <div className="flex gap-5 mt-5 self-end">
        <div className="flex gap-2 items-center text-slate-500 dark:text-slate-200">
          <DateChip
            leaveInfo={{
              date: moment(moment.now()).format("YYYY-MM-DD"),
              isOnLeave: true,
              status: LeaveStatus.PENDING,
              type: LeaveType.CASUAL,
            }}
          />
          <p className="text-xs">CASUAL PENDING</p>
        </div>

        <div className="flex gap-2 items-center text-slate-500 dark:text-slate-200">
          <DateChip
            leaveInfo={{
              date: moment(moment.now()).format("YYYY-MM-DD"),
              isOnLeave: true,
              status: LeaveStatus.PENDING,
              type: LeaveType.ANNUAL,
            }}
          />
          <p className="text-xs">ANNUAL PENDING</p>
        </div>

        <div className="flex gap-2 items-center text-slate-500 dark:text-slate-200">
          <DateChip
            leaveInfo={{
              date: moment(moment.now()).format("YYYY-MM-DD"),
              isOnLeave: true,
              status: LeaveStatus.APPROVED,
              type: LeaveType.CASUAL,
            }}
          />
          <DateChip
            leaveInfo={{
              date: moment(moment.now()).format("YYYY-MM-DD"),
              isOnLeave: true,
              status: LeaveStatus.APPROVED,
              type: LeaveType.ANNUAL,
            }}
          />
          <p className="text-xs">CONFIRMED</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeLine;
