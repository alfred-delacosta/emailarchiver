import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: "40rem",
        margin: "4rem auto",
        padding: "0 1.25rem",
        textAlign: "center",
      }}
    >
      <h1>Page not found</h1>
      <p style={{ color: "var(--text-muted)" }}>
        That URL does not exist in EmailArchiver.
      </p>
      <p>
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/app">App</Link>
      </p>
    </main>
  );
}
