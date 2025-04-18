
"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";

export function UserSignIn() {
  const handleSignIn = () => {
    signIn("github");
  };

  return (
    <Button
      type="button"
      variant="secondary"
      className="mt-4 w-full"
      onClick={handleSignIn}
    >
      Continue with GitHub
    </Button>
  );
}
