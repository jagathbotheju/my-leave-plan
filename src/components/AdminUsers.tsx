"use client";
import { Trash2 } from "lucide-react";
import _ from "lodash";
import { useTransition } from "react";
import { deleteUser } from "@/actions/userActions";
import { toast } from "sonner";
import { UserExt } from "@/lib/types";

interface Props {
  users: UserExt[];
}

const AdminUsers = ({ users }: Props) => {
  const [isPending, startTransition] = useTransition();

  if (_.isEmpty(users)) {
    return (
      <div className="m-10">
        <h1 className="text-3xl font-bold text-slate-700">Users Not Found</h1>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <div className="flex flex-col space-y-4 max-w-2xl">
        {users?.map((user) => (
          <div
            key={user.id}
            className="flex p-5 bg-slate-100 dark:bg-slate-700 rounded-md shadow-md justify-between"
          >
            <p>{user.name}</p>
            <Trash2
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={() => {
                startTransition(() => {
                  deleteUser(user.id)
                    .then((res) => {
                      if (res.success) {
                        return toast.success(res.message);
                      } else {
                        return toast.error(res.message);
                      }
                    })
                    .catch((err) => {
                      return toast.error("Internal Server Error");
                    });
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
