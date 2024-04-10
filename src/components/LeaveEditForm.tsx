"use client";

import { LeaveEditSchema, LeaveBalanceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
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
import moment from "moment";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import {
  setLeaveBalance,
  setLeaveStatus,
  updateLeave,
} from "@/actions/leaveActions";
import { useRouter } from "next/navigation";
import { LeaveBalance, LeaveType } from "@prisma/client";
import { LeaveStatus } from "@prisma/client";

interface Props {
  leaveBalance: LeaveBalance;
  userId: string;
  leaveId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  leaveType: string;
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const LeaveEditForm = ({
  leaveBalance,
  userId,
  leaveId,
  startDate,
  endDate,
  days,
  leaveType,
  setEditDialogOpen,
}: Props) => {
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LeaveEditSchema>>({
    resolver: zodResolver(LeaveEditSchema),
    defaultValues: {
      year: moment().year().toString(),
      startDate: startDate,
      endDate: endDate,
      days: days,
      leaveType: leaveType.toLowerCase(),
    },
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof LeaveEditSchema>) => {
    setEditDialogOpen(false);

    if (moment(data.startDate).isBefore(new Date())) {
      return toast.error("Start date is already past");
    }

    const annualBalance = leaveBalance.annual + leaveBalance.annualForward;
    const casualBalance = leaveBalance.casual;

    if (data.leaveType === "annual" && annualBalance <= 0) {
      return toast.error("Not enough Annual  balance");
    }
    if (data.leaveType === "casual" && casualBalance <= 0) {
      return toast.error("No enough Casual balance");
    }

    let newBal = 0;

    // start date change
    if (startDate > data.startDate) {
      newBal =
        (leaveBalance[data.leaveType as keyof typeof leaveBalance] as number) -
        moment(startDate).diff(moment(data.startDate), "days");
    }
    if (startDate < data.startDate) {
      newBal =
        (leaveBalance[data.leaveType as keyof typeof leaveBalance] as number) +
        moment(data.startDate).diff(moment(startDate), "days");
    }

    //end date change
    if (endDate > data.endDate) {
      newBal =
        (leaveBalance[data.leaveType as keyof typeof leaveBalance] as number) +
        moment(endDate).diff(moment(data.endDate), "days");
    }
    if (endDate < data.endDate) {
      newBal =
        (leaveBalance[data.leaveType as keyof typeof leaveBalance] as number) -
        moment(data.endDate).diff(moment(endDate), "days");
    }

    const newBalObject = {
      [data.leaveType]: newBal,
    };
    const newLeaveBalance = { ...leaveBalance, ...newBalObject };
    const newLeaveBalanceRequest: z.infer<typeof LeaveBalanceSchema> = {
      year: newLeaveBalance.year,
      annual: newLeaveBalance.annual,
      annualForward: newLeaveBalance.annualForward,
      casual: newLeaveBalance.casual,
      sick: newLeaveBalance.sick,
    };

    updateLeave({ userId, leaveId, newLeave: data })
      .then((response) => {
        if (response.success) {
          setLeaveBalance({
            userid: userId,
            balance: newLeaveBalanceRequest,
            isEditMode: true,
          })
            .then(async (res) => {
              if (res.success) {
                await setLeaveStatus({
                  userId,
                  leaveId,
                  status: LeaveStatus.PENDING,
                });
                form.reset();
                // router.push(`/profile/${userId}`);
                return toast.success(res.message);
              }
              if (!response.success) {
                return toast.error(response.error);
              }
            })
            .catch((err) => {
              return toast.error("Internal Server Error, Try Later");
            });
        }
        if (!response.success) {
          return toast.error(response.error);
        }
      })
      .catch((error) => {
        toast.error("Internal Server Error, Try Later");
      })
      .finally(() => {
        form.reset();
        setEditDialogOpen(false);
      });
  };

  const calculateDays = () => {
    const days =
      moment(form.getValues().endDate)
        .endOf("day")
        .diff(moment(form.getValues().startDate).startOf("day"), "days") + 1 ??
      0;
    form.setValue("days", days);
  };

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        {/* year */}
        <FormField
          // disabled={form.formState.isSubmitting}
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* leave type */}
        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Leave Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* start date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Start Date</span>
                      )}
                      <FaCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setStartDateOpen(false);
                      calculateDays();
                    }}
                    // disabled={(date) =>
                    //   date < new Date() || date < form.getValues().startDate
                    // }
                    // initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* end date */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Start Date</span>
                      )}
                      <FaCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      field.onChange(value);
                      setEndDateOpen(false);
                      calculateDays();
                    }}
                    disabled={(date) =>
                      date < new Date() || date < form.getValues().startDate
                    }
                    // initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* number of days */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Days</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* submit button */}
        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={!form.formState.isValid}>
            Update
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setEditDialogOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeaveEditForm;
