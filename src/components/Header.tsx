"use client";
import { UserExt } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  className?: string;
  showSummary?: boolean;
  user?: UserExt;
}

const Header = ({ title, className, user, showSummary = false }: Props) => {
  const pathname = usePathname();

  return (
    <div className={cn("w-full p-4 my-2", className)}>
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex flex-col">
          <h1
            className={cn(
              "font-bold text-4xl text-slate-700 dark:text-slate-50",
              pathname === "/admin" && "text-primary"
            )}
          >
            {title}
          </h1>
          {title === "My Profile" && (
            <p className="text-slate-500 font-semibold dark:text-slate-400">
              {user?.email}
            </p>
          )}
        </div>

        {user && showSummary && (
          <div className="flex gap-4">
            {/* annual */}
            <div className="flex flex-col items-center px-5 py-4 bg-yellow-200 rounded-md">
              <p className="font-semibold dark:text-slate-700">ANNUAL</p>
              <p className="font-bold text-lg text-primary">
                {user &&
                  user.leaveBalance &&
                  user.leaveBalance.annual + user.leaveBalance.annualForward}
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
