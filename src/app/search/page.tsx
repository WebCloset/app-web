import SafeImg from "@/components/SafeImg";

export const dynamic = "force-dynamic";

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
  const rawQ = typeof params.q === "string" ? params.q : undefined;
  const q = rawQ?.trim() || undefined;

  const body = {
    q,
    page: 1,
    per_page: 24,
    sort: "best",
  } as const;

  let data: { items: Item[]; total: number } = { items: [], total: 0 };
  try {
    const res = await fetch(`${api}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      next: { revalidate: 0 },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return (
        <main className="p-6">
          <div className="text-red-600 font-medium">Search error ({res.status}).</div>
          <pre className="mt-2 whitespace-pre-wrap text-xs opacity-80">{text || "No error body returned."}</pre>
        </main>
      );
    }

    data = (await res.json()) as { items: Item[]; total: number };
  } catch (err: any) {
    return (
      <main className="p-6">
        <div className="text-red-600 font-medium">Search request failed.</div>
        <pre className="mt-2 whitespace-pre-wrap text-xs opacity-80">{String(err)}</pre>
      </main>
    );
  }

  const items = Array.isArray(data.items) ? data.items : [];

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