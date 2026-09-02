import type { Metadata } from "next";
import { PreviewClient } from "@/components/PreviewClient";

export const metadata: Metadata = {
  title: "Preview",
};

export default function PreviewPage({ params }: { params: { id: string } }) {
  return <PreviewClient id={params.id} />;
}
