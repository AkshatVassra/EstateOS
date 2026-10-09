export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1>404 - Not Found</h1>
      <p>The requested API endpoint or page does not exist.</p>
    </div>
  );
}
