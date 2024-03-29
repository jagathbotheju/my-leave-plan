"use server";
import { LeaveStatus, LeaveType, User } from "@prisma/client";
import prisma from "@/lib/prismadb";
import { z } from "zod";
import { LeaveBalanceSchema, LeaveRequestSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { comNewRequest, comUpdateRequest, sendMail } from "@/lib/mail";
import moment from "moment";
import { UserExt } from "@/lib/types";
import { authOptions } from "@/lib/authOptions";

const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;
  return user;
};

//1-updateLeave
//2-deleteLeave
//3-setLeave
//4-setLeaveStatus
//5-setLeaveBalance
//6-getLeaveBalance

//1-updateLeave
export const updateLeave = async ({
  userId,
  leaveId,
  newLeave,
}: {
  userId: string;
  leaveId: string;
  newLeave: z.infer<typeof LeaveRequestSchema>;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId) {
      return {
        success: false,
        error: "Not Authorized to update this leave, please contact ADMIN",
      };
    }

    const leaveType =
      newLeave.leaveType === "annual"
        ? LeaveType.ANNUAL
        : newLeave.leaveType === "casual"
        ? LeaveType.CASUAL
        : newLeave.leaveType === "sick"
        ? LeaveType.SICK
        : LeaveType.UNKNOWN;

    const leave = await prisma.leave.update({
      where: {
        id: leaveId,
        userId,
      },
      data: {
        year: newLeave.year,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        days: newLeave.days,
        leaveType: leaveType,
      },
    });

    if (leave) {
      const body = comUpdateRequest(
        currentUser.name as string,
        moment(newLeave.startDate).format("YYYY-MM-DD"),
        moment(newLeave.endDate).format("YYYY-MM-DD")
      );
      await sendMail({
        to: currentUser.email as string,
        subject: "Update Leave | My Leave Plan",
        body,
      });
      return {
        success: true,
        message: "Leave Updated Successfully",
      };
    }

    return {
      success: false,
      error: "Could not update leave, try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, try again later",
    };
  }
};

//2-deleteLeave
export const deleteLeave = async ({
  leaveId,
  userId,
  path,
}: {
  leaveId: string;
  userId: string;
  path: string;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId) {
      return {
        success: false,
        error: "You are Not Authorized to delete this Leave",
      };
    }
    const deletedLeave = await prisma.leave.delete({
      where: {
        id: leaveId,
        userId,
      },
    });

    if (deletedLeave) {
      const body = comUpdateRequest(
        currentUser.name as string,
        moment(deletedLeave.startDate).format("YYYY-MM-DD"),
        moment(deletedLeave.endDate).format("YYYY-MM-DD")
      );
      await sendMail({
        to: currentUser.email as string,
        subject: "Delete Leave | My Leave Plan",
        body,
      });
      revalidatePath(path);
      return {
        success: true,
        message: "Leave Deleted Successfully",
      };
    }

    return {
      success: false,
      error: "Could not delete leave, tay again later...",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error, tay again later...",
    };
  }
};

//3-setLeave
export const setLeave = async ({
  userid,
  newLeave,
}: {
  userid: string;
  newLeave: z.infer<typeof LeaveRequestSchema>;
}) => {
  const currentUser = await getCurrentUser();
  if (currentUser.id !== userid) {
    return {
      success: false,
      error: "Not Authorized to update this leave, please contact ADMIN",
    };
  }

  const leaveType =
    newLeave.leaveType === "annual"
      ? LeaveType.ANNUAL
      : newLeave.leaveType === "casual"
      ? LeaveType.CASUAL
      : newLeave.leaveType === "sick"
      ? LeaveType.SICK
      : LeaveType.UNKNOWN;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userid,
      },
      data: {
        leave: {
          create: {
            year: newLeave.year,
            startDate: newLeave.startDate,
            endDate: newLeave.endDate,
            days: newLeave.days,
            leaveType: leaveType,
          },
        },
      },
    });

    if (updatedUser) {
      const body = comNewRequest(
        updatedUser.name as string,
        moment(newLeave.startDate).format("YYYY-MM-DD"),
        moment(newLeave.endDate).format("YYYY-MM-DD")
      );
      await sendMail({
        to: updatedUser.email as string,
        subject: "New Leave Request | My Leave Plan",
        body,
      });
      return {
        success: true,
        message: "New Leave Requested",
      };
    }

    return {
      success: false,
      error: "Could not create New Leave, Try again later.",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

//4-setLeaveStatus
export const setLeaveStatus = async ({
  userId,
  leaveId,
  status,
}: {
  userId: string;
  leaveId: string;
  status: string;
}) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
      return {
        success: false,
        error: "Not Authorized to update this leave, please contact ADMIN",
      };
    }

    const leaveStatus =
      status === "PENDING"
        ? LeaveStatus.PENDING
        : status === "APPROVED"
        ? LeaveStatus.APPROVED
        : status === "REJECTED"
        ? LeaveStatus.REJECTED
        : LeaveStatus.UNKNOWN;

    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId,
        userId,
      },
      data: {
        leaveStatus,
      },
    });

    if (updatedLeave) {
      revalidatePath(`/profile/${userId}`);
      return {
        success: true,
        message: `Leave Status updated to ${status}`,
      };
    }

    return {
      success: false,
      error: "Could not change leave status, try later!",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

//5-setLeaveBalance
export const setLeaveBalance = async ({
  userid,
  balance,
  isEditMode,
}: {
  userid: string;
  balance: z.infer<typeof LeaveBalanceSchema>;
  isEditMode: boolean;
}) => {
  const currentUser = await getCurrentUser();
  console.log("server", currentUser);
  if (currentUser.id !== userid) {
    return {
      success: false,
      error: "Not Authorized to update this leave, please contact ADMIN",
    };
  }

  try {
    let res: any = null;
    if (isEditMode) {
      res = await prisma.leaveBalance.update({
        where: {
          userId: userid,
        },
        data: {
          ...balance,
        },
      });
    } else {
      res = await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          leaveBalance: {
            create: {
              ...balance,
            },
          },
        },
      });
    }

    if (res) {
      revalidatePath(`/profile/${userid}`);
      return {
        success: true,
        message: "Leave Balance Updated",
      };
    }

    return {
      success: false,
      error: "Could not set leave balance, try later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
};

//6-getLeaveBalance
export const getLeaveBalance = async (userid: string) => {
  try {
    if (!userid) {
      return {
        success: false,
        error: "No user Found!",
      };
    }
    const leaveBalance = await prisma.leaveBalance.findFirst({
      where: { userId: userid },
    });

    if (!leaveBalance) {
      return {
        success: false,
        error: "Please set your leave balance",
      };
    }

    return {
      success: true,
      data: leaveBalance,
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Sever Error",
    };
  }
};
