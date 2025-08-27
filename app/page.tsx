"use client";

import { Suspense } from "react";
import SearchClient from "@/src/components/SearchClient";

function SearchClientWrapper() {
  return <SearchClient />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchClientWrapper />
      </Suspense>
    </main>
  );
}
