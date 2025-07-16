import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ShieldXIcon } from "lucide-react";
import Link from "next/link";

const NotAdminPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-destructive/10 p-4 rounded-full flex w-fit mx-auto">
          <ShieldXIcon className="size-16 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">Access Restricted</CardTitle>
        <CardDescription className="max-w-xs mx-auto">
          Hey! You are not an admin, which means you are not authorized to
          access this page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/"
          replace
          className={buttonVariants({
            className: "w-full",
          })}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </CardContent>
    </Card>
  </div>
);

export default NotAdminPage;
