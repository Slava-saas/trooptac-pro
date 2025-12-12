"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="mx-auto max-w-md py-10">
      <SignIn afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
    </main>
  );
}