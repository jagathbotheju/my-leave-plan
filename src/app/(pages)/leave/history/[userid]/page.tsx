import { getUserById } from "@/actions/userActions";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import leaveHistoryColumns from "@/components/LeaveHistoryColumns";
import Loading from "@/components/Loading";
import { authOptions } from "@/lib/authOptions";
import { UserExt } from "@/lib/types";
import { Leave } from "@prisma/client";
import _ from "lodash";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: {
    userid: string;
  };
}

export const metadata: Metadata = {
  title: "History | My Leave Plan",
};

const LeaveHistoryPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user as UserExt;
  const response = await getUserById(params.userid);
  const user = response.user as UserExt;
  const leaveHistoryData = user?.leave.map((leave: Leave) => ({
    leaveId: leave.id,
    year: leave.year,
    appliedOn: leave.updatedAt,
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: leave.days,
    leaveType: leave.leaveType,
    leaveStatus: leave.leaveStatus,
    userId: user.id,
    leaveBalance: user.leaveBalance,
  }));

  if (!session || !session.user) {
    redirect("/login");
  }
  // if (currentUser.id !== user.id) redirect("/");

  return (
    <div className="flex w-full flex-col">
      <Header title="My Leave History" user={user} showSummary />

      <div className="flex flex-col container mx-auto max-w-7xl">
        <Suspense fallback={<Loading />}>
          <DataTable columns={leaveHistoryColumns} data={leaveHistoryData} />
        </Suspense>
      </div>
    </div>
  );
};

export default LeaveHistoryPage;
