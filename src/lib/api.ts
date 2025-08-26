export type SearchBody = {
  q?: string;
  brand?: string[];
  size?: string[];
  condition?: string[];
  marketplace?: string[];
  price_min?: number;
  price_max?: number;
  sort?: 'best' | 'price_asc' | 'newest';
  page?: number;
  per_page?: number;
};

export async function searchApi(body: SearchBody) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Search failed ${res.status}: ${text}`);
  }
  return res.json();
}