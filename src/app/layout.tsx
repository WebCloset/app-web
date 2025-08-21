export const metadata = { title: "WebCloset" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", margin: 0 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px" }}>{children}</div>
      </body>
    </html>
  );
}
