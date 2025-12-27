"use client";

import { Suspense } from "react";

import { SignInSkeleton, SignInContent } from "../_components/sign-in-content";

const SignInPage = () => {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent />
    </Suspense>
  );
};

export default SignInPage;
