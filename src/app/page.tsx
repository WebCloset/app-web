import SearchClient from "@/components/SearchClient";

export default function Page() {
  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold mb-4">WebCloset</h1>
        <SearchClient />
      </div>
    </main>
  );
}
