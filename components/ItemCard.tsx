type Item = {
  id: string;
  title: string;
  image?: string;
  price_cents?: number;
  currency?: string;
};

export default function ItemCard({ item }: { item: Item }) {
  const clickUrl = `${process.env.NEXT_PUBLIC_API_URL}/click?id=${item.id}`;

  return (
    <div className="border rounded p-3">
      <img
        src={item.image || '/placeholder.webp'}
        alt={item.title}
        className="w-full h-40 object-cover mb-2"
      />
      <div className="text-sm line-clamp-2 mb-1">{item.title}</div>
      <div className="text-sm font-medium">
        {item.currency || '$'}
        {(item.price_cents ?? 0) / 100}
      </div>
      <a
        href={clickUrl}
        target="_blank"
        rel="noopener"
        className="text-blue-600 underline text-sm"
      >
        View
      </a>
    </div>
  );
}