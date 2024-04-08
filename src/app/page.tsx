import { getServerSession } from "next-auth";
import _ from "lodash";
import { getUsers } from "@/actions/userActions";
import LeaveTimeLine from "@/components/LeaveTimeline";
import { UserExt } from "@/lib/types";
import { authOptions } from "@/lib/authOptions";
import moment from "moment";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user as UserExt;
  const res = await getUsers();
  const users = res.data as UserExt[];

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  if (_.isEmpty(users)) {
    return (
      <div className="flex flex-col mt-10 mx-auto px-20">
        <h1 className="text-3xl font-bold text-red-200 p-10">Still No Users</h1>
      </div>
    );
  }

  return (
    <main className="flex flex-col mt-10 mx-auto px-20">
      {session && user && _.isEmpty(user.leaveBalance) && (
        <h2 className="bg-red-200 text-red-500 font-semibold p-5 rounded-md">
          Please go to Profile and set your Leave Balance, for this year
        </h2>
      )}

      <h1 className="font-bold text-3xl">{moment().year()}</h1>

      <Suspense fallback={<Loading />}>
        <div className="mt-10">
          <LeaveTimeLine users={users} />
        </div>
      </Suspense>
    </main>
  );
}
