"use client";
import { LeaveBalance } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import LeaveHistoryActions from "./LeaveHistoryActions";
import LeaveStatusManage from "./LeaveStatusManage";

export type AdminHistoryColumnType = {
  id: string;
  name: string;
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

const AdminHistoryColumns: ColumnDef<AdminHistoryColumnType>[] = [
  {
    accessorKey: "name",
    header: "NAME",
  },
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
      return <LeaveStatusManage rowData={data} />;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const data = row.original;
      return <LeaveHistoryActions data={data} />;
    },
  },
];

export default AdminHistoryColumns;
