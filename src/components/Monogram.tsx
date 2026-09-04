type Props = {
  size?: number;
  title?: string;
  /** Force the stacked-page archive mark even at small sizes. */
  variant?: "flat" | "archive" | "auto";
};

/** Flat EA favicon mark by default; stacked-page archive mark when size has room (>=40) or variant is archive. */
export function Monogram({ size = 32, title = "EmailArchiver", variant = "auto" }: Props) {
  const useArchive = variant === "archive" || (variant === "auto" && size >= 40);
  const src = useArchive ? "/mark-archive.svg" : "/icon.svg";
  return (
    <img
      src={src}
      alt={title}
      width={size}
      height={size}
      style={{ display: "block", width: size, height: size, borderRadius: useArchive ? 10 : 8 }}
    />
  );
}
