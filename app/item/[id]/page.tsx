import { notFound } from "next/navigation";

export const runtime = "edge";

async function getItem(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/item/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const data = await getItem(params.id);
  if (!data) return notFound();

  const { item, offers } = data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">
        {item.brand} {item.title}
      </h1>
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.title}
        className="w-full h-auto rounded border mb-4"
        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
      />
      <h2 className="text-xl font-semibold mb-2">Available Offers</h2>
      <ul className="space-y-2">
        {offers.map((o: any) => (
          <li key={o.link_id}>
            <a
              href={o.seller_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {o.marketplace} — {(o.price_cents / 100).toFixed(2)} {o.currency}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
