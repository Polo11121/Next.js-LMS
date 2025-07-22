export type FileState = {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  progress: number;
  key?: string;
  isDeleting?: boolean;
  isError?: boolean;
  objectUrl?: string;
  fileType?: "image" | "video";
};

export type ActionResponse = {
  status: "success" | "error";
  message: string;
};

export type FileType = "image" | "video";
