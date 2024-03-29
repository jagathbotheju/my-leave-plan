"use client";
import { ResetPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "./ui/button";
import { resetPassword } from "@/actions/authActions";
import { toast } from "sonner";

interface Props {
  id: string;
}

const ResetPasswordForm = ({ id }: Props) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
    resetPassword(id, data.password)
      .then((res) => {
        if (res.success) {
          router.push("/auth/login");
          return toast.success(res.message);
        } else {
          return toast.error(res.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        {/* password */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input {...field} type={showPass ? "text" : "password"} />
                  <span
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*confirm password */}
        <FormField
          disabled={isPending}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                  <Input {...field} type={showPass ? "text" : "password"} />
                  <span
                    className="absolute top-3 right-2 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaEye className="h-5 w-5" />
                    ) : (
                      <FaEyeSlash className="h-5 w-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 pb-5">
          <Button
            disabled={isPending || !form.formState.isValid}
            className="w-fit"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
