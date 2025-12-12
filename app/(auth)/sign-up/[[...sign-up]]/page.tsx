"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="mx-auto max-w-md py-10">
      <SignUp afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
    </main>
  );
}