import styles from "./Monogram.module.css";

export function Monogram({ size = 32 }: { size?: number }) {
  return (
    <span
      className={styles.mono}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      EA
    </span>
  );
}
