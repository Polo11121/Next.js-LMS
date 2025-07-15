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

export type ActionResponse<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
