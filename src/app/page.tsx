import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            WebCloset
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm">
            <Link href="/browse" className="hover:underline">Browse</Link>
            <Link href="/search?q=dress" className="hover:underline">Search</Link>
            <a
              href="https://github.com/WebCloset"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Find better second‑hand fashion
        </h1>
        <p className="mt-3 text-slate-600">
          Search across marketplaces. Clean results. One click to buy.
        </p>
        <div className="mt-8 mx-auto max-w-2xl">
          <SearchBar />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link href="/search?q=levi" className="px-3 py-1.5 text-sm rounded-full border hover:bg-slate-100">
            Levi’s 501
          </Link>
          <Link href="/search?q=linen+dress" className="px-3 py-1.5 text-sm rounded-full border hover:bg-slate-100">
            Linen dress
          </Link>
          <Link href="/search?q=arc%27teryx+jacket" className="px-3 py-1.5 text-sm rounded-full border hover:bg-slate-100">
            Arc’teryx jacket
          </Link>
          <Link href="/search?q=gucci+loafers" className="px-3 py-1.5 text-sm rounded-full border hover:bg-slate-100">
            Gucci loafers
          </Link>
        </div>
      </section>

      {/* Value cards */}
      <section className="mx-auto max-w-6xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20">
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-medium">Smart search</h3>
          <p className="text-sm text-slate-600 mt-1">
            Try phrases like “black silk midi dress under $150 size 6”.
          </p>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-medium">De‑duped results</h3>
          <p className="text-sm text-slate-600 mt-1">Cleaner listings, fewer repeats.</p>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-medium">Fast filters</h3>
          <p className="text-sm text-slate-600 mt-1">Price, condition, size, marketplace.</p>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <h3 className="font-medium">One‑click out</h3>
          <p className="text-sm text-slate-600 mt-1">Open seller pages via secure redirect.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500 text-center">
          Some links are affiliate; we may earn a commission.
        </div>
      </footer>
    </main>
  );
}
