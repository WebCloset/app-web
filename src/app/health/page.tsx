export default async function HealthPage() {
  const api = process.env.NEXT_PUBLIC_API_URL!;
  let status = "unknown";
  let body: unknown = null;
  try {
    const res = await fetch(`${api}/health`, { cache: "no-store" });
    status = `${res.status} ${res.statusText}`;
    body = await res.json().catch(() => null);
  } catch (_e: unknown) {
    status = `network error`;
  }

  return (
    <main className="min-h-screen p-8 text-white">
      <h1 className="text-xl font-bold mb-4">API Health Check</h1>
      <p className="mb-2">API: <span className="font-mono">{api}</span></p>
      <p className="mb-4">Response: <span className="font-mono">{status}</span></p>
      <pre className="bg-gray-100 text-black p-4 rounded">
{JSON.stringify(body, null, 2)}
      </pre>
    </main>
  );
}