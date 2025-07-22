import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileState, FileType } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

type RenderStateProps = {
  fileState: FileState;
  isDragActive: boolean;
  onRemoveFile: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  fileType: FileType;
};

export const RenderState = ({
  fileState,
  isDragActive,
  onRemoveFile,
  isDisabled,
  fileType,
}: RenderStateProps) => {
  const { progress, objectUrl, isError, isUploading, file, isDeleting } =
    fileState;

  if (isError) {
    return (
      <div className="text-center">
        <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
          <ImageIcon className={cn("size-6 text-destructive")} />
        </div>
        <p className="text-base font-semibold">Upload Failed</p>
        <p className="text-xs mt-1 text-muted-foreground">
          Something went wrong
        </p>
        <Button className="mt-4" type="button" disabled={isDisabled}>
          Retry File Selection
        </Button>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="text-center flex justify-center items-center flex-col max-w-96 w-full">
        <Progress value={progress} className="w-full" />
        <p className="mt-2 text-sm font-medium">Uploading...</p>
        <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
          {file?.name}
        </p>
      </div>
    );
  }

  if (objectUrl) {
    return (
      <div className="relative group w-full h-full flex items-center justify-center">
        {fileType === "image" ? (
          <Image
            src={objectUrl}
            alt="Uploaded file"
            fill
            className="object-contain p-2"
          />
        ) : (
          <video
            src={objectUrl}
            controls
            className="rounded-md w-full h-full p-2"
          />
        )}
        <Button
          size="icon"
          className={cn("absolute top-0 right-0")}
          type="button"
          variant="destructive"
          onClick={onRemoveFile}
          disabled={isDeleting || isDisabled}
          isLoading={isDeleting}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted dark:bg-muted-foreground/10 mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold">click to upload</span>
      </p>
      <Button className="mt-4" type="button" disabled={isDisabled}>
        Select File
      </Button>
    </div>
  );
};
