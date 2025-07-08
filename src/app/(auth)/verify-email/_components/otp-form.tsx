"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [isEmailTransitionPending, startEmailTransition] = useTransition();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const router = useRouter();

  const isOtpValid = otp.length === 6;

  const handleOtpChange = (value: string) => setOtp(value);

  const verifyOtp = () => {
    startEmailTransition(async () => {
      await authClient.emailOtp.verifyEmail({
        otp,
        email,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message || "Something went wrong");
          },
        },
      });
    });
  };

  if (!email) {
    redirect("/login");
  }

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your email address. Please open
          the email and paste the code.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground">
            Enter the 6 digit code sent to your email
          </p>
        </div>
        <Button
          className="w-full"
          onClick={verifyOtp}
          disabled={isEmailTransitionPending || !isOtpValid}
          isLoading={isEmailTransitionPending}
        >
          Verify
        </Button>
      </CardContent>
    </Card>
  );
};
