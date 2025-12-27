"use client";

import { useSearchParams } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

import { AuthBackLink } from "../_components/auth-back-link";
import { AuthWrapper } from "../_components/auth-wrapper";
import { SignUpForm } from "../_components/sign-up-form";

/* -------------------------------
   HeroUI Skeleton Fallback Loader
---------------------------------*/
export const SignUpSkeleton = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-md rounded-2xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-36 rounded-lg" /> {/* Title */}
          <Skeleton className="h-4 w-44 rounded-md" /> {/* Subtitle */}
        </CardHeader>

        <CardBody className="space-y-3">
          {/* Mimic the input fields */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Name */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Phone */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Email */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Password */}
          <Skeleton className="h-10 w-full rounded-md" />{" "}
          {/* Confirm Password */}
        </CardBody>

        <CardFooter className="flex flex-col items-center space-y-3">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Submit button */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24 rounded-md" /> {/* Text */}
            <Skeleton className="h-4 w-16 rounded-md" /> {/* Link */}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

/* -------------------------------
   Actual Page Content
---------------------------------*/
export const SignUpContent = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <AuthWrapper
      footerContent={
        <AuthBackLink
          href={
            redirectTo
              ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
              : "/sign-in"
          }
          linkText="Sign in"
          text="Already have an account?"
        />
      }
      subtitle="Join us today!"
      title="Create Account"
    >
      <SignUpForm
        redirectTo={redirectTo ? decodeURIComponent(redirectTo) : undefined}
      />
    </AuthWrapper>
  );
};
