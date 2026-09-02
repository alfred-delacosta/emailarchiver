export type MessageMeta = {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string | null;
  hasAttachments: boolean;
  attachmentNames: string[];
  preview: string;
  sourceFile: string;
  createdAt: string;
};

export type MessageDetail = MessageMeta & {
  text: string;
  html: string | null;
};

export type ExportJob = {
  id: string;
  messageIds: string[];
  status: "pending" | "processing" | "done" | "error";
  createdAt: string;
  finishedAt: string | null;
  filename: string;
  error?: string;
};

export type UploadFileResult = {
  filename: string;
  status: "ok" | "error";
  messageCount: number;
  error?: string;
  messageIds: string[];
};
