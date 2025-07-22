"use client";

import { RenderState } from "@/components/file-uploader/render-state";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadFile } from "@/hooks/use-upload-file";
import { cn } from "@/lib/utils";
import { FileType } from "@/lib/types";

type FileUploaderProps = {
  value?: string;
  onChange?: (value: string) => void;
  isError?: boolean;
  fileType: FileType;
  isDisabled?: boolean;
};

export const FileUploader = ({
  onChange,
  value,
  isError,
  isDisabled,
  fileType,
}: FileUploaderProps) => {
  const { getRootProps, getInputProps, isDragActive, fileState, removeFile } =
    useUploadFile({ onChange, value, isDisabled, fileType });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-dashed border-2 transition-colors duration-200 ease-in-out w-full h-64 hover:cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
        isError && "border-destructive"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full">
        <input {...getInputProps()} />
        <RenderState
          fileState={fileState}
          isDragActive={isDragActive}
          onRemoveFile={removeFile}
          isDisabled={isDisabled}
          fileType={fileType}
        />
      </CardContent>
    </Card>
  );
};
