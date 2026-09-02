import type { Metadata } from "next";
import { Dropzone } from "@/components/Dropzone";
import { SourceCards } from "@/components/SourceCards";
import styles from "./app.module.css";

export const metadata: Metadata = {
  title: "Upload",
};

export default function AppHomePage() {
  return (
    <>
      <h1 className={styles.title}>Upload</h1>
      <p className={styles.sub}>Import email files into your library. Gmail connection coming soon.</p>
      <Dropzone />
      <SourceCards />
    </>
  );
}
