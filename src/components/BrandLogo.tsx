import Link from "next/link";
import styles from "./BrandLogo.module.css";

type Props = {
  href?: string;
  /** paper = marketing, horizontal = app chrome */
  lockup?: "paper" | "horizontal" | "none";
  className?: string;
  onNavigate?: () => void;
};

export function BrandLogo({
  href = "/",
  lockup = "horizontal",
  className,
  onNavigate,
}: Props) {
  const lockupSrc =
    lockup === "paper"
      ? "/lockup-on-paper.svg"
      : lockup === "horizontal"
        ? "/lockup-horizontal.svg"
        : null;

  return (
    <Link
      href={href}
      className={`${styles.brand} ${className ?? ""}`.trim()}
      aria-label="EmailArchiver home"
      onClick={onNavigate}
    >
      {lockupSrc ? (
        <img
          src={lockupSrc}
          alt="EmailArchiver"
          height={28}
          className={styles.lockup}
        />
      ) : null}
      <img
        src="/icon.svg"
        alt={lockupSrc ? "" : "EmailArchiver"}
        width={28}
        height={28}
        className={styles.mark}
        aria-hidden={lockupSrc ? true : undefined}
      />
    </Link>
  );
}
