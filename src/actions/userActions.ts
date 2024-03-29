"use server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prismadb";
import { UserExt } from "@/lib/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

//1-gerCurrentUser
//2-gerUsers
//3-updateUserProfile
//4-getUserById

//1-gerCurrentUser
const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;
  return user;
};

export const deleteUser = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
      return {
        success: false,
        error: "Not Authorized to update this leave, please contact ADMIN",
      };
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    if (deletedUser) {
      return {
        success: true,
        message: "User Deleted Successfully",
      };
    }

    return {
      success: false,
      error: "Could not delete user, try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

//2-gerUsers
export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        leave: {
          orderBy: {
            startDate: "asc",
          },
        },
        leaveBalance: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (users) {
      return {
        success: true,
        data: users,
      };
    }

    return {
      success: false,
      error: "Could not get users,try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

//3-updateUserProfile
export const updateUserProfile = async ({
  name,
  email,
  userId,
}: {
  name: string;
  email: string;
  userId: string;
}) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });

    if (updatedUser) {
      revalidatePath(`/profile/${userId}`);
      return {
        success: true,
        message: "Profile updated successfully",
      };
    }

    return {
      success: false,
      error: "Could not update profile,try again later",
    };
  } catch (error) {
    return {
      success: false,
      error: "Internal Server Error,try again later",
    };
  }
};

//4-getUserById
export const getUserById = async (userid: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userid },
      include: {
        leave: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        leaveBalance: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "No user Found!",
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: "Inter Server Error",
    };
  }
};
