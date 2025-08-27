import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export default function BrowsePage() {
  return (
    <main className="min-h-dvh">
      <Suspense fallback={<div>Loading…</div>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}