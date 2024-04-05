"use client";
import { Trash2 } from "lucide-react";
import _ from "lodash";
import { useTransition } from "react";
import { deleteUser } from "@/actions/userActions";
import { toast } from "sonner";
import { UserExt } from "@/lib/types";
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
            {/* <Trash2
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
            /> */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash2 className="h-5 w-5 text-red-500 cursor-pointer" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="flex flex-col">
                      <p>This action cannot be undone.</p>
                      <p className="text-red-500 font-semibold">{`This will permanently delete user ${user.name?.toUpperCase()}`}</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
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
                    className="focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0"
                  >
                    DELETE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
