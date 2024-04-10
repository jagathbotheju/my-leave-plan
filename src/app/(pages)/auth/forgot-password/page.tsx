"use client";
import { forgotPassword } from "@/actions/authActions";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please provide valid email address"),
});

const ForgotPasswordPage = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(() => {
      forgotPassword(data.email)
        .then((response) => {
          if (response.success) {
            return toast.success(response.message);
          } else {
            return toast.error(response.error);
          }
        })
        .catch((err) => {
          return toast.error(err.message);
        })
        .finally(() => {
          form.reset();
        });
    });
  };

  return (
    <div className="w-full">
      <Header title="Resetting Password" />

      <div className="flex flex-col container mx-auto mt-10 max-w-7xl">
        <div className="w-4/12">
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
                        className="dark:bg-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                color="w-fit"
                type="submit"
              >
                {form.formState.isSubmitting ? "Please wait..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
