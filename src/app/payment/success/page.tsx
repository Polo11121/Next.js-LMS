"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFireConfetti } from "@/hooks/use-fire-confetti";
import { ArrowLeft, CheckCircleIcon } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const fireConfetti = useFireConfetti();

  useEffect(() => {
    fireConfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckCircleIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance">
              You are now enrolled in the course. You can start learning now.
            </p>
            <Link
              href="/"
              className={buttonVariants({ className: "mt-5 w-full" })}
            >
              <ArrowLeft className="size-4" />
              Go back to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
