"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GithubIcon, MailIcon } from "lucide-react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [isGithubTransitionPending, startGithubTransition] = useTransition();
  const [isEmailTransitionPending, startEmailTransition] = useTransition();
  const router = useRouter();
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const signInWithGithub = () =>
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed with Github, you will be redirected...");
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong");
          },
        },
      });
    });

  const signInWithEmail = () => {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification OTP sent to your email");
            router.push(`/verify-email?email=${email}`);
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong");
          },
        },
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with your Github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={signInWithGithub}
          disabled={isGithubTransitionPending}
        >
          <GithubIcon className="size-4" />
          Sign in with Github
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <Button
            className="w-full"
            onClick={signInWithEmail}
            disabled={isEmailTransitionPending}
          >
            <MailIcon className="size-4" />
            Continue with Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
