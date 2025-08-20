// app/item/[id]/page.tsx
import { headers } from "next/headers";

type ApiResponse = {
  item: {
    id: string;
    brand: string | null;
    title: string | null;
    category: string | null;
    image_url: string | null;
    min_price_cents: number | null;
  };
  offers: Array<{
    link_id: string;
    marketplace_code: string | null;
    title: string | null;
    price_cents: number | null;
    currency: string | null;
    image_url: string | null;
    seller_url: string | null;
  }>;
};

function formatPrice(cents: number | null, currency = "USD") {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const h = headers();
  const host = h.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${proto}://${host}/api/item/${params.id}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">Item not found</h1>
      </div>
    );
  }

  const data = (await res.json()) as ApiResponse;
  const { item, offers } = data;
  const heroImg = item.image_url ?? "/placeholder.svg";

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex flex-col sm:flex-row gap-6">
        <img
          src={heroImg}
          alt={item.title ?? "Item"}
          className="w-full sm:w-80 h-80 object-cover rounded-2xl shadow"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            {item.brand ? `${item.brand} — ` : ""}{item.title ?? "Untitled"}
          </h1>
          <p className="text-gray-500">{item.category ?? "Uncategorized"}</p>
          <div className="mt-4">
            <span className="text-xl">{formatPrice(item.min_price_cents)}</span>
            <span className="ml-2 text-sm text-gray-500">min price</span>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Available offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.length === 0 ? (
            <div className="text-gray-500">No active offers.</div>
          ) : (
            offers.map((o) => (
              <a
                key={o.link_id}
                href={o.seller_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-2xl p-4 shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={o.image_url ?? "/placeholder.svg"}
                    alt={o.title ?? "Listing"}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      {o.marketplace_code ?? "marketplace"}
                    </div>
                    <div className="font-medium">
                      {formatPrice(o.price_cents, o.currency ?? "USD")}
                    </div>
                  </div>
                </div>
                <div className="text-sm line-clamp-2">{o.title ?? "View listing"}</div>
                <div className="mt-2 text-blue-600 text-sm">View on seller →</div>
              </a>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
