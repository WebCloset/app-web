"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form action="/search" method="GET"
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        if (!query) return; // prevent empty searches
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        name="q"
        aria-label="Search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search e.g. Levi’s 501"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <button type="submit" className="rounded-md border px-4 py-2 text-sm hover:bg-foreground/5">
        Search
      </button>
    </form>
  );
}