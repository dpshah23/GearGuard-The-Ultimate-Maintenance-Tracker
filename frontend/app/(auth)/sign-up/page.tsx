"use client";

import { Suspense } from "react";

import { SignUpSkeleton, SignUpContent } from "../_components/sign-up-content";

export default function SignUp() {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUpContent />
    </Suspense>
  );
}
