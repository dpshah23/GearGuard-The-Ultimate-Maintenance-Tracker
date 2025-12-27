"use server";

// import { User } from "better-auth/*";
// import z from "zod";

// import { findUserByEmail } from "@/lib/db/user";
// import { ActionResponse } from "@/types";
// import { RegisterSchema } from "@/schemas";
// import { auth } from "@/lib/auth";
// import { DEFAULT_REDIRECT_URL } from "@/lib/route";

// type SignUpActionOptions = {
//   redirectTo?: string;
// };

// export const signUpAction = async (
//   data: z.infer<typeof RegisterSchema>,
//   options?: SignUpActionOptions,
// ): Promise<ActionResponse<User | null> & { redirectTo?: string | null }> => {
//   try {
//     const safeData = RegisterSchema.safeParse(data);

//     if (!safeData.success) {
//       return {
//         success: false,
//         message: "Invalid data input",
//         fieldErrors: safeData.error.flatten().fieldErrors,
//       };
//     }

//     const { name, email, password } = safeData.data;

//     const existingUser = await findUserByEmail(email);

//     if (existingUser) {
//       return {
//         success: false,
//         message: "User already exists",
//         fieldErrors: { email: ["User with this email already exists"] },
//       };
//     }

//     const newUser = await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//         callbackURL: options?.redirectTo || DEFAULT_REDIRECT_URL,
//       },
//     });

//     const { user } = newUser;

//     if (!user) {
//       return {
//         success: false,
//         message: "Failed to create user",
//       };
//     }

//     // TODO: Implement email verification
//     // TODO: Update this based on user input

//     return {
//       success: true,
//       message: "Sign-up successful",
//       redirectTo: options?.redirectTo || null,
//     };
//   } catch (error: any) {
//     // console.error("Sign-up error:", error);
//     return {
//       success: false,
//       message: error.message || "An unknown error occurred.",
//     };
//   }
// };

export const signUpAction = async () => {};
