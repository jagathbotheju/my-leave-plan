"use client";
import { LoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  console.log("callback", callbackUrl);

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    const { email, password } = values;
    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (!res?.ok) {
          return toast.error(res?.error);
        } else {
          toast.success("Successfully Logged In");
          form.reset();
          router.push("/");
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
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="your.email@example.com"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
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

        {/* submit button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          Log In
        </Button>
      </form>

      <div className="flex flex-col items-center pb-5">
        <Link
          href="/auth/forgot-password"
          className="text-xs self-end cursor-pointer hover:text-primary mt-4"
        >
          forgot password?
        </Link>

        {/* <div className="flex items-center gap-x-5 my-3">
          <div className="flex bg-slate-200 w-20 h-[0.5px]" />
          or
          <div className="flex bg-slate-200 w-20 h-[0.5px]" />
        </div> */}

        {/* google login */}
        {/* <Button
          type="button"
          className="w-full mb-3"
          variant="secondary"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <div className="relative mr-2">
            <Image
              alt="logo"
              src="/images/google-icon.svg"
              className="top-0 left-0 relative"
              width={20}
              height={20}
            />
          </div>
          Google
        </Button> */}

        <Link href="/auth/register" className="text-sm hover:text-primary mt-5">
          {"Don't have an Account? Create New"}
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
