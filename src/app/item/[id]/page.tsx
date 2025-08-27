import { notFound } from "next/navigation";
import Link from "next/link";

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

export default async function ItemPage({
  params,
}: {
  params: { id: string };
}) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-red-600">API not configured.</div>
      </main>
    );
  }

  let item: Item;
  try {
    const res = await fetch(`${api}/item/${encodeURIComponent(params.id)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch item: ${res.status}`);
    }

    item = await res.json();
  } catch (err) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>
        <div className="text-red-600 font-medium">Failed to load item</div>
        <pre className="mt-2 text-xs opacity-80">{String(err)}</pre>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {item.image && (
            <img
              src={item.image}
              alt={item.title || "Item"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="space-y-4">
          {item.brand && (
            <div className="text-sm text-gray-600 font-medium">{item.brand}</div>
          )}
          
          <h1 className="text-2xl font-semibold">{item.title || "Untitled Item"}</h1>
          
          {item.price_cents && (
            <div className="text-3xl font-bold text-green-600">
              {fmtPrice(item.price_cents, item.currency)}
            </div>
          )}
          
          {item.condition && (
            <div className="text-sm">
              <span className="font-medium">Condition:</span> {item.condition}
            </div>
          )}
          
          {item.marketplace && (
            <div className="text-sm">
              <span className="font-medium">Marketplace:</span> {item.marketplace}
            </div>
          )}
          
          <div className="pt-4">
            <a
              href={`${api}/click?id=${encodeURIComponent(item.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              View on {item.marketplace || "Marketplace"}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
