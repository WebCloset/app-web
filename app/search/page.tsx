// app/search/page.tsx
import { searchApi } from '@/lib/api';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q || '').trim();
  const data = await searchApi({ q, page: 1, per_page: 24, sort: 'best' });

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-xl font-semibold mb-4">
        Results{q ? ` for “${q}”` : ''}
      </h1>

      {data?.items?.length ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.items.map((item: any) => (
            <li key={item.id} className="border rounded p-3">
              <img
                src={item.image || '/placeholder.webp'}
                alt={item.title || 'item'}
                className="w-full h-40 object-cover mb-2"
              />
              <div className="text-sm line-clamp-2 mb-1">{item.title}</div>
              <div className="text-sm font-medium">
                {item.currency || '$'}
                {(item.price_cents ?? 0) / 100}
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/click?id=${item.id}`}
                target="_blank"
                rel="noopener"
                className="text-blue-600 underline text-sm"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No results.</p>
      )}
    </main>
  );
}