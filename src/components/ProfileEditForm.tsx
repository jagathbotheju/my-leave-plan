"use client";
import { ProfileEditSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { FaRegEdit } from "react-icons/fa";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updateUserProfile } from "@/actions/userActions";
import { toast } from "sonner";
import { getSession, useSession } from "next-auth/react";
import { UserExt } from "@/lib/types";

const ProfileEditForm = () => {
  const { data: session } = useSession();
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ProfileEditSchema>>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      email: "",
      name: "",
    },
    mode: "all",
  });
  const user = session?.user as UserExt;

  useEffect(() => {
    if (user && user.name && user.email) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
    }
  }, [form, user]);

  const onSubmit = (data: z.infer<typeof ProfileEditSchema>) => {
    startTransition(() => {
      updateUserProfile({
        email: data.email,
        name: data.name,
        userId: user.id,
      })
        .then((res) => {
          if (res.success) {
            // getSession();
            return toast.success(res.message);
          } else {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error("Internal Server Error, try gain later");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg shadow-lg p-5 rounded-md"
      >
        <div className="flex items-center justify-end">
          <FaRegEdit
            className="h-6 w-6 cursor-pointer"
            onClick={() => setEdit(true)}
          />
        </div>

        {/* name */}
        <FormField
          disabled={isPending || !edit}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* email */}
        <FormField
          disabled={isPending || !edit}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5">
          <Button disabled={isPending || !edit} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
