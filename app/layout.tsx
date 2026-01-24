import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A modern URL shortener application",
  openGraph: {
    title: "URL Shortener",
    description: "A modern URL shortener application",
    url: "/",
    siteName: "URL Shortener",
    type: "website",
    locale: "en_US",
  },
};

/**
 * Root layout component. This wraps every page in a minimal
 * container and includes the global styles imported above. You
 * can further customise the layout by adding headers, footers or
 * navigation elements here.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto max-w-6xl p-4 md:p-8">{children}</div>
      </body>
    </html>
  );
}
