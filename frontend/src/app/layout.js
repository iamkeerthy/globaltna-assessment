import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Mini Service Request Board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Absolute fallback script injection to force Tailwind CSS if the local bundle stalls */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-90">
              👷‍♂️ TradeBoard
            </Link>
            <Link href="/jobs/new" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-200 shadow-sm">
              + Post a Request
            </Link>
          </div>
        </nav>
        
        {/* Main Central Content Area Wrapper */}
        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}