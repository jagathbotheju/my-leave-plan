"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { LeaveBalance, LeaveStatus } from "@prisma/client";
import LeaveActions from "./LeaveHistoryActions";
import { format } from "date-fns";

export type LeaveHistoryColumnType = {
  leaveId: string;
  year: string;
  appliedOn: Date;
  startDate: Date;
  endDate: Date;
  days: number;
  leaveType: string;
  leaveStatus: string;
  userId: string;
  leaveBalance: LeaveBalance;
};

export const leaveHistoryColumns: ColumnDef<LeaveHistoryColumnType>[] = [
  {
    accessorKey: "year",
    header: "YEAR",
  },
  {
    accessorKey: "appliedOn",
    header: "APPLIED ON",
    cell: ({ row }) => {
      const data = row.original;
      return <p>{format(data.appliedOn, "dd-MMM").toString().toUpperCase()}</p>;
    },
  },
  {
    accessorKey: "startDate",
    header: "FROM",
    cell: ({ row }) => {
      const data = row.original;
      return <p>{format(data.startDate, "dd-MMM").toString().toUpperCase()}</p>;
    },
  },
  {
    accessorKey: "endDate",
    header: "TO",
    cell: ({ row }) => {
      const data = row.original;
      return <p>{format(data.endDate, "dd-MMM").toString().toUpperCase()}</p>;
    },
  },
  {
    accessorKey: "days",
    header: "DAYS",
  },
  {
    accessorKey: "leaveType",
    header: "TYPE",
  },
  {
    accessorKey: "leaveStatus",
    header: "STATUS",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Badge
          className={cn(
            "font-semibold text-white tracking-widest p-2 w-[100px] text-center flex justify-center",
            {
              "bg-yellow-500": data.leaveStatus === LeaveStatus.PENDING,
              "bg-green-400": data.leaveStatus === LeaveStatus.APPROVED,
              "bg-red-400": data.leaveStatus === LeaveStatus.REJECTED,
            }
          )}
        >
          {data.leaveStatus.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const data = row.original;
      return <LeaveActions data={data} />;
    },
  },
];

export default leaveHistoryColumns;
