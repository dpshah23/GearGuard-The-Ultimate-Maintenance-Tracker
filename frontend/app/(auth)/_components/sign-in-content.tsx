import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useSearchParams } from "next/navigation";

import { AuthBackLink } from "./auth-back-link";
import { AuthWrapper } from "./auth-wrapper";
import { SignInForm } from "./sign-in-form";

export const SignInContent = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <AuthWrapper
      footerContent={
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Forgot password link */}
          <AuthBackLink
            href="/forgot-password"
            linkText="Reset it"
            text="Forgot your password?"
          />

          {/* Sign up link */}
          <AuthBackLink
            href={
              redirectTo
                ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
                : "/sign-up"
            }
            linkText="Sign up"
            text="Don't have an account?"
          />
        </div>
      }
      subtitle="Welcome back!"
      title="Sign In"
    >
      <SignInForm
        redirectTo={redirectTo ? decodeURIComponent(redirectTo) : undefined}
      />
    </AuthWrapper>
  );
};
export const SignInSkeleton = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4 shadow-md rounded-2xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-8 w-32 rounded-lg" /> {/* Title */}
          <Skeleton className="h-4 w-48 rounded-md" /> {/* Subtitle */}
        </CardHeader>

        <CardBody className="space-y-3">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Email field */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Password field */}
          <Skeleton className="h-5 w-24 rounded-md" />{" "}
          {/* Remember me / label */}
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
