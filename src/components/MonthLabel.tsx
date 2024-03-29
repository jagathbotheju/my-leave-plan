import { END_DATE, START_DATE } from "@/lib/constants";
import _ from "lodash";
import moment from "moment";

const MonthLabel = () => {
  const getDaysInMonth = (month: number) =>
    new Date(new Date().getFullYear(), month, 0).getDate();

  const getMonths = () => {
    const months = moment(END_DATE).diff(moment(START_DATE), "months");
    return months + 1;
  };

  const getMonthLabel = () => {
    const monthLabels: React.ReactNode[] = [];

    _.times(getMonths()).map((month, monthIndex) => {
      const days = getDaysInMonth(month + 1);

      const labelChips = (
        <div className="flex gap-1">
          {_.times(days).map((date) => {
            const label = (
              <div
                key={month + date}
                className="p-2 px-4 w-5 flex items-center justify-center h-10 text-xs text-slate-500 rounded-md border overflow-visible border-transparent"
              >
                {date + 1 === 1 && (
                  // <div className="flex flex-col items-center justify-items-center gap-1">
                  <p className="text-right text-2xl text-primary font-bold pl-[80px]">
                    {moment.months(month).toUpperCase()}
                  </p>
                )}
              </div>
            );
            return label;
          })}
        </div>
      );

      monthLabels.push(labelChips);
    });
    return monthLabels;
  };

  return <div className="flex w-full gap-1">{...getMonthLabel()}</div>;
};

export default MonthLabel;
