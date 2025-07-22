"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { FileState, FileType } from "@/lib/types";
import { constructUrl } from "@/functions/construct-url";

type UseUploadFileProps = {
  onChange?: (value: string) => void;
  value?: string;
  isDisabled?: boolean;
  fileType: FileType;
};

export const useUploadFile = ({
  onChange,
  value,
  isDisabled,
  fileType,
}: UseUploadFileProps) => {
  const fileUrl = constructUrl(value ?? "");
  const [fileState, setFileState] = useState<FileState>({
    id: null,
    file: null,
    isUploading: false,
    progress: 0,
    isDeleting: false,
    isError: false,
    key: value,
    objectUrl: fileUrl,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        isUploading: true,
        progress: 0,
      }));

      try {
        const presignedUrl = await fetch("/api/s3/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileType === "image",
          }),
        });

        if (!presignedUrl.ok) {
          if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
            URL.revokeObjectURL(fileState.objectUrl);
          }

          toast.error("Failed to upload file");
          setFileState((prev) => ({
            ...prev,
            isUploading: false,
            progress: 0,
            isError: true,
            objectUrl: undefined,
          }));
          return;
        }

        const { presignedUrl: presignedUrlResponse, uniqueKey } =
          await presignedUrl.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFileState((prev) => ({
                ...prev,
                progress,
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                isUploading: false,
                progress: 100,
                key: uniqueKey,
              }));

              onChange?.(uniqueKey);

              toast.success("File uploaded successfully");

              resolve();
            } else {
              reject(new Error("Failed to upload file"));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Failed to upload file"));
          };

          xhr.open("PUT", presignedUrlResponse);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        toast.error("Failed to upload file");
        setFileState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          isError: true,
          objectUrl: undefined,
        }));
      }
    },
    [onChange, fileState.objectUrl, fileType]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) {
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      const droppedFile = acceptedFiles[0];
      setFileState({
        id: uuid(),
        file: droppedFile,
        isUploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(droppedFile),
      });

      uploadFile(droppedFile);
    },
    [fileState.objectUrl, uploadFile]
  );

  const removeFile = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (fileState.isDeleting || !fileState.objectUrl) {
      return;
    }

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          isError: true,
        }));

        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        id: null,
        file: null,
        isUploading: false,
        progress: 0,
        isDeleting: false,
        isError: false,
        fileType,
        objectUrl: undefined,
      });

      onChange?.("");

      toast.success("File deleted successfully");
    } catch {
      toast.error("Failed to delete file");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        isError: true,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return {
    ...useDropzone({
      disabled:
        isDisabled ||
        fileState.isDeleting ||
        fileState.isUploading ||
        !!fileState.objectUrl,
      onDrop,
      multiple: false,
      maxFiles: 1,
      maxSize: fileType === "image" ? 1024 * 1024 * 5 : 1024 * 1024 * 5000,
      accept:
        fileType === "image"
          ? {
              "image/*": [],
            }
          : {
              "video/*": [],
            },
      onDropRejected: (rejectedFiles) => {
        if (!rejectedFiles.length) {
          const tooManyFiles = rejectedFiles.find(
            (file) => file.errors[0].code === "to-many-files"
          );
          if (tooManyFiles) {
            toast.error("You can only upload one file at a time");
            return;
          }

          const fileTooLarge = rejectedFiles.find(
            (file) => file.errors[0].code === "file-too-large"
          );
          if (fileTooLarge) {
            toast.error("File is too large");
            return;
          }
        }
      },
    }),
    fileState,
    removeFile,
  };
};
