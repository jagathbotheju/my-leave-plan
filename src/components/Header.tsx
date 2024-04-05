"use client";
import { UserExt } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Props {
  title: string;
  className?: string;
  showSummary?: boolean;
  user?: UserExt;
}

const Header = ({ title, className, user, showSummary = false }: Props) => {
  return (
    <div className={cn("w-full p-4 my-2", className)}>
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <h1 className=" font-bold text-4xl text-slate-700 dark:text-slate-50">
          {title}
        </h1>

        {user && showSummary && (
          <div className="flex gap-4">
            {/* annual */}
            <div className="flex flex-col items-center px-5 py-4 bg-yellow-200 rounded-md">
              <p className="font-semibold dark:text-slate-700">ANNUAL</p>
              <p className="font-bold text-lg text-primary">
                {user && user.leaveBalance && user.leaveBalance.annual}
              </p>
            </div>

            {/* casual */}
            <div className="flex flex-col items-center px-5 py-4 bg-orange-200 rounded-md">
              <p className="font-semibold dark:text-slate-700">CASUAL</p>
              <p className="font-bold text-lg text-primary">
                {user && user.leaveBalance && user.leaveBalance.casual}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
