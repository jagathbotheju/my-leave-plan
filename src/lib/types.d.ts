import { User, LeaveBalance, Leave } from "@prisma/client";

type UserExt = User & {
  leaveBalance: LeaveBalance;
  leave: Leave[];
};
