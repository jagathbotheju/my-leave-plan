import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please provide valid email address"),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const ProfileEditSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .min(2, "name must be at least 2 characters")
    .max(45, "name must less than 45 characters"),
  email: z
    .string()
    .min(1, "e-mail is required")
    .email("please enter valid email address"),
});

export const LeaveEditSchema = z.object({
  year: z.string().min(1, "Year is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  days: z.coerce.number(),
  leaveType: z.string().min(1, "leave type is required"),
});

export const LeaveRequestSchema = z.object({
  year: z.string().min(1, "Year is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  days: z.coerce.number(),
  leaveType: z.string().min(1, "leave type is required"),
});

export const LeaveBalanceSchema = z.object({
  // annual
  year: z
    .string()
    .min(1, "leave type is required")
    .refine(
      (data) => parseInt(data) === new Date().getFullYear(),
      "must be current year"
    ),

  // annual
  annual: z.coerce
    .number()
    .gt(0, "must be grater than zero")
    .lte(45, "maximum annual leave is 45"),

  // annual forward
  annualForward: z.coerce
    .number()
    .lte(22, "maximum carry forward annual leave is 22"),

  // casual
  casual: z.coerce
    .number()
    .gt(0, "must be grater than zero")
    .lte(7, "maximum casual leave is 7"),

  // sick
  sick: z.coerce.number(),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "e-mail is required")
    .email("please enter valid email address"),
  password: z
    .string()
    .min(1, "password is required")
    .min(6, "password must be at least 6 characters"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "name is required")
      .min(2, "name must be at least 2 characters")
      .max(45, "name must less than 45 characters"),
    email: z
      .string()
      .min(1, "e-mail is required")
      .email("please enter valid email address"),
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters")
      .max(20, "password cannot exceed 20 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
