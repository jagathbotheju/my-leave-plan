import { UserExt } from "@/lib/types";

interface Props {
  user: UserExt;
}

const LeaveSummary = ({ user }: Props) => {
  return (
    <div className="flex flex-col p-5 shadow-lg rounded-md h-fit w-fit">
      <h1 className="text-2xl font-bold mb-8 dark:text-slate-50 text-slate-700">
        Leave Balance
      </h1>

      <div className="grid grid-cols-3 gap-2">
        <p className="col-span-2">Annual</p>
        <p className="justify-self-end">{user.leaveBalance.annual}</p>

        <p className="col-span-2 whitespace-nowrap">Annual from Last Year</p>
        <p className="justify-self-end">{user.leaveBalance.annualForward}</p>

        <p className="col-span-2">Casual</p>
        <p className="justify-self-end">{user.leaveBalance.casual}</p>
      </div>
    </div>
  );
};

export default LeaveSummary;
