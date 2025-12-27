import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginSchema = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .min(1, { message: "Email is required" })
    .refine((val) => emailRegex.test(val), {
      message: "Invalid email address",
    }),

  password: z
    .string({ message: "Password must be a string" })
    .min(1, { message: "Password is required" }),

  code: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string({ message: "Email must be a string" })
      .min(1, { message: "Email is required" })
      .refine((val) => emailRegex.test(val), {
        message: "Invalid email address",
      }),
    password: z
      .string()
      .min(6, { message: "Minimum 6 characters required" })
      .refine(
        (password) => {
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        },
        {
          message:
            "Password must include uppercase, lowercase, number and special character",
        },
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Show the error on the confirmPassword field
  });

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordChangeData = z.infer<typeof PasswordChangeSchema>;

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
