import type { Metadata } from "next";
import { SettingsClient } from "@/components/SettingsClient";
import styles from "../app.module.css";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.sub}>PDF options, connected accounts, and data deletion.</p>
      <SettingsClient />
    </>
  );
}
