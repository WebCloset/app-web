import SafeImg from '@/components/SafeImg';

// app-web/src/app/search/page.tsx
type Item = {
  id: string;
  title?: string;
  brand?: string;
  condition?: string;
  price_cents?: number;
  currency?: string;
  image?: string;
  marketplace?: string;
};

function fmtPrice(cents?: number, cur?: string) {
  if (cents == null) return "";
  return `${cur || "USD"} ${(cents / 100).toFixed(2)}`;
}

export default async function SearchPage({
  searchParams,
}: { searchParams: Record<string, string | string[] | undefined> }) {
  const params = searchParams;
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) {
    return <main className="p-6">API not configured.</main>;
  }
  const q = typeof params.q === "string" ? params.q : undefined;

  const body = {
    q,
    page: 1,
    per_page: 24,
    sort: "best",
  };

  console.log("API URL:", api);
  const res = await fetch(`${api}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return <main className="p-6">Search error.</main>;
  }

  const data = await res.json() as { items: Item[]; total: number };
  const items = data.items || [];

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-3">
        Results ({data.total}){q ? ` for “${q}”` : ""}
      </h1>

      {items.length === 0 ? (
        <div>No items found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <a
              key={it.id}
              href={`${api}/click?id=${encodeURIComponent(it.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border p-2 hover:shadow-sm transition"
            >
              <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SafeImg
                    src={it.image || '/placeholder.webp'}
                    alt={it.title || 'item'}
                    className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 text-sm line-clamp-2">{it.title || "Untitled"}</div>
              <div className="text-xs text-gray-500">
                {it.brand ? `${it.brand} • ` : ""}{it.condition || ""}
              </div>
              <div className="mt-1 font-medium">{fmtPrice(it.price_cents, it.currency)}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}