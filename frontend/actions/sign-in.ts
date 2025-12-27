"use server";

// import { z } from "zod";

// import { LoginSchema } from "@/schemas";
// import { ActionResponse } from "@/types";
// import { User } from "@/app/generated/prisma";

// export const signInAction = async (
//   data: z.infer<typeof LoginSchema>,
// ): Promise<ActionResponse<User | null>> => {
//   const parsed = LoginSchema.safeParse(data);

//   if (!parsed.success) {
//     return {
//       success: false,
//       message: "Invalid input",
//       fieldErrors: parsed.error.flatten().fieldErrors,
//     };
//   }

//   const res = await fetch(`${process.env.API_URL}/api/auth/login/`, {
//     method: "POST",
//     credentials: "include", // 🔑 SESSION COOKIE
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(parsed.data),
//   });

//   if (!res.ok) {
//     const err = await res.json();

//     return {
//       success: false,
//       message: err.message || "Invalid email or password",
//     };
//   }

//   return {
//     success: true,
//     message: "Signed in successfully",
//   };
// };

export const signInAction = async () => {};
