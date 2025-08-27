import Link from "next/link";
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            WebCloset
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm">
            <Link href="/search?q=dress" className="hover:underline">
              Search
            </Link>
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

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Search secondhand fashion across marketplaces.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-foreground/80">
              WebCloset aggregates listings so you can compare styles and prices in one place.
              Start with a quick search, then open any result via our safe redirect.
            </p>

            <div className="mt-6 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/search?q=black%20midi%20dress"
                className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium bg-foreground text-background hover:opacity-90 transition"
              >
                Start searching
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-foreground/60">Try:</span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/search?q=Levi%27s%20501"
                    className="rounded-full px-3 py-1 border border-foreground/20 hover:border-foreground/40"
                  >
                    Levi&apos;s 501
                  </Link>
                  <Link
                    href="/search?q=Dr%20Martens%201460"
                    className="rounded-full px-3 py-1 border border-foreground/20 hover:border-foreground/40"
                  >
                    Dr Martens 1460
                  </Link>
                  <Link
                    href="/search?q=Arcteryx%20Beta%20jacket"
                    className="rounded-full px-3 py-1 border border-foreground/20 hover:border-foreground/40"
                  >
                    Arc&apos;teryx Beta jacket
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-lg border p-5">
              <h3 className="font-semibold">1. Ingest</h3>
              <p className="mt-2 text-sm text-foreground/70">
                We collect listings (eBay first) and index them for fast search.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-semibold">2. Search</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Use our results page to filter and sort. Prices are normalized to cents.
              </p>
            </div>
            <div className="rounded-lg border p-5">
              <h3 className="font-semibold">3. Click</h3>
              <p className="mt-2 text-sm text-foreground/70">
                Every card opens through <code className="px-1 py-0.5 rounded bg-foreground/10">/click?id=…</code> on our API
                for safe outbound redirects.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-foreground/60">
          © {new Date().getFullYear()} WebCloset • Built with Next.js &amp; FastAPI
        </div>
      </footer>
    </div>
  );
}
