'use client';

export const dynamic = 'force-dynamic';

export default function Error() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1>500 - Server Error</h1>
      <p>An unexpected error occurred.</p>
    </div>
  );
}
