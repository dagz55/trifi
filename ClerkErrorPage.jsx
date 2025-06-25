export default function ClerkErrorPage() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🚫 Clerk Auth Error</h1>
      <p>
        This domain is not authorized to use Clerk in production mode.
        Please use <strong>https://trigo.live</strong> or update your environment variables.
      </p>
    </div>
  );
}
