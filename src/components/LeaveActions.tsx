"use client";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { LeaveHistoryColumnType } from "./LeaveHistoryColumns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { deleteLeave, setLeaveBalance } from "@/actions/leaveActions";
import { toast } from "sonner";
import { LeaveBalance, LeaveType } from "@prisma/client";
import { LeaveBalanceSchema } from "@/lib/schema";
import { z } from "zod";
import moment from "moment";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import LeaveEditForm from "./LeaveEditForm";
import { useState } from "react";

interface Props {
  data: LeaveHistoryColumnType;
}

const LeaveHistoryActions = ({ data }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  let claimedLeaveBalance: z.infer<typeof LeaveBalanceSchema> | null = null;
  const deletingLeaveType = Object.keys(data.leaveBalance).find(
    (type) => type === data.leaveType.toLowerCase()
  );

  if (deletingLeaveType) {
    const newLeaveTypeBal =
      (data.leaveBalance[
        deletingLeaveType as keyof typeof data.leaveBalance
      ] as number) + data.days;
    const deletingLeaveObj = {
      [deletingLeaveType]: newLeaveTypeBal,
    };
    const newLeaveBalance = {
      ...data.leaveBalance,
      ...deletingLeaveObj,
    };
    claimedLeaveBalance = {
      annual: newLeaveBalance.annual,
      annualForward: newLeaveBalance.annualForward,
      casual: newLeaveBalance.casual,
      sick: newLeaveBalance.sick,
      year: newLeaveBalance.year,
    };
  }

  const handleLeaveDelete = () => {
    deleteLeave({
      leaveId: data.leaveId,
      userId: data.userId,
      path: `/profile/${data.userId}`,
    })
      .then((resDel) => {
        if (resDel.success) {
          if (claimedLeaveBalance) {
            setLeaveBalance({
              userid: data.userId,
              balance: claimedLeaveBalance,
              isEditMode: true,
            }).then((res) => {
              if (res.success) {
                return toast.success(resDel.message);
              }
            });
          } else {
            return toast.error("Could not delete this leave entry");
          }
        } else {
          return toast.error(resDel.error);
        }
      })
      .catch((err) => {
        return toast.error("Internal Server Error, please try later...");
      });
  };

  return (
    <div className="flex gap-2 items-center">
      {
        <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <AlertDialogTrigger>
            <FaEdit
              className={cn(
                "h-5 w-5 cursor-pointer",
                (data.startDate < new Date() || data.leaveType === "SICK") &&
                  "cursor-not-allowed text-slate-400"
              )}
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Leave</AlertDialogTitle>
              <AlertDialogDescription>
                <LeaveEditForm
                  leaveBalance={data.leaveBalance}
                  userId={data.userId}
                  leaveId={data.leaveId}
                  startDate={data.startDate}
                  endDate={data.endDate}
                  leaveType={data.leaveType}
                  days={data.days}
                  setEditDialogOpen={setEditDialogOpen}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      }

      {/* delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <MdDelete className="h-5 w-5 text-red-400 cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col">
                <p>This action cannot be undone.</p>
                <p>{`This will permanently delete ${data.leaveType.toUpperCase()} leave from ${format(
                  data.startDate,
                  "dd-MMM"
                )
                  .toString()
                  .toUpperCase()} to ${format(data.endDate, "dd-MMM")
                  .toString()
                  .toUpperCase()}, ${data.year}.`}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveDelete}
              className="focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveHistoryActions;
