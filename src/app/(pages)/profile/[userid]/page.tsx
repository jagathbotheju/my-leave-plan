import { getUserById } from "@/actions/userActions";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import LeaveBalanceForm from "@/components/LeaveBalanceForm";
import LeaveSummary from "@/components/LeaveSummary";
import ProfileEditForm from "@/components/ProfileEditForm";
import { UserExt } from "@/lib/types";
import _ from "lodash";
import { Metadata } from "next";

interface Props {
  params: {
    userid: string;
  };
}

export const metadata: Metadata = {
  title: "Profile | My Leave Plan",
};

const ProfilePage = async ({ params }: Props) => {
  const response = await getUserById(params.userid);
  const user = response.user as UserExt;

  return (
    <div className="flex flex-col w-full ">
      <Header title="My Profile" user={user} showSummary />

      <div className="flex flex-col md:flex-row gap-5 container max-w-7xl mt-10 mx-auto">
        <div className="flex flex-col mt-2 space-y-4 w-[50%]">
          {response?.success && user && _.isEmpty(user.leaveBalance) ? (
            <>
              <h2 className="bg-red-200 text-red-500 font-semibold p-2 rounded-md">
                Please set your Leave Balance
              </h2>
              <LeaveBalanceForm user={user} isEditMode={false} />
            </>
          ) : (
            <>
              <LeaveBalanceForm user={user} isEditMode />
            </>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <ProfileEditForm />
          {!_.isEmpty(user?.leaveBalance) && <LeaveSummary user={user} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
