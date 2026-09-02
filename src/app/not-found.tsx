import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="prose"
      style={{
        maxWidth: "40rem",
        margin: "4rem auto",
        padding: "0 1.25rem",
        textAlign: "center",
      }}
      tabIndex={-1}
    >
      <h1>Page not found</h1>
      <p style={{ color: "var(--text-muted)" }}>
        That URL does not exist in EmailArchiver.
      </p>
      <p>
        <Link href="/">Home</Link>
        {" · "}
        <Link href="/features">Features</Link>
        {" · "}
        <Link href="/security">Security</Link>
        {" · "}
        <Link href="/app">App</Link>
      </p>
    </main>
  );
}
