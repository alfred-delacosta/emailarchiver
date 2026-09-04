type Props = {
  size?: number;
  title?: string;
};

/** Envelope mark — readable as email at favicon size. */
export function Monogram({ size = 32, title = "EmailArchiver" }: Props) {
  return (
    <img
      src="/icon.svg"
      alt={title}
      width={size}
      height={size}
      style={{ display: "block", width: size, height: size, borderRadius: 8 }}
    />
  );
}
