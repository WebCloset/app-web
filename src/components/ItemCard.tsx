import Link from "next/link";
import SafeImg from "./SafeImg";

export type Item = {
  id: string;
  title: string;
  brand?: string;
  condition?: string;
  image?: string | null;
  price_cents: number;
};

function formatPrice(cents: number) {
  return `£${(cents / 100).toFixed(2)}`;
}

export default function ItemCard({ item }: { item: Item }) {
  const img = item.image || "/placeholder.webp";
  return (
    <article className="border rounded-lg p-3 flex flex-col gap-3">
      <SafeImg src={img} alt={item.title} className="w-full h-56 object-cover rounded" />
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
        <p className="mt-1 text-xs text-foreground/70">
          {item.brand ?? "Brand"} • {item.condition ?? "—"}
        </p>
        <p className="mt-1 font-semibold">{formatPrice(item.price_cents)}</p>
      </div>
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/click?id=${encodeURIComponent(item.id)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex justify-center rounded-md border px-3 py-2 text-sm hover:bg-foreground/5"
      >
        View on seller
      </Link>
    </article>
  );
}