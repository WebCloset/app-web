import Link from "next/link";
import SearchClient from '@/src/components/SearchClient';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            WebCloset
          </Link>
          <nav className="hidden sm:flex gap-6 text-sm">
            <Link href="/browse" className="hover:underline">
              Browse
            </Link>
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
        <SearchClient />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-foreground/60">
          © {new Date().getFullYear()} WebCloset • Built with Next.js &amp; FastAPI
        </div>
      </footer>
    </div>
  );
}
