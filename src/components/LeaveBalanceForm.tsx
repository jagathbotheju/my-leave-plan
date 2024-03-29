"use client";
import { LeaveBalanceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveBalance, User } from "@prisma/client";
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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import _ from "lodash";
import { useEffect, useState, useTransition } from "react";
import { setLeaveBalance } from "@/actions/leaveActions";
import { toast } from "sonner";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import { UserExt } from "@/lib/types";

interface Props {
  user: UserExt;
  isEditMode: boolean;
}

const LeaveBalanceForm = ({ user, isEditMode }: Props) => {
  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LeaveBalanceSchema>>({
    resolver: zodResolver(LeaveBalanceSchema),
    defaultValues: {
      annual: 45,
      casual: 7,
      annualForward: 0,
      sick: 0,
      year: format(new Date(), "yyyy"),
    },
    mode: "all",
  });

  const onSubmit = (values: z.infer<typeof LeaveBalanceSchema>) => {
    startTransition(() => {
      setLeaveBalance({ userid: user.id, balance: values, isEditMode })
        .then((response) => {
          if (response.success) {
            return toast.success(response.message);
          }
          if (!response.success) {
            return toast.error(response.error);
          }
        })
        .catch((err) => {
          toast.error("Internal Server Error, Try Later");
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  useEffect(() => {
    if (user?.leaveBalance) {
      setEdit(isEditMode);
      const { annual, annualForward, casual, sick } = user.leaveBalance;
      form.setValue("annual", annual);
      form.setValue("annualForward", annualForward);
      form.setValue("casual", casual);
      //form.setValue("sick", sick);
    }
  }, [user?.leaveBalance, form, isEditMode]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-slate-50 text-slate-700">
            {isEditMode ? "Update Leave Balance" : "Set Leave Balance"}
          </h1>
          {edit && (
            <FaRegEdit
              className="h-6 w-6 cursor-pointer"
              onClick={() => setEdit(false)}
            />
          )}
        </div>
        {/* year */}
        <FormField
          disabled={isPending || edit}
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* annual */}
        <FormField
          disabled={isPending || edit}
          control={form.control}
          name="annual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* annual forward*/}
        <FormField
          disabled={isPending || edit}
          control={form.control}
          name="annualForward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual From Last Year</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* annual forward*/}
        <FormField
          disabled={isPending || edit}
          control={form.control}
          name="casual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Casual</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* sick*/}
        <FormField
          disabled={isPending || edit}
          control={form.control}
          name="sick"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sick</FormLabel>
              <FormControl>
                <Input className="dark:bg-slate-600" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5">
          <Button disabled={isPending || edit} type="submit">
            {isEditMode ? "Update Leave Balance" : "Set Leave Balance"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeaveBalanceForm;
