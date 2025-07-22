import { toast } from "sonner";
import { ActionResponse } from "@/lib/types";

type ApiResponseHandlerProps = {
  error?: unknown;
  data?: ActionResponse | null;
  onSuccess?: () => void;
  onError?: () => void;
  errorMessage?: string;
  successMessage?: string;
};

export function apiResponseHandler({
  error,
  data,
  onSuccess,
  onError,
  errorMessage,
  successMessage,
}: ApiResponseHandlerProps) {
  if (error) {
    toast.error(errorMessage ?? "Failed to perform action");
    onError?.();
    return false;
  }

  if (data?.status === "error") {
    toast.error(data.message);
    onError?.();
    return false;
  }

  if (data?.status === "success") {
    toast.success(successMessage ?? "Action successful");
    onSuccess?.();
    return true;
  }

  return false;
}
