import Link from "next/link";
import styles from "./BrandLogo.module.css";

type Props = {
  href?: string;
  showWordmark?: boolean;
  className?: string;
  onNavigate?: () => void;
};

export function BrandLogo({
  href = "/",
  showWordmark = true,
  className,
  onNavigate,
}: Props) {
  return (
    <Link
      href={href}
      className={`${styles.brand} ${className ?? ""}`.trim()}
      aria-label="EmailArchiver home"
      onClick={onNavigate}
    >
      <img src="/icon.svg" alt="" width={28} height={28} className={styles.mark} />
      {showWordmark ? <span className={styles.wordmark}>EmailArchiver</span> : null}
    </Link>
  );
}
